import { NextResponse } from "next/server";
import { isGoogleAuthConfigured } from "@/lib/google-auth";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    configured: isGoogleAuthConfigured(),
  });
}
