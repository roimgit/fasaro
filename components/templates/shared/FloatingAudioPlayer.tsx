"use client";

import React, { useEffect, useRef, useState } from "react";
import { Disc3, VolumeX } from "lucide-react";

interface FloatingAudioPlayerProps {
  audioUrl?: string | null;
  autoPlayTrigger?: boolean;
}

export const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  audioUrl,
  autoPlayTrigger = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Default pleasant instrumental audio if none provided
  const sourceUrl =
    audioUrl ||
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser audio autoplay policy might block silent execution until user interaction
          setIsPlaying(false);
        });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={sourceUrl} loop preload="auto" />
      <div className="fixed bottom-6 right-6 z-40 transform-gpu will-change-transform">
        <button
          onClick={togglePlay}
          aria-label="Toggle Audio"
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-300 border border-amber-400/30 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <>
              <Disc3 className="w-6 h-6 animate-spin text-amber-400" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </>
          ) : (
            <VolumeX className="w-5 h-5 text-stone-400" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingAudioPlayer;
