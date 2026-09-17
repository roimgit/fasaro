import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";
import { createSnapTransaction } from "@/lib/payment";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi data pembayaran gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { invitationId, tier, amount, paymentType, proofImageUrl } = parsed.data;

    // Validate invitation belongs to user if provided
    if (invitationId) {
      const invitation = await prisma.invitation.findFirst({
        where: {
          id: invitationId,
          userId: session.userId,
        },
      });

      if (!invitation) {
        return NextResponse.json(
          { error: "Undangan tidak ditemukan atau bukan milik Anda" },
          { status: 404 }
        );
      }
    }

    // Validate & enforce amount against official configured tier price to prevent client tampering
    const priceKey = `price_${tier.toLowerCase()}`;
    const priceSetting = await prisma.systemSetting.findUnique({
      where: { key: priceKey },
    });
    const defaultPrices: Record<string, number> = {
      STARTER: 39000,
      ELEGANT: 149000,
      ULTIMATE: 279000,
    };
    const officialPrice = priceSetting ? parseInt(priceSetting.value, 10) || defaultPrices[tier] : defaultPrices[tier];
    const verifiedAmount = officialPrice > 0 ? officialPrice : amount;

    const orderId = `FSR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. If Automatic Gateway (Midtrans Snap)
    if (paymentType === "GATEWAY") {
      const midtransFlag = await prisma.systemSetting.findUnique({
        where: { key: "feature_midtrans_payment" },
      });
      if (midtransFlag && midtransFlag.value === "false") {
        return NextResponse.json(
          { error: "Pembayaran otomatis via Midtrans sedang dalam pemeliharaan. Silakan gunakan metode Transfer Bank / QRIS Manual." },
          { status: 403 }
        );
      }

      const snapData = await createSnapTransaction(orderId, verifiedAmount, {
        first_name: session.email.split("@")[0],
        email: session.email,
      });

      const transaction = await prisma.paymentTransaction.create({
        data: {
          orderId,
          userId: session.userId,
          invitationId: invitationId ?? null,
          tier,
          amount: verifiedAmount,
          paymentType: "GATEWAY",
          paymentStatus: "PENDING",
        },
      });

      return NextResponse.json(
        {
          message: "Order Midtrans Snap berhasil dibuat",
          data: {
            transactionId: transaction.id,
            orderId: transaction.orderId,
            snapToken: snapData.token,
            redirectUrl: snapData.redirect_url,
          },
        },
        { status: 201 }
      );
    }

    // 2. If Manual Transfer (QRIS / Bank)
    const manualFlag = await prisma.systemSetting.findUnique({
      where: { key: "feature_manual_payment" },
    });
    if (manualFlag && manualFlag.value === "false") {
      return NextResponse.json(
        { error: "Metode transfer manual sementara ditutup untuk pemeliharaan sistem." },
        { status: 403 }
      );
    }

    if (!proofImageUrl) {
      return NextResponse.json(
        { error: "Bukti transfer (proofImageUrl) wajib diunggah untuk metode manual" },
        { status: 400 }
      );
    }

    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId,
        userId: session.userId,
        invitationId: invitationId ?? null,
        tier,
        amount: verifiedAmount,
        paymentType: paymentType === "MANUAL_QRIS" ? "MANUAL_QRIS" : "MANUAL_BANK",
        paymentStatus: "WAITING_VERIFICATION",
        proofImageUrl,
      },
    });

    return NextResponse.json(
      {
        message: "Pesanan manual berhasil dibuat, menunggu verifikasi admin",
        data: {
          transactionId: transaction.id,
          orderId: transaction.orderId,
          paymentStatus: transaction.paymentStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal membuat pesanan pembayaran",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
