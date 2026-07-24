import { queryOptions } from "@tanstack/react-query";
import { getPublicArticleBySlug } from "./articles.functions";

export interface ArticlePageData {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  publishedISO: string;
  modifiedISO: string;
  hero: string;
  midImage: string;
  paragraphs: string[];
  views: number;
  excerpt: string;
  access_level?: "Free" | "Premium";
}

export async function getArticleData(slug: string): Promise<ArticlePageData | null> {
  try {
    const art = await getPublicArticleBySlug({ data: slug });
    if (!art) {
      // Return beautiful mock data for placeholder/template items so they open correctly!
      const rawTitle = slug.replace(/-/g, " ");
      const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      
      const paragraphs = [
        "Lottery-like options and speculative markets have captured the attention of a new generation of traders looking to navigate high inflation, rising home prices, and structural shifts in the job market. This shift has reshaped the landscape for retail investing.",
        "While financial regulators caution against the high volatility of short-dated derivatives and speculative instruments, market volumes continue to reach new records. Platforms have responded by tailoring interface designs to match mobile-first user behaviors.",
        "As retail trading continues to evolve, market experts advise focusing on core economic indicators and long-term asset building. Our weekly updates will continue tracking this ongoing story with insights from market analysts and local brokerage feeds."
      ];

      return {
        slug,
        title: title || "Exclusive Market Report",
        category: "Markets",
        author: "Justina Lee",
        date: new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        publishedISO: new Date().toISOString(),
        modifiedISO: new Date().toISOString(),
        hero: "/placeholder.svg",
        midImage: "/placeholder.svg",
        paragraphs,
        views: 184320,
        excerpt: `${title} — read the full report and coverage on News Theme.`,
        access_level: "Free",
      };
    }

    const published = new Date(art.date);

    return {
      slug: art.slug,
      title: art.title,
      category: art.category,
      author: art.author || "Newsroom",
      date: published.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      publishedISO: published.toISOString(),
      modifiedISO: published.toISOString(),
      hero: art.featuredImage || "",
      midImage: art.featuredImage || "",
      paragraphs: [art.content || art.excerpt || art.title],
      views: art.views || 0,
      excerpt: art.excerpt || `${art.title} — read the full report on News Theme.`,
      access_level: art.access_level || "Free",
    };
  } catch (err) {
    console.error("[MySQL] Error loading article data:", err);
    return null;
  }
}

export function articleQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["article", slug],
    queryFn: () => getArticleData(slug),
  });
}
