import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "cms";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar wajib diunggah" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    // Sanitize folder name
    const sanitizedFolder = folder.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "cms";

    // Target directory: public/uploads/{folder}
    const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate safe unique filename
    const originalExt = path.extname(file.name).toLowerCase() || ".jpg";
    const cleanBaseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}-${cleanBaseName}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${sanitizedFolder}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      sizeBytes: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengunggah file";
    const status = message.includes("UNAUTHORIZED") || message.includes("ADMIN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
