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
import { Calendar, Camera, Clock, Heart } from "lucide-react";

interface ThemeProps {
  data: WeddingInvitationData;
  guestName?: string;
  showCover?: boolean;
  isEmbedded?: boolean;
}

export const MinimalistTheme: React.FC<ThemeProps> = ({
  data,
  guestName,
  showCover = true,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(!showCover);
  const primaryEvent = data.eventSchedules[0];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
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
            containerClass: "bg-stone-900/95 text-stone-100",
            cardClass: "bg-white text-stone-900 border-stone-200",
            titleClass: "text-stone-900 font-serif",
            buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
          }}
        />
      )}

      {!isEmbedded && (
        <FloatingAudioPlayer audioUrl={data.musicUrl} autoPlayTrigger={isOpen} />
      )}

      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-20">
        {/* Header Hero */}
        <section className="space-y-4 pt-10">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500 font-medium">
            The Wedding Of
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-tight text-stone-900">
            {data.coupleInfo.groomName}
            <span className="block text-2xl font-serif text-stone-400 my-2">&amp;</span>
            {data.coupleInfo.brideName}
          </h1>
          {primaryEvent?.date && (
            <p className="text-xs tracking-widest text-stone-600 uppercase pt-2">
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
          <section className="border-y border-stone-200 py-8">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Menghitung Hari</p>
            <CountdownTimer
              targetDate={primaryEvent.date}
              themeStyle={{
                boxClass: "bg-white border-stone-200 shadow-sm",
                numberClass: "text-stone-900 font-serif",
                labelClass: "text-stone-500",
              }}
            />
          </section>
        )}

        {/* Couple Info */}
        <section className="space-y-12">
          <div className="max-w-md mx-auto">
            <p className="text-xs text-stone-500 italic leading-relaxed">
              &quot;{data.coupleInfo.greetingMessage ||
                "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami bermaksud menyelenggarakan pernikahan kami."}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            {/* Groom */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 flex items-center justify-center">
                {data.coupleInfo.groomPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.coupleInfo.groomPhoto}
                    alt={data.coupleInfo.groomName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-stone-300" />
                )}
              </div>
              <h3 className="font-serif text-lg font-medium">{data.coupleInfo.groomName}</h3>
              {(data.coupleInfo.groomFather || data.coupleInfo.groomMother) && (
                <p className="text-xs text-stone-500">
                  Putra dari Bpk. {data.coupleInfo.groomFather || "..."} &amp; Ibu{" "}
                  {data.coupleInfo.groomMother || "..."}
                </p>
              )}
              {data.coupleInfo.groomInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.groomInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>@{data.coupleInfo.groomInstagram}</span>
                </a>
              )}
            </div>

            {/* Bride */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 flex items-center justify-center">
                {data.coupleInfo.bridePhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.coupleInfo.bridePhoto}
                    alt={data.coupleInfo.brideName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Heart className="w-8 h-8 text-stone-300" />
                )}
              </div>
              <h3 className="font-serif text-lg font-medium">{data.coupleInfo.brideName}</h3>
              {(data.coupleInfo.brideFather || data.coupleInfo.brideMother) && (
                <p className="text-xs text-stone-500">
                  Putri dari Bpk. {data.coupleInfo.brideFather || "..."} &amp; Ibu{" "}
                  {data.coupleInfo.brideMother || "..."}
                </p>
              )}
              {data.coupleInfo.brideInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.brideInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700"
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
            <p className="text-xs uppercase tracking-widest text-stone-400">Rangkaian Acara</p>
            <h2 className="text-2xl font-serif font-light text-stone-900">Agenda Bahagia</h2>
          </div>

          <div className="space-y-6">
            {data.eventSchedules.map((schedule) => (
              <div
                key={schedule.id ?? schedule.eventName}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-serif font-semibold">{schedule.eventName}</h3>
                <div className="flex items-center justify-center gap-6 text-xs text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    {new Date(schedule.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" />
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
                    buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
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
              <p className="text-xs uppercase tracking-widest text-stone-400">Galeri Foto</p>
              <h2 className="text-2xl font-serif font-light text-stone-900">Momen Bahagia</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.galleries.map((img, idx) => (
                <div
                  key={img.id ?? idx}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200"
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
            cardClass: "bg-white border-stone-200",
            badgeClass: "bg-stone-100 text-stone-800",
            buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
          }}
        />

        {/* RSVP Form */}
        <RsvpFormSection
          invitationId={data.id}
          defaultGuestName={guestName}
          themeStyle={{
            cardClass: "bg-white border-stone-200",
            buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
            inputClass: "bg-stone-50 border-stone-200 text-stone-900",
          }}
        />

        {/* Wishes Wall */}
        <WishesWallSection
          invitationId={data.id}
          themeStyle={{
            cardClass: "bg-white border-stone-200",
            bubbleClass: "bg-stone-50 border-stone-100 text-stone-800",
            buttonClass: "bg-stone-900 hover:bg-stone-800 text-white",
            inputClass: "bg-stone-50 border-stone-200 text-stone-900",
          }}
        />

        <footer className="pt-12 pb-8 text-stone-400 text-xs tracking-wider">
          <p>FASARO &bull; Digital Wedding Invitation</p>
        </footer>
      </main>
    </div>
  );
};

export default MinimalistTheme;
