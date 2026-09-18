import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Great_Vibes, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import PwaInstallBanner from "@/components/pwa/PwaInstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F97316",
};

export const metadata: Metadata = {
  title: "Fasaro - Platform Undangan Pernikahan Digital & Manajemen Tamu Modern",
  description:
    "Buat undangan pernikahan digital berkelas dengan 1-klik ganti tema, buku tamu RSVP instan, galeri momen terkompresi, dan kado digital terverifikasi.",
  keywords: [
    "undangan pernikahan digital",
    "wedding invitation",
    "rsvp online",
    "undangan web",
    "fasaro",
  ],
  authors: [{ name: "Fasaro Wedding" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fasaro",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  verification: {
    google: "n66cH7S-Us2bCPgZ3lwvWyYRpbKtyU7HUkt45s-6FbQ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${playfair.variable} ${plusJakarta.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PwaInstallBanner />
      </body>
    </html>
  );
}
