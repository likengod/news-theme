import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { query } from "@/lib/db.server";
import { defaultPages } from "@/lib/site-content/default-pages";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Resolve domain origin
          let origin = "";
          try {
            const req = getRequest();
            const proto = req.headers.get("x-forwarded-proto") ?? "http";
            const host = req.headers.get("host") ?? "localhost:3099";
            origin = `${proto}://${host}`;
          } catch {
            origin = "http://localhost:3099";
          }

          // Check if custom canonical domain is set in settings
          try {
            const settingRows = await query(
              "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
            );
            if (settingRows.length > 0 && settingRows[0].value) {
              const parsed = JSON.parse(settingRows[0].value);
              if (
                parsed?.seoCanonicalBaseUrl &&
                !parsed.seoCanonicalBaseUrl.includes("domainname.com")
              ) {
                origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
              }
            }
          } catch {}

          // Fetch published articles (up to 1,000)
          let articles: any[] = [];
          try {
            articles = await query(
              "SELECT slug, date, updated_at FROM articles WHERE status = 'Published' ORDER BY date DESC, id DESC LIMIT 1000",
            );
          } catch {}

          // Fetch active categories
          let categories: any[] = [];
          try {
            categories = await query("SELECT slug FROM categories");
          } catch {}

          const nowIso = new Date().toISOString();

          let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Homepage -->
  <url>
    <loc>${origin}/</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;

          // Static & System Policy Pages
          const staticPaths = [
            "/submit-news",
            "/contact",
            "/event",
            "/subscription",
            "/work-with-us",
            "/archive",
            ...defaultPages.map((p) => `/${p.slug}`),
          ];

          const uniquePaths = Array.from(new Set(staticPaths));
          for (const path of uniquePaths) {
            xml += `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
          }

          // Category URLs
          if (Array.isArray(categories)) {
            for (const cat of categories) {
              if (!cat.slug) continue;
              xml += `  <url>
    <loc>${origin}/${cat.slug}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
            }
          }

          // Article URLs
          if (Array.isArray(articles)) {
            for (const a of articles) {
              if (!a.slug) continue;
              const lastmod = a.updated_at
                ? new Date(a.updated_at).toISOString()
                : a.date
                  ? new Date(a.date).toISOString()
                  : nowIso;

              xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
            }
          }

          xml += `</urlset>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
          });
        } catch (err: any) {
          return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Error generating sitemap")}</error>`,
            {
              status: 500,
              headers: { "Content-Type": "application/xml; charset=utf-8" },
            },
          );
        }
      },
    },
  },
});

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
