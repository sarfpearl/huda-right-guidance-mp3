"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteBayan, togglePublish } from "@/lib/admin/actions";
import { EditIcon, EyeIcon, TrashIcon } from "@/components/ui/Icon";

export function BayanRowActions({
  id,
  slug,
  isPublished,
}: {
  id: string;
  slug: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; message: string }>) {
    startTransition(async () => {
      const res = await fn();
      setMsg(res.message);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {msg ? (
        <span className="mr-2 max-w-[220px] truncate text-xs text-muted" title={msg}>
          {msg}
        </span>
      ) : null}

      <Link
        href={`/bayan/${slug}`}
        target="_blank"
        className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:surface-muted hover:text-primary-700"
        aria-label="Preview"
        title="Preview"
      >
        <EyeIcon className="text-base" />
      </Link>
      <Link
        href={`/admin/bayan/${id}`}
        className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:surface-muted hover:text-primary-700"
        aria-label="Edit"
        title="Edit"
      >
        <EditIcon className="text-base" />
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => togglePublish(id, !isPublished))}
        className="rounded-lg px-2 py-1 text-xs font-medium text-muted hover:surface-muted hover:text-primary-700 disabled:opacity-50"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>

      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => deleteBayan(id))}
            className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg px-2 py-1 text-xs text-muted hover:surface-muted"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
          aria-label="Delete"
          title="Delete"
        >
          <TrashIcon className="text-base" />
        </button>
      )}
    </div>
  );
}
