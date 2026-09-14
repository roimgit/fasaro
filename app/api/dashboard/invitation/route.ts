import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  invitationSchema,
  EventScheduleInput,
  GalleryItemInput,
  BankAccountInput,
} from "@/lib/validations";
import { SubscriptionTier } from "@prisma/client";
import { revalidateInvitationCache } from "@/lib/invitation-cache";

export async function GET() {
  try {
    const user = await requireAuth();

    let invitation = await prisma.invitation.findFirst({
      where: { userId: user.userId },
      include: {
        eventSchedules: { orderBy: { date: "asc" } },
        galleries: { orderBy: { sortOrder: "asc" } },
        bankAccounts: true,
        paymentTransactions: {
          where: { paymentStatus: "SETTLEMENT" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { tier: true },
        },
      },
    });

    if (!invitation) {
      // Create initial draft invitation if none exists
      invitation = await prisma.invitation.create({
        data: {
          slug: `undangan-${user.userId.slice(-6)}`,
          title: "Pernikahan Mempelai",
          userId: user.userId,
          themeId: "adirara",
          isActive: true,
          coupleInfo: {
            groomName: "Mempelai Pria",
            groomNickname: "Pria",
            groomFather: "",
            groomMother: "",
            groomInstagram: "",
            groomPhoto: "",
            brideName: "Mempelai Wanita",
            brideNickname: "Wanita",
            brideFather: "",
            brideMother: "",
            brideInstagram: "",
            bridePhoto: "",
            greetingMessage:
              "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.",
            stories: [],
          },
        },
        include: {
          eventSchedules: true,
          galleries: true,
          bankAccounts: true,
          paymentTransactions: true,
        },
      });
    }

    const currentTier = invitation.paymentTransactions?.[0]?.tier || SubscriptionTier.STARTER;

    return NextResponse.json({
      success: true,
      data: {
        ...invitation,
        tier: currentTier,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil data undangan";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Normalize schedules/eventSchedules alias
    const normalizedBody = {
      ...body,
      schedules: body.schedules || body.eventSchedules || [],
    };

    const parseResult = invitationSchema.safeParse(normalizedBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi data gagal",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // Check slug uniqueness if slug changed
    const existingSlug = await prisma.invitation.findFirst({
      where: {
        slug: validData.slug,
        userId: { not: user.userId },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Subdomain / slug tautan ini sudah dipakai pasangan lain." },
        { status: 409 }
      );
    }

    // Find user's invitation
    const userInv = await prisma.invitation.findFirst({
      where: { userId: user.userId },
    });

    if (!userInv) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update in transaction to safely sync relations
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update main invitation
      const inv = await tx.invitation.update({
        where: { id: userInv.id },
        data: {
          title: validData.title,
          slug: validData.slug,
          themeId: validData.themeId,
          coupleInfo: validData.coupleInfo as object,
          isActive: validData.isActive,
        },
      });

      // 2. Replace schedules
      await tx.eventSchedule.deleteMany({ where: { invitationId: userInv.id } });
      if (validData.schedules && validData.schedules.length > 0) {
        await tx.eventSchedule.createMany({
          data: validData.schedules.map((s: EventScheduleInput) => ({
            invitationId: userInv.id,
            eventName: s.eventName,
            date: new Date(s.date),
            startTime: s.startTime,
            endTime: s.endTime || null,
            venueName: s.venueName,
            address: s.address,
            mapsUrl: s.mapsUrl || null,
            latitude: s.latitude || null,
            longitude: s.longitude || null,
          })),
        });
      }

      // 3. Replace galleries
      await tx.gallery.deleteMany({ where: { invitationId: userInv.id } });
      if (validData.galleries && validData.galleries.length > 0) {
        await tx.gallery.createMany({
          data: validData.galleries.map((g: GalleryItemInput, idx: number) => ({
            invitationId: userInv.id,
            imageUrl: g.imageUrl,
            caption: g.caption || null,
            sortOrder: g.sortOrder !== undefined ? g.sortOrder : idx,
          })),
        });
      }

      // 4. Replace bank accounts
      await tx.bankAccount.deleteMany({ where: { invitationId: userInv.id } });
      if (validData.bankAccounts && validData.bankAccounts.length > 0) {
        await tx.bankAccount.createMany({
          data: validData.bankAccounts.map((b: BankAccountInput) => ({
            invitationId: userInv.id,
            bankName: b.bankName,
            accountNumber: b.accountNumber,
            accountHolder: b.accountHolder,
            qrisImageUrl: b.qrisImageUrl || null,
          })),
        });
      }

      return inv;
    });

    // Invalidate caches immediately
    revalidateInvitationCache(updated.slug, updated.id);
    if (userInv.slug !== updated.slug) {
      revalidateInvitationCache(userInv.slug, userInv.id);
    }

    return NextResponse.json({
      success: true,
      message: "Data undangan berhasil disimpan",
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan data undangan";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const userInv = await prisma.invitation.findFirst({
      where: { userId: user.userId },
    });

    if (!userInv) {
      return NextResponse.json({ success: false, error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.themeId && typeof body.themeId === "string") {
      updateData.themeId = body.themeId;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }
    if (body.title && typeof body.title === "string") {
      updateData.title = body.title.trim();
    }
    if (body.slug && typeof body.slug === "string") {
      const cleanSlug = body.slug.toLowerCase().trim();
      const existingSlug = await prisma.invitation.findFirst({
        where: {
          slug: cleanSlug,
          userId: { not: user.userId },
        },
      });
      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: "Subdomain tautan sudah digunakan pasangan lain" },
          { status: 409 }
        );
      }
      updateData.slug = cleanSlug;
    }

    const updated = await prisma.invitation.update({
      where: { id: userInv.id },
      data: updateData,
    });

    // Invalidate caches
    revalidateInvitationCache(updated.slug, updated.id);
    if (userInv.slug !== updated.slug) {
      revalidateInvitationCache(userInv.slug, userInv.id);
    }

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui pengaturan";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

