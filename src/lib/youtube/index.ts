/**
 * YouTube & YouTube Music helpers (Video & Playlist support).
 *
 * We ONLY use official embed players and canonical YouTube / YouTube Music links.
 */

export interface PlaylistVideoItem {
  id: string;
  title: string;
  videoId: string;
  author: string;
  thumbnailUrl: string;
  watchUrl: string;
  musicUrl: string;
}

/** Extract the 11-char video id from any common YouTube or YouTube Music URL. */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Already a bare id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1, 12);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host.endsWith("youtube.com") ||
      host.endsWith("youtube-nocookie.com") ||
      host.endsWith("music.youtube.com")
    ) {
      // watch?v=ID
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      // /embed/ID  or  /shorts/ID  or  /live/ID
      const m = url.pathname.match(
        /\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/
      );
      if (m) return m[1];
    }
  } catch {
    // not a URL — fall through
  }
  return null;
}

/** Extract Playlist ID (e.g. PL... or UU...) from YouTube playlist URL. */
export function extractYouTubePlaylistId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{12,40}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const list = url.searchParams.get("list");
    if (list) return list;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Fetch video items from an open YouTube Playlist RSS feed (Server-safe).
 */
export async function fetchYouTubePlaylistVideos(
  playlistId: string
): Promise<PlaylistVideoItem[]> {
  const cleanId = extractYouTubePlaylistId(playlistId) || playlistId;
  if (!cleanId) return [];

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${cleanId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const xmlText = await res.text();
    const items: PlaylistVideoItem[] = [];

    const entries = xmlText.split("<entry>");
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const authorMatch = entry.match(/<name>(.*?)<\/name>/);

      if (videoIdMatch && videoIdMatch[1]) {
        const vId = videoIdMatch[1];
        const rawTitle = titleMatch ? titleMatch[1] : "Bayan Track";
        const cleanTitle = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const authorName = authorMatch ? authorMatch[1] : "Islamic Guidance";

        items.push({
          id: `yt-${vId}`,
          title: cleanTitle,
          videoId: vId,
          author: authorName,
          thumbnailUrl: youtubeThumbnail(vId),
          watchUrl: youtubeWatchUrl(vId),
          musicUrl: youtubeMusicUrl(vId),
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

/** Privacy-enhanced embed URL for single video. */
export function youtubeEmbedUrl(
  videoId: string,
  opts: { autoplay?: boolean } = {}
): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (opts.autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/** Privacy-enhanced embed URL for a continuous YouTube Playlist. */
export function youtubePlaylistEmbedUrl(
  playlistId: string,
  opts: { autoplay?: boolean } = {}
): string {
  const params = new URLSearchParams({
    listType: "playlist",
    list: playlistId,
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (opts.autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`;
}

/** Canonical watch URL for single YouTube video. */
export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** Canonical playlist URL for YouTube. */
export function youtubePlaylistWatchUrl(playlistId: string): string {
  return `https://www.youtube.com/playlist?list=${playlistId}`;
}

/** Canonical watch URL for YouTube Music. */
export function youtubeMusicUrl(videoId: string): string {
  return `https://music.youtube.com/watch?v=${videoId}`;
}

/** Canonical playlist URL for YouTube Music. */
export function youtubeMusicPlaylistUrl(playlistId: string): string {
  return `https://music.youtube.com/playlist?list=${playlistId}`;
}

/** Search query URL for YouTube Music. */
export function youtubeMusicSearchUrl(query: string): string {
  return `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
}

/** Default thumbnail served by YouTube's CDN. */
export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
