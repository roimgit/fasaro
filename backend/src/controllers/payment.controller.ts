import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { createOrderSchema } from "../utils/validations";
import {
  createSnapTransaction,
  verifyMidtransSignature,
} from "../services/payment.service";

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user!;
    const parsed = createOrderSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Validasi data pembayaran gagal",
        details: parsed.error.format(),
      });
      return;
    }

    const { invitationId, tier, amount, paymentType, proofImageUrl } = parsed.data;

    if (invitationId) {
      const invitation = await prisma.invitation.findFirst({
        where: {
          id: invitationId,
          userId: user.userId,
        },
      });

      if (!invitation) {
        res.status(404).json({ error: "Undangan tidak ditemukan atau bukan milik Anda" });
        return;
      }
    }

    const priceKey = `price_${tier.toLowerCase()}`;
    const priceSetting = await prisma.systemSetting.findUnique({
      where: { key: priceKey },
    });
    const defaultPrices: Record<string, number> = {
      STARTER: 39000,
      ELEGANT: 149000,
      ULTIMATE: 279000,
    };
    const officialPrice = priceSetting
      ? parseInt(priceSetting.value, 10) || defaultPrices[tier]
      : defaultPrices[tier];
    const verifiedAmount = officialPrice > 0 ? officialPrice : amount;

    const orderId = `FSR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (paymentType === "GATEWAY") {
      const midtransFlag = await prisma.systemSetting.findUnique({
        where: { key: "feature_midtrans_payment" },
      });
      if (midtransFlag && midtransFlag.value === "false") {
        res.status(403).json({
          error:
            "Pembayaran otomatis via Midtrans sedang dalam pemeliharaan. Silakan gunakan metode Transfer Bank / QRIS Manual.",
        });
        return;
      }

      const snapData = await createSnapTransaction(orderId, verifiedAmount, {
        first_name: user.email.split("@")[0],
        email: user.email,
      });

      const transaction = await prisma.paymentTransaction.create({
        data: {
          orderId,
          userId: user.userId,
          invitationId: invitationId ?? null,
          tier,
          amount: verifiedAmount,
          paymentType: "GATEWAY",
          paymentStatus: "PENDING",
        },
      });

      res.status(201).json({
        message: "Order Midtrans Snap berhasil dibuat",
        data: {
          transactionId: transaction.id,
          orderId: transaction.orderId,
          snapToken: snapData.token,
          redirectUrl: snapData.redirect_url,
        },
      });
      return;
    }

    // Manual Transfer
    const manualFlag = await prisma.systemSetting.findUnique({
      where: { key: "feature_manual_payment" },
    });
    if (manualFlag && manualFlag.value === "false") {
      res.status(403).json({
        error: "Metode transfer manual sementara ditutup untuk pemeliharaan sistem.",
      });
      return;
    }

    if (!proofImageUrl) {
      res.status(400).json({
        error: "Bukti transfer (proofImageUrl) wajib diunggah untuk metode manual",
      });
      return;
    }

    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId,
        userId: user.userId,
        invitationId: invitationId ?? null,
        tier,
        amount: verifiedAmount,
        paymentType: paymentType === "MANUAL_QRIS" ? "MANUAL_QRIS" : "MANUAL_BANK",
        paymentStatus: "WAITING_VERIFICATION",
        proofImageUrl,
      },
    });

    res.status(201).json({
      message: "Pesanan manual berhasil dibuat, menunggu verifikasi admin",
      data: {
        transactionId: transaction.id,
        orderId: transaction.orderId,
        paymentStatus: transaction.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function midtransWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = req.body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      res.status(400).json({ error: "Payload webhook Midtrans tidak lengkap" });
      return;
    }

    const isDev = process.env.MIDTRANS_IS_PRODUCTION !== "true";
    const isMock =
      process.env.MIDTRANS_SERVER_KEY?.includes("YOUR_SANDBOX") ||
      (isDev && signature_key === "dev_mock_signature");
    const isSignatureValid =
      isMock ||
      verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);

    if (!isSignatureValid) {
      res.status(403).json({ error: "Signature key tidak valid" });
      return;
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { orderId: order_id },
      include: { invitation: true },
    });

    if (!transaction) {
      res.status(404).json({ error: `Transaksi dengan orderId ${order_id} tidak ditemukan` });
      return;
    }

    const isSettled =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (isSettled) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      await prisma.$transaction(async (tx) => {
        await tx.paymentTransaction.update({
          where: { orderId: order_id },
          data: {
            paymentStatus: "SETTLEMENT",
            verifiedAt: new Date(),
            verifiedBy: "MIDTRANS_WEBHOOK",
          },
        });

        if (transaction.invitationId) {
          await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: {
              isActive: true,
              activeUntil: oneYearFromNow,
            },
          });
        }
      });

      res.json({
        message: "Status transaksi berhasil diperbarui ke SETTLEMENT dan undangan diaktifkan",
      });
      return;
    }

    if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await prisma.paymentTransaction.update({
        where: { orderId: order_id },
        data: {
          paymentStatus: transaction_status === "expire" ? "EXPIRED" : "CANCELLED",
        },
      });

      res.json({
        message: `Status transaksi berhasil diperbarui ke ${transaction_status}`,
      });
      return;
    }

    res.json({ message: "Notifikasi diterima tanpa perubahan status" });
  } catch (error) {
    next(error);
  }
}
