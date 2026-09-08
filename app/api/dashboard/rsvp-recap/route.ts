import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const invitation = await prisma.invitation.findFirst({
      where: { userId: user.userId },
      select: { id: true },
    });

    if (!invitation) {
      return NextResponse.json({
        success: true,
        data: {
          totalResponses: 0,
          attendingCount: 0,
          notAttendingCount: 0,
          tentativeCount: 0,
          totalPax: 0,
          rsvps: [],
        },
      });
    }

    const rsvps = await prisma.rsvp.findMany({
      where: { invitationId: invitation.id },
      orderBy: { createdAt: "desc" },
    });

    let attendingCount = 0;
    let notAttendingCount = 0;
    let tentativeCount = 0;
    let totalPax = 0;

    for (const r of rsvps) {
      if (r.status === "ATTENDING") {
        attendingCount += 1;
        totalPax += r.attendeeCount || 1;
      } else if (r.status === "NOT_ATTENDING") {
        notAttendingCount += 1;
      } else {
        tentativeCount += 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalResponses: rsvps.length,
        attendingCount,
        notAttendingCount,
        tentativeCount,
        totalPax,
        rsvps,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil rekap RSVP";
    const status = message.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
