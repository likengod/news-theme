import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { slugify } from "./news-data";

export type ArticleRow = {
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
  access_level?: "Free" | "Premium";
};

// Admin only: list articles with server-side pagination & filtering
export const getAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .validator((data: { q?: string; category?: string; status?: string; page?: number; limit?: number }) => data)
  .handler(async ({ data }): Promise<{ rows: ArticleRow[]; total: number; totalPages: number }> => {
    const { q = "", category = "All", status = "All", page = 1, limit = 20 } = data;
    // Safety cap — never return more than 200 rows in one admin request
    const safeLimit = Math.min(Math.max(1, limit), 200);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    let filterSql = " WHERE 1=1";
    const params: any[] = [];

    if (q) {
      filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)";
      const term = `%${q}%`;
      params.push(term, term, term);
    }
    if (category && category !== "All") {
      filterSql += " AND category = ?";
      params.push(category);
    }
    if (status && status !== "All") {
      filterSql += " AND status = ?";
      params.push(status);
    }

    // Run count and data queries in parallel for speed
    const [countRes, rows] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM articles${filterSql}`, params),
      query(
        `SELECT id, title, slug, category, author, views, status, date,
                featuredImage, featured, newsType, journalistId, journalistName, access_level
         FROM articles${filterSql} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,
        [...params, safeLimit, offset]
      ),
    ]);

    const total = Number(countRes[0]?.total ?? 0);
    return {
      rows: rows.map((r: any) => ({ ...r, featured: Boolean(r.featured) })),
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  });

// Admin only: save/create article
export const saveAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: any) => data)
  .handler(async ({ data }): Promise<ArticleRow> => {
    const r = data;
    const finalSlug = r.slug || slugify(r.title);

    const checkExisting = await query("SELECT id FROM articles WHERE slug = ? AND id != ?", [finalSlug, r.id || 0]);
    let slug = finalSlug;
    if (checkExisting.length > 0) {
      slug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const fields = [
      "title", "slug", "category", "city", "state", "country", "author", "views",
      "status", "date", "excerpt", "content", "featuredImage", "ogImage",
      "metaTitle", "metaDescription", "tags", "featured", "newsType",
      "journalistId", "journalistName", "access_level"
    ];

    let formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (r.date) {
      formattedDate = String(r.date).replace('T', ' ').replace('Z', '').substring(0, 19);
    }

    const values = [
      r.title, slug, r.category, r.city, r.state, r.country, r.author, r.views || 0,
      r.status, formattedDate,
      r.excerpt, r.content, r.featuredImage, r.ogImage || r.featuredImage,
      r.metaTitle, r.metaDescription, r.tags, r.featured ? 1 : 0, r.newsType || "Standard",
      r.journalistId, r.journalistName, r.access_level || "Free"
    ];

    if (r.id) {
      // Update
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      await query(`UPDATE articles SET ${setClause} WHERE id = ?`, [...values, r.id]);
      return { ...r, slug, id: r.id };
    } else {
      // Insert
      const colNames = fields.join(", ");
      const placeHolders = fields.map(() => "?").join(", ");
      const result = await query(`INSERT INTO articles (${colNames}) VALUES (${placeHolders})`, values);
      return { ...r, slug, id: result.insertId };
    }
  });

// Admin only: delete article
export const deleteAdminArticle = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    await query("DELETE FROM articles WHERE id = ?", [id]);
    return { success: true };
  });

// Admin only: bulk delete articles
export const deleteAdminArticlesBulk = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((ids: number[]) => ids)
  .handler(async ({ data: ids }) => {
    if (ids.length === 0) return { success: true };
    const placeholders = ids.map(() => "?").join(",");
    await query(`DELETE FROM articles WHERE id IN (${placeholders})`, ids);
    return { success: true };
  });

// Admin only: get ALL articles for export
export const getAllAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async (): Promise<ArticleRow[]> => {
    const rows = await query(`
      SELECT id, title, slug, category, city, state, country, author, views, status, date,
             excerpt, content, featuredImage, ogImage, metaTitle, metaDescription, tags, featured,
             newsType, journalistId, journalistName, access_level
      FROM articles ORDER BY date DESC, id DESC
    `);
    return rows.map((r: any) => ({ ...r, featured: Boolean(r.featured) }));
  });

// Admin only: import articles
export const importAdminArticles = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((articles: any[]) => articles)
  .handler(async ({ data: articles }) => {
    if (!articles || articles.length === 0) return { success: true };

    const fields = [
      "title", "slug", "category", "city", "state", "country", "author", "views",
      "status", "date", "excerpt", "content", "featuredImage", "ogImage",
      "metaTitle", "metaDescription", "tags", "featured", "newsType",
      "journalistId", "journalistName", "access_level"
    ];

    for (const r of articles) {
      const finalSlug = r.slug || slugify(r.title);
      
      let formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      if (r.date) {
        // Handle various date formats (e.g., '2026-07-22T02:33:09.000Z' -> '2026-07-22 02:33:09')
        formattedDate = String(r.date).replace('T', ' ').replace('Z', '').substring(0, 19);
      }

      const values = [
        r.title || "Untitled", finalSlug, r.category || "General", r.city || "", r.state || "", r.country || "", r.author || "Admin", Number(r.views) || 0,
        r.status || "Draft", formattedDate,
        r.excerpt || "", r.content || "", r.featuredImage || "", r.ogImage || r.featuredImage || "",
        r.metaTitle || "", r.metaDescription || "", r.tags || "", (r.featured === "true" || r.featured === true || r.featured === 1) ? 1 : 0, r.newsType || "Standard",
        r.journalistId || "", r.journalistName || "", r.access_level || "Free"
      ];

      // Check if article with this ID or slug exists (Option A: Overwrite)
      const existing = await query("SELECT id FROM articles WHERE id = ? OR slug = ?", [r.id || 0, finalSlug]);
      
      if (existing.length > 0) {
        const idToUpdate = existing[0].id;
        const setClause = fields.map((f) => `${f} = ?`).join(", ");
        await query(`UPDATE articles SET ${setClause} WHERE id = ?`, [...values, idToUpdate]);
      } else {
        const colNames = fields.join(", ");
        const placeHolders = fields.map(() => "?").join(", ");
        await query(`INSERT INTO articles (${colNames}) VALUES (${placeHolders})`, values);
      }
    }
    return { success: true };
  });

// Public: get articles for search page
export const searchPublicArticles = createServerFn({ method: "GET" })
  .validator((data: { q?: string; category?: string; page?: number; limit?: number }) => data)
  .handler(async ({ data }) => {
    const { q = "", category = "All", page = 1, limit = 15 } = data;
    const offset = (page - 1) * limit;

    let countSql = "SELECT COUNT(*) as total FROM articles WHERE status = 'Published' AND date <= NOW()";
    let selectSql = "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW()";
    const params: any[] = [];

    let filterSql = "";
    if (q) {
      filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    if (category && category !== "All") {
      filterSql += " AND category = ?";
      params.push(category);
    }

    countSql += filterSql;
    selectSql += filterSql + " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
    
    // pagination params must be numeric
    const countRes = await query(countSql, params);
    const total = countRes[0]?.total || 0;

    const selectParams = [...params, limit, offset];
    const items = await query(selectSql, selectParams);

    return {
      items: items.map((r: any) => ({
        ...r,
        featured: Boolean(r.featured),
      })),
      total,
      totalPages: Math.ceil(total / limit)
    };
  });

// Public: get single article by slug
export const getPublicArticleBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const rows = await query("SELECT * FROM articles WHERE slug = ?", [slug]);
    if (rows.length === 0) return null;
    
    // Increment view count in background
    query("UPDATE articles SET views = views + 1 WHERE id = ?", [rows[0].id]).catch(err => {
      console.error("[MySQL] Failed to increment views:", err);
    });

    return {
      ...rows[0],
      featured: Boolean(rows[0].featured),
    };
  });

// Public: get archive/latest articles
export const getPublicArchiveArticles = createServerFn({ method: "GET" })
  .validator((data: { year?: string; month?: string; day?: string; page?: number; limit?: number }) => data)
  .handler(async ({ data }) => {
    const { year, month, day, page = 1, limit = 15 } = data;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW()";
    let countSql = "SELECT COUNT(*) as total FROM articles WHERE status = 'Published' AND date <= NOW()";
    const params: any[] = [];

    if (year) {
      sql += " AND YEAR(date) = ?";
      countSql += " AND YEAR(date) = ?";
      params.push(Number(year));
    }
    if (month) {
      sql += " AND MONTH(date) = ?";
      countSql += " AND MONTH(date) = ?";
      params.push(Number(month));
    }
    if (day) {
      sql += " AND DAY(date) = ?";
      countSql += " AND DAY(date) = ?";
      params.push(Number(day));
    }

    sql += " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
    
    const countRes = await query(countSql, params);
    const total = countRes[0]?.total || 0;

    const items = await query(sql, [...params, limit, offset]);

    return {
      items: items.map((r: any) => ({
        ...r,
        featured: Boolean(r.featured),
      })),
      total,
      totalPages: Math.ceil(total / limit)
    };
  });

const HOMEPAGE_CACHE: Record<number, { data: any; lastFetched: number; TTL: number }> = {};

// Public: get latest homepage articles (optimized lightweight payload)
export const getHomepageArticles = createServerFn({ method: "GET" })
  .validator((limit: any) => limit)
  .handler(async ({ data }) => {
    const limitNum = Math.min(Math.max(1, parseInt(data, 10) || 30), 100);
    
    const now = Date.now();
    const cache = HOMEPAGE_CACHE[limitNum];
    
    if (cache && (now - cache.lastFetched < cache.TTL)) {
      console.log(`[Cache Hit] Serving homepage articles (limit: ${limitNum})`);
      return cache.data;
    }
    
    console.log(`[Cache Miss] Fetching homepage articles from MySQL (limit: ${limitNum})`);
    const items = await query(
      `SELECT id, title, slug, category, city, state, country, author, views, status, date,
              excerpt, featuredImage, ogImage, tags, featured, newsType, journalistId, journalistName, access_level
       FROM articles 
       WHERE status = 'Published' AND date <= NOW() 
       ORDER BY date DESC, id DESC 
       LIMIT ?`,
      [limitNum]
    );
    const mapped = items.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
    }));
    
    HOMEPAGE_CACHE[limitNum] = {
      data: mapped,
      lastFetched: now,
      TTL: 60 * 1000 // 60 seconds
    };
    
    return mapped;
  });

// Admin: get dashboard statistics
export const getAdminDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const [articlesCount] = await query("SELECT COUNT(*) as count FROM articles");
    const [viewsCount] = await query("SELECT COALESCE(SUM(views), 0) as count FROM articles");
    const [usersCount] = await query("SELECT COUNT(*) as count FROM users");

    let commentsCount = 0;
    try {
      const [rows] = await query("SELECT COUNT(*) as count FROM comments");
      commentsCount = rows?.count || 0;
    } catch (e) {
      commentsCount = 0;
    }

    const recentArticles = await query(`
      SELECT title, category, views, date, featuredImage 
      FROM articles 
      ORDER BY date DESC, id DESC 
      LIMIT 6
    `);

    const categoryStats = await query(`
      SELECT category as name, COUNT(*) as count 
      FROM articles 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 6
    `);

    return {
      totalArticles: articlesCount?.count || 0,
      totalViews: Number(viewsCount?.count) || 0,
      totalUsers: usersCount?.count || 0,
      totalComments: commentsCount,
      recentArticles: recentArticles || [],
      categoryStats: categoryStats || []
    };
  });
