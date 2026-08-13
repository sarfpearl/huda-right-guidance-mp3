import type { BayanWithRelations } from "@/types/bayan";
import { createSupabaseServerClient } from "./server";
import { mapBayanRow, mapCategoryRow, mapSpeakerRow } from "./mappers";

/*
 * ─────────────────────────────────────────────────────────────────────────
 *  SUPABASE QUERY TEMPLATES
 *
 *  These are the live-database counterparts to the functions in
 *  src/lib/data/service.ts. They are provided as ready-to-use templates:
 *  once your schema + data exist, route the service functions here (behind
 *  the NEXT_PUBLIC_DATA_SOURCE flag) instead of throwing notImplemented.
 *
 *  A couple are fully implemented as reference; the rest follow the same
 *  pattern (select with the relation join, then map rows).
 * ─────────────────────────────────────────────────────────────────────────
 */

const BAYAN_SELECT =
  "*, speaker:speakers(*), category:categories(*)";

/** Reference implementation: fetch a single published Bayan by slug. */
export async function getBayanBySlugSupabase(
  slug: string
): Promise<BayanWithRelations | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bayan")
    .select(BAYAN_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapBayanRow(data),
    speaker: mapSpeakerRow(data.speaker),
    category: mapCategoryRow(data.category),
  };
}

/** Reference implementation: latest published Bayan. */
export async function getLatestBayanSupabase(
  limit = 8
): Promise<BayanWithRelations[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bayan")
    .select(BAYAN_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    ...mapBayanRow(row),
    speaker: mapSpeakerRow(row.speaker),
    category: mapCategoryRow(row.category),
  }));
}

// TODO(supabase): implement the remaining service functions following the
// same pattern — getFeaturedBayan, getPopularBayan, getBayanByCategory,
// getBayanBySpeaker, searchBayan (use `.textSearch` or `.ilike`),
// getRandomBayan, getCategories, getSpeakers, etc.
