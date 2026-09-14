import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { getSiteSettingsServer } from "./site-content";

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

// Admin only: Delete ALL comments permanently
export const deleteAllCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAuth])
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
  .middleware([requireAuth])
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
  .middleware([requireAuth])
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
    }) => data,
  )
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
      throw new Error(
        `YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`,
      );
    }

    if (data.body.length < MIN_CHARACTERS) {
      throw new Error(`Comment must be at least ${MIN_CHARACTERS} characters long.`);
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

    // 2. Insert into the database as "Approved" (auto-approved since it passed the validation checks)
    await query(
      "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)",
      [data.articleSlug, data.articleTitle, data.name, data.email, data.body, "Approved"],
    );

    return { success: true };
  });
export const generateDummyCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d: { publicUserIds: string; articleSlug: string; count: number; positivity: number; language: string }) => d)
  .handler(async ({ data }) => {
    const { publicUserIds, articleSlug, count, positivity, language } = data;

    // 1. Validate Profile(s)
    const rawIds = publicUserIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (rawIds.length === 0) {
      throw new Error("No valid Public IDs provided.");
    }
    
    // Fetch profiles in one query
    const placeholders = rawIds.map(() => "?").join(",");
    const profiles = await query(`SELECT public_user_id, display_name, email FROM profiles WHERE public_user_id IN (${placeholders})`, rawIds);
    
    if (profiles.length === 0) {
      throw new Error("None of the provided Public IDs were found.");
    }

    // 2. Validate Article
    let finalSlug = articleSlug;
    try {
      if (finalSlug.includes("/")) {
        const parts = finalSlug.split("/");
        finalSlug = parts[parts.length - 1] || parts[parts.length - 2];
      }
    } catch (e) {}

    const articles = await query("SELECT title FROM articles WHERE slug = ?", [finalSlug]);
    if (articles.length === 0) {
      throw new Error("Article not found for that slug/link.");
    }
    const article = articles[0];

    // 3. Generate Comments via AI
    const settings = await getSiteSettingsServer();
    if (!settings.geminiApiKey) {
      throw new Error("Gemini API Key is not configured in Site Settings.");
    }

    const posRatio = Math.min(Math.max(positivity, 0), 100);
    const negRatio = 100 - posRatio;

    const prompt = `Generate exactly ${count} distinct, realistic reader comments for a news article titled "${article.title}". 
    Constraints:
    - Language: Must be strictly written in ${language}.
    - Tone/Sentiment Ratio: Approximately ${posRatio}% of the comments should be positive/agreeing, and ${negRatio}% should be negative, questioning, or critical.
    - Length: Vary between 1 to 3 sentences.
    - Format: Return ONLY a valid JSON array of strings. Do not include markdown blocks or any other text.`;

    let generatedComments: string[] = [];
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8 },
      };

      // Try models in order until one works
      const modelsToTry = [
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}` },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}` },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${settings.geminiApiKey}` },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${settings.geminiApiKey}` },
      ];

      const triedErrors: string[] = [];
      let resData: any = null;

      for (const model of modelsToTry) {
        const modelName = model.url.split("/models/")[1].split(":")[0];
        const res = await fetch(model.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          resData = data;
          break;
        }
        triedErrors.push(`${modelName}: ${data.error?.message || res.statusText}`);
      }

      if (!resData) throw new Error("All models failed. Errors: " + triedErrors.join(" | "));

      const text = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      generatedComments = JSON.parse(cleaned);
      if (!Array.isArray(generatedComments)) {
        throw new Error("Invalid format returned by AI");
      }
    } catch (err: any) {
      throw new Error("AI Generation failed: " + err.message);
    }

    // 4. Insert into database
    let inserted = 0;
    for (const commentBody of generatedComments) {
      if (typeof commentBody !== "string") continue;
      
      // Pick a random profile from the found ones
      const profile = profiles[Math.floor(Math.random() * profiles.length)];
      
      await query(
        "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)",
        [finalSlug, article.title, profile.display_name || "User", profile.email || "", commentBody.substring(0, 1000), "Approved"]
      );
      inserted++;
    }

    return { success: true, count: inserted };
  });
