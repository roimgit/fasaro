"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, ExternalLink, Smartphone, Sparkles, X } from "lucide-react";
import { THEME_LIST, ThemeId, WeddingInvitationData } from "@/types/wedding";
import ThemeRenderer from "@/components/templates/ThemeRenderer";

interface ThemeCatalogProps {
  demoData: WeddingInvitationData;
}

const CATEGORIES = [
  "Semua",
  "Minimalist",
  "Floral/Rustic",
  "Syar'i/Adat",
  "Luxury Dark Gold",
  "Modern Chic",
] as const;

export const ThemeCatalogSection: React.FC<ThemeCatalogProps> = ({ demoData }) => {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [modalTheme, setModalTheme] = useState<ThemeId | null>(null);

  const filteredThemes = THEME_LIST.filter((theme) => {
    if (activeCategory === "Semua") return true;
    return theme.category === activeCategory;
  });

  return (
    <section id="tema" className="w-full space-y-10 py-16 scroll-mt-20">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Koleksi Eksklusif</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Pilihan Desain Tema Undangan Digital
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Setiap tema dirancang responsif dengan pengalaman visual terbaik di ponsel pintar para tamu undangan Anda.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-2 px-4 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20 scale-105"
                : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-xs"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredThemes.map((theme) => (
          <div
            key={theme.id}
            className="group relative rounded-3xl bg-white border border-stone-200/90 p-5 shadow-sm hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col justify-between space-y-4"
          >
            {/* Visual Cover Preview */}
            <div
              className={`h-48 w-full rounded-2xl bg-gradient-to-tr ${theme.bgPreview} relative overflow-hidden flex flex-col items-center justify-center p-4 border border-white/10`}
            >
              <span className="text-sm font-serif font-bold text-white drop-shadow-md text-center">
                {theme.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/80 mt-1 px-2.5 py-0.5 rounded-full bg-black/20 backdrop-blur-sm">
                {theme.category}
              </span>

              {/* Hover Quick Overlay */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalTheme(theme.id)}
                  className="py-2 px-3.5 rounded-full text-xs font-bold bg-white text-stone-900 shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <a
                  href={`/invitation/demo-${theme.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:scale-105 transition-transform flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900">{theme.name}</h3>
                <span className="text-[10px] text-orange-600 font-semibold uppercase">
                  Responsive
                </span>
              </div>
              <p className="text-xs text-stone-500 line-clamp-2">{theme.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalTheme(theme.id)}
                  className="py-2 px-2.5 rounded-xl text-xs font-semibold border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors flex items-center justify-center gap-1.5"
                  title="Preview simulasi ponsel"
                >
                  <Smartphone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Simulasi</span>
                </button>

                <a
                  href={`/invitation/demo-${theme.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl text-xs font-semibold border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-700 transition-colors flex items-center justify-center gap-1.5"
                  title="Buka undangan demo di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Tab Baru</span>
                </a>
              </div>

              <Link
                href={`/login?from=/dashboard&themeId=${theme.id}`}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xs transition-all text-center flex items-center justify-center"
              >
                <span>Gunakan Tema Ini</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Live Phone Simulation Modal */}
      {modalTheme && (
        <div
          onClick={() => setModalTheme(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm h-[88vh] bg-stone-900 rounded-[50px] p-3 shadow-2xl border-4 border-stone-800 flex flex-col"
          >
            {/* Top Bar with notch, external link & close */}
            <div className="flex items-center justify-between px-3 py-1 mb-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 font-mono">Live Demo</span>
                <a
                  href={`/invitation/demo-${modalTheme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 underline font-medium transition-colors"
                  title="Buka demo layar penuh di tab baru"
                >
                  <span>Buka Tab Baru</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button
                onClick={() => setModalTheme(null)}
                className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                aria-label="Tutup Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notch */}
            <div className="w-28 h-3.5 bg-stone-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-stone-950"></div>
            </div>

            {/* Mobile Viewport Content */}
            <div className="flex-1 w-full rounded-[36px] overflow-y-auto overflow-x-hidden no-scrollbar bg-stone-950 shadow-inner relative isolate scroll-smooth">
              <ThemeRenderer
                data={demoData}
                forcedThemeId={modalTheme}
                guestName="Bapak Budi & Rekan"
                isEmbedded={true}
              />
            </div>

            {/* Bottom Select CTA */}
            <div className="pt-2 px-1 shrink-0 grid grid-cols-2 gap-2">
              <a
                href={`/invitation/demo-${modalTheme}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-2xl text-xs font-semibold border border-stone-700 bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                <span>Buka Tab Baru</span>
              </a>
              <Link
                href={`/login?from=/dashboard&themeId=${modalTheme}`}
                className="py-2.5 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md text-center transition-colors flex items-center justify-center"
              >
                Gunakan Tema
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default ThemeCatalogSection;
