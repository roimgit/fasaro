import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getSupabaseAdminClient,
  getPublicStorageUrl,
  SUPABASE_STORAGE_BUCKET,
} from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

const ALLOWED_AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/aac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/webm",
]);

const ALLOWED_EXTENSIONS = new Set([".mp3", ".m4a", ".wav", ".ogg", ".aac"]);
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File audio wajib dipilih" },
        { status: 400 }
      );
    }

    const originalExt = path.extname(file.name).toLowerCase();
    const isValidType =
      ALLOWED_AUDIO_MIME_TYPES.has(file.type) ||
      ALLOWED_EXTENSIONS.has(originalExt);

    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Format audio tidak didukung. Harap gunakan format MP3, M4A, WAV, atau OGG.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran audio terlalu besar. Maksimal ukuran 15MB.",
        },
        { status: 400 }
      );
    }

    const cleanBaseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    const safeExt = originalExt || ".mp3";
    const uniqueFilename = `music-${Date.now()}-${cleanBaseName}${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl: string | null = null;

    // 1. Try uploading to Supabase Storage
    try {
      const storageKey = `music/${session.userId}/${uniqueFilename}`;
      const supabase = getSupabaseAdminClient();
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(storageKey, buffer, {
          contentType: file.type || "audio/mpeg",
          upsert: true,
        });

      if (!uploadError) {
        publicUrl = getPublicStorageUrl(storageKey);
      }
    } catch {
      // Fallback to local storage if Supabase upload fails or is unreachable
      publicUrl = null;
    }

    // 2. Fallback to local filesystem if Supabase was unsuccessful
    if (!publicUrl) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "music");
      await fs.mkdir(uploadDir, { recursive: true });
      const localFilePath = path.join(uploadDir, uniqueFilename);
      await fs.writeFile(localFilePath, buffer);
      publicUrl = `/uploads/music/${uniqueFilename}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengunggah file musik";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
