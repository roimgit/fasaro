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
    cardClass?: string;
    venueNameClass?: string;
    addressClass?: string;
    buttonClass?: string;
    secondaryButtonClass?: string;
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
      <div
        className={`p-4 rounded-2xl border text-center ${
          themeStyle?.cardClass ?? "bg-white/70 border-stone-200 text-stone-900"
        }`}
      >
        <h4
          className={`font-semibold ${
            themeStyle?.venueNameClass ?? "text-stone-900"
          }`}
        >
          {venueName}
        </h4>
        <p
          className={`text-sm mt-1 leading-relaxed ${
            themeStyle?.addressClass ?? "text-stone-600"
          }`}
        >
          {address}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={gmapsTarget}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full text-sm font-semibold transition-all shadow-sm hover:scale-105 active:scale-95 ${
            themeStyle?.buttonClass ??
            "bg-stone-900 hover:bg-stone-800 text-white"
          }`}
        >
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Buka Google Maps</span>
        </a>

        <a
          href={wazeTarget}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full text-sm font-semibold transition-all shadow-sm border hover:scale-105 active:scale-95 ${
            themeStyle?.secondaryButtonClass ??
            "border-stone-300 bg-white/90 hover:bg-white text-stone-800"
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-600" />
          <span>Buka Waze</span>
        </a>
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
