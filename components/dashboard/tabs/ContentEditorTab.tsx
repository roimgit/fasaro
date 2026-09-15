"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Music,
  Plus,
  BookOpen,
  Trash2,
  Video,
} from "lucide-react";

interface ScheduleItem {
  id?: string;
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  mapsUrl: string;
}

interface GalleryItem {
  imageUrl: string;
  caption: string;
  sortOrder: number;
}

interface BankItem {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl?: string;
}

interface StoryItem {
  date: string;
  title: string;
  story: string;
}

interface ContentEditorTabProps {
  // General Info
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;

  // Groom & Bride
  groomName: string;
  setGroomName: (v: string) => void;
  groomNickname: string;
  setGroomNickname: (v: string) => void;
  groomFather: string;
  setGroomFather: (v: string) => void;
  groomMother: string;
  setGroomMother: (v: string) => void;
  groomInstagram: string;
  setGroomInstagram: (v: string) => void;
  groomPhoto: string;
  setGroomPhoto: (v: string) => void;

  brideName: string;
  setBrideName: (v: string) => void;
  brideNickname: string;
  setBrideNickname: (v: string) => void;
  brideFather: string;
  setBrideFather: (v: string) => void;
  brideMother: string;
  setBrideMother: (v: string) => void;
  brideInstagram: string;
  setBrideInstagram: (v: string) => void;
  bridePhoto: string;
  setBridePhoto: (v: string) => void;

  greetingMessage: string;
  setGreetingMessage: (v: string) => void;

  // Schedules
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;

  // Media
  galleries: GalleryItem[];
  setGalleries: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  musicUrl: string;
  setMusicUrl: (v: string) => void;
  youtubeVideoUrl: string;
  setYoutubeVideoUrl: (v: string) => void;

  // Digital Envelope
  bankAccounts: BankItem[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankItem[]>>;

  // Love Story
  stories: StoryItem[];
  setStories: React.Dispatch<React.SetStateAction<StoryItem[]>>;

  // Tier & Upgrade
  tier?: string;
  onUpgradeClick?: () => void;

  onSave: () => void;
  isSaving: boolean;
}

export const ContentEditorTab: React.FC<ContentEditorTabProps> = ({
  tier,
  onUpgradeClick,
  title,
  setTitle,
  slug,
  setSlug,
  groomName,
  setGroomName,
  groomNickname,
  setGroomNickname,
  groomFather,
  setGroomFather,
  groomMother,
  setGroomMother,
  groomInstagram,
  setGroomInstagram,
  groomPhoto,
  setGroomPhoto,
  brideName,
  setBrideName,
  brideNickname,
  setBrideNickname,
  brideFather,
  setBrideFather,
  brideMother,
  setBrideMother,
  brideInstagram,
  setBrideInstagram,
  bridePhoto,
  setBridePhoto,
  greetingMessage,
  setGreetingMessage,
  schedules,
  setSchedules,
  galleries,
  setGalleries,
  musicUrl,
  setMusicUrl,
  youtubeVideoUrl,
  setYoutubeVideoUrl,
  bankAccounts,
  setBankAccounts,
  stories,
  setStories,
}) => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (idx: number) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  const sections = [
    { id: 0, title: "1. Informasi Pasangan Mempelai", icon: Heart, badge: "Wajib" },
    { id: 1, title: "2. Jadwal & Lokasi Acara", icon: Calendar, badge: `${schedules.length} Sesi` },
    { id: 2, title: "3. Galeri Foto & Musik Latar", icon: ImageIcon, badge: `${galleries.length} Foto` },
    { id: 3, title: "4. Amplop Digital & QRIS", icon: CreditCard, badge: `${bankAccounts.length} Rekening` },
    { id: 4, title: "5. Cerita Cinta (Love Story)", icon: BookOpen, badge: `${stories.length} Momen` },
  ];

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Editor Konten Undangan
          </h2>
          <p className="text-xs text-slate-500">
            Atur seluruh konten pernikahan Anda secara langsung. Setiap perubahan otomatis tampil di website undangan.
          </p>
        </div>
      </div>

      {/* Accordion 1: Mempelai */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(0)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 min-h-[52px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="block">{sections[0].title}</span>
              <span className="text-[11px] text-slate-400 font-normal">Nama, foto, profil keluarga &amp; ucapan pembuka</span>
            </div>
          </div>
          {openSection === 0 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection === 0 && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#E2E8F0] space-y-5 text-xs animate-in fade-in">
            {/* Judul & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Judul Undangan:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Pernikahan Rian & Sinta"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[44px] text-xs sm:text-sm focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tautan / Subdomain Undangan:</label>
                <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white px-3 min-h-[44px] focus-within:border-[#F97316] focus-within:ring-1 focus-within:ring-[#F97316]">
                  <span className="text-slate-400 font-mono text-xs">fasaro.id/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="rian-sinta"
                    className="w-full bg-transparent py-2 px-1 text-slate-900 font-mono text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mempelai Pria */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <h3 className="font-semibold text-[#F97316] text-xs uppercase tracking-wider">
                Mempelai Pria (Groom)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nama Lengkap &amp; Gelar:</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="Rian Pratama, S.Kom"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Panggilan:</label>
                  <input
                    type="text"
                    value={groomNickname}
                    onChange={(e) => setGroomNickname(e.target.value)}
                    placeholder="Rian"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Ayah:</label>
                  <input
                    type="text"
                    value={groomFather}
                    onChange={(e) => setGroomFather(e.target.value)}
                    placeholder="Bpk. Bambang Wijaya"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Ibu:</label>
                  <input
                    type="text"
                    value={groomMother}
                    onChange={(e) => setGroomMother(e.target.value)}
                    placeholder="Ibu Sri Wahyuni"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Instagram (@username):</label>
                  <input
                    type="text"
                    value={groomInstagram}
                    onChange={(e) => setGroomInstagram(e.target.value)}
                    placeholder="rian.pratama"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">URL Foto Mempelai Pria:</label>
                  <input
                    type="text"
                    value={groomPhoto}
                    onChange={(e) => setGroomPhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mempelai Wanita */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <h3 className="font-semibold text-[#F97316] text-xs uppercase tracking-wider">
                Mempelai Wanita (Bride)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nama Lengkap &amp; Gelar:</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Sinta Anggraini, S.E"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Panggilan:</label>
                  <input
                    type="text"
                    value={brideNickname}
                    onChange={(e) => setBrideNickname(e.target.value)}
                    placeholder="Sinta"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Ayah:</label>
                  <input
                    type="text"
                    value={brideFather}
                    onChange={(e) => setBrideFather(e.target.value)}
                    placeholder="Bpk. Herman Santoso"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Nama Ibu:</label>
                  <input
                    type="text"
                    value={brideMother}
                    onChange={(e) => setBrideMother(e.target.value)}
                    placeholder="Ibu Dewi Lestari"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Instagram (@username):</label>
                  <input
                    type="text"
                    value={brideInstagram}
                    onChange={(e) => setBrideInstagram(e.target.value)}
                    placeholder="sinta.anggraini"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">URL Foto Mempelai Wanita:</label>
                  <input
                    type="text"
                    value={bridePhoto}
                    onChange={(e) => setBridePhoto(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pesan Pembuka */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Pesan Pembuka / Salam Hangat:</label>
              <textarea
                rows={3}
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                placeholder="Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan..."
                className="w-full p-3 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs sm:text-sm focus:border-[#F97316] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Jadwal & Lokasi */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(1)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 min-h-[52px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block">{sections[1].title}</span>
              <span className="text-[11px] text-slate-400 font-normal">Akad nikah, resepsi, gedung &amp; Google Maps</span>
            </div>
          </div>
          {openSection === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection === 1 && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#E2E8F0] space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pt-4">
              <p className="text-slate-500 text-xs">
                Tambahkan satu atau lebih sesi acara pernikahan Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSchedules([
                    ...schedules,
                    {
                      eventName: "Resepsi Pernikahan",
                      date: new Date().toISOString().split("T")[0],
                      startTime: "11:00",
                      endTime: "14:00",
                      venueName: "",
                      address: "",
                      mapsUrl: "",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-50 text-[#F97316] hover:bg-blue-100 font-semibold text-xs border border-orange-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Sesi</span>
              </button>
            </div>

            {schedules.map((sch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="font-semibold text-slate-900 text-xs">
                    Sesi #{idx + 1}
                  </span>
                  {schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Nama Sesi Acara:</label>
                    <input
                      type="text"
                      value={sch.eventName}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].eventName = e.target.value;
                        setSchedules(updated);
                      }}
                      placeholder="Akad Nikah / Resepsi"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Tanggal Acara:</label>
                    <input
                      type="date"
                      value={typeof sch.date === "string" ? sch.date.split("T")[0] : ""}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].date = e.target.value;
                        setSchedules(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Jam Mulai:</label>
                    <input
                      type="text"
                      value={sch.startTime}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].startTime = e.target.value;
                        setSchedules(updated);
                      }}
                      placeholder="08:00 WIB"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Jam Selesai:</label>
                    <input
                      type="text"
                      value={sch.endTime}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].endTime = e.target.value;
                        setSchedules(updated);
                      }}
                      placeholder="10:00 WIB / Selesai"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Nama Tempat / Gedung:</label>
                    <input
                      type="text"
                      value={sch.venueName}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].venueName = e.target.value;
                        setSchedules(updated);
                      }}
                      placeholder="Masjid Agung / Grand Ballroom"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Link Google Maps:</label>
                    <input
                      type="text"
                      value={sch.mapsUrl}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].mapsUrl = e.target.value;
                        setSchedules(updated);
                      }}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Alamat Lengkap Venue:</label>
                  <textarea
                    rows={2}
                    value={sch.address}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].address = e.target.value;
                      setSchedules(updated);
                    }}
                    placeholder="Jl. Diponegoro No. 12, Surabaya, Jawa Timur"
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs focus:border-[#F97316] outline-none"
                  />
                </div>
              </div>
            ))}

            {tier === "FREE" && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#F97316] shrink-0" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-[#F97316]">Masa Aktif Paket Gratis:</span> Tautan website undangan Anda otomatis aktif sampai <strong>H+7</strong> setelah tanggal acara pernikahan.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion 3: Galeri & Musik Latar */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(2)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 min-h-[52px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="block">{sections[2].title}</span>
              <span className="text-[11px] text-slate-400 font-normal">Foto prewedding, background audio &amp; YouTube video</span>
            </div>
          </div>
          {openSection === 2 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection === 2 && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#E2E8F0] space-y-4 text-xs animate-in fade-in">
            {/* Background Musik & Video */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>URL Background Music (.mp3):</span>
                </label>
                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="https://.../lagu-romantis.mp3"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                />
                <p className="text-[10px] text-slate-400">Musik berputar otomatis saat tamu menekan Buka Undangan.</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Link Video Teaser (YouTube):</span>
                </label>
                <input
                  type="text"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                />
                <p className="text-[10px] text-slate-400">Opsional: sematkan video prewedding sinematik.</p>
              </div>
            </div>

            {/* Galeri Prewedding */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800 text-xs">
                    Daftar Foto Prewedding ({galleries.length} Foto)
                  </h4>
                  {tier === "FREE" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      Paket Gratis: Maks. 5 Foto ({galleries.length}/5)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  disabled={tier === "FREE" && galleries.length >= 5}
                  onClick={() => {
                    if (tier === "FREE" && galleries.length >= 5) return;
                    setGalleries([
                      ...galleries,
                      {
                        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                        caption: `Momen Manis #${galleries.length + 1}`,
                        sortOrder: galleries.length,
                      },
                    ]);
                  }}
                  className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-lg font-semibold text-xs border transition-colors ${
                    tier === "FREE" && galleries.length >= 5
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-orange-50 text-[#F97316] hover:bg-orange-100 border-orange-100"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto</span>
                </button>
              </div>

              {tier === "FREE" && galleries.length >= 5 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Batas maksimal <strong>5 foto</strong> untuk Paket Gratis telah tercapai. Upgrade paket untuk upload foto galeri tanpa batas.
                    </span>
                  </div>
                  {onUpgradeClick && (
                    <button
                      type="button"
                      onClick={onUpgradeClick}
                      className="px-3 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer"
                    >
                      Upgrade Paket
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {galleries.map((gal, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700">Foto #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setGalleries(galleries.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={gal.imageUrl}
                      onChange={(e) => {
                        const updated = [...galleries];
                        updated[idx].imageUrl = e.target.value;
                        setGalleries(updated);
                      }}
                      placeholder="URL Gambar (https://...)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs focus:border-[#F97316] outline-none"
                    />

                    <input
                      type="text"
                      value={gal.caption}
                      onChange={(e) => {
                        const updated = [...galleries];
                        updated[idx].caption = e.target.value;
                        setGalleries(updated);
                      }}
                      placeholder="Keterangan foto..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs focus:border-[#F97316] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 4: Amplop Digital & QRIS */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(3)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 min-h-[52px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="block">{sections[3].title}</span>
              <span className="text-[11px] text-slate-400 font-normal">Rekening bank, e-wallet &amp; scan QRIS donasi</span>
            </div>
          </div>
          {openSection === 3 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection === 3 && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#E2E8F0] space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pt-4">
              <p className="text-slate-500 text-xs">
                Tamu dapat mengirimkan hadiah tanda kasih langsung via rekening bank atau scan QRIS.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBankAccounts([
                    ...bankAccounts,
                    {
                      bankName: "BCA",
                      accountNumber: "",
                      accountHolder: "",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-50 text-[#F97316] hover:bg-blue-100 font-semibold text-xs border border-orange-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            {bankAccounts.map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="font-semibold text-slate-900 text-xs">
                    Rekening #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Pilihan Bank / Dompet:</label>
                    <select
                      value={b.bankName}
                      onChange={(e) => {
                        const updated = [...bankAccounts];
                        updated[idx].bankName = e.target.value;
                        setBankAccounts(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    >
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BNI">BNI</option>
                      <option value="BRI">BRI</option>
                      <option value="BSI">BSI (Syariah)</option>
                      <option value="Bank Jago">Bank Jago</option>
                      <option value="SeaBank">SeaBank</option>
                      <option value="Dana">Dana</option>
                      <option value="GoPay">GoPay</option>
                      <option value="OVO">OVO</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Nomor Rekening / No HP:</label>
                    <input
                      type="text"
                      value={b.accountNumber}
                      onChange={(e) => {
                        const updated = [...bankAccounts];
                        updated[idx].accountNumber = e.target.value;
                        setBankAccounts(updated);
                      }}
                      placeholder="8291039481"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Atas Nama Penerima:</label>
                    <input
                      type="text"
                      value={b.accountHolder}
                      onChange={(e) => {
                        const updated = [...bankAccounts];
                        updated[idx].accountHolder = e.target.value;
                        setBankAccounts(updated);
                      }}
                      placeholder="Rian Pratama"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">URL Foto Kode QRIS (Opsional):</label>
                  <input
                    type="text"
                    value={b.qrisImageUrl || ""}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].qrisImageUrl = e.target.value;
                      setBankAccounts(updated);
                    }}
                    placeholder="https://.../qris-donasi.png"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 5: Kisah Cinta (Love Story) */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(4)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-50 min-h-[52px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="block">{sections[4].title}</span>
              <span className="text-[11px] text-slate-400 font-normal">Timeline perjalanan cinta dari pertama kenal hingga lamaran</span>
            </div>
          </div>
          {openSection === 4 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection === 4 && (
          <div className="p-4 sm:p-5 pt-0 border-t border-[#E2E8F0] space-y-4 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pt-4">
              <p className="text-slate-500 text-xs">
                Ceritakan momen berkesan perjalanan cinta Anda berdua.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStories([
                    ...stories,
                    {
                      date: "2024",
                      title: "Pertama Bertemu",
                      story: "Pertama kali kami dipertemukan di sebuah kedai kopi di Bandung...",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-50 text-[#F97316] hover:bg-blue-100 font-semibold text-xs border border-orange-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Momen</span>
              </button>
            </div>

            {stories.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 relative"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <span className="font-semibold text-slate-900 text-xs">Momen #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setStories(stories.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Tahun / Tanggal Momen:</label>
                    <input
                      type="text"
                      value={st.date}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].date = e.target.value;
                        setStories(updated);
                      }}
                      placeholder="Maret 2024"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Judul Cerita:</label>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const updated = [...stories];
                        updated[idx].title = e.target.value;
                        setStories(updated);
                      }}
                      placeholder="Hari Lamaran Bahagia"
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 min-h-[42px] focus:border-[#F97316] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Isi Cerita Singkat:</label>
                  <textarea
                    rows={3}
                    value={st.story}
                    onChange={(e) => {
                      const updated = [...stories];
                      updated[idx].story = e.target.value;
                      setStories(updated);
                    }}
                    placeholder="Tuliskan kisah indah di balik momen ini..."
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs focus:border-[#F97316] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditorTab;
