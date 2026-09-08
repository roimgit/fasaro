"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WeddingInvitationData } from "@/types/wedding";
import HeroCover from "../shared/HeroCover";
import FloatingAudioPlayer from "../shared/FloatingAudioPlayer";
import CountdownTimer from "../shared/CountdownTimer";
import GoogleMapEmbed from "../shared/GoogleMapEmbed";
import DigitalGiftBox from "../shared/DigitalGiftBox";
import RsvpFormSection from "../shared/RsvpFormSection";
import WishesWallSection from "../shared/WishesWallSection";
import { Calendar, Camera, Clock, Heart, Moon } from "lucide-react";

interface ThemeProps {
  data: WeddingInvitationData;
  guestName?: string;
  showCover?: boolean;
  isEmbedded?: boolean;
}

export const SyariTheme: React.FC<ThemeProps> = ({
  data,
  guestName,
  showCover = true,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(!showCover);
  const primaryEvent = data.eventSchedules[0];

  return (
    <div className="min-h-screen bg-[#071d18] text-[#e3ece8] font-sans selection:bg-[#115e59] selection:text-[#f0fdf4]">
      {showCover && (
        <HeroCover
          groomName={data.coupleInfo.groomNickname || data.coupleInfo.groomName}
          brideName={data.coupleInfo.brideNickname || data.coupleInfo.brideName}
          guestName={guestName}
          eventDate={primaryEvent?.date}
          isOpen={isOpen}
          isEmbedded={isEmbedded}
          onOpenInvitation={() => setIsOpen(true)}
          themeStyle={{
            containerClass: "bg-[#030d0b]/95 text-[#e3ece8]",
            cardClass: "bg-[#0b2b24]/90 text-[#e3ece8] border-[#134e4a]/60 backdrop-blur-xl",
            titleClass: "text-[#5eead4] font-serif",
            buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50",
          }}
        />
      )}

      {!isEmbedded && (
        <FloatingAudioPlayer audioUrl={data.musicUrl} autoPlayTrigger={isOpen} />
      )}

      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-20 relative">
        {/* Header Arabesque */}
        <section className="space-y-4 pt-8">
          <div className="flex justify-center text-[#5eead4] mb-2">
            <Moon className="w-8 h-8" />
          </div>

          <p className="text-sm font-serif text-[#5eead4] tracking-widest">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400 font-medium">
            Walimatul &apos;Ursy
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-wide text-emerald-100">
            {data.coupleInfo.groomName}
            <span className="block text-2xl font-serif text-[#5eead4] my-2">&amp;</span>
            {data.coupleInfo.brideName}
          </h1>

          {primaryEvent?.date && (
            <p className="text-xs tracking-widest text-emerald-300 uppercase pt-2">
              {new Date(primaryEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </section>

        {/* Ayat Quran & Greeting */}
        <section className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0d342c]/70 border border-[#134e4a] text-center max-w-lg mx-auto space-y-3">
            <p className="text-xs font-serif text-emerald-300 leading-loose">
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا
              وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً
            </p>
            <p className="text-xs text-emerald-100/80 italic leading-relaxed">
              &quot;{data.coupleInfo.greetingMessage ||
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."}&quot;
            </p>
            <p className="text-[11px] uppercase tracking-widest text-emerald-400">
              (QS. Ar-Rum: 21)
            </p>
          </div>
        </section>

        {/* Countdown */}
        {primaryEvent?.date && (
          <section className="py-6 px-4 rounded-3xl bg-[#0d342c]/70 border border-[#134e4a]">
            <p className="text-xs tracking-widest uppercase text-emerald-400 mb-2">
              Menuju Hari Akad
            </p>
            <CountdownTimer
              targetDate={primaryEvent.date}
              themeStyle={{
                boxClass: "bg-[#071d18] border-[#134e4a] shadow-inner",
                numberClass: "text-[#5eead4] font-serif",
                labelClass: "text-emerald-300",
              }}
            />
          </section>
        )}

        {/* Couple Info */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          {/* Groom */}
          <div className="p-6 rounded-3xl bg-[#0d342c]/70 border border-[#134e4a] space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-[#071d18] border-2 border-emerald-500/40 flex items-center justify-center">
              {data.coupleInfo.groomPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.coupleInfo.groomPhoto}
                  alt={data.coupleInfo.groomName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Heart className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <h3 className="font-serif text-lg text-emerald-100 font-medium">
              {data.coupleInfo.groomName}
            </h3>
            {(data.coupleInfo.groomFather || data.coupleInfo.groomMother) && (
              <p className="text-xs text-emerald-200/70">
                Putra dari Bpk. {data.coupleInfo.groomFather || "..."} &amp; Ibu{" "}
                {data.coupleInfo.groomMother || "..."}
              </p>
            )}
            {data.coupleInfo.groomInstagram && (
              <a
                href={`https://instagram.com/${data.coupleInfo.groomInstagram}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>@{data.coupleInfo.groomInstagram}</span>
              </a>
            )}
          </div>

          {/* Bride */}
          <div className="p-6 rounded-3xl bg-[#0d342c]/70 border border-[#134e4a] space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-[#071d18] border-2 border-emerald-500/40 flex items-center justify-center">
              {data.coupleInfo.bridePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.coupleInfo.bridePhoto}
                  alt={data.coupleInfo.brideName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Heart className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <h3 className="font-serif text-lg text-emerald-100 font-medium">
              {data.coupleInfo.brideName}
            </h3>
            {(data.coupleInfo.brideFather || data.coupleInfo.brideMother) && (
              <p className="text-xs text-emerald-200/70">
                Putri dari Bpk. {data.coupleInfo.brideFather || "..."} &amp; Ibu{" "}
                {data.coupleInfo.brideMother || "..."}
              </p>
            )}
            {data.coupleInfo.brideInstagram && (
              <a
                href={`https://instagram.com/${data.coupleInfo.brideInstagram}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>@{data.coupleInfo.brideInstagram}</span>
              </a>
            )}
          </div>
        </section>

        {/* Schedules */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-emerald-400">
              Waktu &amp; Tempat
            </p>
            <h2 className="text-2xl font-serif text-emerald-100">Rangkaian Acara Akad &amp; Resepsi</h2>
          </div>

          <div className="space-y-6">
            {data.eventSchedules.map((schedule) => (
              <div
                key={schedule.id ?? schedule.eventName}
                className="p-6 rounded-3xl bg-[#0d342c]/70 border border-[#134e4a] shadow-sm space-y-4"
              >
                <h3 className="text-xl font-serif text-emerald-200">{schedule.eventName}</h3>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-300/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    {new Date(schedule.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    {schedule.startTime} {schedule.endTime ? `- ${schedule.endTime}` : "WIB"}
                  </span>
                </div>

                <GoogleMapEmbed
                  venueName={schedule.venueName}
                  address={schedule.address}
                  mapsUrl={schedule.mapsUrl}
                  latitude={schedule.latitude}
                  longitude={schedule.longitude}
                  themeStyle={{
                    buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        {data.galleries && data.galleries.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-emerald-400">Galeri Foto</p>
              <h2 className="text-2xl font-serif text-emerald-100">Dokumentasi Kenangan</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.galleries.map((img, idx) => (
                <div
                  key={img.id ?? idx}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-[#071d18] border border-[#134e4a]"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.caption || `Gallery ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 300px"
                    priority={false}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Digital Gift Box */}
        <DigitalGiftBox
          bankAccounts={data.bankAccounts}
          themeStyle={{
            cardClass: "bg-[#0d342c]/80 border-[#134e4a]",
            badgeClass: "bg-[#071d18] text-[#5eead4]",
            buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
          }}
        />

        {/* RSVP Form */}
        <RsvpFormSection
          invitationId={data.id}
          defaultGuestName={guestName}
          themeStyle={{
            cardClass: "bg-[#0d342c]/90 border-[#134e4a]",
            buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
            inputClass: "bg-[#071d18] border-[#134e4a] text-emerald-100",
          }}
        />

        {/* Wishes Wall */}
        <WishesWallSection
          invitationId={data.id}
          themeStyle={{
            cardClass: "bg-[#0d342c]/90 border-[#134e4a]",
            bubbleClass: "bg-[#071d18] border-[#134e4a] text-emerald-100",
            buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
            inputClass: "bg-[#071d18] border-[#134e4a] text-emerald-100",
          }}
        />

        <footer className="pt-12 pb-8 text-emerald-500 text-xs tracking-wider">
          <p>FASARO &bull; Syar&apos;i Islamic Wedding Theme</p>
        </footer>
      </main>
    </div>
  );
};

export default SyariTheme;
