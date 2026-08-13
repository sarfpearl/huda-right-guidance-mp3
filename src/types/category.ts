/** A Bayan topic category (e.g. Iman & Taqwa, Salah, Dua). */
export interface Category {
  id: string;
  name: string;
  /** Tamil display name, optional. */
  nameTa?: string;
  slug: string;
  description: string;
  /** Lucide-style icon key resolved in the UI (see CategoryIcon). */
  icon: string;
  coverImageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  /** Connected YouTube / YouTube Music playlist ID for this category. */
  youtubePlaylistId?: string | null;
  /** Denormalised count of published Bayan; computed by the data layer. */
  bayanCount?: number;
}
