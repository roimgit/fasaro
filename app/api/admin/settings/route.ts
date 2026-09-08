import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil pengaturan sistem";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: "Format data settings tidak valid (wajib array)" },
        { status: 400 }
      );
    }

    for (const item of settings) {
      if (item.key && typeof item.value === "string") {
        await prisma.systemSetting.upsert({
          where: { key: item.key },
          update: {
            value: item.value,
            ...(item.description && { description: item.description }),
          },
          create: {
            key: item.key,
            value: item.value,
            description: item.description || null,
          },
        });
      }
    }

    const updatedSettings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Pengaturan sistem berhasil disimpan",
      data: updatedSettings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan pengaturan";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
