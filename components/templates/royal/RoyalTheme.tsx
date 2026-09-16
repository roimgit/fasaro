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
import { Calendar, Camera, Clock, Crown, Heart } from "lucide-react";

interface ThemeProps {
  data: WeddingInvitationData;
  guestName?: string;
  showCover?: boolean;
  isEmbedded?: boolean;
}

export const RoyalTheme: React.FC<ThemeProps> = ({
  data,
  guestName,
  showCover = true,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(!showCover);
  const primaryEvent = data.eventSchedules[0];

  return (
    <div className="min-h-screen bg-[#060b14] text-[#f8fafc] font-sans selection:bg-[#f59e0b] selection:text-[#060b14]">
      {/* Amplop Sampul Pembuka Royal */}
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
            containerClass: "bg-[#020617]/95 text-slate-100",
            cardClass:
              "bg-gradient-to-b from-[#0f172a] to-[#020617] border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-slate-100",
            titleClass:
              "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-serif",
            badgeClass: "text-amber-300 font-semibold",
            guestBoxClass: "bg-slate-950/80 border-amber-500/30 text-slate-100 shadow-inner",
            guestLabelClass: "text-amber-200/80 font-medium",
            guestNameClass: "text-amber-300 font-bold",
            guestSubtextClass: "text-slate-400",
            dateClass: "text-amber-200 font-semibold tracking-widest",
            buttonClass:
              "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30",
          }}
        />
      )}

      {!isEmbedded && (
        <FloatingAudioPlayer audioUrl={data.musicUrl} autoPlayTrigger={isOpen} />
      )}

      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-20 relative">
        {/* Header Mahkota Royal */}
        <section className="space-y-4 pt-8">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 mb-2">
            <Crown className="w-8 h-8 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
          </div>

          <p className="text-xs uppercase tracking-[0.4em] text-amber-400/90 font-medium">
            Royal Wedding Invitation
          </p>

          <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 py-1">
            {data.coupleInfo.groomName}
            <span className="block text-2xl font-serif text-amber-400 my-2">&amp;</span>
            {data.coupleInfo.brideName}
          </h1>

          {primaryEvent?.date && (
            <p className="text-xs tracking-widest text-slate-300 font-medium uppercase pt-2">
              {new Date(primaryEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </section>

        {/* Countdown */}
        {primaryEvent?.date && (
          <section className="py-6 px-3 sm:px-4 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.08)] overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 text-xs tracking-widest uppercase text-amber-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Menghitung Waktu Bersejarah</span>
            </div>
            <CountdownTimer
              targetDate={primaryEvent.date}
              themeStyle={{
                boxClass: "bg-[#0b1329] border-amber-500/40 shadow-inner",
                numberClass:
                  "text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-400 font-serif font-bold",
                labelClass: "text-amber-300/80 font-semibold",
              }}
            />
          </section>
        )}

        {/* Couple Info */}
        <section className="space-y-12">
          <div className="max-w-md mx-auto">
            <p className="text-xs text-slate-200/90 italic leading-relaxed">
              &quot;{data.coupleInfo.greetingMessage ||
                "Dengan segala puji bagi Tuhan Yang Maha Pengasih, kami bermaksud mengikat janji suci dalam upacara pernikahan agung."}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            {/* Groom */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-3 shadow-lg">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-950 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center">
                {data.coupleInfo.groomPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.coupleInfo.groomPhoto}
                    alt={data.coupleInfo.groomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <h3 className="font-serif text-lg text-amber-200 font-medium">
                {data.coupleInfo.groomName}
              </h3>
              {(data.coupleInfo.groomFather || data.coupleInfo.groomMother) && (
                <p className="text-xs text-slate-300">
                  Putra dari Bpk. {data.coupleInfo.groomFather || "..."} &amp; Ibu{" "}
                  {data.coupleInfo.groomMother || "..."}
                </p>
              )}
              {data.coupleInfo.groomInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.groomInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>@{data.coupleInfo.groomInstagram}</span>
                </a>
              )}
            </div>

            {/* Bride */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-3 shadow-lg">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-950 border-2 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center">
                {data.coupleInfo.bridePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.coupleInfo.bridePhoto}
                    alt={data.coupleInfo.brideName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <h3 className="font-serif text-lg text-amber-200 font-medium">
                {data.coupleInfo.brideName}
              </h3>
              {(data.coupleInfo.brideFather || data.coupleInfo.brideMother) && (
                <p className="text-xs text-slate-300">
                  Putri dari Bpk. {data.coupleInfo.brideFather || "..."} &amp; Ibu{" "}
                  {data.coupleInfo.brideMother || "..."}
                </p>
              )}
              {data.coupleInfo.brideInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.brideInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>@{data.coupleInfo.brideInstagram}</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Schedules */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-amber-400">Agenda Acara</p>
            <h2 className="text-2xl font-serif text-amber-100">Waktu &amp; Kehormatan Kehadiran</h2>
          </div>

          <div className="space-y-6">
            {data.eventSchedules.map((schedule) => (
              <div
                key={schedule.id ?? schedule.eventName}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-lg space-y-4 text-center"
              >
                <h3 className="text-xl font-serif text-amber-200 font-medium">
                  {schedule.eventName}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {new Date(schedule.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
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
                    cardClass: "bg-slate-950/80 border border-amber-500/30 text-slate-100",
                    venueNameClass: "text-amber-200 font-serif font-bold",
                    addressClass: "text-slate-300 text-xs",
                    buttonClass:
                      "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold",
                    secondaryButtonClass:
                      "border border-amber-500/40 bg-slate-900/80 hover:bg-slate-800 text-amber-200",
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
              <p className="text-xs uppercase tracking-widest text-amber-400">Galeri Abadi</p>
              <h2 className="text-2xl font-serif text-amber-100">Potret Kebahagiaan</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.galleries.map((img, idx) => (
                <div
                  key={img.id ?? idx}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/30"
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
            titleClass: "text-amber-100 font-serif",
            subtitleClass: "text-slate-300",
            cardClass: "bg-slate-900/90 border-amber-500/30 text-slate-100",
            badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-400/40",
            accountNumberClass: "text-amber-200",
            accountHolderClass: "text-slate-300",
            qrisButtonClass: "text-amber-300 hover:text-amber-200 font-semibold",
            buttonClass:
              "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold",
          }}
        />

        {/* RSVP Form */}
        <RsvpFormSection
          invitationId={data.id}
          defaultGuestName={guestName}
          themeStyle={{
            cardClass: "bg-slate-900/95 border-amber-500/30 text-slate-100 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
            titleClass: "text-amber-100 font-serif",
            subtitleClass: "text-slate-300",
            labelClass: "text-amber-200 font-medium",
            statusButtonClass: "bg-slate-950 border-slate-700 text-slate-200 hover:border-amber-400",
            statusButtonActiveClass: "bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-md",
            buttonClass:
              "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold",
            inputClass: "bg-slate-950 border-slate-800 text-slate-100 focus:ring-amber-500 placeholder:text-slate-500",
            submittedTitleClass: "text-amber-200 font-serif",
            submittedSubtitleClass: "text-slate-300",
          }}
        />

        {/* Wishes Wall */}
        <WishesWallSection
          invitationId={data.id}
          themeStyle={{
            cardClass: "bg-slate-900/95 border-amber-500/30 text-slate-100 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
            titleClass: "text-amber-100 font-serif",
            subtitleClass: "text-slate-300",
            bubbleClass: "bg-slate-950 border-slate-800 text-slate-200",
            senderClass: "text-amber-300 font-bold",
            messageClass: "text-slate-200",
            dateClass: "text-slate-400",
            emptyTextClass: "text-slate-400",
            loadingTextClass: "text-slate-400",
            reactionButtonClass: "hover:bg-slate-800",
            buttonClass:
              "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold",
            inputClass: "bg-slate-950 border-slate-800 text-slate-100 focus:ring-amber-500 placeholder:text-slate-500",
          }}
        />

        <footer className="pt-12 pb-8 text-amber-400/80 text-xs tracking-widest uppercase">
          <p>FASARO &bull; Royal Luxury Wedding Edition</p>
        </footer>
      </main>
    </div>
  );
};

export default RoyalTheme;
