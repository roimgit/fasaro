import { NextRequest, NextResponse } from "next/server";
import { getCachedPublicInvitation } from "@/lib/invitation-cache";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Slug wajib disertakan" }, { status: 400 });
    }

    const invitation = await getCachedPublicInvitation(slug);

    if (!invitation) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan atau sedang tidak aktif" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: invitation },
      {
        headers: {
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
