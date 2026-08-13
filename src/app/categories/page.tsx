import type { Metadata } from "next";
import { getCategories } from "@/lib/data/service";
import { CategoryCard } from "@/components/category/CategoryCard";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Islamic Bayan by topic — Iman, Salah, Dua, Family and more.",
  alternates: { canonical: absoluteUrl("/categories") },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-muted">
          Choose a topic to explore Bayan and reminders.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
