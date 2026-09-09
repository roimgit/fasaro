"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Eye,
  Heart,
  LogOut,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface MobileTopBarProps {
  title: string;
  slug: string;
  tier: string;
  isLoading: boolean;
  onOpenPreview: () => void;
  onLogout: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  slug,
  tier,
  isLoading,
  onOpenPreview,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link href="/" className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#F97316] text-white shadow-xs">
            <Heart className="w-4 h-4 fill-white" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                {title || "Undangan Saya"}
              </h1>
              {isLoading && (
                <RefreshCw className="w-3.5 h-3.5 text-[#F97316] animate-spin shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-mono truncate">fasaro.id/{slug}</span>
              <span className="shrink-0 inline-block px-1.5 py-0.2 rounded bg-orange-50 text-[#F97316] font-semibold text-[10px] border border-orange-100">
                {tier}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Preview Button */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 text-xs font-semibold min-h-[38px] transition-colors"
            title="Lihat simulasi undangan ponsel"
          >
            <Eye className="w-4 h-4 text-[#F97316]" />
            <span className="hidden sm:inline">Preview HP</span>
          </button>

          {/* Open Public Web */}
          <a
            href={`/invitation/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold min-h-[38px] transition-colors shadow-xs"
            title="Buka website undangan langsung"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Buka Web</span>
          </a>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
