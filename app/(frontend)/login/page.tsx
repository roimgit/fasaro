"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, Mail, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("An1357@$");
  const [name, setName] = useState("Super Administrator");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegisterMode ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
      <div className="text-center mb-6">
        <div className="inline-flex p-2.5 rounded-xl bg-orange-50 text-[#F97316] border border-orange-100 mb-3">
          <Heart className="w-5 h-5 fill-[#F97316]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isRegisterMode ? "Daftar Akun Baru" : "Masuk ke Fasaro"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isRegisterMode
            ? "Mulai buat undangan pernikahan impian Anda dalam hitungan menit."
            : "Kelola undangan, pantau buku tamu, dan verifikasi kado digital."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda..."
                className="w-full py-2.5 px-3.5 pl-10 rounded-lg text-sm border border-[#E2E8F0] bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none transition-colors"
              />
              <Sparkles className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full py-2.5 px-3.5 pl-10 rounded-lg text-sm border border-[#E2E8F0] bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none transition-colors"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              className="w-full py-2.5 px-3.5 pl-10 rounded-lg text-sm border border-[#E2E8F0] bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none transition-colors"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors disabled:opacity-50"
        >
          {isLoading
            ? "Memproses..."
            : isRegisterMode
            ? "Daftar Sekarang"
            : "Masuk ke Akun"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setErrorMessage(null);
          }}
          className="text-xs text-[#F97316] hover:underline font-medium"
        >
          {isRegisterMode
            ? "Sudah punya akun? Masuk di sini"
            : "Belum punya akun? Buat akun baru"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F3F6FB]">
      <Suspense fallback={<div className="text-xs text-slate-400">Memuat form...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
