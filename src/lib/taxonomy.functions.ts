import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { slugify } from "./news-data";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  count?: number; // count of articles in category
};

export type TagRow = {
  id: number;
  name: string;
  slug: string;
  count?: number; // count of articles using tag
};

// --- Category Functions ---

export const getCategories = createServerFn({ method: "GET" })
  .validator((data?: { q?: string }) => data ?? {})
  .handler(async ({ data }): Promise<CategoryRow[]> => {
    const q = data?.q ? `%${data.q}%` : null;
    let sql = `
      SELECT c.*, COUNT(a.id) as count 
      FROM categories c 
      LEFT JOIN articles a ON c.name = a.category AND a.status = 'Published'
    `;
    const params: any[] = [];
    if (q) {
      sql += " WHERE c.name LIKE ? OR c.description LIKE ?";
      params.push(q, q);
    }
    sql += " GROUP BY c.id ORDER BY c.name ASC";

    const rows = await query(sql, params);
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description || "",
      metaTitle: r.meta_title || "",
      metaDescription: r.meta_description || "",
      count: Number(r.count || 0),
    }));
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: any) => data)
  .handler(async ({ data }): Promise<CategoryRow> => {
    const c = data;
    const slug = c.slug || slugify(c.name);

    if (c.id && c.id < 1000000) { // check if valid id and not temporary client timestamp
      await query(
        `UPDATE categories 
         SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ? 
         WHERE id = ?`,
        [c.name, slug, c.description || "", c.metaTitle || "", c.metaDescription || "", c.id]
      );
      return { ...c, slug };
    } else {
      const res = await query(
        `INSERT INTO categories (name, slug, description, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?)`,
        [c.name, slug, c.description || "", c.metaTitle || "", c.metaDescription || ""]
      );
      return { ...c, slug, id: res.insertId };
    }
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    await query("DELETE FROM categories WHERE id = ?", [id]);
    return { success: true };
  });

export const importCategories = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((cats: any[]) => cats)
  .handler(async ({ data: cats }) => {
    if (!cats || cats.length === 0) return { success: true };
    for (const c of cats) {
      if (!c.name) continue;
      const finalSlug = c.slug || slugify(c.name);
      const existing = await query("SELECT id FROM categories WHERE id = ? OR slug = ?", [c.id || 0, finalSlug]);
      
      if (existing.length > 0) {
        const idToUpdate = existing[0].id;
        await query(
          `UPDATE categories SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ? WHERE id = ?`,
          [c.name, finalSlug, c.description || "", c.metaTitle || "", c.metaDescription || "", idToUpdate]
        );
      } else {
        await query(
          `INSERT INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)`,
          [c.name, finalSlug, c.description || "", c.metaTitle || "", c.metaDescription || ""]
        );
      }
    }
    return { success: true };
  });

// --- Tag Functions ---

export const getTags = createServerFn({ method: "GET" })
  .handler(async (): Promise<TagRow[]> => {
    // Return tags list and estimate article counts by parsing comma-separated tag list
    // (In a full scale relational model we would join an article_tags map table)
    const tags = await query("SELECT * FROM tags ORDER BY name ASC");
    const articles = await query("SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL");
    
    // Count tags
    const counts = new Map<string, number>();
    articles.forEach((a: any) => {
      const list = a.tags.split(",").map((t: string) => t.trim().toLowerCase());
      list.forEach((t: string) => {
        counts.set(t, (counts.get(t) || 0) + 1);
      });
    });

    return tags.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      count: counts.get(r.name.toLowerCase()) || 0,
    }));
  });

export const saveTag = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: any) => data)
  .handler(async ({ data }): Promise<TagRow> => {
    const t = data;
    const slug = t.slug || slugify(t.name);

    if (t.id && t.id < 1000000) {
      await query("UPDATE tags SET name = ?, slug = ? WHERE id = ?", [t.name, slug, t.id]);
      return { ...t, slug };
    } else {
      const res = await query("INSERT INTO tags (name, slug) VALUES (?, ?)", [t.name, slug]);
      return { ...t, slug, id: res.insertId };
    }
  });

export const deleteTag = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    await query("DELETE FROM tags WHERE id = ?", [id]);
    return { success: true };
  });

export const importTags = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((tags: any[]) => tags)
  .handler(async ({ data: tags }) => {
    if (!tags || tags.length === 0) return { success: true };
    for (const t of tags) {
      if (!t.name) continue;
      const finalSlug = t.slug || slugify(t.name);
      const existing = await query("SELECT id FROM tags WHERE id = ? OR slug = ?", [t.id || 0, finalSlug]);
      
      if (existing.length > 0) {
        const idToUpdate = existing[0].id;
        await query(
          "UPDATE tags SET name = ?, slug = ? WHERE id = ?",
          [t.name, finalSlug, idToUpdate]
        );
      } else {
        await query(
          "INSERT INTO tags (name, slug) VALUES (?, ?)",
          [t.name, finalSlug]
        );
      }
    }
    return { success: true };
  });

export const getCategoryData = createServerFn({ method: "GET" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const slug = typeof data === "string" ? data : (data?.slug || "");
    const page = typeof data === "object" && Number(data?.page) > 0 ? Number(data.page) : 1;
    const limit = typeof data === "object" && Number(data?.limit) > 0 ? Number(data.limit) : 10;
    const offset = (page - 1) * limit;

    const catRows = await query("SELECT * FROM categories WHERE slug = ?", [slug]);
    if (catRows.length === 0) return null;
    const cat = catRows[0];

    const [countRes, articles, latestRows] = await Promise.all([
      query(
        "SELECT COUNT(*) as total FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW()",
        [cat.name]
      ),
      query(
        "SELECT * FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT ? OFFSET ?",
        [cat.name, limit, offset]
      ),
      query(
        "SELECT * FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 5",
        [cat.name]
      )
    ]);

    const total = Number(countRes[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const mapped = articles.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
    }));

    const featured = (page === 1 ? mapped.slice(0, 3) : []).map((a: any) => ({
      title: a.title,
      excerpt: a.excerpt,
      date: new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      img: a.featuredImage,
      tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [cat.name],
      slug: a.slug,
      views: a.views,
      author: a.author || "Newsroom",
      kickers: a.tags ? a.tags.split(",").map((t: string) => t.trim()).slice(0, 2) : [cat.name],
    }));

    const listSource = page === 1 ? mapped.slice(3) : mapped;

    const list = listSource.map((a: any) => ({
      title: a.title,
      excerpt: a.excerpt,
      date: new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      img: a.featuredImage,
      tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [cat.name],
      slug: a.slug,
      views: a.views,
      author: a.author || "Newsroom",
    }));

    const latest = latestRows.map((a: any) => ({
      title: a.title,
      date: new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      img: a.featuredImage,
      slug: a.slug,
    }));

    return {
      category: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || `Latest ${cat.name} news, analysis and updates.`,
        metaTitle: cat.meta_title || `${cat.name} News - News Theme`,
        metaDescription: cat.meta_description || `Read latest ${cat.name} articles and coverage.`,
      },
      featured,
      list,
      latest,
      total,
      totalPages,
      page
    };
  });

export const getTopTags = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> => {
    try {
      const rows = await query(
        "SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL AND tags != '' ORDER BY date DESC LIMIT 60"
      );
      const set = new Set<string>();
      for (const r of rows) {
        if (!r.tags) continue;
        const parts = r.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
        for (const p of parts) {
          // Capitalize first letter cleanly
          const formatted = p.charAt(0).toUpperCase() + p.slice(1);
          set.add(formatted);
          if (set.size >= 10) break;
        }
        if (set.size >= 10) break;
      }
      const fallback = ["Infrastructure", "Trade", "Governance", "Healthcare", "Economy", "Finance", "Space", "Tech", "Sports", "Culture"];
      for (const f of fallback) {
        if (set.size >= 10) break;
        set.add(f);
      }
      return Array.from(set).slice(0, 10);
    } catch (err) {
      console.error("[MySQL] Error fetching top tags:", err);
      return ["Infrastructure", "Trade", "Governance", "Healthcare", "Economy", "Finance", "Space", "Tech", "Sports", "Culture"];
    }
  });
