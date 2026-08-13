import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Section } from "@/components/home/Section";
import { BayanRail } from "@/components/home/BayanRail";
import { ContinueListening } from "@/components/home/ContinueListening";
import { CategoryCard } from "@/components/category/CategoryCard";
import { SpeakerCard } from "@/components/speaker/SpeakerCard";
import { BayanGrid } from "@/components/bayan/BayanGrid";
import { SortTabs } from "@/components/ui/SortTabs";
import { ShuffleIcon } from "@/components/ui/Icon";
import {
  getAllBayan,
  getCategories,
  getFeaturedBayan,
  getLatestBayan,
  getPopularBayan,
  getSpeakers,
} from "@/lib/data/service";
import { parseSort } from "@/lib/sort";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Explore Bayan & Dashboard",
  description: "Explore all Islamic Bayan, speakers, categories and talks in Tamil.",
  alternates: { canonical: absoluteUrl("/explore") },
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const sort = parseSort(searchParams.sort);

  const [items, featured, popular, latest, categories, speakers] =
    await Promise.all([
      getAllBayan(sort),
      getFeaturedBayan(6),
      getPopularBayan(8),
      getLatestBayan(8),
      getCategories(),
      getSpeakers(),
    ]);

  return (
    <div className="py-6 space-y-8">
      {/* Dashboard Hero Section */}
      <Hero />

      {/* Continue Listening Player Bar if position saved */}
      <div className="mt-2">
        <ContinueListening />
      </div>

      {/* Featured Section */}
      <Section
        title="Featured Bayan"
        subtitle="Hand-picked talks to begin with."
        href="/explore?sort=popular"
      >
        <BayanRail items={featured} />
      </Section>

      {/* Browse by Category Grid */}
      <Section title="Browse by Category" href="/categories">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 9).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </Section>

      {/* Popular Bayan */}
      <Section
        title="Popular Bayan"
        subtitle="Most listened right now."
        href="/explore?sort=popular"
      >
        <BayanRail items={popular} />
      </Section>

      {/* Latest Bayan */}
      <Section
        title="Latest Bayan"
        subtitle="Freshly added talks."
        href="/explore?sort=latest"
      >
        <BayanRail items={latest} />
      </Section>

      {/* Speakers Rail */}
      <Section title="Speakers" href="/speakers">
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
          {speakers.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
      </Section>

      {/* Full Catalog Section with Sorting */}
      <div className="pt-6 border-t border-sand-200 dark:border-charcoal-700">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Bayan</h2>
            <p className="mt-1 text-sm text-muted">
              {items.length} Bayan available in the catalog.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SortTabs current={sort} />
            <Link
              href="/surprise"
              prefetch={false}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gold-400/60 px-3.5 text-sm font-semibold text-gold-600 hover:bg-gold-400/10 dark:text-gold-300"
            >
              <ShuffleIcon className="text-base" /> Surprise Me
            </Link>
          </div>
        </header>

        <BayanGrid items={items} />
      </div>
    </div>
  );
}
