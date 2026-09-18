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

  if (slug.includes("velvet") || slug.includes("burgundy")) {
    themeId = "velvet";
    title = "The Wedding of Versa & Mekar";
    groomName = "Versa Pratama, S.T.";
    groomNickname = "Versa";
    brideName = "Mekar Anggraini, S.Ds.";
    brideNickname = "Mekar";
    venueName = "Grand Ballroom Hotel Santika Bogor";
    address = "Botani Square Mall, Jl. Raya Padjadjaran, Kota Bogor";
  } else if (slug.includes("botanical") || slug.includes("versa") || slug === "versa-mekar") {
    themeId = "botanical";
    title = "The Wedding of Versa & Mekar";
    groomName = "Versa Pratama, S.T.";
    groomNickname = "Versa";
    brideName = "Mekar Anggraini, S.Ds.";
    brideNickname = "Mekar";
    venueName = "Grand Ballroom Hotel Santika Bogor";
    address = "Jl. Raya Padjadjaran, Tegallega, Kota Bogor, Jawa Barat";
  } else if (slug.includes("minang") || slug === "faisal-putri") {
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

  const isBotanical = themeId === "botanical";
  const isVelvet = themeId === "velvet";
  const isVersaMekar = isBotanical || isVelvet;

  return {
    id: `demo-${slug}`,
    slug,
    title,
    themeId,
    isActive: true,
    coupleInfo: {
      groomName,
      groomNickname,
      groomFather: isVersaMekar ? "Bpk. Bambang Wijaya" : "Bpk. Bambang Wijaya",
      groomMother: isVersaMekar ? "Ibu Sri Rahayu" : "Ibu Sri Wahyuni",
      groomInstagram: isVersaMekar ? "versapratama" : "mempelai.pria",
      groomPhoto: isVelvet
        ? "/templates/velvet/groom.jpg"
        : isBotanical
        ? "/templates/botanical/groom.jpg"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      brideName,
      brideNickname,
      brideFather: isVersaMekar ? "Bpk. Hendra Kusuma" : "Bpk. Herman Santoso",
      brideMother: isVersaMekar ? "Ibu Dewi Sartika" : "Ibu Dewi Lestari",
      brideInstagram: isVersaMekar ? "mekaranggraini" : "mempelai.wanita",
      bridePhoto: isVelvet
        ? "/templates/velvet/bride.jpg"
        : isBotanical
        ? "/templates/botanical/bride.jpg"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      desktopCoverImage: isVelvet
        ? "/templates/velvet/couple.jpg"
        : isBotanical
        ? "/templates/botanical/cover.jpg"
        : undefined,
      greetingMessage:
        "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      stories: [
        {
          date: isVersaMekar ? "2022" : "14 Juli 2024",
          title: isVersaMekar ? "Pertama Bertemu" : "Pertemuan & Lamaran Resmi",
          story: isVersaMekar
            ? "Dipertemukan saat proyek studi dan diskusi bersama di kampus. Berawal dari rekan diskusi hangat hingga tumbuh rasa saling menghargai."
            : "Dipertemukan dalam suasana hangat, menjalin komitmen suci di hadapan keluarga besar kedua belah pihak.",
        },
        {
          date: isVersaMekar ? "Februari 2025" : "20 Oktober 2026",
          title: isVersaMekar ? "Lamaran Resmi" : "Malam Tradisi & Doa Restu",
          story: isVersaMekar
            ? "Dengan niat yang tulus dan restu kedua orang tua, kami mengikat janji suci pertunangan di hadapan keluarga besar."
            : "Malam permohonan doa restu dan pembersihan diri bersama keluarga terdekat menjelang hari suci ijab kabul.",
        },
        {
          date: isVersaMekar ? "Desember 2026" : "24 Oktober 2026",
          title: isVersaMekar ? "Menuju Pelaminan" : "Hari Bersejarah Akad & Pesta",
          story: isVersaMekar
            ? "Melangkah bersama menyempurnakan ibadah dan memulai lembaran baru sebagai keluarga yang sakinah, mawaddah, warahmah."
            : "Mengikat janji suci pernikahan untuk melangkah bersama menuju masa depan sakinah mawaddah warahmah.",
        },
      ],
    },
    eventSchedules: [
      {
        id: "ev-1",
        eventName: isVersaMekar
          ? "Akad Nikah"
          : themeId === "minang"
          ? "Akad Nikah & Pasambahan Adat"
          : "Akad Nikah",
        date: isVersaMekar ? "2026-12-20T08:00:00.000Z" : "2026-10-24T08:30:00.000Z",
        startTime: isVersaMekar ? "08:00" : "08:30",
        endTime: isVersaMekar ? "10:00" : "10:30",
        venueName: isVersaMekar
          ? "Masjid Raya Bogor"
          : themeId === "minang"
          ? "Masjid Raya Sumatera Barat"
          : venueName,
        address: isVersaMekar
          ? "Jl. Pajajaran No. 10, Baranangsiang, Kota Bogor"
          : themeId === "minang"
          ? "Jl. Khatib Sulaiman, Padang"
          : address,
        mapsUrl: "https://maps.google.com/?q=Masjid+Raya+Bogor",
      },
      {
        id: "ev-2",
        eventName: isVersaMekar
          ? "Resepsi Pernikahan"
          : themeId === "minang"
          ? "Baralek Gadang (Resepsi Adat)"
          : "Resepsi Pernikahan",
        date: isVersaMekar ? "2026-12-20T11:00:00.000Z" : "2026-10-24T11:00:00.000Z",
        startTime: "11:00",
        endTime: "14:00",
        venueName: isVersaMekar
          ? "Grand Ballroom Hotel Santika Bogor"
          : venueName,
        address: isVersaMekar
          ? "Botani Square Mall, Jl. Raya Padjadjaran, Kota Bogor"
          : address,
        mapsUrl: "https://maps.google.com/?q=Hotel+Santika+Bogor",
      },
    ],
    galleries: isVelvet
      ? [
          {
            id: "gal-1",
            imageUrl: "/templates/velvet/tea-garden.jpg",
            caption: "Pre-wedding Kebun Teh",
            sortOrder: 0,
          },
          {
            id: "gal-2",
            imageUrl: "/templates/velvet/rings.jpg",
            caption: "Buket Bunga & Cincin",
            sortOrder: 1,
          },
          {
            id: "gal-3",
            imageUrl: "/templates/velvet/bride.jpg",
            caption: "Mempelai Wanita",
            sortOrder: 2,
          },
          {
            id: "gal-4",
            imageUrl: "/templates/velvet/groom.jpg",
            caption: "Mempelai Pria",
            sortOrder: 3,
          },
          {
            id: "gal-5",
            imageUrl: "/templates/velvet/couple.jpg",
            caption: "Tatapan Kasih",
            sortOrder: 4,
          },
          {
            id: "gal-6",
            imageUrl: "/templates/velvet/forest.jpg",
            caption: "Pre-wedding Hutan Pinus",
            sortOrder: 5,
          },
        ]
      : [
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
        accountNumber: isVersaMekar ? "8020192831" : "8291039481",
        accountHolder: isVersaMekar ? "Versa Pratama" : groomName,
      },
      {
        id: "ba-2",
        bankName: "Mandiri",
        accountNumber: isVersaMekar ? "133009281920" : "1420019283741",
        accountHolder: isVersaMekar ? "Mekar Anggraini" : brideName,
      },
    ],
  };
}

const BACKEND_INTERNAL_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:5000";

async function fetchPublicInvitation(slug: string): Promise<WeddingInvitationData | null> {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/api/public/invitations/${slug}`, {
      next: { revalidate: 60, tags: [`invitation-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
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

  const invitation = await fetchPublicInvitation(slug);
  if (invitation) {
    return {
      title: `${invitation.title} | Fasaro Wedding`,
      description: `Undangan Pernikahan Digital Resmi untuk ${invitation.title}`,
    };
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

  const invitation = await fetchPublicInvitation(slug);

  // Fallback demo data jika belum ada di database atau offline
  if (!invitation) {
    const demoData = getDemoWeddingData(slug);
    if (demoData) {
      return (
        <ThemeRenderer
          data={demoData}
          guestName={to}
          forcedThemeId={theme as ThemeId | undefined}
        />
      );
    }
    notFound();
  }

  return (
    <ThemeRenderer
      data={invitation}
      guestName={to}
      forcedThemeId={theme as ThemeId | undefined}
    />
  );
}
