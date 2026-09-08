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
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

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
          await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: {
              isActive: true,
              activeUntil: oneYearFromNow,
            },
          });
        }

        return txUpdated;
      });

      return NextResponse.json({
        message: "Transaksi berhasil disetujui & masa aktif undangan diaktifkan selama 365 hari",
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
