"use client";

import React, { useEffect, useState } from "react";
import { MailOpen } from "lucide-react";

interface HeroCoverProps {
  groomName: string;
  brideName: string;
  guestName?: string;
  eventDate?: string | Date;
  onOpenInvitation: () => void;
  isOpen: boolean;
  isEmbedded?: boolean;
  themeStyle?: {
    containerClass?: string;
    cardClass?: string;
    buttonClass?: string;
    titleClass?: string;
    subtitleClass?: string;
  };
}

export const HeroCover: React.FC<HeroCoverProps> = ({
  groomName,
  brideName,
  guestName,
  eventDate,
  onOpenInvitation,
  isOpen,
  isEmbedded = false,
  themeStyle,
}) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isEmbedded) return;

    if (!isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => setShouldRender(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEmbedded]);

  if (!shouldRender) {
    return null;
  }

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tanggal Bahagia";

  const positionClass = isEmbedded ? "absolute inset-0 z-50" : "fixed inset-0 z-50";

  return (
    <div
      className={`${positionClass} flex items-center justify-center p-4 transition-all duration-700 backdrop-blur-md transform-gpu ${
        isOpen
          ? "opacity-0 -translate-y-8 pointer-events-none"
          : "opacity-100 translate-y-0"
      } ${themeStyle?.containerClass ?? "bg-stone-900/90 text-stone-100"}`}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-8 text-center shadow-2xl transition-transform animate-in fade-in zoom-in duration-500 ${
          themeStyle?.cardClass ?? "bg-stone-800/80 border border-stone-700/60 backdrop-blur-xl"
        }`}
      >
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-stone-700 dark:text-stone-200 mb-3">
          Walimatul Ursy / Undangan Pernikahan
        </p>

        <h1
          className={`text-3xl sm:text-4xl font-serif font-light tracking-wide my-4 ${
            themeStyle?.titleClass ?? "text-stone-900 dark:text-stone-50"
          }`}
        >
          {groomName} &amp; {brideName}
        </h1>

        <div className="my-6 py-4 px-3 rounded-2xl bg-stone-900/5 dark:bg-white/10 border border-stone-900/10 dark:border-white/15">
          <p className="text-xs tracking-wider text-stone-600 dark:text-stone-300 font-medium mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="text-xl font-bold tracking-normal text-stone-900 dark:text-white">
            {guestName || "Tamu Undangan"}
          </p>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 italic">
            *Mohon maaf jika ada kesalahan penulisan nama/gelar
          </p>
        </div>

        <p className="text-xs font-semibold tracking-widest text-stone-700 dark:text-stone-200 mb-6 uppercase">
          {formattedDate}
        </p>

        <button
          onClick={onOpenInvitation}
          className={`w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full font-medium transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
            themeStyle?.buttonClass ??
            "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
          }`}
        >
          <MailOpen className="w-4 h-4 animate-bounce" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </div>
  );
};

export default HeroCover;
