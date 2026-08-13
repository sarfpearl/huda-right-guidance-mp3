"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

/** Animated equalizer shown when a given Bayan is the active track. */
export function NowPlayingBadge({ bayanId }: { bayanId: string }) {
  const { current, isPlaying } = useAudioPlayer();
  if (current?.id !== bayanId) return null;

  return (
    <span
      className="inline-flex items-end gap-[2px] text-primary-600 dark:text-primary-300"
      aria-label={isPlaying ? "Now playing" : "Paused"}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current"
          style={{
            height: 12,
            transformOrigin: "bottom",
            animation: isPlaying
              ? `equalizer 0.9s ease-in-out ${i * 0.15}s infinite`
              : "none",
            transform: isPlaying ? undefined : "scaleY(0.4)",
          }}
        />
      ))}
    </span>
  );
}
