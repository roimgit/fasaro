import { NextRequest, NextResponse } from "next/server";
import {
  isGoogleAuthConfigured,
  generateOAuthState,
  getGoogleOAuthUrl,
} from "@/lib/google-auth";

export const GOOGLE_OAUTH_STATE_COOKIE = "fasaro_oauth_state";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const returnTarget = request.nextUrl.searchParams.get("from") || "/dashboard";

  if (!isGoogleAuthConfigured()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginUrl);
  }

  const state = generateOAuthState();
  const googleAuthUrl = getGoogleOAuthUrl(state, request.url);

  const response = NextResponse.redirect(googleAuthUrl);

  response.cookies.set({
    name: GOOGLE_OAUTH_STATE_COOKIE,
    value: JSON.stringify({ state, returnTarget }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });

  return response;
}
