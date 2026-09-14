import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { revalidateInvitationCache } from "@/lib/invitation-cache";
import { updateInvitationSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const invitation = await prisma.invitation.findFirst({
      where: {
        id,
        userId: session.userId,
      },
      include: {
        eventSchedules: { orderBy: { date: "asc" } },
        galleries: { orderBy: { sortOrder: "asc" } },
        bankAccounts: true,
        guests: true,
        rsvps: { orderBy: { createdAt: "desc" } },
        wishes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: invitation });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengambil detail undangan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.invitation.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updateInvitationSchema.safeParse(body);

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

    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.invitation.findUnique({
        where: { slug },
      });
      if (slugTaken) {
        return NextResponse.json(
          { error: "Slug sudah digunakan oleh undangan lain" },
          { status: 409 }
        );
      }
    }

    const mergedCoupleInfo = coupleInfo
      ? {
          ...(existing.coupleInfo as Record<string, unknown>),
          ...coupleInfo,
        }
      : existing.coupleInfo;

    const updated = await prisma.$transaction(async (tx) => {
      if (schedules) {
        await tx.eventSchedule.deleteMany({ where: { invitationId: id } });
        await tx.eventSchedule.createMany({
          data: schedules.map((schedule) => ({
            invitationId: id,
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
        });
      }

      if (galleries) {
        await tx.gallery.deleteMany({ where: { invitationId: id } });
        await tx.gallery.createMany({
          data: galleries.map((gallery) => ({
            invitationId: id,
            imageUrl: gallery.imageUrl,
            caption: gallery.caption ?? null,
            sortOrder: gallery.sortOrder,
          })),
        });
      }

      if (bankAccounts) {
        await tx.bankAccount.deleteMany({ where: { invitationId: id } });
        await tx.bankAccount.createMany({
          data: bankAccounts.map((account) => ({
            invitationId: id,
            bankName: account.bankName,
            accountNumber: account.accountNumber,
            accountHolder: account.accountHolder,
            qrisImageUrl: account.qrisImageUrl || null,
          })),
        });
      }

      return tx.invitation.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug }),
          ...(themeId !== undefined && { themeId }),
          ...(coupleInfo !== undefined && {
            coupleInfo: mergedCoupleInfo as Prisma.InputJsonValue,
          }),
          ...(activeUntil !== undefined && {
            activeUntil: activeUntil ? new Date(activeUntil) : null,
          }),
          ...(isActive !== undefined && { isActive }),
        },
        include: {
          eventSchedules: true,
          galleries: true,
          bankAccounts: true,
        },
      });
    });

    // Invalidate Next.js cache for instantaneous updates
    revalidateInvitationCache(updated.slug, updated.id);
    if (existing.slug !== updated.slug) {
      revalidateInvitationCache(existing.slug, existing.id);
    }

    return NextResponse.json({
      message: "Undangan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal memperbarui undangan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
