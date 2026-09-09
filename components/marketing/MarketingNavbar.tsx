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
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Fasaro<span className="text-[#F97316]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#F97316] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="py-2 px-4 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Masuk
          </Link>

          <Link
            href="/login?from=/dashboard"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Undangan</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka Menu"
          className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#F97316]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-semibold border border-[#E2E8F0] text-slate-700 hover:bg-slate-50"
            >
              Masuk
            </Link>
            <Link
              href="/login?from=/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs"
            >
              Buat Undangan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNavbar;
