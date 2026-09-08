import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { invitationSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId: session.userId },
      include: {
        eventSchedules: { orderBy: { date: "asc" } },
        galleries: { orderBy: { sortOrder: "asc" } },
        bankAccounts: true,
        _count: {
          select: {
            guests: true,
            rsvps: true,
            wishes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: invitations });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengambil daftar undangan",
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
    const parsed = invitationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      themeId,
      coupleInfo,
      activeUntil,
      isActive,
      schedules,
      galleries,
      bankAccounts,
    } = parsed.data;

    const existingSlug = await prisma.invitation.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug sudah digunakan, silakan pilih slug lain" },
        { status: 409 }
      );
    }

    const invitation = await prisma.invitation.create({
      data: {
        userId: session.userId,
        title,
        slug,
        themeId,
        coupleInfo: coupleInfo as Prisma.InputJsonValue,
        activeUntil: activeUntil ? new Date(activeUntil) : null,
        isActive,
        eventSchedules: {
          create: schedules.map((schedule) => ({
            eventName: schedule.eventName,
            date: new Date(schedule.date),
            startTime: schedule.startTime,
            endTime: schedule.endTime ?? null,
            venueName: schedule.venueName,
            address: schedule.address,
            mapsUrl: schedule.mapsUrl || null,
            latitude: schedule.latitude ?? null,
            longitude: schedule.longitude ?? null,
          })),
        },
        galleries: {
          create: galleries.map((gallery) => ({
            imageUrl: gallery.imageUrl,
            caption: gallery.caption ?? null,
            sortOrder: gallery.sortOrder,
          })),
        },
        bankAccounts: {
          create: bankAccounts.map((account) => ({
            bankName: account.bankName,
            accountNumber: account.accountNumber,
            accountHolder: account.accountHolder,
            qrisImageUrl: account.qrisImageUrl || null,
          })),
        },
      },
      include: {
        eventSchedules: true,
        galleries: true,
        bankAccounts: true,
      },
    });

    return NextResponse.json(
      {
        message: "Undangan berhasil dibuat",
        data: invitation,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal membuat undangan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
