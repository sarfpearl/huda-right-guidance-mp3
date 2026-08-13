"use client";

import Link from "next/link";
import { LogoIcon, YouTubeMusicIcon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import {
  youtubeMusicUrl,
  youtubeMusicPlaylistUrl,
  youtubeMusicSearchUrl,
} from "@/lib/youtube";

interface ImmersiveHeaderProps {
  onShuffle?: () => void;
}

export function ImmersiveHeader({ onShuffle }: ImmersiveHeaderProps) {
  const player = useAudioPlayer();
  const bayan = player.current;

  const targetYtMusicUrl = bayan?.youtubePlaylistId
    ? youtubeMusicPlaylistUrl(bayan.youtubePlaylistId)
    : bayan?.youtubeVideoId
    ? youtubeMusicUrl(bayan.youtubeVideoId)
    : "https://music.youtube.com/playlist?list=PLFRt54vRoHJs";

  return (
    <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8 pb-4 pointer-events-none">
      {/* Top Left Branding */}
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-black/25 px-3.5 py-1.5 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors"
        aria-label={siteConfig.fullName}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600/80 text-amber-300 text-sm shadow-sm">
          <LogoIcon />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-xs font-bold tracking-tight text-sand-50 uppercase">
            {siteConfig.name}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300/80 font-medium">
            Right Guidance
          </span>
        </span>
      </Link>

      {/* Top Right Corner YouTube Music Connection Button */}
      <a
        href={targetYtMusicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/60 px-4 py-2 backdrop-blur-md text-xs font-semibold text-red-100 shadow-lg hover:bg-red-900 transition-all active:scale-95 group/yt"
        title="Open in YouTube Music"
      >
        <YouTubeMusicIcon className="text-red-500 text-base group-hover/yt:scale-110 transition-transform" />
        <span className="font-serif tracking-wider uppercase text-[11px]">
          YouTube Music
        </span>
      </a>
    </header>
  );
}
