import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, signJwtToken } from "@/lib/auth";
import { exchangeCodeForTokens, getGoogleUserProfile } from "@/lib/google-auth";
import { GOOGLE_OAUTH_STATE_COOKIE } from "@/app/api/auth/google/route";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const loginRedirect = (errorCode: string, errorDetail?: string) => {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", errorCode);
    if (errorDetail) {
      url.searchParams.set("details", errorDetail);
    }
    const res = NextResponse.redirect(url);
    res.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return res;
  };

  if (errorParam) {
    return loginRedirect("google_access_denied");
  }

  if (!code || !state) {
    return loginRedirect("invalid_oauth_response");
  }

  // Verify OAuth state to prevent CSRF attacks
  const savedStateCookie = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  if (!savedStateCookie) {
    return loginRedirect("session_expired");
  }

  let savedState: string | undefined;
  let returnTarget: string = "/dashboard";

  try {
    const parsed = JSON.parse(savedStateCookie);
    savedState = parsed.state;
    if (parsed.returnTarget && typeof parsed.returnTarget === "string") {
      returnTarget = parsed.returnTarget;
    }
  } catch {
    return loginRedirect("invalid_session_state");
  }

  if (!savedState || savedState !== state) {
    return loginRedirect("csrf_state_mismatch");
  }

  try {
    // 1. Exchange code for Google access token
    const tokenData = await exchangeCodeForTokens(code, request.url);

    // 2. Fetch user profile from Google
    const profile = await getGoogleUserProfile(tokenData.access_token);

    if (!profile.email) {
      return loginRedirect("google_email_missing");
    }

    const email = profile.email.toLowerCase().trim();

    // 3. Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const fallbackPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(fallbackPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          name: profile.name || email.split("@")[0],
          passwordHash,
          role: "USER",
        },
      });
    }

    // 4. Issue standard Fasaro JWT token
    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Determine destination URL
    const destinationUrl = new URL(
      user.role === "ADMIN" && returnTarget === "/dashboard" ? "/admin" : returnTarget,
      request.url
    );

    const response = NextResponse.redirect(destinationUrl);

    // 6. Set auth cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Clean up temporary OAuth state cookie
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);

    return response;
  } catch (err) {
    console.error("[Google OAuth Callback Error]:", err);
    const msg =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat memproses login Google";
    return loginRedirect("google_auth_failed", msg);
  }
}
