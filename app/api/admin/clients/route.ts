import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SubscriptionTier } from "@prisma/client";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        invitations: {
          select: {
            id: true,
            title: true,
            slug: true,
            themeId: true,
            activeUntil: true,
            isActive: true,
            createdAt: true,
            paymentTransactions: {
              where: { paymentStatus: "SETTLEMENT" },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { tier: true },
            },
          },
        },
      },
    });

    const clients = users.map((u) => {
      const inv = u.invitations[0] || null;
      const latestTier = inv?.paymentTransactions[0]?.tier || SubscriptionTier.STARTER;

      let status = "NO_INVITATION";
      if (inv) {
        if (!inv.isActive) {
          status = "INACTIVE";
        } else if (inv.activeUntil && new Date(inv.activeUntil) < new Date()) {
          status = "EXPIRED";
        } else {
          status = "ACTIVE";
        }
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        invitation: inv
          ? {
              id: inv.id,
              title: inv.title,
              slug: inv.slug,
              themeId: inv.themeId,
              activeUntil: inv.activeUntil,
              isActive: inv.isActive,
              tier: latestTier,
              status,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data klien";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { invitationId, addDays, isActive, tier } = body;

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: "invitationId wajib disertakan" },
        { status: 400 }
      );
    }

    const currentInv = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { activeUntil: true, userId: true },
    });

    if (!currentInv) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: {
      isActive?: boolean;
      activeUntil?: Date;
    } = {};

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (typeof addDays === "number" && addDays !== 0) {
      const baseDate = currentInv.activeUntil && currentInv.activeUntil > new Date()
        ? new Date(currentInv.activeUntil)
        : new Date();
      baseDate.setDate(baseDate.getDate() + addDays);
      updateData.activeUntil = baseDate;
    }

    const updated = await prisma.invitation.update({
      where: { id: invitationId },
      data: updateData,
    });

    // If tier was also updated, record/update transaction
    if (tier && Object.values(SubscriptionTier).includes(tier)) {
      await prisma.paymentTransaction.create({
        data: {
          orderId: `ADMIN-ADJUST-${Date.now()}`,
          userId: currentInv.userId,
          invitationId: invitationId,
          tier: tier as SubscriptionTier,
          amount: tier === "ULTIMATE" ? 279000 : tier === "ELEGANT" ? 149000 : 69000,
          paymentType: "GATEWAY",
          paymentStatus: "SETTLEMENT",
          verifiedBy: "ADMIN_OVERRIDE",
          verifiedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data klien & undangan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui data klien";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
