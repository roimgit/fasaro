"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Edit3,
  ExternalLink,
  Heart,
  Music,
  Palette,
  Plus,
  QrCode,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { THEME_LIST, ThemeId, WeddingInvitationData } from "@/types/wedding";
import ThemeRenderer from "@/components/templates/ThemeRenderer";

interface GuestItem {
  id: string;
  name: string;
  slugCode: string;
  quota: number;
  phoneNumber?: string | null;
  checkedInAt?: string | null;
}

interface RsvpRecapData {
  totalResponses: number;
  attendingCount: number;
  notAttendingCount: number;
  tentativeCount: number;
  totalPax: number;
  rsvps: Array<{
    id: string;
    guestName: string;
    status: string;
    attendeeCount: number;
    sessionChosen?: string | null;
    createdAt: string;
  }>;
}

export default function ClientDashboard() {
  const [activeNav, setActiveNav] = useState<"editor" | "theme" | "guests" | "rsvp" | "billing">(
    "editor"
  );
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form states
  const [invitationId, setInvitationId] = useState<string>("");
  const [title, setTitle] = useState("Pernikahan Mempelai");
  const [slug, setSlug] = useState("mempelai");
  const [themeId, setThemeId] = useState<ThemeId>("adirara");
  const [isActive, setIsActive] = useState(true);
  const [tier, setTier] = useState<string>("STARTER");

  // Couple Info
  const [groomName, setGroomName] = useState("");
  const [groomNickname, setGroomNickname] = useState("");
  const [groomFather, setGroomFather] = useState("");
  const [groomMother, setGroomMother] = useState("");
  const [groomInstagram, setGroomInstagram] = useState("");
  const [groomPhoto, setGroomPhoto] = useState("");

  const [brideName, setBrideName] = useState("");
  const [brideNickname, setBrideNickname] = useState("");
  const [brideFather, setBrideFather] = useState("");
  const [brideMother, setBrideMother] = useState("");
  const [brideInstagram, setBrideInstagram] = useState("");
  const [bridePhoto, setBridePhoto] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");

  // Love Stories
  const [stories, setStories] = useState<
    Array<{ date: string; title: string; story: string }>
  >([]);

  // Schedules
  const [schedules, setSchedules] = useState<
    Array<{
      id?: string;
      eventName: string;
      date: string;
      startTime: string;
      endTime: string;
      venueName: string;
      address: string;
      mapsUrl: string;
    }>
  >([]);

  // Galleries & Music
  const [galleries, setGalleries] = useState<
    Array<{ imageUrl: string; caption: string; sortOrder: number }>
  >([]);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>("");

  // Bank Accounts & QRIS
  const [bankAccounts, setBankAccounts] = useState<
    Array<{
      id?: string;
      bankName: string;
      accountNumber: string;
      accountHolder: string;
      qrisImageUrl?: string;
    }>
  >([]);

  // Guests & WA Blast
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestQuota, setNewGuestQuota] = useState(1);
  const [bulkGuestText, setBulkGuestText] = useState("");
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // RSVP Stats
  const [rsvpRecap, setRsvpRecap] = useState<RsvpRecapData | null>(null);

  // Payment Upload Proof
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Fetch Invitation, Guests, and RSVP
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsLoading(true);
      setNotification(null);
    }
    try {
      const [resInv, resGuests, resRsvp] = await Promise.all([
        fetch("/api/dashboard/invitation"),
        fetch("/api/dashboard/guests"),
        fetch("/api/dashboard/rsvp-recap"),
      ]);

      if (resInv.ok) {
        const json = await resInv.json();
        const data = json.data;
        if (data) {
          setInvitationId(data.id || "");
          setTitle(data.title || "Pernikahan Mempelai");
          setSlug(data.slug || "undangan");
          setThemeId((data.themeId as ThemeId) || "adirara");
          setIsActive(data.isActive !== undefined ? data.isActive : true);
          setTier(data.tier || "STARTER");

          const c = data.coupleInfo || {};
          setGroomName(c.groomName || "");
          setGroomNickname(c.groomNickname || "");
          setGroomFather(c.groomFather || "");
          setGroomMother(c.groomMother || "");
          setGroomInstagram(c.groomInstagram || "");
          setGroomPhoto(c.groomPhoto || "");

          setBrideName(c.brideName || "");
          setBrideNickname(c.brideNickname || "");
          setBrideFather(c.brideFather || "");
          setBrideMother(c.brideMother || "");
          setBrideInstagram(c.brideInstagram || "");
          setBridePhoto(c.bridePhoto || "");
          setGreetingMessage(c.greetingMessage || "");
          setStories(c.stories || []);

          if (data.eventSchedules?.length) {
            setSchedules(
              data.eventSchedules.map((s: {
                id?: string;
                eventName: string;
                date: string;
                startTime: string;
                endTime?: string | null;
                venueName: string;
                address: string;
                mapsUrl?: string | null;
              }) => ({
                id: s.id,
                eventName: s.eventName,
                date: s.date ? new Date(s.date).toISOString().slice(0, 10) : "",
                startTime: s.startTime || "09:00",
                endTime: s.endTime || "12:00",
                venueName: s.venueName || "",
                address: s.address || "",
                mapsUrl: s.mapsUrl || "",
              }))
            );
          } else {
            setSchedules([
              {
                eventName: "Akad Nikah",
                date: "2026-10-24",
                startTime: "08:00",
                endTime: "10:00",
                venueName: "Masjid Agung Al-Falah",
                address: "Jl. Diponegoro No. 12, Surabaya",
                mapsUrl: "https://maps.google.com",
              },
            ]);
          }

          setGalleries(data.galleries || []);
          setBankAccounts(data.bankAccounts || []);
          setMusicUrl(data.musicUrl || "");
        }
      }

      if (resGuests.ok) {
        const json = await resGuests.json();
        setGuests(json.data?.guests || []);
      }

      if (resRsvp.ok) {
        const json = await resRsvp.json();
        setRsvpRecap(json.data || null);
      }
    } catch {
      setNotification({ type: "error", message: "Gagal memuat data undangan pengantin." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboardData(false);
  }, [loadDashboardData]);

  // Upload S3 Presigned URL helper
  const handleUploadImage = async (
    file: File,
    folder: "couples" | "galleries" | "qris" | "proofs"
  ): Promise<string> => {
    const res = await fetch(
      `/api/upload/presigned-url?filename=${encodeURIComponent(
        file.name
      )}&contentType=${encodeURIComponent(file.type)}&folder=${folder}`
    );
    if (!res.ok) {
      throw new Error("Gagal membuat presigned URL upload S3/MinIO");
    }
    const { uploadUrl, fileUrl } = await res.json();

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) {
      throw new Error("Gagal mengupload file ke MinIO/S3");
    }
    return fileUrl;
  };

  // Save Invitation Form Builder
  const handleSaveInvitation = async () => {
    setIsSaving(true);
    setNotification(null);
    try {
      const payload = {
        title,
        slug,
        themeId,
        isActive,
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
          stories,
        },
        schedules: schedules.map((s) => ({
          ...s,
          date: s.date.includes("T") ? s.date : `${s.date}T00:00:00.000Z`,
        })),
        galleries,
        bankAccounts,
        musicUrl,
        youtubeVideoUrl,
      };

      const res = await fetch("/api/dashboard/invitation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan undangan.");
      }

      setNotification({
        type: "success",
        message: "Perubahan undangan berhasil disimpan dan tayang seketika! 🎉",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add Guest Single
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    try {
      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGuestName,
          phoneNumber: newGuestPhone,
          quota: newGuestQuota,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menambah tamu");

      setGuests([...guests, json.data]);
      setNewGuestName("");
      setNewGuestPhone("");
      setNewGuestQuota(1);
      setNotification({ type: "success", message: `Tamu "${json.data.name}" berhasil ditambahkan.` });
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menambah tamu",
      });
    }
  };

  // Bulk Add Guests
  const handleBulkAddGuests = async () => {
    const lines = bulkGuestText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    try {
      const guestItems = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        return {
          name: parts[0],
          phoneNumber: parts[1] || "",
          quota: parts[2] ? parseInt(parts[2], 10) || 1 : 1,
        };
      });

      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: guestItems }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal import tamu");

      setGuests([...guests, ...json.data]);
      setBulkGuestText("");
      setIsBulkAdding(false);
      setNotification({
        type: "success",
        message: `Berhasil menambahkan ${json.data.length} tamu sekaligus!`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal import tamu",
      });
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Hapus tamu "${name}" dari daftar?`)) return;
    try {
      const res = await fetch(`/api/dashboard/guests?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setGuests(guests.filter((g) => g.id !== id));
      setNotification({ type: "success", message: `Tamu "${name}" telah dihapus.` });
    } catch {
      setNotification({ type: "error", message: "Gagal menghapus tamu." });
    }
  };

  // WhatsApp Blast Generator
  const generateWhatsAppUrl = (guest: GuestItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://fasaro.id";
    const invitationLink = `${origin}/invitation/${slug}?to=${encodeURIComponent(guest.name)}`;

    const messageTemplate = `Kepada Yth. Bapak/Ibu/Saudara/i *${guest.name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia pernikahan kami:

*${title}*

Buka tautan undangan resmi berikut:
${invitationLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.
Salam hangat,
*${groomNickname || "Mempelai"} & ${brideNickname || "Mempelai"}*`;

    let cleanPhone = (guest.phoneNumber || "").replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }

    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(messageTemplate)}`;
  };

  // Demo Wedding Data for Preview
  const previewData: WeddingInvitationData = {
    id: invitationId || "preview-id",
    slug: slug || "demo",
    title: title || "Pernikahan Kami",
    themeId,
    isActive,
    musicUrl,
    coupleInfo: {
      groomName: groomName || "Rian Pratama",
      groomNickname: groomNickname || "Rian",
      groomFather,
      groomMother,
      groomInstagram,
      groomPhoto:
        groomPhoto ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      brideName: brideName || "Sinta Anggraini",
      brideNickname: brideNickname || "Sinta",
      brideFather,
      brideMother,
      brideInstagram,
      bridePhoto:
        bridePhoto ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      greetingMessage,
      stories,
    },
    eventSchedules: schedules.map((s, idx) => ({
      id: s.id || `sch-${idx}`,
      eventName: s.eventName,
      date: s.date.includes("T") ? s.date : `${s.date}T00:00:00.000Z`,
      startTime: s.startTime,
      endTime: s.endTime,
      venueName: s.venueName,
      address: s.address,
      mapsUrl: s.mapsUrl,
    })),
    galleries,
    bankAccounts,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans pb-28 md:pb-12 selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-[180px] sm:max-w-xs">
                  {title}
                </h2>
                {isLoading && (
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-stone-400">/{slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Preview Button */}
            <button
              onClick={() => setShowMobilePreview(true)}
              className="inline-flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold min-h-[44px] transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Preview HP</span>
            </button>

            {/* View Live Invitation */}
            <a
              href={`/invitation/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold min-h-[44px] transition-all shadow-md shadow-amber-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Web Live</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium border flex items-center justify-between gap-3 animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Desktop Navigation Tabs (>=768px) */}
        <div className="hidden md:flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            {[
              { id: "editor", label: "Form Editor", icon: Edit3 },
              { id: "theme", label: "Tema & Preview", icon: Palette },
              { id: "guests", label: `Buku Tamu (${guests.length})`, icon: Users },
              { id: "rsvp", label: "Rekap RSVP", icon: UserCheck },
              { id: "billing", label: "Upgrade Paket", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActiveTab = activeNav === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveNav(tab.id as typeof activeNav)}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold min-h-[44px] transition-all ${
                    isActiveTab
                      ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                tier === "ULTIMATE"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : tier === "ELEGANT"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-stone-800 text-stone-300"
              }`}
            >
              Paket {tier}
            </span>
          </div>
        </div>

        {/* TAB 1: FORM BUILDER ACCORDION */}
        {activeNav === "editor" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Form Builder Undangan
                </h1>
                <p className="text-xs text-stone-400">
                  Edit informasi kedua mempelai, jadwal acara, galeri, dan amplop digital.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveInvitation}
                disabled={isSaving}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/25 min-h-[44px] transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Menyimpan..." : "Simpan Undangan"}</span>
              </button>
            </div>

            {/* Accordion 1: Mempelai */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base text-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span>1. Informasi Kedua Mempelai</span>
                </div>
                {activeAccordion === 0 ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>

              {activeAccordion === 0 && (
                <div className="p-5 pt-0 border-t border-stone-800/80 space-y-6 text-xs animate-in fade-in">
                  {/* Judul & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-300">Judul Undangan:</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Pernikahan Rian & Sinta"
                        className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px] focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-300">Subdomain / Slug Tautan:</label>
                      <div className="flex items-center rounded-2xl bg-stone-950 border border-stone-800 px-3 min-h-[44px]">
                        <span className="text-stone-500 text-xs font-mono">fasaro.id/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          placeholder="rian-sinta"
                          className="w-full bg-transparent py-2.5 px-1 text-stone-100 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mempelai Pria */}
                  <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-3">
                    <h3 className="font-bold text-amber-400 text-sm">Mempelai Pria</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Lengkap &amp; Gelar:</label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          placeholder="Rian Pratama, S.Kom"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Panggilan:</label>
                        <input
                          type="text"
                          value={groomNickname}
                          onChange={(e) => setGroomNickname(e.target.value)}
                          placeholder="Rian"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Ayah:</label>
                        <input
                          type="text"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                          placeholder="Bpk. Bambang Wijaya"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Ibu:</label>
                        <input
                          type="text"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                          placeholder="Ibu Sri Wahyuni"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Instagram (@username):</label>
                        <input
                          type="text"
                          value={groomInstagram}
                          onChange={(e) => setGroomInstagram(e.target.value)}
                          placeholder="rian.pratama"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Foto Mempelai Pria (URL / Upload):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={groomPhoto}
                            onChange={(e) => setGroomPhoto(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                          <label className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer min-h-[44px] flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const url = await handleUploadImage(file, "couples");
                                  setGroomPhoto(url);
                                } catch {
                                  alert("Gagal mengupload foto ke S3/MinIO");
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mempelai Wanita */}
                  <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-3">
                    <h3 className="font-bold text-rose-400 text-sm">Mempelai Wanita</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Lengkap &amp; Gelar:</label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          placeholder="Sinta Anggraini, S.E"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Panggilan:</label>
                        <input
                          type="text"
                          value={brideNickname}
                          onChange={(e) => setBrideNickname(e.target.value)}
                          placeholder="Sinta"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Ayah:</label>
                        <input
                          type="text"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                          placeholder="Bpk. Herman Santoso"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Nama Ibu:</label>
                        <input
                          type="text"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                          placeholder="Ibu Dewi Lestari"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Instagram (@username):</label>
                        <input
                          type="text"
                          value={brideInstagram}
                          onChange={(e) => setBrideInstagram(e.target.value)}
                          placeholder="sinta.anggraini"
                          className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Foto Mempelai Wanita (URL / Upload):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bridePhoto}
                            onChange={(e) => setBridePhoto(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                          <label className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer min-h-[44px] flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const url = await handleUploadImage(file, "couples");
                                  setBridePhoto(url);
                                } catch {
                                  alert("Gagal mengupload foto ke S3/MinIO");
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pesan Sapaan */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-stone-300">Pesan / Ayat Pembuka:</label>
                    <textarea
                      rows={3}
                      value={greetingMessage}
                      onChange={(e) => setGreetingMessage(e.target.value)}
                      placeholder="Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan..."
                      className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Acara & Jadwal */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base text-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>2. Jadwal Acara (Akad &amp; Resepsi)</span>
                </div>
                {activeAccordion === 1 ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>

              {activeAccordion === 1 && (
                <div className="p-5 pt-0 border-t border-stone-800/80 space-y-4 text-xs animate-in fade-in">
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-stone-400">Atur waktu dan lokasi acara pernikahan:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSchedules([
                          ...schedules,
                          {
                            eventName: "Acara Tambahan",
                            date: "2026-10-24",
                            startTime: "18:00",
                            endTime: "21:00",
                            venueName: "",
                            address: "",
                            mapsUrl: "",
                          },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Sesi Acara</span>
                    </button>
                  </div>

                  {schedules.map((sch, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Sesi #{idx + 1}</span>
                        {schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-stone-400 block mb-1">Nama Acara:</label>
                          <input
                            type="text"
                            value={sch.eventName}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].eventName = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="Akad Nikah / Resepsi"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Tanggal Acara:</label>
                          <input
                            type="date"
                            value={sch.date}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].date = e.target.value;
                              setSchedules(up);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Waktu Mulai:</label>
                          <input
                            type="text"
                            value={sch.startTime}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].startTime = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="08:00 WIB"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Waktu Selesai:</label>
                          <input
                            type="text"
                            value={sch.endTime}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].endTime = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="11:00 WIB / Selesai"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-stone-400 block mb-1">Nama Gedung / Tempat:</label>
                          <input
                            type="text"
                            value={sch.venueName}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].venueName = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="Grand Ballroom Hotel Sahid"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-stone-400 block mb-1">Alamat Lengkap:</label>
                          <input
                            type="text"
                            value={sch.address}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].address = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="Jl. Kusuma Bangsa No. 88, Surabaya"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-stone-400 block mb-1">Link Google Maps:</label>
                          <input
                            type="url"
                            value={sch.mapsUrl}
                            onChange={(e) => {
                              const up = [...schedules];
                              up[idx].mapsUrl = e.target.value;
                              setSchedules(up);
                            }}
                            placeholder="https://maps.google.com/..."
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 3: Galeri & Musik */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base text-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span>3. Galeri Foto Prewedding &amp; Musik Latar</span>
                </div>
                {activeAccordion === 2 ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>

              {activeAccordion === 2 && (
                <div className="p-5 pt-0 border-t border-stone-800/80 space-y-6 text-xs animate-in fade-in">
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-300">
                        Foto Prewedding ({galleries.length}/20 Foto):
                      </span>
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold cursor-pointer min-h-[44px]">
                        <Upload className="w-4 h-4" />
                        <span>Upload Foto Baru</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await handleUploadImage(file, "galleries");
                              setGalleries([
                                ...galleries,
                                { imageUrl: url, caption: "Foto Prewedding", sortOrder: galleries.length },
                              ]);
                            } catch {
                              alert("Gagal upload foto");
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {galleries.map((g, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-stone-800 aspect-square group bg-stone-950">
                          <Image src={g.imageUrl} alt={g.caption || "Gallery"} fill unoptimized className="object-cover" />
                          <button
                            type="button"
                            onClick={() => setGalleries(galleries.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 hover:text-rose-300 opacity-90 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-stone-300 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-amber-400" />
                      <span>URL Musik Latar (MP3 Autoplay):</span>
                    </label>
                    <input
                      type="url"
                      value={musicUrl}
                      onChange={(e) => setMusicUrl(e.target.value)}
                      placeholder="https://.../romantic-wedding.mp3"
                      className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px]"
                    />
                    <p className="text-[11px] text-stone-500">
                      Biarkan kosong untuk menggunakan lagu romantis instrumental standar bawaan.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-stone-300">URL Video Prewedding / YouTube (Opsional):</label>
                    <input
                      type="url"
                      value={youtubeVideoUrl}
                      onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px]"
                    />
                    <p className="text-[11px] text-stone-500">
                      Tautan video YouTube akan disematkan secara elegan pada undangan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Amplop Digital */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base text-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span>4. Amplop Digital (Nomor Rekening &amp; QRIS)</span>
                </div>
                {activeAccordion === 3 ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>

              {activeAccordion === 3 && (
                <div className="p-5 pt-0 border-t border-stone-800/80 space-y-4 text-xs animate-in fade-in">
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-stone-400">Rekening untuk menerima kado digital dari tamu:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setBankAccounts([
                          ...bankAccounts,
                          {
                            bankName: "BCA",
                            accountNumber: "",
                            accountHolder: groomName || "Nama Pemilik",
                          },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Rekening</span>
                    </button>
                  </div>

                  {bankAccounts.map((b, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Rekening #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                          className="text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-stone-400 block mb-1">Nama Bank / E-Wallet:</label>
                          <input
                            type="text"
                            value={b.bankName}
                            onChange={(e) => {
                              const up = [...bankAccounts];
                              up[idx].bankName = e.target.value;
                              setBankAccounts(up);
                            }}
                            placeholder="BCA / Mandiri / GoPay"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Nomor Rekening:</label>
                          <input
                            type="text"
                            value={b.accountNumber}
                            onChange={(e) => {
                              const up = [...bankAccounts];
                              up[idx].accountNumber = e.target.value;
                              setBankAccounts(up);
                            }}
                            placeholder="8291039481"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Atas Nama (Pemilik):</label>
                          <input
                            type="text"
                            value={b.accountHolder}
                            onChange={(e) => {
                              const up = [...bankAccounts];
                              up[idx].accountHolder = e.target.value;
                              setBankAccounts(up);
                            }}
                            placeholder="Rian Pratama"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 5: Kisah Cinta */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 4 ? null : 4)}
                className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-base text-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>5. Kilas Balik Cerita Cinta (Love Story)</span>
                </div>
                {activeAccordion === 4 ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
              </button>

              {activeAccordion === 4 && (
                <div className="p-5 pt-0 border-t border-stone-800/80 space-y-4 text-xs animate-in fade-in">
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-stone-400">Bagikan momen berharga perjalanan cinta Anda:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setStories([
                          ...stories,
                          {
                            date: "Tahun 2025",
                            title: "Momen Bahagia",
                            story: "Cerita singkat perjalanan cinta kami...",
                          },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Momen</span>
                    </button>
                  </div>

                  {stories.map((st, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Momen #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setStories(stories.filter((_, i) => i !== idx))}
                          className="text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-stone-400 block mb-1">Tanggal / Waktu Momen:</label>
                          <input
                            type="text"
                            value={st.date}
                            onChange={(e) => {
                              const up = [...stories];
                              up[idx].date = e.target.value;
                              setStories(up);
                            }}
                            placeholder="12 Januari 2024"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="text-stone-400 block mb-1">Judul Momen:</label>
                          <input
                            type="text"
                            value={st.title}
                            onChange={(e) => {
                              const up = [...stories];
                              up[idx].title = e.target.value;
                              setStories(up);
                            }}
                            placeholder="Pertama Berjumpa"
                            className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 min-h-[44px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-stone-400 block mb-1">Cerita Singkat:</label>
                          <textarea
                            rows={2}
                            value={st.story}
                            onChange={(e) => {
                              const up = [...stories];
                              up[idx].story = e.target.value;
                              setStories(up);
                            }}
                            placeholder="Tuliskan kisah singkat perjalanan cinta..."
                            className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Save Button */}
            <div className="pt-2 md:hidden">
              <button
                type="button"
                onClick={handleSaveInvitation}
                disabled={isSaving}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 min-h-[48px] flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Menyimpan Undangan..." : "Simpan Perubahan Undangan"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REUSABLE THEME SELECTOR */}
        {activeNav === "theme" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Ganti Tema Estetik (1-Klik)
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Ganti gaya desain undangan pernikahan Anda kapan saja. Seluruh data mempelai, jadwal, dan foto Anda tersimpan aman tanpa hilang (Zero Data Loss).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {THEME_LIST.map((theme) => {
                const isSelected = themeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col bg-stone-900/60 ${
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/10 scale-[1.01]"
                        : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-stone-950">
                      <Image
                        src={theme.thumbnail || "/images/placeholder-theme.jpg"}
                        alt={theme.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        {isSelected && (
                          <div className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center gap-1 shadow-md">
                            <Check className="w-3 h-3" />
                            <span>Tema Aktif</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 border border-white/10">
                        {theme.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-white">{theme.name}</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{theme.description}</p>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500">
                          {isSelected ? "Sedang digunakan" : "Klik untuk pilih"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThemeId(theme.id);
                            setShowMobilePreview(true);
                          }}
                          className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Lihat Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveInvitation}
                disabled={isSaving}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg min-h-[44px] transition-all"
              >
                {isSaving ? "Menyimpan Tema..." : "Simpan & Terapkan Tema Ini"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: GUEST MANAGEMENT & WHATSAPP BLAST */}
        {activeNav === "guests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Buku Tamu &amp; Generator WhatsApp Blast
                </h1>
                <p className="text-xs text-stone-400">
                  Kirim undangan personal dengan sapaan nama tamu (*?to=Nama+Tamu*) via WhatsApp 1-klik.
                </p>
              </div>

              <button
                onClick={() => setIsBulkAdding(!isBulkAdding)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold min-h-[44px]"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{isBulkAdding ? "Input Satu per Satu" : "Import Banyak Nama Sekaligus"}</span>
              </button>
            </div>

            {/* Input Form Single */}
            {!isBulkAdding ? (
              <form
                onSubmit={handleAddGuest}
                className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5 sm:p-6 space-y-4"
              >
                <h3 className="font-bold text-sm text-white">Tambah Tamu Undangan Baru</h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-stone-400">Nama Tamu / Keluarga:</label>
                    <input
                      type="text"
                      required
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder="Bpk. Hendra &amp; Istri"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px]"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-stone-400">Nomor WhatsApp (Opsional):</label>
                    <input
                      type="tel"
                      value={newGuestPhone}
                      onChange={(e) => setNewGuestPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px]"
                    />
                  </div>

                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-stone-400">Pax:</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newGuestQuota}
                      onChange={(e) => setNewGuestQuota(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-center min-h-[44px]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold min-h-[44px] transition-all shadow-md"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Bulk Add Textarea */
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5 sm:p-6 space-y-3 text-xs">
                <h3 className="font-bold text-sm text-white">Import Banyak Tamu Sekaligus</h3>
                <p className="text-stone-400">
                  Tulis satu nama tamu per baris. Format: <code>Nama Tamu, No HP, Jumlah Pax</code> (contoh: <code>Budi Santoso, 08123456789, 2</code>).
                </p>
                <textarea
                  rows={5}
                  value={bulkGuestText}
                  onChange={(e) => setBulkGuestText(e.target.value)}
                  placeholder="Budi &amp; Pasangan, 08123456789, 2&#10;Keluarga Bpk. Hendra, 08198765432, 4&#10;Dinda Maharani"
                  className="w-full p-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleBulkAddGuests}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold min-h-[44px] shadow-md"
                >
                  Proses Import Tamu
                </button>
              </div>
            )}

            {/* Guest List Cards / Table */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300">
                  Total Terdaftar: <span className="text-amber-400 font-bold">{guests.length} Tamu</span>
                </span>
              </div>

              <div className="divide-y divide-stone-800/80">
                {guests.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    Belum ada tamu yang didaftarkan. Gunakan form di atas untuk menambahkan tamu.
                  </div>
                ) : (
                  guests.map((guest) => {
                    const waUrl = generateWhatsAppUrl(guest);
                    const directUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${slug}?to=${encodeURIComponent(guest.name)}`;

                    return (
                      <div
                        key={guest.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-stone-850/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-white">{guest.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[10px]">
                              {guest.quota} Pax
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">{guest.phoneNumber || "Tanpa No. HP"}</p>
                        </div>

                        {/* Actions: Copy Link & WhatsApp Blast */}
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(directUrl);
                              setNotification({
                                type: "success",
                                message: `Tautan untuk ${guest.name} berhasil disalin!`,
                              });
                            }}
                            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-medium min-h-[44px]"
                            title="Salin Link Tamu"
                          >
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>Salin Link</span>
                          </button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold min-h-[44px] shadow-sm shadow-emerald-900/30"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Kirim WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="p-2.5 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Hapus Tamu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REKAP RSVP */}
        {activeNav === "rsvp" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Statistik Kehadiran &amp; RSVP
              </h1>
              <p className="text-xs text-stone-400">
                Konfirmasi kehadiran tamu secara real-time untuk perhitungan konsumsi katering.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400">Total Respon</span>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {rsvpRecap?.totalResponses ?? 0}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-1">
                <span className="text-xs text-emerald-400">Pasti Hadir</span>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                  {rsvpRecap?.attendingCount ?? 0}
                </p>
                <p className="text-[10px] text-stone-500">{rsvpRecap?.totalPax ?? 0} Total Porsi</p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-1">
                <span className="text-xs text-rose-400">Berhalangan</span>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-rose-400">
                  {rsvpRecap?.notAttendingCount ?? 0}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-1">
                <span className="text-xs text-amber-400">Masih Ragu</span>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  {rsvpRecap?.tentativeCount ?? 0}
                </p>
              </div>
            </div>

            {/* List RSVPs */}
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 overflow-hidden">
              <div className="p-4 border-b border-stone-800">
                <h3 className="font-serif font-bold text-sm text-white">Daftar Konfirmasi Tamu</h3>
              </div>

              <div className="divide-y divide-stone-800/80">
                {!rsvpRecap?.rsvps?.length ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    Belum ada tamu yang mengisi konfirmasi RSVP.
                  </div>
                ) : (
                  rsvpRecap.rsvps.map((r) => (
                    <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{r.guestName}</div>
                        <div className="text-[11px] text-stone-500">
                          {new Date(r.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.status === "ATTENDING"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : r.status === "NOT_ATTENDING"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {r.status === "ATTENDING"
                            ? `Hadir (${r.attendeeCount} Orang)`
                            : r.status === "NOT_ATTENDING"
                            ? "Berhalangan"
                            : "Belum Pasti"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: UPGRADE PAKET & BILLING */}
        {activeNav === "billing" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Paket Langganan &amp; Pembayaran
              </h1>
              <p className="text-xs text-stone-400">
                Tingkatkan paket untuk masa aktif lebih panjang, custom domain, dan prioritas VIP.
              </p>
            </div>

            {paymentSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {paymentSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Starter */}
              <div className="p-6 rounded-3xl border border-stone-800 bg-stone-900/60 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-400">STARTER</span>
                  <p className="text-2xl font-serif font-bold text-white">Rp 69.000</p>
                  <ul className="text-xs text-stone-400 space-y-1.5 pt-2">
                    <li>&bull; Masa aktif 3 Bulan</li>
                    <li>&bull; Subdomain namapasangan.fasaro.id</li>
                    <li>&bull; Buku ucapan &amp; RSVP online</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert("Untuk upgrade paket Starter, pilih metode pembayaran Gateway atau Transfer QRIS di bawah.")
                  }
                  className="w-full py-2.5 rounded-xl border border-stone-700 bg-stone-800 text-stone-200 text-xs font-bold min-h-[44px]"
                >
                  Pilih Starter
                </button>
              </div>

              {/* Elegant */}
              <div className="p-6 rounded-3xl border-2 border-amber-500/50 bg-stone-900/90 space-y-4 flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
                <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                  TERPOPULER
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400">ELEGANT</span>
                  <p className="text-2xl font-serif font-bold text-white">Rp 149.000</p>
                  <ul className="text-xs text-stone-300 space-y-1.5 pt-2">
                    <li>&bull; Masa aktif 1 Tahun Penuh</li>
                    <li>&bull; Bebas ganti tema kapan saja</li>
                    <li>&bull; Amplop digital QRIS &amp; multi bank</li>
                    <li>&bull; Audio autoplay &amp; galeri 20 foto</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert("Untuk upgrade paket Elegant, gunakan tombol pembayaran di bawah.")
                  }
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold min-h-[44px]"
                >
                  Pilih Elegant
                </button>
              </div>

              {/* Ultimate */}
              <div className="p-6 rounded-3xl border border-purple-500/40 bg-stone-900/60 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-400">ULTIMATE EVENT DAY</span>
                  <p className="text-2xl font-serif font-bold text-white">Rp 279.000</p>
                  <ul className="text-xs text-stone-400 space-y-1.5 pt-2">
                    <li>&bull; Masa aktif Selamanya</li>
                    <li>&bull; Support Custom Domain (.my.id / .com)</li>
                    <li>&bull; QR Check-in tamu hari-H</li>
                    <li>&bull; Prioritas Customer Support WA</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert("Untuk upgrade paket Ultimate, gunakan tombol pembayaran di bawah.")
                  }
                  className="w-full py-2.5 rounded-xl border border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold min-h-[44px]"
                >
                  Pilih Ultimate
                </button>
              </div>
            </div>

            {/* Manual QRIS Transfer Upload Box */}
            <div className="p-6 rounded-3xl border border-stone-800 bg-stone-900/60 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Pembayaran Manual Transfer QRIS / Bank</span>
              </h3>
              <p className="text-stone-400">
                Transfer ke rekening admin <strong>BCA 8291039481 a/n PT Fasaro Digital</strong>, lalu unggah foto bukti struk transfer di bawah ini untuk diverifikasi admin.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={paymentProofUrl}
                  onChange={(e) => setPaymentProofUrl(e.target.value)}
                  placeholder="URL bukti transfer atau upload..."
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 min-h-[44px]"
                />

                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>Upload Struk</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await handleUploadImage(file, "proofs");
                        setPaymentProofUrl(url);
                      } catch {
                        alert("Gagal upload struk pembayaran");
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={async () => {
                    if (!paymentProofUrl) {
                      alert("Silakan unggah atau masukkan URL foto bukti transfer terlebih dahulu.");
                      return;
                    }
                    try {
                      const res = await fetch("/api/payment/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          invitationId,
                          tier: "ELEGANT",
                          paymentType: "MANUAL_QRIS",
                          proofImageUrl: paymentProofUrl,
                        }),
                      });
                      if (!res.ok) throw new Error("Gagal mengirim pesanan");
                      setPaymentSuccessMsg(
                        "Bukti transfer berhasil dikirim! Status pesanan kini WAITING_VERIFICATION dan akan disetujui Admin dalam waktu singkat."
                      );
                      setPaymentProofUrl("");
                    } catch {
                      alert("Gagal memproses pembayaran manual.");
                    }
                  }}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold min-h-[44px] shadow-md"
                >
                  Kirim Bukti Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (<768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stone-950/95 border-t border-stone-800 backdrop-blur-lg px-2 py-2 flex items-center justify-around shadow-2xl">
        {[
          { id: "editor", label: "Editor", icon: Edit3 },
          { id: "theme", label: "Tema", icon: Palette },
          { id: "guests", label: "Tamu", icon: Users },
          { id: "rsvp", label: "RSVP", icon: UserCheck },
          { id: "billing", label: "Paket", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActiveTab = activeNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNav(tab.id as typeof activeNav)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-2xl min-h-[48px] min-w-[48px] transition-all ${
                isActiveTab ? "text-amber-400 font-bold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MODAL: LIVE MOBILE PREVIEW */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-[360px] h-[700px] max-h-[92vh] bg-stone-900 rounded-[48px] p-3 border-4 border-stone-700 shadow-2xl flex flex-col">
            {/* Close Button Top */}
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-stone-800 text-stone-200 border border-stone-700 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Speaker Notch */}
            <div className="w-28 h-3.5 bg-stone-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-stone-950"></div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 w-full rounded-[36px] overflow-y-auto bg-stone-950 shadow-inner relative isolate scroll-smooth">
              <ThemeRenderer
                data={previewData}
                forcedThemeId={themeId}
                guestName="Budi &amp; Pasangan"
                showCover={false}
                isEmbedded={true}
              />
            </div>

            {/* Bottom Floating Bar in Preview */}
            <div className="pt-2 shrink-0 text-center">
              <p className="text-[10px] text-stone-400">
                Simulasi Layar Ponsel &bull; Tema: <span className="text-amber-400 font-bold">{themeId}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
