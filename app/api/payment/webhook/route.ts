import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyMidtransSignature } from "@/lib/payment";

interface MidtransWebhookBody {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as MidtransWebhookBody;
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { error: "Payload webhook Midtrans tidak lengkap" },
        { status: 400 }
      );
    }

    // Verify SHA512 signature key (bypass in dev if test signature or test server key)
    const isDev = process.env.MIDTRANS_IS_PRODUCTION !== "true";
    const isMock =
      process.env.MIDTRANS_SERVER_KEY?.includes("YOUR_SANDBOX") ||
      (isDev && signature_key === "dev_mock_signature");
    const isSignatureValid =
      isMock ||
      verifyMidtransSignature(
        order_id,
        status_code,
        gross_amount,
        signature_key
      );

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Signature key tidak valid" },
        { status: 403 }
      );
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { orderId: order_id },
      include: { invitation: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: `Transaksi dengan orderId ${order_id} tidak ditemukan` },
        { status: 404 }
      );
    }

    // Determine status settlement
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

      return NextResponse.json({
        message: "Status transaksi berhasil diperbarui ke SETTLEMENT dan undangan diaktifkan",
      });
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

      return NextResponse.json({
        message: `Status transaksi berhasil diperbarui ke ${transaction_status}`,
      });
    }

    return NextResponse.json({ message: "Notifikasi diterima tanpa perubahan status" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal memproses webhook Midtrans",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
