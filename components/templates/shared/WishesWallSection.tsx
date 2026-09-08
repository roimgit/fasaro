"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { WishItem } from "@/types/wedding";

interface WishesWallSectionProps {
  invitationId: string;
  themeStyle?: {
    cardClass?: string;
    bubbleClass?: string;
    buttonClass?: string;
    inputClass?: string;
  };
}

const REACTIONS = ["💖", "🤲", "🎉", "💐", "✨", "🤍"];

export const WishesWallSection: React.FC<WishesWallSectionProps> = ({
  invitationId,
  themeStyle,
}) => {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedReaction, setSelectedReaction] = useState("💖");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );


  useEffect(() => {
    let ignore = false;
    fetch(`/api/public/wishes?invitationId=${invitationId}&limit=20`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json) {
          setWishes(json.data || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!senderName.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Nama dan pesan ucapan tidak boleh kosong" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/public/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          senderName: senderName.trim(),
          message: message.trim(),
          reaction: selectedReaction,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirim doa ucapan");
      }

      const resJson = await res.json();
      setWishes((prev) => [resJson.data, ...prev]);
      setMessage("");
      setFeedback({ type: "success", text: "Ucapan & doa restu berhasil dikirim!" });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full my-8 max-w-lg mx-auto">
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-lg ${
          themeStyle?.cardClass ??
          "bg-white/95 dark:bg-stone-800/95 border-stone-200 dark:border-stone-700"
        }`}
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-2">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100">
            Untaian Doa &amp; Ucapan
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Kirimkan doa tulus dan harapan terbaik bagi kedua mempelai.
          </p>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 border ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mb-8">
          <div>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Nama Anda..."
              className={`w-full py-2.5 px-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                themeStyle?.inputClass ??
                "bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              }`}
            />
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan doa restu untuk kedua mempelai..."
              className={`w-full py-2.5 px-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none ${
                themeStyle?.inputClass ??
                "bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
              }`}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedReaction(emoji)}
                  className={`p-1.5 rounded-lg text-base transition-all ${
                    selectedReaction === emoji
                      ? "bg-amber-100 dark:bg-amber-900 scale-125 shadow-sm"
                      : "hover:bg-stone-100 dark:hover:bg-stone-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50 ${
                themeStyle?.buttonClass ??
                "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Mengirim..." : "Kirim Doa"}</span>
            </button>
          </div>
        </form>

        {/* Wishes List Wall */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="text-center text-xs text-stone-400 py-4">Memuat ucapan...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-xs text-stone-400 py-6 italic">
              Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
            </p>
          ) : (
            wishes.map((w) => (
              <div
                key={w.id}
                className={`p-3.5 rounded-2xl border text-left text-xs space-y-1 transition-all ${
                  themeStyle?.bubbleClass ??
                  "bg-stone-50/80 dark:bg-stone-900/80 border-stone-100 dark:border-stone-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    {w.senderName}
                    {w.reaction && <span>{w.reaction}</span>}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {new Date(w.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed break-words">
                  {w.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WishesWallSection;
