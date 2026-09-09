import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  CheckSquare,
  Globe,
  LayoutDashboard,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session || session.role !== "ADMIN") {
    redirect("/login?from=/admin");
  }

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base tracking-tight text-slate-900">
                  Fasaro
                </span>
                <span className="text-[#F97316] font-sans text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100">
                  Master Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#F97316]" />
              <span>Pusat Kendali</span>
            </Link>

            <Link
              href="/admin/verifikasi-manual"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-[#F97316]" />
              <span>Verifikasi Manual</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Lihat Website</span>
            </Link>
          </nav>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-[#E2E8F0] text-xs">
              <Shield className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="text-slate-700 font-medium">{session.email}</span>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors shadow-xs"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-5 text-center text-xs text-slate-500">
        <p>Panel Manajemen Platform Fasaro &copy; {new Date().getFullYear()}. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
