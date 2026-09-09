"use client";

import React, { useState } from "react";
import {
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

interface BillingUpgradeTabProps {
  currentTier: string;
  invitationId: string;
  onPaymentSubmitted?: () => void;
}

export const BillingUpgradeTab: React.FC<BillingUpgradeTabProps> = ({
  currentTier,
  invitationId,
  onPaymentSubmitted,
}) => {
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const plans = [
    {
      id: "STARTER",
      name: "Paket Starter",
      price: "Rp 69.000",
      period: "Masa Aktif 90 Hari",
      desc: "Cocok untuk acara akad / syukuran intim keluarga.",
      features: [
        "1 Pilihan Tema Minimalist",
        "Masa Aktif 90 Hari",
        "Galeri Foto hingga 5 Foto",
        "Buku Ucapan & Doa",
        "Navigasi Google Maps",
        "Amplop Digital (1 Rekening)",
      ],
    },
    {
      id: "ELEGANT",
      name: "Paket Elegant",
      price: "Rp 149.000",
      period: "Masa Aktif 365 Hari",
      desc: "Paling populer untuk resepsi pernikahan lengkap & modern.",
      popular: true,
      features: [
        "Akses Bebas ke Seluruh Tema Desain",
        "Ganti Tema 1-Klik Kapan Saja",
        "Masa Aktif 365 Hari Penuh",
        "Galeri Foto HD Tanpa Batas",
        "Amplop Digital + Upload QRIS",
        "Buku Tamu & RSVP Realtime",
        "Background Musik Autoplay",
      ],
    },
    {
      id: "ULTIMATE",
      name: "Paket Ultimate",
      price: "Rp 279.000",
      period: "Masa Aktif Selamanya",
      desc: "Solusi lengkap hari-H dengan sistem absensi QR check-in.",
      features: [
        "Seluruh Fitur Paket Elegant",
        "Masa Aktif Selamanya (Lifetime)",
        "Sistem QR Code Check-in Meja Tamu",
        "WhatsApp Blast Gateway Generator",
        "Love Story Timeline Kustom",
        "Prioritas Verifikasi Kilat 10 Menit",
      ],
    },
  ];

  const handleManualPaymentSubmit = async () => {
    if (!paymentProofUrl.trim()) {
      setErrorMsg("Silakan unggah atau masukkan URL bukti transfer terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          tier: "ELEGANT",
          paymentType: "MANUAL_QRIS",
          proofImageUrl: paymentProofUrl.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirimkan bukti pembayaran");
      }

      setSuccessMsg("Bukti transfer berhasil dikirim! Admin akan segera memverifikasi dan mengaktifkan paket Anda.");
      setPaymentProofUrl("");
      if (onPaymentSubmitted) onPaymentSubmitted();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Paket Langganan &amp; Upgrade
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Status paket aktif Anda saat ini:{" "}
          <span className="font-semibold text-[#F97316]">Paket {currentTier}</span>
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isCurrent = currentTier === p.id;

          return (
            <div
              key={p.id}
              className={`rounded-xl bg-white p-5 border flex flex-col justify-between space-y-4 shadow-xs relative transition-all ${
                p.popular
                  ? "border-2 border-[#F97316] ring-1 ring-orange-100"
                  : "border-[#E2E8F0]"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-semibold uppercase tracking-wider shadow-xs">
                  Paling Populer
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                </div>

                <div>
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {p.price}
                  </span>
                  <p className="text-[11px] text-[#F97316] font-semibold mt-0.5">
                    {p.period}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {isCurrent ? (
                  <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs text-center border border-emerald-200">
                    Paket Aktif Anda
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Scroll to manual payment
                      document.getElementById("manual-payment")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-center transition-colors min-h-[40px] ${
                      p.popular
                        ? "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs"
                        : "bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 border border-[#E2E8F0]"
                    }`}
                  >
                    Upgrade ke {p.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Payment Section */}
      <div id="manual-payment" className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Konfirmasi Pembayaran QRIS / Transfer Bank
            </h3>
            <p className="text-xs text-slate-500">
              Kirimkan bukti transfer Anda untuk aktivasi instan oleh Admin.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
            <h4 className="font-semibold text-slate-800">Rekening Tujuan Pembayaran:</h4>
            <div className="space-y-1 text-slate-600">
              <p>• Bank BCA: <span className="font-mono font-bold text-slate-900">8291039481</span> (a.n Fasaro Platform)</p>
              <p>• Bank Mandiri: <span className="font-mono font-bold text-slate-900">1420019283741</span> (a.n Fasaro Platform)</p>
              <p>• QRIS Semua Bank &amp; E-Wallet: scan di kasir atau unggah struk.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 block">
              URL / Link Bukti Transfer:
            </label>
            <input
              type="text"
              value={paymentProofUrl}
              onChange={(e) => setPaymentProofUrl(e.target.value)}
              placeholder="https://.../bukti-transfer.jpg"
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 text-xs min-h-[44px] focus:border-[#F97316] outline-none"
            />

            <button
              type="button"
              onClick={handleManualPaymentSubmit}
              disabled={isSubmitting || !paymentProofUrl.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 min-h-[44px] transition-colors"
            >
              {isSubmitting ? "Mengirimkan..." : "Kirim Bukti Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingUpgradeTab;
