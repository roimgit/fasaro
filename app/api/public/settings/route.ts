import { NextResponse } from "next/server";
import { getPublicSettingsMap } from "@/lib/settings";

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getPublicSettingsMap();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat pengaturan publik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
