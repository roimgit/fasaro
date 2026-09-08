import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { rsvpSchema } from "@/lib/validations";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: max 5 requests per 5 minutes (300 seconds) per IP
    const limiter = await rateLimit(ip, "submit_rsvp", 5, 300);
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan konfirmasi kehadiran. Silakan tunggu beberapa menit.",
          remaining: limiter.remaining,
        },
        { status: 429 }
      );
    }
    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { invitationId, guestName, status, attendeeCount, sessionChosen } = parsed.data;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { id: true, isActive: true },
    });

    if (!invitation || !invitation.isActive) {
      return NextResponse.json(
        { error: "Undangan tidak valid atau sudah nonaktif" },
        { status: 404 }
      );
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId,
        guestName,
        status,
        attendeeCount,
        sessionChosen: sessionChosen ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Konfirmasi kehadiran berhasil dikirim",
        data: rsvp,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengirim konfirmasi kehadiran",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
