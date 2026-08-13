import Link from "next/link";
import type { Category } from "@/types/category";
import { CategoryIcon, ChevronRightIcon } from "@/components/ui/Icon";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex items-center gap-3.5 rounded-2xl border surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-soft-lg"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-50 text-2xl text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-sand-50 dark:bg-primary-900/50 dark:text-primary-300">
        <CategoryIcon name={category.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold">{category.name}</span>
        </span>
        <span className="line-clamp-1 text-xs text-muted">
          {category.description}
        </span>
        <span className="mt-0.5 block text-xs font-medium text-primary-600 dark:text-primary-300">
          {category.bayanCount ?? 0} Bayan
        </span>
      </span>
      <ChevronRightIcon className="text-lg text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
