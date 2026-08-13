"use client";

import Link from "next/link";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { ShareButton } from "./ShareButton";
import { PlayIcon, PauseIcon, YouTubeIcon, YouTubeMusicIcon, QueueIcon } from "@/components/ui/Icon";
import { youtubeWatchUrl, youtubeMusicUrl, youtubeMusicSearchUrl } from "@/lib/youtube";
import type { BayanWithRelations } from "@/types/bayan";

/**
 * Detail-page actions. Local MP3 is the default/primary source; a YouTube
 * button is shown alongside when a video is also available, or on its own for
 * YouTube-only Bayan.
 */
export function BayanActions({
  bayan,
  contextList,
  shareUrl,
}: {
  bayan: BayanWithRelations;
  contextList: BayanWithRelations[];
  shareUrl: string;
}) {
  const { current, isPlaying, playBayan, togglePlay, addToQueue } =
    useAudioPlayer();
  const isCurrent = current?.id === bayan.id;
  const isThisPlaying = isCurrent && isPlaying;

  const hasLocal = bayan.audioSource === "local" && !!bayan.audioUrl;
  const hasYouTube = !!bayan.youtubeVideoId;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasLocal ? (
        <button
          type="button"
          onClick={() =>
            isCurrent ? togglePlay() : playBayan(bayan, contextList)
          }
          className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary-700 px-8 text-base font-semibold text-sand-50 shadow-soft-lg transition-transform active:scale-95 hover:bg-primary-600"
        >
          {isThisPlaying ? (
            <PauseIcon className="text-xl" />
          ) : (
            <PlayIcon className="text-xl" />
          )}
          {isThisPlaying ? "Pause" : "Listen"}
        </button>
      ) : null}

      {hasYouTube ? (
        <>
          <Link
            href={youtubeWatchUrl(bayan.youtubeVideoId ?? "")}
            target="_blank"
            rel="noopener noreferrer"
            className={
              hasLocal
                ? "inline-flex h-14 items-center gap-2 rounded-full border surface px-6 font-semibold transition-colors hover:border-primary-300"
                : "inline-flex h-14 items-center gap-2 rounded-full bg-red-600 px-8 font-semibold text-white transition-colors hover:bg-red-700"
            }
          >
            <YouTubeIcon className="text-xl" />
            {hasLocal ? "YouTube" : "Watch on YouTube"}
          </Link>

          <Link
            href={youtubeMusicUrl(bayan.youtubeVideoId ?? "")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-red-950/80 px-6 font-semibold text-red-200 border border-red-500/40 transition-colors hover:bg-red-900"
          >
            <YouTubeMusicIcon className="text-xl text-red-500" />
            YouTube Music
          </Link>
        </>
      ) : (
        <Link
          href={youtubeMusicSearchUrl(`${bayan.title} ${bayan.speaker.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center gap-2 rounded-full border surface px-6 font-semibold text-sand-200 transition-colors hover:border-red-500/40"
        >
          <YouTubeMusicIcon className="text-xl text-red-500" />
          YouTube Music
        </Link>
      )}

      {hasLocal ? (
        <button
          type="button"
          onClick={() => addToQueue(bayan)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border surface text-lg transition-colors hover:border-primary-300"
          aria-label="Add to queue"
          title="Add to queue"
        >
          <QueueIcon />
        </button>
      ) : null}

      <ShareButton
        url={shareUrl}
        title={bayan.title}
        text={`${bayan.title} — ${bayan.speaker.name}`}
      />
    </div>
  );
}
