import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSpeakerSlugs,
  getBayanBySpeaker,
  getSpeakerBySlug,
} from "@/lib/data/service";
import { BayanGrid } from "@/components/bayan/BayanGrid";
import { SortTabs } from "@/components/ui/SortTabs";
import { Avatar } from "@/components/ui/Avatar";
import { parseSort } from "@/lib/sort";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSpeakerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const speaker = await getSpeakerBySlug(params.slug);
  if (!speaker) return { title: "Speaker not found" };
  return {
    title: speaker.name,
    description: speaker.bio,
    alternates: { canonical: absoluteUrl(`/speaker/${speaker.slug}`) },
  };
}

export default async function SpeakerPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  const speaker = await getSpeakerBySlug(params.slug);
  if (!speaker) notFound();

  const sort = parseSort(searchParams.sort);
  const items = await getBayanBySpeaker(speaker.slug, sort);

  return (
    <div className="py-6">
      <header className="mb-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar name={speaker.name} src={speaker.profileImageUrl} size={88} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{speaker.name}</h1>
            <p className="mt-0.5 text-sm font-medium text-primary-600 dark:text-primary-300">
              {items.length} Bayan
            </p>
          </div>
        </div>
        {speaker.bio ? (
          <p className="max-w-2xl leading-relaxed text-muted">{speaker.bio}</p>
        ) : null}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Bayan</h2>
          <SortTabs current={sort} />
        </div>
      </header>

      <BayanGrid
        items={items}
        emptyTitle="No Bayan from this speaker yet."
        emptyHint="Please check back soon, in shā’ Allāh."
      />
    </div>
  );
}
