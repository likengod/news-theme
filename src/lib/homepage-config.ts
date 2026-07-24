// Homepage section configuration — editable via /admin/homepage.
// Each section has a label/title (text rendered as the heading), font size,
// color, and optionally a category that drives "latest news" content.

import { sections as ALL_CATEGORIES, lead, top, grid, type Article } from "./news-data";

export type SectionStyle = {
  title: string;
  fontSize: number; // px
  color: string; // hex
  /** Category slug (one of ALL_CATEGORIES) for sections that filter by category. */
  category?: string;
};

export type LiveVideoConfig = {
  provider: "youtube" | "facebook";
  youtubeChannelId: string;
  facebookPageUrl: string;
  title: string;
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
};

export const ALL_CATEGORY_OPTIONS = ["Auto (Latest)", ...ALL_CATEGORIES];

export const defaultHomepageConfig: HomepageConfig = {
  heroTopStories: { title: "Top Stories", fontSize: 12, color: "#1A1110" },
  heroCultureMusic: { title: "Culture & Music", fontSize: 12, color: "#1A1110" },
  heroOpinion: { title: "Opinion", fontSize: 12, color: "#1A1110" },
  heroPopular: { title: "Popular", fontSize: 12, color: "#1A1110" },
  heroFeatured: { title: "Featured", fontSize: 12, color: "#1A1110", category: "Auto (Latest)" },
  watch: { title: "Watch", fontSize: 16, color: "#1A1110" },
  marketsMagazine: { title: "Markets Magazine", fontSize: 16, color: "#1A1110" },
  liveVideo: {
    provider: "youtube",
    youtubeChannelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
    facebookPageUrl: "https://www.facebook.com/facebook",
    title: "LIVE: Markets Now — breaking coverage",
  },
  newsGridColumns: [
    { title: "World", fontSize: 12, color: "#1A1110", category: "Global" },
    { title: "Politics", fontSize: 12, color: "#1A1110", category: "Politics" },
    { title: "Opinion", fontSize: 12, color: "#1A1110", category: "Opinion" },
    { title: "Culture", fontSize: 12, color: "#1A1110", category: "Auto (Latest)" },
    { title: "Arts", fontSize: 12, color: "#1A1110", category: "Auto (Latest)" },
  ],
};


import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

const KEY = "nt:homepage-config:v1";
const EVENT = "nt:homepage-updated";

// ─── Server Functions (MySQL Database Persistence) ─────────────────────────

export const getHomepageConfigServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<HomepageConfig> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'homepage_config'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value);
        return {
          ...defaultHomepageConfig,
          ...parsed,
          newsGridColumns:
            Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5
              ? parsed.newsGridColumns
              : defaultHomepageConfig.newsGridColumns,
        };
      }
    } catch {}
    return defaultHomepageConfig;
  });

export const saveHomepageConfigServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((cfg: HomepageConfig) => cfg)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('homepage_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    return { success: true };
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

export function saveHomepageConfig(cfg: HomepageConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cfg));
    window.dispatchEvent(new Event(EVENT));
  }
  // Sync centrally to MySQL DB
  saveHomepageConfigServer({ data: cfg }).catch(() => {});
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
export function articlesByCategory(category?: string): Article[] {
  const pool: Article[] = [
    lead as Article,
    ...top as Article[],
    ...grid as Article[],
  ];
  if (!category || category === "Auto (Latest)") return pool;
  const c = category.toLowerCase();
  const matched = pool.filter((a) => (a.kicker ?? "").toLowerCase().includes(c));
  return matched.length > 0 ? matched : pool;
}
