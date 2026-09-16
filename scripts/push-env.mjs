import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const envFile = process.argv[2] || ".env.example";
const filePath = path.join(process.cwd(), envFile);

if (!fs.existsSync(filePath)) {
  console.error(`File ${envFile} tidak ditemukan.`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf-8");
const lines = content.split("\n");

console.log(`\n🚀 Memulai pengiriman environment variables dari ${envFile} ke Vercel...\n`);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;

  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();

  // Strip wrapping quotes if any
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  // If value is empty, set a placeholder so Vercel accepts it
  const finalValue = value || "placeholder";

  try {
    const typeFlag = key.startsWith("NEXT_PUBLIC_") ? "--type config" : "";
    execSync(
      `npx vercel env add ${key} production,preview,development --value "${finalValue}" ${typeFlag} --yes --force`,
      { stdio: "pipe" }
    );
    console.log(`✅ Berhasil`);
  } catch {
    console.log(`⚠️ Gagal (mungkin sudah ada atau perlu token)`);
  }
}

console.log(`\n🎉 Selesai! Semua variabel dari ${envFile} telah dikirim ke Vercel.\n`);
