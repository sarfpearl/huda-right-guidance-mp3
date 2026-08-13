import type { BayanWithRelations } from "@/types/bayan";
import { BayanCard } from "@/components/bayan/BayanCard";

/** Horizontal, snap-scrolling rail — the "listening app" feel on mobile. */
export function BayanRail({ items }: { items: BayanWithRelations[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:gap-4">
      {items.map((b) => (
        <div
          key={b.id}
          className="w-[46%] shrink-0 snap-start sm:w-52 lg:w-56"
        >
          <BayanCard bayan={b} contextList={items} />
        </div>
      ))}
    </div>
  );
}
