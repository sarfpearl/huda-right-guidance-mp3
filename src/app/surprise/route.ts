import { NextResponse } from "next/server";
import { getRandomBayan } from "@/lib/data/service";
import { siteConfig } from "@/lib/site";

/**
 * "Surprise Me" — picks a random published Bayan and redirects to its detail
 * page. Playback only starts after an explicit user tap on that page, never
 * automatically. Not cached, so each visit is a fresh random pick.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const bayan = await getRandomBayan();
  const target = bayan ? `/bayan/${bayan.slug}` : "/explore";
  return NextResponse.redirect(new URL(target, siteConfig.url));
}
