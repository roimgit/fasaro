import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Slug wajib disertakan" }, { status: 400 });
    }

    const cacheKey = `public:invitation:${slug}`;
    const cachedData = await getCache<Record<string, unknown>>(cacheKey);

    if (cachedData) {
      return NextResponse.json(
        { data: cachedData, source: "cache" },
        {
          headers: {
            "X-Cache": "HIT",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
          },
        }
      );
    }

    const invitation = await prisma.invitation.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        themeId: true,
        coupleInfo: true,
        createdAt: true,
        eventSchedules: {
          select: {
            id: true,
            eventName: true,
            date: true,
            startTime: true,
            endTime: true,
            venueName: true,
            address: true,
            mapsUrl: true,
            latitude: true,
            longitude: true,
          },
          orderBy: { date: "asc" },
        },
        galleries: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        bankAccounts: {
          select: {
            id: true,
            bankName: true,
            accountNumber: true,
            accountHolder: true,
            qrisImageUrl: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan atau sedang tidak aktif" },
        { status: 404 }
      );
    }

    // Cache in Redis for 5 minutes (300 seconds)
    await setCache(cacheKey, invitation, 300);

    return NextResponse.json(
      { data: invitation, source: "db" },
      {
        headers: {
          "X-Cache": "MISS",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal mengambil data undangan publik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
