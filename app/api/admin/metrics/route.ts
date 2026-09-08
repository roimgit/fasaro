import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalActiveInvitations,
      pendingPaymentsCount,
      monthlySettlements,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.invitation.count({ where: { isActive: true } }),
      prisma.paymentTransaction.count({ where: { paymentStatus: "WAITING_VERIFICATION" } }),
      prisma.paymentTransaction.findMany({
        where: {
          paymentStatus: "SETTLEMENT",
          createdAt: { gte: startOfMonth },
        },
        select: { amount: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          invitations: {
            take: 1,
            select: { title: true, slug: true, isActive: true },
          },
        },
      }),
    ]);

    const monthlyRevenue = monthlySettlements.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalActiveInvitations,
        pendingPaymentsCount,
        monthlyRevenue,
        recentUsers,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data metrik";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
