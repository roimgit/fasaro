import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { wishSchema } from "@/lib/validations";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitationId");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
    const skip = (page - 1) * limit;

    if (!invitationId) {
      return NextResponse.json(
        { error: "Parameter invitationId wajib disertakan" },
        { status: 400 }
      );
    }

    const [wishes, totalCount] = await Promise.all([
      prisma.wish.findMany({
        where: {
          invitationId,
          isHidden: false,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          senderName: true,
          message: true,
          reaction: true,
          createdAt: true,
        },
      }),
      prisma.wish.count({
        where: {
          invitationId,
          isHidden: false,
        },
      }),
    ]);

    return NextResponse.json({
      data: wishes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengambil daftar ucapan doa",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Rate limit: max 3 wishes per minute per IP
    const limiter = await rateLimit(ip, "submit_wish", 3, 60);
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mengirim ucapan lagi.",
          remaining: limiter.remaining,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = wishSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { invitationId, senderName, message, reaction } = parsed.data;

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

    // XSS Sanitization
    const sanitizedSender = sanitizeHtml(senderName, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const wish = await prisma.wish.create({
      data: {
        invitationId,
        senderName: sanitizedSender,
        message: sanitizedMessage,
        reaction: reaction ?? null,
      },
      select: {
        id: true,
        senderName: true,
        message: true,
        reaction: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Ucapan doa berhasil dikirim",
        data: wish,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengirim ucapan doa",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
