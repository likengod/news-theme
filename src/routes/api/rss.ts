import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db.server";

export const Route = createFileRoute("/api/rss")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Fetch latest 50 published articles
          const articles = await query(
            "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50"
          );

          const origin = "https://northeasttimeline.com"; // default site origin
          const lastBuildDate = new Date().toUTCString();

          let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News Theme</title>
    <description>Breaking news, market intelligence, and sharp business analysis from News Theme.</description>
    <link>${origin}</link>
    <atom:link href="${origin}/api/rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;

          for (const a of articles) {
            const pubDate = new Date(a.date).toUTCString();
            const link = `${origin}/article/${a.slug}`;
            const cleanTitle = escapeXml(a.title);
            const cleanDesc = escapeXml(a.excerpt || a.title);

            xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>
`;
          }

          xml += `  </channel>
</rss>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          });
        } catch (err: any) {
          return new Response(
            `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Failed to generate feed")}</error>`,
            {
              status: 500,
              headers: { "Content-Type": "application/xml" },
            }
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
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
