"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Lock,
  Mail,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

const ERROR_MESSAGE_MAP: Record<string, string> = {
  google_not_configured:
    "Google OAuth belum aktif di server. Tambahkan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di file .env.",
  google_access_denied: "Izin masuk akun Google dibatalkan atau ditolak.",
  google_auth_failed:
    "Gagal melakukan verifikasi akun Google. Silakan coba kembali atau gunakan email & kata sandi.",
  session_expired: "Sesi autentikasi kedaluwarsa. Silakan ulangi proses masuk.",
  invalid_oauth_response: "Respons autentikasi dari Google tidak valid.",
  csrf_state_mismatch: "Validasi keamanan sesi gagal. Silakan coba kembali.",
  google_email_missing: "Akun Google tidak menyediakan informasi email.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("An1357@$");
  const [name, setName] = useState("Super Administrator");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errorParam = searchParams.get("error");
  const paramErrorMessage = errorParam ? ERROR_MESSAGE_MAP[errorParam] || "Terjadi kendala autentikasi" : null;
  const activeErrorMessage = formError || paramErrorMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

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
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuthHref = `/api/auth/google?from=${encodeURIComponent(redirectTarget)}`;

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

      {activeErrorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{activeErrorMessage}</div>
        </div>
      )}

      {/* Google Login Button */}
      <div className="space-y-4">
        <a
          href={googleAuthHref}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer no-underline"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Lanjutkan dengan Akun Google</span>
        </a>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E2E8F0] w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
            atau dengan email
          </span>
          <div className="border-t border-[#E2E8F0] w-full" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              className="w-full py-2.5 px-3.5 pl-10 pr-10 rounded-lg text-sm border border-[#E2E8F0] bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] focus:outline-none transition-colors"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>
            {isLoading
              ? "Memproses..."
              : isRegisterMode
              ? "Daftar Sekarang"
              : "Masuk ke Akun"}
          </span>
        </button>
      </form>

      <div className="mt-5 text-center space-y-3">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setFormError(null);
          }}
          className="text-xs text-[#F97316] hover:underline font-medium cursor-pointer"
        >
          {isRegisterMode
            ? "Sudah punya akun? Masuk di sini"
            : "Belum punya akun? Buat akun baru"}
        </button>

        {/* Demo Quick Fill for development */}
        <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Akun demo:</span>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@admin.com");
              setPassword("An1357@$");
              setIsRegisterMode(false);
              setFormError(null);
            }}
            className="text-slate-600 hover:text-[#F97316] underline font-medium cursor-pointer"
          >
            Admin
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setEmail("pengantin@fasaro.id");
              setPassword("Pengantin123!");
              setIsRegisterMode(false);
              setFormError(null);
            }}
            className="text-slate-600 hover:text-[#F97316] underline font-medium cursor-pointer"
          >
            Pengantin
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F3F6FB]">
      <Suspense fallback={<div className="text-xs text-slate-400">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
