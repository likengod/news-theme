import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { r as getSiteSettingsServer } from "./site-settings-DsincBO4.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/comments.ai.ts?tss-serverfn-split
var generateDummyCommentsFn_createServerFn_handler = createServerRpc({
	id: "3f45f09c0a8c44c2e7fec139cc3fdb27d935e1757387119c458a56c601a5a3f0",
	name: "generateDummyCommentsFn",
	filename: "src/lib/comments.ai.ts"
}, (opts) => generateDummyCommentsFn.__executeServer(opts));
var generateDummyCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generateDummyCommentsFn_createServerFn_handler, async ({ data }) => {
	const { publicUserIds, articleSlug, count, positivity, language, customPrompt, allowSlang } = data;
	const rawIds = (publicUserIds || "").split(",").map((s) => s.trim()).filter(Boolean);
	let profiles = [];
	if (rawIds.length > 0) profiles = await query(`SELECT public_user_id, display_name, email FROM profiles WHERE public_user_id IN (${rawIds.map(() => "?").join(",")})`, rawIds);
	if (profiles.length === 0) profiles = await query("SELECT public_user_id, display_name, email FROM profiles ORDER BY RAND() LIMIT 25");
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
	const settings = await getSiteSettingsServer();
	const planType = (settings.licenseType || "").toLowerCase();
	if (!(planType.includes("enterprise plus") || planType.includes("enterprise+"))) throw new Error("Generate AI Comments is exclusively available on Enterprise Plus licenses. Please upgrade your license to unlock this feature.");
	if (!settings.geminiApiKey) throw new Error("Gemini API Key is not configured in Site Settings.");
	const posRatio = Math.min(Math.max(positivity, 0), 100);
	const negRatio = 100 - posRatio;
	let languageInstruction = "";
	if (language === "random_mix" || language.toLowerCase().includes("mix")) languageInstruction = `
- Language & Linguistic Variety (MANDATORY VARIATION):
  Randomly and naturally vary the languages and dialects across the ${count} comments so they read 100% genuine, like real readers in Tripura / Northeast India:
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
	let generatedComments = [];
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
		generatedComments = JSON.parse(cleaned);
		if (!Array.isArray(generatedComments)) throw new Error("Invalid format returned by AI");
	} catch (err) {
		throw new Error("AI Generation failed: " + err.message);
	}
	let inserted = 0;
	for (const commentBody of generatedComments) {
		if (typeof commentBody !== "string" || !commentBody.trim()) continue;
		const profile = profiles[Math.floor(Math.random() * profiles.length)];
		await query("INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)", [
			finalSlug,
			article.title,
			profile.display_name || "Tripura Reader",
			profile.email || "reader@todaytripura.com",
			commentBody.substring(0, 1e3).trim(),
			"Approved"
		]);
		inserted++;
	}
	return {
		success: true,
		count: inserted
	};
});
//#endregion
export { generateDummyCommentsFn_createServerFn_handler };

//# sourceMappingURL=comments.ai-DI0uv8w0.js.map