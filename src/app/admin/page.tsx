import Link from "next/link";
import { getAdminStats } from "@/lib/data/service";
import { PlusIcon } from "@/components/ui/Icon";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border surface p-5 shadow-soft">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your content.</p>
        </div>
        <Link
          href="/admin/bayan/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-700 px-4 text-sm font-semibold text-sand-50 hover:bg-primary-600"
        >
          <PlusIcon className="text-lg" /> Add Bayan
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Bayan" value={stats.totalBayan} />
        <StatCard label="Published" value={stats.publishedBayan} />
        <StatCard label="Drafts" value={stats.draftBayan} />
        <StatCard label="Featured" value={stats.featuredBayan} />
        <StatCard label="Categories" value={stats.totalCategories} />
        <StatCard label="Speakers" value={stats.totalSpeakers} />
        <StatCard label="Total Plays" value={stats.totalPlays.toLocaleString()} />
        <StatCard
          label="Local / YouTube"
          value={`${stats.localCount} / ${stats.youtubeCount}`}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/bayan"
          className="rounded-2xl border surface p-5 shadow-soft transition-colors hover:border-primary-300"
        >
          <p className="font-semibold">Manage Bayan</p>
          <p className="mt-1 text-sm text-muted">
            Edit, publish, feature or remove talks.
          </p>
        </Link>
        <Link
          href="/admin/bayan/new"
          className="rounded-2xl border surface p-5 shadow-soft transition-colors hover:border-primary-300"
        >
          <p className="font-semibold">Add new Bayan</p>
          <p className="mt-1 text-sm text-muted">
            Upload a local MP3 or link a YouTube video.
          </p>
        </Link>
      </div>
    </div>
  );
}
