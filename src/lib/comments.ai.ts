import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { getSiteSettingsServer } from "./site-content";

function toMysqlDatetime(date: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function generateStaggeredDates(
  count: number,
  timeSpread: string = "past_3_days",
  baseStartTime?: Date,
): Date[] {
  const now = Date.now();
  if (timeSpread === "just_now") {
    return Array.from({ length: count }, () => new Date());
  }

  let maxMinutes = 72 * 60; // default 3 days
  let minAgeMs = 3 * 60 * 1000;

  if (timeSpread === "past_30_mins") {
    maxMinutes = 30;
    minAgeMs = 1 * 60 * 1000; // at least 1 min ago
  } else if (timeSpread === "past_1_hour") {
    maxMinutes = 60;
    minAgeMs = 2 * 60 * 1000; // at least 2 mins ago
  } else if (timeSpread === "past_2_hours") {
    maxMinutes = 120;
    minAgeMs = 3 * 60 * 1000; // at least 3 mins ago
  } else if (timeSpread === "past_6_hours") {
    maxMinutes = 360;
    minAgeMs = 5 * 60 * 1000;
  } else if (timeSpread === "past_12_hours") {
    maxMinutes = 720;
    minAgeMs = 5 * 60 * 1000;
  } else if (timeSpread === "past_24_hours") {
    maxMinutes = 24 * 60;
    minAgeMs = 5 * 60 * 1000;
  } else if (timeSpread === "past_3_days") {
    maxMinutes = 72 * 60;
    minAgeMs = 10 * 60 * 1000;
  } else if (timeSpread === "past_7_days") {
    maxMinutes = 168 * 60;
    minAgeMs = 15 * 60 * 1000;
  } else if (timeSpread === "past_30_days") {
    maxMinutes = 720 * 60;
    minAgeMs = 30 * 60 * 1000;
  }

  const startMs = baseStartTime
    ? baseStartTime.getTime() + 2 * 60 * 1000
    : now - maxMinutes * 60 * 1000;
  const effectiveStart = Math.min(startMs, now - minAgeMs);
  const availableSpan = Math.max(2 * 60 * 1000, now - minAgeMs - effectiveStart);

  const timestamps: number[] = [];
  for (let i = 0; i < count; i++) {
    const stepRatio = count <= 1 ? 0.5 : i / (count - 1);
    const maxJitter = availableSpan / Math.max(1, count * 1.4);
    const jitter = (Math.random() - 0.5) * maxJitter;
    const offset = availableSpan * stepRatio + jitter;
    const t = Math.min(now - minAgeMs, Math.max(effectiveStart, effectiveStart + offset));
    timestamps.push(t);
  }

  timestamps.sort((a, b) => a - b);
  return timestamps.map((t) => new Date(t));
}

export const generateDummyCommentsFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(
    (d: {
      publicUserIds?: string;
      articleSlug: string;
      count: number;
      positivity: number;
      language: string;
      customPrompt?: string;
      allowSlang?: boolean;
      timeSpread?: string; // "past_24_hours" | "past_3_days" | "past_7_days" | "past_30_days" | "just_now"
      includeReplies?: boolean;
      replyToCommentId?: number | null;
    }) => d,
  )
  .handler(async ({ data }) => {
    const {
      publicUserIds,
      articleSlug,
      count,
      positivity,
      language,
      customPrompt,
      allowSlang,
      timeSpread = "past_3_days",
      includeReplies = false,
      replyToCommentId = null,
    } = data;

    // 1. Validate / retrieve Profiles
    const rawIds = (publicUserIds || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
        "SELECT public_user_id, display_name, email FROM profiles ORDER BY RAND() LIMIT 30",
      );
    }

    if (profiles.length === 0) {
      profiles = [
        { public_user_id: "1000000001", display_name: "Debabrata Roy", email: "user1@example.com" },
        { public_user_id: "1000000002", display_name: "Subrata Debnath", email: "user2@example.com" },
        { public_user_id: "1000000003", display_name: "Priyanka Saha", email: "user3@example.com" },
        { public_user_id: "1000000004", display_name: "Animesh Bhowmik", email: "user4@example.com" },
        { public_user_id: "1000000005", display_name: "Raju Sarkar", email: "user5@example.com" },
        { public_user_id: "1000000006", display_name: "Tanmoy Das", email: "user6@example.com" },
        { public_user_id: "1000000007", display_name: "Mousumi Chakraborty", email: "user7@example.com" },
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

    // Check if replying to an existing comment
    let parentComment: { id: number; user_name: string; body: string; created_at: Date } | null = null;
    if (replyToCommentId) {
      const pRows = await query(
        "SELECT id, user_name, body, created_at FROM comments WHERE id = ?",
        [replyToCommentId],
      );
      if (pRows.length > 0) {
        parentComment = pRows[0];
      }
    }

    // 3. Check Settings & License
    const settings = await getSiteSettingsServer();
    const planType = (settings.licenseType || "").toLowerCase();
    const isEnterprisePlus =
      planType.includes("enterprise plus") || planType.includes("enterprise+");
    if (!isEnterprisePlus) {
      throw new Error(
        "Generate AI Comments is exclusively available on Enterprise Plus licenses. Please upgrade your license to unlock this feature.",
      );
    }

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
  Randomly and naturally vary the languages and dialects across comments so they read 100% genuine, like real readers in Tripura / Northeast India:
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

    // Build the AI Prompt based on mode (Direct reply vs Threaded bulk vs Top-level)
    let prompt = "";
    const isThreadedBulk = !parentComment && includeReplies && count >= 2;

    if (parentComment) {
      prompt = `You are generating ${count} realistic, completely human-sounding reader replies on a Tripura news portal responding specifically to this comment by "${parentComment.user_name}":
"${parentComment.body}"
under the news article "${article.title}".

Replies should sound like distinct real readers directly responding, debating, agreeing, asking follow-ups, or chiming in.
Rules:
${languageInstruction}
${slangInstruction}
${customPromptInstruction}
- Length: 1 to 2 sentences max.
- Realism: Natural colloquial flow, direct tone, occasional emoji.

Format Requirement:
Return ONLY a valid JSON array of strings, e.g. ["Reply 1", "Reply 2"]. No markdown fences, no backticks, no explanatory text.`;
    } else if (isThreadedBulk) {
      prompt = `You are generating ${count} realistic reader comments for a news portal in Tripura (Northeast India) on an article titled "${article.title}".
Create an authentic, lively reader comment section with natural conversational replies between users:
- The majority of comments should be original reactions to the news article.
- Approximately 25% to 40% of comments should be natural, conversational replies to earlier comments (agreeing, debating, asking a question, or following up on what an earlier commenter said).

Rules:
${languageInstruction}
${slangInstruction}
- Tone / Sentiment Distribution:
  Approximately ${posRatio}% positive/supportive, and ${negRatio}% critical/questioning.
- Realism: Brief, emotional, direct, occasional emojis (👏, 👍, 🙏, 💔, 😡). 1 to 3 sentences max.
${customPromptInstruction}

Format Requirement:
Return ONLY a valid JSON array of objects with fields:
- "text": The comment body string
- "replyToIndex": null if this is a top-level comment, OR the 0-based integer index of an earlier comment in this array that it is replying to (MUST be strictly less than the current item's index, e.g. index 1 can reply to 0; index 3 can reply to 0 or 2).

Example format:
[
  { "text": "Khub bhalo udyog, sorkar ke dhonnobad.", "replyToIndex": null },
  { "text": "Ekdom shothik kotha bolechhen dada, shomoy moto complete hole bhalo.", "replyToIndex": 0 },
  { "text": "Ground reality check kora dorkar.", "replyToIndex": null },
  { "text": "Right, AMC er negligence er karonei delay hoy.", "replyToIndex": 2 }
]
No markdown fences, no backticks, no explanatory text.`;
    } else {
      prompt = `You are generating realistic reader comments for a news portal in Tripura (Northeast India) on an article titled "${article.title}".
Generate exactly ${count} distinct, completely human-sounding reader comments.

Rules:
${languageInstruction}
${slangInstruction}
- Tone / Sentiment Distribution:
  Approximately ${posRatio}% of comments should be positive, appreciative, or supportive.
  Approximately ${negRatio}% should be skeptical, questioning, raising concerns, or critical.
- Realism:
  * Comments must sound like REAL social media / news portal users: brief, direct, emotional, sometimes using emojis (👏, 👍, 🙏, 💔, 😡).
  * Length: 1 to 3 sentences max.
  * NEVER sound like an AI assistant or essay.
${customPromptInstruction}

Format Requirement:
Return ONLY a valid JSON array of strings, e.g. ["Comment 1", "Comment 2"]. No markdown fences, no backticks, no explanatory text.`;
    }

    let rawParsed: any = null;
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
      rawParsed = JSON.parse(cleaned);
      if (!Array.isArray(rawParsed)) {
        throw new Error("Invalid format returned by AI");
      }
    } catch (err: any) {
      throw new Error("AI Generation failed: " + err.message);
    }

    // Normalize output format to: Array of { text: string; replyToIndex: number | null }
    const normalizedComments: Array<{ text: string; replyToIndex: number | null }> = [];
    for (let i = 0; i < rawParsed.length; i++) {
      const item = rawParsed[i];
      if (typeof item === "string") {
        normalizedComments.push({ text: item, replyToIndex: null });
      } else if (item && typeof item.text === "string") {
        const rIdx =
          typeof item.replyToIndex === "number" && item.replyToIndex >= 0 && item.replyToIndex < i
            ? item.replyToIndex
            : null;
        normalizedComments.push({ text: item.text, replyToIndex: rIdx });
      }
    }

    if (normalizedComments.length === 0) {
      throw new Error("No comments were generated.");
    }

    // 4. Generate Staggered Past Timestamps ("1 day ago", "8 hours ago", etc.)
    const baseDate = parentComment ? new Date(parentComment.created_at) : undefined;
    const staggeredDates = generateStaggeredDates(
      normalizedComments.length,
      timeSpread,
      baseDate,
    );

    // 5. Insert into database with staggered timestamps & parent_id linking
    let inserted = 0;
    const insertedIdMap: Record<number, number> = {};

    for (let i = 0; i < normalizedComments.length; i++) {
      const item = normalizedComments[i];
      if (!item.text || !item.text.trim()) continue;

      // Pick a random profile from the pool (avoiding repeating the exact same profile for immediate reply)
      const profile = profiles[Math.floor(Math.random() * profiles.length)];

      // Determine parent_id:
      // A) Direct reply to an existing comment: parentComment.id
      // B) Conversational threaded reply to an earlier generated comment: insertedIdMap[item.replyToIndex]
      // C) Top-level comment: null
      let targetParentId: number | null = null;
      if (parentComment) {
        targetParentId = parentComment.id;
      } else if (item.replyToIndex !== null && insertedIdMap[item.replyToIndex]) {
        targetParentId = insertedIdMap[item.replyToIndex];
      }

      // Determine creation date:
      let commentDate = staggeredDates[i] || new Date();
      // If it's a reply to an earlier generated comment, ensure timestamp is after the parent comment
      if (targetParentId && item.replyToIndex !== null && staggeredDates[item.replyToIndex]) {
        const parentDate = staggeredDates[item.replyToIndex];
        if (commentDate.getTime() <= parentDate.getTime()) {
          const replyDelayMs =
            timeSpread === "past_30_mins"
              ? (1 + Math.random() * 4) * 60 * 1000 // 1 to 5 mins after parent
              : timeSpread === "past_1_hour"
              ? (2 + Math.random() * 8) * 60 * 1000 // 2 to 10 mins after parent
              : timeSpread === "past_2_hours"
              ? (4 + Math.random() * 15) * 60 * 1000 // 4 to 19 mins after parent
              : (15 + Math.random() * 45) * 60 * 1000;
          commentDate = new Date(Math.min(Date.now() - 60 * 1000, parentDate.getTime() + replyDelayMs));
        }
      }

      const mysqlDateStr = toMysqlDatetime(commentDate);

      const insertRes: any = await query(
        `INSERT INTO comments 
         (article_slug, article_title, user_name, user_email, body, status, created_at, parent_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalSlug,
          article.title,
          profile.display_name || "Tripura Reader",
          profile.email || "reader@todaytripura.com",
          item.text.substring(0, 1000).trim(),
          "Approved",
          mysqlDateStr,
          targetParentId,
        ],
      );

      if (insertRes?.insertId) {
        insertedIdMap[i] = insertRes.insertId;
      }
      inserted++;
    }

    return { success: true, count: inserted };
  });
