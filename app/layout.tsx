import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
