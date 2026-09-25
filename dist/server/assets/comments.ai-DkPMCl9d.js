import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { r as getSiteSettingsServer } from "./site-settings-TC6eL9IL.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/comments.ai.ts?tss-serverfn-split
function toMysqlDatetime(date) {
	const pad = (n) => n < 10 ? "0" + n : n;
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function generateStaggeredDates(count, timeSpread = "past_3_days", baseStartTime) {
	const now = Date.now();
	if (timeSpread === "just_now") return Array.from({ length: count }, () => /* @__PURE__ */ new Date());
	let maxMinutes = 4320;
	let minAgeMs = 180 * 1e3;
	if (timeSpread === "past_30_mins") {
		maxMinutes = 30;
		minAgeMs = 60 * 1e3;
	} else if (timeSpread === "past_1_hour") {
		maxMinutes = 60;
		minAgeMs = 120 * 1e3;
	} else if (timeSpread === "past_2_hours") {
		maxMinutes = 120;
		minAgeMs = 180 * 1e3;
	} else if (timeSpread === "past_6_hours") {
		maxMinutes = 360;
		minAgeMs = 300 * 1e3;
	} else if (timeSpread === "past_12_hours") {
		maxMinutes = 720;
		minAgeMs = 300 * 1e3;
	} else if (timeSpread === "past_24_hours") {
		maxMinutes = 1440;
		minAgeMs = 300 * 1e3;
	} else if (timeSpread === "past_3_days") {
		maxMinutes = 4320;
		minAgeMs = 600 * 1e3;
	} else if (timeSpread === "past_7_days") {
		maxMinutes = 10080;
		minAgeMs = 900 * 1e3;
	} else if (timeSpread === "past_30_days") {
		maxMinutes = 720 * 60;
		minAgeMs = 1800 * 1e3;
	}
	const startMs = baseStartTime ? baseStartTime.getTime() + 120 * 1e3 : now - maxMinutes * 60 * 1e3;
	const effectiveStart = Math.min(startMs, now - minAgeMs);
	const availableSpan = Math.max(120 * 1e3, now - minAgeMs - effectiveStart);
	const timestamps = [];
	for (let i = 0; i < count; i++) {
		const stepRatio = count <= 1 ? .5 : i / (count - 1);
		const maxJitter = availableSpan / Math.max(1, count * 1.4);
		const jitter = (Math.random() - .5) * maxJitter;
		const offset = availableSpan * stepRatio + jitter;
		const t = Math.min(now - minAgeMs, Math.max(effectiveStart, effectiveStart + offset));
		timestamps.push(t);
	}
	timestamps.sort((a, b) => a - b);
	return timestamps.map((t) => new Date(t));
}
var generateDummyCommentsFn_createServerFn_handler = createServerRpc({
	id: "3f45f09c0a8c44c2e7fec139cc3fdb27d935e1757387119c458a56c601a5a3f0",
	name: "generateDummyCommentsFn",
	filename: "src/lib/comments.ai.ts"
}, (opts) => generateDummyCommentsFn.__executeServer(opts));
var generateDummyCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generateDummyCommentsFn_createServerFn_handler, async ({ data }) => {
	const { publicUserIds, articleSlug, count, positivity, language, customPrompt, allowSlang, timeSpread = "past_3_days", includeReplies = false, replyCount = 1, replyToCommentId = null } = data;
	const rawIds = (publicUserIds || "").split(",").map((s) => s.trim()).filter(Boolean);
	let profiles = [];
	if (rawIds.length > 0) profiles = await query(`SELECT public_user_id, display_name, email FROM profiles WHERE public_user_id IN (${rawIds.map(() => "?").join(",")})`, rawIds);
	if (profiles.length === 0) profiles = await query("SELECT public_user_id, display_name, email FROM profiles ORDER BY RAND() LIMIT 30");
	if (profiles.length === 0) profiles = [
		{
			public_user_id: "1000000001",
			display_name: "Debabrata Roy",
			email: "user1@example.com"
		},
		{
			public_user_id: "1000000002",
			display_name: "Subrata Debnath",
			email: "user2@example.com"
		},
		{
			public_user_id: "1000000003",
			display_name: "Priyanka Saha",
			email: "user3@example.com"
		},
		{
			public_user_id: "1000000004",
			display_name: "Animesh Bhowmik",
			email: "user4@example.com"
		},
		{
			public_user_id: "1000000005",
			display_name: "Raju Sarkar",
			email: "user5@example.com"
		},
		{
			public_user_id: "1000000006",
			display_name: "Tanmoy Das",
			email: "user6@example.com"
		},
		{
			public_user_id: "1000000007",
			display_name: "Mousumi Chakraborty",
			email: "user7@example.com"
		}
	];
	let finalSlug = (articleSlug || "").trim();
	try {
		if (finalSlug.includes("/")) {
			const parts = finalSlug.split("/").filter(Boolean);
			finalSlug = parts[parts.length - 1];
		}
	} catch (e) {}
	const articles = await query("SELECT title FROM articles WHERE slug = ?", [finalSlug]);
	if (articles.length === 0) throw new Error("Article not found for that slug or link.");
	const article = articles[0];
	let parentComment = null;
	if (replyToCommentId) {
		const pRows = await query("SELECT id, user_name, body, created_at FROM comments WHERE id = ?", [replyToCommentId]);
		if (pRows.length > 0) parentComment = pRows[0];
	}
	const settings = await getSiteSettingsServer();
	const planType = (settings.licenseType || "").toLowerCase();
	if (!(planType.includes("enterprise plus") || planType.includes("enterprise+"))) throw new Error("Generate AI Comments is exclusively available on Enterprise Plus licenses. Please upgrade your license to unlock this feature.");
	if (!settings.geminiApiKey) throw new Error("Gemini API Key is not configured in Site Settings.");
	const posRatio = Math.min(Math.max(positivity, 0), 100);
	const negRatio = 100 - posRatio;
	let languageInstruction = "";
	if (language === "random_mix" || language.toLowerCase().includes("mix")) languageInstruction = `
- Language & Linguistic Variety (MANDATORY VARIATION):
  Randomly and naturally vary the languages and dialects across comments so they read 100% genuine, like real readers in Tripura / Northeast India:
  * Style 1 (Tripura Spoken Bengali in Bengali script): Natural spoken Bengali as used in Agartala and across Tripura (e.g., "দারুণ খবর!", "কাজটা ঠিকমতো হলে সাধারণ মানুষের খুব উপকার হবে।", "প্রশাসনের নজর দেওয়া উচিত যাতে দ্রুত শেষ হয়।").
  * Style 2 (Banglish - Bengali in Roman English alphabet): Real casual Banglish (e.g., "Khub bhalo udyog, kintu somoy moto shesh kora dorkar bhai", "Sotti kotha bolte ki, ground reality r ekta checking dorkar", "Agartala te aro emon step dorkar").
  * Style 3 (Local Indian English): Natural Indian news reader reaction (e.g., "Good step by authorities, hope it gets completed on ground.", "Very much needed for our state.", "Strict action should be taken against negligent staff.").
  * Style 4 (Code-mixed Bangla + English): Organic mix of Bengali and English words (e.g., "Ei project-ta complete hole road traffic er problem onek kome jabe", "Govt er kache request promptly action nin").
  * Distribute the comments randomly across these styles so every comment feels unique and distinct!`;
	else if (language === "Banglish") languageInstruction = `- Language: Strictly Banglish (Bengali words written in Roman English alphabet, e.g., "Khub bhalo udyog", "Emon step aro dorkar", "Ki bolbo ar shotti shobar egiye asha dorkar").`;
	else if (language === "Bengali") languageInstruction = `- Language: Written in Bengali script with natural spoken Tripura/Bengal phrasing.`;
	else if (language === "English") languageInstruction = `- Language: Indian English as spoken by real daily news readers.`;
	else if (language === "CodeMixed") languageInstruction = `- Language: Code-mixed Bengali and English (e.g., "Ei decision-ta ekdom accurate", "Police administration ke salute").`;
	else languageInstruction = `- Language: ${language}.`;
	const slangInstruction = allowSlang ? `
- AUTHENTIC TRIPURA STREET SLANG & CASUAL EXPLOITATION (FOR CRITICAL / QUESTIONING COMMENTS):
  When generating critical, questioning, or annoyed comments, make them sound 100% authentic, passionate, and raw, like real frustrated citizens commenting on Tripura Facebook pages & local portals.
  * Naturally incorporate authentic local mild scolding, street venting, and Tripura/East Bengal dialect words:
    - Casual venting & annoyance words: 'বালের / বাল' (e.g. "বালের রাস্তা", "বালের কাম", "কি বাল করতাছে প্রশাসন", "kono baler kam oitase na"), 'ধুর ছাই / ধুর' (e.g. "ধুর ছাই, আর ভালো লাগে না"), 'আরেহ / আরে দূর'.
    - Scolding & sharp reactions: 'ফাইজলামি' (e.g. "ফাইজলামি বন্ধ করুক", "faizlami suru korse"), 'আবাইল্লা / আবাল' (e.g. "আবাইল্লা পাবলিক না আমরা", "abailya public"), 'খচ্চর' (e.g. "খচ্চর ঠিকাদার / দালাল"), 'বাউড়া', 'ছ্যাঁচড়া', 'তেঁড়ামি / ত্যাঁড়ামি', 'ফকিন্নির পুত / ফকিন্নির পো'.
    - Local Tripura & Sylheti dialect terms: 'কিতা অইতাছে / কিতা অইছে' (কি হচ্ছে), 'কিতা কস / কিতা করতাছইন', 'কাম অইছে না', 'হুনো / হুনছ নি', 'কইতাম নি', 'গেছইন / আইছইন'.
  * Distribute these expressions naturally among the critical comments so they sound completely genuine, realistic, and unscripted.` : `
- Critical Comments Tone:
  Express genuine citizen concerns, questions, and skepticism constructively and sharply.`;
	const customPromptInstruction = customPrompt && customPrompt.trim() ? `
- Admin Custom Focus Instructions & Keywords (MANDATORY):
  "${customPrompt.trim()}".
  Incorporate these specific focus words, themes, questions, or sentiments naturally into the comments across different reader perspectives.` : "";
	let prompt = "";
	const isThreadedBulk = !parentComment && includeReplies && count >= 2;
	const targetReplyCount = isThreadedBulk ? Math.min(Math.max(1, replyCount), Math.max(1, count - 1)) : 0;
	const mainCommentCount = count - targetReplyCount;
	if (parentComment) prompt = `You are generating ${count} realistic, completely human-sounding reader replies on a Tripura news portal responding specifically to this comment by "${parentComment.user_name}":
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
	else if (isThreadedBulk) prompt = `You are generating exactly ${count} realistic reader comments for a news portal in Tripura (Northeast India) on an article titled "${article.title}".
Create an authentic, lively reader comment section with natural conversational replies between users:

STRICT COMMENT BREAKDOWN REQUIREMENT:
- Total comments to generate: EXACTLY ${count}
- Main Top-Level Comments: EXACTLY ${mainCommentCount} (these MUST have "replyToIndex": null and react directly to the news article).
- Threaded Reply Comments: EXACTLY ${targetReplyCount} (these MUST have "replyToIndex" set to the integer index of an earlier top-level comment they are replying to, e.g. index 0 or 1).
- CRITICAL: DO NOT make all comments replies! There must be exactly ${mainCommentCount} main comments and ${targetReplyCount} replies.

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
- "replyToIndex": null if this is a top-level comment, OR the 0-based integer index of an earlier comment in this array that it is replying to (strictly less than current item's index).

Example format for ${count} comments (${mainCommentCount} main + ${targetReplyCount} replies):
[
  { "text": "Khub bhalo udyog, sorkar ke dhonnobad.", "replyToIndex": null },
  { "text": "Ground reality check kora dorkar.", "replyToIndex": null },
  { "text": "Ekdom shothik kotha bolechhen dada, shomoy moto complete hole bhalo.", "replyToIndex": 0 }
]
No markdown fences, no backticks, no explanatory text.`;
	else prompt = `You are generating realistic reader comments for a news portal in Tripura (Northeast India) on an article titled "${article.title}".
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
	let rawParsed = null;
	try {
		const payload = {
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: { temperature: .9 },
			safetySettings: [
				{
					category: "HARM_CATEGORY_HARASSMENT",
					threshold: "BLOCK_NONE"
				},
				{
					category: "HARM_CATEGORY_HATE_SPEECH",
					threshold: "BLOCK_NONE"
				},
				{
					category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
					threshold: "BLOCK_NONE"
				},
				{
					category: "HARM_CATEGORY_DANGEROUS_CONTENT",
					threshold: "BLOCK_NONE"
				}
			]
		};
		const modelsToTry = [
			{ url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}` },
			{ url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}` },
			{ url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.geminiApiKey}` }
		];
		const triedErrors = [];
		let resData = null;
		for (const model of modelsToTry) {
			const modelName = model.url.split("/models/")[1].split(":")[0];
			try {
				const res = await fetch(model.url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});
				const data = await res.json();
				if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
					resData = data;
					break;
				}
				triedErrors.push(`${modelName}: ${data.error?.message || res.statusText}`);
			} catch (fetchErr) {
				triedErrors.push(`${modelName}: ${fetchErr.message}`);
			}
		}
		if (!resData) throw new Error("All AI models failed. Errors: " + triedErrors.join(" | "));
		const cleaned = (resData.candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
		rawParsed = JSON.parse(cleaned);
		if (!Array.isArray(rawParsed)) throw new Error("Invalid format returned by AI");
	} catch (err) {
		throw new Error("AI Generation failed: " + err.message);
	}
	const normalizedComments = [];
	for (let i = 0; i < rawParsed.length; i++) {
		const item = rawParsed[i];
		if (typeof item === "string") normalizedComments.push({
			text: item,
			replyToIndex: null
		});
		else if (item && typeof item.text === "string") {
			const rIdx = typeof item.replyToIndex === "number" && item.replyToIndex >= 0 && item.replyToIndex < i ? item.replyToIndex : null;
			normalizedComments.push({
				text: item.text,
				replyToIndex: rIdx
			});
		}
	}
	if (isThreadedBulk && targetReplyCount > 0) {
		let replyCountSoFar = 0;
		for (let i = 0; i < normalizedComments.length; i++) if (normalizedComments[i].replyToIndex !== null) if (replyCountSoFar < targetReplyCount) replyCountSoFar++;
		else normalizedComments[i].replyToIndex = null;
		if (replyCountSoFar < targetReplyCount) {
			for (let i = normalizedComments.length - 1; i > 0 && replyCountSoFar < targetReplyCount; i--) if (normalizedComments[i].replyToIndex === null) {
				normalizedComments[i].replyToIndex = Math.floor(Math.random() * Math.min(i, 2));
				replyCountSoFar++;
			}
		}
	} else if (!parentComment) for (const item of normalizedComments) item.replyToIndex = null;
	if (normalizedComments.length === 0) throw new Error("No comments were generated.");
	const baseDate = parentComment ? new Date(parentComment.created_at) : void 0;
	const staggeredDates = generateStaggeredDates(normalizedComments.length, timeSpread, baseDate);
	let inserted = 0;
	const insertedIdMap = {};
	for (let i = 0; i < normalizedComments.length; i++) {
		const item = normalizedComments[i];
		if (!item.text || !item.text.trim()) continue;
		const profile = profiles[Math.floor(Math.random() * profiles.length)];
		let targetParentId = null;
		if (parentComment) targetParentId = parentComment.id;
		else if (item.replyToIndex !== null && insertedIdMap[item.replyToIndex]) targetParentId = insertedIdMap[item.replyToIndex];
		let commentDate = staggeredDates[i] || /* @__PURE__ */ new Date();
		if (targetParentId && item.replyToIndex !== null && staggeredDates[item.replyToIndex]) {
			const parentDate = staggeredDates[item.replyToIndex];
			if (commentDate.getTime() <= parentDate.getTime()) {
				const replyDelayMs = timeSpread === "past_30_mins" ? (1 + Math.random() * 4) * 60 * 1e3 : timeSpread === "past_1_hour" ? (2 + Math.random() * 8) * 60 * 1e3 : timeSpread === "past_2_hours" ? (4 + Math.random() * 15) * 60 * 1e3 : (15 + Math.random() * 45) * 60 * 1e3;
				commentDate = new Date(Math.min(Date.now() - 60 * 1e3, parentDate.getTime() + replyDelayMs));
			}
		}
		const mysqlDateStr = toMysqlDatetime(commentDate);
		const insertRes = await query(`INSERT INTO comments 
         (article_slug, article_title, user_name, user_email, body, status, created_at, parent_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
			finalSlug,
			article.title,
			profile.display_name || "Tripura Reader",
			profile.email || "reader@todaytripura.com",
			item.text.substring(0, 1e3).trim(),
			"Approved",
			mysqlDateStr,
			targetParentId
		]);
		if (insertRes?.insertId) insertedIdMap[i] = insertRes.insertId;
		inserted++;
	}
	return {
		success: true,
		count: inserted
	};
});
//#endregion
export { generateDummyCommentsFn_createServerFn_handler };
