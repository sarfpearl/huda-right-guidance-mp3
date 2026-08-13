import type { Metadata } from "next";
import { searchBayan } from "@/lib/data/service";
import { BayanGrid } from "@/components/bayan/BayanGrid";
import { SearchBar } from "@/components/navigation/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Bayan by title, speaker, category or topic.",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? await searchBayan(q) : [];

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <div className="mt-4 max-w-xl">
          <SearchBar autoFocus initialQuery={q} />
        </div>
      </header>

      {!q ? (
        <EmptyState
          icon={<SearchIcon />}
          title="Search for a Bayan"
          hint="Try a topic like “iman”, a speaker’s name, or a category."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-[rgb(var(--foreground))]">“{q}”</span>
          </p>
          <BayanGrid
            items={results}
            emptyTitle="No Bayan found"
            emptyHint="Try another search."
          />
        </>
      )}
    </div>
  );
}
