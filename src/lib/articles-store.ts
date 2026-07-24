// Persisted articles store (localStorage demo). Shared by the Articles admin
// screen and the Journalist analytics screen so published counts stay in sync.
import { grid, top, lead, sections, slugify } from "@/lib/news-data";
import type { Row } from "@/components/admin/ArticleEditor";

const KEY = "nt:articles:v1";

export const blankRow = (): Row => ({
  id: Date.now(),
  title: "", slug: "", category: sections[0],
  city: "", state: "", country: "",
  author: "", views: 0, status: "Draft",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "", content: "",
  featuredImage: "", ogImage: "",
  metaTitle: "", metaDescription: "",
  tags: "", featured: false, newsType: "Standard",
  journalistId: "", journalistName: "",
});

const mk = (partial: Partial<Row>): Row => ({ ...blankRow(), ...partial });

export function seedArticles(): Row[] {
  return [
    mk({ id: 1, title: lead.title, slug: slugify(lead.title), category: "Breaking", city: "Guwahati", state: "Assam", country: "India", author: "Marcus Hale", views: lead.views, status: "Published", date: "2026-06-27", excerpt: lead.dek, featuredImage: lead.img }),
    ...top.map((t, i) => mk({ id: 2 + i, title: t.title, slug: slugify(t.title), category: t.kicker, author: "Newsroom", city: "New Delhi", state: "Delhi", country: "India", views: t.views, status: "Published", date: "2026-06-26", featuredImage: t.img })),
    ...grid.map((g, i) => mk({ id: 5 + i, title: g.title, slug: slugify(g.title), category: g.kicker, author: g.author, city: "Shillong", state: "Meghalaya", country: "India", views: g.views, status: i === 1 ? "Draft" : "Published", date: "2026-06-25", excerpt: g.excerpt, featuredImage: g.img })),
    mk({ id: 9, title: "ECB minutes drop fresh hint on April cut path", slug: "ecb-minutes-april", category: "Business", city: "Frankfurt", state: "Hesse", country: "Germany", author: "Sofia Albrecht", views: 8120, status: "Review", date: "2026-06-24" }),
  ];
}

export function loadArticles(): Row[] {
  if (typeof window === "undefined") return seedArticles();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedArticles();
    const parsed = JSON.parse(raw) as Row[];
    return Array.isArray(parsed) ? parsed : seedArticles();
  } catch {
    return seedArticles();
  }
}

export function saveArticles(rows: Row[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export type JournalistStat = {
  key: string;
  journalistId: string;
  displayName: string;
  published: number;
};

/** Aggregate published-article counts per assigned journalist. */
export function getJournalistStats(rows?: Row[]): JournalistStat[] {
  const list = rows ?? loadArticles();
  const map = new Map<string, JournalistStat>();
  for (const r of list) {
    if (r.status !== "Published") continue;
    const id = (r.journalistId || "").trim();
    const name = (r.journalistName || "").trim();
    if (!id && !name) continue;
    const key = id || name;
    const cur = map.get(key);
    if (cur) cur.published += 1;
    else map.set(key, { key, journalistId: id, displayName: name || `ID ${id}`, published: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.published - a.published);
}
