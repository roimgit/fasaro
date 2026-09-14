"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Play,
  Users,
} from "lucide-react";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import ThemeCatalogSection from "@/components/marketing/ThemeCatalogSection";
import FeaturesPricingFaqSection from "@/components/marketing/FeaturesPricingFaqSection";
import { WeddingInvitationData } from "@/types/wedding";
import ThemeRenderer from "@/components/templates/ThemeRenderer";
import DeviceFrame from "@/components/templates/device/DeviceFrame";

const DEMO_WEDDING_DATA: WeddingInvitationData = {
  id: "demo-showcase",
  slug: "demo-wedding",
  title: "Pernikahan Rian & Sinta",
  themeId: "adirara",
  coupleInfo: {
    groomName: "Rian Pratama",
    groomNickname: "Rian",
    groomFather: "Bambang Wijaya",
    groomMother: "Sri Wahyuni",
    groomInstagram: "rian.pratama",
    groomPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    brideName: "Sinta Anggraini",
    brideNickname: "Sinta",
    brideFather: "Herman Santoso",
    brideMother: "Dewi Lestari",
    brideInstagram: "sinta.anggraini",
    bridePhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    greetingMessage:
      "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami mengundang Anda untuk merayakan hari bahagia pernikahan kami.",
  },
  isActive: true,
  eventSchedules: [
    {
      eventName: "Akad Nikah",
      date: "2026-10-24T08:00:00.000Z",
      startTime: "08:00",
      endTime: "10:00",
      venueName: "Masjid Agung Al-Falah",
      address: "Jl. Diponegoro No. 12, Surabaya",
      mapsUrl: "https://maps.google.com",
    },
    {
      eventName: "Resepsi Pernikahan",
      date: "2026-10-24T11:00:00.000Z",
      startTime: "11:00",
      endTime: "14:00",
      venueName: "Grand Ballroom Hotel Sahid",
      address: "Jl. Kusuma Bangsa No. 88, Surabaya",
      mapsUrl: "https://maps.google.com",
    },
  ],
  galleries: [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      caption: "Prewedding 1",
      sortOrder: 0,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      caption: "Prewedding 2",
      sortOrder: 1,
    },
  ],
  bankAccounts: [
    {
      bankName: "BCA",
      accountNumber: "8291039481",
      accountHolder: "Rian Pratama",
    },
    {
      bankName: "Mandiri",
      accountNumber: "1420019283741",
      accountHolder: "Sinta Anggraini",
    },
  ],
};

const RECENT_WEDDINGS = [
  {
    couple: "Faisal & Putri",
    date: "24 Oktober 2026",
    venue: "Balai Nan Gadang, Padang",
    theme: "Traditional Minang",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    slug: "demo-minang",
  },
  {
    couple: "Adi & Rara",
    date: "31 Agustus 2026",
    venue: "Aula Masjid ABRI, Cimahi",
    theme: "WebNikah Classic",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    slug: "demo-adirara",
  },
  {
    couple: "Rian & Sinta",
    date: "24 Oktober 2026",
    venue: "Grand Ballroom Sahid, Surabaya",
    theme: "Modern Editorial",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    slug: "demo-minimalist",
  },
];

export default function HomePage() {
  const [heroTheme, setHeroTheme] = useState("minang");

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-900 flex flex-col selection:bg-[#F97316] selection:text-white">
      {/* 1. Sticky Responsive Navbar */}
      <MarketingNavbar />

      {/* 2. Hero Section */}
      <section id="home" className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Counter Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#F97316] text-xs font-semibold shadow-xs">
              <Users className="w-3.5 h-3.5 text-[#F97316]" />
              <span>250.000+ Pasangan Telah Menggunakan Platform Kami</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Buat Website Undangan Pernikahan Digital Elegan{" "}
              <span className="text-[#F97316]">
                dalam Hitungan Menit
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Platform all-in-one: ganti tema 1-klik tanpa data hilang, amplop digital terintegrasi (QRIS/Bank), buku tamu RSVP realtime, hingga audio player autoplay super cepat.
            </p>

            {/* CTA Dual Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/login?from=/dashboard"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors"
              >
                <span>Mulai Sekarang - Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`/invitation/demo-${heroTheme}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#F97316]" />
                <span>Preview Undangan</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Checklist Trust Factors */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tanpa Biaya Pembuatan Awal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Buka Cepat &lt; 500ms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ganti Tema Bebas Kapan Saja</span>
              </div>
            </div>
          </div>

          {/* Right Column: Smartphone Frame Mockup with 1-Click Theme Switcher */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Quick Hero Theme Selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-xl mb-3 text-[11px] shadow-xs">
              {[
                { id: "minang", label: "Minang Adat" },
                { id: "adirara", label: "Adi & Rara" },
                { id: "minimalist", label: "Minimalist" },
                { id: "rustic", label: "Rustic" },
                { id: "royal", label: "Royal Gold" },
                { id: "syari", label: "Syar'i" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setHeroTheme(t.id)}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    heroTheme === t.id
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
              <DeviceFrame>
                <ThemeRenderer
                  data={DEMO_WEDDING_DATA}
                  forcedThemeId={heroTheme}
                  guestName="Budi & Ani - Bandung"
                  showCover={false}
                  isEmbedded={true}
                />
              </DeviceFrame>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Wedding Showcase (Baru Saja Menikah) */}
      <section className="border-y border-[#E2E8F0] bg-white py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#F97316] font-semibold">
                Live Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Baru Saja Menikah Menggunakan Fasaro
              </h2>
            </div>
            <Link
              href="/login?from=/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:underline"
            >
              <span>Bergabung Bersama Mereka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENT_WEDDINGS.map((w, idx) => (
              <div
                key={idx}
                className="group rounded-xl bg-white border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#F97316] transition-all text-left flex flex-col justify-between"
              >
                <a
                  href={`/invitation/${w.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative h-48 w-full overflow-hidden bg-slate-100"
                  title={`Buka undangan ${w.couple} di tab baru`}
                >
                  <Image
                    src={w.img}
                    alt={w.couple}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={false}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-semibold text-white border border-white/10">
                    {w.theme}
                  </div>
                </a>

                <div className="p-4 space-y-3">
                  <div>
                    <a
                      href={`/invitation/${w.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-base text-slate-900 hover:text-[#F97316] transition-colors"
                    >
                      {w.couple}
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">{w.venue}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{w.date}</span>
                    <a
                      href={`/invitation/${w.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:underline"
                    >
                      <span>Lihat Contoh</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Katalog & Filter Tema Undangan (Live Theme Preview) */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <ThemeCatalogSection demoData={DEMO_WEDDING_DATA} />
      </div>

      {/* 5. Fitur Unggulan, Tabel Harga, Testimoni & FAQ */}
      <div className="w-full">
        <FeaturesPricingFaqSection />
      </div>
    </div>
  );
}
