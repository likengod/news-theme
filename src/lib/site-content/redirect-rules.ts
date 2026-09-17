import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth-middleware";
import { query } from "../db.server";
import { getCached, setCached, clearCache } from "./server-cache";

export type RedirectRule = {
  id: string;
  source: string;
  destination: string;
  hits: number;
  createdAt: string;
};

export type BrokenLinkItem = {
  id: string;
  articleId: number;
  articleTitle: string;
  articleSlug: string;
  brokenUrl: string;
  suggestedFix: string;
};

export const getRedirectRulesServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<RedirectRule[]> => {
    const cacheKey = "site_redirects_data";
    const cached = getCached<RedirectRule[]>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as RedirectRule[];
        setCached(cacheKey, parsed);
        return parsed;
      }
    } catch {}
    return [];
  },
);

export const saveRedirectRulesServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(
    (rules) =>
      z
        .array(
          z.object({
            id: z.string(),
            source: z.string(),
            destination: z.string(),
            hits: z.number(),
            createdAt: z.string(),
          }),
        )
        .parse(rules) as RedirectRule[],
  )
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );
    clearCache("site_redirects_data");
    return { success: true };
  });

export const incrementRedirectHitServer = createServerFn({ method: "POST" })
  .validator((id) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        const rules = JSON.parse(rows[0].value) as RedirectRule[];
        const idx = rules.findIndex((r) => r.id === id);
        if (idx >= 0) {
          rules[idx].hits = (rules[idx].hits || 0) + 1;
          const json = JSON.stringify(rules);
          await query(
            `INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
             ON DUPLICATE KEY UPDATE value = ?`,
            [json, json],
          );
          clearCache("site_redirects_data");
        }
      }
    } catch {}
    return { success: true };
  });

export const scanBrokenLinksServer = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<BrokenLinkItem[]> => {
    // 1. Fetch categories
    const categoriesRows = await query("SELECT slug FROM categories");
    const categorySlugs = new Set<string>(categoriesRows.map((r: any) => r.slug));

    // 2. Fetch custom pages
    let pageSlugs = new Set<string>([
      "about",
      "privacy-policy",
      "terms-and-conditions",
      "cookie-policy",
      "refund-policy",
      "dmca",
      "contact",
    ]);
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        const pages = JSON.parse(rows[0].value);
        if (Array.isArray(pages)) {
          pages.forEach((p: any) => {
            if (p.slug) pageSlugs.add(p.slug);
          });
        }
      }
    } catch {}

    // 3. Fetch articles
    const articlesRows = await query(
      "SELECT id, title, slug, content FROM articles WHERE status = 'Published'",
    );
    const articleSlugsMap = new Map<string, { id: number; title: string }>();
    articlesRows.forEach((r: any) => {
      articleSlugsMap.set(r.slug, { id: r.id, title: r.title });
    });

    const staticRoutes = new Set([
      "",
      "/",
      "/about",
      "/contact",
      "/submit-news",
      "/privacy-policy",
      "/terms-and-conditions",
      "/cookie-policy",
      "/refund-policy",
      "/disclaimer",
      "/editorial-policy",
      "/dmca",
      "/data-deletion-policy",
      "/verified-journalist",
      "/subscription",
      "/work-with-us",
      "/archive",
      "/earn-points",
      "/withdraw-points",
      "/profile",
      "/search",
    ]);

    const brokenLinks: BrokenLinkItem[] = [];

    const findSuggestion = (brokenSlug: string): string => {
      const keywords = brokenSlug.split("-").filter((k) => k.length > 2);
      if (keywords.length === 0) return "";
      let bestMatchSlug = "";
      let maxMatches = 0;
      articlesRows.forEach((r: any) => {
        let matches = 0;
        keywords.forEach((kw) => {
          if (r.slug.includes(kw) || r.title.toLowerCase().includes(kw)) {
            matches++;
          }
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatchSlug = `/news/${r.slug}`;
        }
      });
      return bestMatchSlug;
    };

    const hrefRegex =
      /href=["']((?:\/[a-zA-Z0-9_\-\.\/]*)|(?:https?:\/\/[a-zA-Z0-9_\-\.\/]+))["']/g;

    articlesRows.forEach((art: any) => {
      if (!art.content) return;
      let match;
      const seenLinksInArticle = new Set<string>();

      while ((match = hrefRegex.exec(art.content)) !== null) {
        const url = match[1];
        if (seenLinksInArticle.has(url)) continue;
        seenLinksInArticle.add(url);

        let isBroken = false;
        let suggestion = "";

        if (url.startsWith("/")) {
          const path = url.split("?")[0].split("#")[0];

          if (path.startsWith("/news/")) {
            const slug = path.substring(6);
            if (!articleSlugsMap.has(slug)) {
              isBroken = true;
              suggestion = findSuggestion(slug);
            }
          } else {
            const slug = path.substring(1);
            if (!staticRoutes.has(path) && !pageSlugs.has(slug) && !categorySlugs.has(slug)) {
              isBroken = true;
            }
          }
        }

        if (isBroken) {
          brokenLinks.push({
            id: `${art.id}-${encodeURIComponent(url)}`,
            articleId: art.id,
            articleTitle: art.title,
            articleSlug: art.slug,
            brokenUrl: url,
            suggestedFix: suggestion,
          });
        }
      }
    });

    return brokenLinks;
  });

export const fixBrokenLinkServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data) =>
    z
      .object({
        articleId: z.number(),
        brokenUrl: z.string().min(1),
        correctedUrl: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { articleId, brokenUrl, correctedUrl } = data;

    const rows = await query("SELECT content FROM articles WHERE id = ?", [articleId]);
    if (rows.length === 0) throw new Error("Article not found");
    let content = rows[0].content || "";

    const doubleQuotePattern = new RegExp(`href=["']${escapeRegExp(brokenUrl)}["']`, "g");
    content = content.replace(doubleQuotePattern, `href="${correctedUrl}"`);

    await query("UPDATE articles SET content = ? WHERE id = ?", [content, articleId]);
    return { success: true };
  });

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
