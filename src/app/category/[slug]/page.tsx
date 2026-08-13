import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getBayanByCategory,
  getCategoryBySlug,
} from "@/lib/data/service";
import { BayanGrid } from "@/components/bayan/BayanGrid";
import { SortTabs } from "@/components/ui/SortTabs";
import { CategoryIcon } from "@/components/ui/Icon";
import { parseSort } from "@/lib/sort";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} Bayan`,
    description: category.description,
    alternates: { canonical: absoluteUrl(`/category/${category.slug}`) },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const sort = parseSort(searchParams.sort);
  const items = await getBayanByCategory(category.slug, sort);

  return (
    <div className="py-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-50 text-3xl text-primary-700 dark:bg-primary-900/60 dark:text-primary-300">
            <CategoryIcon name={category.icon} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {category.name}
              {category.nameTa ? (
                <span className="ml-2 text-base font-medium text-muted">
                  {category.nameTa}
                </span>
              ) : null}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">{category.description}</p>
            <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-300">
              {items.length} Bayan
            </p>
          </div>
        </div>
        <SortTabs current={sort} />
      </header>

      <BayanGrid
        items={items}
        emptyTitle="No Bayan available in this category yet."
        emptyHint="Please check back soon, in shā’ Allāh."
      />
    </div>
  );
}
