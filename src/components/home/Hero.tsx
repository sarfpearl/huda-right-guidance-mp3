import Link from "next/link";
import { CompassIcon, GridIcon, ShuffleIcon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="relative -mx-4 overflow-hidden px-4 py-12 sm:-mx-6 sm:px-6 sm:py-16">
      <div className="islamic-pattern absolute inset-0 -z-10 opacity-70" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[rgb(var(--background))]"
        aria-hidden
      />

      <div className="mx-auto max-w-2xl text-center">
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-2xl text-primary-700 dark:text-primary-300 sm:text-3xl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
          Listen. Reflect. Improve.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
          Discover Islamic Bayan, reminders and talks that inspire faith and
          reflection.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary-700 px-6 font-semibold text-sand-50 shadow-soft transition-transform active:scale-95 hover:bg-primary-600"
          >
            <CompassIcon className="text-lg" /> Explore Bayan
          </Link>
          <Link
            href="/categories"
            className="inline-flex h-12 items-center gap-2 rounded-full border surface px-6 font-semibold transition-colors hover:border-primary-300"
          >
            <GridIcon className="text-lg" /> Browse Categories
          </Link>
          <Link
            href="/surprise"
            prefetch={false}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-gold-400/60 px-6 font-semibold text-gold-600 transition-colors hover:bg-gold-400/10 dark:text-gold-300"
          >
            <ShuffleIcon className="text-lg" /> Surprise Me
          </Link>
        </div>
      </div>
    </section>
  );
}
