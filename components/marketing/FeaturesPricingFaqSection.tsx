"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export const FeaturesPricingFaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: Globe,
      title: "Subdomain & Custom Domain",
      desc: "Dapatkan alamat link unik namapasangan.fasaro.my.id gratis, serta dukungan custom domain .com / .id.",
    },
    {
      icon: Wallet,
      title: "Amplop Digital & QRIS Terintegrasi",
      desc: "Tamu dapat mentransfer tanda kasih langsung melalui berbagai rekening bank dan QRIS otomatis.",
    },
    {
      icon: Users,
      title: "RSVP Cerdas & Manajemen Kuota",
      desc: "Konfirmasi kehadiran otomatis dengan batasan jumlah tamu per undangan agar jamuan lebih terkontrol.",
    },
    {
      icon: MapPin,
      title: "Navigasi Google Maps & Waze",
      desc: "Bantu tamu menemukan lokasi venue pesta Anda dengan petunjuk arah rute 1-klik langsung ke aplikasi navigasi.",
    },
    {
      icon: QrCode,
      title: "Buku Tamu Digital & QR Check-in",
      desc: "Sistem absensi tamu di meja penerima dengan scan QR Code kilat untuk mencegah antrean panjang.",
    },
    {
      icon: Headphones,
      title: "Background Music & Galeri HD",
      desc: "Alunan musik romantis dengan pemutar melayang dan kompresi foto WebP super cepat di bawah 500ms.",
    },
  ];

  const pricingPlans = [
    {
      name: "Paket Starter",
      price: "69.000",
      period: "Masa Aktif 3 Bulan",
      description: "Pilihan hemat untuk acara akad/syukuran intim keluarga.",
      highlight: false,
      tier: "STARTER",
      features: [
        "1 Pilihan Tema Minimalist",
        "Masa Aktif 90 Hari",
        "Galeri Foto hingga 5 Foto",
        "Buku Ucapan & Doa",
        "Navigasi Google Maps",
        "Amplop Digital (1 Rekening Bank)",
      ],
    },
    {
      name: "Paket Elegant",
      price: "149.000",
      period: "Masa Aktif 1 Tahun Penuh",
      description: "Paling populer untuk resepsi pernikahan lengkap & modern.",
      highlight: true,
      badge: "Paling Populer",
      tier: "ELEGANT",
      features: [
        "Akses Bebas ke Seluruh Tema Desain",
        "Ganti Tema 1-Klik Kapan Saja",
        "Masa Aktif 365 Hari",
        "Galeri Foto HD Tanpa Batas (WebP)",
        "Fitur Amplop Digital + QRIS Toko",
        "Buku Tamu & RSVP Realtime + Confetti",
        "Sinkronisasi Google Calendar Tamu",
        "Background Musik Autoplay",
      ],
    },
    {
      name: "Paket Ultimate Event Day",
      price: "279.000",
      period: "Masa Aktif Selamanya (Lifetime)",
      description: "Solusi lengkap hari-H dengan sistem check-in VIP resepsi.",
      highlight: false,
      tier: "ULTIMATE",
      features: [
        "Seluruh Fitur Paket Elegant",
        "Masa Aktif Selamanya (Lifetime)",
        "Sistem QR Code Check-in Meja Tamu",
        "WhatsApp Blast Gateway Generator",
        "Story / Love Story Timeline Kustom",
        "Prioritas Verifikasi Kilat 10 Menit",
        "Dukungan WhatsApp Support Prioritas",
      ],
    },
  ];

  const testimonials = [
    {
      couple: "Rian & Sinta",
      city: "Surabaya",
      rating: 5,
      comment:
        "Tamu-tamu kami sangat terkesan dengan undangan digitalnya! Musiknya berputar halus dan tamu senang bisa langsung salin nomor rekening BCA tanpa ribet.",
      weddingDate: "Agustus 2026",
    },
    {
      couple: "Dimas & Annisa",
      city: "Bandung",
      rating: 5,
      comment:
        "Fitur ganti tema 1-klik beneran ngebantu banget. Kami sempat galau pilih tema, tapi bisa coba live preview di HP dulu tanpa data hilang. Mantap Fasaro!",
      weddingDate: "Juli 2026",
    },
    {
      couple: "Fajar & Maya",
      city: "Jakarta",
      rating: 5,
      comment:
        "Konfirmasi kehadiran RSVP realtime sangat membantu kami menghitung porsi catering agar tidak mubazir. Sangat hemat biaya cetak!",
      weddingDate: "September 2026",
    },
  ];

  const faqs = [
    {
      q: "Berapa lama proses pembuatan undangan digital di Fasaro?",
      a: "Hanya butuh 5 hingga 10 menit! Anda cukup mengisi nama mempelai, tanggal acara, lokasi, dan foto, undangan langsung online dan siap disebarkan.",
    },
    {
      q: "Apakah saya bisa mengganti tema setelah undangan selesai dibuat?",
      a: "Bisa banget! Berkat arsitektur modular Fasaro (Aturan P0), Anda bisa berganti-ganti tema kapan saja dari dashboard hanya dengan 1-klik tanpa ada satu pun data yang hilang.",
    },
    {
      q: "Bagaimana cara tamu mengirimkan kado/amplop digital?",
      a: "Tamu cukup menekan tombol 'Salin Rekening' pada nomor rekening Anda atau memindai kode QRIS langsung melalui mobile banking / e-wallet apapun (GoPay, OVO, ShopeePay, Dana).",
    },
    {
      q: "Metode pembayaran apa saja yang didukung untuk upgrade paket?",
      a: "Kami mendukung pembayaran otomatis via Payment Gateway Midtrans (GoPay, QRIS, Virtual Account BCA/Mandiri/BRI) dan transfer manual langsung ke QRIS toko kami dengan verifikasi admin.",
    },
    {
      q: "Apakah ada batasan jumlah tamu yang bisa menerima undangan?",
      a: "Tidak ada batasan (Unlimited)! Anda bebas menyebarkan link undangan ke ratusan maupun ribuan tamu dengan sapaan nama penerima dinamis (?to=Nama+Tamu).",
    },
  ];

  return (
    <div className="w-full space-y-28 py-10">
      {/* 1. Fitur Unggulan Grid */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 space-y-12 scroll-mt-20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Fitur Lengkap &amp; Canggih</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Semua yang Anda Butuhkan untuk Hari Bahagia
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Didesain khusus untuk mempermudah calon pengantin mempersiapkan pesta pernikahan modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all space-y-3 text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900">{f.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Tabel Paket Harga */}
      <section id="harga" className="max-w-6xl mx-auto px-4 space-y-12 scroll-mt-20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biaya Transparan &amp; Terjangkau</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Pilihan Paket Sesuai Kebutuhan Anda
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Sekali bayar tanpa biaya tersembunyi. Aktif seketika via gateway otomatis atau transfer manual.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                plan.highlight
                  ? "bg-white border-2 border-orange-500 shadow-xl shadow-orange-500/10 scale-105"
                  : "bg-white border border-stone-200 hover:border-stone-300 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 py-1 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{plan.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-stone-500">Rp</span>
                    <span className="text-4xl font-serif font-bold text-stone-900 tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-[11px] text-orange-600 font-semibold">{plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-stone-100">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={`/login?from=/dashboard&upgradeTier=${plan.tier}`}
                  className={`w-full block text-center py-3 px-6 rounded-2xl text-xs font-bold transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 hover:scale-105"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  Pilih {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Testimoni Pasangan */}
      <section id="testimoni" className="max-w-6xl mx-auto px-4 space-y-12 scroll-mt-20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>Cerita Bahagia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Kisah Sukses Pengantin Fasaro
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Dipercaya oleh ribuan pasangan pengantin dari Sabang sampai Merauke.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4 text-left flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  &quot;{testi.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{testi.couple}</h4>
                  <span className="text-[11px] text-stone-500">{testi.city}</span>
                </div>
                <span className="text-[10px] text-orange-700 font-mono bg-orange-50 px-2 py-0.5 rounded-md">
                  {testi.weddingDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Accordion FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 space-y-10 scroll-mt-20">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Pertanyaan Sering Ditanyakan</h2>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-stone-200/90 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-6 flex items-center justify-between gap-4 text-sm font-semibold text-stone-800 hover:text-orange-600 text-left transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      isOpen ? "rotate-180 text-orange-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Footer Lengkap */}
      <footer className="border-t border-stone-200 bg-white pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-left pb-12">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-serif font-bold text-stone-900">
                Fasaro<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Platform pembuatan undangan pernikahan digital elegan nomor #1 di Indonesia. Berkecepatan tinggi, aman, dan mudah digunakan.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span>SSL 256-Bit Secured &amp; Verified</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Navigasi Cepat
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li><a href="#home" className="hover:text-orange-600 transition-colors">Beranda</a></li>
              <li><a href="#tema" className="hover:text-orange-600 transition-colors">Katalog Tema</a></li>
              <li><a href="#fitur" className="hover:text-orange-600 transition-colors">Fitur Platform</a></li>
              <li><a href="#harga" className="hover:text-orange-600 transition-colors">Paket Harga</a></li>
            </ul>
          </div>

          {/* Program & Kemitraan */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Kemitraan &amp; Komunitas
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li><Link href="/login" className="hover:text-orange-600 transition-colors">Program Reseller WO</Link></li>
              <li><Link href="/login" className="hover:text-orange-600 transition-colors">Mitra Fotografer Wedding</Link></li>
              <li><Link href="/login" className="hover:text-orange-600 transition-colors">Affiliate Earning</Link></li>
              <li><Link href="/admin/verifikasi-manual" className="hover:text-orange-600 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Kontak Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Bantuan &amp; Kontak
            </h4>
            <p className="text-xs text-stone-600">
              Customer Success siap membantu persiapan hari bahagia Anda setiap hari (08:00 - 22:00 WIB).
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Fasaro%20saya%20ingin%20tanya%20undangan%20pernikahan"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              Chat WhatsApp Support
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-stone-200 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Fasaro Wedding Platform. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPricingFaqSection;
