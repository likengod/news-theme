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
export const getRecentArticlesForCommentsFn = createServerFn({ method: "GET" })
  .middleware([requireAuth])
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

export const generateDummyCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator(
    (d: {
      publicUserIds?: string;
      articleSlug: string;
      count: number;
      positivity: number;
      language: string;
      customPrompt?: string;
      allowSlang?: boolean;
    }) => d,
  )
  .handler(async ({ data }) => {
    const { publicUserIds, articleSlug, count, positivity, language, customPrompt, allowSlang } =
      data;

    // 1. Validate / retrieve Profiles
    const rawIds = (publicUserIds || "").split(",").map((s) => s.trim()).filter(Boolean);
    let profiles: any[] = [];
    if (rawIds.length > 0) {
      const placeholders = rawIds.map(() => "?").join(",");
      profiles = await query(
        `SELECT public_user_id, display_name, email FROM profiles WHERE public_user_id IN (${placeholders})`,
        rawIds,
      );
    }

    // If no public IDs provided or not found, automatically pick random existing users from DB
    if (profiles.length === 0) {
      profiles = await query(
        "SELECT public_user_id, display_name, email FROM profiles ORDER BY RAND() LIMIT 25",
      );
    }

    if (profiles.length === 0) {
      profiles = [
        { public_user_id: "1000000001", display_name: "Debabrata Roy", email: "user1@example.com" },
        { public_user_id: "1000000002", display_name: "Subrata Debnath", email: "user2@example.com" },
        { public_user_id: "1000000003", display_name: "Priyanka Saha", email: "user3@example.com" },
        { public_user_id: "1000000004", display_name: "Animesh Bhowmik", email: "user4@example.com" },
        { public_user_id: "1000000005", display_name: "Raju Sarkar", email: "user5@example.com" },
      ];
    }

    // 2. Validate Article
    let finalSlug = (articleSlug || "").trim();
    try {
      if (finalSlug.includes("/")) {
        const parts = finalSlug.split("/").filter(Boolean);
        finalSlug = parts[parts.length - 1];
      }
    } catch (e) {}

    const articles = await query("SELECT title FROM articles WHERE slug = ?", [finalSlug]);
    if (articles.length === 0) {
      throw new Error("Article not found for that slug or link.");
    }
    const article = articles[0];

    // 3. Generate Comments via AI
    const settings = await getSiteSettingsServer();
    if (!settings.geminiApiKey) {
      throw new Error("Gemini API Key is not configured in Site Settings.");
    }

    const posRatio = Math.min(Math.max(positivity, 0), 100);
    const negRatio = 100 - posRatio;

    // Language instructions
    let languageInstruction = "";
    if (language === "random_mix" || language.toLowerCase().includes("mix")) {
      languageInstruction = `
- Language & Linguistic Variety (MANDATORY VARIATION):
  Randomly and naturally vary the languages and dialects across the ${count} comments so they read 100% genuine, like real readers in Tripura / Northeast India:
  * Style 1 (Tripura Spoken Bengali in Bengali script): Natural spoken Bengali as used in Agartala and across Tripura (e.g., "দারুণ খবর!", "কাজটা ঠিকমতো হলে সাধারণ মানুষের খুব উপকার হবে।", "প্রশাসনের নজর দেওয়া উচিত যাতে দ্রুত শেষ হয়।").
  * Style 2 (Banglish - Bengali in Roman English alphabet): Real casual Banglish (e.g., "Khub bhalo udyog, kintu somoy moto shesh kora dorkar bhai", "Sotti kotha bolte ki, ground reality r ekta checking dorkar", "Agartala te aro emon step dorkar").
  * Style 3 (Local Indian English): Natural Indian news reader reaction (e.g., "Good step by authorities, hope it gets completed on ground.", "Very much needed for our state.", "Strict action should be taken against negligent staff.").
  * Style 4 (Code-mixed Bangla + English): Organic mix of Bengali and English words (e.g., "Ei project-ta complete hole road traffic er problem onek kome jabe", "Govt er kache request promptly action nin").
  * Distribute the comments randomly across these styles so every comment feels unique and distinct!`;
    } else if (language === "Banglish") {
      languageInstruction = `- Language: Strictly Banglish (Bengali words written in Roman English alphabet, e.g., "Khub bhalo udyog", "Emon step aro dorkar", "Ki bolbo ar shotti shobar egiye asha dorkar").`;
    } else if (language === "Bengali") {
      languageInstruction = `- Language: Written in Bengali script with natural spoken Tripura/Bengal phrasing.`;
    } else if (language === "English") {
      languageInstruction = `- Language: Indian English as spoken by real daily news readers.`;
    } else if (language === "CodeMixed") {
      languageInstruction = `- Language: Code-mixed Bengali and English (e.g., "Ei decision-ta ekdom accurate", "Police administration ke salute").`;
    } else {
      languageInstruction = `- Language: ${language}.`;
    }

    const slangInstruction = allowSlang
      ? `
- AUTHENTIC TRIPURA STREET SLANG & CASUAL EXPLOITATION (FOR CRITICAL / QUESTIONING COMMENTS):
  When generating critical, questioning, or annoyed comments, make them sound 100% authentic, passionate, and raw, like real frustrated citizens commenting on Tripura Facebook pages & local portals.
  * Naturally incorporate authentic local mild scolding, street venting, and Tripura/East Bengal dialect words:
    - Casual venting & annoyance words: 'বালের / বাল' (e.g. "বালের রাস্তা", "বালের কাম", "কি বাল করতাছে প্রশাসন", "kono baler kam oitase na"), 'ধুর ছাই / ধুর' (e.g. "ধুর ছাই, আর ভালো লাগে না"), 'আরেহ / আরে দূর'.
    - Scolding & sharp reactions: 'ফাইজলামি' (e.g. "ফাইজলামি বন্ধ করুক", "faizlami suru korse"), 'আবাইল্লা / আবাল' (e.g. "আবাইল্লা পাবলিক না আমরা", "abailya public"), 'খচ্চর' (e.g. "খচ্চর ঠিকাদার / দালাল"), 'বাউড়া', 'ছ্যাঁচড়া', 'তেঁড়ামি / ত্যাঁড়ামি', 'ফকিন্নির পুত / ফকিন্নির পো'.
    - Local Tripura & Sylheti dialect terms: 'কিতা অইতাছে / কিতা অইছে' (কি হচ্ছে), 'কিতা কস / কিতা করতাছইন', 'কাম অইছে না', 'হুনো / হুনছ নি', 'কইতাম নি', 'গেছইন / আইছইন'.
  * Distribute these expressions naturally among the critical comments so they sound completely genuine, realistic, and unscripted.`
      : `
- Critical Comments Tone:
  Express genuine citizen concerns, questions, and skepticism constructively and sharply.`;

    const customPromptInstruction =
      customPrompt && customPrompt.trim()
        ? `
- Admin Custom Focus Instructions & Keywords (MANDATORY):
  "${customPrompt.trim()}".
  Incorporate these specific focus words, themes, questions, or sentiments naturally into the comments across different reader perspectives.`
        : "";

    const prompt = `You are generating realistic reader comments for a news portal in Tripura (Northeast India) on an article titled "${article.title}".
Generate exactly ${count} distinct, completely human-sounding reader comments.

Rules:
${languageInstruction}
${slangInstruction}
- Tone / Sentiment Distribution:
  Approximately ${posRatio}% of comments should be positive, appreciative, or supportive.
  Approximately ${negRatio}% should be skeptical, questioning, raising concerns, or critical.
- Realism:
  * Comments must sound like REAL social media / news portal users: brief, direct, emotional, sometimes using emojis (👏, 👍, 🙏, 💔, 😡).
  * Length: 1 to 3 sentences max (some short like "Ekdom thik kotha!", some 2 sentences with genuine thoughts).
  * NEVER sound like an AI assistant, essay, or corporate spokesperson. Avoid robotic lines like "I agree with the author's analysis".
${customPromptInstruction}

Format Requirement:
Return ONLY a valid JSON array of strings, e.g. ["Comment 1", "Comment 2"]. No markdown fences, no backticks, no explanatory text.`;

    let generatedComments: string[] = [];
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      };

      const modelsToTry = [
        {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}`,
        },
        {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}`,
        },
        {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.geminiApiKey}`,
        },
      ];

      const triedErrors: string[] = [];
      let resData: any = null;

      for (const model of modelsToTry) {
        const modelName = model.url.split("/models/")[1].split(":")[0];
        try {
          const res = await fetch(model.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
            resData = data;
            break;
          }
          triedErrors.push(`${modelName}: ${data.error?.message || res.statusText}`);
        } catch (fetchErr: any) {
          triedErrors.push(`${modelName}: ${fetchErr.message}`);
        }
      }

      if (!resData) throw new Error("All AI models failed. Errors: " + triedErrors.join(" | "));

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
      if (typeof commentBody !== "string" || !commentBody.trim()) continue;

      // Pick a random profile from the pool
      const profile = profiles[Math.floor(Math.random() * profiles.length)];

      await query(
        "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          finalSlug,
          article.title,
          profile.display_name || "Tripura Reader",
          profile.email || "reader@todaytripura.com",
          commentBody.substring(0, 1000).trim(),
          "Approved",
        ],
      );
      inserted++;
    }

    return { success: true, count: inserted };
  });
