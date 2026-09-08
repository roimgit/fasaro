"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, Mail, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("demo@fasaro.id");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Pengantin Baru");
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
    <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-stone-200 shadow-xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-orange-50 text-orange-600 mb-2">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          {isRegisterMode ? "Daftar Akun Baru" : "Masuk ke Fasaro"}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {isRegisterMode
            ? "Mulai buat undangan pernikahan impian Anda dalam hitungan menit."
            : "Kelola undangan, pantau buku tamu, dan verifikasi kado digital."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda..."
                className="w-full py-2.5 px-3.5 pl-10 rounded-xl text-sm border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              />
              <Sparkles className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full py-2.5 px-3.5 pl-10 rounded-xl text-sm border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              className="w-full py-2.5 px-3.5 pl-10 rounded-xl text-sm border border-stone-300 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
        >
          {isLoading
            ? "Memproses..."
            : isRegisterMode
            ? "Daftar Sekarang"
            : "Masuk ke Akun"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setErrorMessage(null);
          }}
          className="text-xs text-orange-600 hover:underline font-medium"
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#fafaf9]">
      <Suspense fallback={<div className="text-xs text-stone-400">Memuat form...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
