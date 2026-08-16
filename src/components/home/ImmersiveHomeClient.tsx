"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types/category";
import type { Speaker } from "@/types/speaker";
import type { BayanWithRelations } from "@/types/bayan";
import { ImmersiveBackground } from "./ImmersiveBackground";
import { ImmersiveHeader } from "./ImmersiveHeader";
import { CompactBayanPlayer } from "./CompactBayanPlayer";
import { TopicPickerModal } from "./TopicPickerModal";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { isQuranTrack } from "@/lib/data/quran";

interface ImmersiveHomeClientProps {
  categories: Category[];
  allBayan: BayanWithRelations[];
  speakers?: Speaker[];
}

export function ImmersiveHomeClient({
  categories,
  allBayan,
  speakers = [],
}: ImmersiveHomeClientProps) {
  const player = useAudioPlayer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial category: default to 'iman-taqwa' or the first available category
  const defaultCategory =
    categories.find((c) => c.slug === "iman-taqwa") ?? categories[0] ?? {
      id: "iman-taqwa",
      name: "Iman & Taqwa",
      slug: "iman-taqwa",
      nameTa: "ஈமான் & தக்வா",
      description: "Strengthen your faith, devotion, and mindfulness of Allah.",
      icon: "heart",
      coverImageUrl: null,
      sortOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

  const [activeCategory, setActiveCategory] = useState<Category>(
    () => defaultCategory
  );

  const [overrideBayan, setOverrideBayan] = useState<BayanWithRelations | null>(null);

  // Filter Bayans belonging to current active category
  const categoryBayans = useMemo(() => {
    const list = allBayan.filter((b) => b.categoryId === activeCategory.id);
    return list.length > 0 ? list : allBayan;
  }, [allBayan, activeCategory.id]);

  // Selected Bayan for the active category (or player's current track if playing within category)
  const activeBayan = useMemo(() => {
    // Quran recitation (Juz or Surah) always drives the card while it is the
    // active track (covers next/previous and auto-advance).
    if (player.current && isQuranTrack(player.current.id)) {
      return player.current;
    }
    if (overrideBayan) return overrideBayan;
    if (player.current && player.current.categoryId === activeCategory.id) {
      return player.current;
    }
    return categoryBayans[0] ?? allBayan[0] ?? null;
  }, [overrideBayan, player.current, activeCategory.id, categoryBayans, allBayan]);

  const handleSelectCategory = (category: Category) => {
    setOverrideBayan(null);
    setActiveCategory(category);
    const newCategoryBayans = allBayan.filter((b) => b.categoryId === category.id);
    const targetBayan = newCategoryBayans[0] ?? allBayan[0];

    // If audio is currently playing, smoothly transition audio to new category's top track
    if (player.isPlaying && targetBayan) {
      player.playBayan(targetBayan, newCategoryBayans);
    }
  };

  const handleSelectSpeaker = (speaker: Speaker) => {
    const speakerBayans = allBayan.filter((b) => b.speakerId === speaker.id);
    if (speakerBayans.length > 0) {
      const targetBayan = speakerBayans[0];
      setOverrideBayan(targetBayan);
      setActiveCategory(targetBayan.category);
      if (player.isPlaying) {
        player.playBayan(targetBayan, speakerBayans);
      }
    }
  };

  const handleSelectBayan = (bayan: BayanWithRelations) => {
    setOverrideBayan(bayan);
    setActiveCategory(bayan.category);
    player.playBayan(bayan, allBayan);
  };

  const handleShuffle = () => {
    if (categories.length === 0) return;
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCat = categories[randomIndex];
    handleSelectCategory(randomCat);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-hidden bg-slate-950 text-sand-50 select-none">
      {/* Edge-to-Edge Dynamic Scene Background */}
      <ImmersiveBackground categorySlug={activeCategory.slug} />

      {/* Bismillah Calligraphy — Top Center */}
      <p className="pointer-events-none absolute top-[5.5rem] sm:top-5 left-1/2 -translate-x-1/2 z-30 w-full px-6 sm:px-24 text-center font-arabic text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      {/* Floating Top Header with Top-Right Hamburger Menu */}
      <ImmersiveHeader onShuffle={handleShuffle}>
        <TopicPickerModal
          categories={categories}
          speakers={speakers}
          allBayan={allBayan}
          activeCategorySlug={activeCategory.slug}
          onSelectCategory={handleSelectCategory}
          onSelectSpeaker={handleSelectSpeaker}
          onSelectBayan={handleSelectBayan}
          onShuffle={handleShuffle}
        />
      </ImmersiveHeader>

      {/* Main Canvas Center Viewport */}
      <main className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center max-w-lg w-full px-6 py-6 sm:px-[2rem] rounded-[40px] bg-black/[0.08] backdrop-blur-[6px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Topic / Scene Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {activeCategory.name}
          </h1>

          {/* Tamil Name / Subtitle */}
          {activeCategory.nameTa && (
            <span className="mt-1.5 text-base sm:text-lg font-bold text-emerald-300 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {activeCategory.nameTa}
            </span>
          )}

          {/* Contextual Description */}
          <p className="mt-2.5 max-w-md text-xs sm:text-sm text-sand-100/90 font-medium leading-relaxed">
            {activeCategory.description || "Strengthen your connection with Allah."}
          </p>
        </div>
      </main>

      {/* Bottom Floating Player */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-40 flex flex-col items-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Compact Integrated Bayan Player */}
          {activeBayan && (
            <CompactBayanPlayer
              bayan={activeBayan}
              categoryList={categoryBayans}
              onShuffleCategory={handleShuffle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
