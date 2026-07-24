import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
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
  .middleware([requireAuth])
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
      filterSql += " AND (body LIKE ? OR user_name LIKE ? OR user_email LIKE ? OR article_title LIKE ?)";
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
        [...params, safeLimit, offset]
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
  .middleware([requireAuth])
  .validator((data: { id: number; status: "Pending" | "Approved" | "Spam" }) => data)
  .handler(async ({ data }) => {
    await query("UPDATE comments SET status = ? WHERE id = ?", [data.status, data.id]);
    return { success: true };
  });

// Admin only: Delete comment
export const deleteComment = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: number) => data)
  .handler(async ({ data: id }) => {
    await query("DELETE FROM comments WHERE id = ?", [id]);
    return { success: true };
  });

// Public: Get approved comments for an article
export const getArticleComments = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<CommentRow[]> => {
    const rows = await query("SELECT * FROM comments WHERE article_slug = ? AND status = 'Approved' ORDER BY created_at ASC", [slug]);
    return rows.map((r: any) => ({
      id: r.id,
      articleSlug: r.article_slug,
      articleTitle: r.article_title,
      user: r.user_name,
      email: r.user_email,
      body: r.body,
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString(),
    }));
  });

// Public: Post a new comment
export const postArticleComment = createServerFn({ method: "POST" })
  .validator((data: { articleSlug: string; articleTitle: string; name: string; email: string; body: string }) => data)
  .handler(async ({ data }) => {
    // 1. Enforce Option A validations on the server-side as well
    const SITE_NAME = "News Theme";
    const MIN_CHARACTERS = 81;
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
      throw new Error(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
    }

    if (data.body.length < MIN_CHARACTERS) {
      throw new Error(`Comment must be at least ${MIN_CHARACTERS} characters long.`);
    }

    const words = data.body.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 2);
    const counts: Record<string, number> = {};
    for (const w of words) {
      const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      if (!cleanWord) continue;
      counts[cleanWord] = (counts[cleanWord] || 0) + 1;
      if (counts[cleanWord] > 5) {
        throw new Error(`A single word cannot be repeated more than 5 times. Please submit a genuine comment.`);
      }
    }

    // 2. Insert into the database as "Approved" (auto-approved since it passed the validation checks)
    await query(
      "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)",
      [data.articleSlug, data.articleTitle, data.name, data.email, data.body, "Approved"]
    );

    return { success: true };
  });
