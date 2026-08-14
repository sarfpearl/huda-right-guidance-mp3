"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { TimeLocationWidget } from "@/components/navigation/TimeLocationWidget";
import {
  youtubeMusicUrl,
  youtubeMusicPlaylistUrl,
  youtubeMusicSearchUrl,
} from "@/lib/youtube";

interface ImmersiveHeaderProps {
  onShuffle?: () => void;
  children?: React.ReactNode;
}

export function ImmersiveHeader({ onShuffle, children }: ImmersiveHeaderProps) {
  const player = useAudioPlayer();
  const bayan = player.current;

  const targetYtMusicUrl = bayan?.youtubePlaylistId
    ? youtubeMusicPlaylistUrl(bayan.youtubePlaylistId)
    : bayan?.youtubeVideoId
    ? youtubeMusicUrl(bayan.youtubeVideoId)
    : "https://music.youtube.com/playlist?list=PLFRt54vRoHJs";

  return (
    <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8 pb-4 pointer-events-none">
      {/* Top Left Time & Location */}
      <TimeLocationWidget />

      {/* Top Right Header Controls */}
      <div className="flex items-center gap-2">
        {/* YouTube Music Connection Button */}
        <a
          href={targetYtMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto shrink-0 transition-transform active:scale-95 cursor-pointer hover:opacity-90"
          title="Open in YouTube Music"
        >
          <Image
            src="/YT-Music.svg"
            alt="YouTube Music"
            width={44}
            height={44}
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
          />
        </a>

        {/* Category Picker Menu (Menu.svg) */}
        {children}
      </div>
    </header>
  );
}
