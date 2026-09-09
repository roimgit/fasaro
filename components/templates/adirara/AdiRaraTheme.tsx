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
import {
  Calendar,
  CalendarPlus,
  Clock,
  Gift,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface ThemeProps {
  data: WeddingInvitationData;
  guestName?: string;
  showCover?: boolean;
  isEmbedded?: boolean;
}

export const AdiRaraTheme: React.FC<ThemeProps> = ({
  data,
  guestName,
  showCover = true,
  isEmbedded = false,
}) => {
  const [isOpen, setIsOpen] = useState(!showCover);
  const primaryEvent = data.eventSchedules[0];

  const generateGoogleCalendarUrl = (
    title: string,
    dateStr: string | Date,
    startTime: string,
    venue: string
  ) => {
    const d = new Date(dateStr);
    const dateFormatted = d.toISOString().slice(0, 10).replace(/-/g, "");
    const timeFormatted = startTime.replace(/[^0-9]/g, "").padEnd(4, "0");
    const startIso = `${dateFormatted}T${timeFormatted}00Z`;
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startIso}/${startIso}&location=${encodeURIComponent(venue)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332a24] font-sans pb-28 selection:bg-rose-200 selection:text-rose-900">
      {/* 1. Sampul Pembuka Amplop WebNikah */}
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
            containerClass: "bg-stone-900/90 text-stone-100",
            cardClass:
              "bg-[#fffbf7] border-2 border-[#e7d5c4] shadow-2xl text-[#332a24]",
            titleClass: "text-[#9f1239] font-serif",
            buttonClass:
              "bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold shadow-lg shadow-rose-900/20",
          }}
        />
      )}

      {!isEmbedded && (
        <FloatingAudioPlayer audioUrl={data.musicUrl} autoPlayTrigger={isOpen} />
      )}

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-24">
        {/* Section: The Wedding Of & Hero Banner */}
        <section id="home" className="space-y-4 pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <Heart className="w-3.5 h-3.5 fill-rose-600" />
            <span>The Wedding of</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif tracking-normal text-[#881337] py-2">
            {data.coupleInfo.brideNickname || data.coupleInfo.brideName}
            <span className="block text-2xl font-serif text-[#b91c1c] my-2">&amp;</span>
            {data.coupleInfo.groomNickname || data.coupleInfo.groomName}
          </h1>

          {primaryEvent?.date && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#f3e7dc] text-[#5c3e2e] text-xs font-semibold tracking-wider uppercase">
              {new Date(primaryEvent.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}

          {/* Countdown Card */}
          {primaryEvent?.date && (
            <div className="mt-8 p-6 rounded-3xl bg-white border border-[#eadacb] shadow-sm">
              <p className="text-xs uppercase tracking-widest text-stone-800 font-semibold mb-2">
                Menghitung Hari Menuju Hari Bahagia
              </p>
              <CountdownTimer
                targetDate={primaryEvent.date}
                themeStyle={{
                  boxClass: "bg-[#fffaf5] border-[#ebd6c4] shadow-sm",
                  numberClass: "text-rose-900 font-serif font-bold",
                  labelClass: "text-stone-800 font-semibold text-[10px]",
                }}
              />
            </div>
          )}
        </section>

        {/* Section: Mempelai (Profile) */}
        <section id="mempelai" className="space-y-12">
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-3xl font-serif font-semibold text-rose-900">
              Kedua Mempelai
            </h2>
            <p className="text-xs text-stone-800 font-medium italic leading-relaxed">
              &quot;{data.coupleInfo.greetingMessage ||
                "Maha Kuasa Allah yang telah mempertemukan kami dalam sebuah momen tak terduga. Dengan memohon rahmat dan ridho-Nya, kami mengundang Anda untuk menyaksikan ikatan janji suci kami."}&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
            {/* Mempelai Wanita (Rara style) */}
            <div className="p-6 rounded-3xl bg-white border border-[#ebd6c4] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-rose-50 border-4 border-rose-100 shadow flex items-center justify-center relative">
                  {data.coupleInfo.bridePhoto ? (
                    <Image
                      src={data.coupleInfo.bridePhoto}
                      alt={data.coupleInfo.brideName}
                      fill
                      sizes="120px"
                      priority={false}
                      className="object-cover"
                    />
                  ) : (
                    <Heart className="w-10 h-10 text-rose-300" />
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-rose-900">
                  {data.coupleInfo.brideName}
                </h3>
                {(data.coupleInfo.brideFather || data.coupleInfo.brideMother) && (
                  <p className="text-xs text-stone-700 font-medium">
                    Putri dari Bpk. {data.coupleInfo.brideFather || "..."} &amp; Ibu{" "}
                    {data.coupleInfo.brideMother || "..."}
                  </p>
                )}
              </div>
              {data.coupleInfo.brideInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.brideInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1.5 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
                >
                  @{data.coupleInfo.brideInstagram}
                </a>
              )}
            </div>

            {/* Mempelai Pria (Adi style) */}
            <div className="p-6 rounded-3xl bg-white border border-[#ebd6c4] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-rose-50 border-4 border-rose-100 shadow flex items-center justify-center relative">
                  {data.coupleInfo.groomPhoto ? (
                    <Image
                      src={data.coupleInfo.groomPhoto}
                      alt={data.coupleInfo.groomName}
                      fill
                      sizes="120px"
                      priority={false}
                      className="object-cover"
                    />
                  ) : (
                    <Heart className="w-10 h-10 text-rose-300" />
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-rose-900">
                  {data.coupleInfo.groomName}
                </h3>
                {(data.coupleInfo.groomFather || data.coupleInfo.groomMother) && (
                  <p className="text-xs text-stone-700 font-medium">
                    Putra dari Bpk. {data.coupleInfo.groomFather || "..."} &amp; Ibu{" "}
                    {data.coupleInfo.groomMother || "..."}
                  </p>
                )}
              </div>
              {data.coupleInfo.groomInstagram && (
                <a
                  href={`https://instagram.com/${data.coupleInfo.groomInstagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1.5 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold"
                >
                  @{data.coupleInfo.groomInstagram}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Section: Cerita Cinta / Love Story Timeline (Khas WebNikah) */}
        <section id="cerita" className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
              Kilas Balik
            </span>
            <h2 className="text-3xl font-serif font-semibold text-[#332a24]">Cerita Cinta</h2>
          </div>

          <div className="space-y-4 text-left max-w-lg mx-auto">
            <div className="p-5 rounded-2xl bg-white border border-[#ebd6c4] shadow-sm relative pl-6 border-l-4 border-l-rose-700">
              <span className="text-[11px] font-bold text-rose-700">Awal Pertemuan</span>
              <h4 className="font-bold text-sm text-stone-900 mt-0.5">Pertama Kali Berjumpa</h4>
              <p className="text-xs text-stone-700 font-normal mt-1 leading-relaxed">
                Dipertemukan dalam sebuah momen yang tak direncanakan, senyum dan kepribadian santun
                itu selalu membekas hingga takdir mempertemukan kembali.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#ebd6c4] shadow-sm relative pl-6 border-l-4 border-l-rose-700">
              <span className="text-[11px] font-bold text-rose-700">Silaturahmi Keluarga</span>
              <h4 className="font-bold text-sm text-stone-900 mt-0.5">Mengunjungi Rumah Keluarga</h4>
              <p className="text-xs text-stone-700 font-normal mt-1 leading-relaxed">
                Niat tulus dipertemukan dengan restu kedua orang tua saat pertama kali bersilaturahmi
                ke kediaman keluarga besar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#ebd6c4] shadow-sm relative pl-6 border-l-4 border-l-rose-700">
              <span className="text-[11px] font-bold text-rose-700">Lamaran &amp; Komitmen</span>
              <h4 className="font-bold text-sm text-stone-900 mt-0.5">Prosesi Lamaran Resmi</h4>
              <p className="text-xs text-stone-700 font-normal mt-1 leading-relaxed">
                Mengikat janji awal dalam sebuah acara lamaran hangat dihadiri sanak famili terdekat
                menuju gerbang pernikahan.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Undangan dan Acara (Akad & Resepsi) */}
        <section id="undangan" className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
              Waktu &amp; Agenda
            </span>
            <h2 className="text-3xl font-serif font-semibold text-[#332a24]">
              Undangan &amp; Acara
            </h2>
          </div>

          <div className="space-y-6">
            {data.eventSchedules.map((schedule) => (
              <div
                key={schedule.id ?? schedule.eventName}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ebd6c4] shadow-sm space-y-5 text-center"
              >
                <div className="inline-flex p-2.5 rounded-full bg-rose-50 text-rose-700 mb-1">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-rose-900">
                  {schedule.eventName}
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-700" />
                    {new Date(schedule.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-700" />
                    {schedule.startTime} {schedule.endTime ? `- ${schedule.endTime}` : "WIB"}
                  </span>
                </div>

                {/* Tombol Add To Calendar (Khas WebNikah) */}
                <div className="pt-1">
                  <a
                    href={generateGoogleCalendarUrl(
                      `${schedule.eventName} - ${data.coupleInfo.brideName} & ${data.coupleInfo.groomName}`,
                      schedule.date,
                      schedule.startTime,
                      schedule.venueName
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all hover:scale-105"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>+ Add To Calendar</span>
                  </a>
                </div>

                <div id="peta" className="pt-2">
                  <GoogleMapEmbed
                    venueName={schedule.venueName}
                    address={schedule.address}
                    mapsUrl={schedule.mapsUrl}
                    latitude={schedule.latitude}
                    longitude={schedule.longitude}
                    themeStyle={{
                      buttonClass: "bg-rose-800 hover:bg-rose-900 text-white font-medium",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Galeri Photo */}
        {data.galleries && data.galleries.length > 0 && (
          <section id="galeri" className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
                Dokumentasi
              </span>
              <h2 className="text-3xl font-serif font-semibold text-[#332a24]">Galeri Photo</h2>
              <p className="text-xs text-stone-700 font-medium">
                Photo-photo kebahagiaan kami yang kami kenang selalu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {data.galleries.map((img, idx) => (
                <div
                  key={img.id ?? idx}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-[#ecd9c6] border border-[#dfcdb9] shadow-sm"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.caption || `Galeri ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 350px"
                    priority={false}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Kirim Kado / Tanda Kasih */}
        <section id="kado">
          <DigitalGiftBox
            bankAccounts={data.bankAccounts}
            themeStyle={{
              cardClass: "bg-white border-[#ebd6c4] shadow-sm",
              badgeClass: "bg-rose-50 text-rose-900 font-bold",
              buttonClass: "bg-rose-800 hover:bg-rose-900 text-white font-medium",
            }}
          />
        </section>

        {/* Section: RSVP Form */}
        <section id="rsvp">
          <RsvpFormSection
            invitationId={data.id}
            defaultGuestName={guestName}
            themeStyle={{
              cardClass: "bg-white border-[#ebd6c4] shadow-md",
              buttonClass: "bg-rose-800 hover:bg-rose-900 text-white font-semibold",
              inputClass: "bg-[#fffaf5] border-[#ebd6c4] text-stone-900",
            }}
          />
        </section>

        {/* Section: Ucapan & Doa */}
        <section id="doa">
          <WishesWallSection
            invitationId={data.id}
            themeStyle={{
              cardClass: "bg-white border-[#ebd6c4] shadow-md",
              bubbleClass: "bg-[#fffaf5] border-[#ebd6c4] text-stone-800",
              buttonClass: "bg-rose-800 hover:bg-rose-900 text-white font-semibold",
              inputClass: "bg-[#fffaf5] border-[#ebd6c4] text-stone-900",
            }}
          />
        </section>

        {/* Footer */}
        <footer className="pt-8 text-stone-600 text-xs space-y-1 font-medium">
          <p>Digital Invitation by Fasaro &bull; WebNikah Edition</p>
          <p className="text-[11px] text-stone-500">Terima kasih atas doa &amp; restu Anda</p>
        </footer>
      </main>

      {/* 2. Floating Bottom Navigation Bar (Khas WebNikah) */}
      {!isEmbedded && (
        <nav
          className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 transform-gpu will-change-transform bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800 shadow-xl flex items-center gap-3 sm:gap-5 text-stone-800 dark:text-stone-200 transition-all duration-500 ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <a
            href="#home"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Home"
          >
            <Heart className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Mempelai</span>
          </a>
          <a
            href="#cerita"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Cerita"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Cerita</span>
          </a>
          <a
            href="#undangan"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Acara"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Acara</span>
          </a>
          <a
            href="#galeri"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Galeri"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Photo</span>
          </a>
          <a
            href="#kado"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Kado"
          >
            <Gift className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Kado</span>
          </a>
          <a
            href="#doa"
            className="flex flex-col items-center justify-center p-1 hover:text-rose-700 transition-colors"
            title="Ucapan"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Ucapan</span>
          </a>
        </nav>
      )}
    </div>
  );
};

export default AdiRaraTheme;
