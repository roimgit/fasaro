import prisma from "@/lib/prisma";

export type SettingCategory = "cms" | "feature" | "maintenance" | "gateway";

export interface SystemSettingDefinition {
  key: string;
  defaultValue: string;
  category: SettingCategory;
  label: string;
  description: string;
  isPublic: boolean;
}

export const SYSTEM_SETTING_DEFINITIONS: SystemSettingDefinition[] = [
  // 1. Content Management (CMS)
  {
    key: "site_hero_badge",
    defaultValue: "250.000+ Pasangan Telah Menggunakan Platform Kami",
    category: "cms",
    label: "Teks Badge Hero",
    description: "Teks badge di atas judul utama halaman beranda",
    isPublic: true,
  },
  {
    key: "site_hero_title",
    defaultValue: "Buat Website Undangan Pernikahan Digital Elegan dalam Hitungan Menit",
    category: "cms",
    label: "Judul Utama Hero",
    description: "Judul besar yang menarik perhatian di landing page",
    isPublic: true,
  },
  {
    key: "site_hero_subtitle",
    defaultValue:
      "Platform all-in-one: ganti tema 1-klik tanpa data hilang, amplop digital terintegrasi (QRIS/Bank), buku tamu RSVP realtime, hingga audio player autoplay super cepat.",
    category: "cms",
    label: "Subjudul / Deskripsi Hero",
    description: "Paragraf penjelas singkat di bawah judul utama",
    isPublic: true,
  },
  {
    key: "site_hero_promo",
    defaultValue: "Mulai Rp 39rb Promo Spesial",
    category: "cms",
    label: "Teks Badge Promo",
    description: "Teks keunggulan di bagian faktor kepercayaan hero",
    isPublic: true,
  },
  {
    key: "announcement_enabled",
    defaultValue: "false",
    category: "cms",
    label: "Status Banner Pengumuman",
    description: "Tampilkan bilah pengumuman global di bagian atas website",
    isPublic: true,
  },
  {
    key: "announcement_text",
    defaultValue: "📢 Info Pemeliharaan: Seluruh sistem berjalan optimal dan siap melayani pesanan Anda.",
    category: "cms",
    label: "Isi Teks Pengumuman",
    description: "Pesan yang ditampilkan di bilah pengumuman atas",
    isPublic: true,
  },
  {
    key: "announcement_type",
    defaultValue: "info",
    category: "cms",
    label: "Jenis Pengumuman",
    description: "Pilihan tampilan: info (biru/abu), warning (oranye/amber), promo (hijau)",
    isPublic: true,
  },
  {
    key: "support_whatsapp",
    defaultValue: "085716697416",
    category: "cms",
    label: "Nomor WhatsApp Bantuan",
    description: "Nomor CS resmi Fasaro (misal 085716697416 atau 6285716697416)",
    isPublic: true,
  },
  {
    key: "support_email",
    defaultValue: "support@fasaro.id",
    category: "cms",
    label: "Email Layanan Pelanggan",
    description: "Alamat email pusat bantuan resmi",
    isPublic: true,
  },
  {
    key: "support_hours",
    defaultValue: "Senin - Minggu (08:00 - 22:00 WIB)",
    category: "cms",
    label: "Jam Operasional Layanan",
    description: "Waktu aktif layanan customer support",
    isPublic: true,
  },
  {
    key: "site_hero_image",
    defaultValue: "",
    category: "cms",
    label: "Gambar Mockup Hero",
    description: "Gambar mockup atau preview undangan di samping/bawah hero utama",
    isPublic: true,
  },
  {
    key: "showcase_weddings_json",
    defaultValue: JSON.stringify([
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
    ]),
    category: "cms",
    label: "Data Pengantin Live Showcase",
    description: "Daftar 3 pernikahan baru dalam format JSON",
    isPublic: true,
  },

  // 2. Pricing & Quota Limits
  {
    key: "price_starter",
    defaultValue: "39000",
    category: "cms",
    label: "Harga Paket Starter (Rp)",
    description: "Nominal harga paket Starter",
    isPublic: true,
  },
  {
    key: "price_starter_original",
    defaultValue: "89000",
    category: "cms",
    label: "Harga Coret Starter (Rp)",
    description: "Nominal harga asli sebelum diskon untuk Paket Starter",
    isPublic: true,
  },
  {
    key: "max_photos_starter",
    defaultValue: "10",
    category: "cms",
    label: "Maksimal Foto Starter",
    description: "Batas galeri foto untuk paket Starter",
    isPublic: true,
  },
  {
    key: "max_accounts_starter",
    defaultValue: "2",
    category: "cms",
    label: "Maksimal Rekening Starter",
    description: "Batas rekening amplop digital untuk paket Starter",
    isPublic: true,
  },
  {
    key: "price_elegant",
    defaultValue: "149000",
    category: "cms",
    label: "Harga Paket Elegant (Rp)",
    description: "Nominal harga paket Elegant",
    isPublic: true,
  },
  {
    key: "price_elegant_original",
    defaultValue: "249000",
    category: "cms",
    label: "Harga Coret Elegant (Rp)",
    description: "Nominal harga asli sebelum diskon untuk Paket Elegant",
    isPublic: true,
  },
  {
    key: "price_ultimate",
    defaultValue: "279000",
    category: "cms",
    label: "Harga Paket Ultimate (Rp)",
    description: "Nominal harga paket Ultimate",
    isPublic: true,
  },
  {
    key: "price_ultimate_original",
    defaultValue: "499000",
    category: "cms",
    label: "Harga Coret Ultimate (Rp)",
    description: "Nominal harga asli sebelum diskon untuk Paket Ultimate",
    isPublic: true,
  },

  // Content Kustomisasi Paket
  {
    key: "plan_starter_name",
    defaultValue: "Paket Starter",
    category: "cms",
    label: "Nama Paket Starter",
    description: "Judul paket Starter",
    isPublic: true,
  },
  {
    key: "plan_starter_desc",
    defaultValue: "Untuk syukuran intim keluarga.",
    category: "cms",
    label: "Deskripsi Paket Starter",
    description: "Subjudul penjelasan paket Starter",
    isPublic: true,
  },
  {
    key: "plan_starter_period",
    defaultValue: "Masa Aktif 3 Bulan",
    category: "cms",
    label: "Masa Aktif Paket Starter",
    description: "Keterangan masa aktif paket Starter",
    isPublic: true,
  },
  {
    key: "plan_starter_badge",
    defaultValue: "Entry Tier",
    category: "cms",
    label: "Badge Label Starter",
    description: "Label tag kecil di atas kartu paket Starter",
    isPublic: true,
  },
  {
    key: "plan_starter_features",
    defaultValue: "1 Pilihan Tema Minimalist\nMasa Aktif 90 Hari\nGaleri hingga 10 Foto\nAmplop (2 Rekening Bank)\nBuku Ucapan & Doa\nNavigasi Google Maps",
    category: "cms",
    label: "Daftar Fitur Paket Starter",
    description: "Daftar poin keunggulan paket Starter (1 baris per fitur)",
    isPublic: true,
  },

  {
    key: "plan_elegant_name",
    defaultValue: "Paket Elegant",
    category: "cms",
    label: "Nama Paket Elegant",
    description: "Judul paket Elegant",
    isPublic: true,
  },
  {
    key: "plan_elegant_desc",
    defaultValue: "Untuk resepsi lengkap & modern.",
    category: "cms",
    label: "Deskripsi Paket Elegant",
    description: "Subjudul penjelasan paket Elegant",
    isPublic: true,
  },
  {
    key: "plan_elegant_period",
    defaultValue: "Masa Aktif 1 Tahun Penuh",
    category: "cms",
    label: "Masa Aktif Paket Elegant",
    description: "Keterangan masa aktif paket Elegant",
    isPublic: true,
  },
  {
    key: "plan_elegant_badge",
    defaultValue: "Paling Populer",
    category: "cms",
    label: "Badge Label Elegant",
    description: "Label tag badge di atas kartu paket Elegant",
    isPublic: true,
  },
  {
    key: "plan_elegant_features",
    defaultValue: "Akses Semua Tema Desain\nGanti Tema 1-Klik Bebas\nMasa Aktif 365 Hari\nGaleri Foto HD Tanpa Batas\nAmplop Bebas + QRIS Donasi\nBuku Tamu & RSVP Realtime\nBackground Musik Autoplay",
    category: "cms",
    label: "Daftar Fitur Paket Elegant",
    description: "Daftar poin keunggulan paket Elegant (1 baris per fitur)",
    isPublic: true,
  },

  {
    key: "plan_ultimate_name",
    defaultValue: "Ultimate Event Day",
    category: "cms",
    label: "Nama Paket Ultimate",
    description: "Judul paket Ultimate",
    isPublic: true,
  },
  {
    key: "plan_ultimate_desc",
    defaultValue: "Solusi hari-H check-in tamu VIP.",
    category: "cms",
    label: "Deskripsi Paket Ultimate",
    description: "Subjudul penjelasan paket Ultimate",
    isPublic: true,
  },
  {
    key: "plan_ultimate_period",
    defaultValue: "Masa Aktif Selamanya",
    category: "cms",
    label: "Masa Aktif Paket Ultimate",
    description: "Keterangan masa aktif paket Ultimate",
    isPublic: true,
  },
  {
    key: "plan_ultimate_badge",
    defaultValue: "VIP Hari-H",
    category: "cms",
    label: "Badge Label Ultimate",
    description: "Label tag badge di atas kartu paket Ultimate",
    isPublic: true,
  },
  {
    key: "plan_ultimate_features",
    defaultValue: "Seluruh Fitur Paket Elegant\nMasa Aktif Selamanya (Lifetime)\nQR Code Check-in Meja Tamu\nWhatsApp Blast Generator\nLove Story Timeline Kustom\nPrioritas Verifikasi Kilat 10 Menit\nDukungan WhatsApp Prioritas",
    category: "cms",
    label: "Daftar Fitur Paket Ultimate",
    description: "Daftar poin keunggulan paket Ultimate (1 baris per fitur)",
    isPublic: true,
  },

  // 3. Maintenance Mode & Website Flags
  {
    key: "maintenance_mode",
    defaultValue: "false",
    category: "maintenance",
    label: "Mode Pemeliharaan Website",
    description: "Jika aktif, pengunjung akan melihat halaman pemeliharaan",
    isPublic: true,
  },
  {
    key: "maintenance_title",
    defaultValue: "Website Sedang Dalam Pemeliharaan Terjadwal",
    category: "maintenance",
    label: "Judul Halaman Pemeliharaan",
    description: "Judul utama saat mode pemeliharaan aktif",
    isPublic: true,
  },
  {
    key: "maintenance_message",
    defaultValue:
      "Kami sedang melakukan pembaruan infrastruktur server untuk meningkatkan performa dan stabilitas layanan. Seluruh data Anda aman dan website akan segera kembali normal.",
    category: "maintenance",
    label: "Pesan Detail Pemeliharaan",
    description: "Pesan yang dibaca pengunjung saat maintenance",
    isPublic: true,
  },
  {
    key: "maintenance_estimated_end",
    defaultValue: "Segera kembali dalam beberapa saat",
    category: "maintenance",
    label: "Estimasi Selesai",
    description: "Perkiraan waktu pemeliharaan berakhir",
    isPublic: true,
  },

  // 4. Feature Flags (Saklar Fitur)
  {
    key: "feature_registration",
    defaultValue: "true",
    category: "feature",
    label: "Pendaftaran Akun Baru",
    description: "Izinkan pengguna baru mendaftar akun di Fasaro",
    isPublic: true,
  },
  {
    key: "feature_midtrans_payment",
    defaultValue: "true",
    category: "feature",
    label: "Payment Gateway Midtrans",
    description: "Aktifkan checkout pembayaran otomatis melalui Midtrans",
    isPublic: true,
  },
  {
    key: "feature_manual_payment",
    defaultValue: "true",
    category: "feature",
    label: "Transfer Manual Bank & QRIS",
    description: "Aktifkan opsi transfer manual dan upload bukti bayar",
    isPublic: true,
  },
  {
    key: "feature_digital_gift",
    defaultValue: "true",
    category: "feature",
    label: "Fitur Amplop Digital Kado",
    description: "Tampilkan kotak amplop hadiah di seluruh undangan",
    isPublic: true,
  },
  {
    key: "feature_rsvp",
    defaultValue: "true",
    category: "feature",
    label: "Fitur Konfirmasi RSVP",
    description: "Tampilkan form kehadiran tamu di seluruh undangan",
    isPublic: true,
  },
  {
    key: "feature_wishes",
    defaultValue: "true",
    category: "feature",
    label: "Fitur Buku Tamu & Doa Ucapan",
    description: "Tampilkan buku tamu interaktif di seluruh undangan",
    isPublic: true,
  },
  {
    key: "feature_music",
    defaultValue: "true",
    category: "feature",
    label: "Fitur Musik Latar (Autoplay)",
    description: "Aktifkan tombol audio musik di seluruh undangan",
    isPublic: true,
  },
  {
    key: "feature_pwa_banner",
    defaultValue: "true",
    category: "feature",
    label: "Banner Unduh Aplikasi PWA",
    description: "Tampilkan prompt instalasi PWA di perangkat mobile",
    isPublic: true,
  },

  // 5. Gateway & Technical Configuration
  {
    key: "payment_active_mode",
    defaultValue: "MANUAL_ONLY",
    category: "gateway",
    label: "Mode Pembayaran Aktif",
    description: "Pilihan mode pembayaran saat ini: MANUAL_ONLY (Hanya Transfer Manual), BOTH (Keduanya), GATEWAY_ONLY (Hanya Midtrans)",
    isPublic: true,
  },
  {
    key: "midtrans_server_key",
    defaultValue: "SB-Mid-server-YOUR_SANDBOX_SERVER_KEY",
    category: "gateway",
    label: "Midtrans Server Key",
    description: "Kunci server otentikasi API Midtrans Sandbox/Production",
    isPublic: false,
  },
  {
    key: "manual_bank_name",
    defaultValue: "BCA",
    category: "gateway",
    label: "Nama Bank Transfer Manual",
    description: "Nama bank untuk transfer manual (misal BCA, Bank Mandiri, BRI, BNI)",
    isPublic: true,
  },
  {
    key: "manual_account_number",
    defaultValue: "8291039481",
    category: "gateway",
    label: "Nomor Rekening Bank",
    description: "Nomor rekening tujuan transfer pembayaran",
    isPublic: true,
  },
  {
    key: "manual_account_holder",
    defaultValue: "PT Fasaro Digital",
    category: "gateway",
    label: "Atas Nama Pemilik Rekening",
    description: "Nama pemilik rekening bank resmi Fasaro",
    isPublic: true,
  },
  {
    key: "manual_whatsapp_confirmation",
    defaultValue: "085716697416",
    category: "gateway",
    label: "Nomor WhatsApp Konfirmasi Manual",
    description: "Nomor WhatsApp CS/Admin untuk menerima konfirmasi bukti transfer",
    isPublic: true,
  },
  {
    key: "manual_payment_instructions",
    defaultValue: "Transfer sesuai nominal paket ke rekening di atas. Setelah transfer, upload bukti transfer di form ini atau kirimkan konfirmasi via WhatsApp agar paket Anda segera diaktifkan.",
    category: "gateway",
    label: "Instruksi Transfer Manual",
    description: "Catatan panduan langkah pembayaran transfer manual bagi klien",
    isPublic: true,
  },
  {
    key: "manual_qris_bank_info",
    defaultValue: "BCA 8291039481 a/n PT Fasaro Digital",
    category: "gateway",
    label: "Informasi Bank Transfer Fasaro (Ringkasan)",
    description: "Nomor rekening dan bank tujuan transfer manual klien",
    isPublic: true,
  },
  {
    key: "manual_qris_image_url",
    defaultValue: "",
    category: "gateway",
    label: "URL Gambar QRIS Fasaro",
    description: "Link gambar QRIS statis resmi Fasaro",
    isPublic: true,
  },
  {
    key: "max_photo_upload",
    defaultValue: "20",
    category: "gateway",
    label: "Batas Default Unggah Foto",
    description: "Batas foto unggahan per undangan secara global",
    isPublic: false,
  },
];

/**
 * Mengambil seluruh pengaturan dari database dengan fallback nilai default.
 */
export async function getAllSettingsMap(): Promise<Record<string, string>> {
  const dbSettings = await prisma.systemSetting.findMany();
  const map: Record<string, string> = {};

  // Isi dengan nilai default dulu
  for (const def of SYSTEM_SETTING_DEFINITIONS) {
    map[def.key] = def.defaultValue;
  }

  // Timpa dengan data yang ada di database
  for (const s of dbSettings) {
    map[s.key] = s.value;
  }

  return map;
}

/**
 * Mengambil pengaturan yang aman untuk konsumsi publik (landing page / frontend).
 */
export async function getPublicSettingsMap(): Promise<Record<string, string>> {
  const all = await getAllSettingsMap();
  const publicMap: Record<string, string> = {};

  for (const def of SYSTEM_SETTING_DEFINITIONS) {
    if (def.isPublic) {
      publicMap[def.key] = all[def.key] ?? def.defaultValue;
    }
  }

  return publicMap;
}

/**
 * Menormalkan nomor WhatsApp agar siap dipakai pada link https://wa.me/
 * Mengubah awalan 0 atau +62 menjadi format 62...
 */
export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }
  return digits || "6285716697416";
}

