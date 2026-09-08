"use client";

import React, { useState } from "react";
import { Check, Layout, Smartphone } from "lucide-react";
import { THEME_LIST, ThemeId, WeddingInvitationData } from "@/types/wedding";
import ThemeRenderer from "@/components/templates/ThemeRenderer";

interface ThemeSelectorBarProps {
  currentThemeId: string;
  onSelectTheme: (themeId: ThemeId) => void;
  previewData?: WeddingInvitationData;
}

export const ThemeSelectorBar: React.FC<ThemeSelectorBarProps> = ({
  currentThemeId,
  onSelectTheme,
  previewData,
}) => {
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [activePreviewTheme, setActivePreviewTheme] = useState<ThemeId>(
    (currentThemeId as ThemeId) || "minimalist"
  );

  const handleSelect = (themeId: ThemeId) => {
    setActivePreviewTheme(themeId);
    onSelectTheme(themeId);
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
            Pilih Tema Undangan (1-Klik Ganti Tema)
          </h3>
        </div>

        {previewData && (
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:scale-105 transition-transform"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{showMobilePreview ? "Tutup Preview" : "Live Mobile Preview"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {THEME_LIST.map((theme) => {
          const isSelected = currentThemeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelect(theme.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-400 bg-stone-50 dark:bg-stone-900/50"
              }`}
            >
              <div
                className={`h-16 w-full rounded-xl bg-gradient-to-r ${theme.bgPreview} mb-3 flex items-center justify-center`}
              >
                <span className="text-xs font-serif font-medium tracking-wide text-stone-800">
                  {theme.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                    {theme.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                    {theme.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="p-1 rounded-full bg-amber-600 text-white shrink-0 ml-2">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Mobile Frame Preview Modal */}
      {showMobilePreview && previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm h-[88vh] bg-stone-900 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800 flex flex-col">
            {/* Top notch */}
            <div className="w-32 h-4 bg-stone-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-stone-900"></div>
            </div>

            {/* Quick Switch Bar in Preview */}
            <div className="flex justify-center gap-1.5 mb-2 shrink-0">
              {THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActivePreviewTheme(t.id);
                    onSelectTheme(t.id);
                  }}
                  className={`text-[10px] py-1 px-2.5 rounded-full font-medium transition-all ${
                    activePreviewTheme === t.id
                      ? "bg-amber-500 text-stone-900 font-bold"
                      : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Preview Iframe / Renderer Container */}
            <div className="flex-1 w-full rounded-[32px] overflow-y-auto bg-stone-950">
              <ThemeRenderer
                data={previewData}
                forcedThemeId={activePreviewTheme}
                guestName="Bapak Budi & Rekan"
              />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowMobilePreview(false)}
              className="mt-2 py-2 w-full text-center text-xs font-semibold text-stone-300 hover:text-white"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelectorBar;
