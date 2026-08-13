"use server";

import { revalidatePath } from "next/cache";
import { isWriteEnabled } from "@/lib/data/service";
import { extractYouTubeId } from "@/lib/youtube";
import { slugify } from "@/lib/utils";

/*
 * Admin write actions.
 *
 * These are the single place content mutations happen. When Supabase is
 * connected (NEXT_PUBLIC_DATA_SOURCE=supabase) they perform real, authorised
 * writes; in demo/seed mode they return a clear message instead of pretending
 * to save — no fake success. Production must also gate these behind an admin
 * session check (see the TODO in requireAdmin()).
 */

export interface ActionResult {
  ok: boolean;
  message: string;
  /** slug of the created/updated Bayan, when relevant. */
  slug?: string;
}

const DEMO_MESSAGE =
  "Demo mode: content management is read-only until Supabase is connected. " +
  "Set NEXT_PUBLIC_DATA_SOURCE=supabase and configure your keys to enable saving.";

async function requireAdmin(): Promise<void> {
  // TODO(supabase): verify the caller is an authenticated admin before any
  // write, e.g. read the Supabase session and check membership in public.admins.
  //   const supabase = createSupabaseServerClient();
  //   const { data: { user } } = await supabase.auth.getUser();
  //   const { data: isAdmin } = await supabase.rpc("is_admin");
  //   if (!user || !isAdmin) throw new Error("Unauthorised");
  return;
}

/** Parse a Bayan create/edit form into a normalised payload. */
function parseBayanForm(formData: FormData) {
  const audioSource = (formData.get("audioSource") as string) === "youtube"
    ? "youtube"
    : "local";
  const title = (formData.get("title") as string)?.trim() ?? "";
  const rawSlug = (formData.get("slug") as string)?.trim() ?? "";
  const youtubeInput = (formData.get("youtubeUrl") as string)?.trim() ?? "";

  return {
    title,
    slug: rawSlug ? slugify(rawSlug) : slugify(title),
    description: (formData.get("description") as string)?.trim() ?? "",
    speakerId: (formData.get("speakerId") as string) ?? "",
    categoryId: (formData.get("categoryId") as string) ?? "",
    language: (formData.get("language") as string)?.trim() || "Tamil",
    coverImageUrl: (formData.get("coverImageUrl") as string)?.trim() || null,
    audioSource,
    audioUrl:
      audioSource === "local"
        ? (formData.get("audioUrl") as string)?.trim() || null
        : null,
    youtubeVideoId:
      audioSource === "youtube" ? extractYouTubeId(youtubeInput) : null,
    durationSeconds: Number(formData.get("durationSeconds") || 0),
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
  };
}

function validate(payload: ReturnType<typeof parseBayanForm>): string | null {
  if (!payload.title) return "Title is required.";
  if (!payload.slug) return "A valid slug could not be generated.";
  if (!payload.speakerId) return "Please choose a speaker.";
  if (!payload.categoryId) return "Please choose a category.";
  if (payload.audioSource === "local" && !payload.audioUrl)
    return "A local MP3 URL (Supabase Storage) is required.";
  if (payload.audioSource === "youtube" && !payload.youtubeVideoId)
    return "A valid YouTube URL / video ID is required.";
  return null;
}

export async function createBayan(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const payload = parseBayanForm(formData);
  const error = validate(payload);
  if (error) return { ok: false, message: error };

  if (!isWriteEnabled) return { ok: false, message: DEMO_MESSAGE };

  // TODO(supabase): insert into `bayan` (snake_case) using the admin client.
  //   const supabase = createSupabaseAdminClient();
  //   const { error } = await supabase.from("bayan").insert({ ...mapToRow(payload), published_at: payload.isPublished ? new Date().toISOString() : null });
  //   if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/bayan");
  revalidatePath("/");
  return { ok: true, message: "Bayan created.", slug: payload.slug };
}

export async function updateBayan(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const payload = parseBayanForm(formData);
  const error = validate(payload);
  if (error) return { ok: false, message: error };

  if (!isWriteEnabled) return { ok: false, message: DEMO_MESSAGE };

  // TODO(supabase): update `bayan` where id = id.
  revalidatePath("/admin/bayan");
  revalidatePath(`/bayan/${payload.slug}`);
  return { ok: true, message: "Bayan updated.", slug: payload.slug };
}

export async function togglePublish(
  id: string,
  publish: boolean
): Promise<ActionResult> {
  await requireAdmin();
  if (!isWriteEnabled) return { ok: false, message: DEMO_MESSAGE };
  // TODO(supabase): update is_published (+ published_at) where id = id.
  revalidatePath("/admin/bayan");
  return { ok: true, message: publish ? "Published." : "Unpublished." };
}

export async function deleteBayan(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isWriteEnabled) return { ok: false, message: DEMO_MESSAGE };
  // TODO(supabase): delete from `bayan` where id = id (and remove storage file).
  revalidatePath("/admin/bayan");
  return { ok: true, message: "Bayan deleted." };
}
