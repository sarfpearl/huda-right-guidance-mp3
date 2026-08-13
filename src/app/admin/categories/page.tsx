import { getCategories } from "@/lib/data/service";
import { CategoryIcon } from "@/components/ui/Icon";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Categories</h1>
      <p className="mb-6 text-sm text-muted">{categories.length} active categories</p>

      <div className="overflow-x-auto rounded-2xl border surface shadow-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Bayan</th>
              <th className="px-4 py-3 font-semibold">Order</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                      <CategoryIcon name={c.icon} className="text-base" />
                    </span>
                    <span className="font-medium">
                      {c.name}
                      {c.nameTa ? (
                        <span className="ml-1 text-muted">{c.nameTa}</span>
                      ) : null}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-muted">{c.slug}</td>
                <td className="px-4 py-3 text-muted">{c.bayanCount ?? 0}</td>
                <td className="px-4 py-3 text-muted">{c.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
