import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { AUTH_COOKIE_NAME, signJwtToken } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }
    const regSetting = await prisma.systemSetting.findUnique({
      where: { key: "feature_registration" },
    });
    if (regSetting && regSetting.value === "false") {
      return NextResponse.json(
        { error: "Pendaftaran pengguna baru sementara ditutup untuk pemeliharaan sistem." },
        { status: 403 }
      );
    }

    const { name, email, password, plan } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
        invitations: {
          create: {
            slug: `undangan-${Math.random().toString(36).substring(2, 8)}`,
            title: `Pernikahan ${name}`,
            themeId: "minimalist",
            isActive: true,
            coupleInfo: {
              groomName: name,
              groomNickname: name.split(" ")[0] || "Pria",
              groomFather: "",
              groomMother: "",
              groomInstagram: "",
              groomPhoto: "",
              brideName: "Mempelai Wanita",
              brideNickname: "Wanita",
              brideFather: "",
              brideMother: "",
              brideInstagram: "",
              bridePhoto: "",
              greetingMessage:
                "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.",
              stories: [],
              selectedTier: plan || null,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Registrasi berhasil",
        user,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal server",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
