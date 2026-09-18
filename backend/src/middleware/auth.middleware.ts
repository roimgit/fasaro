import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AUTH_COOKIE_NAME, JWT_SECRET } from "../config/constants";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
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

export function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);
  if (token) {
    const payload = verifyJwtToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Sesi login Anda telah berakhir. Silakan masuk kembali." });
    return;
  }

  const payload = verifyJwtToken(token);
  if (!payload) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Token otentikasi tidak valid atau telah kedaluwarsa." });
    return;
  }

  req.user = payload;
  next();
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  authMiddleware(req, res, () => {
    if (req.user?.role !== UserRole.ADMIN) {
      res.status(403).json({ error: "FORBIDDEN_ADMIN_ONLY", message: "Akses ditolak. Fitur ini khusus untuk Administrator." });
      return;
    }
    next();
  });
}
