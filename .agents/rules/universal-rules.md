---
trigger: always_on
---

# UNIVERSAL AGENT DIRECTIVES & CLEAN CODE RULES
# Berlaku untuk seluruh agen AI otonom di semua repositori proyek.

---

## 1. PRINSIP CLEAN CODE & KUALITAS PENULISAN (CODE EXCELLENCE)

1. **Single Responsibility Principle (SRP):**
   - Setiap fungsi, modul, atau komponen hanya boleh memiliki SATU tugas spesifik.
   - Batasi panjang fungsi maksimal 30–40 baris. Jika lebih panjang, pecah menjadi fungsi pembantu (*sub-functions/helpers*) yang terisolasi.
2. **Penamaan yang Bersih & Deklaratif (Self-Documenting Code):**
   - Nama variabel, fungsi, dan kelas wajib mencerminkan fungsinya secara jelas (gunakan bahasa Inggris standar).
   - Dilarang menggunakan singkatan ambigu (contoh buruk: `fn()`, `calc()`, `temp`, `data2`). Gunakan penamaan deskriptif (contoh baik: `calculateTotalPrice()`, `isValidGuestInvitation()`).
3. **Strict Typing (Bebas 'any'):**
   - Pada proyek TypeScript, dilarang keras menggunakan tipe `any`. Selalu definisikan `interface` atau `type` eksplisit.
   - Seluruh fungsi publik wajib memiliki anotasi tipe parameter dan *return type* yang jelas.
4. **Early Return Pattern:**
   - Hindari percabangan `if-else` bersarang yang dalam (*nested pyramid of doom*).
   - Gunakan pola *early exit / guard clause* untuk validasi kondisi gagal di awal fungsi.

---

## 2. ATURAN NOL KODE SAMPAH (ZERO DEAD CODE & ANTI-WASTE POLICY)

1. **Prinsip YAGNI (You Aren't Gonna Need It):**
   - Dilarang membuat fungsi spekulatif, utilitas "jaga-jaga", atau fitur yang belum memiliki pemanggil (*caller*) aktif saat ini.
   - Buat fungsi HANYA ketika benar-benar dibutuhkan oleh alur logika yang sedang dikerjakan.
2. **Larangan Kode Terkomentar (No Commented-out Code):**
   - Dilarang meninggalkan blok kode lama yang di-*comment out* (contoh: `// const oldLogic = ...`).
   - Hapus sepenuhnya kode yang sudah tidak dipakai. Riwayat kode lama sudah tersimpan dengan aman di Git history.
3. **Pembersihan File Uji Coba (No Ghost/Test Files):**
   - Dilarang meninggalkan file coba-coba seperti `test-api.ts`, `temp.js`, `dummy-data.json`, atau komponen eksperimen yang tidak terhubung ke aplikasi utama.
   - Jika membuat skrip pengujian sementara, wajib hapus file tersebut sebelum tugas dinyatakan selesai.
4. **Eliminasi Unused Imports & Variables:**
   - Sebelum menyelesaikan tugas, pastikan tidak ada *import* pustaka yang tidak terpakai, variabel tak terpakai, atau parameter tanpa referensi.
5. **Kebersihan Log Debugging:**
   - Hapus seluruh `console.log()`, `print()`, atau komentar `TODO` sementara yang dipakai saat *debugging* lokal sebelum *commit*.

---

## 3. ARSITEKTUR & PEMISAHAN TANGGUNG JAWAB (SEPARATION OF CONCERNS)

1. **Pemisahan Tiga Lapisan (Three-Layer Architecture):**
   - **Layer 1: Presentation (UI/Views):** Hanya bertugas menampilkan antarmuka dan menangani interaksi pengguna. Dilarang melakukan query database langsung di dalam komponen UI.
   - **Layer 2: Business Logic (Services/Actions):** Berisi alur proses bisnis, kalkulasi data, dan validasi logika.
   - **Layer 3: Data Access (Repositories/DB Clients):** Khusus mengelola query ke database (Prisma, SQL, S3, Redis).
2. **Komponen Modular & Reusable:**
   - Komponen UI harus *stateless* dan *reusable* sebanyak mungkin (menerima input via `props`).
   - Pisahkan komponen primitif (Button, Modal, Input) dari komponen spesifik domain (*domain-specific widget*).

---

## 4. KEAMANAN & PENANGANAN ERROR (DEFENSIVE PROGRAMMING)

1. **Validasi Ketat di Pintu Masuk (Boundary Validation):**
   - Seluruh data yang masuk dari pengguna, form, atau API publik wajib divalidasi menggunakan skema deklaratif (seperti Zod/Joi) sebelum diproses.
2. **Sanitasi Data (Anti-Injection & Anti-XSS):**
   - Seluruh teks input yang akan disimpan ke database atau ditampilkan kembali ke layar wajib disanitasi dari script berbahaya.
3. **Penanganan Error Terstruktur:**
   - Dilarang melakukan *silent failure* (contoh buruk: `catch (e) {}` kosong tanpa penanganan).
   - Kembalikan respons error yang informatif bagi developer, namun aman (tidak membocorkan kredensial database/stack trace sensitif) ke pengguna akhir.
4. **Kebersihan Kredensial (Secret Hygiene):**
   - Dilarang mencantumkan kata sandi, token API, atau connection string langsung di dalam file kode (*hardcoded*). Seluruh rahasia wajib melalui `process.env`.

---

## 5. PROTOKOL EKSEKUSI OTONOM AGEN (AGENT OPERATIONAL DIRECTIVES)

Sebelum agen AI mengubah atau membuat kode di repositori:
1. **Pahami Konteks Dulu:** Baca file yang berhubungan dan periksa struktur folder sebelum menulis kode baru. Jangan menebak nama fungsi atau dependensi.
2. **Minimal Diff:** Ubah hanya bagian kode yang relevan dengan tugas. Dilarang merombak format file secara keseluruhan tanpa instruksi eksplisit.
3. **Verifikasi Mandiri Sebelum Melapor:**
   - Jalankan pemeriksaan tipe (`tsc --noEmit` atau ekuivalennya).
   - Jalankan linter (`npm run lint`).
   - Pastikan proses *build* (`npm run build`) berhasil tanpa *warning* atau *error*.
4. **Laporan Ringkas:** Laporkan hanya apa yang diubah, file yang dihapus, dan hasil verifikasi pengujian secara ringkas dan objektif.