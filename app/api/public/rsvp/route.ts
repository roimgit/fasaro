import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { rsvpSchema } from "@/lib/validations";
import { getInvitationMeta } from "@/lib/invitation-cache";

const KNOWN_DEMO_SLUGS = [
  "rian-sinta",
  "faisal-putri",
  "adirara",
  "royal",
  "syari",
  "rustic",
  "minimalist",
  "minang",
  "showcase",
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: max 10 requests per 5 minutes per IP
    const limiter = await rateLimit(ip, "submit_rsvp", 10, 300);
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

    // Fast cached lookup for invitation
    const invitation = await getInvitationMeta(invitationId);

    if (invitation && invitation.isActive) {
      const rsvp = await prisma.rsvp.create({
        data: {
          invitationId: invitation.id,
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
    }

    // Demo / preview mode support
    const isDemo =
      invitationId.startsWith("demo-") ||
      KNOWN_DEMO_SLUGS.some((s) => invitationId.toLowerCase().includes(s));

    if (isDemo) {
      return NextResponse.json(
        {
          message: "Konfirmasi kehadiran berhasil dikirim",
          data: {
            id: `demo-rsvp-${Date.now()}`,
            invitationId,
            guestName,
            status,
            attendeeCount,
            sessionChosen: sessionChosen ?? null,
            createdAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Undangan tidak valid atau sudah nonaktif" },
      { status: 404 }
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
