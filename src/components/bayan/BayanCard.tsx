import Image from "next/image";
import Link from "next/link";
import type { BayanWithRelations } from "@/types/bayan";
import { CoverArt } from "@/components/ui/CoverArt";
import { PlayButton } from "./PlayButton";
import { NowPlayingBadge } from "./NowPlayingBadge";
import { YouTubeIcon } from "@/components/ui/Icon";
import { formatDurationLabel } from "@/lib/utils";

export function BayanCard({
  bayan,
  contextList,
}: {
  bayan: BayanWithRelations;
  contextList?: BayanWithRelations[];
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border surface shadow-soft transition-shadow hover:shadow-soft-lg">
      <div className="relative aspect-[4/3] w-full">
        <Link
          href={`/bayan/${bayan.slug}`}
          className="block h-full w-full"
          aria-label={bayan.title}
        >
          {bayan.coverImageUrl ? (
            <Image
              src={bayan.coverImageUrl}
              alt={bayan.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
              className="object-cover"
            />
          ) : (
            <CoverArt
              seed={bayan.slug}
              icon={bayan.category.icon}
              rounded="rounded-none"
              className="h-full w-full"
            />
          )}
        </Link>

        {/* Duration + source pills */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            {formatDurationLabel(bayan.durationSeconds)}
          </span>
          {bayan.audioSource === "youtube" ? (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
              <YouTubeIcon className="text-sm" />
            </span>
          ) : null}
        </div>

        <div className="absolute right-2.5 bottom-2.5">
          <PlayButton bayan={bayan} contextList={contextList} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <div className="flex items-center gap-2">
          <Link
            href={`/category/${bayan.category.slug}`}
            className="text-[11px] font-semibold uppercase tracking-wide text-primary-600 hover:underline dark:text-primary-300"
          >
            {bayan.category.name}
          </Link>
          <NowPlayingBadge bayanId={bayan.id} />
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">
          <Link href={`/bayan/${bayan.slug}`} className="hover:underline">
            {bayan.title}
          </Link>
        </h3>
        <Link
          href={`/speaker/${bayan.speaker.slug}`}
          className="mt-auto truncate text-sm text-muted hover:text-primary-600 dark:hover:text-primary-300"
        >
          {bayan.speaker.name}
        </Link>
      </div>
    </article>
  );
}
