import { isWriteEnabled } from "@/lib/data/service";
import { siteConfig } from "@/lib/site";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right font-mono text-sm">{value}</span>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mb-6 text-sm text-muted">Environment &amp; configuration.</p>

      <div className="rounded-2xl border surface p-5 shadow-soft">
        <Row label="Site name" value={siteConfig.fullName} />
        <Row label="Site URL" value={siteConfig.url} />
        <Row
          label="Data source"
          value={isWriteEnabled ? "supabase" : "seed (demo)"}
        />
        <Row
          label="Content management"
          value={isWriteEnabled ? "enabled" : "read-only"}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed p-6 text-sm leading-relaxed text-muted">
        <p className="mb-2 font-semibold text-[rgb(var(--foreground))]">
          Connecting Supabase
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Create a Supabase project and run <code className="font-mono">supabase/schema.sql</code>.</li>
          <li>Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code> and fill in your keys.</li>
          <li>Add your user id to the <code className="font-mono">admins</code> table.</li>
          <li>Set <code className="font-mono">NEXT_PUBLIC_DATA_SOURCE=supabase</code> and implement the query templates in <code className="font-mono">src/lib/supabase/queries.ts</code>.</li>
        </ol>
      </div>
    </div>
  );
}
