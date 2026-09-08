import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function generateSlugCode(name: string): string {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${clean}-${randomSuffix}`;
}

export async function GET() {
  try {
    const user = await requireAuth();

    const invitation = await prisma.invitation.findFirst({
      where: { userId: user.userId },
      select: { id: true, slug: true },
    });

    if (!invitation) {
      return NextResponse.json({ success: true, data: { guests: [], invitationSlug: "" } });
    }

    const guests = await prisma.guest.findMany({
      where: { invitationId: invitation.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        guests,
        invitationSlug: invitation.slug,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil daftar tamu";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const invitation = await prisma.invitation.findFirst({
      where: { userId: user.userId },
      select: { id: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Silakan buat draft undangan terlebih dahulu" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { guests, name, phoneNumber, quota } = body;

    // Single add
    if (name && typeof name === "string") {
      const newGuest = await prisma.guest.create({
        data: {
          invitationId: invitation.id,
          name: name.trim(),
          slugCode: generateSlugCode(name),
          phoneNumber: phoneNumber ? String(phoneNumber).trim() : null,
          quota: quota ? Number(quota) : 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Tamu berhasil ditambahkan",
        data: newGuest,
      });
    }

    // Bulk add
    if (Array.isArray(guests) && guests.length > 0) {
      const created = await Promise.all(
        guests.map(async (g) => {
          if (!g.name) return null;
          return prisma.guest.create({
            data: {
              invitationId: invitation.id,
              name: String(g.name).trim(),
              slugCode: generateSlugCode(String(g.name)),
              phoneNumber: g.phoneNumber ? String(g.phoneNumber).trim() : null,
              quota: g.quota ? Number(g.quota) : 1,
            },
          });
        })
      );

      const validCreated = created.filter(Boolean);
      return NextResponse.json({
        success: true,
        message: `Berhasil menambahkan ${validCreated.length} tamu undangan`,
        data: validCreated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Data tamu tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan tamu";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id tamu wajib disertakan" }, { status: 400 });
    }

    // Verify ownership
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: { invitation: { select: { userId: true } } },
    });

    if (!guest || guest.invitation.userId !== user.userId) {
      return NextResponse.json({ success: false, error: "Tamu tidak ditemukan" }, { status: 404 });
    }

    await prisma.guest.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Tamu berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus tamu";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
