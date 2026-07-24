// Reels & Shorts config — editable at /admin/reels.
// Supports 3 modes: manual URLs, auto-fetch via API, or both.
// Design note: API creds live in admin localStorage to match the rest of
// this project's homepage-config pattern. Restrict YouTube API keys by
// HTTP referrer in Google Cloud, and use a long-lived Page access token
// for Facebook. Nothing here is ever shown to end users.

export type ReelsProvider = "youtube" | "facebook";
export type ReelsMode = "manual" | "auto" | "both";

export type YouTubeAuto = {
  apiKey: string;
  channelId: string; // UC...
  maxResults: number; // 1-25
};

export type FacebookAuto = {
  accessToken: string; // long-lived Page access token
  pageId: string;
  maxResults: number;
};

export type ReelItem = {
  url: string;
  embedSrc: string;
  thumbnail?: string;
  title?: string;
  source: "manual" | "auto";
};

export type ReelsConfig = {
  enabled: boolean;
  provider: ReelsProvider;
  mode: ReelsMode;
  title: string;
  urls: string[]; // manual list
  youtube: YouTubeAuto;
  facebook: FacebookAuto;
};

export const defaultReelsConfig: ReelsConfig = {
  enabled: true,
  provider: "youtube",
  mode: "manual",
  title: "Reels & Shorts",
  urls: [],
  youtube: { apiKey: "", channelId: "", maxResults: 8 },
  facebook: { accessToken: "", pageId: "", maxResults: 8 },
};

const KEY = "nt:reels-config:v2";
const EVENT = "nt:reels-updated";

export function loadReelsConfig(): ReelsConfig {
  if (typeof window === "undefined") return defaultReelsConfig;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultReelsConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultReelsConfig,
      ...parsed,
      urls: Array.isArray(parsed.urls) ? parsed.urls.filter((u: unknown) => typeof u === "string") : [],
      youtube: { ...defaultReelsConfig.youtube, ...(parsed.youtube ?? {}) },
      facebook: { ...defaultReelsConfig.facebook, ...(parsed.facebook ?? {}) },
    };
  } catch {
    return defaultReelsConfig;
  }
}

export function saveReelsConfig(cfg: ReelsConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event(EVENT));
}

export function onReelsConfigChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* ---------------- URL helpers ---------------- */

export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
    if (u.pathname === "/watch") return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export function toEmbedSrc(provider: ReelsProvider, url: string): string | null {
  if (provider === "youtube") {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1` : null;
  }
  const trimmed = url.trim();
  if (!/^https?:\/\/(www\.)?facebook\.com\//i.test(trimmed)) return null;
  const href = encodeURIComponent(trimmed);
  return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1`;
}

/* ---------------- Auto-fetchers ---------------- */

/** YouTube Data API v3 — latest short-form videos from a channel. */
export async function fetchYouTubeShorts(cfg: YouTubeAuto): Promise<ReelItem[]> {
  if (!cfg.apiKey || !cfg.channelId) return [];
  const params = new URLSearchParams({
    key: cfg.apiKey,
    channelId: cfg.channelId,
    part: "snippet",
    order: "date",
    type: "video",
    videoDuration: "short",
    maxResults: String(Math.max(1, Math.min(25, cfg.maxResults || 8))),
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  const json = (await res.json()) as {
    items?: Array<{
      id: { videoId?: string };
      snippet: { title: string; thumbnails?: { medium?: { url: string } } };
    }>;
  };
  return (json.items ?? [])
    .filter((i) => i.id.videoId)
    .map((i) => {
      const id = i.id.videoId!;
      return {
        url: `https://www.youtube.com/shorts/${id}`,
        embedSrc: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`,
        thumbnail: i.snippet.thumbnails?.medium?.url,
        title: i.snippet.title,
        source: "auto" as const,
      };
    });
}

/** Facebook Graph API — latest reels/videos from a page. */
export async function fetchFacebookReels(cfg: FacebookAuto): Promise<ReelItem[]> {
  if (!cfg.accessToken || !cfg.pageId) return [];
  const params = new URLSearchParams({
    access_token: cfg.accessToken,
    fields: "id,title,description,permalink_url,picture",
    limit: String(Math.max(1, Math.min(25, cfg.maxResults || 8))),
  });
  const res = await fetch(
    `https://graph.facebook.com/v20.0/${encodeURIComponent(cfg.pageId)}/video_reels?${params}`,
  );
  if (!res.ok) throw new Error(`Facebook Graph ${res.status}`);
  const json = (await res.json()) as {
    data?: Array<{ id: string; title?: string; permalink_url?: string; picture?: string }>;
  };
  return (json.data ?? []).map((v) => {
    const url = v.permalink_url?.startsWith("http")
      ? v.permalink_url
      : `https://www.facebook.com${v.permalink_url ?? `/reel/${v.id}`}`;
    return {
      url,
      embedSrc: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`,
      thumbnail: v.picture,
      title: v.title,
      source: "auto" as const,
    };
  });
}

/** Build the merged list according to the current mode. */
export async function loadReels(cfg: ReelsConfig): Promise<ReelItem[]> {
  const manual: ReelItem[] = cfg.urls.flatMap((u) => {
    const src = toEmbedSrc(cfg.provider, u);
    const ytId = cfg.provider === "youtube" ? extractYouTubeId(u) : null;
    const thumbnail = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined;
    return src ? [{ url: u, embedSrc: src, thumbnail, source: "manual" as const }] : [];
  });

  let auto: ReelItem[] = [];
  if (cfg.mode !== "manual") {
    try {
      auto =
        cfg.provider === "youtube"
          ? await fetchYouTubeShorts(cfg.youtube)
          : await fetchFacebookReels(cfg.facebook);
    } catch (e) {
      console.warn("[reels] auto fetch failed:", e);
    }
  }

  if (cfg.mode === "manual") return manual;
  if (cfg.mode === "auto") return auto;
  const seen = new Set(manual.map((m) => m.url));
  return [...manual, ...auto.filter((a) => !seen.has(a.url))];
}
