"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Category } from "@/types/category";
import type { Speaker } from "@/types/speaker";
import type { BayanWithRelations } from "@/types/bayan";
import { CategoryIcon, CloseIcon, CompassIcon, MenuIcon, PlayIcon, SearchIcon, ShuffleIcon } from "@/components/ui/Icon";
import { formatClock, cn } from "@/lib/utils";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { QURAN_JUZ, QURAN_TRACKS, QURAN_SURAHS, SURAH_TRACKS } from "@/lib/data/quran";

type ModalTab = "categories" | "speakers" | "explore";

interface TopicPickerModalProps {
  categories: Category[];
  speakers?: Speaker[];
  allBayan?: BayanWithRelations[];
  activeCategorySlug: string;
  onSelectCategory: (category: Category) => void;
  onSelectSpeaker?: (speaker: Speaker) => void;
  onSelectBayan?: (bayan: BayanWithRelations) => void;
  onShuffle?: () => void;
}

const SCENE_THUMBNAILS: Record<string, string> = {
  "iman-taqwa": "/images/scenes/iman-taqwa.jpg",
  "quran": "/images/scenes/quran.jpg",
  "salah": "/images/scenes/salah.jpg",
  "ramadan": "/images/scenes/ramadan.jpg",
  "dua": "/images/scenes/dua.jpg",
  "hajj-umrah": "/images/scenes/hajj-umrah.jpg",
  "akhlaq": "/images/scenes/akhlaq.jpg",
  "self-improvement": "/images/scenes/self-improvement.jpg",
  "womens-topics": "/images/scenes/womens-topics.jpg",
  "family": "/images/scenes/family.jpg",
  "marriage": "/images/scenes/marriage.jpg",
  "parenting": "/images/scenes/parenting.jpg",
  "youth": "/images/scenes/youth.jpg",
  "death-akhirah": "/images/scenes/death-akhirah.jpg",
  "islamic-history": "/images/scenes/islamic-history.jpg",
};

export function TopicPickerModal({
  categories,
  speakers = [],
  allBayan = [],
  activeCategorySlug,
  onSelectCategory,
  onSelectSpeaker,
  onSelectBayan,
  onShuffle,
}: TopicPickerModalProps) {
  const player = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("explore");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  const q = searchQuery.trim().toLowerCase();

  const filteredCategories = categories.filter((c) => {
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.nameTa && c.nameTa.toLowerCase().includes(q)) ||
      c.description.toLowerCase().includes(q)
    );
  });

  const filteredSpeakers = speakers.filter((s) => {
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.bio.toLowerCase().includes(q)
    );
  });

  const filteredJuz = QURAN_JUZ.filter((j) => {
    if (!q) return true;
    return (
      j.title.toLowerCase().includes(q) ||
      String(j.id).includes(q) ||
      `juz ${j.id}`.includes(q) ||
      `para ${j.id}`.includes(q)
    );
  });

  const filteredBayan = allBayan.filter((b) => {
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.speaker.name.toLowerCase().includes(q) ||
      b.category.name.toLowerCase().includes(q)
    );
  });

  const filteredSurah = QURAN_SURAHS.filter((s) => {
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.arabicName.includes(searchQuery.trim()) ||
      String(s.number).includes(q)
    );
  });

  return (
    <>
      {/* Top Right Header Menu SVG Icon Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto shrink-0 transition-transform active:scale-95 cursor-pointer hover:opacity-90"
        aria-label="Open Categories Menu"
        title="Pick your category"
      >
        <Image
          src="/Menu.svg"
          alt="Pick your category"
          width={44}
          height={44}
          className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
        />
      </button>

      {/* Mac Control Center Style Right Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Right Slide-Over Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="pointer-events-auto fixed inset-y-0 right-0 z-50 flex h-full w-[88vw] max-w-md flex-col bg-[#0c1015]/95 border-l border-white/15 p-4 md:p-6 shadow-2xl backdrop-blur-2xl"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Islamic Atmospheres
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Pick your category
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sand-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer active:scale-90"
                  aria-label="Close"
                >
                  <CloseIcon className="text-lg" />
                </button>
              </div>

              {/* Navigation Tabs Header */}
              <div className="flex items-center gap-1 rounded-2xl bg-white/5 p-1 border border-white/10 my-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("explore")}
                  className={cn(
                    "flex-1 rounded-xl py-1.5 text-center text-xs font-bold transition-all",
                    activeTab === "explore"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-sand-200/60 hover:text-white"
                  )}
                >
                  Surah
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("speakers")}
                  className={cn(
                    "flex-1 rounded-xl py-1.5 text-center text-xs font-bold transition-all",
                    activeTab === "speakers"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-sand-200/60 hover:text-white"
                  )}
                >
                  Quran
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className={cn(
                    "flex-1 rounded-xl py-1.5 text-center text-xs font-bold transition-all",
                    activeTab === "categories"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-sand-200/60 hover:text-white"
                  )}
                >
                  Bayan
                </button>
              </div>

              {/* Search Input Box */}
              <div className="relative mb-3">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-200/50 text-base pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "speakers"
                      ? "Search Juz..."
                      : activeTab === "explore"
                      ? "Search Surah..."
                      : `Search ${activeTab}...`
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-sand-200/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>

              {/* Vertical Scrollable Content List */}
              <div className="no-scrollbar flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
                {/* 1. CATEGORIES TAB */}
                {activeTab === "categories" &&
                  filteredCategories.map((c, index) => {
                    const isActive = c.slug === activeCategorySlug;
                    const thumb = SCENE_THUMBNAILS[c.slug];
                    const numStr = (index + 1).toString().padStart(2, "0");

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(c);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all border",
                          isActive
                            ? "bg-emerald-950/80 border-emerald-400/90 text-white shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                            : "bg-white/5 border-white/5 text-sand-100 hover:bg-white/10 hover:border-white/20"
                        )}
                      >
                        <span className={cn(
                          "w-5 text-center text-xs font-mono font-bold shrink-0",
                          isActive ? "text-emerald-300" : "text-sand-200/40"
                        )}>
                          {numStr}
                        </span>

                        <div className="relative h-12 w-16 md:h-14 md:w-20 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-white/10 shadow-sm">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt=""
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-900 text-emerald-400">
                              <CategoryIcon name={c.icon} className="text-xl" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs md:text-sm font-bold text-white tracking-tight">
                              {c.name}
                            </span>
                            {c.nameTa && (
                              <span className="shrink-0 text-[10px] md:text-[11px] font-semibold text-emerald-300/80">
                                · {c.nameTa}
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-1 mt-0.5 text-[11px] text-sand-200/60">
                            {c.description}
                          </p>
                        </div>

                        <div className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm",
                          isActive
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/5 text-sand-200/50"
                        )}>
                          <CategoryIcon name={c.icon} />
                        </div>
                      </button>
                    );
                  })}

                {/* 2. QURAN TAB — Juz 1 to 30 */}
                {activeTab === "speakers" &&
                  filteredJuz.map((j) => {
                    const isActive = player.current?.id === `quran-juz-${j.id}`;
                    return (
                      <button
                        key={j.id}
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => {
                          player.playBayan(QURAN_TRACKS[j.id - 1], QURAN_TRACKS);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                          isActive
                            ? "bg-emerald-950/80 border-emerald-400/90 text-white shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-emerald-500/30"
                        )}
                      >
                        <div className={cn(
                          "grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold text-sm border",
                          isActive
                            ? "bg-emerald-500 text-slate-950 border-emerald-300"
                            : "bg-emerald-900/60 text-emerald-300 border-emerald-500/30"
                        )}>
                          {isActive && player.isPlaying ? (
                            <span className="flex items-end gap-0.5" aria-label="Playing">
                              <span className="h-3 w-0.5 animate-[equalizer_0.6s_ease-in-out_infinite] bg-slate-950" />
                              <span className="h-4 w-0.5 animate-[equalizer_0.8s_ease-in-out_infinite] bg-slate-950" />
                              <span className="h-2.5 w-0.5 animate-[equalizer_0.5s_ease-in-out_infinite] bg-slate-950" />
                            </span>
                          ) : (
                            j.id
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-white">
                            {j.title}
                          </h4>
                          <p className="line-clamp-1 text-xs text-sand-200/60 mt-0.5">
                            {j.subtitle}
                          </p>
                        </div>

                        <span className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                          isActive ? "bg-emerald-400 text-slate-950" : "bg-emerald-500/20 text-emerald-300"
                        )}>
                          {j.label}
                        </span>
                      </button>
                    );
                  })}

                {/* 3. SURAH TAB — all 114 Surahs */}
                {activeTab === "explore" &&
                  filteredSurah.map((s) => {
                    const isActive = player.current?.id === `quran-surah-${s.number}`;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => {
                          player.playBayan(SURAH_TRACKS[s.number - 1], SURAH_TRACKS);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                          isActive
                            ? "bg-emerald-950/80 border-emerald-400/90 text-white shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-emerald-500/30"
                        )}
                      >
                        <div className={cn(
                          "grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold text-sm border",
                          isActive
                            ? "bg-emerald-500 text-slate-950 border-emerald-300"
                            : "bg-emerald-900/60 text-emerald-300 border-emerald-500/30"
                        )}>
                          {isActive && player.isPlaying ? (
                            <span className="flex items-end gap-0.5" aria-label="Playing">
                              <span className="h-3 w-0.5 animate-[equalizer_0.6s_ease-in-out_infinite] bg-slate-950" />
                              <span className="h-4 w-0.5 animate-[equalizer_0.8s_ease-in-out_infinite] bg-slate-950" />
                              <span className="h-2.5 w-0.5 animate-[equalizer_0.5s_ease-in-out_infinite] bg-slate-950" />
                            </span>
                          ) : (
                            s.number
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-white">
                            {s.number} — {s.name}
                          </h4>
                          <p className="line-clamp-1 text-xs text-sand-200/60 mt-0.5">
                            {s.verses} Verses · {s.type}
                          </p>
                        </div>

                        <span
                          lang="ar"
                          dir="rtl"
                          className={cn(
                            "shrink-0 font-arabic text-base font-bold",
                            isActive ? "text-emerald-300" : "text-sand-200/70"
                          )}
                        >
                          {s.arabicName}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
