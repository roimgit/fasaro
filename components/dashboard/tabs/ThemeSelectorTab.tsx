"use client";

import React from "react";
import {
  Check,
  ExternalLink,
  Eye,
  Palette,
} from "lucide-react";
import { THEME_LIST, ThemeId } from "@/types/wedding";

interface ThemeSelectorTabProps {
  currentThemeId: ThemeId;
  slug?: string;
  onSelectTheme: (id: ThemeId) => void;
  onOpenPreview: () => void;
}

export const ThemeSelectorTab: React.FC<ThemeSelectorTabProps> = ({
  currentThemeId,
  slug,
  onSelectTheme,
  onOpenPreview,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Pilihan Desain Tema Undangan
          </h2>
          <p className="text-xs text-slate-500">
            Ganti tema kapan saja secara instan. Seluruh data mempelai yang sudah Anda isi otomatis diterapkan ke tema yang dipilih.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPreview}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Lihat di Layar Ponsel</span>
        </button>
      </div>

      {/* Grid Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEME_LIST.map((theme) => {
          const isSelected = currentThemeId === theme.id;
          const previewUrl = slug
            ? isSelected
              ? `/invitation/${slug}`
              : `/invitation/${slug}?theme=${theme.id}`
            : `/invitation/demo-${theme.id}`;

          return (
            <div
              key={theme.id}
              className={`rounded-xl bg-white border p-4 shadow-xs transition-all flex flex-col justify-between space-y-3.5 ${
                isSelected
                  ? "border-2 border-[#F97316] ring-1 ring-orange-100"
                  : "border-[#E2E8F0] hover:border-slate-300"
              }`}
            >
              {/* Visual Preview Box */}
              <div
                className={`h-40 w-full rounded-lg bg-gradient-to-tr ${theme.bgPreview} relative overflow-hidden flex flex-col items-center justify-center p-3 border border-white/10`}
              >
                <span className="text-sm font-bold text-white drop-shadow-sm text-center">
                  {theme.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/90 mt-1 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-xs font-semibold">
                  {theme.category}
                </span>

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{theme.name}</h3>
                  <span className="text-[10px] text-[#F97316] font-semibold uppercase">
                    Responsive
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{theme.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-lg text-xs font-semibold border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1 transition-colors min-h-[40px]"
                    title={
                      slug
                        ? isSelected
                          ? "Buka undangan Anda dengan data asli"
                          : "Pratinjau data mempelai Anda pada tema ini"
                        : "Buka demo"
                    }
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isSelected ? "Buka Web" : "Pratinjau"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectTheme(theme.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors min-h-[40px] ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Digunakan</span>
                      </>
                    ) : (
                      <span>Pilih Tema</span>
                    )}
                  </button>
                </div>

                {slug && (
                  <div className="text-center">
                    <a
                      href={`/invitation/demo-${theme.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors inline-block py-0.5"
                    >
                      Lihat versi contoh dummy &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelectorTab;
