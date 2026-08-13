"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { CoverArt } from "@/components/ui/CoverArt";
import { CloseIcon, TrashIcon, PlayIcon } from "@/components/ui/Icon";
import { NowPlayingBadge } from "@/components/bayan/NowPlayingBadge";
import { formatDurationLabel } from "@/lib/utils";
import Image from "next/image";

export function QueuePanel({ onClose }: { onClose: () => void }) {
  const {
    queue,
    currentIndex,
    playFromQueue,
    removeFromQueue,
    clearQueue,
  } = useAudioPlayer();

  const upNext = queue.slice(currentIndex + 1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-base font-semibold">
          Up Next{" "}
          <span className="text-muted">({upNext.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          {upNext.length > 0 ? (
            <button
              type="button"
              onClick={clearQueue}
              className="text-xs font-medium text-muted hover:text-primary-600"
            >
              Clear
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close queue"
            className="grid h-8 w-8 place-items-center rounded-full hover:surface-muted"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto p-2">
        {upNext.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-muted">
            Nothing queued. Play a Bayan to build your queue.
          </li>
        ) : (
          upNext.map((b, i) => {
            const queueIndex = currentIndex + 1 + i;
            return (
              <li
                key={b.id}
                className="group flex items-center gap-3 rounded-xl p-2 hover:surface-muted"
              >
                <button
                  type="button"
                  onClick={() => playFromQueue(queueIndex)}
                  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg"
                  aria-label={`Play "${b.title}"`}
                >
                  {b.coverImageUrl ? (
                    <Image src={b.coverImageUrl} alt="" fill className="object-cover" />
                  ) : (
                    <CoverArt seed={b.slug} icon={b.category.icon} rounded="rounded-lg" className="h-full w-full" />
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                    <PlayIcon className="text-base" />
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-medium">
                    {b.title}
                    <NowPlayingBadge bayanId={b.id} />
                  </p>
                  <p className="truncate text-xs text-muted">
                    {b.speaker.name} · {formatDurationLabel(b.durationSeconds)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromQueue(b.id)}
                  aria-label={`Remove "${b.title}" from queue`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:text-red-500"
                >
                  <TrashIcon className="text-base" />
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
