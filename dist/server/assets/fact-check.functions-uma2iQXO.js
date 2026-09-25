import { r as createServerFn } from "./esm-B50dUWcE.js";
import { r as getSiteSettingsServer } from "./site-settings-TC6eL9IL.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/fact-check.functions.ts?tss-serverfn-split
function decodeHtmlEntities(str) {
	return str.replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec))).trim();
}
function cleanHeadline(raw) {
	let cleaned = decodeHtmlEntities(raw);
	cleaned = cleaned.replace(/\s*[-–—|:][\s\w\d.]+$/, "").trim();
	return cleaned;
}
function categorizeRating(ratingStr) {
	const r = (ratingStr || "").toLowerCase();
	if (r.includes("false") || r.includes("fake") || r.includes("incorrect") || r.includes("pants on fire") || r.includes("myth") || r.includes("hoax") || r.includes("fabricated") || r.includes("untrue") || r.includes("debunked") || r.includes("scam") || r.includes("wrong") || r.includes("baseless")) return "false";
	if (r.includes("misleading") || r.includes("altered") || r.includes("partly") || r.includes("partially") || r.includes("context") || r.includes("exaggerated") || r.includes("distorted") || r.includes("mixture") || r.includes("half true")) return "misleading";
	if (r.includes("true") || r.includes("correct") || r.includes("accurate") || r.includes("verified") || r.includes("authentic")) return "true";
	return "unverified";
}
var CACHE_TTL_MS = 1800 * 1e3;
var factCheckCache = /* @__PURE__ */ new Map();
function getFromCache(key) {
	const normalized = key.toLowerCase().trim();
	const cached = factCheckCache.get(normalized);
	if (!cached) return null;
	if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
		factCheckCache.delete(normalized);
		return null;
	}
	return cached.data;
}
function setToCache(key, data) {
	const normalized = key.toLowerCase().trim();
	if (factCheckCache.size > 200) {
		const oldest = factCheckCache.keys().next().value;
		if (oldest) factCheckCache.delete(oldest);
	}
	factCheckCache.set(normalized, {
		timestamp: Date.now(),
		data
	});
}
async function extractUrlMetadata(urlStr) {
	try {
		const parsed = new URL(urlStr);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 3500);
		const res = await fetch(urlStr, {
			signal: controller.signal,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
				Range: "bytes=0-65535"
			}
		});
		clearTimeout(timeout);
		if (!res.ok && res.status !== 206) return { domain: parsed.hostname };
		let html = "";
		if (res.body) {
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let bytesRead = 0;
			while (bytesRead < 65536) {
				const { done, value } = await reader.read();
				if (done || !value) break;
				bytesRead += value.length;
				html += decoder.decode(value, { stream: true });
				if (html.includes("</head>") || html.includes("og:title") && html.includes("og:description")) {
					try {
						reader.cancel();
					} catch {}
					break;
				}
			}
		} else html = await res.text();
		const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1] || html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
		const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1] || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1];
		return {
			title: ogTitle ? cleanHeadline(ogTitle) : void 0,
			description: ogDesc ? decodeHtmlEntities(ogDesc) : void 0,
			domain: parsed.hostname
		};
	} catch (err) {
		try {
			return { domain: new URL(urlStr).hostname };
		} catch {
			return {};
		}
	}
}
var checkNewsFactServer_createServerFn_handler = createServerRpc({
	id: "a2ce65b73cdceb218f08412d4b04448d9996eaefcdb48ef0511661fe6b7d9c60",
	name: "checkNewsFactServer",
	filename: "src/lib/fact-check.functions.ts"
}, (opts) => checkNewsFactServer.__executeServer(opts));
var checkNewsFactServer = createServerFn({ method: "POST" }).validator((d) => d).handler(checkNewsFactServer_createServerFn_handler, async ({ data }) => {
	const rawInput = (data?.query || "").trim();
	if (!rawInput) return {
		query: "",
		isUrl: false,
		claims: [],
		status: "error",
		message: "Please enter a news URL or headline to verify."
	};
	const isUrl = /^https?:\/\//i.test(rawInput);
	let searchHeadline = rawInput;
	let extractedTitle;
	let extractedDescription;
	let sourceDomain;
	if (isUrl) {
		const meta = await extractUrlMetadata(rawInput);
		extractedTitle = meta.title;
		extractedDescription = meta.description;
		sourceDomain = meta.domain;
		if (extractedTitle) searchHeadline = extractedTitle;
		else try {
			const slugParts = new URL(rawInput).pathname.split("/").filter(Boolean).pop()?.replace(/[-_.]+/g, " ");
			if (slugParts && slugParts.length > 5) searchHeadline = slugParts;
		} catch {}
	}
	const settings = await getSiteSettingsServer().catch(() => ({}));
	if (!(settings.licenseType || "").toLowerCase().includes("enterprise")) return {
		query: rawInput,
		isUrl: false,
		claims: [],
		status: "error",
		message: "The Live Fact-Check Scanner is exclusively available on Enterprise and Enterprise Plus licenses."
	};
	const cached = getFromCache(rawInput);
	if (cached) return cached;
	const googleApiKey = settings.googleFactCheckApiKey || settings.geminiApiKey || process.env.GOOGLE_FACT_CHECK_API_KEY || process.env.GEMINI_API_KEY || "";
	const claims = [];
	if (googleApiKey) try {
		const queryTerms = searchHeadline.slice(0, 150);
		const apiUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(queryTerms)}&key=${googleApiKey}`;
		const apiRes = await fetch(apiUrl, { headers: { Accept: "application/json" } });
		if (apiRes.ok) {
			const apiJson = await apiRes.json();
			if (apiJson.claims && apiJson.claims.length > 0) for (const c of apiJson.claims) {
				const rev = c.claimReview?.[0];
				if (rev && rev.url) {
					const ratingText = rev.textualRating || "Unrated";
					claims.push({
						text: c.text || searchHeadline,
						claimant: c.claimant || "Public / Social Media Circulation",
						claimDate: c.claimDate,
						review: {
							publisherName: rev.publisher?.name || "Independent Fact-Checker",
							publisherSite: rev.publisher?.site,
							reviewUrl: rev.url,
							title: rev.title || "Fact Check Investigation",
							reviewDate: rev.reviewDate,
							rating: ratingText,
							verdictType: categorizeRating(ratingText)
						}
					});
				}
			}
		}
	} catch (err) {
		console.error("[GoogleFactCheckAPI] Search failed:", err);
	}
	if (claims.length > 0) {
		const result = {
			query: rawInput,
			isUrl,
			extractedTitle,
			extractedDescription,
			sourceDomain,
			claims,
			status: "found"
		};
		setToCache(rawInput, result);
		return result;
	}
	let aiAnalysis;
	if (settings.geminiApiKey) {
		const modelsToTry = [
			"gemini-flash-latest",
			"gemini-3.8-flash",
			"gemini-3.6-flash"
		];
		const prompt = `You are an expert news fact-checker and investigative journalist cross-referencing accredited fact-checking registries (such as PIB Fact Check, AFP Fact Check, Boom Live, Snopes, PolitiFact, Vishvas News, Alt News).
Analyze the following news claim or headline:
"${searchHeadline}"
${extractedDescription ? `Context / Excerpt: "${extractedDescription}"` : ""}
${sourceDomain ? `Source Domain: "${sourceDomain}"` : ""}

Check if this is a known viral hoax, fake government scheme, clickbait/misleading claim, or authentic news.
Identify any accredited fact-checkers who have investigated or debunked this or similar claims.

Return ONLY a valid JSON object with this exact schema:
{
  "verdict": "FALSE" | "MISLEADING" | "LIKELY TRUE" | "UNVERIFIED",
  "confidence": <integer between 50 and 99>,
  "rating": "<short rating text, e.g. Fake News, Debunked, Altered Video, or Verified Accurate>",
  "explanation": "<2-3 sentence clear, objective factual breakdown with verified context>",
  "factChecker": "<Accredited fact-checker organization, e.g. PIB Fact Check, Boom Live, AFP Fact Check, or Newsroom Editorial Desk>",
  "claimant": "<Who circulated this, e.g. Viral WhatsApp forward, Fake website, Social Media posts>",
  "riskFactors": ["<warning sign 1>", "<warning sign 2>"],
  "recommendation": "<practical advice for readers, e.g. verify with official government gazette or ministry portal>"
}`;
		for (const model of modelsToTry) try {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), 4500);
			const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiApiKey}`, {
				method: "POST",
				signal: controller.signal,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: {
						temperature: .1,
						maxOutputTokens: 350,
						responseMimeType: "application/json"
					}
				})
			});
			clearTimeout(timer);
			if (geminiRes.ok) {
				const cleanedText = ((await geminiRes.json())?.candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
				const parsed = JSON.parse(cleanedText);
				if (parsed && parsed.verdict) {
					aiAnalysis = {
						verdict: parsed.verdict,
						confidence: Number(parsed.confidence) || 85,
						explanation: parsed.explanation || "",
						riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
						recommendation: parsed.recommendation || ""
					};
					if (claims.length === 0) {
						const factCheckerName = parsed.factChecker || "Accredited Fact-Check Network";
						const ratingText = parsed.rating || parsed.verdict;
						claims.push({
							text: searchHeadline,
							claimant: parsed.claimant || "Viral Social Media / Messaging Circulation",
							claimDate: (/* @__PURE__ */ new Date()).toISOString(),
							review: {
								publisherName: factCheckerName,
								publisherSite: "Google Fact Check Tools / Global Fact-Check Network",
								reviewUrl: `https://www.google.com/search?q=${encodeURIComponent(`${factCheckerName} fact check ${searchHeadline.slice(0, 80)}`)}`,
								title: parsed.explanation,
								reviewDate: (/* @__PURE__ */ new Date()).toISOString(),
								rating: ratingText,
								verdictType: categorizeRating(parsed.verdict || ratingText)
							}
						});
					}
					break;
				}
			}
		} catch (err) {
			console.error(`[GeminiFactCheck] Model ${model} failed:`, err);
		}
	}
	const finalResult = {
		query: rawInput,
		isUrl,
		extractedTitle,
		extractedDescription,
		sourceDomain,
		claims,
		aiAnalysis,
		status: claims.length > 0 ? "found" : aiAnalysis ? "ai_analyzed" : "not_found",
		message: claims.length === 0 && !aiAnalysis ? "No accredited fact-check match found in the database. Please verify with official press releases." : void 0
	};
	setToCache(rawInput, finalResult);
	return finalResult;
});
//#endregion
export { checkNewsFactServer_createServerFn_handler };
