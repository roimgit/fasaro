import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fasaro-jwt-super-secret-key";
export const AUTH_COOKIE_NAME = "fasaro_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(request?: NextRequest): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token && request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return null;
  }

  return verifyJwtToken(token);
}

export async function requireAuth(request?: NextRequest): Promise<TokenPayload> {
  const user = await getSessionUser(request);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(request?: NextRequest): Promise<TokenPayload> {
  const user = await requireAuth(request);
  if (user.role !== UserRole.ADMIN) {
    throw new Error("FORBIDDEN_ADMIN_ONLY");
  }
  return user;
}

