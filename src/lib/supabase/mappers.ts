import type { Bayan } from "@/types/bayan";
import type { Category } from "@/types/category";
import type { Speaker } from "@/types/speaker";

/*
 * Row → domain-type mappers. Supabase columns are snake_case; the app uses
 * camelCase. Keep DB shape isolated here so the rest of the app is agnostic.
 */

export function mapBayanRow(row: Record<string, any>): Bayan {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    speakerId: row.speaker_id,
    categoryId: row.category_id,
    language: row.language ?? "Tamil",
    coverImageUrl: row.cover_image_url ?? null,
    audioSource: row.audio_source,
    audioUrl: row.audio_url ?? null,
    youtubeVideoId: row.youtube_video_id ?? null,
    durationSeconds: row.duration_seconds ?? 0,
    publishedAt: row.published_at ?? null,
    isFeatured: !!row.is_featured,
    isPublished: !!row.is_published,
    playCount: row.play_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategoryRow(row: Record<string, any>): Category {
  return {
    id: row.id,
    name: row.name,
    nameTa: row.name_ta ?? undefined,
    slug: row.slug,
    description: row.description ?? "",
    icon: row.icon ?? "mic",
    coverImageUrl: row.cover_image_url ?? null,
    sortOrder: row.sort_order ?? 0,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}

export function mapSpeakerRow(row: Record<string, any>): Speaker {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio ?? "",
    profileImageUrl: row.profile_image_url ?? null,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}
