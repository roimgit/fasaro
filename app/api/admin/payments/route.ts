import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { PaymentStatus, SubscriptionTier } from "@prisma/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "ALL";
    const tierParam = searchParams.get("tier") || "ALL";
    const search = searchParams.get("search")?.trim() || "";

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Build filter where clause
    const where: Record<string, unknown> = {};

    if (statusParam !== "ALL") {
      where.paymentStatus = statusParam as PaymentStatus;
    }

    if (tierParam !== "ALL") {
      where.tier = tierParam as SubscriptionTier;
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { invitation: { slug: { contains: search, mode: "insensitive" } } },
        { invitation: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Parallel fetch: filtered transactions & all transactions for analytics
    const [transactions, allTransactions] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          invitation: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 150,
      }),
      prisma.paymentTransaction.findMany({
        select: {
          id: true,
          amount: true,
          paymentStatus: true,
          paymentType: true,
          tier: true,
          createdAt: true,
        },
      }),
    ]);

    // Aggregate Analytics
    let totalAllTimeRevenue = 0;
    let monthlySettledRevenue = 0;
    let settledCount = 0;
    let waitingVerificationCount = 0;
    let pendingCount = 0;
    let expiredOrCancelledCount = 0;

    const tierBreakdown: Record<string, { count: number; totalAmount: number }> = {
      STARTER: { count: 0, totalAmount: 0 },
      ELEGANT: { count: 0, totalAmount: 0 },
      ULTIMATE: { count: 0, totalAmount: 0 },
    };

    const methodBreakdown: Record<string, { count: number; totalAmount: number }> = {
      GATEWAY: { count: 0, totalAmount: 0 },
      MANUAL_QRIS: { count: 0, totalAmount: 0 },
      MANUAL_BANK: { count: 0, totalAmount: 0 },
    };

    for (const tx of allTransactions) {
      const amount = Number(tx.amount || 0);

      // Status counters
      if (tx.paymentStatus === "SETTLEMENT") {
        settledCount += 1;
        totalAllTimeRevenue += amount;
        if (new Date(tx.createdAt) >= startOfMonth) {
          monthlySettledRevenue += amount;
        }

        // Tier Breakdown for settled
        if (tierBreakdown[tx.tier]) {
          tierBreakdown[tx.tier].count += 1;
          tierBreakdown[tx.tier].totalAmount += amount;
        }

        // Payment Method Breakdown for settled
        if (methodBreakdown[tx.paymentType]) {
          methodBreakdown[tx.paymentType].count += 1;
          methodBreakdown[tx.paymentType].totalAmount += amount;
        }
      } else if (tx.paymentStatus === "WAITING_VERIFICATION") {
        waitingVerificationCount += 1;
      } else if (tx.paymentStatus === "PENDING") {
        pendingCount += 1;
      } else {
        expiredOrCancelledCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions.map((tx) => ({
          id: tx.id,
          orderId: tx.orderId,
          amount: Number(tx.amount),
          paymentType: tx.paymentType,
          paymentStatus: tx.paymentStatus,
          tier: tx.tier,
          proofImageUrl: tx.proofImageUrl,
          verifiedAt: tx.verifiedAt,
          verifiedBy: tx.verifiedBy,
          createdAt: tx.createdAt,
          user: tx.user,
          invitation: tx.invitation
            ? {
                id: tx.invitation.id,
                title: tx.invitation.title,
                slug: tx.invitation.slug,
              }
            : null,
        })),
        analytics: {
          totalAllTimeRevenue,
          monthlySettledRevenue,
          totalTransactionsCount: allTransactions.length,
          settledCount,
          waitingVerificationCount,
          pendingCount,
          expiredOrCancelledCount,
          tierBreakdown,
          methodBreakdown,
        },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil data pembayaran";
    const status =
      message.includes("UNAUTHORIZED") || message.includes("FORBIDDEN")
        ? 403
        : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
