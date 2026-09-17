import { slugify } from "@/lib/news-data";

export type Row = {
  id: number;
  title: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  country: string;
  author: string;
  views: number;
  status: "Published" | "Draft" | "Review";
  date: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  featured: boolean;
  newsType: "Standard" | "Breaking" | "Featured" | "Exclusive" | "Opinion" | "Video";
  journalistId: string;
  journalistName: string;
  access_level: "Free" | "Premium";
};

export const statusStyle: Record<Row["status"], string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
};

export type Tab = "content" | "media" | "seo" | "settings";

export const getDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.host;
  }
  return "northeasttimeline.com";
};

export const fullUrl = (r: Row) => {
  const domain = getDomain();
  const title = r.slug || slugify(r.title) || "news-title";
  return [domain, "news", title].filter(Boolean).join("/");
};

export const formatDateTimeLocal = (dateVal: any): string => {
  if (!dateVal) return "";
  try {
    const d = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    if (d instanceof Date && !isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    if (typeof dateVal === "string") {
      return dateVal.slice(0, 16).replace(" ", "T");
    }
  } catch (e) {
    console.error("formatDateTimeLocal error:", e);
  }
  return "";
};

export type ArticleStatus = Row["status"];

