import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getSupabaseAdminClient,
  getPublicStorageUrl,
  SUPABASE_STORAGE_BUCKET,
} from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FOLDERS = new Set(["couples", "qris", "galleries", "proofs"]);

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
    const folderParam = (formData.get("folder") as string) || "couples";
    const folder = ALLOWED_FOLDERS.has(folderParam) ? folderParam : "couples";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar wajib dipilih" },
        { status: 400 }
      );
    }

    const originalExt = path.extname(file.name).toLowerCase();
    const isValidType =
      ALLOWED_IMAGE_MIME_TYPES.has(file.type) ||
      ALLOWED_EXTENSIONS.has(originalExt);

    if (!isValidType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Format gambar tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran gambar terlalu besar. Maksimal 10MB.",
        },
        { status: 400 }
      );
    }

    const cleanBaseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
    const safeExt = originalExt || ".jpg";
    const uniqueFilename = `${folder}-${Date.now()}-${cleanBaseName}${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl: string | null = null;

    // 1. Try Supabase Storage upload
    try {
      const storageKey = `${folder}/${session.userId}/${uniqueFilename}`;
      const supabase = getSupabaseAdminClient();
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(storageKey, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (!uploadError) {
        publicUrl = getPublicStorageUrl(storageKey);
      }
    } catch {
      publicUrl = null;
    }

    // 2. Fallback to local storage if Supabase failed
    if (!publicUrl) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      await fs.mkdir(uploadDir, { recursive: true });
      const localFilePath = path.join(uploadDir, uniqueFilename);
      await fs.writeFile(localFilePath, buffer);
      publicUrl = `/uploads/${folder}/${uniqueFilename}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengunggah gambar";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
