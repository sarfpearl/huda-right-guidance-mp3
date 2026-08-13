export default function AdminMediaPage() {
  const buckets = [
    { id: "bayan-audio", label: "Bayan audio (MP3)", path: "/bayan-audio/" },
    { id: "bayan-images", label: "Bayan cover images", path: "/bayan-images/" },
    { id: "speaker-images", label: "Speaker images", path: "/speaker-images/" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Media</h1>
      <p className="mb-6 text-sm text-muted">
        Storage buckets used by the platform.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {buckets.map((b) => (
          <div key={b.id} className="rounded-2xl border surface p-5 shadow-soft">
            <p className="font-semibold">{b.label}</p>
            <p className="mt-1 font-mono text-xs text-muted">{b.path}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed p-6 text-sm text-muted">
        Uploads (MP3 &amp; images) become available once Supabase Storage is
        connected. Buckets and access policies are defined in{" "}
        <code className="font-mono">supabase/schema.sql</code>. Public read is
        enabled; writes are restricted to admins via RLS.
      </div>
    </div>
  );
}
