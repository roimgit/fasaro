"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Edit3,
  ExternalLink,
  Eye,
  Palette,
  RefreshCw,
  Save,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav, { AdminTabId } from "./MobileBottomNav";
import ContentEditorTab from "./tabs/ContentEditorTab";
import ThemeSelectorTab from "./tabs/ThemeSelectorTab";
import GuestBookTab, { GuestItem } from "./tabs/GuestBookTab";
import RsvpRecapTab, { RsvpRecapData, WishItem } from "./tabs/RsvpRecapTab";
import BillingUpgradeTab from "./tabs/BillingUpgradeTab";
import ThemeRenderer from "@/components/templates/ThemeRenderer";
import { ThemeId, WeddingInvitationData } from "@/types/wedding";

export default function UserAdminPanel() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTabId>("editor");

  // Loading & Saving States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Invitation General States
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

  // Galleries & Media
  const [galleries, setGalleries] = useState<
    Array<{ imageUrl: string; caption: string; sortOrder: number }>
  >([]);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>("");

  // Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<
    Array<{
      id?: string;
      bankName: string;
      accountNumber: string;
      accountHolder: string;
      qrisImageUrl?: string;
    }>
  >([]);

  // Stories
  const [stories, setStories] = useState<
    Array<{ date: string; title: string; story: string }>
  >([]);

  // Guests & RSVPs
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [rsvpRecap, setRsvpRecap] = useState<RsvpRecapData | null>(null);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  // Load Dashboard Data
  const loadDashboardData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsLoading(true);
    setNotification(null);

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
          setSlug(data.slug || "mempelai");
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
          setStories(Array.isArray(c.stories) ? c.stories : []);

          setMusicUrl(data.musicUrl || "");
          setYoutubeVideoUrl(data.youtubeVideoUrl || "");

          if (Array.isArray(data.eventSchedules)) {
            setSchedules(
              data.eventSchedules.map((s: {
                id?: string;
                eventName: string;
                date: string | Date;
                startTime: string;
                endTime?: string | null;
                venueName: string;
                address: string;
                mapsUrl?: string | null;
              }) => ({
                id: s.id,
                eventName: s.eventName,
                date: typeof s.date === "string" ? s.date : new Date(s.date).toISOString().split("T")[0],
                startTime: s.startTime || "08:00",
                endTime: s.endTime || "10:00",
                venueName: s.venueName || "",
                address: s.address || "",
                mapsUrl: s.mapsUrl || "",
              }))
            );
          }

          if (Array.isArray(data.galleries)) {
            setGalleries(
              data.galleries.map((g: { imageUrl: string; caption?: string | null; sortOrder: number }) => ({
                imageUrl: g.imageUrl,
                caption: g.caption || "",
                sortOrder: g.sortOrder || 0,
              }))
            );
          }

          if (Array.isArray(data.bankAccounts)) {
            setBankAccounts(
              data.bankAccounts.map((b: {
                id?: string;
                bankName: string;
                accountNumber: string;
                accountHolder: string;
                qrisImageUrl?: string | null;
              }) => ({
                id: b.id,
                bankName: b.bankName,
                accountNumber: b.accountNumber,
                accountHolder: b.accountHolder,
                qrisImageUrl: b.qrisImageUrl || undefined,
              }))
            );
          }

          if (Array.isArray(data.wishes)) {
            setWishes(data.wishes);
          }
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
      setNotification({
        type: "error",
        message: "Gagal memuat data undangan. Silakan periksa koneksi internet Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Save Invitation
  const handleSaveInvitation = async () => {
    setIsSaving(true);
    setNotification(null);

    const payload = {
      title,
      slug,
      themeId,
      isActive,
      musicUrl: musicUrl || undefined,
      coupleInfo: {
        groomName,
        groomNickname: groomNickname || undefined,
        groomFather: groomFather || undefined,
        groomMother: groomMother || undefined,
        groomInstagram: groomInstagram || undefined,
        groomPhoto: groomPhoto || undefined,
        brideName,
        brideNickname: brideNickname || undefined,
        brideFather: brideFather || undefined,
        brideMother: brideMother || undefined,
        brideInstagram: brideInstagram || undefined,
        bridePhoto: bridePhoto || undefined,
        greetingMessage: greetingMessage || undefined,
        stories: stories.length > 0 ? stories : undefined,
      },
      eventSchedules: schedules.map((s) => ({
        eventName: s.eventName,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime || undefined,
        venueName: s.venueName,
        address: s.address,
        mapsUrl: s.mapsUrl || undefined,
      })),
      galleries: galleries.map((g, idx) => ({
        imageUrl: g.imageUrl,
        caption: g.caption || undefined,
        sortOrder: idx,
      })),
      bankAccounts: bankAccounts.map((b) => ({
        bankName: b.bankName,
        accountNumber: b.accountNumber,
        accountHolder: b.accountHolder,
        qrisImageUrl: b.qrisImageUrl || undefined,
      })),
    };

    try {
      const res = await fetch("/api/dashboard/invitation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan undangan");
      }

      setHasUnsavedChanges(false);
      setNotification({
        type: "success",
        message: "Perubahan undangan berhasil disimpan & langsung aktif di website!",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Guest Handlers
  const handleAddGuest = async (guestName: string, phone: string, guestQuota: number) => {
    try {
      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName,
          phoneNumber: phone || undefined,
          quota: guestQuota,
        }),
      });

      if (!res.ok) throw new Error("Gagal menambah tamu");
      const json = await res.json();
      if (json.data) {
        setGuests((prev) => [...prev, json.data]);
        setNotification({
          type: "success",
          message: `Tamu "${guestName}" berhasil ditambahkan!`,
        });
        return true;
      }
      return false;
    } catch {
      setNotification({
        type: "error",
        message: "Gagal menambahkan tamu baru.",
      });
      return false;
    }
  };

  const handleBulkAddGuests = async (
    guestList: Array<{ name: string; phoneNumber?: string; quota?: number }>
  ) => {
    try {
      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: guestList }),
      });

      if (!res.ok) throw new Error("Gagal mengimpor daftar tamu");
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setGuests((prev) => [...prev, ...json.data.filter(Boolean)]);
        setNotification({
          type: "success",
          message: `Berhasil mengimpor ${json.data.length} tamu!`,
        });
        return true;
      }
      return false;
    } catch {
      setNotification({
        type: "error",
        message: "Gagal mengimpor tamu.",
      });
      return false;
    }
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/guests?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus tamu");
      setGuests((prev) => prev.filter((g) => g.id !== id));
      setNotification({
        type: "success",
        message: "Tamu berhasil dihapus.",
      });
      return true;
    } catch {
      setNotification({
        type: "error",
        message: "Gagal menghapus tamu.",
      });
      return false;
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  // Data for Live Simulation
  const previewData: WeddingInvitationData = {
    id: invitationId || "preview",
    slug,
    title,
    themeId,
    coupleInfo: {
      groomName: groomName || "Rian Pratama",
      groomNickname: groomNickname || "Rian",
      groomFather: groomFather || "Bambang Wijaya",
      groomMother: groomMother || "Sri Wahyuni",
      groomInstagram: groomInstagram || "rian.pratama",
      groomPhoto: groomPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      brideName: brideName || "Sinta Anggraini",
      brideNickname: brideNickname || "Sinta",
      brideFather: brideFather || "Herman Santoso",
      brideMother: brideMother || "Dewi Lestari",
      brideInstagram: brideInstagram || "sinta.anggraini",
      bridePhoto: bridePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      greetingMessage,
      stories,
    },
    isActive,
    eventSchedules: schedules.length > 0 ? schedules : [
      {
        eventName: "Akad Nikah",
        date: "2026-10-24T08:00:00.000Z",
        startTime: "08:00",
        endTime: "10:00",
        venueName: "Masjid Agung Al-Falah",
        address: "Jl. Diponegoro No. 12, Surabaya",
        mapsUrl: "https://maps.google.com",
      },
    ],
    galleries: galleries.length > 0 ? galleries : [
      {
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        caption: "Prewedding 1",
        sortOrder: 0,
      },
    ],
    bankAccounts: bankAccounts.length > 0 ? bankAccounts : [
      {
        bankName: "BCA",
        accountNumber: "8291039481",
        accountHolder: "Rian Pratama",
      },
    ],
    musicUrl,
  };

  const desktopTabs = [
    { id: "editor" as const, label: "Konten Undangan", icon: Edit3 },
    { id: "theme" as const, label: "Pilihan Tema", icon: Palette },
    { id: "guests" as const, label: `Buku Tamu (${guests.length})`, icon: Users },
    { id: "rsvp" as const, label: "Rekap RSVP", icon: UserCheck },
    { id: "billing" as const, label: "Langganan & Paket", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-900 flex flex-col font-sans pb-28 md:pb-12 selection:bg-[#F97316] selection:text-white">
      {/* 1. Mobile-First Top Bar */}
      <MobileTopBar
        title={title}
        slug={slug}
        tier={tier}
        isLoading={isLoading}
        onOpenPreview={() => setShowMobilePreview(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-5 w-full space-y-5">
        {/* Toast / Notification Banner */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 shadow-xs animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-1.5">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActiveTab = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold min-h-[40px] transition-colors ${
                    isActiveTab
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Save Button */}
          {activeTab === "editor" && (
            <button
              type="button"
              onClick={handleSaveInvitation}
              disabled={isSaving}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold min-h-[40px] shadow-xs disabled:opacity-50 transition-colors"
            >
              <Save className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Menyimpan..." : "Simpan Undangan"}</span>
            </button>
          )}
        </div>

        {/* Tab Content Display */}
        {activeTab === "editor" && (
          <ContentEditorTab
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            groomName={groomName}
            setGroomName={setGroomName}
            groomNickname={groomNickname}
            setGroomNickname={setGroomNickname}
            groomFather={groomFather}
            setGroomFather={setGroomFather}
            groomMother={groomMother}
            setGroomMother={setGroomMother}
            groomInstagram={groomInstagram}
            setGroomInstagram={setGroomInstagram}
            groomPhoto={groomPhoto}
            setGroomPhoto={setGroomPhoto}
            brideName={brideName}
            setBrideName={setBrideName}
            brideNickname={brideNickname}
            setBrideNickname={setBrideNickname}
            brideFather={brideFather}
            setBrideFather={setBrideFather}
            brideMother={brideMother}
            setBrideMother={setBrideMother}
            brideInstagram={brideInstagram}
            setBrideInstagram={setBrideInstagram}
            bridePhoto={bridePhoto}
            setBridePhoto={setBridePhoto}
            greetingMessage={greetingMessage}
            setGreetingMessage={setGreetingMessage}
            schedules={schedules}
            setSchedules={setSchedules}
            galleries={galleries}
            setGalleries={setGalleries}
            musicUrl={musicUrl}
            setMusicUrl={setMusicUrl}
            youtubeVideoUrl={youtubeVideoUrl}
            setYoutubeVideoUrl={setYoutubeVideoUrl}
            bankAccounts={bankAccounts}
            setBankAccounts={setBankAccounts}
            stories={stories}
            setStories={setStories}
            onSave={handleSaveInvitation}
            isSaving={isSaving}
          />
        )}

        {activeTab === "theme" && (
          <ThemeSelectorTab
            currentThemeId={themeId}
            onSelectTheme={async (newThemeId) => {
              setThemeId(newThemeId);
              // Auto-save theme choice
              try {
                await fetch("/api/dashboard/invitation", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ themeId: newThemeId }),
                });
                setNotification({
                  type: "success",
                  message: `Tema berhasil diubah menjadi "${newThemeId}"!`,
                });
              } catch {
                // Ignore
              }
            }}
            onOpenPreview={() => setShowMobilePreview(true)}
          />
        )}

        {activeTab === "guests" && (
          <GuestBookTab
            guests={guests}
            slug={slug}
            onAddGuest={handleAddGuest}
            onBulkAddGuests={handleBulkAddGuests}
            onDeleteGuest={handleDeleteGuest}
          />
        )}

        {activeTab === "rsvp" && (
          <RsvpRecapTab
            rsvpRecap={rsvpRecap}
            wishes={wishes}
            isLoading={isLoading}
          />
        )}

        {activeTab === "billing" && (
          <BillingUpgradeTab
            currentTier={tier}
            invitationId={invitationId}
            onPaymentSubmitted={() => loadDashboardData(true)}
          />
        )}
      </main>

      {/* 3. Mobile Floating Quick Save Bar (Only visible in editor tab on mobile) */}
      {activeTab === "editor" && (
        <div className="fixed bottom-16 left-0 right-0 z-30 md:hidden px-4 py-2 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
          <button
            type="button"
            onClick={handleSaveInvitation}
            disabled={isSaving}
            className="pointer-events-auto w-full py-3 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 min-h-[46px] transition-colors"
          >
            <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "Menyimpan Perubahan..." : "Simpan Perubahan Undangan"}</span>
          </button>
        </div>
      )}

      {/* 4. Mobile Fixed Bottom Navigation Bar (<md) */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        guestCount={guests.length}
        rsvpCount={rsvpRecap?.totalResponses || 0}
      />

      {/* 5. Modal: Live Smartphone Simulation Preview */}
      {showMobilePreview && (
        <div
          onClick={() => setShowMobilePreview(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] h-[720px] max-h-[92vh] bg-slate-950 rounded-[44px] p-3 border border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Top Close Button & Bar */}
            <div className="flex items-center justify-between px-3 py-1 mb-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Simulasi HP</span>
                <a
                  href={`/invitation/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#F97316] hover:underline font-medium"
                >
                  <span>Buka Web</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                aria-label="Tutup Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notch */}
            <div className="w-24 h-3 bg-slate-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 w-full rounded-[32px] overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-900 shadow-inner relative isolate scroll-smooth">
              <ThemeRenderer
                data={previewData}
                forcedThemeId={themeId}
                guestName="Bapak Budi & Rekan"
                showCover={false}
                isEmbedded={true}
              />
            </div>

            {/* Bottom Info in Preview */}
            <div className="pt-2 shrink-0 text-center">
              <p className="text-[10px] text-slate-400">
                Tema Aktif: <span className="text-[#F97316] font-bold">{themeId}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
