import { getCategories, getSpeakers } from "@/lib/data/service";
import { BayanForm } from "@/components/admin/BayanForm";

export default async function NewBayanPage() {
  const [speakers, categories] = await Promise.all([
    getSpeakers(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Add Bayan</h1>
      <BayanForm speakers={speakers} categories={categories} />
    </div>
  );
}
