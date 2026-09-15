"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Eye,
  Heart,
  LogOut,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";

interface MobileTopBarProps {
  title: string;
  slug: string;
  tier: string;
  isAdmin?: boolean;
  userEmail?: string;
  activeUntil?: string | null;
  isLoading: boolean;
  onOpenPreview: () => void;
  onLogout: () => void;
  onUpgradeClick?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  slug,
  tier,
  isAdmin = false,
  activeUntil,
  isLoading,
  onOpenPreview,
  onLogout,
  onUpgradeClick,
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
              <span
                className={`shrink-0 inline-block px-1.5 py-0.5 rounded font-semibold text-[10px] border ${
                  tier === "FREE"
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-orange-50 text-[#F97316] border-orange-100"
                }`}
              >
                {tier === "FREE" ? "Paket Gratis" : tier}
              </span>
              {tier === "FREE" && (
                <span className="hidden sm:inline text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                  {activeUntil
                    ? `Aktif s/d ${new Date(activeUntil).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} (H+7 Acara)`
                    : "Aktif s/d H+7 Acara"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Button menuju ke Master Admin KHUSUS akun admin@admin.com */}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-[#F97316] text-xs font-semibold min-h-[38px] transition-colors shadow-2xs"
              title="Panel Master Admin (admin@admin.com)"
            >
              <Shield className="w-4 h-4 text-[#F97316]" />
              <span className="hidden md:inline">Master Admin</span>
            </Link>
          )}

          {/* Quick Upgrade Button if on FREE tier */}
          {tier === "FREE" && onUpgradeClick && (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold min-h-[38px] transition-all shadow-xs"
              title="Upgrade ke Paket Berbayar"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Upgrade Paket</span>
            </button>
          )}

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
