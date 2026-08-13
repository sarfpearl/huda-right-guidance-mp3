"use client";

import Image from "next/image";
import type { BayanWithRelations } from "@/types/bayan";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { CoverArt } from "@/components/ui/CoverArt";
import { PlayIcon, PauseIcon, NextIcon, PrevIcon } from "@/components/ui/Icon";
import { formatClock } from "@/lib/utils";

interface CompactBayanPlayerProps {
  bayan: BayanWithRelations;
  categoryList?: BayanWithRelations[];
}

export function CompactBayanPlayer({ bayan, categoryList }: CompactBayanPlayerProps) {
  const player = useAudioPlayer();
  const isCurrentTrack = player.current?.id === bayan.id;
  const isPlaying = isCurrentTrack && player.isPlaying;
  const isLoading = isCurrentTrack && player.isLoading;
  const currentTime = isCurrentTrack ? player.currentTime : 0;
  const totalDuration = isCurrentTrack && player.duration > 0
    ? player.duration
    : bayan.durationSeconds;

  const handlePlayToggle = () => {
    if (isCurrentTrack) {
      player.togglePlay();
    } else {
      player.playBayan(bayan, categoryList);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isCurrentTrack) {
      player.seek(val);
    } else {
      player.playBayan(bayan, categoryList);
      setTimeout(() => player.seek(val), 100);
    }
  };

  return (
    <div className="relative w-[88dvw] max-w-[340px] rounded-[24px] bg-[#181510]/90 p-4 backdrop-blur-2xl border border-[#383126]/60 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all select-none">
      {/* Audio-Only Card Layout — Pure Neomorphic Audio Player */}
      <div className="flex items-center gap-3">
        {/* Cover Artwork */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[18px] bg-gradient-to-br from-emerald-950 to-slate-900 shadow-md border border-white/10">
          {bayan.coverImageUrl ? (
            <Image
              src={bayan.coverImageUrl}
              alt={bayan.title}
              fill
              className="object-cover"
            />
          ) : (
            <CoverArt
              seed={bayan.slug}
              icon={bayan.category.icon}
              rounded="rounded-[18px]"
              className="h-full w-full"
            />
          )}

          {/* Equalizer overlay when playing audio */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <div className="flex items-end gap-0.5">
                <span className="h-3 w-0.5 animate-[equalizer_0.6s_ease-in-out_infinite] bg-emerald-400" />
                <span className="h-4 w-0.5 animate-[equalizer_0.8s_ease-in-out_infinite] bg-emerald-400" />
                <span className="h-2.5 w-0.5 animate-[equalizer_0.5s_ease-in-out_infinite] bg-emerald-400" />
              </div>
            </div>
          )}
        </div>

        {/* Track Title & Speaker */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-serif text-sm font-bold text-white tracking-wide">
            {bayan.title}
          </h3>
          <p className="truncate text-xs font-medium text-emerald-400/90 mt-0.5">
            {bayan.speaker.name}
          </p>
        </div>

        {/* Transport Controls (Prev / Play / Next) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={player.previous}
            className="grid h-7 w-7 place-items-center rounded-full text-sand-300 hover:text-white transition-all active:scale-90"
            aria-label="Previous"
          >
            <PrevIcon className="text-xs" />
          </button>

          {/* Tapping Play Icon Plays Audio Live */}
          <button
            type="button"
            onClick={handlePlayToggle}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-950 shadow-[0_6px_20px_rgba(255,255,255,0.25)] transition-transform active:scale-90 hover:bg-sand-100 cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : isPlaying ? (
              <PauseIcon className="text-base" />
            ) : (
              <PlayIcon className="text-base ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={player.next}
            className="grid h-7 w-7 place-items-center rounded-full text-sand-300 hover:text-white transition-all active:scale-90"
            aria-label="Next"
          >
            <NextIcon className="text-xs" />
          </button>
        </div>
      </div>

      {/* Audio Progress Slider & Time Labels */}
      <div className="mt-3.5">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalDuration || 1}
            step={1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progress"
            className="neomorph-range h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10"
            style={{
              background: `linear-gradient(to right, #10b981 ${
                (currentTime / (totalDuration || 1)) * 100
              }%, rgba(255, 255, 255, 0.15) ${
                (currentTime / (totalDuration || 1)) * 100
              }%)`,
            }}
          />
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-sand-200/60">
          <span>{formatClock(currentTime)}</span>
          <span>{formatClock(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
}
