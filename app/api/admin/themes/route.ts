import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const themes = await prisma.themeCatalog.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: themes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil katalog tema";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { themeKey, name, category, thumbnail, isPremium, isActive } = body;

    if (!themeKey || !name || !thumbnail) {
      return NextResponse.json(
        { success: false, error: "themeKey, name, dan thumbnail wajib diisi" },
        { status: 400 }
      );
    }

    const newTheme = await prisma.themeCatalog.create({
      data: {
        themeKey: themeKey.toLowerCase().trim(),
        name,
        category: category || "Modern Chic",
        thumbnail,
        isPremium: Boolean(isPremium),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tema baru berhasil ditambahkan",
      data: newTheme,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan tema";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { id, name, category, thumbnail, isPremium, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id tema wajib disertakan" },
        { status: 400 }
      );
    }

    const updated = await prisma.themeCatalog.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(thumbnail && { thumbnail }),
        ...(isPremium !== undefined && { isPremium: Boolean(isPremium) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tema berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui tema";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id tema wajib disertakan" },
        { status: 400 }
      );
    }

    await prisma.themeCatalog.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Tema berhasil dihapus",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus tema";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
