import type { Category } from "./category";
import type { Speaker } from "./speaker";

export type AudioSource = "local" | "youtube";

/** Raw Bayan row as stored in the database. */
export interface Bayan {
  id: string;
  title: string;
  slug: string;
  description: string;
  speakerId: string;
  categoryId: string;
  /** ISO 639-ish label, e.g. "Tamil". */
  language: string;
  coverImageUrl: string | null;
  audioSource: AudioSource;
  /** Present when audioSource === "local" (Supabase Storage URL). */
  audioUrl: string | null;
  /** Present when audioSource === "youtube". */
  youtubeVideoId: string | null;
  /** Present when connected to a YouTube / YouTube Music playlist. */
  youtubePlaylistId?: string | null;
  durationSeconds: number;
  publishedAt: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bayan enriched with its speaker & category — the shape the UI and the
 * global player consume. The data layer resolves relations into this.
 */
export interface BayanWithRelations extends Bayan {
  speaker: Speaker;
  category: Category;
}

/** Anonymous listening analytics row. */
export interface BayanPlay {
  id: string;
  bayanId: string;
  sessionId: string;
  startedAt: string;
  completed: boolean;
  durationListened: number;
}

/** Sort options shared by category / speaker / search listings. */
export type BayanSort = "latest" | "popular" | "duration";
