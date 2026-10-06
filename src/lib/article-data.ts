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
  imageCaption?: string;
  imageCredit?: string;
  paragraphs: string[];
  views: number;
  excerpt: string;
  tags?: string[];
  access_level?: "Free" | "Premium";
}

function parseArticleDate(dateVal: any): Date {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) {
    return isNaN(dateVal.getTime()) ? new Date() : dateVal;
  }
  if (typeof dateVal === "string") {
    const trimmed = dateVal.trim();
    if (!trimmed || trimmed.startsWith("0000-00-00")) {
      return new Date();
    }
    let d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
    if (trimmed.includes(" ")) {
      d = new Date(trimmed.replace(" ", "T"));
      if (!isNaN(d.getTime())) return d;
    }
    if (trimmed.includes(" ") && !trimmed.endsWith("Z")) {
      d = new Date(trimmed.replace(" ", "T") + "Z");
      if (!isNaN(d.getTime())) return d;
    }
  }
  if (typeof dateVal === "number") {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
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
        "As retail trading continues to evolve, market experts advise focusing on core economic indicators and long-term asset building. Our weekly updates will continue tracking this ongoing story with insights from market analysts and local brokerage feeds.",
      ];

      const now = new Date();
      return {
        slug,
        title: title || "Exclusive Market Report",
        category: "Markets",
        author: "Justina Lee",
        date: now.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        publishedISO: now.toISOString(),
        modifiedISO: now.toISOString(),
        hero: "/placeholder.svg",
        midImage: "/placeholder.svg",
        paragraphs,
        views: 184320,
        excerpt: `${title} — read the full report and coverage on News Theme.`,
        access_level: "Free",
      };
    }

    const published = parseArticleDate(art.date);
    const isoString = published.toISOString();

    let displayDate = "";
    try {
      displayDate = published.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      displayDate = published.toDateString();
    }

    let paragraphs: string[] = [];
    if (art.content && typeof art.content === "string" && art.content.trim()) {
      paragraphs = [art.content];
    } else if (art.excerpt && typeof art.excerpt === "string" && art.excerpt.trim()) {
      paragraphs = [art.excerpt];
    } else {
      paragraphs = [art.title || ""];
    }

    let parsedTags: string[] = [];
    if (art.tags && typeof art.tags === "string") {
      parsedTags = art.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(art.tags)) {
      parsedTags = art.tags.map((t: any) => String(t).trim()).filter(Boolean);
    }

    return {
      slug: art.slug,
      title: art.title || "",
      category: art.category || "News",
      author: art.author || "Newsroom",
      date: displayDate,
      publishedISO: isoString,
      modifiedISO: isoString,
      hero: art.featuredImage || "",
      midImage: art.featuredImage || "",
      imageCaption: art.imageCaption || "",
      imageCredit: art.imageCredit || "",
      paragraphs,
      views: Number(art.views) || 0,
      excerpt: art.excerpt || art.title || "",
      tags: parsedTags,
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
