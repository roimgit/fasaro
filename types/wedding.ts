export interface CoupleInfo {
  groomName: string;
  groomNickname?: string | null;
  groomFather?: string | null;
  groomMother?: string | null;
  groomInstagram?: string | null;
  groomPhoto?: string | null;
  brideName: string;
  brideNickname?: string | null;
  brideFather?: string | null;
  brideMother?: string | null;
  brideInstagram?: string | null;
  bridePhoto?: string | null;
  greetingMessage?: string | null;
  stories?: Array<{ date: string; title: string; story: string }> | null;
  musicUrl?: string | null;
  youtubeVideoUrl?: string | null;
  desktopCoverImage?: string | null;
}


export interface EventScheduleItem {
  id?: string;
  eventName: string;
  date: string | Date;
  startTime: string;
  endTime?: string | null;
  venueName: string;
  address: string;
  mapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  sortOrder: number;
}

export interface BankAccountItem {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl?: string | null;
}

export interface WishItem {
  id: string;
  senderName: string;
  message: string;
  reaction?: string | null;
  createdAt: string | Date;
}

export interface WeddingInvitationData {
  id: string;
  slug: string;
  title: string;
  themeId: string;
  coupleInfo: CoupleInfo;
  activeUntil?: string | Date | null;
  isActive: boolean;
  eventSchedules: EventScheduleItem[];
  galleries: GalleryItem[];
  bankAccounts: BankAccountItem[];
  musicUrl?: string | null;
  wishes?: WishItem[];
}

export type ThemeId = "minimalist" | "rustic" | "syari" | "royal" | "adirara" | "minang";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  category: "Minimalist" | "Floral/Rustic" | "Syar'i/Adat" | "Luxury Dark Gold" | "Modern Chic";
  description: string;
  fontHeading: string;
  fontBody: string;
  accentColor: string;
  bgPreview: string;
  thumbnail?: string;
}

export const THEME_LIST: ThemeMeta[] = [
  {
    id: "minang",
    name: "Traditional Minang",
    category: "Syar'i/Adat",
    description: "Kemegahan adat Minangkabau: motif atap gonjong Rumah Gadang emas, songket Pandai Sikek mewah, sapaan Anak Daro & Marapulai, dan carano tanda kasih digital.",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentColor: "#d97706",
    bgPreview: "from-[#382a0f] via-[#5c131a] to-[#1a0f07]",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "minimalist",
    name: "Modern Editorial",
    category: "Minimalist",
    description: "Desain minimalis berkelas, tipografi Playfair Display yang anggun, monokrom pastel & garis halus.",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentColor: "#334155",
    bgPreview: "from-stone-100 to-zinc-200",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "rustic",
    name: "Warm Rustic",
    category: "Floral/Rustic",
    description: "Suasana hangat earth-tone, font Cormorant Garamond, palet warna warm beige & floral estetik.",
    fontHeading: "font-serif",
    fontBody: "font-serif",
    accentColor: "#92400e",
    bgPreview: "from-amber-100 to-orange-200",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "syari",
    name: "Syari Islamic & Adat",
    category: "Syar'i/Adat",
    description: "Sentuhan islami sakral, kaligrafi ornamen arabesque/batik modern, tipografi formal & penuh berkah.",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentColor: "#065f46",
    bgPreview: "from-emerald-950 to-teal-900",
    thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "royal",
    name: "Royal Luxury Gold",
    category: "Luxury Dark Gold",
    description: "Kemewahan kerajaan ningrat, perpaduan Midnight Navy & Royal Gold berkilau, ornamen mahkota megah.",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentColor: "#d97706",
    bgPreview: "from-slate-950 via-indigo-950 to-amber-900",
    thumbnail: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adirara",
    name: "WebNikah Classic",
    category: "Modern Chic",
    description: "Desain website pernikahan klasik khas WebNikah: bottom floating navbar, love story timeline, calendar sync, dan background floral elegan.",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentColor: "#be185d",
    bgPreview: "from-pink-100 via-rose-100 to-amber-50",
    thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
];
