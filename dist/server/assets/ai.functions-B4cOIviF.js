import { i as createServerFn } from "./esm-Dova13aH.js";
import { c as getSiteSettingsServer } from "./site-content-C32CLrYw.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/ai.functions.ts?tss-serverfn-split
var generateSectionHtmlServer_createServerFn_handler = createServerRpc({
	id: "6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931",
	name: "generateSectionHtmlServer",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generateSectionHtmlServer.__executeServer(opts));
var generateSectionHtmlServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(generateSectionHtmlServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	const prompt = `You are an expert web content assistant. Generate HTML content for a webpage section based on the user's instructions.
Only return raw HTML (without markdown formatting blocks like \`\`\`html).
Do not include <html>, <body>, or <head> tags. Just the raw HTML for a section. Use standard tags like <p>, <ul>, <li>, <strong>, etc.
Avoid adding arbitrary classes unless necessary (like "list-disc pl-5" for ul).

Current Section Heading: ${data.currentHeading || "None"}
Current Content: ${data.currentBody || "None"}

User Instructions: ${data.instructions}

Updated HTML Content:`;
	let errorContext = "";
	if (settings.geminiApiKey) try {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: { temperature: .7 }
			})
		});
		if (res.ok) return ((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```html|```/g, "").trim();
		else errorContext += `Gemini failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Gemini error: ${e.message}. `;
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${settings.openAiApiKey}`
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .7
			})
		});
		if (res.ok) return ((await res.json()).choices?.[0]?.message?.content || "").replace(/```html|```/g, "").trim();
		else errorContext += `OpenAI failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `OpenAI error: ${e.message}. `;
	}
	if (settings.deepseekApiKey) try {
		const res = await fetch("https://api.deepseek.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${settings.deepseekApiKey}`
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .7
			})
		});
		if (res.ok) return ((await res.json()).choices?.[0]?.message?.content || "").replace(/```html|```/g, "").trim();
		else errorContext += `DeepSeek failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `DeepSeek error: ${e.message}. `;
	}
	if (!settings.geminiApiKey && !settings.openAiApiKey && !settings.deepseekApiKey && !settings.kimiApiKey) throw new Error("No AI API Keys configured. Please go to Settings -> Integrations to set one up.");
	throw new Error(`AI Generation failed. ${errorContext}`);
});
var generateArticleContentServer_createServerFn_handler = createServerRpc({
	id: "30e470d9ce75c446d32d1443078c1a42c7b9fcddbe926b6e51d4512c60207ae8",
	name: "generateArticleContentServer",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generateArticleContentServer.__executeServer(opts));
var generateArticleContentServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(generateArticleContentServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	const prompt = `You are an expert journalist and web content assistant. Generate a complete news article based on the provided instructions.
CRITICAL RULE: You must strictly follow the "5 Ws and H" rule. Ensure the lead paragraph clearly answers: Who, What, Where, When, Why, and How.
Writing Style: ${data.style}
  ${data.style === `5 ws` ? `CRITICAL INSTRUCTION: You MUST structure the article body explicitly using headings for each of the Five Ws and H. Literally use <h2>Who is the story about?</h2>, <h2>What happened?</h2>, <h2>When did it happen?</h2>, <h2>Where did it take place?</h2>, <h2>Why did the story occur?</h2>, and <h2>How did the events come about?</h2> followed by paragraphs of deep information for each.` : ``}

Instructions/Details:
${data.instructions}

Available Tags to choose from: ${data.availableTags.join(", ")}

Output exactly and ONLY a JSON object (without markdown \`\`\`json blocks) with the following schema:
{
  "body": "The full article content in semantic HTML format. Use standard tags like <p>, <h2>, <ul>. Do not include <html> or <body>.",
  "excerpt": "A short, compelling summary (max 200 characters).",
  "location": {
    "city": "City extracted from context or blank",
    "state": "State extracted or blank",
    "country": "Country extracted or blank"
  },
  "metaTitle": "SEO friendly meta title (max 60 chars)",
  "metaDescription": "SEO friendly meta description (max 160 chars)",
  "tags": ["tag1", "tag2"]
}`;
	let errorContext = "";
	const cleanJsonResponse = (text) => {
		let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
		try {
			return JSON.parse(cleaned);
		} catch (err) {
			throw new Error("AI returned invalid JSON.");
		}
	};
	if (settings.geminiApiKey) try {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					temperature: .7,
					responseMimeType: "application/json"
				}
			})
		});
		if (res.ok) return cleanJsonResponse((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "");
		else errorContext += `Gemini failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Gemini error: ${e.message}. `;
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${settings.openAiApiKey}`
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .7,
				response_format: { type: "json_object" }
			})
		});
		if (res.ok) return cleanJsonResponse((await res.json()).choices?.[0]?.message?.content || "");
		else errorContext += `OpenAI failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `OpenAI error: ${e.message}. `;
	}
	if (settings.deepseekApiKey) try {
		const res = await fetch("https://api.deepseek.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${settings.deepseekApiKey}`
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .7,
				response_format: { type: "json_object" }
			})
		});
		if (res.ok) return cleanJsonResponse((await res.json()).choices?.[0]?.message?.content || "");
		else errorContext += `DeepSeek failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `DeepSeek error: ${e.message}. `;
	}
	if (!settings.geminiApiKey && !settings.openAiApiKey && !settings.deepseekApiKey && !settings.kimiApiKey) throw new Error("No AI API Keys configured. Please go to Settings -> Integrations to set one up.");
	throw new Error(`AI Generation failed. ${errorContext}`);
});
//#endregion
export { generateArticleContentServer_createServerFn_handler, generateSectionHtmlServer_createServerFn_handler };
