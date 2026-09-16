import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File bukti transfer wajib dipilih" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan format JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal ukuran 5MB." },
        { status: 400 }
      );
    }

    // Target directory: public/uploads/proofs
    const uploadDir = path.join(process.cwd(), "public", "uploads", "proofs");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate safe unique filename
    const originalExt = path.extname(file.name).toLowerCase() || ".jpg";
    const cleanBaseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 25);
    const uniqueFilename = `proof-${Date.now()}-${cleanBaseName}${originalExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/proofs/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengunggah bukti pembayaran";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
