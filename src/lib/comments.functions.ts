import { createServerFn } from "@tanstack/react-start";
import { requireAuth, requireAdmin } from "@/lib/auth-middleware";
import { query } from "./db.server";

export type CommentRow = {
  id: number;
  articleSlug: string;
  articleTitle: string;
  user: string;
  email: string;
  body: string;
  status: "Pending" | "Approved" | "Spam";
  date: string;
};

// Admin only: Get comments with server-side pagination & status filtering
export const getAdminComments = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data?: { status?: string; q?: string; page?: number; limit?: number }) => data ?? {})
  .handler(async ({ data }): Promise<{ rows: CommentRow[]; total: number; totalPages: number }> => {
    const { status = "All", q = "", page = 1, limit = 20 } = data;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    let filterSql = " WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "All") {
      filterSql += " AND status = ?";
      params.push(status);
    }

    if (q) {
      filterSql +=
        " AND (body LIKE ? OR user_name LIKE ? OR user_email LIKE ? OR article_title LIKE ?)";
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }

    const [countRes, rows] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM comments${filterSql}`, params),
      query(
        `SELECT id, article_slug, article_title, user_name, user_email, body, status, created_at
         FROM comments${filterSql} 
         ORDER BY created_at DESC, id DESC 
         LIMIT ? OFFSET ?`,
        [...params, safeLimit, offset],
      ),
    ]);

    const total = Number(countRes[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    const mappedRows: CommentRow[] = rows.map((r: any) => ({
      id: r.id,
      articleSlug: r.article_slug,
      articleTitle: r.article_title,
      user: r.user_name,
      email: r.user_email,
      body: r.body,
      status: r.status,
      date: new Date(r.created_at).toISOString().slice(0, 10),
    }));

    return { rows: mappedRows, total, totalPages };
  });

// Admin only: Update comment status
export const updateCommentStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: { id: number; status: "Pending" | "Approved" | "Spam" }) => data)
  .handler(async ({ data }) => {
    await query("UPDATE comments SET status = ? WHERE id = ?", [data.status, data.id]);
    return { success: true };
  });

// Admin only: Delete comment
export const deleteComment = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: number) => data)
  .handler(async ({ data: id }) => {
    await query("DELETE FROM comments WHERE id = ?", [id]);
    return { success: true };
  });

// Admin only: Delete ALL comments permanently
export const deleteAllCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: { status?: string }) => data ?? {})
  .handler(async ({ data }) => {
    if (data.status && data.status !== "All") {
      await query("DELETE FROM comments WHERE status = ?", [data.status]);
    } else {
      await query("DELETE FROM comments", []);
    }
    const [{ count }] = await query("SELECT COUNT(*) as count FROM comments", []);
    return { success: true, remaining: count };
  });

// Admin only: Get ALL comments for CSV export
export const getAllCommentsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<CommentRow[]> => {
    const rows = await query(
      `SELECT c.id, c.article_slug, c.article_title, u.display_name AS user_name, u.email, c.body, c.status, c.created_at
       FROM comments c
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`,
      [],
    );
    return rows.map((r: any) => ({
      id: r.id,
      articleSlug: r.article_slug,
      articleTitle: r.article_title,
      user: r.user_name || "",
      email: r.email || "",
      body: r.body,
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString(),
    }));
  });

// Admin only: Import comments from CSV
export const importCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data: CommentRow[]) => data)
  .handler(async ({ data: rows }) => {
    let inserted = 0;
    for (const row of rows) {
      if (!row.body || !row.articleSlug) continue;
      const status = ["Pending", "Approved", "Spam"].includes(row.status) ? row.status : "Pending";
      await query(
        `INSERT INTO comments (article_slug, article_title, body, status, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [row.articleSlug || "", row.articleTitle || "", row.body, status],
      );
      inserted++;
    }
    return { success: true, inserted };
  });

// Public: Get approved comments for an article
export const getArticleComments = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<CommentRow[]> => {
    const rows = await query(
      "SELECT * FROM comments WHERE article_slug = ? AND status = 'Approved' ORDER BY created_at ASC",
      [slug],
    );
    return rows.map((r: any) => ({
      id: r.id,
      articleSlug: r.article_slug,
      articleTitle: r.article_title,
      user: r.user_name,
      email: r.user_email,
      body: r.body,
      status: r.status,
      parentId: r.parent_id ?? null,
      date: new Date(r.created_at).toLocaleDateString(),
    }));
  });

// Public: Post a new comment
export const postArticleComment = createServerFn({ method: "POST" })
  .validator(
    (data: {
      articleSlug: string;
      articleTitle: string;
      name: string;
      email: string;
      body: string;
      parentId?: number | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    // 1. Enforce Option A validations on the server-side as well
    const SITE_NAME = "News Theme";
    const minChars = data.parentId ? 15 : 30;
    const URL_PATTERNS = [
      /https?:\/\//i,
      /\bwww\./i,
      /<\s*\/?\s*[a-z]+/i,
      /<\s*script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /\b[\w.-]+\s*(?:\.|\[\s*dot\s*\]|\(\s*dot\s*\)|\s+dot\s+)\s*(?:com|net|org|io|co|in|gov|edu|info|biz|app|dev|xyz|me|us|uk)\b/i,
      /[\w.+-]+@[\w-]+\.[\w.-]+/i,
    ];

    const containsLink = URL_PATTERNS.some((re) => re.test(data.body));
    if (containsLink) {
      throw new Error(
        `YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`,
      );
    }

    if (data.body.length < minChars) {
      throw new Error(`${data.parentId ? "Reply" : "Comment"} must be at least ${minChars} characters long.`);
    }

    const words = data.body
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const counts: Record<string, number> = {};
    for (const w of words) {
      const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (!cleanWord) continue;
      counts[cleanWord] = (counts[cleanWord] || 0) + 1;
      if (counts[cleanWord] > 5) {
        throw new Error(
          `A single word cannot be repeated more than 5 times. Please submit a genuine comment.`,
        );
      }
    }

    // 2. Insert into the database as "Approved"
    await query(
      "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.articleSlug, data.articleTitle, data.name, data.email, data.body, "Approved", data.parentId ?? null],
    );

    return { success: true };
  });
export function extractSlugFromUrl(input: string): string {
  if (!input) return "";
  let clean = input.trim();
  clean = clean.split("?")[0].split("#")[0];
  clean = clean.replace(/\/+$/, "");
  if (clean.includes("/")) {
    const parts = clean.split("/").filter(Boolean);
    clean = parts[parts.length - 1] || clean;
  }
  try {
    clean = decodeURIComponent(clean);
  } catch {}
  return clean.trim();
}

export const lookupArticleByUrlOrSlugFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((input: string) => input)
  .handler(async ({ data: rawInput }): Promise<{
    found: boolean;
    article: { id: number; title: string; slug: string; category?: string; featuredImage?: string } | null;
  }> => {
    try {
      if (!rawInput || !rawInput.trim()) {
        return { found: false, article: null };
      }
      const cleanSlug = extractSlugFromUrl(rawInput);
      if (!cleanSlug) return { found: false, article: null };

      // 1. Direct slug match
      let rows = await query(
        "SELECT id, title, slug, category, featuredImage FROM articles WHERE slug = ? LIMIT 1",
        [cleanSlug],
      );

      // 2. ID match if numeric
      if (rows.length === 0 && !isNaN(Number(cleanSlug))) {
        rows = await query(
          "SELECT id, title, slug, category, featuredImage FROM articles WHERE id = ? LIMIT 1",
          [Number(cleanSlug)],
        );
      }

      // 3. Partial slug or title match
      if (rows.length === 0 && cleanSlug.length > 3) {
        rows = await query(
          "SELECT id, title, slug, category, featuredImage FROM articles WHERE slug LIKE ? OR title LIKE ? LIMIT 1",
          [`%${cleanSlug}%`, `%${cleanSlug}%`],
        );
      }

      if (rows.length > 0) {
        const a = rows[0];
        return {
          found: true,
          article: {
            id: a.id,
            title: a.title,
            slug: a.slug,
            category: a.category || "General",
            featuredImage: a.featuredImage || "",
          },
        };
      }

      return { found: false, article: null };
    } catch (err: any) {
      console.error("[lookupArticleByUrlOrSlugFn] error:", err);
      return { found: false, article: null };
    }
  });

export const getRecentArticlesForCommentsFn = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<{ id: number; title: string; slug: string }[]> => {
    try {
      const rows = await query(
        "SELECT id, title, slug FROM articles ORDER BY id DESC LIMIT 50",
      );
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
      }));
    } catch {
      return [];
    }
  });

// Re-export AI dummy comments generator from dedicated AI module
export { generateDummyCommentsFn } from "./comments.ai";

