import { getSpeakers } from "@/lib/data/service";
import { Avatar } from "@/components/ui/Avatar";

export default async function AdminSpeakersPage() {
  const speakers = await getSpeakers();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Speakers</h1>
      <p className="mb-6 text-sm text-muted">{speakers.length} active speakers</p>

      <div className="overflow-x-auto rounded-2xl border surface shadow-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Speaker</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Bayan</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={s.name} src={s.profileImageUrl} size={32} />
                    <span className="font-medium">{s.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-muted">{s.slug}</td>
                <td className="px-4 py-3 text-muted">{s.bayanCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
