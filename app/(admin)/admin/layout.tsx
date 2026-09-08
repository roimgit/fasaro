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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-stone-950 fill-stone-950" />
              </div>
              <span className="font-serif font-bold text-lg tracking-wider text-stone-100">
                Fasaro <span className="text-amber-400 font-sans text-xs uppercase px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">Master Admin</span>
              </span>
            </Link>
          </div>

          {/* Quick Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Pusat Kendali</span>
            </Link>

            <Link
              href="/admin/verifikasi-manual"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Manual</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Buka Landing Page</span>
            </Link>
          </nav>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300 font-medium">{session.email}</span>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
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
      <footer className="border-t border-stone-900 py-6 text-center text-xs text-stone-500">
        <p>Fasaro Wedding SaaS &bull; Platform Management &amp; Super Admin Console</p>
      </footer>
    </div>
  );
}
