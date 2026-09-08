import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ThemeRenderer from "@/components/templates/ThemeRenderer";
import { WeddingInvitationData } from "@/types/wedding";

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!invitation) {
    return { title: "Undangan Pernikahan | Fasaro" };
  }

  return {
    title: `${invitation.title} | Fasaro Wedding`,
    description: `Undangan Pernikahan Digital Resmi untuk ${invitation.title}`,
  };
}

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export default async function PublicInvitationPage(props: InvitationPageProps) {
  const { slug } = await props.params;
  const { to } = await props.searchParams;

  const invitation = await prisma.invitation.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      eventSchedules: { orderBy: { date: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      bankAccounts: true,
    },
  });

  if (!invitation) {
    notFound();
  }

  const coupleInfo = invitation.coupleInfo as unknown as WeddingInvitationData["coupleInfo"];

  const weddingData: WeddingInvitationData = {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    themeId: invitation.themeId,
    coupleInfo,
    activeUntil: invitation.activeUntil,
    isActive: invitation.isActive,
    eventSchedules: invitation.eventSchedules.map((s) => ({
      id: s.id,
      eventName: s.eventName,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      venueName: s.venueName,
      address: s.address,
      mapsUrl: s.mapsUrl,
      latitude: s.latitude,
      longitude: s.longitude,
    })),
    galleries: invitation.galleries.map((g) => ({
      id: g.id,
      imageUrl: g.imageUrl,
      caption: g.caption,
      sortOrder: g.sortOrder,
    })),
    bankAccounts: invitation.bankAccounts.map((b) => ({
      id: b.id,
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      accountHolder: b.accountHolder,
      qrisImageUrl: b.qrisImageUrl,
    })),
  };

  return <ThemeRenderer data={weddingData} guestName={to} />;
}
