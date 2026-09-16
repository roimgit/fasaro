import { notFound } from "next/navigation";
import { Metadata } from "next";
import ThemeRenderer from "@/components/templates/ThemeRenderer";
import { WeddingInvitationData, ThemeId } from "@/types/wedding";

export const revalidate = 60;

function getDemoWeddingData(slug: string): WeddingInvitationData | null {
  // Determine theme from slug
  let themeId: string = "minang";
  let title = "Baralek Gadang Faisal & Putri";
  let groomName = "Faisal Bagindo Sutan, S.T";
  let groomNickname = "Faisal";
  let brideName = "Putri Rahmayani, S.Pd";
  let brideNickname = "Putri";
  let venueName = "Balai Pertemuan Nan Gadang, Padang";
  let address = "Jl. Khatib Sulaiman No. 50, Padang, Sumatera Barat";

  if (slug.includes("minang") || slug === "faisal-putri") {
    themeId = "minang";
    title = "Baralek Gadang Faisal & Putri";
    groomName = "Faisal Bagindo Sutan, S.T";
    groomNickname = "Faisal";
    brideName = "Putri Rahmayani, S.Pd";
    brideNickname = "Putri";
  } else if (slug.includes("adirara")) {
    themeId = "adirara";
    title = "Pernikahan Adi & Rara";
    groomName = "Adi Nugroho";
    groomNickname = "Adi";
    brideName = "Rara Ayu";
    brideNickname = "Rara";
    venueName = "Aula Masjid ABRI, Cimahi";
    address = "Jl. Gatot Subroto No. 45, Cimahi";
  } else if (slug.includes("royal")) {
    themeId = "royal";
    title = "Royal Wedding Rian & Sinta";
    groomName = "Rian Pratama, S.Kom";
    groomNickname = "Rian";
    brideName = "Sinta Anggraini, S.E";
    brideNickname = "Sinta";
    venueName = "Grand Ballroom Hotel Sahid, Surabaya";
    address = "Jl. Kusuma Bangsa No. 88, Surabaya";
  } else if (slug.includes("syari") || slug === "reza-farida") {
    themeId = "syari";
    title = "Walimatul Ursy Reza & Farida";
    groomName = "Reza Al-Fatih, Lc";
    groomNickname = "Reza";
    brideName = "Farida Nurul Hidayah";
    brideNickname = "Farida";
    venueName = "Masjid Raya Pondok Indah, Jakarta";
    address = "Jl. Lestari Indah No. 1, Jakarta Selatan";
  } else if (slug.includes("rustic")) {
    themeId = "rustic";
    title = "Pernikahan Dimas & Nadia";
    groomName = "Dimas Wicaksono";
    groomNickname = "Dimas";
    brideName = "Nadia Safitri";
    brideNickname = "Nadia";
    venueName = "Pine Forest Camp, Lembang";
    address = "Jl. Maribaya No. 120, Bandung Barat";
  } else if (slug.includes("minimalist")) {
    themeId = "minimalist";
    title = "The Wedding of Kevin & Cindy";
    groomName = "Kevin Jonathan";
    groomNickname = "Kevin";
    brideName = "Cindy Claudia";
    brideNickname = "Cindy";
    venueName = "Glass House Sentul, Bogor";
    address = "Jl. Raya Sentul Highland No. 9, Bogor";
  } else if (slug.startsWith("demo-") || slug === "rian-sinta") {
    themeId = "adirara";
    title = "Pernikahan Rian & Sinta";
    groomName = "Rian Pratama";
    groomNickname = "Rian";
    brideName = "Sinta Anggraini";
    brideNickname = "Sinta";
  } else {
    return null;
  }

  return {
    id: `demo-${slug}`,
    slug,
    title,
    themeId,
    isActive: true,
    coupleInfo: {
      groomName,
      groomNickname,
      groomFather: "Bpk. Bambang Wijaya",
      groomMother: "Ibu Sri Wahyuni",
      groomInstagram: "mempelai.pria",
      groomPhoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      brideName,
      brideNickname,
      brideFather: "Bpk. Herman Santoso",
      brideMother: "Ibu Dewi Lestari",
      brideInstagram: "mempelai.wanita",
      bridePhoto:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      greetingMessage:
        "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami mengundang Anda untuk merayakan hari bahagia pernikahan kami.",
      stories: [
        {
          date: "14 Juli 2024",
          title: "Pertemuan & Lamaran Resmi",
          story: "Dipertemukan dalam suasana hangat, menjalin komitmen suci di hadapan keluarga besar kedua belah pihak.",
        },
        {
          date: "20 Oktober 2026",
          title: "Malam Tradisi & Doa Restu",
          story: "Malam permohonan doa restu dan pembersihan diri bersama keluarga terdekat menjelang hari suci ijab kabul.",
        },
        {
          date: "24 Oktober 2026",
          title: "Hari Bersejarah Akad & Pesta",
          story: "Mengikat janji suci pernikahan untuk melangkah bersama menuju masa depan sakinah mawaddah warahmah.",
        },
      ],
    },
    eventSchedules: [
      {
        id: "ev-1",
        eventName: themeId === "minang" ? "Akad Nikah & Pasambahan Adat" : "Akad Nikah",
        date: "2026-10-24T08:30:00.000Z",
        startTime: "08:30",
        endTime: "10:30",
        venueName: themeId === "minang" ? "Masjid Raya Sumatera Barat" : venueName,
        address: themeId === "minang" ? "Jl. Khatib Sulaiman, Padang" : address,
        mapsUrl: "https://maps.google.com",
      },
      {
        id: "ev-2",
        eventName: themeId === "minang" ? "Baralek Gadang (Resepsi Adat)" : "Resepsi Pernikahan",
        date: "2026-10-24T11:00:00.000Z",
        startTime: "11:00",
        endTime: "14:00",
        venueName,
        address,
        mapsUrl: "https://maps.google.com",
      },
    ],
    galleries: [
      {
        id: "gal-1",
        imageUrl:
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        caption: "Momen Bahagia 1",
        sortOrder: 0,
      },
      {
        id: "gal-2",
        imageUrl:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        caption: "Momen Bahagia 2",
        sortOrder: 1,
      },
      {
        id: "gal-3",
        imageUrl:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        caption: "Momen Bahagia 3",
        sortOrder: 2,
      },
    ],
    bankAccounts: [
      {
        id: "ba-1",
        bankName: "BCA",
        accountNumber: "8291039481",
        accountHolder: groomName,
      },
      {
        id: "ba-2",
        bankName: "Mandiri",
        accountNumber: "1420019283741",
        accountHolder: brideName,
      },
    ],
  };
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const demo = getDemoWeddingData(slug);
  if (demo) {
    return {
      title: `${demo.title} | Fasaro Wedding`,
      description: `Undangan Pernikahan Digital Resmi untuk ${demo.title}`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { title: true },
    });

    if (invitation) {
      return {
        title: `${invitation.title} | Fasaro Wedding`,
        description: `Undangan Pernikahan Digital Resmi untuk ${invitation.title}`,
      };
    }
  } catch {
    // Fallback if DB connection fails
  }

  return { title: "Undangan Pernikahan | Fasaro" };
}

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string; theme?: string }>;
}

export default async function PublicInvitationPage(props: InvitationPageProps) {
  const { slug } = await props.params;
  const { to, theme } = await props.searchParams;

  let invitation = null;
  try {
    const { prisma } = await import("@/lib/prisma");
    invitation = await prisma.invitation.findFirst({
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
  } catch {
    invitation = null;
  }

  // Fallback demo data jika belum ada di database
  if (!invitation) {
    const demoData = getDemoWeddingData(slug);
    if (demoData) {
      return <ThemeRenderer data={demoData} guestName={to} forcedThemeId={theme as ThemeId | undefined} />;
    }
    notFound();
  }

  const coupleInfo = invitation.coupleInfo as unknown as WeddingInvitationData["coupleInfo"];

  const weddingData: WeddingInvitationData = {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    themeId: (theme as ThemeId) || invitation.themeId,
    coupleInfo,
    activeUntil: invitation.activeUntil,
    isActive: invitation.isActive,
    musicUrl: coupleInfo?.musicUrl || null,
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

  return <ThemeRenderer data={weddingData} guestName={to} forcedThemeId={theme as ThemeId | undefined} />;
}
