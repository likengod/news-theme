import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth-middleware";
import { query } from "../db.server";
import { defaultPages, type PageContent } from "./default-pages";
import { getCached, setCached, clearCache } from "./server-cache";

const PAGES_KEY = "nt:site-pages";

export const getCustomPagesServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<PageContent[]> => {
    const cacheKey = "custom_pages_data";
    const cached = getCached<PageContent[]>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as PageContent[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with defaultPages to ensure new pages appear
          const merged = [...defaultPages];
          parsed.forEach((savedPage) => {
            if (savedPage.slug === "about" && savedPage.title === "About News Theme") {
              savedPage.title = "About Us";
            }
            const idx = merged.findIndex((p) => p.slug === savedPage.slug);
            if (idx !== -1) merged[idx] = savedPage;
            else merged.push(savedPage);
          });
          setCached(cacheKey, merged);
          return merged;
        }
      }
    } catch {}
    return defaultPages;
  },
);

export const saveCustomPageServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(
    (page) =>
      z
        .object({
          slug: z.string(),
          title: z.string(),
          intro: z.string().optional().default(""),
          body: z.string().optional().default(""),
          sections: z.array(z.object({ heading: z.string(), body: z.string() })).optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          ogImage: z.string().optional(),
          metaKeywords: z.string().optional(),
          canonicalUrl: z.string().optional(),
          noIndex: z.boolean().optional(),
        })
        .passthrough()
        .parse(page) as PageContent,
  )
  .handler(async ({ data: updatedPage }) => {
    let pages = defaultPages;
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        pages = JSON.parse(rows[0].value);
      }
    } catch {}

    const idx = pages.findIndex((p) => p.slug === updatedPage.slug);
    if (idx >= 0) pages[idx] = updatedPage;
    else pages.push(updatedPage);

    const json = JSON.stringify(pages);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('custom_pages_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );
    clearCache("custom_pages_data");
    return { success: true };
  });

export function loadPages(): PageContent[] {
  if (typeof window === "undefined") return defaultPages;
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    if (!raw) return defaultPages;
    const parsed: PageContent[] = JSON.parse(raw);
    const map = new Map(parsed.map((p) => [p.slug, p]));
    return defaultPages.map((d) => {
      const saved = map.get(d.slug);
      return saved ? { ...d, ...saved } : d;
    });
  } catch {
    return defaultPages;
  }
}

export function savePages(p: PageContent[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PAGES_KEY, JSON.stringify(p));
  }
}
