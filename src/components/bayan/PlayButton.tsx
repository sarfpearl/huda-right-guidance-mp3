"use client";

import Link from "next/link";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { PlayIcon, PauseIcon, YouTubeIcon } from "@/components/ui/Icon";
import type { BayanWithRelations } from "@/types/bayan";
import { cn } from "@/lib/utils";

/**
 * Unified play control.
 *  - Local Bayan → drives the global audio player.
 *  - YouTube-only Bayan → links to the detail page (where the official embed
 *    lives). We never play YouTube audio through the HTML5 element.
 */
export function PlayButton({
  bayan,
  contextList,
  variant = "icon",
  className,
  label,
}: {
  bayan: BayanWithRelations;
  contextList?: BayanWithRelations[];
  variant?: "icon" | "solid" | "solid-lg";
  className?: string;
  label?: string;
}) {
  const { current, isPlaying, playBayan, togglePlay } = useAudioPlayer();
  const isCurrent = current?.id === bayan.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isYouTubeOnly = bayan.audioSource === "youtube";

  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-transform active:scale-95 focus-visible:outline-none";
  const styles = {
    icon: "h-11 w-11 rounded-full bg-primary-700 text-lg text-sand-50 shadow-soft hover:bg-primary-600",
    solid:
      "h-11 rounded-full bg-primary-700 px-5 text-sm text-sand-50 shadow-soft hover:bg-primary-600",
    "solid-lg":
      "h-14 rounded-full bg-primary-700 px-8 text-base text-sand-50 shadow-soft-lg hover:bg-primary-600",
  }[variant];

  if (isYouTubeOnly) {
    return (
      <Link
        href={`/bayan/${bayan.slug}`}
        className={cn(base, styles, "bg-primary-700", className)}
        aria-label={`Watch "${bayan.title}" on YouTube`}
      >
        <YouTubeIcon className="text-xl" />
        {variant !== "icon" ? (label ?? "Watch on YouTube") : null}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (isCurrent) togglePlay();
        else playBayan(bayan, contextList);
      }}
      className={cn(base, styles, className)}
      aria-label={
        isThisPlaying ? `Pause "${bayan.title}"` : `Play "${bayan.title}"`
      }
    >
      {isThisPlaying ? (
        <PauseIcon className="text-xl" />
      ) : (
        <PlayIcon className={variant === "icon" ? "text-lg" : "text-xl"} />
      )}
      {variant !== "icon" ? (
        <span>{isThisPlaying ? "Pause" : label ?? "Listen"}</span>
      ) : null}
    </button>
  );
}
