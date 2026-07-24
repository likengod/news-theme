import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// Types
export type FontSource = "google" | "upload";

export type FontEntry = {
  id: string;
  name: string;           // display name e.g. "Roboto"
  family: string;         // CSS font-family value e.g. "Roboto"
  source: FontSource;
  googleUrl?: string;     // Google Fonts stylesheet URL if source=google
  fileDataUrl?: string;   // base64 data URL for uploaded .woff2/.ttf
  weights: string[];      // e.g. ["400", "500", "700"]
  isDefault: boolean;     // is this the site-wide default?
  isSystem: boolean;      // true for pre-installed fonts (can't be deleted)
  createdAt: string;
};

export type FontSectionKey = "headlines" | "body" | "navigation" | "footer" | "ticker" | "buttons";

export type FontSectionMapping = Record<FontSectionKey, string>; // font ID per section

export type FontConfiguration = {
  fonts: FontEntry[];
  sectionMapping: FontSectionMapping;
};

// Section metadata for UI display
export const FONT_SECTIONS: { key: FontSectionKey; label: string; description: string; cssVar: string }[] = [
  { key: "headlines", label: "Headlines", description: "H1, H2, H3, H4 headings", cssVar: "--font-headlines" },
  { key: "body", label: "Body Text", description: "Paragraphs, article content", cssVar: "--font-body" },
  { key: "navigation", label: "Navigation", description: "Menu items, nav links", cssVar: "--font-nav" },
  { key: "footer", label: "Footer", description: "Footer text and links", cssVar: "--font-footer" },
  { key: "ticker", label: "News Ticker", description: "Breaking news ticker bar", cssVar: "--font-ticker" },
  { key: "buttons", label: "Buttons & CTAs", description: "Buttons, call-to-action elements", cssVar: "--font-buttons" },
];

// Popular Google Fonts catalog for quick-add
export const GOOGLE_FONTS_CATALOG: { name: string; family: string; weights: string[]; category: string }[] = [
  { name: "Inter", family: "Inter", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Roboto", family: "Roboto", weights: ["400","500","700"], category: "Sans-serif" },
  { name: "Poppins", family: "Poppins", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Open Sans", family: "Open Sans", weights: ["400","600","700"], category: "Sans-serif" },
  { name: "Lato", family: "Lato", weights: ["400","700"], category: "Sans-serif" },
  { name: "Montserrat", family: "Montserrat", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Nunito", family: "Nunito", weights: ["400","600","700"], category: "Sans-serif" },
  { name: "Raleway", family: "Raleway", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Work Sans", family: "Work Sans", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Outfit", family: "Outfit", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "DM Sans", family: "DM Sans", weights: ["400","500","700"], category: "Sans-serif" },
  { name: "Source Sans 3", family: "Source Sans 3", weights: ["400","600","700"], category: "Sans-serif" },
  { name: "Playfair Display", family: "Playfair Display", weights: ["400","700","800","900"], category: "Serif" },
  { name: "Merriweather", family: "Merriweather", weights: ["400","700"], category: "Serif" },
  { name: "Lora", family: "Lora", weights: ["400","500","600","700"], category: "Serif" },
  { name: "PT Serif", family: "PT Serif", weights: ["400","700"], category: "Serif" },
  { name: "News Cycle", family: "News Cycle", weights: ["400","700"], category: "Serif" },
  { name: "Bodoni Moda", family: "Bodoni Moda", weights: ["700","800","900"], category: "Serif" },
  { name: "DM Serif Display", family: "DM Serif Display", weights: ["400"], category: "Serif" },
  { name: "Hind Siliguri", family: "Hind Siliguri", weights: ["400","500","600","700"], category: "Bengali" },
  { name: "Noto Sans Bengali", family: "Noto Sans Bengali", weights: ["400","500","600","700"], category: "Bengali" },
  { name: "JetBrains Mono", family: "JetBrains Mono", weights: ["400","600"], category: "Monospace" },
  { name: "Fira Code", family: "Fira Code", weights: ["400","500","700"], category: "Monospace" },
  { name: "Dancing Script", family: "Dancing Script", weights: ["400","700"], category: "Display" },
  { name: "Oswald", family: "Oswald", weights: ["400","500","600","700"], category: "Sans-serif" },
  { name: "Noto Serif Bengali", family: "Noto Serif Bengali", weights: ["400","500","600","700"], category: "Bengali" },
  { name: "Tiro Bangla", family: "Tiro Bangla", weights: ["400"], category: "Bengali" },
  { name: "Galada", family: "Galada", weights: ["400"], category: "Bengali" },
];

// Default system fonts — only fonts actively used in section mappings + Bengali support
const SYSTEM_FONTS: FontEntry[] = [
  {
    id: "sys-inter", name: "Inter", family: "Inter", source: "google",
    weights: ["400","500","600","700"], isDefault: true, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-news-cycle", name: "News Cycle", family: "News Cycle", source: "google",
    weights: ["400","700"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-hind-siliguri", name: "Hind Siliguri", family: "Hind Siliguri", source: "google",
    weights: ["400","500","600","700"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-noto-bengali", name: "Noto Sans Bengali", family: "Noto Sans Bengali", source: "google",
    weights: ["400","500","600","700"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-noto-serif-bengali", name: "Noto Serif Bengali", family: "Noto Serif Bengali", source: "google",
    weights: ["400","500","600","700"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-tiro-bangla", name: "Tiro Bangla", family: "Tiro Bangla", source: "google",
    weights: ["400"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sys-galada", name: "Galada", family: "Galada", source: "google",
    weights: ["400"], isDefault: false, isSystem: true,
    createdAt: new Date().toISOString(),
  },
];

export const defaultFontConfig: FontConfiguration = {
  fonts: SYSTEM_FONTS,
  sectionMapping: {
    headlines: "sys-news-cycle",  // News Cycle for h1-h4
    body: "sys-inter",           // Inter for body text
    navigation: "sys-inter",     // Inter for nav menus
    footer: "sys-inter",         // Inter for footer
    ticker: "sys-inter",         // Inter for ticker
    buttons: "sys-inter",        // Inter for buttons
  },
};

function mergeFonts(savedFonts?: FontEntry[]): FontEntry[] {
  if (!savedFonts) return [...SYSTEM_FONTS];
  const systemIds = new Set(SYSTEM_FONTS.map(f => f.id));
  const userOnly = savedFonts.filter(f => !systemIds.has(f.id));
  return [...SYSTEM_FONTS, ...userOnly];
}

// Local cache for server operations
const CACHE_TTL_MS = 10000;
const cache = new Map<string, { value: any; expiry: number }>();

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value as T;
}

function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, expiry: Date.now() + CACHE_TTL_MS });
}

function clearCache(key: string): void {
  cache.delete(key);
}

// Server functions
export const getFontConfigServer = createServerFn({ method: "GET" })
  .handler(async () => {
    const cacheKey = "font_configuration_data";
    const cached = getCached<FontConfiguration>(cacheKey);
    if (cached) return cached;

    try {
      const rows = (await query("SELECT value FROM site_settings WHERE setting_key = ?", [
        cacheKey,
      ])) as { value: string }[];

      if (rows && rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as Partial<FontConfiguration>;
        const config: FontConfiguration = {
          ...defaultFontConfig,
          ...parsed,
          fonts: mergeFonts(parsed.fonts),
          sectionMapping: {
            ...defaultFontConfig.sectionMapping,
            ...(parsed.sectionMapping || {}),
          },
        };
        setCached(cacheKey, config);
        return config;
      }
    } catch (e) {
      console.error("Error retrieving font config from DB:", e);
    }

    setCached(cacheKey, defaultFontConfig);
    return defaultFontConfig;
  });

export const saveFontConfigServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: unknown) => data as FontConfiguration)
  .handler(async ({ data }) => {
    const cacheKey = "font_configuration_data";
    const jsonValue = JSON.stringify(data);

    try {
      await query(
        `INSERT INTO site_settings (setting_key, value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = ?`,
        [cacheKey, jsonValue, jsonValue]
      );
      clearCache(cacheKey);
      return { success: true };
    } catch (e) {
      console.error("Error saving font config to DB:", e);
      throw e;
    }
  });

// Client Local Storage Functions
export const FONT_CONFIG_KEY = "nt:font-config";

export function loadFontConfig(): FontConfiguration {
  if (typeof window === "undefined") return defaultFontConfig;

  try {
    const stored = localStorage.getItem(FONT_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<FontConfiguration>;
      return {
        ...defaultFontConfig,
        ...parsed,
        fonts: mergeFonts(parsed.fonts),
        sectionMapping: {
          ...defaultFontConfig.sectionMapping,
          ...(parsed.sectionMapping || {}),
        },
      };
    }
  } catch (e) {
    console.error("Failed to load font config from localStorage", e);
  }

  return defaultFontConfig;
}

export function saveFontConfig(config: FontConfiguration): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("nt:fonts-updated"));
    window.dispatchEvent(new Event("nt:settings-updated"));

    // Fire and forget server save
    saveFontConfigServer({ data: config }).catch((err) => {
      console.error("Failed to sync font config to server", err);
    });
  } catch (e) {
    console.error("Error saving font config", e);
  }
}

// CSS Builder Helpers
export function buildGoogleFontsUrl(fonts: FontEntry[]): string {
  const googleFonts = fonts.filter((f) => f.source === "google");
  if (googleFonts.length === 0) return "";

  const families = googleFonts.map((font) => {
    const name = font.family.replace(/ /g, "+");
    if (!font.weights || font.weights.length === 0) {
      return `family=${name}`;
    }
    const weights = [...font.weights].sort().join(";");
    return `family=${name}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export function buildFontFaceCss(fonts: FontEntry[]): string {
  const uploadFonts = fonts.filter((f) => f.source === "upload" && f.fileDataUrl);
  if (uploadFonts.length === 0) return "";

  return uploadFonts
    .map((font) => {
      const weight = font.weights && font.weights.length > 0 ? font.weights[0] : "normal";
      return `
@font-face {
  font-family: '${font.family}';
  src: url('${font.fileDataUrl}') format('woff2');
  font-display: swap;
  font-weight: ${weight};
}`.trim();
    })
    .join("\n\n");
}

export function getFontById(fontId: string, fonts: FontEntry[]): FontEntry | undefined {
  return fonts.find((f) => f.id === fontId);
}

export function buildSectionCssVars(config: FontConfiguration): string {
  const vars: string[] = [];

  for (const section of FONT_SECTIONS) {
    const fontId = config.sectionMapping[section.key as FontSectionKey];
    let family = "sans-serif";

    if (fontId) {
      const font = getFontById(fontId, config.fonts);
      if (font) {
        family = `"${font.family}", sans-serif`;
      }
    }

    vars.push(`  ${section.cssVar}: ${family};`);
  }

  return `:root {\n${vars.join("\n")}\n}`;
}

export function generateFontId(): string {
  return `font-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
