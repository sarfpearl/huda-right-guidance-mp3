import { NextResponse } from "next/server";
import { fetchYouTubePlaylistVideos, extractYouTubePlaylistId } from "@/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("list") || searchParams.get("url") || "";

  const playlistId = extractYouTubePlaylistId(input);
  if (!playlistId) {
    return NextResponse.json(
      { error: "Invalid YouTube playlist ID or URL" },
      { status: 400 }
    );
  }

  const items = await fetchYouTubePlaylistVideos(playlistId);
  return NextResponse.json({ playlistId, count: items.length, items });
}
