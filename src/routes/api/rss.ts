import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { query } from "@/lib/db.server";

export const Route = createFileRoute("/api/rss")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Dynamic origin resolution with TodayTripura default fallback
          let origin = "https://todaytripura.com";
          let siteName = "Today Tripura";
          let siteDesc = "Breaking news, ground reports, politics, and latest updates from Tripura and Northeast India.";
          let language = "bn-IN";

          try {
            const req = getRequest();
            const proto = req.headers.get("x-forwarded-proto") ?? "https";
            const host = req.headers.get("host") ?? "todaytripura.com";
            origin = `${proto}://${host}`;
          } catch {
            origin = "https://todaytripura.com";
          }

          // Check settings for custom site name or canonical domain
          try {
            const settingRows = await query(
              "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
            );
            if (settingRows.length > 0 && settingRows[0].value) {
              const parsed = JSON.parse(settingRows[0].value);
              if (parsed?.seoNewsPublicationName) siteName = parsed.seoNewsPublicationName;
              else if (parsed?.siteName) siteName = parsed.siteName;
              if (parsed?.metaDescription) siteDesc = parsed.metaDescription;
              if (parsed?.defaultLanguage) {
                language = parsed.defaultLanguage.toLowerCase() === "en" ? "en-US" : "bn-IN";
              }
              if (
                parsed?.seoCanonicalBaseUrl &&
                !parsed.seoCanonicalBaseUrl.includes("domainname.com")
              ) {
                origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
              }
            }
          } catch {}

          // Fetch latest 50 published articles
          const articles = await query(
            "SELECT * FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50",
          );

          const lastBuildDate = new Date().toUTCString();

          let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(siteDesc)}</description>
    <link>${origin}</link>
    <atom:link href="${origin}/api/rss" rel="self" type="application/rss+xml" />
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;

          for (const a of articles) {
            const pubDate = new Date(a.date).toUTCString();
            const link = `${origin}/news/${a.slug}`;
            const cleanTitle = escapeXml(a.title);
            const cleanDesc = escapeXml(a.excerpt || a.title);

            xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.category || "News")}</category>
    </item>
`;
          }

          xml += `  </channel>
</rss>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
            },
          });
        } catch (err: any) {
          return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Failed to generate feed")}</error>`,
            {
              status: 500,
              headers: { "Content-Type": "application/xml" },
            },
          );
        }
      },
    },
  },
});

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
