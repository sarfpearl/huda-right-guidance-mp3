"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  autoFocus,
  initialQuery = "",
  onSubmitted,
}: {
  className?: string;
  autoFocus?: boolean;
  initialQuery?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        if (!query) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onSubmitted?.();
      }}
      className={cn("relative w-full", className)}
    >
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted" />
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Bayan, speaker or topic..."
        aria-label="Search Bayan, speaker or topic"
        className="h-11 w-full rounded-full border surface-muted pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary-400 focus:surface"
      />
    </form>
  );
}
