import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { query } from "@/lib/db.server";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Resolve domain origin
          let origin = "";
          let siteName = "News Theme";
          let siteDesc =
            "Breaking news, market intelligence, and sharp business analysis from News Theme.";

          try {
            const req = getRequest();
            const proto = req.headers.get("x-forwarded-proto") ?? "http";
            const host = req.headers.get("host") ?? "localhost:3099";
            origin = `${proto}://${host}`;
          } catch {
            origin = "http://localhost:3099";
          }

          // Check settings
          try {
            const settingRows = await query(
              "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
            );
            if (settingRows.length > 0 && settingRows[0].value) {
              const parsed = JSON.parse(settingRows[0].value);
              if (parsed?.siteName) siteName = parsed.siteName;
              if (parsed?.metaDescription) siteDesc = parsed.metaDescription;
              if (
                parsed?.seoCanonicalBaseUrl &&
                !parsed.seoCanonicalBaseUrl.includes("domainname.com")
              ) {
                origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
              }
            }
          } catch {}

          // Fetch latest 50 published articles
          let articles: any[] = [];
          try {
            articles = await query(
              "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50",
            );
          } catch {}

          const lastBuildDate = new Date().toUTCString();

          let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(siteDesc)}</description>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;

          if (Array.isArray(articles)) {
            for (const a of articles) {
              const pubDate = a.date ? new Date(a.date).toUTCString() : lastBuildDate;
              const link = `${origin}/news/${a.slug}`;
              const cleanTitle = escapeXml(a.title || "");
              const cleanDesc = escapeXml(a.excerpt || a.title || "");
              const category = escapeXml(a.category || "News");

              xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
    </item>
`;
            }
          }

          xml += `  </channel>
</rss>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=1800, s-maxage=1800",
            },
          });
        } catch (err: any) {
          return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Error generating RSS feed")}</error>`,
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
