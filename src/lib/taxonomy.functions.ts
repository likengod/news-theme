import { createServerFn } from "@tanstack/react-start";
import { requireAuth, requireAdmin } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { slugify } from "./news-data";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  showInHeader: boolean;
  sortOrder: number;
  redirectUrl?: string | null;
  count?: number; // count of articles in category
};

export type TagRow = {
  id: number;
  name: string;
  slug: string;
  count?: number; // count of articles using tag
};

let cachedTags: { data: TagRow[]; expiry: number } | null = null;
export function clearTagsCache() {
  cachedTags = null;
}

let cachedCategories: { data: CategoryRow[]; expiry: number } | null = null;
export function clearCategoriesCache() {
  cachedCategories = null;
}

// --- Category Functions ---

export const getCategories = createServerFn({ method: "GET" })
  .validator((data?: { q?: string }) => data ?? {})
  .handler(async ({ data }): Promise<CategoryRow[]> => {
    try {
      const q = data?.q ? `%${data.q}%` : null;
      if (!q && cachedCategories && cachedCategories.expiry > Date.now()) {
        return cachedCategories.data;
      }

      let sql = `
        SELECT c.*, COUNT(a.id) as count 
        FROM categories c 
        LEFT JOIN articles a ON (
          c.name = a.category OR 
          a.category LIKE CONCAT(c.name, ',%') OR 
          a.category LIKE CONCAT('%, ', c.name) OR 
          a.category LIKE CONCAT('%, ', c.name, ',%') OR
          a.category LIKE CONCAT('%,', c.name) OR 
          a.category LIKE CONCAT('%,', c.name, ',%')
        ) AND a.status = 'Published'
      `;
      const params: any[] = [];
      if (q) {
        sql += " WHERE c.name LIKE ? OR c.description LIKE ?";
        params.push(q, q);
      }
      sql += " GROUP BY c.id ORDER BY c.sort_order ASC, c.name ASC";

      const rows = await query(sql, params);
      if (!Array.isArray(rows)) return [];
      const mapped = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description || "",
        metaTitle: r.meta_title || "",
        metaDescription: r.meta_description || "",
        showInHeader: Boolean(r.show_in_header),
        sortOrder: Number(r.sort_order || 0),
        redirectUrl: r.redirect_url || null,
        count: Number(r.count || 0),
      }));

      if (!q) {
        cachedCategories = {
          data: mapped,
          expiry: Date.now() + 60 * 1000,
        };
      }

      return mapped;
    } catch (err: any) {
      console.warn("[getCategories] Query warning:", err?.message || err);
      return [];
    }
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: any) => data)
  .handler(async ({ data }): Promise<CategoryRow> => {
    clearTagsCache();
    clearCategoriesCache();
    const c = data;
    const slug = c.slug || slugify(c.name);
    const sortOrder = c.sortOrder || 0;
    const redirectUrl = c.redirectUrl ? c.redirectUrl.trim() : null;

    if (c.id && c.id < 1000000) {
      try {
        await query(
          `UPDATE categories 
           SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ?, show_in_header = ?, sort_order = ?, redirect_url = ?
           WHERE id = ?`,
          [
            c.name,
            slug,
            c.description || "",
            c.metaTitle || "",
            c.metaDescription || "",
            c.showInHeader ? 1 : 0,
            sortOrder,
            redirectUrl,
            c.id,
          ],
        );
      } catch (err: any) {
        if (err.message && err.message.includes("redirect_url")) {
          await query(
            `UPDATE categories 
             SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ?, show_in_header = ?, sort_order = ?
             WHERE id = ?`,
            [
              c.name,
              slug,
              c.description || "",
              c.metaTitle || "",
              c.metaDescription || "",
              c.showInHeader ? 1 : 0,
              sortOrder,
              c.id,
            ],
          );
        } else {
          throw err;
        }
      }
      return { ...c, slug, redirectUrl };
    } else {
      let res: any;
      try {
        res = await query(
          `INSERT INTO categories (name, slug, description, meta_title, meta_description, show_in_header, sort_order, redirect_url) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.name,
            slug,
            c.description || "",
            c.metaTitle || "",
            c.metaDescription || "",
            c.showInHeader ? 1 : 0,
            sortOrder,
            redirectUrl,
          ],
        );
      } catch (err: any) {
        if (err.message && err.message.includes("redirect_url")) {
          res = await query(
            `INSERT INTO categories (name, slug, description, meta_title, meta_description, show_in_header, sort_order) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              c.name,
              slug,
              c.description || "",
              c.metaTitle || "",
              c.metaDescription || "",
              c.showInHeader ? 1 : 0,
              sortOrder,
            ],
          );
        } else {
          throw err;
        }
      }
      return { ...c, slug, redirectUrl, id: res.insertId };
    }
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    clearTagsCache();
    clearCategoriesCache();
    await query("DELETE FROM categories WHERE id = ?", [id]);
    return { success: true };
  });

export const importCategories = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((cats: any[]) => cats)
  .handler(async ({ data: cats }) => {
    clearTagsCache();
    clearCategoriesCache();

    if (!cats || cats.length === 0) return { success: true };
    for (const c of cats) {
      if (!c.name) continue;
      const finalSlug = c.slug || slugify(c.name);
      const sortOrder = c.sortOrder || 0;
      const existing = await query("SELECT id FROM categories WHERE id = ? OR slug = ?", [
        c.id || 0,
        finalSlug,
      ]);

      if (existing.length > 0) {
        const idToUpdate = existing[0].id;
        await query(
          `UPDATE categories SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ?, show_in_header = ?, sort_order = ? WHERE id = ?`,
          [
            c.name,
            finalSlug,
            c.description || "",
            c.metaTitle || "",
            c.metaDescription || "",
            c.showInHeader ? 1 : 0,
            sortOrder,
            idToUpdate,
          ],
        );
      } else {
        await query(
          `INSERT INTO categories (name, slug, description, meta_title, meta_description, show_in_header, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            c.name,
            finalSlug,
            c.description || "",
            c.metaTitle || "",
            c.metaDescription || "",
            c.showInHeader ? 1 : 0,
            sortOrder,
          ],
        );
      }
    }
    return { success: true };
  });

// --- Tag Functions ---

export const getTags = createServerFn({ method: "GET" }).handler(async (): Promise<TagRow[]> => {
  if (cachedTags && cachedTags.expiry > Date.now()) {
    return cachedTags.data;
  }
  try {
    const tags = await query("SELECT * FROM tags ORDER BY name ASC");
    if (!Array.isArray(tags)) return [];

    let articles: any[] = [];
    try {
      articles = await query(
        "SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL",
      );
    } catch {
      articles = [];
    }

    // Count tags
    const counts = new Map<string, number>();
    if (Array.isArray(articles)) {
      articles.forEach((a: any) => {
        if (typeof a?.tags === "string") {
          const list = a.tags.split(",").map((t: string) => t.trim().toLowerCase());
          list.forEach((t: string) => {
            counts.set(t, (counts.get(t) || 0) + 1);
          });
        }
      });
    }

    const mapped: TagRow[] = tags.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      count: counts.get(r.name?.toLowerCase?.() || "") || 0,
    }));

    cachedTags = {
      data: mapped,
      expiry: Date.now() + 60 * 1000,
    };

    return mapped;
  } catch (err: any) {
    console.warn("[getTags] Query warning:", err?.message || err);
    return [];
  }
});

export const saveTag = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: any) => data)
  .handler(async ({ data }): Promise<TagRow> => {
    clearTagsCache();
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
  .middleware([requireAdmin])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    clearTagsCache();
    await query("DELETE FROM tags WHERE id = ?", [id]);
    return { success: true };
  });

export const importTags = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((tags: any[]) => tags)
  .handler(async ({ data: tags }) => {
    clearTagsCache();
    if (!tags || tags.length === 0) return { success: true };
    for (const t of tags) {
      if (!t.name) continue;
      const finalSlug = t.slug || slugify(t.name);
      const existing = await query("SELECT id FROM tags WHERE id = ? OR slug = ?", [
        t.id || 0,
        finalSlug,
      ]);

      if (existing.length > 0) {
        const idToUpdate = existing[0].id;
        await query("UPDATE tags SET name = ?, slug = ? WHERE id = ?", [
          t.name,
          finalSlug,
          idToUpdate,
        ]);
      } else {
        await query("INSERT INTO tags (name, slug) VALUES (?, ?)", [t.name, finalSlug]);
      }
    }
    return { success: true };
  });

export const getCategoryData = createServerFn({ method: "GET" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const rawSlug = typeof data === "string" ? data : data?.slug || "";
      const page = typeof data === "object" && Number(data?.page) > 0 ? Number(data.page) : 1;
      const limit = typeof data === "object" && Number(data?.limit) > 0 ? Number(data.limit) : 10;
      const offset = (page - 1) * limit;

      let decodedSlug = rawSlug;
      try {
        decodedSlug = decodeURIComponent(rawSlug);
      } catch (_) {}

      // Match by slug or name (supports both English and Unicode/Bengali names and custom slugs)
      const catRows = await query(
        "SELECT * FROM categories WHERE slug = ? OR slug = ? OR name = ? OR name = ? LIMIT 1",
        [decodedSlug, rawSlug, decodedSlug, rawSlug],
      );
      let cat = null;
      if (Array.isArray(catRows) && catRows.length > 0) {
        cat = catRows[0];
      } else if (
        decodedSlug.toLowerCase() === "uncategorized" ||
        rawSlug.toLowerCase() === "uncategorized"
      ) {
        cat = {
          id: 0,
          name: "Uncategorized",
          slug: "uncategorized",
          description: "Archive of uncategorized articles.",
          meta_title: "Uncategorized Articles",
          meta_description: "Archive of uncategorized articles.",
          show_in_header: 0,
          sort_order: 999,
        };
      }
      if (!cat) return null;

      const catWhere = `(
        category = ? OR category = ? OR
        category LIKE ? OR category LIKE ? OR
        category LIKE ? OR category LIKE ? OR
        category LIKE ? OR category LIKE ? OR
        category LIKE ? OR category LIKE ?
      ) AND status = 'Published' AND date <= NOW()`;

      const catParams = [
        cat.name, cat.slug,
        `${cat.name},%`, `${cat.slug},%`,
        `%, ${cat.name}`, `%, ${cat.slug}`,
        `%, ${cat.name},%`, `%, ${cat.slug},%`,
        `%,${cat.name},%`, `%,${cat.slug},%`,
      ];

      const [countRes, articles, latestRows] = await Promise.all([
        query(`SELECT COUNT(*) as total FROM articles WHERE ${catWhere}`, catParams),
        query(
          `SELECT * FROM articles WHERE ${catWhere} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,
          [...catParams, limit, offset],
        ),
        query(
          `SELECT * FROM articles WHERE ${catWhere} ORDER BY date DESC, id DESC LIMIT 5`,
          catParams,
        ),
      ]);

      const total = Number(countRes?.[0]?.total || 0);
      const totalPages = Math.max(1, Math.ceil(total / limit));

      const mapped = (Array.isArray(articles) ? articles : []).map((r: any) => ({
        ...r,
        featured: Boolean(r.featured),
      }));

      const featured = (page === 1 ? mapped.slice(0, 3) : []).map((a: any) => ({
        title: a.title,
        excerpt: a.excerpt,
        date: new Date(a.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        img: a.featuredImage,
        tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [cat.name],
        slug: a.slug,
        views: a.views,
        author: a.author || "Newsroom",
        kickers: a.tags
          ? a.tags
              .split(",")
              .map((t: string) => t.trim())
              .slice(0, 2)
          : [cat.name],
      }));

      const listSource = page === 1 ? mapped.slice(3) : mapped;

      const list = listSource.map((a: any) => ({
        title: a.title,
        excerpt: a.excerpt,
        date: new Date(a.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        img: a.featuredImage,
        tags: a.tags ? a.tags.split(",").map((t: string) => t.trim()) : [cat.name],
        slug: a.slug,
        views: a.views,
        author: a.author || "Newsroom",
      }));

      const latest = (Array.isArray(latestRows) ? latestRows : []).map((a: any) => ({
        title: a.title,
        date: new Date(a.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
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
          redirectUrl: cat.redirect_url || null,
        },
        featured,
        list,
        latest,
        total,
        totalPages,
        page,
      };
    } catch (err: any) {
      console.warn("[getCategoryData] Query warning:", err?.message || err);
      return null;
    }
  });

export const getTopTags = createServerFn({ method: "GET" }).handler(async (): Promise<string[]> => {
  try {
    const rows = await query(
      "SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL AND tags != '' ORDER BY date DESC LIMIT 60",
    );
    const set = new Set<string>();
    for (const r of rows) {
      if (!r.tags) continue;
      const parts = r.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      for (const p of parts) {
        // Capitalize first letter cleanly
        const formatted = p.charAt(0).toUpperCase() + p.slice(1);
        set.add(formatted);
        if (set.size >= 10) break;
      }
      if (set.size >= 10) break;
    }
    const fallback = [
      "Infrastructure",
      "Trade",
      "Governance",
      "Healthcare",
      "Economy",
      "Finance",
      "Space",
      "Tech",
      "Sports",
      "Culture",
    ];
    for (const f of fallback) {
      if (set.size >= 10) break;
      set.add(f);
    }
    return Array.from(set).slice(0, 10);
  } catch (err) {
    console.error("[MySQL] Error fetching top tags:", err);
    return [
      "Infrastructure",
      "Trade",
      "Governance",
      "Healthcare",
      "Economy",
      "Finance",
      "Space",
      "Tech",
      "Sports",
      "Culture",
    ];
  }
});
