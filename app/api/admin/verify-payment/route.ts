import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const verifyActionSchema = z.object({
  transactionId: z.string().min(1, "ID transaksi wajib diisi"),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().max(250).optional().nullable(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    // Permit access if admin or logged-in user in dev
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "WAITING_VERIFICATION";

    const transactions = await prisma.paymentTransaction.findMany({
      where: {
        paymentStatus: status as "WAITING_VERIFICATION" | "PENDING" | "SETTLEMENT" | "CANCELLED",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        invitation: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: transactions });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengambil daftar verifikasi manual",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = verifyActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi aksi verifikasi gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { transactionId, action } = parsed.data;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { invitation: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Data transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    if (action === "APPROVE") {
      const activeUntil = new Date();
      let durationDesc = "365 hari (1 Tahun)";

      if (transaction.tier === "STARTER") {
        activeUntil.setDate(activeUntil.getDate() + 90);
        durationDesc = "90 hari";
      } else if (transaction.tier === "ULTIMATE") {
        activeUntil.setFullYear(activeUntil.getFullYear() + 100);
        durationDesc = "Lifetime (Selamanya)";
      } else {
        activeUntil.setFullYear(activeUntil.getFullYear() + 1);
        durationDesc = "365 hari (1 Tahun)";
      }

      const updated = await prisma.$transaction(async (tx) => {
        const txUpdated = await tx.paymentTransaction.update({
          where: { id: transactionId },
          data: {
            paymentStatus: "SETTLEMENT",
            verifiedBy: session.email,
            verifiedAt: new Date(),
          },
        });

        if (transaction.invitationId) {
          const inv = await tx.invitation.findUnique({
            where: { id: transaction.invitationId },
          });
          const coupleInfo = (inv?.coupleInfo as Record<string, unknown>) || {};

          await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: {
              isActive: true,
              activeUntil,
              coupleInfo: {
                ...coupleInfo,
                selectedTier: transaction.tier,
              },
            },
          });
        }

        return txUpdated;
      });

      return NextResponse.json({
        message: `Transaksi berhasil disetujui & paket ${transaction.tier} aktif (${durationDesc})`,
        data: updated,
      });
    }

    // Action REJECT
    const updated = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: "CANCELLED",
        verifiedBy: session.email,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Transaksi berhasil ditolak dan dibatalkan",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal memproses verifikasi transaksi",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
