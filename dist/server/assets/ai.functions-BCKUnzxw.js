import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { r as getSiteSettingsServer } from "./site-settings-J3w4WW_b.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/ai.functions.ts?tss-serverfn-split
var generateSectionHtmlServer_createServerFn_handler = createServerRpc({
	id: "6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931",
	name: "generateSectionHtmlServer",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generateSectionHtmlServer.__executeServer(opts));
var generateSectionHtmlServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generateSectionHtmlServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	if (!(settings.licenseType || "").toLowerCase().includes("enterprise")) throw new Error("AI Content Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
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
		const payload = {
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: { temperature: .7 }
		};
		let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (!res.ok) if ((await res.text()).includes("is not found")) res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		else errorContext += `Gemini failed: ${res.statusText}. `;
		if (res.ok) return ((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```html|```/g, "").trim();
		else errorContext += `Gemini fallback failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Gemini error: ${e.message}. `;
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.openAiApiKey}`
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
				Authorization: `Bearer ${settings.deepseekApiKey}`
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
var generateArticleContentServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generateArticleContentServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	const effectiveStyle = (settings.licenseType || "").toLowerCase().includes("enterprise") ? data.style || "Normal" : "Normal";
	const prompt = `You are an expert journalist and web content assistant. Generate a complete news article based on the provided instructions.
CRITICAL RULE: You must strictly follow the "5 Ws and H" rule. Ensure the lead paragraph clearly answers: Who, What, Where, When, Why, and How.
Writing Style: ${effectiveStyle}
  ${effectiveStyle === `5 ws` ? `CRITICAL INSTRUCTION: You MUST structure the article body explicitly using headings for each of the Five Ws and H. Literally use <h2>Who is the story about?</h2>, <h2>What happened?</h2>, <h2>When did it happen?</h2>, <h2>Where did it take place?</h2>, <h2>Why did the story occur?</h2>, and <h2>How did the events come about?</h2> followed by paragraphs of deep information for each.` : ``}

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
		const payload = {
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: {
				temperature: .7,
				responseMimeType: "application/json"
			}
		};
		let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (!res.ok) if ((await res.text()).includes("is not found")) res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.geminiApiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		else errorContext += `Gemini failed: ${res.statusText}. `;
		if (res.ok) return cleanJsonResponse((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "");
		else errorContext += `Gemini fallback failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Gemini error: ${e.message}. `;
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.openAiApiKey}`
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
				Authorization: `Bearer ${settings.deepseekApiKey}`
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
var generatePageSeoServer_createServerFn_handler = createServerRpc({
	id: "3cfc9da0c530c5885b434a93a6cfd05899b6dc10d8625ddd679755011d2eaf88",
	name: "generatePageSeoServer",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generatePageSeoServer.__executeServer(opts));
var generatePageSeoServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generatePageSeoServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	if (!(settings.licenseType || "").toLowerCase().includes("enterprise")) throw new Error("AI SEO Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
	if (!settings.geminiApiKey && !settings.openAiApiKey && !settings.deepseekApiKey && !settings.kimiApiKey) throw new Error("No AI API key found. Please configure your Gemini, OpenAI, or DeepSeek API key in Settings → Integrations (/admin/settings?tab=integrations).");
	const siteName = data.siteName || settings.siteName || "News Theme";
	const prompt = `You are a world-class SEO specialist and digital news editor.
Your task is to analyze the following webpage details and generate highly optimized, click-worthy, and natural search engine metadata for Google Search and discovery.

Website Name: ${siteName}
Page URL Path: /${data.pageSlug.replace(/^\/+/, "")}
Page Title: ${data.pageTitle || "Page"}
Page Intro / Summary: ${data.pageIntro || "None"}
Page Content & Sections:
${(data.pageContent || "Standard policy or information page.").slice(0, 4e3)}

STRICT REQUIREMENTS:
1. "metaTitle": A compelling, natural, high-CTR search title between 45 and 60 characters (STRICTLY MAXIMUM 60 CHARACTERS). Include branding like " — ${siteName}" if it fits comfortably within the 60-character limit.
2. "metaDescription": A concise, engaging, informative snippet that summarizes what visitors will learn or find on this page. Length MUST be between 130 and 158 characters (STRICTLY MAXIMUM 160 CHARACTERS). Do NOT end with ellipses "...".
3. "metaKeywords": 6 to 10 relevant, high-traffic, comma-separated search keywords/phrases tailored to this page's exact topic.

Return ONLY a valid JSON object (no markdown \`\`\`json block, no introductory or trailing commentary):
{
  "metaTitle": "...",
  "metaDescription": "...",
  "metaKeywords": "..."
}`;
	const cleanJsonResponse = (text) => {
		let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
		try {
			return JSON.parse(cleaned);
		} catch (err) {
			const start = cleaned.indexOf("{");
			const end = cleaned.lastIndexOf("}");
			if (start !== -1 && end !== -1 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
			throw new Error("AI returned invalid JSON.");
		}
	};
	let errorContext = "";
	if (settings.geminiApiKey) {
		const modelsToTry = [
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.geminiApiKey}`
		];
		for (const url of modelsToTry) try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: {
						temperature: .5,
						responseMimeType: "application/json"
					}
				})
			});
			if (res.ok) {
				const parsed = cleanJsonResponse((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "");
				if (parsed.metaTitle && parsed.metaDescription) return {
					metaTitle: String(parsed.metaTitle).slice(0, 60),
					metaDescription: String(parsed.metaDescription).slice(0, 160),
					metaKeywords: String(parsed.metaKeywords || "")
				};
			} else errorContext += `Gemini failed: ${res.statusText}. `;
		} catch (e) {
			errorContext += `Gemini error: ${e.message}. `;
		}
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.openAiApiKey}`
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .5,
				response_format: { type: "json_object" }
			})
		});
		if (res.ok) {
			const parsed = cleanJsonResponse((await res.json()).choices?.[0]?.message?.content || "");
			return {
				metaTitle: String(parsed.metaTitle).slice(0, 60),
				metaDescription: String(parsed.metaDescription).slice(0, 160),
				metaKeywords: String(parsed.metaKeywords || "")
			};
		} else errorContext += `OpenAI failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `OpenAI error: ${e.message}. `;
	}
	if (settings.deepseekApiKey) try {
		const res = await fetch("https://api.deepseek.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.deepseekApiKey}`
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .5,
				response_format: { type: "json_object" }
			})
		});
		if (res.ok) {
			const parsed = cleanJsonResponse((await res.json()).choices?.[0]?.message?.content || "");
			return {
				metaTitle: String(parsed.metaTitle).slice(0, 60),
				metaDescription: String(parsed.metaDescription).slice(0, 160),
				metaKeywords: String(parsed.metaKeywords || "")
			};
		} else errorContext += `DeepSeek failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `DeepSeek error: ${e.message}. `;
	}
	if (settings.kimiApiKey) try {
		const res = await fetch("https://api.moonshot.cn/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.kimiApiKey}`
			},
			body: JSON.stringify({
				model: "moonshot-v1-8k",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .5
			})
		});
		if (res.ok) {
			const parsed = cleanJsonResponse((await res.json()).choices?.[0]?.message?.content || "");
			return {
				metaTitle: String(parsed.metaTitle).slice(0, 60),
				metaDescription: String(parsed.metaDescription).slice(0, 160),
				metaKeywords: String(parsed.metaKeywords || "")
			};
		} else errorContext += `Kimi failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Kimi error: ${e.message}. `;
	}
	throw new Error(`AI Generation failed. ${errorContext || "Please check your AI API key in Settings → Integrations."}`);
});
var generateCategoryDescriptionServer_createServerFn_handler = createServerRpc({
	id: "d40db31842ef69c32ee11b885c847a349426926025e989432dc9f235693a7f8f",
	name: "generateCategoryDescriptionServer",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generateCategoryDescriptionServer.__executeServer(opts));
var generateCategoryDescriptionServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(generateCategoryDescriptionServer_createServerFn_handler, async ({ data }) => {
	const settings = await getSiteSettingsServer();
	const siteName = data.siteName || settings.siteName || "News Theme";
	const categoryName = data.categoryName.trim();
	if (!categoryName) throw new Error("Category Name is required to generate description.");
	const prompt = `You are an expert digital news editor and SEO copywriter for "${siteName}".
Generate a concise, highly engaging, and SEO-friendly description for the news category "${categoryName}".

STRICT GUIDELINES:
1. Length: Exactly 1 to 2 clear, informative sentences (around 120 to 160 characters).
2. Content: Summarize what readers and search engines can expect from this category (breaking news, verified reports, policy updates, trends, or analysis for ${categoryName}).
3. Keywords: Include natural, high-relevance search terms for "${categoryName}" news.
4. Output: Return ONLY the raw description text. Do not add quotation marks, markdown, bullet points, introductory text, or explanations.`;
	const cleanPlainText = (text) => {
		return text.replace(/^["']|["']$/g, "").replace(/```[a-z]*|```/g, "").trim();
	};
	let errorContext = "";
	if (settings.geminiApiKey) {
		const modelsToTry = [
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${settings.geminiApiKey}`,
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${settings.geminiApiKey}`
		];
		for (const url of modelsToTry) try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: { temperature: .7 }
				})
			});
			if (res.ok) {
				const text = (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || "";
				if (text.trim()) return {
					description: cleanPlainText(text),
					provider: "Gemini"
				};
			} else errorContext += `Gemini failed: ${res.statusText}. `;
		} catch (e) {
			errorContext += `Gemini error: ${e.message}. `;
		}
	}
	if (settings.openAiApiKey) try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.openAiApiKey}`
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
		if (res.ok) {
			const text = (await res.json()).choices?.[0]?.message?.content || "";
			if (text.trim()) return {
				description: cleanPlainText(text),
				provider: "OpenAI"
			};
		} else errorContext += `OpenAI failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `OpenAI error: ${e.message}. `;
	}
	if (settings.deepseekApiKey) try {
		const res = await fetch("https://api.deepseek.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.deepseekApiKey}`
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
		if (res.ok) {
			const text = (await res.json()).choices?.[0]?.message?.content || "";
			if (text.trim()) return {
				description: cleanPlainText(text),
				provider: "DeepSeek"
			};
		} else errorContext += `DeepSeek failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `DeepSeek error: ${e.message}. `;
	}
	if (settings.kimiApiKey) try {
		const res = await fetch("https://api.moonshot.cn/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${settings.kimiApiKey}`
			},
			body: JSON.stringify({
				model: "moonshot-v1-8k",
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .7
			})
		});
		if (res.ok) {
			const text = (await res.json()).choices?.[0]?.message?.content || "";
			if (text.trim()) return {
				description: cleanPlainText(text),
				provider: "Kimi"
			};
		} else errorContext += `Kimi failed: ${res.statusText}. `;
	} catch (e) {
		errorContext += `Kimi error: ${e.message}. `;
	}
	const lowerName = categoryName.toLowerCase();
	let fallbackDesc = `Comprehensive news coverage, breaking headlines, investigative reports, and in-depth analysis on ${categoryName}.`;
	if (lowerName.includes("country") || lowerName.includes("nation")) fallbackDesc = `National news, political developments, government policies, and key updates from across the country.`;
	else if (lowerName.includes("state") || lowerName.includes("local") || lowerName.includes("tripura")) fallbackDesc = `Local reporting, regional headlines, community stories, and administrative updates across the state.`;
	else if (lowerName.includes("politic")) fallbackDesc = `In-depth political reporting, election coverage, governance insights, and policy debates.`;
	else if (lowerName.includes("sport")) fallbackDesc = `Latest scores, match analysis, tournament updates, and athlete highlights in ${categoryName}.`;
	else if (lowerName.includes("tech") || lowerName.includes("gadget")) fallbackDesc = `Emerging technologies, digital innovation, gadget reviews, and cybersecurity developments.`;
	else if (lowerName.includes("business") || lowerName.includes("market") || lowerName.includes("econom") || lowerName.includes("finance")) fallbackDesc = `Financial market movements, business trends, economic indicators, and corporate updates.`;
	else if (lowerName.includes("world") || lowerName.includes("global") || lowerName.includes("international")) fallbackDesc = `Global news, foreign affairs, international relations, and worldwide developments.`;
	else if (lowerName.includes("health") || lowerName.includes("wellness")) fallbackDesc = `Health discoveries, wellness advice, medical research, and healthcare policy reporting.`;
	else if (lowerName.includes("entertainment") || lowerName.includes("cinema") || lowerName.includes("movie")) fallbackDesc = `Entertainment news, movie reviews, celebrity updates, and cultural trends.`;
	return {
		description: fallbackDesc,
		isFallback: true
	};
});
//#endregion
export { generateArticleContentServer_createServerFn_handler, generateCategoryDescriptionServer_createServerFn_handler, generatePageSeoServer_createServerFn_handler, generateSectionHtmlServer_createServerFn_handler };

//# sourceMappingURL=ai.functions-BCKUnzxw.js.map