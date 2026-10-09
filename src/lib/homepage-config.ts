// Homepage section configuration — editable via /admin/homepage.
// Each section has a label/title (text rendered as the heading), font size,
// color, and optionally a category that drives "latest news" content.

// Inline categories to avoid a synchronous import chain to news-data.ts
// which pulls in image assets and adds ~1.2s to the critical path.
const ALL_CATEGORIES = [
  "Northeast",
  "Global",
  "Crime",
  "Sports",
  "Tripura",
  "Entertainment",
  "Education",
];

export type SectionStyle = {
  title: string;
  fontSize: number; // px
  color: string; // hex
  /** Category slug (one of ALL_CATEGORIES) for sections that filter by category. */
  category?: string;
  autoSlide?: boolean;
  slideInterval?: number;
  showMultiple?: boolean;
  slideCount?: number;
  enabled?: boolean;
  /** Image display mode: "cover" (crop to fill) or "contain" / "fit" (show entire full uncropped image) */
  imageFit?: "cover" | "contain" | "natural";
};

export type LiveVideoConfig = {
  enabled?: boolean;
  autoplay?: boolean;
  provider: "youtube" | "facebook";
  youtubeChannelId: string;
  youtubeVideoId?: string;
  facebookPageUrl: string;
  title: string;
  thumbnailUrl?: string;
};

export type HomepageConfig = {
  heroTopStories: SectionStyle;
  heroCultureMusic: SectionStyle;
  heroOpinion: SectionStyle;
  heroPopular: SectionStyle;
  heroFeatured: SectionStyle;
  watch: SectionStyle;
  marketsMagazine: SectionStyle;
  liveVideo: LiveVideoConfig;
  newsGridColumns: SectionStyle[]; // 5 columns
  showTicker?: boolean;
  showBreakingBar?: boolean;
};

export const ALL_CATEGORY_OPTIONS = ["Auto (Latest)", ...ALL_CATEGORIES];

export const defaultHomepageConfig: HomepageConfig = {
  heroTopStories: { title: "Top Stories", fontSize: 12, color: "#1A1110" },
  heroCultureMusic: { title: "Culture & Music", fontSize: 12, color: "#1A1110" },
  heroOpinion: { title: "Opinion", fontSize: 12, color: "#1A1110" },
  heroPopular: { title: "Popular", fontSize: 12, color: "#1A1110" },
  heroFeatured: {
    title: "Featured",
    fontSize: 12,
    color: "#1A1110",
    category: "Auto (Latest)",
    autoSlide: true,
    slideInterval: 5,
    showMultiple: true,
    slideCount: 3,
  },
  watch: { title: "Watch", fontSize: 16, color: "#1A1110" },
  marketsMagazine: { title: "Markets Magazine", fontSize: 16, color: "#1A1110" },
  showTicker: false,
  showBreakingBar: true,
  liveVideo: {
    enabled: true,
    autoplay: true,
    provider: "youtube",
    youtubeChannelId: "UC2EhA8EnLxOCbgn3nW2-OjA",
    youtubeVideoId: "99tqX34EEVI",
    facebookPageUrl: "https://www.facebook.com/facebook",
    title: "News Vanguard | ত্রিপুরা লাইভ ২৪*৭",
  },
  newsGridColumns: [
    { title: "World", fontSize: 12, color: "#1A1110", category: "Global" },
    { title: "Northeast", fontSize: 12, color: "#1A1110", category: "Northeast" },
    { title: "Crime", fontSize: 12, color: "#1A1110", category: "Crime" },
    { title: "Sports", fontSize: 12, color: "#1A1110", category: "Sports" },
    { title: "Latest", fontSize: 12, color: "#1A1110", category: "Auto (Latest)" },
  ],
};

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

const KEY = "nt:homepage-config:v1";
const EVENT = "nt:homepage-updated";

// ─── Server Functions (MySQL Database Persistence) ─────────────────────────

let homepageConfigCache: { data: HomepageConfig; expiry: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export const getHomepageConfigServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomepageConfig> => {
    if (homepageConfigCache && homepageConfigCache.expiry > Date.now()) {
      return homepageConfigCache.data;
    }
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'homepage_config'",
      );
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value);
        const res = {
          ...defaultHomepageConfig,
          ...parsed,
          newsGridColumns:
            Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5
              ? parsed.newsGridColumns
              : defaultHomepageConfig.newsGridColumns,
        };
        homepageConfigCache = { data: res, expiry: Date.now() + CACHE_TTL_MS };
        return res;
      }
    } catch {}
    homepageConfigCache = { data: defaultHomepageConfig, expiry: Date.now() + CACHE_TTL_MS };
    return defaultHomepageConfig;
  },
);

export async function resolveYouTubeInternal(rawInput: string) {
  const raw = (rawInput || "").trim();
  if (!raw) {
    return { ok: false, error: "Please enter a YouTube Channel ID, Handle (@name), or Video Link." };
  }

  // 1. Direct watch / share / live / shorts / embed URLs
  const videoMatch = raw.match(
    /(?:watch\?v=|youtu\.be\/|youtube\.com\/(?:live|embed|shorts|v)\/|^)([a-zA-Z0-9_-]{11})(?:[?&/].*)?$/,
  );
  if (videoMatch && !raw.startsWith("UC") && !raw.includes("channel/") && !raw.includes("@")) {
    const videoId = videoMatch[1];
    return {
      ok: true,
      type: "video" as const,
      videoId,
      channelId: "",
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      title: "",
    };
  }

  // 2. Direct Channel ID (UC...)
  const channelMatch = raw.match(/(?:channel\/|^)(UC[a-zA-Z0-9_-]{22})(?:[/?].*)?$/);
  if (channelMatch) {
    const channelId = channelMatch[1];
    return {
      ok: true,
      type: "channel" as const,
      channelId,
      videoId: "",
      embedUrl: `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&rel=0`,
      thumbnailUrl: "",
      title: "",
    };
  }

  // 3. Handle or custom URL (@handle or youtube.com/@handle)
  const handleMatch = raw.match(/@([a-zA-Z0-9_.-]+)/);
  if (handleMatch) {
    const handle = `@${handleMatch[1]}`;
    try {
      const res = await fetch(`https://www.youtube.com/${handle}/live`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });
      const html = await res.text();
      const mChannel =
        html.match(/"channelId":"([a-zA-Z0-9_-]+)"/) ||
        html.match(/channel_id=([a-zA-Z0-9_-]+)/);
      const mVideo =
        html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"/) ||
        html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      const mTitle = html.match(/<title>([^<]+)<\/title>/);
      const channelId = mChannel?.[1] || "";
      const videoId = mVideo?.[1] || "";
      const title = mTitle?.[1]?.replace(" - YouTube", "").trim() || "";

      return {
        ok: true,
        type: videoId ? ("live_video" as const) : channelId ? ("channel" as const) : ("unknown" as const),
        handle,
        channelId,
        videoId,
        title,
        thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "",
        embedUrl: videoId
          ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`
          : channelId
          ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&rel=0`
          : "",
      };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Failed to contact YouTube to detect channel" };
    }
  }

  return {
    ok: false,
    error: "Unrecognized format. Please paste a channel handle (@name), full channel link, or video link.",
  };
}

export const saveHomepageConfigServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((cfg: HomepageConfig) => cfg)
  .handler(async ({ data }) => {
    // Automatically resolve handle or URL to real Channel ID and live video ID if needed
    if (data?.liveVideo?.provider === "youtube" && data.liveVideo.youtubeChannelId) {
      const raw = data.liveVideo.youtubeChannelId.trim();
      if (raw.includes("@") || raw.includes("youtube.com/") || raw.includes("youtu.be/")) {
        try {
          const res = await resolveYouTubeInternal(raw);
          if (res.ok) {
            if (res.channelId) data.liveVideo.youtubeChannelId = res.channelId;
            if (res.videoId && !data.liveVideo.youtubeVideoId) data.liveVideo.youtubeVideoId = res.videoId;
            if (res.title && !data.liveVideo.title) data.liveVideo.title = res.title;
          }
        } catch {}
      }
    }

    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('homepage_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );
    homepageConfigCache = null;
    return { success: true };
  });

/**
 * Server-side YouTube channel & live-stream detector.
 * Resolves @handles, channel URLs, live URLs, video IDs to verified channel ID and active live video.
 */
export const resolveYouTubeServer = createServerFn({ method: "POST" })
  .validator((input: { urlOrId: string }) => input)
  .handler(async ({ data }) => {
    return await resolveYouTubeInternal(data.urlOrId);
  });

export function loadHomepageConfig(): HomepageConfig {
  if (typeof window === "undefined") return defaultHomepageConfig;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultHomepageConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultHomepageConfig,
      ...parsed,
      newsGridColumns:
        Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5
          ? parsed.newsGridColumns
          : defaultHomepageConfig.newsGridColumns,
    };
  } catch {
    return defaultHomepageConfig;
  }
}

export async function saveHomepageConfig(cfg: HomepageConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cfg));
    window.dispatchEvent(new Event(EVENT));
  }
  homepageConfigCache = null;
  // Sync centrally to MySQL DB
  return await saveHomepageConfigServer({ data: cfg });
}

export function onHomepageConfigChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function styleFor(s: SectionStyle): React.CSSProperties {
  return { color: s.color, fontSize: `${s.fontSize}px` };
}

/** Pick items matching a category (kicker substring match), latest first. */
export { articlesByCategory } from "./news-data-helpers";
