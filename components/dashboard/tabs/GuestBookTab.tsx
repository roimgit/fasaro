"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Plus,
  QrCode,
  Search,
  Send,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";

export interface GuestItem {
  id: string;
  name: string;
  slugCode: string;
  quota: number;
  phoneNumber?: string | null;
  checkedInAt?: string | null;
}

interface GuestBookTabProps {
  guests: GuestItem[];
  slug: string;
  onAddGuest: (name: string, phone: string, quota: number) => Promise<boolean>;
  onBulkAddGuests: (guestList: Array<{ name: string; phoneNumber?: string; quota?: number }>) => Promise<boolean>;
  onDeleteGuest: (id: string) => Promise<boolean>;
}

export const GuestBookTab: React.FC<GuestBookTabProps> = ({
  guests,
  slug,
  onAddGuest,
  onBulkAddGuests,
  onDeleteGuest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [isAddingBulk, setIsAddingBulk] = useState(false);

  // Form single
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quota, setQuota] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form bulk
  const [bulkText, setBulkText] = useState("");

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.phoneNumber && g.phoneNumber.includes(searchTerm))
  );

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    const ok = await onAddGuest(name.trim(), phone.trim(), quota);
    if (ok) {
      setName("");
      setPhone("");
      setQuota(1);
      setIsAddingSingle(false);
    }
    setIsSubmitting(false);
  };

  const handleBulkSubmit = async () => {
    if (!bulkText.trim()) return;
    setIsSubmitting(true);

    const lines = bulkText.split("\n");
    const parsed: Array<{ name: string; phoneNumber?: string; quota?: number }> = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Support "Nama, No HP, Kuota" or just "Nama"
      const parts = trimmed.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        parsed.push({
          name: parts[0],
          phoneNumber: parts[1] || undefined,
          quota: parts[2] ? parseInt(parts[2], 10) || 1 : 1,
        });
      } else {
        parsed.push({ name: parts[0], quota: 1 });
      }
    }

    if (parsed.length > 0) {
      const ok = await onBulkAddGuests(parsed);
      if (ok) {
        setBulkText("");
        setIsAddingBulk(false);
      }
    }
    setIsSubmitting(false);
  };

  const getGuestInvitationUrl = (guest: GuestItem) => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const guestParam = encodeURIComponent(guest.name);
    return `${origin}/invitation/${slug}?to=${guestParam}`;
  };

  const copyGuestLink = async (guest: GuestItem) => {
    const url = getGuestInvitationUrl(guest);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const openWhatsAppShare = (guest: GuestItem) => {
    const url = getGuestInvitationUrl(guest);
    const greeting = `Kepada Yth.
Bapak/Ibu/Saudara/i *${guest.name}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami.

Detail informasi dan konfirmasi kehadiran dapat diakses melalui tautan undangan resmi berikut:
${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.
Hormat kami yang berbahagia.`;

    let waUrl = `https://wa.me/?text=${encodeURIComponent(greeting)}`;
    if (guest.phoneNumber) {
      let cleanPhone = guest.phoneNumber.replace(/[^0-9]/g, "");
      if (cleanPhone.startsWith("08")) {
        cleanPhone = "62" + cleanPhone.slice(1);
      }
      waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
    }

    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Buku Tamu &amp; Generator WhatsApp
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] font-semibold text-xs border border-orange-100">
              {guests.length} Tamu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat tautan undangan personal untuk setiap tamu dan kirimkan via WhatsApp secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsAddingSingle(!isAddingSingle);
              setIsAddingBulk(false);
            }}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs min-h-[40px] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAddingBulk(!isAddingBulk);
              setIsAddingSingle(false);
            }}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs min-h-[40px] transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Banyak</span>
          </button>
        </div>
      </div>

      {/* Single Add Form */}
      {isAddingSingle && (
        <form
          onSubmit={handleSingleSubmit}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 animate-in fade-in"
        >
          <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
            Tambah Tamu Undangan Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 text-xs block mb-1">Nama Tamu (Wajib):</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bpk. Budi Santoso & Rekan"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs min-h-[42px] focus:border-[#F97316] outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 text-xs block mb-1">Nomor WhatsApp (Opsional):</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs min-h-[42px] focus:border-[#F97316] outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 text-xs block mb-1">Kuota Pax Kehadiran:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={quota}
                onChange={(e) => setQuota(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs min-h-[42px] focus:border-[#F97316] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingSingle(false)}
              className="py-1.5 px-3 rounded-lg border border-[#E2E8F0] text-slate-600 text-xs font-semibold hover:bg-slate-50 min-h-[38px]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="py-1.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 min-h-[38px] transition-colors"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Tamu"}
            </button>
          </div>
        </form>
      )}

      {/* Bulk Add Form */}
      {isAddingBulk && (
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 animate-in fade-in">
          <h3 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
            Import Daftar Tamu Sekaligus
          </h3>
          <p className="text-[11px] text-slate-500">
            Tuliskan 1 nama tamu per baris. Anda juga dapat menggunakan format: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Nama, NoHP, Kuota</code>
          </p>
          <textarea
            rows={5}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`Keluarga Besar Bpk. Ahmad, 081234567890, 2\nIbu Siti Rahmawati\nDr. Hendra Gunawan, 085712345678, 1`}
            className="w-full p-3 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs focus:border-[#F97316] outline-none font-mono"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingBulk(false)}
              className="py-1.5 px-3 rounded-lg border border-[#E2E8F0] text-slate-600 text-xs font-semibold hover:bg-slate-50 min-h-[38px]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={isSubmitting || !bulkText.trim()}
              className="py-1.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 min-h-[38px] transition-colors"
            >
              {isSubmitting ? "Mengimpor..." : "Import Semua Tamu"}
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama tamu atau nomor WhatsApp..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs sm:text-sm min-h-[44px] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
      </div>

      {/* Guest List (Mobile Friendly Card Stack + Desktop Table) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        {filteredGuests.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">
              {searchTerm ? "Tidak ada tamu yang cocok dengan pencarian." : "Belum ada daftar tamu. Tambahkan tamu pertama Anda!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filteredGuests.map((guest) => {
              const isCopied = copiedId === guest.id;

              return (
                <div
                  key={guest.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 truncate">
                        {guest.name}
                      </h4>
                      <span className="shrink-0 px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                        {guest.quota} Pax
                      </span>
                      {guest.checkedInAt && (
                        <span className="shrink-0 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                          Hadir di Lokasi
                        </span>
                      )}
                    </div>
                    {guest.phoneNumber && (
                      <p className="text-xs text-slate-500 font-mono">
                        {guest.phoneNumber}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md font-mono">
                      fasaro.id/{slug}?to={encodeURIComponent(guest.name)}
                    </p>
                  </div>

                  {/* Actions (Mobile Full-Width Grid) */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    {/* Send WhatsApp */}
                    <button
                      type="button"
                      onClick={() => openWhatsAppShare(guest)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold min-h-[42px] transition-colors shadow-xs"
                      title="Buka WhatsApp & bagikan undangan"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim WA</span>
                    </button>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={() => copyGuestLink(guest)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold min-h-[42px] transition-colors shadow-xs"
                      title="Salin link khusus tamu"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus tamu "${guest.name}"?`)) {
                          onDeleteGuest(guest.id);
                        }
                      }}
                      className="p-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 min-h-[42px] min-w-[42px] flex items-center justify-center transition-colors"
                      title="Hapus tamu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookTab;
