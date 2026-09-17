import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { UserRole } from "@prisma/client";

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
            isActive: true,
            coupleInfo: true,
          },
          take: 1,
        },
      },
    });

    const formatted = users.map((u) => {
      const inv = u.invitations[0] || null;
      const coupleInfo = (inv?.coupleInfo as Record<string, unknown>) || {};
      const selectedTier = (coupleInfo.selectedTier as string) || null;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        invitation: inv
          ? {
              id: inv.id,
              title: inv.title,
              slug: inv.slug,
              isActive: inv.isActive,
              tier: selectedTier || "STARTER",
            }
          : null,
      };
    });

    // Sort: Master Admin at the very top (Root Super Admin first, then newest Admins), followed by regular users (newest first)
    formatted.sort((a, b) => {
      if (a.email === "admin@admin.com") return -1;
      if (b.email === "admin@admin.com") return 1;

      if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
      if (b.role === "ADMIN" && a.role !== "ADMIN") return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data hak akses pengguna";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "userId dan role wajib disertakan" },
        { status: 400 }
      );
    }

    if (role !== "ADMIN" && role !== "USER") {
      return NextResponse.json(
        { success: false, error: "Nilai role harus berupa 'ADMIN' atau 'USER'" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Root Admin Protection: cannot demote admin@admin.com
    if (targetUser.email === "admin@admin.com" && role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Akun Super Admin utama (admin@admin.com) dilindungi dan tidak dapat diubah hak aksesnya.",
        },
        { status: 403 }
      );
    }

    // Prevent demoting self if the user is the only admin
    if (targetUser.id === session.userId && role !== "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN },
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Tidak dapat menurunkan hak akses akun sendiri karena Anda adalah satu-satunya Admin yang aktif di sistem.",
          },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Hak akses pengguna ${updatedUser.name} (${updatedUser.email}) berhasil diubah menjadi ${role}.`,
      data: updatedUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui hak akses pengguna";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
