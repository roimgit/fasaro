"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  CreditCard,
  QrCode,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (result: Record<string, unknown>) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

interface BillingUpgradeTabProps {
  currentTier: string;
  invitationId: string;
  onPaymentSubmitted?: () => void;
}

interface DevOrderSimulation {
  orderId: string;
  tier: string;
  amount: number;
  snapToken: string;
  redirectUrl: string;
}

export const BillingUpgradeTab: React.FC<BillingUpgradeTabProps> = ({
  currentTier,
  invitationId,
  onPaymentSubmitted,
}) => {
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [activeMidtransTier, setActiveMidtransTier] = useState<string | null>(null);
  const [devSimulation, setDevSimulation] = useState<DevOrderSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
  const isProduction =
    clientKey.startsWith("Mid-client-") ||
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const isRealKey =
    Boolean(clientKey) && !clientKey.includes("YOUR_SANDBOX");

  // Load Midtrans Snap script dynamically in development/production
  useEffect(() => {
    const scriptId = "midtrans-snap-script";
    const scriptUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    if (isRealKey && !document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isProduction, clientKey, isRealKey]);

  const plans = [
    {
      id: "FREE",
      name: "Paket Gratis",
      price: "Rp 0",
      rawAmount: 0,
      period: "Masa Aktif s/d H+7 Acara",
      desc: "Uji coba platform Fasaro tanpa biaya awal pembuatan.",
      features: [
        "1 Pilihan Tema (Modern Editorial)",
        "Masa Aktif s/d H+7 Tanggal Acara",
        "Galeri Foto hingga 5 Foto",
        "Buku Ucapan & Doa Tamu",
        "Navigasi Peta Google Maps",
        "Amplop Digital (1 Rekening Bank)",
      ],
    },
    {
      id: "STARTER",
      name: "Paket Starter",
      price: "Rp 69.000",
      rawAmount: 69000,
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
      rawAmount: 149000,
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
      rawAmount: 279000,
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

  const handleMidtransPayment = async (tier: string, amount: number) => {
    setActiveMidtransTier(tier);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitationId || undefined,
          tier,
          amount,
          paymentType: "GATEWAY",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menginisiasi pembayaran Midtrans");
      }

      const orderData = await res.json();
      const { snapToken, redirectUrl, orderId } = orderData.data;

      // Check if real window.snap is available
      if (typeof window !== "undefined" && window.snap && snapToken && !snapToken.startsWith("mock_snap_")) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            setSuccessMsg(`Pembayaran pesanan ${orderId} berhasil dikonfirmasi! Paket Anda telah aktif.`);
            if (onPaymentSubmitted) onPaymentSubmitted();
          },
          onPending: () => {
            setSuccessMsg(`Pesanan ${orderId} menunggu penyelesaian pembayaran di Midtrans.`);
          },
          onError: () => {
            setErrorMsg("Pembayaran gagal atau dibatalkan.");
          },
        });
      } else {
        // Fallback for Development mode simulation
        setDevSimulation({
          orderId,
          tier,
          amount,
          snapToken,
          redirectUrl,
        });
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi Midtrans");
    } finally {
      setActiveMidtransTier(null);
    }
  };

  const handleSimulateDevSettlement = async () => {
    if (!devSimulation) return;
    setIsSimulating(true);

    try {
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: devSimulation.orderId,
          status_code: "200",
          gross_amount: String(devSimulation.amount),
          signature_key: "dev_mock_signature",
          transaction_status: "settlement",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memproses simulasi webhook");
      }

      setSuccessMsg(`Simulasi sukses! Pesanan ${devSimulation.orderId} telah menjadi SETTLEMENT dan paket aktif.`);
      setDevSimulation(null);
      if (onPaymentSubmitted) onPaymentSubmitted();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal melakukan simulasi pembayaran");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleManualPaymentSubmit = async () => {
    if (!paymentProofUrl.trim()) {
      setErrorMsg("Silakan unggah atau masukkan URL bukti transfer terlebih dahulu.");
      return;
    }

    setIsSubmittingManual(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitationId || undefined,
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
      setIsSubmittingManual(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Dev Sandbox Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Paket Langganan &amp; Upgrade
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Status paket aktif Anda saat ini:{" "}
            <span className="font-semibold text-[#F97316]">Paket {currentTier}</span>
          </p>
        </div>

        {!isProduction && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Midtrans Mode: Sandbox (Dev)
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dev Mode Simulation Card */}
      {devSimulation && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#F97316]" />
              <h4 className="font-bold text-xs text-slate-900">
                Sandbox Dev Simulator: Pesanan #{devSimulation.orderId}
              </h4>
            </div>
            <button
              onClick={() => setDevSimulation(null)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Tutup
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Transaksi Sandbox berhasil diinisiasi untuk {devSimulation.tier} (Rp {devSimulation.amount.toLocaleString("id-ID")}).
            Anda dapat langsung menyimulasikan settlement sukses untuk mengaktifkan paket secara instan:
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSimulateDevSettlement}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              {isSimulating ? "Memproses..." : "✓ Simulasikan Bayar Sukses (Dev)"}
            </button>
            {devSimulation.redirectUrl && (
              <a
                href={devSimulation.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-slate-700 hover:bg-slate-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Buka Sandbox Midtrans</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => {
          const isCurrent = currentTier === p.id;
          const isPendingMidtrans = activeMidtransTier === p.id;

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

              <div className="pt-2 space-y-2">
                {isCurrent ? (
                  <div className="w-full py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs text-center border border-emerald-200">
                    Paket Aktif Anda
                  </div>
                ) : p.id === "FREE" ? (
                  <div className="w-full py-2.5 px-3 rounded-lg bg-slate-100 text-slate-500 font-medium text-xs text-center border border-slate-200">
                    Paket Dasar
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isPendingMidtrans}
                      onClick={() => handleMidtransPayment(p.id, p.rawAmount)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-center transition-colors min-h-[40px] flex items-center justify-center gap-1.5 shadow-xs ${
                        p.popular
                          ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {isPendingMidtrans
                          ? "Menghubungkan Midtrans..."
                          : `Bayar Otomatis (Midtrans)`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById("manual-payment")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-800 font-medium text-center transition-colors"
                    >
                      atau transfer manual bank/QRIS
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Payment Section */}
      <div
        id="manual-payment"
        className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-50 text-[#F97316]">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Konfirmasi Pembayaran QRIS / Transfer Bank Manual
            </h3>
            <p className="text-xs text-slate-500">
              Jika memilih transfer manual, kirimkan bukti struk Anda di bawah ini untuk verifikasi admin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
            <h4 className="font-semibold text-slate-800">
              Rekening Tujuan Pembayaran:
            </h4>
            <div className="space-y-1 text-slate-600">
              <p>
                • Bank BCA:{" "}
                <span className="font-mono font-bold text-slate-900">
                  8291039481
                </span>{" "}
                (a.n Fasaro Platform)
              </p>
              <p>
                • Bank Mandiri:{" "}
                <span className="font-mono font-bold text-slate-900">
                  1420019283741
                </span>{" "}
                (a.n Fasaro Platform)
              </p>
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
              disabled={isSubmittingManual || !paymentProofUrl.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 min-h-[44px] transition-colors"
            >
              {isSubmittingManual ? "Mengirimkan..." : "Kirim Bukti Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingUpgradeTab;
