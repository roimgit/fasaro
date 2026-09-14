import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { generateSignedUploadUrl, getPublicStorageUrl } from "@/lib/supabase";
import { z } from "zod";

const presignedQuerySchema = z.object({
  filename: z.string().min(1, "Filename wajib disertakan"),
  contentType: z
    .string()
    .regex(/^image\/(jpeg|jpg|png|webp|gif)$/, "Tipe file harus berupa gambar"),
  folder: z.enum(["galleries", "couples", "qris", "proofs"]).default("galleries"),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: max 20 uploads per hour (3600 seconds) per user
    const limiter = await rateLimit(session.userId, "upload_presigned", 20, 3600);
    if (!limiter.allowed) {
      return NextResponse.json(
        {
          error: "Batas kuota upload terlampaui (maks 20 upload per jam). Silakan coba lagi nanti.",
          remaining: limiter.remaining,
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") ?? "";
    const contentType = searchParams.get("contentType") ?? "";
    const folder = searchParams.get("folder") ?? "galleries";

    const parsed = presignedQuerySchema.safeParse({ filename, contentType, folder });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Parameter tidak valid",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const cleanFilename = parsed.data.filename
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");

    const key = `${parsed.data.folder}/${session.userId}/${Date.now()}-${cleanFilename}`;
    const { signedUrl, token } = await generateSignedUploadUrl(key, { upsert: true });
    const fileUrl = getPublicStorageUrl(key);

    return NextResponse.json({
      uploadUrl: signedUrl,
      fileUrl,
      key,
      token,
      expiresIn: 300,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal membuat upload URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
