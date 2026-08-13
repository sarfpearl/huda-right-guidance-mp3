"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { CoverArt } from "@/components/ui/CoverArt";
import { PlayIcon, CloseIcon } from "@/components/ui/Icon";
import { formatClock } from "@/lib/utils";
import Image from "next/image";

/** "Continue listening" card — resumes the last-played Bayan at its position. */
export function ContinueListening() {
  const { continueListening, current, playBayan, dismissContinue } =
    useAudioPlayer();

  // Hide once something is actively loaded into the player this session.
  if (!continueListening || current) return null;

  const { bayan, position } = continueListening;
  const pct =
    bayan.durationSeconds > 0
      ? Math.min(100, (position / bayan.durationSeconds) * 100)
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-primary-700 text-sand-50 shadow-soft-lg">
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          {bayan.coverImageUrl ? (
            <Image src={bayan.coverImageUrl} alt="" fill className="object-cover" />
          ) : (
            <CoverArt seed={bayan.slug} icon={bayan.category.icon} rounded="rounded-xl" className="h-full w-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-300">
            Continue listening
          </p>
          <p className="truncate font-semibold">{bayan.title}</p>
          <p className="mt-1 text-xs text-sand-50/80">
            {formatClock(position)} / {formatClock(bayan.durationSeconds)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => playBayan(bayan)}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand-50 text-xl text-primary-700 transition-transform active:scale-95"
          aria-label={`Continue "${bayan.title}"`}
        >
          <PlayIcon />
        </button>
        <button
          type="button"
          onClick={dismissContinue}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-sand-50/70 hover:bg-white/10 hover:text-sand-50"
          aria-label="Dismiss"
        >
          <CloseIcon className="text-sm" />
        </button>
      </div>
      <div className="h-1 w-full bg-white/15">
        <div className="h-full bg-gold-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
