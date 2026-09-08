"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface VerificationItem {
  id: string;
  orderId: string;
  tier: string;
  amount: number | string;
  paymentType: string;
  paymentStatus: string;
  proofImageUrl?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  invitation?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export default function VerifikasiManualAdminPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  const refreshList = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/verify-payment?status=WAITING_VERIFICATION");
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/verify-payment?status=WAITING_VERIFICATION")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json) {
          setItems(json.data || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleAction = async (transactionId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(transactionId);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memproses aksi verifikasi");
      }

      setFeedback({
        type: "success",
        msg:
          action === "APPROVE"
            ? "Transaksi berhasil disetujui & undangan diaktifkan 365 hari!"
            : "Transaksi berhasil ditolak.",
      });

      // Remove from list
      setItems((prev) => prev.filter((item) => item.id !== transactionId));
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">
              Verifikasi Pembayaran Manual QRIS / Bank
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Validasi bukti transfer pengguna untuk mengaktifkan status undangan &amp; langganan.
            </p>
          </div>

          <button
            onClick={refreshList}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Muat Ulang</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-2 animate-in fade-in ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Table Content */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Order ID &amp; Waktu</th>
                  <th className="py-4 px-6">Pengguna &amp; Undangan</th>
                  <th className="py-4 px-6">Paket &amp; Nominal</th>
                  <th className="py-4 px-6">Bukti Transfer</th>
                  <th className="py-4 px-6 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      Memuat antrean verifikasi...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400 italic">
                      Tidak ada antrean verifikasi manual pending saat ini.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 align-top">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {item.orderId}
                        </span>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {new Date(item.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold text-[10px]">
                          {item.paymentType}
                        </span>
                      </td>

                      <td className="py-4 px-6 align-top">
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                          {item.user?.name || "User"}
                        </p>
                        <p className="text-stone-500 text-[11px]">{item.user?.email}</p>
                        {item.invitation && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                            <span className="font-medium">{item.invitation.title}</span>
                            <a
                              href={`/invitation/${item.invitation.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 align-top">
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {item.tier}
                        </span>
                        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                          Rp {Number(item.amount).toLocaleString("id-ID")}
                        </p>
                      </td>

                      <td className="py-4 px-6 align-top">
                        {item.proofImageUrl ? (
                          <button
                            onClick={() => setActiveModalImg(item.proofImageUrl as string)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 hover:scale-105 transition-transform"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.proofImageUrl}
                              alt="Bukti Transfer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">Tidak ada foto</span>
                        )}
                      </td>

                      <td className="py-4 px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(item.id, "APPROVE")}
                            disabled={processingId === item.id}
                            className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve &amp; Aktifkan</span>
                          </button>

                          <button
                            onClick={() => handleAction(item.id, "REJECT")}
                            disabled={processingId === item.id}
                            className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Proof Image Modal */}
      {activeModalImg && (
        <div
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white dark:bg-stone-900 rounded-3xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-3">
              <h4 className="font-semibold text-xs">Bukti Transfer Asli</h4>
              <button
                onClick={() => setActiveModalImg(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="w-full max-h-[70vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-stone-100 dark:bg-stone-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalImg}
                alt="Bukti Transfer Detail"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
