"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  LogIn,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";

interface MetricsData {
  totalUsers: number;
  totalActiveInvitations: number;
  pendingPaymentsCount: number;
  monthlyRevenue: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  invitation: {
    id: string;
    title: string;
    slug: string;
    themeId: string;
    activeUntil: string | null;
    isActive: boolean;
    tier: string;
    status: string;
  } | null;
}

interface ThemeItem {
  id: string;
  themeKey: string;
  name: string;
  category: string;
  thumbnail: string;
  previewUrl: string | null;
  isActive: boolean;
  isPremium: boolean;
}

interface SettingItem {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export default function MasterAdminPage() {
  const [activeTab, setActiveTab] = useState<"clients" | "themes" | "settings">("clients");
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Client Edit Modal
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [editTier, setEditTier] = useState("STARTER");
  const [editAddDays, setEditAddDays] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);

  // Theme Add/Edit Modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [themeForm, setThemeForm] = useState({
    themeKey: "",
    name: "",
    category: "Modern Chic",
    thumbnail: "",
    isPremium: false,
    isActive: true,
  });

  // Notification / Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsLoading(true);
      setFeedback(null);
    }
    try {
      const [resMetrics, resClients, resThemes, resSettings] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/admin/clients"),
        fetch("/api/admin/themes"),
        fetch("/api/admin/settings"),
      ]);

      if (resMetrics.ok) {
        const json = await resMetrics.json();
        setMetrics(json.data);
      }
      if (resClients.ok) {
        const json = await resClients.json();
        setClients(json.data || []);
      }
      if (resThemes.ok) {
        const json = await resThemes.json();
        setThemes(json.data || []);
      }
      if (resSettings.ok) {
        const json = await resSettings.json();
        setSettings(json.data || []);
      }
    } catch {
      setFeedback({ type: "error", msg: "Gagal memuat data dashboard admin." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAllData(false);
  }, [fetchAllData]);

  // Impersonate Login
  const handleImpersonate = async (targetUserId: string) => {
    if (!confirm("Masuk ke dashboard sebagai klien ini?")) return;
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const json = await res.json();
      if (res.ok && json.redirectUrl) {
        window.location.assign(json.redirectUrl);
      } else {
        throw new Error(json.error || "Gagal impersonasi");
      }
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Gagal impersonasi login",
      });
    }
  };

  // Save Client Edit
  const handleSaveClientEdit = async () => {
    if (!editingClient?.invitation?.id) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: editingClient.invitation.id,
          tier: editTier,
          addDays: editAddDays,
          isActive: editIsActive,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memperbarui klien");

      setFeedback({ type: "success", msg: "Data klien berhasil diperbarui!" });
      setEditingClient(null);
      fetchAllData();
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Gagal memperbarui klien",
      });
    }
  };

  // Save Theme
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/admin/themes";
      const method = editingThemeId ? "PUT" : "POST";
      const body = editingThemeId ? { id: editingThemeId, ...themeForm } : themeForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan tema");

      setFeedback({
        type: "success",
        msg: editingThemeId ? "Tema berhasil diperbarui!" : "Tema baru berhasil ditambahkan!",
      });
      setIsThemeModalOpen(false);
      setEditingThemeId(null);
      setThemeForm({
        themeKey: "",
        name: "",
        category: "Modern Chic",
        thumbnail: "",
        isPremium: false,
        isActive: true,
      });
      fetchAllData();
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Gagal menyimpan tema",
      });
    }
  };

  // Delete Theme
  const handleDeleteTheme = async (id: string, name: string) => {
    if (!confirm(`Hapus tema "${name}" dari katalog?`)) return;
    try {
      const res = await fetch(`/api/admin/themes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus tema");
      setFeedback({ type: "success", msg: `Tema "${name}" berhasil dihapus.` });
      fetchAllData();
    } catch {
      setFeedback({ type: "error", msg: "Gagal menghapus tema." });
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan pengaturan");
      setFeedback({ type: "success", msg: "Pengaturan sistem berhasil disimpan!" });
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Gagal menyimpan pengaturan",
      });
    }
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.invitation?.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return c.invitation?.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Title & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 tracking-tight">
            Pusat Kendali Super Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau pertumbuhan pengguna, manajemen status langganan klien, dan konfigurasi platform.
          </p>
        </div>

        <button
          onClick={() => void fetchAllData(true)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#F97316]" : "text-slate-500"}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Executive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Pengguna</span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            {metrics?.totalUsers ?? 0}
          </p>
          <p className="text-[11px] text-slate-500">Akun terdaftar dalam database</p>
        </div>

        {/* Card 2: Active Invitations */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Undangan Aktif</span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            {metrics?.totalActiveInvitations ?? 0}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Status tayang &amp; siap diakses tamu</p>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pendapatan Bulan Ini</span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            Rp {(metrics?.monthlyRevenue ?? 0).toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-slate-500">Total settlement Midtrans &amp; QRIS</p>
        </div>

        {/* Card 4: Verification Queue */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Antrean Verifikasi</span>
            <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            {metrics?.pendingPaymentsCount ?? 0}
          </p>
          <Link
            href="/admin/verifikasi-manual"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F97316] hover:underline"
          >
            <span>Buka Halaman Verifikasi</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center border-b border-[#E2E8F0] gap-2">
        <button
          onClick={() => setActiveTab("clients")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "clients"
              ? "border-[#F97316] text-[#F97316]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Klien ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("themes")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "themes"
              ? "border-[#F97316] text-[#F97316]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Katalog Tema ({themes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "settings"
              ? "border-[#F97316] text-[#F97316]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Sistem</span>
        </button>
      </div>

      {/* TAB 1: MANAJEMEN KLIEN */}
      {activeTab === "clients" && (
        <div className="space-y-4">
          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, atau slug..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-slate-700 focus:outline-none focus:border-[#F97316] shadow-xs"
              >
                <option value="ALL">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="EXPIRED">Expired</option>
                <option value="INACTIVE">Nonaktif</option>
                <option value="NO_INVITATION">Belum Buat Undangan</option>
              </select>
            </div>
          </div>

          {/* Clients Table */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] bg-slate-50/75 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Pengantin</th>
                    <th className="py-3 px-4">Subdomain / Slug</th>
                    <th className="py-3 px-4">Paket</th>
                    <th className="py-3 px-4">Masa Aktif</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada klien yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => {
                      const inv = client.invitation;
                      return (
                        <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{client.name}</div>
                            <div className="text-[11px] text-slate-500">{client.email}</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {inv ? (
                              <a
                                href={`/invitation/${inv.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#F97316] hover:underline inline-flex items-center gap-1"
                              >
                                <span>/{inv.slug}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {inv ? (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  inv.tier === "ULTIMATE"
                                    ? "bg-orange-50 text-[#F97316] border border-orange-200"
                                    : inv.tier === "ELEGANT"
                                    ? "bg-slate-100 text-slate-700 border border-[#E2E8F0]"
                                    : "bg-slate-50 text-slate-600 border border-[#E2E8F0]"
                                }`}
                              >
                                {inv.tier}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[11px] text-slate-500">
                            {inv?.activeUntil
                              ? new Date(inv.activeUntil).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Selamanya / Draft"}
                          </td>

                          <td className="py-3.5 px-4">
                            {inv ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                  inv.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : inv.status === "EXPIRED"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {inv.status}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">No Draft</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            {inv && (
                              <button
                                onClick={() => {
                                  setEditingClient(client);
                                  setEditTier(inv.tier);
                                  setEditIsActive(inv.isActive);
                                  setEditAddDays(0);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
                                title="Edit Paket / Perpanjang"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {client.role !== "ADMIN" && (
                              <button
                                onClick={() => handleImpersonate(client.id)}
                                className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-blue-100 border border-orange-200 text-[#F97316] text-xs font-medium transition-colors inline-flex items-center gap-1"
                                title="Login sebagai Klien ini"
                              >
                                <LogIn className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[10px]">Impersonate</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KATALOG TEMA */}
      {activeTab === "themes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Katalog tema yang dapat dipilih langsung oleh pengantin tanpa kehilangan data.
            </p>
            <button
              onClick={() => {
                setEditingThemeId(null);
                setThemeForm({
                  themeKey: "",
                  name: "",
                  category: "Modern Chic",
                  thumbnail: "",
                  isPremium: false,
                  isActive: true,
                });
                setIsThemeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tema Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden flex flex-col group hover:border-[#F97316]/40 transition-all shadow-xs"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={theme.thumbnail || "/images/placeholder-theme.jpg"}
                    alt={theme.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-slate-700 border border-[#E2E8F0]">
                      {theme.category}
                    </span>
                    {theme.isPremium ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F97316] text-white">
                        PREMIUM
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-[#E2E8F0]">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-slate-900">{theme.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Key: {theme.themeKey}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        theme.isActive ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {theme.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{theme.isActive ? "Aktif di Katalog" : "Nonaktif"}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingThemeId(theme.id);
                          setThemeForm({
                            themeKey: theme.themeKey,
                            name: theme.name,
                            category: theme.category,
                            thumbnail: theme.thumbnail,
                            isPremium: theme.isPremium,
                            isActive: theme.isActive,
                          });
                          setIsThemeModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 text-xs"
                        title="Edit Tema"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(theme.id, theme.name)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs"
                        title="Hapus Tema"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PENGATURAN SISTEM */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-sans font-bold text-slate-900">Konfigurasi Gateway &amp; QRIS</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengaturan kunci API Sandbox Midtrans, informasi nomor rekening QRIS manual, dan kuota upload foto.
              </p>
            </div>

            <div className="space-y-4">
              {settings.map((item, idx) => (
                <div key={item.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>{item.key}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.description || ""}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => {
                      const updated = [...settings];
                      updated[idx].value = e.target.value;
                      setSettings(updated);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-slate-900 font-mono focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition-all shadow-sm"
              >
                Simpan Semua Pengaturan
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: EDIT CLIENT / EXTEND VALIDITY */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white border border-[#E2E8F0] p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900">Edit Paket &amp; Masa Aktif</h3>
                <p className="text-xs text-slate-500">{editingClient.name} ({editingClient.email})</p>
              </div>
              <button onClick={() => setEditingClient(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Tier Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Tingkat Paket Langganan:</label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-white border border-[#E2E8F0] text-slate-800 focus:outline-none focus:border-[#F97316]"
                >
                  <option value="STARTER">Starter (Rp 69.000)</option>
                  <option value="ELEGANT">Elegant (Rp 149.000)</option>
                  <option value="ULTIMATE">Ultimate (Rp 279.000)</option>
                </select>
              </div>

              {/* Add Validity Days */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Perpanjang Masa Aktif:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Tetap (0 Hari)", days: 0 },
                    { label: "+30 Hari", days: 30 },
                    { label: "+365 Hari (1 Tahun)", days: 365 },
                  ].map((btn) => (
                    <button
                      key={btn.days}
                      type="button"
                      onClick={() => setEditAddDays(btn.days)}
                      className={`py-2 rounded-lg text-center font-medium border text-xs transition-colors ${
                        editAddDays === btn.days
                          ? "bg-orange-50 text-[#F97316] border-[#F97316]"
                          : "bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Status Undangan:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="isActive"
                      checked={editIsActive}
                      onChange={() => setEditIsActive(true)}
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="isActive"
                      checked={!editIsActive}
                      onChange={() => setEditIsActive(false)}
                    />
                    <span>Nonaktifkan</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveClientEdit}
                className="px-4 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT THEME */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleSaveTheme}
            className="w-full max-w-md rounded-xl bg-white border border-[#E2E8F0] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-slate-900">
                {editingThemeId ? "Edit Tema" : "Tambah Tema Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Theme Key (ID):</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingThemeId)}
                  value={themeForm.themeKey}
                  onChange={(e) => setThemeForm({ ...themeForm, themeKey: e.target.value })}
                  placeholder="contoh: modern-gold"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-slate-900 font-mono disabled:opacity-50 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nama Tema:</label>
                <input
                  type="text"
                  required
                  value={themeForm.name}
                  onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                  placeholder="contoh: Modern Gold Luxury"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Kategori:</label>
                <select
                  value={themeForm.category}
                  onChange={(e) => setThemeForm({ ...themeForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-slate-800 focus:outline-none focus:border-[#F97316]"
                >
                  <option value="Minimalist">Minimalist</option>
                  <option value="Floral & Rustic">Floral &amp; Rustic</option>
                  <option value="Syar'i & Adat">Syar&apos;i &amp; Adat</option>
                  <option value="Luxury Dark Gold">Luxury Dark Gold</option>
                  <option value="Modern Chic">Modern Chic</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">URL Gambar Thumbnail:</label>
                <input
                  type="url"
                  required
                  value={themeForm.thumbnail}
                  onChange={(e) => setThemeForm({ ...themeForm, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-slate-900 focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={themeForm.isPremium}
                    onChange={(e) =>
                      setThemeForm({ ...themeForm, isPremium: e.target.checked })
                    }
                  />
                  <span>Tema Premium (Berbayar)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={themeForm.isActive}
                    onChange={(e) => setThemeForm({ ...themeForm, isActive: e.target.checked })}
                  />
                  <span>Aktif di Katalog</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs"
              >
                {editingThemeId ? "Perbarui Tema" : "Tambah Tema"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
