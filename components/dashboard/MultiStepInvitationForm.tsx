"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { ThemeId, WeddingInvitationData } from "@/types/wedding";
import ThemeSelectorBar from "./ThemeSelectorBar";

interface MultiStepInvitationFormProps {
  initialData?: Partial<WeddingInvitationData>;
  onSave: (data: WeddingInvitationData) => Promise<void>;
}

const STEPS = [
  { id: 1, label: "Mempelai", icon: Heart },
  { id: 2, label: "Acara", icon: Calendar },
  { id: 3, label: "Galeri & Kado", icon: CreditCard },
  { id: 4, label: "Tema & Review", icon: ImageIcon },
];

export const MultiStepInvitationForm: React.FC<MultiStepInvitationFormProps> = ({
  initialData,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState(initialData?.title || "Pernikahan Rian & Sinta");
  const [slug, setSlug] = useState(initialData?.slug || "rian-sinta");
  const [themeId, setThemeId] = useState<ThemeId>(
    (initialData?.themeId as ThemeId) || "minimalist"
  );
  const [greetingMessage, setGreetingMessage] = useState(
    initialData?.coupleInfo?.greetingMessage || ""
  );

  // Groom & Bride
  const [groomName, setGroomName] = useState(initialData?.coupleInfo?.groomName || "Rian Pratama");
  const [groomNickname, setGroomNickname] = useState(
    initialData?.coupleInfo?.groomNickname || "Rian"
  );
  const [groomFather, setGroomFather] = useState(initialData?.coupleInfo?.groomFather || "");
  const [groomMother, setGroomMother] = useState(initialData?.coupleInfo?.groomMother || "");
  const [groomInstagram, setGroomInstagram] = useState(
    initialData?.coupleInfo?.groomInstagram || "rian.pratama"
  );
  const [groomPhoto, setGroomPhoto] = useState(initialData?.coupleInfo?.groomPhoto || "");

  const [brideName, setBrideName] = useState(
    initialData?.coupleInfo?.brideName || "Sinta Anggraini"
  );
  const [brideNickname, setBrideNickname] = useState(
    initialData?.coupleInfo?.brideNickname || "Sinta"
  );
  const [brideFather, setBrideFather] = useState(initialData?.coupleInfo?.brideFather || "");
  const [brideMother, setBrideMother] = useState(initialData?.coupleInfo?.brideMother || "");
  const [brideInstagram, setBrideInstagram] = useState(
    initialData?.coupleInfo?.brideInstagram || "sinta.anggraini"
  );
  const [bridePhoto, setBridePhoto] = useState(initialData?.coupleInfo?.bridePhoto || "");

  // Schedules
  const [schedules, setSchedules] = useState(
    initialData?.eventSchedules?.length
      ? initialData.eventSchedules
      : [
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
        ]
  );

  // Galleries
  const [galleries, setGalleries] = useState(
    initialData?.galleries?.length
      ? initialData.galleries
      : [
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
        ]
  );

  // Bank Accounts
  const [bankAccounts, setBankAccounts] = useState(
    initialData?.bankAccounts?.length
      ? initialData.bankAccounts
      : [
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
        ]
  );

  const previewPayload: WeddingInvitationData = {
    id: initialData?.id || "preview-id",
    slug,
    title,
    themeId,
    coupleInfo: {
      groomName,
      groomNickname,
      groomFather,
      groomMother,
      groomInstagram,
      groomPhoto,
      brideName,
      brideNickname,
      brideFather,
      brideMother,
      brideInstagram,
      bridePhoto,
      greetingMessage,
    },
    isActive: true,
    eventSchedules: schedules,
    galleries,
    bankAccounts,
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSave(previewPayload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-medium transition-all ${
                isCurrent
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : isDone
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200"
                  : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500"
              }`}
            >
              {isDone ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Steps */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Step 1: Info Mempelai */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Informasi Calon Pengantin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Judul Undangan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Slug URL (cth: rian-sinta)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="w-full p-2.5 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Pengantin Pria
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap Pria"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Panggilan Pria"
                  value={groomNickname}
                  onChange={(e) => setGroomNickname(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Ayah"
                  value={groomFather}
                  onChange={(e) => setGroomFather(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Ibu"
                  value={groomMother}
                  onChange={(e) => setGroomMother(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Instagram (@rian)"
                  value={groomInstagram}
                  onChange={(e) => setGroomInstagram(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="URL Foto Pria"
                  value={groomPhoto}
                  onChange={(e) => setGroomPhoto(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Pengantin Wanita
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap Wanita"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Panggilan Wanita"
                  value={brideNickname}
                  onChange={(e) => setBrideNickname(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Ayah"
                  value={brideFather}
                  onChange={(e) => setBrideFather(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Nama Ibu"
                  value={brideMother}
                  onChange={(e) => setBrideMother(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="Instagram (@sinta)"
                  value={brideInstagram}
                  onChange={(e) => setBrideInstagram(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
                <input
                  type="text"
                  placeholder="URL Foto Wanita"
                  value={bridePhoto}
                  onChange={(e) => setBridePhoto(e.target.value)}
                  className="p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Pesan / Kata Pengantar
              </label>
              <textarea
                rows={3}
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                placeholder="Tuliskan ungkapan syukur atau pengantar undangan..."
                className="w-full p-2.5 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
              />
            </div>
          </div>
        )}

        {/* Step 2: Jadwal Acara */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Rangkaian Jadwal Acara
              </h3>
              <button
                type="button"
                onClick={() =>
                  setSchedules([
                    ...schedules,
                    {
                      eventName: "Acara Tambahan",
                      date: "2026-10-24T18:00:00.000Z",
                      startTime: "18:00",
                      endTime: "21:00",
                      venueName: "Nama Lokasi",
                      address: "Alamat Lengkap",
                      mapsUrl: "https://maps.google.com",
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium bg-amber-600 text-white hover:bg-amber-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Acara</span>
              </button>
            </div>

            <div className="space-y-4">
              {schedules.map((sc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      Acara #{idx + 1}
                    </span>
                    {schedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Acara (cth: Akad Nikah)"
                      value={sc.eventName}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].eventName = e.target.value;
                        setSchedules(updated);
                      }}
                      className="p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                    />
                    <input
                      type="text"
                      placeholder="Waktu Mulai (08:00)"
                      value={sc.startTime}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].startTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                    />
                    <input
                      type="text"
                      placeholder="Waktu Selesai (10:00)"
                      value={sc.endTime || ""}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].endTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Tempat (Gedung/Masjid)"
                      value={sc.venueName}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].venueName = e.target.value;
                        setSchedules(updated);
                      }}
                      className="p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                    />
                    <input
                      type="text"
                      placeholder="URL Google Maps"
                      value={sc.mapsUrl || ""}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].mapsUrl = e.target.value;
                        setSchedules(updated);
                      }}
                      className="p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Alamat Lengkap Lokasi"
                    value={sc.address}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].address = e.target.value;
                      setSchedules(updated);
                    }}
                    className="w-full p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Galeri & Kado */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Galeri Foto &amp; Rekening Tanda Kasih
            </h3>

            {/* Rekening Bank */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Rekening / E-Wallet
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setBankAccounts([
                      ...bankAccounts,
                      { bankName: "BCA", accountNumber: "", accountHolder: "" },
                    ])
                  }
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  + Tambah Rekening
                </button>
              </div>

              {bankAccounts.map((acc, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Bank (BCA/Mandiri)"
                    value={acc.bankName}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].bankName = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="w-1/3 p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                  />
                  <input
                    type="text"
                    placeholder="Nomor Rekening"
                    value={acc.accountNumber}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].accountNumber = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="w-1/3 p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                  />
                  <input
                    type="text"
                    placeholder="Atas Nama"
                    value={acc.accountHolder}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].accountHolder = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="w-1/3 p-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700"
                  />
                  {bankAccounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Galeri Foto */}
            <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Foto Galeri
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setGalleries([
                      ...galleries,
                      {
                        imageUrl:
                          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                        caption: `Foto ${galleries.length + 1}`,
                        sortOrder: galleries.length,
                      },
                    ])
                  }
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                >
                  + Tambah Foto
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleries.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGalleries(galleries.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tema & Review */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Pilihan Desain &amp; Live Mobile Preview
            </h3>

            {/* Theme Selector Bar with 1-click switch & live mobile preview */}
            <ThemeSelectorBar
              currentThemeId={themeId}
              onSelectTheme={(selected) => setThemeId(selected)}
              previewData={previewPayload}
            />
          </div>
        )}

        {/* Action Buttons Nav */}
        <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900"
            >
              <span>Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAll}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-900/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan & Publikasikan"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepInvitationForm;
