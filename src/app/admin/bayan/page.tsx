import Link from "next/link";
import { getAdminBayan } from "@/lib/data/service";
import { BayanRowActions } from "@/components/admin/BayanRowActions";
import { PlusIcon } from "@/components/ui/Icon";
import { formatDate, formatDurationLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBayanPage() {
  const items = await getAdminBayan();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bayan</h1>
          <p className="mt-1 text-sm text-muted">{items.length} total</p>
        </div>
        <Link
          href="/admin/bayan/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-700 px-4 text-sm font-semibold text-sand-50 hover:bg-primary-600"
        >
          <PlusIcon className="text-lg" /> Add Bayan
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border surface shadow-soft">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Speaker</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="max-w-[220px] px-4 py-3">
                  <span className="line-clamp-1 font-medium">{b.title}</span>
                </td>
                <td className="px-4 py-3 text-muted">{b.speaker.name}</td>
                <td className="px-4 py-3 text-muted">
                  {b.category.nameTa ?? b.category.name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      b.audioSource === "youtube"
                        ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300"
                        : "rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                    }
                  >
                    {b.audioSource === "youtube" ? "YouTube" : "Local"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDurationLabel(b.durationSeconds)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      b.isPublished
                        ? "inline-flex items-center gap-1.5 text-xs font-medium text-primary-600"
                        : "inline-flex items-center gap-1.5 text-xs font-medium text-muted"
                    }
                  >
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        (b.isPublished ? "bg-primary-500" : "bg-[rgb(var(--border))]")
                      }
                    />
                    {b.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{b.isFeatured ? "★" : "—"}</td>
                <td className="px-4 py-3 text-muted">{formatDate(b.createdAt)}</td>
                <td className="px-4 py-3">
                  <BayanRowActions id={b.id} slug={b.slug} isPublished={b.isPublished} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
