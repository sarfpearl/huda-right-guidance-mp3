"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { BayanWithRelations } from "@/types/bayan";
import type { Category } from "@/types/category";
import type { Speaker } from "@/types/speaker";
import { createBayan, updateBayan, type ActionResult } from "@/lib/admin/actions";
import { slugify } from "@/lib/utils";

const field =
  "h-11 w-full rounded-xl border surface-muted px-3.5 text-sm outline-none focus:border-primary-400 focus:surface";
const labelCls = "mb-1.5 block text-sm font-medium";

export function BayanForm({
  speakers,
  categories,
  bayan,
}: {
  speakers: Speaker[];
  categories: Category[];
  bayan?: BayanWithRelations;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const [title, setTitle] = useState(bayan?.title ?? "");
  const [slug, setSlug] = useState(bayan?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!bayan);
  const [source, setSource] = useState<"local" | "youtube">(
    bayan?.audioSource ?? "local"
  );
  const [audioUrl, setAudioUrl] = useState(bayan?.audioUrl ?? "");
  const [duration, setDuration] = useState(bayan?.durationSeconds ?? 0);
  const detectRef = useRef<HTMLAudioElement | null>(null);

  function detectDuration() {
    if (!audioUrl) return;
    const el = detectRef.current ?? new Audio();
    detectRef.current = el;
    el.src = audioUrl;
    el.addEventListener(
      "loadedmetadata",
      () => setDuration(Math.round(el.duration || 0)),
      { once: true }
    );
    el.load();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = bayan
        ? await updateBayan(bayan.id, formData)
        : await createBayan(formData);
      setResult(res);
      if (res.ok) {
        router.push("/admin/bayan");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {result ? (
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm " +
            (result.ok
              ? "border-primary-300 bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
              : "border-gold-400/50 bg-gold-400/10 text-gold-600 dark:text-gold-300")
          }
          role="status"
        >
          {result.message}
        </div>
      ) : null}

      <div>
        <label className={labelCls} htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={field}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="slug">Slug</label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className={field + " font-mono"}
        />
        <p className="mt-1 text-xs text-muted">URL: /bayan/{slug || "…"}</p>
      </div>

      <div>
        <label className={labelCls} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={bayan?.description ?? ""}
          className="w-full rounded-xl border surface-muted p-3.5 text-sm outline-none focus:border-primary-400 focus:surface"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="speakerId">Speaker</label>
          <select
            id="speakerId"
            name="speakerId"
            required
            defaultValue={bayan?.speakerId ?? ""}
            className={field}
          >
            <option value="" disabled>Choose a speaker</option>
            {speakers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={bayan?.categoryId ?? ""}
            className={field}
          >
            <option value="" disabled>Choose a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="language">Language</label>
          <input id="language" name="language" defaultValue={bayan?.language ?? "Tamil"} className={field} />
        </div>
        <div>
          <label className={labelCls} htmlFor="coverImageUrl">Cover image URL</label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            defaultValue={bayan?.coverImageUrl ?? ""}
            placeholder="Supabase Storage /bayan-images/…"
            className={field}
          />
        </div>
      </div>

      {/* Audio source */}
      <fieldset className="rounded-xl border p-4">
        <legend className="px-1 text-sm font-medium">Audio source</legend>
        <div className="mb-4 flex gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name="audioSource" value="local" checked={source === "local"} onChange={() => setSource("local")} />
            Local MP3
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="radio" name="audioSource" value="youtube" checked={source === "youtube"} onChange={() => setSource("youtube")} />
            YouTube
          </label>
        </div>

        {source === "local" ? (
          <div className="space-y-3">
            <div>
              <label className={labelCls} htmlFor="audioUrl">MP3 URL (Supabase Storage /bayan-audio/)</label>
              <input
                id="audioUrl"
                name="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                onBlur={detectDuration}
                placeholder="https://<project>.supabase.co/storage/v1/object/public/bayan-audio/…"
                className={field}
              />
            </div>
            <p className="text-xs text-muted">
              File upload to Supabase Storage becomes available once Supabase is
              connected. Paste a Storage URL for now.
            </p>
          </div>
        ) : (
          <div>
            <label className={labelCls} htmlFor="youtubeUrl">YouTube URL or video ID</label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={bayan?.youtubeVideoId ?? ""}
              placeholder="https://www.youtube.com/watch?v=…"
              className={field}
            />
            <p className="mt-1 text-xs text-muted">
              We store only the video ID and embed the official player — no
              download or re-hosting.
            </p>
          </div>
        )}
      </fieldset>

      <div>
        <label className={labelCls} htmlFor="durationSeconds">Duration (seconds)</label>
        <div className="flex gap-2">
          <input
            id="durationSeconds"
            name="durationSeconds"
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={field}
          />
          {source === "local" ? (
            <button
              type="button"
              onClick={detectDuration}
              className="h-11 shrink-0 rounded-xl border px-3 text-sm font-medium hover:border-primary-300"
            >
              Detect
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={bayan?.isFeatured} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={bayan?.isPublished ?? true} />
          Published
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center rounded-full bg-primary-700 px-6 font-semibold text-sand-50 hover:bg-primary-600 disabled:opacity-60"
        >
          {pending ? "Saving…" : bayan ? "Save changes" : "Create Bayan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/bayan")}
          className="inline-flex h-11 items-center rounded-full border px-6 font-medium hover:border-primary-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
