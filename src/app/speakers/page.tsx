import type { Metadata } from "next";
import { getSpeakers } from "@/lib/data/service";
import { SpeakerCard } from "@/components/speaker/SpeakerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Speakers",
  description: "Explore Bayan by speaker.",
  alternates: { canonical: absoluteUrl("/speakers") },
};

export default async function SpeakersPage() {
  const speakers = await getSpeakers();

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Speakers</h1>
        <p className="mt-1 text-sm text-muted">Listen to talks from each speaker.</p>
      </header>

      {speakers.length === 0 ? (
        <EmptyState title="No speakers yet" />
      ) : (
        <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {speakers.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
      )}
    </div>
  );
}
