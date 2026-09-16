import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const transactions = await prisma.paymentTransaction.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderId: true,
        tier: true,
        amount: true,
        paymentType: true,
        paymentStatus: true,
        proofImageUrl: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactions: transactions.map((tx) => ({
        id: tx.id,
        orderId: tx.orderId,
        tier: tx.tier,
        amount: Number(tx.amount),
        paymentType: tx.paymentType,
        paymentStatus: tx.paymentStatus,
        proofImageUrl: tx.proofImageUrl,
        verifiedAt: tx.verifiedAt,
        createdAt: tx.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Gagal memuat riwayat pembayaran",
      },
      { status: 500 }
    );
  }
}
