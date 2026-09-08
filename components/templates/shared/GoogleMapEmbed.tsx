"use client";

import React from "react";
import { Compass, MapPin } from "lucide-react";

interface GoogleMapEmbedProps {
  venueName: string;
  address: string;
  mapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  themeStyle?: {
    buttonClass?: string;
  };
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  venueName,
  address,
  mapsUrl,
  latitude,
  longitude,
  themeStyle,
}) => {
  const gmapsTarget =
    mapsUrl ||
    (latitude && longitude
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${venueName} ${address}`
        )}`);

  const wazeTarget =
    latitude && longitude
      ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(`${venueName} ${address}`)}`;

  return (
    <div className="w-full space-y-4 my-4">
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-center">
        <h4 className="font-semibold text-stone-900 dark:text-stone-100">{venueName}</h4>
        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
          {address}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={gmapsTarget}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full text-sm font-medium transition-all shadow-sm hover:scale-105 active:scale-95 ${
            themeStyle?.buttonClass ??
            "bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900"
          }`}
        >
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Buka Google Maps</span>
        </a>

        <a
          href={wazeTarget}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full text-sm font-medium transition-all shadow-sm border border-stone-300 dark:border-stone-700 bg-white/80 hover:bg-white text-stone-800 dark:bg-stone-800/80 dark:hover:bg-stone-800 dark:text-stone-100 hover:scale-105 active:scale-95"
        >
          <Compass className="w-4 h-4 text-cyan-500" />
          <span>Buka Waze</span>
        </a>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
