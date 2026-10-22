import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth-middleware";

type CacheEntry<T> = {
  data: T;
  expiry: number;
};
const SERVER_CACHE: Record<string, CacheEntry<any>> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCached<T>(key: string): T | null {
  const entry = SERVER_CACHE[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  return null;
}

export function setCached<T>(key: string, data: T) {
  SERVER_CACHE[key] = {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  };
}

export function clearCache(key: string) {
  delete SERVER_CACHE[key];
}

export const clearAllCachesServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    // 1. Clear in-memory site settings & data caches
    for (const key in SERVER_CACHE) {
      delete SERVER_CACHE[key];
    }

    // 2. Clear specialized subsystem caches
    try {
      const { clearHomepageArticlesCache } = await import("../articles.functions");
      clearHomepageArticlesCache();
    } catch {}

    try {
      const { clearCategoriesCache, clearTagsCache } = await import("../taxonomy.functions");
      clearCategoriesCache();
      clearTagsCache();
    } catch {}

    try {
      const { clearFontCache } = await import("../font-config");
      clearFontCache();
    } catch {}

    // 3. Purge server.js SSR micro-cache via fast-path endpoint
    try {
      const port = process.env.PORT || "3000";
      const http = await import("node:http");
      const req = http.request({
        hostname: "127.0.0.1",
        port: Number(port),
        path: "/api/internal/clear-cache",
        method: "GET",
        timeout: 2000,
      });
      req.on("error", () => {});
      req.end();
    } catch {}

    let purgedCount = 0;

    // 4. Scan and purge orphaned promotional & stray upload images from disk
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const { query } = await import("../db.server");
      const cwd = process.cwd();

      // Collect all active image filenames across database
      const activeFilenames = new Set<string>();

      // A. Active ads
      try {
        const adRows: any = await query(
          "SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'",
        );
        if (adRows && adRows[0]?.value) {
          const cfg = JSON.parse(adRows[0].value);
          if (cfg?.slots) {
            for (const s of Object.keys(cfg.slots)) {
              const arr = cfg.slots[s];
              if (Array.isArray(arr)) {
                for (const it of arr) {
                  if (it?.image) activeFilenames.add(path.basename(it.image.split("?")[0]));
                  if (it?.imagePortrait) activeFilenames.add(path.basename(it.imagePortrait.split("?")[0]));
                  if (it?.imageLandscape) activeFilenames.add(path.basename(it.imageLandscape.split("?")[0]));
                }
              }
            }
          }
        }
      } catch {}

      // B. Media library
      try {
        const mediaRows: any = await query("SELECT url FROM media_library");
        if (Array.isArray(mediaRows)) {
          for (const m of mediaRows) {
            if (m?.url) activeFilenames.add(path.basename(m.url.split("?")[0]));
          }
        }
      } catch {}

      // C. Articles featured images
      try {
        const articleRows: any = await query(
          "SELECT featured_image FROM articles WHERE featured_image IS NOT NULL",
        );
        if (Array.isArray(articleRows)) {
          for (const a of articleRows) {
            if (a?.featured_image) activeFilenames.add(path.basename(a.featured_image.split("?")[0]));
          }
        }
      } catch {}

      // Target folders to clean up
      const checkDirs = [
        path.join(cwd, "public", "uploads", "promos"),
        path.join(cwd, "dist", "client", "uploads", "promos"),
        path.join(cwd, "uploads", "promos"),
        path.join(cwd, "uploads"),
        path.join(cwd, "tmp"),
        path.join(cwd, "temp"),
      ];

      const now = Date.now();
      const MIN_AGE_MS = 60 * 1000; // Skip files created less than 1 minute ago

      for (const dir of checkDirs) {
        if (!fs.existsSync(dir)) continue;
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const ent of entries) {
            if (!ent.isFile()) continue;
            const fname = ent.name;
            if (fname === ".gitkeep" || fname.startsWith(".")) continue;

            const fullPath = path.join(dir, fname);
            try {
              const stat = fs.statSync(fullPath);
              if (now - stat.mtimeMs < MIN_AGE_MS) continue;

              // If file is not in active database references, delete it!
              if (!activeFilenames.has(fname)) {
                fs.unlinkSync(fullPath);
                purgedCount++;
              }
            } catch {}
          }
        } catch {}
      }
    } catch (e) {
      console.error("[CacheCleanup] Disk cleanup error:", e);
    }

    const message =
      purgedCount > 0
        ? `Server cache cleared and ${purgedCount} unused orphaned file(s) permanently deleted from disk.`
        : "Server cache and performance buffers successfully refreshed.";

    return { success: true, message, purgedCount };
  });
