import { NextResponse } from "next/server";

/**
 * High-speed YouTube Audio Stream Resolver.
 * Resolves direct M4A/AAC audio stream URLs for any YouTube video ID.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("v") || searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  // Known public Piped / Invidious instances that return direct audio streams
  const instances = [
    `https://pipedapi.kavin.rocks/streams/${videoId}`,
    `https://api.piped.video/streams/${videoId}`,
    `https://pipedapi.tokhmi.xyz/streams/${videoId}`,
  ];

  for (const endpoint of instances) {
    try {
      const res = await fetch(endpoint, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;

      const data = await res.json();
      const audioStreams = data.audioStreams || [];
      // Pick highest quality M4A / AAC audio stream
      const bestAudio =
        audioStreams.find((s: { mimeType?: string }) =>
          s.mimeType?.includes("audio/mp4")
        ) || audioStreams[0];

      if (bestAudio?.url) {
        return NextResponse.redirect(bestAudio.url);
      }
    } catch {
      /* try next instance */
    }
  }

  // Direct Invidious audio fallback stream
  const fallbackUrl = `https://invidious.io/latest_version?id=${videoId}&itag=140`;
  return NextResponse.redirect(fallbackUrl);
}
