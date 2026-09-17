import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { query } from "@/lib/db.server";

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Resolve domain origin
          let origin = "";
          let publicationName = "News Theme";
          try {
            const req = getRequest();
            const proto = req.headers.get("x-forwarded-proto") ?? "http";
            const host = req.headers.get("host") ?? "localhost:3099";
            origin = `${proto}://${host}`;
          } catch {
            origin = "http://localhost:3099";
          }

          // Check settings for siteName and canonical domain
          try {
            const settingRows = await query(
              "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
            );
            if (settingRows.length > 0 && settingRows[0].value) {
              const parsed = JSON.parse(settingRows[0].value);
              if (parsed?.siteName) {
                publicationName = parsed.siteName;
              }
              if (
                parsed?.seoCanonicalBaseUrl &&
                !parsed.seoCanonicalBaseUrl.includes("domainname.com")
              ) {
                origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
              }
            }
          } catch {}

          // Google News guidelines: articles from the past 48 hours
          let articles: any[] = [];
          try {
            articles = await query(
              "SELECT slug, title, category, date FROM articles WHERE status = 'Published' AND date >= NOW() - INTERVAL 48 HOUR ORDER BY date DESC, id DESC LIMIT 100",
            );
          } catch {}

          // Fallback if no stories in last 48h: include latest 25 stories
          if (!articles || articles.length === 0) {
            try {
              articles = await query(
                "SELECT slug, title, category, date FROM articles WHERE status = 'Published' ORDER BY date DESC, id DESC LIMIT 25",
              );
            } catch {}
          }

          let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

          if (Array.isArray(articles)) {
            for (const a of articles) {
              if (!a.slug || !a.title) continue;
              const pubDate = a.date ? new Date(a.date).toISOString() : new Date().toISOString();
              const cleanTitle = escapeXml(a.title);
              const cleanKeywords = escapeXml(a.category || "News");

              xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      <news:keywords>${cleanKeywords}</news:keywords>
    </news:news>
  </url>
`;
            }
          }

          xml += `</urlset>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=600, s-maxage=600",
            },
          });
        } catch (err: any) {
          return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Error generating news sitemap")}</error>`,
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
