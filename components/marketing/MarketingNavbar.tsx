"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Sparkles,
  X,
  Heart,
} from "lucide-react";

export const MarketingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Tema Undangan", href: "#tema" },
    { label: "Fitur", href: "#fitur" },
    { label: "Harga", href: "#harga" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-stone-950 fill-stone-950" />
          </div>
          <span className="text-xl font-serif font-extrabold tracking-tight text-white">
            Fasaro<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-400 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="py-2 px-4 rounded-full text-xs font-medium text-stone-300 hover:text-white transition-colors"
          >
            Masuk
          </Link>

          <Link
            href="/login?from=/dashboard"
            className="inline-flex items-center gap-1.5 py-2 px-5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Undangan Gratis</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka Menu"
          className="md:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-stone-800 bg-stone-950/95 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-xl text-sm font-medium text-stone-300 hover:bg-stone-900 hover:text-amber-400"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800/80 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-semibold border border-stone-800 text-stone-200"
            >
              Masuk
            </Link>
            <Link
              href="/login?from=/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
            >
              Buat Undangan Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNavbar;
