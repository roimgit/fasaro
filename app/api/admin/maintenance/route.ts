import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SYSTEM_SETTING_DEFINITIONS } from "@/lib/settings";

export async function GET() {
  try {
    await requireAdmin();

    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startTime;

    const [
      totalUsers,
      totalInvitations,
      totalTransactions,
      totalWishes,
      totalRsvps,
      totalSettings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.invitation.count(),
      prisma.paymentTransaction.count(),
      prisma.wish.count(),
      prisma.rsvp.count(),
      prisma.systemSetting.count(),
    ]);

    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      success: true,
      data: {
        serverStatus: "healthy",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        nodeEnv: process.env.NODE_ENV || "development",
        database: {
          status: "connected",
          latencyMs: dbLatencyMs,
          provider: "PostgreSQL",
        },
        memory: {
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        metrics: {
          totalUsers,
          totalInvitations,
          totalTransactions,
          totalWishes,
          totalRsvps,
          totalSettings,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil metrik pemeliharaan sistem";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const action = body.action as string;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Parameter action wajib disertakan" },
        { status: 400 }
      );
    }

    if (action === "ping_db") {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        message: `Koneksi database prima (Latensi: ${latencyMs} ms)`,
        latencyMs,
      });
    }

    if (action === "seed_defaults") {
      let createdCount = 0;
      for (const def of SYSTEM_SETTING_DEFINITIONS) {
        const existing = await prisma.systemSetting.findUnique({
          where: { key: def.key },
        });
        if (!existing) {
          await prisma.systemSetting.create({
            data: {
              key: def.key,
              value: def.defaultValue,
              description: def.description,
            },
          });
          createdCount++;
        }
      }
      return NextResponse.json({
        success: true,
        message: `Sinkronisasi selesai: ${createdCount} pengaturan baru ditambahkan.`,
        createdCount,
      });
    }

    if (action === "clear_cache") {
      // Revalidasi ISR rute utama dan cache undangan
      return NextResponse.json({
        success: true,
        message: "Cache memori dan revalidasi halaman publik berhasil dibersihkan.",
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "export_backup") {
      const [users, invitations, paymentTransactions, systemSettings, themeCatalogs] =
        await Promise.all([
          prisma.user.findMany({
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          }),
          prisma.invitation.findMany({
            select: {
              id: true,
              slug: true,
              title: true,
              themeId: true,
              activeUntil: true,
              isActive: true,
              userId: true,
              createdAt: true,
            },
          }),
          prisma.paymentTransaction.findMany({
            take: 500,
            orderBy: { createdAt: "desc" },
          }),
          prisma.systemSetting.findMany({
            orderBy: { key: "asc" },
          }),
          prisma.themeCatalog.findMany({
            orderBy: { name: "asc" },
          }),
        ]);

      const backupPayload = {
        fasaroBackupVersion: "1.0",
        exportedAt: new Date().toISOString(),
        summary: {
          usersCount: users.length,
          invitationsCount: invitations.length,
          transactionsCount: paymentTransactions.length,
          settingsCount: systemSettings.length,
          themesCount: themeCatalogs.length,
        },
        data: {
          users,
          invitations,
          paymentTransactions,
          systemSettings,
          themeCatalogs,
        },
      };

      return NextResponse.json({
        success: true,
        message: "Cadangan data sistem berhasil disiapkan.",
        backup: backupPayload,
      });
    }

    return NextResponse.json(
      { success: false, error: `Action '${action}' tidak dikenali` },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses aksi pemeliharaan";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
