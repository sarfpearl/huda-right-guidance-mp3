import { notFound } from "next/navigation";
import {
  getAdminBayanById,
  getCategories,
  getSpeakers,
} from "@/lib/data/service";
import { BayanForm } from "@/components/admin/BayanForm";

export const dynamic = "force-dynamic";

export default async function EditBayanPage({
  params,
}: {
  params: { id: string };
}) {
  const [bayan, speakers, categories] = await Promise.all([
    getAdminBayanById(params.id),
    getSpeakers(),
    getCategories(),
  ]);

  if (!bayan) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit Bayan</h1>
      <BayanForm speakers={speakers} categories={categories} bayan={bayan} />
    </div>
  );
}
