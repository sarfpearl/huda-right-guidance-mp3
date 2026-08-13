import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getAllBayanSlugs,
  getBayanBySlug,
  getBayanByCategory,
} from "@/lib/data/service";
import { CoverArt } from "@/components/ui/CoverArt";
import { Avatar } from "@/components/ui/Avatar";
import { BayanActions } from "@/components/bayan/BayanActions";
import { YouTubeEmbed } from "@/components/bayan/YouTubeEmbed";
import { Section } from "@/components/home/Section";
import { BayanRail } from "@/components/home/BayanRail";
import { CategoryIcon } from "@/components/ui/Icon";
import { formatDate, formatDurationLabel } from "@/lib/utils";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBayanSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const bayan = await getBayanBySlug(params.slug);
  if (!bayan) return { title: "Bayan not found" };

  const url = absoluteUrl(`/bayan/${bayan.slug}`);
  const title = `${bayan.title} · ${bayan.speaker.name}`;
  const description =
    bayan.description ||
    `${bayan.title} — a Tamil Islamic Bayan by ${bayan.speaker.name} on ${bayan.category.name}.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: `/bayan/${bayan.slug}/opengraph-image` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/bayan/${bayan.slug}/opengraph-image`],
    },
  };
}

export default async function BayanDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const bayan = await getBayanBySlug(params.slug);
  if (!bayan) notFound();

  const related = (await getBayanByCategory(bayan.category.slug, "popular"))
    .filter((b) => b.id !== bayan.id)
    .slice(0, 8);

  const shareUrl = absoluteUrl(`/bayan/${bayan.slug}`);
  const isYouTube = bayan.audioSource === "youtube";

  // Structured data for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: bayan.title,
    description: bayan.description,
    inLanguage: "ta",
    duration: `PT${Math.round(bayan.durationSeconds / 60)}M`,
    datePublished: bayan.publishedAt ?? undefined,
    genre: bayan.category.name,
    url: shareUrl,
    author: { "@type": "Person", name: bayan.speaker.name },
    ...(isYouTube && bayan.youtubeVideoId
      ? { embedUrl: `https://www.youtube.com/embed/${bayan.youtubeVideoId}` }
      : { contentUrl: bayan.audioUrl ?? undefined }),
  };

  return (
    <article className="py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href={`/category/${bayan.category.slug}`} className="hover:text-primary-600">
          {bayan.category.name}
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-8">
        {/* Cover / media */}
        <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
          {isYouTube && bayan.youtubeVideoId ? (
            <div className="md:sticky md:top-20">
              <YouTubeEmbed videoId={bayan.youtubeVideoId} title={bayan.title} />
            </div>
          ) : bayan.coverImageUrl ? (
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-soft-lg">
              <Image src={bayan.coverImageUrl} alt={bayan.title} fill className="object-cover" priority />
            </div>
          ) : (
            <CoverArt
              seed={bayan.slug}
              icon={bayan.category.icon}
              rounded="rounded-3xl"
              className="aspect-square w-full shadow-soft-lg"
            />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <Link
            href={`/category/${bayan.category.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/60 dark:text-primary-200"
          >
            <CategoryIcon name={bayan.category.icon} className="text-sm" />
            {bayan.category.name}
          </Link>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {bayan.title}
          </h1>

          <Link
            href={`/speaker/${bayan.speaker.slug}`}
            className="mt-3 inline-flex items-center gap-3 rounded-full pr-4 transition-colors hover:text-primary-600"
          >
            <Avatar name={bayan.speaker.name} src={bayan.speaker.profileImageUrl} size={40} />
            <span className="font-medium">{bayan.speaker.name}</span>
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>{bayan.language}</span>
            <span aria-hidden>·</span>
            <span>{formatDurationLabel(bayan.durationSeconds)}</span>
            {bayan.publishedAt ? (
              <>
                <span aria-hidden>·</span>
                <span>{formatDate(bayan.publishedAt)}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{bayan.playCount.toLocaleString()} plays</span>
          </div>

          <div className="mt-6">
            <BayanActions bayan={bayan} contextList={[bayan, ...related]} shareUrl={shareUrl} />
          </div>

          {bayan.description ? (
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                About this Bayan
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-[15px]">
                {bayan.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-10 border-t pt-2">
          <Section
            title={`More in ${bayan.category.name}`}
            href={`/category/${bayan.category.slug}`}
          >
            <BayanRail items={related} />
          </Section>
        </div>
      ) : null}
    </article>
  );
}
