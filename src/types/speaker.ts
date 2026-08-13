/** A Bayan speaker / lecturer. */
export interface Speaker {
  id: string;
  name: string;
  slug: string;
  bio: string;
  profileImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  /** Denormalised count of published Bayan; computed by the data layer. */
  bayanCount?: number;
}
