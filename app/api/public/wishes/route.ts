import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { wishSchema } from "@/lib/validations";
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

const INITIAL_DEMO_WISHES = [
  {
    id: "demo-w-1",
    senderName: "Budi & Ani Santoso",
    message: "Barakallahu lakum wa baraka alaikum. Selamat menempuh hidup baru untuk kedua mempelai!",
    reaction: "💖",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "demo-w-2",
    senderName: "Keluarga Besar Bpk. Hendra",
    message: "Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah. Bahagia selalu selamanya.",
    reaction: "🤲",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "demo-w-3",
    senderName: "Dinda & Sahabat Kampus",
    message: "Selamat yaa! Senang sekali melihat kalian berdua bersanding di pelaminan. Lancar sampai hari H!",
    reaction: "🎉",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

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

    // Fast cached lookup for invitation
    const invitation = await getInvitationMeta(invitationId);

    if (invitation) {
      const [wishes, totalCount] = await Promise.all([
        prisma.wish.findMany({
          where: {
            invitationId: invitation.id,
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
            invitationId: invitation.id,
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
    }

    // Fallback for demo preview
    return NextResponse.json({
      data: INITIAL_DEMO_WISHES,
      pagination: {
        page: 1,
        limit: 20,
        totalCount: INITIAL_DEMO_WISHES.length,
        totalPages: 1,
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

    // Rate limit: max 10 wishes per minute per IP
    const limiter = await rateLimit(ip, "submit_wish", 10, 60);
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

    // XSS Sanitization
    const sanitizedSender = sanitizeHtml(senderName, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    // Fast cached lookup for invitation
    const invitation = await getInvitationMeta(invitationId);

    if (invitation && invitation.isActive) {
      const wish = await prisma.wish.create({
        data: {
          invitationId: invitation.id,
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
    }

    // Demo / preview mode support
    const isDemo =
      invitationId.startsWith("demo-") ||
      KNOWN_DEMO_SLUGS.some((s) => invitationId.toLowerCase().includes(s));

    if (isDemo) {
      const mockWish = {
        id: `demo-w-${Date.now()}`,
        senderName: sanitizedSender,
        message: sanitizedMessage,
        reaction: reaction ?? "💖",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(
        {
          message: "Ucapan doa berhasil dikirim",
          data: mockWish,
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
        error: "Gagal mengirim ucapan doa",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
