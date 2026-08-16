# 🕌 Huda Bayan — Project Handoff

> **For:** Claude (or any AI assistant continuing this project)
> **Date:** 2026-08-16
> **Project Path:** `/Users/pearl-9744/Claude/Projects/Huda Bayan`
> **Dev Server:** `npm run dev` → [http://localhost:3000](http://localhost:3000) (config in `.claude/launch.json`)

---

## 📌 Project Overview

**Huda Bayan** is an immersive Islamic Bayan (sermon/lecture) listening web application. It is Tamil-language focused and built for Muslims to listen to lectures by category and speaker.

Inspired by: `https://tamilfm.co/v/auto`

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | **Next.js 14** (App Router, TypeScript) |
| Styling | **Tailwind CSS v3** + custom CSS variables |
| Animations | **Framer Motion** |
| Database | **Supabase** (wired but not yet active — runs on seed data by default) |
| Font | **Poppins** via `next/font/google` |
| Audio Engine | YouTube IFrame Player API + HTML5 `<audio>` |
| Package name | `huda-bayan` |

---

## 🗂️ Project Structure

```
Huda Bayan/                      ← root folder
├── src/
│   ├── app/
│   │   ├── page.tsx             ← Home page (immersive full-screen)
│   │   ├── layout.tsx           ← Root layout (Poppins font, providers)
│   │   ├── globals.css          ← Global CSS + Tailwind directives
│   │   ├── admin/               ← Admin CRUD (bayans, categories, speakers)
│   │   ├── bayan/[slug]/        ← Bayan detail page + OG image
│   │   ├── category/[slug]/     ← Category listing page
│   │   ├── speaker/[slug]/      ← Speaker profile page
│   │   ├── explore/             ← Browse page
│   │   ├── search/              ← Search page
│   │   └── api/youtube/         ← YouTube playlist & stream API routes
│   │
│   ├── components/
│   │   ├── home/
│   │   │   ├── ImmersiveHomeClient.tsx   ← Main home page orchestrator
│   │   │   ├── ImmersiveBackground.tsx  ← Full-screen scene backgrounds
│   │   │   ├── ImmersiveHeader.tsx      ← Floating header
│   │   │   ├── CompactBayanPlayer.tsx   ← Bottom glass player card (circular cover, clickable speed badge)
│   │   │   └── TopicPickerModal.tsx     ← Right slide-over panel (Categories / Quran Juz / Explore tabs)
│   │   ├── navigation/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileBottomNav.tsx
│   │   │   └── TimeLocationWidget.tsx   ← Live clock + location
│   │   ├── player/GlobalAudioPlayer.tsx ← Persistent player (non-home)
│   │   ├── layout/MainLayout.tsx        ← Route-aware layout switcher
│   │   └── ui/                          ← Icon, CoverArt, Skeleton, etc.
│   │
│   ├── contexts/
│   │   └── AudioPlayerContext.tsx       ← Global audio player engine
│   │
│   └── lib/
│       ├── site.ts                      ← Brand config (name, url, tagline)
│       ├── data/
│       │   ├── seed.ts                  ← Demo data (categories, speakers, bayans)
│       │   └── service.ts               ← Data API layer
│       └── youtube/
│           ├── index.ts                 ← YouTube URL helpers
│           └── iframe-api.ts            ← YT IFrame API loader
│
├── public/
│   ├── images/scenes/           ← 15 category background JPGs
│   ├── Glass.svg                ← Glassmorphism card asset
│   ├── Menu.svg                 ← Hamburger menu icon
│   ├── YT-Music.svg             ← YouTube Music button logo
│   └── manifest.webmanifest     ← PWA manifest
│
├── supabase/schema.sql          ← Full Supabase DB schema
├── tailwind.config.ts           ← Design tokens
├── package.json                 ← name: "huda-bayan"
└── .env.example                 ← Environment variable template
```

---

## 🎨 Design System

### Colours
- **Primary green:** `#1a5140` — Islamic green, buttons, accents
- **Gold accent:** `#e8d19a` / `amber-300` — highlights (sparse use)
- **Dark background:** `#0e100f` / `slate-950`
- **Sand/cream text:** `sand-50`, `sand-100`, `sand-300`
- **Emerald interactive:** `emerald-400`, `emerald-500` — player controls

### Z-Index Stack (home page)
```
z-50  → ImmersiveHeader (top bar + menu)
z-40  → Bottom player div
z-30  → Bismillah calligraphy (top-center, floating over scene)
z-20  → Center topic card (category name + Tamil + tagline)
z-10  → ImmersiveHomeClient root
z-0   → ImmersiveBackground (scene image)
```

### Glass Card Recipe (shared by player / hero / time widget)
`bg-black/[0.08]` tint · `backdrop-blur-[6px]` · `border border-white/15` ·
`shadow-[0_20px_50px_rgba(0,0,0,0.8)]` · `rounded-[40px]` (bounded — never
`rounded-full`, which turns multi-row cards into ellipses). Cards are
responsive: wider width + smaller radius/padding on mobile (`sm:` bumps up).

---

## 🔑 Central Brand Config

**`src/lib/site.ts`**
```ts
export const siteConfig = {
  name: "Huda",
  fullName: "Huda Bayan",
  tagline: "Listen. Reflect. Improve.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "ta_IN",
  themeColor: "#1a5140",
};
```

---

## 🗄️ Data Layer

### Current Mode: **Seed (Demo — no DB needed)**
- 16 Islamic categories (Iman, Quran, Salah, Dua, Ramadan…)
- 4 placeholder Tamil-speaking speakers
- ~12 demo bayans using Quranic audio from `download.quranicaudio.com`

### Switch to Supabase (`.env.local`)
```env
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
Schema: `supabase/schema.sql`. Service stubs: `src/lib/data/service.ts`.

---

## 🎵 Audio Engine (`AudioPlayerContext.tsx`)

Supports 3 source types:

| Source | Mechanism |
|---|---|
| `youtube-playlist` | YouTube IFrame Player API — plays a playlist |
| `youtube-video` | YouTube IFrame Player API — plays a single video |
| `local` | HTML5 `<audio>` — plays a direct MP3 URL |

**LocalStorage keys:**
- `huda-player:last` — last played track
- `huda-player:positions` — per-bayan playback positions
- `huda-player:prefs` — volume, playback rate, mute
- `huda-theme` — light/dark mode preference
- `huda-session-id` — session identifier

---

## ⚙️ Environment Variables

```env
# Data source (default: seed)
NEXT_PUBLIC_DATA_SOURCE=seed

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (only if DATA_SOURCE=supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# YouTube Data API (optional — for live playlist metadata)
YOUTUBE_API_KEY=
```

---

## 🐛 Known Issues & Pending Work

### 🔴 Ongoing Bug
- **Home page shows only background / Internal Server Error / port 3000 in use** — caused by stale/old Next.js server processes occupying port 3000, or a mixed `.next` cache (running `next build` then `npm run dev` corrupts the dev cache → `__webpack_modules__[moduleId] is not a function`). Fix: `lsof -ti:3000 | xargs kill -9`, then `rm -rf .next`, then `npm run dev` fresh, then hard-refresh (`Cmd+Shift+R`). The z-index stacking fix is already committed (`7e15b6b`).

### 🟡 Needs Implementation
- [ ] **Supabase backend** — implement stubs in `src/lib/supabase/queries.ts`
- [ ] **Quran Juz audio** — the Quran tab lists Juz 1–30 (`QURAN_JUZ` in `TopicPickerModal.tsx`), but items only close the modal; wire each Juz to real recitation audio/pages
- [ ] **Real bayan/speaker data** — replace seed placeholders with real Tamil Islamic Bayan content
- [ ] **Per-category YouTube playlists** — all 16 categories currently share the same demo playlist `PLFRt54vRoHJs`; each needs a real Tamil Bayan playlist ID in `seed.ts`
- [ ] **Arabic font** — `font-arabic` class references `var(--font-arabic)` which is never set; add Amiri or Noto Naskh Arabic via `next/font/google` in `layout.tsx`
- [ ] **Admin write operations** — reads work; writes need Supabase
- [ ] **Admin authentication** — no auth guard on `/admin` routes yet

### ✅ Working Well
- Immersive home with 15 animated scene backgrounds
- Category switching with smooth crossfade transitions
- YouTube IFrame audio playback
- Unified iOS-style glass cards (player / hero / time widget), responsive
- Bismillah calligraphy floats top-center; topic card shows category + Tamil + tagline
- Player: circular cover art, dark-glass controls, clickable speed badge, YT playback-rate sync
- Right slide-over topic picker (Categories / Quran Juz 1–30 / Explore tabs)
- Live clock + geolocation widget (top-left)
- Mobile responsive + PWA manifest
- SEO metadata + dynamic OG images per bayan
- TypeScript strict mode — 0 errors
- Admin panel (read-only in seed mode)

---

## 🚀 Quick Start

```bash
cd "/Users/pearl-9744/Claude/Projects/Huda Bayan"

npm install
npm run dev
# → http://localhost:3000

# TypeScript check
npm run typecheck
```

> ⚠️ If the page shows only the background with no UI: close the browser tab, kill any old node servers (`lsof -ti:3000,3001,3002 | xargs kill -9`), restart `npm run dev`, then open a **new tab** at localhost:3000 and hard-refresh.

---

## 📝 Git History

```
abbd492  feat: glass UI refinements, Quran juz list, and playback-rate fix
122c7ee  docs: add HANDOFF.md for project continuation
7e15b6b  fix: resolve UI elements not visible (z-index stacking context)
c454370  refactor: rename project to huda-bayan
bdbd7b8  Refine CompactBayanPlayer UI layout and controls
f138d82  Update UI: Poppins font, TimeLocationWidget, Figma player layout
eb8780b  HuDa Right Guidance (initial commit)
```

---

## 💡 Important Notes for the Next Developer

1. **Folder name on disk is now `Huda Bayan`** — matches the project name. Git history is intact.

2. **The `font-arabic` Tailwind class** is configured in `tailwind.config.ts` but `--font-arabic` CSS variable is never defined → Bismillah renders as serif fallback. To fix, load an Arabic font in `layout.tsx`.

3. **Redundant font import** — `globals.css` line 1 has a Google Fonts `@import` for Poppins, but `layout.tsx` already loads it via `next/font`. The `@import` can be safely removed.

4. **YouTube playlists** — To add real Tamil Bayan playlists, update `youtubePlaylistId` per category in `src/lib/data/seed.ts`.

5. **Adding a new scene background** — Drop a JPG at `public/images/scenes/{category-slug}.jpg` and add the entry to the `sceneImages` map in `ImmersiveBackground.tsx`.
