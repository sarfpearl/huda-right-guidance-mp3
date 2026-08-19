// ─────────────────────────────────────────────────────────────────────────
//  FREE Quran cover-image generator (Pollinations.ai — no API key, no billing)
//
//  Generates ONE rich, illustrated cover per Surah (1–114) and Juz (1–30) in
//  the same serene mosque-scene style as public/images/scenes/*, saving them
//  to public/images/quran/{kind}-{num}.jpg  (matches quranImageUrl()).
//
//  Usage:
//    node scripts/generate-quran-images-free.mjs --kind=surah --limit=3   # TEST
//    node scripts/generate-quran-images-free.mjs --kind=all               # full
//
//  Flags:
//    --kind=surah|juz|all   which set (default: all)
//    --limit=N              only fetch the first N missing items (test)
//    --start=N              start at item N
//    --delay=MS             pause between requests (default 1500)
//    --size=N               square px (default 768)
//
//  Resumes automatically: existing files are skipped, so re-run any time.
//  No key needed — Pollinations is a free text-to-image endpoint.
// ─────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import process from "node:process";

const OUT_DIR = path.resolve("public/images/quran");

const SURAHS = [
  "Al-Fatihah","Al-Baqarah","Aal-E-Imran","An-Nisa","Al-Ma'idah","Al-An'am",
  "Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim",
  "Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj",
  "Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas",
  "Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin",
  "As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf",
  "Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
  "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah",
  "Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah","As-Saff","Al-Jumu'ah",
  "Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam",
  "Al-Haqqah","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir",
  "Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
  "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq",
  "Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha",
  "Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah",
  "Al-Adiyat","Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil",
  "Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad",
  "Al-Ikhlas","Al-Falaq","An-Nas",
];

const JUZ = [
  "Alif Lam Meem","Sayaqul","Tilkal Rusul","Lan Tanaloo","Wal Mohsanat",
  "La Yuhibbullah","Wa Iza Sami'oo","Wa Lau Annana","Qalal Malaou","Wa A'lamoo",
  "Yatazeroon","Wa Mamin Da'abat","Wa Ma Ubrioo","Rubama","Subhanallazi",
  "Qal Alam","Aqtarabo","Qadd Aflaha","Wa Qalallazina","A'man Khalaq",
  "Utlu Ma Oohia","Wa Manyaqnut","Wa Mali","Faman Azlam","Elahe Yuruddo",
  "Ha'a Meem","Qala Fama Khatbukum","Qadd Sami Allah","Tabarakallazi",
  "Amma Yatasa'aloon",
];

// Varied scene moods so consecutive covers never look alike.
const SCENES = [
  "a grand mosque courtyard at night under a crescent moon and starry sky, glowing lanterns",
  "a majestic mosque with domes and minarets at golden sunset, warm light",
  "an ornate prayer hall interior with arches, hanging lamps and soft divine light",
  "a serene mosque beside a calm reflecting pool at dawn, misty and peaceful",
  "a desert mosque under a vast twilight sky, silhouetted palms and soft glow",
  "an intricate arched arcade with Islamic geometric tilework and lantern light",
  "a mosque skyline with minarets against a deep blue evening sky and stars",
  "a tranquil garden courtyard with fountains beside a domed mosque at dusk",
];
const PALETTES = [
  "deep emerald green and gold","midnight blue and silver","warm amber and sand",
  "teal and pearl","royal purple and gold","forest green and cream",
  "copper and rose","indigo and moonlight",
];

function buildPrompt(kind, number, name) {
  const scene = SCENES[(number - 1) % SCENES.length];
  const palette = PALETTES[(number * 3 + 1) % PALETTES.length];
  const label = kind === "surah" ? `Surah ${number} (${name})` : `Juz ${number} (${name})`;
  return (
    `Serene Islamic art cover representing ${label} of the Holy Quran: ${scene}. ` +
    `${palette} color palette, intricate Islamic geometric architecture, ` +
    `cinematic detailed digital illustration, peaceful and spiritual, ` +
    `no people, no faces, no living creatures, no text and no letters.`
  );
}

function pollinationsUrl(prompt, seed, size) {
  const base = "https://image.pollinations.ai/prompt/";
  const params = `?width=${size}&height=${size}&seed=${seed}&nologo=true&model=flux`;
  return base + encodeURIComponent(prompt) + params;
}

async function fileExists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function parseArgs() {
  const a = Object.fromEntries(
    process.argv.slice(2).map((x) => {
      const [k, v] = x.replace(/^--/, "").split("=");
      return [k, v ?? true];
    })
  );
  return {
    kind: a.kind || "all",
    limit: a.limit ? Number(a.limit) : Infinity,
    start: a.start ? Number(a.start) : 1,
    delay: a.delay ? Number(a.delay) : 1500,
    size: a.size ? Number(a.size) : 768,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchImage(url, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 90000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error("image too small / empty");
      return buf;
    } catch (err) {
      if (attempt === tries) throw err;
      await sleep(3000 * attempt);
    }
  }
}

async function run() {
  const { kind, limit, start, delay, size } = parseArgs();
  await mkdir(OUT_DIR, { recursive: true });

  const sets = [];
  if (kind === "surah" || kind === "all") sets.push({ k: "surah", names: SURAHS });
  if (kind === "juz" || kind === "all") sets.push({ k: "juz", names: JUZ });

  let made = 0;
  for (const set of sets) {
    console.log(`\n▶ ${set.k.toUpperCase()} (${set.names.length} items)`);
    for (let i = start - 1; i < set.names.length; i++) {
      if (made >= limit) {
        console.log(`\n⏹ reached --limit=${limit}. Re-run to continue.`);
        return;
      }
      const number = i + 1;
      const file = path.join(OUT_DIR, `${set.k}-${number}.jpg`);
      if (await fileExists(file)) {
        console.log(`  ⏭  skip ${set.k} ${number} (exists)`);
        continue;
      }
      const prompt = buildPrompt(set.k, number, set.names[i]);
      const url = pollinationsUrl(prompt, number * 7 + (set.k === "juz" ? 1000 : 0), size);
      try {
        const buf = await fetchImage(url);
        await writeFile(file, buf);
        made++;
        console.log(`  ✅ ${set.k} ${number} — ${set.names[i]} (${Math.round(buf.length / 1024)}KB)`);
        await sleep(delay);
      } catch (err) {
        console.error(`  ⚠️  ${set.k} ${number} failed: ${err.message}`);
        await sleep(delay);
      }
    }
  }
  console.log(`\n✔ Done. Generated ${made} new image(s) into ${OUT_DIR}`);
  console.log("   Enable them:  NEXT_PUBLIC_QURAN_IMAGES=1 npm run dev");
}

run().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
