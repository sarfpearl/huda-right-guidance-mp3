"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types/category";
import type { Speaker } from "@/types/speaker";
import type { BayanWithRelations } from "@/types/bayan";
import { ImmersiveBackground } from "./ImmersiveBackground";
import { ImmersiveHeader } from "./ImmersiveHeader";
import { CompactBayanPlayer } from "./CompactBayanPlayer";
import { TopicPickerModal } from "./TopicPickerModal";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

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

  // Initial category: default to 'iman-taqwa' or the first available category
  const defaultCategory =
    categories.find((c) => c.slug === "iman-taqwa") ?? categories[0];

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
    if (overrideBayan) return overrideBayan;
    if (player.current && player.current.categoryId === activeCategory.id) {
      return player.current;
    }
    return categoryBayans[0] ?? allBayan[0];
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
    <div className="relative h-dvh w-dvw overflow-hidden bg-slate-950 text-sand-50 select-none">
      {/* Edge-to-Edge Dynamic Scene Background */}
      <ImmersiveBackground categorySlug={activeCategory.slug} />

      {/* Floating Top Header */}
      <ImmersiveHeader onShuffle={handleShuffle} />

      {/* Main Canvas Content Viewport */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-6">
        {/* Center Scene Title & Bismillah */}
        <div className="flex flex-col items-center text-center my-auto">
          {/* Bismillah Calligraphy */}
          <motion.p
            key={`bismillah-${activeCategory.slug}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-arabic text-lg sm:text-xl md:text-2xl text-emerald-200/90 tracking-wide drop-shadow-md mb-2"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          {/* Topic / Scene Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeCategory.slug}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-sand-50 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                {activeCategory.name}
              </h1>

              {/* Tamil Name / Subtitle */}
              {activeCategory.nameTa && (
                <span className="mt-1 text-sm md:text-base font-semibold text-emerald-300/90 tracking-wide">
                  {activeCategory.nameTa}
                </span>
              )}

              {/* Contextual Description */}
              <p className="mt-2 max-w-sm md:max-w-md text-xs sm:text-sm text-sand-200/80 line-clamp-2">
                {activeCategory.description || "Strengthen your connection with Allah."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Dock: Compact Audio Player + Pick Your Category Button */}
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          {/* Compact Integrated Bayan Player */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`player-${activeBayan.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <CompactBayanPlayer
                bayan={activeBayan}
                categoryList={categoryBayans}
              />
            </motion.div>
          </AnimatePresence>

          {/* Bottom Pick Your Category Trigger */}
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
        </div>
      </div>
    </div>
  );
}
