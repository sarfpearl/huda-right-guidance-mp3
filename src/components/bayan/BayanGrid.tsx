import type { BayanWithRelations } from "@/types/bayan";
import { BayanCard } from "./BayanCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function BayanGrid({
  items,
  emptyTitle = "No Bayan found",
  emptyHint = "Try another search or category.",
}: {
  items: BayanWithRelations[];
  emptyTitle?: string;
  emptyHint?: string;
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} hint={emptyHint} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {items.map((b) => (
        <BayanCard key={b.id} bayan={b} contextList={items} />
      ))}
    </div>
  );
}
