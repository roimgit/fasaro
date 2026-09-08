import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, signJwtToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "targetUserId wajib disertakan" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Sign JWT as the target client user
    const token = signJwtToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: `Berhasil login sebagai ${targetUser.name}`,
      redirectUrl: "/dashboard",
    });

    // Set cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal impersonasi login";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
