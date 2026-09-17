import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-CzbwKkqR.js";
import { i as setCached, n as clearCache, r as getCached } from "./server-cache-BV7KtCxx.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import { z } from "zod";
//#region src/lib/site-content/redirect-rules.ts?tss-serverfn-split
var getRedirectRulesServer_createServerFn_handler = createServerRpc({
	id: "7cbf675c7bd7c9ee224e699588bfa7a4d7b38ac86b77a40ade5d857819ebe6a7",
	name: "getRedirectRulesServer",
	filename: "src/lib/site-content/redirect-rules.ts"
}, (opts) => getRedirectRulesServer.__executeServer(opts));
var getRedirectRulesServer = createServerFn({ method: "GET" }).handler(getRedirectRulesServer_createServerFn_handler, async () => {
	const cacheKey = "site_redirects_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			setCached(cacheKey, parsed);
			return parsed;
		}
	} catch {}
	return [];
});
var saveRedirectRulesServer_createServerFn_handler = createServerRpc({
	id: "2b528109ae68caadb520b78d8504c061898b4465ebb34cde90c52d157753bde0",
	name: "saveRedirectRulesServer",
	filename: "src/lib/site-content/redirect-rules.ts"
}, (opts) => saveRedirectRulesServer.__executeServer(opts));
var saveRedirectRulesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((rules) => z.array(z.object({
	id: z.string(),
	source: z.string(),
	destination: z.string(),
	hits: z.number(),
	createdAt: z.string()
})).parse(rules)).handler(saveRedirectRulesServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("site_redirects_data");
	return { success: true };
});
var incrementRedirectHitServer_createServerFn_handler = createServerRpc({
	id: "fc9dae9aa403f9bc644d51588c7c5f5b486d759eecd1cfd041e553d794565167",
	name: "incrementRedirectHitServer",
	filename: "src/lib/site-content/redirect-rules.ts"
}, (opts) => incrementRedirectHitServer.__executeServer(opts));
var incrementRedirectHitServer = createServerFn({ method: "POST" }).validator((id) => z.string().parse(id)).handler(incrementRedirectHitServer_createServerFn_handler, async ({ data: id }) => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
		if (rows.length > 0 && rows[0].value) {
			const rules = JSON.parse(rows[0].value);
			const idx = rules.findIndex((r) => r.id === id);
			if (idx >= 0) {
				rules[idx].hits = (rules[idx].hits || 0) + 1;
				const json = JSON.stringify(rules);
				await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
             ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
				clearCache("site_redirects_data");
			}
		}
	} catch {}
	return { success: true };
});
var scanBrokenLinksServer_createServerFn_handler = createServerRpc({
	id: "64074aae210bf06c1f6dd880c1ceb389e454c17f09dc8077502ecd8f6d3d97f2",
	name: "scanBrokenLinksServer",
	filename: "src/lib/site-content/redirect-rules.ts"
}, (opts) => scanBrokenLinksServer.__executeServer(opts));
var scanBrokenLinksServer = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(scanBrokenLinksServer_createServerFn_handler, async () => {
	const categoriesRows = await query("SELECT slug FROM categories");
	const categorySlugs = new Set(categoriesRows.map((r) => r.slug));
	let pageSlugs = /* @__PURE__ */ new Set([
		"about",
		"privacy-policy",
		"terms-and-conditions",
		"cookie-policy",
		"refund-policy",
		"dmca",
		"contact"
	]);
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) {
			const pages = JSON.parse(rows[0].value);
			if (Array.isArray(pages)) pages.forEach((p) => {
				if (p.slug) pageSlugs.add(p.slug);
			});
		}
	} catch {}
	const articlesRows = await query("SELECT id, title, slug, content FROM articles WHERE status = 'Published'");
	const articleSlugsMap = /* @__PURE__ */ new Map();
	articlesRows.forEach((r) => {
		articleSlugsMap.set(r.slug, {
			id: r.id,
			title: r.title
		});
	});
	const staticRoutes = /* @__PURE__ */ new Set([
		"",
		"/",
		"/about",
		"/contact",
		"/submit-news",
		"/privacy-policy",
		"/terms-and-conditions",
		"/cookie-policy",
		"/refund-policy",
		"/disclaimer",
		"/editorial-policy",
		"/dmca",
		"/data-deletion-policy",
		"/verified-journalist",
		"/subscription",
		"/work-with-us",
		"/archive",
		"/earn-points",
		"/withdraw-points",
		"/profile",
		"/search"
	]);
	const brokenLinks = [];
	const findSuggestion = (brokenSlug) => {
		const keywords = brokenSlug.split("-").filter((k) => k.length > 2);
		if (keywords.length === 0) return "";
		let bestMatchSlug = "";
		let maxMatches = 0;
		articlesRows.forEach((r) => {
			let matches = 0;
			keywords.forEach((kw) => {
				if (r.slug.includes(kw) || r.title.toLowerCase().includes(kw)) matches++;
			});
			if (matches > maxMatches) {
				maxMatches = matches;
				bestMatchSlug = `/news/${r.slug}`;
			}
		});
		return bestMatchSlug;
	};
	const hrefRegex = /href=["']((?:\/[a-zA-Z0-9_\-\.\/]*)|(?:https?:\/\/[a-zA-Z0-9_\-\.\/]+))["']/g;
	articlesRows.forEach((art) => {
		if (!art.content) return;
		let match;
		const seenLinksInArticle = /* @__PURE__ */ new Set();
		while ((match = hrefRegex.exec(art.content)) !== null) {
			const url = match[1];
			if (seenLinksInArticle.has(url)) continue;
			seenLinksInArticle.add(url);
			let isBroken = false;
			let suggestion = "";
			if (url.startsWith("/")) {
				const path = url.split("?")[0].split("#")[0];
				if (path.startsWith("/news/")) {
					const slug = path.substring(6);
					if (!articleSlugsMap.has(slug)) {
						isBroken = true;
						suggestion = findSuggestion(slug);
					}
				} else {
					const slug = path.substring(1);
					if (!staticRoutes.has(path) && !pageSlugs.has(slug) && !categorySlugs.has(slug)) isBroken = true;
				}
			}
			if (isBroken) brokenLinks.push({
				id: `${art.id}-${encodeURIComponent(url)}`,
				articleId: art.id,
				articleTitle: art.title,
				articleSlug: art.slug,
				brokenUrl: url,
				suggestedFix: suggestion
			});
		}
	});
	return brokenLinks;
});
var fixBrokenLinkServer_createServerFn_handler = createServerRpc({
	id: "1f78d7f578a6afa4f03a2d2bc26fcf60e865cac4f78ccc0a2b5d02cfe41e0c1c",
	name: "fixBrokenLinkServer",
	filename: "src/lib/site-content/redirect-rules.ts"
}, (opts) => fixBrokenLinkServer.__executeServer(opts));
var fixBrokenLinkServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
	articleId: z.number(),
	brokenUrl: z.string().min(1),
	correctedUrl: z.string().min(1)
}).parse(data)).handler(fixBrokenLinkServer_createServerFn_handler, async ({ data }) => {
	const { articleId, brokenUrl, correctedUrl } = data;
	const rows = await query("SELECT content FROM articles WHERE id = ?", [articleId]);
	if (rows.length === 0) throw new Error("Article not found");
	let content = rows[0].content || "";
	const doubleQuotePattern = new RegExp(`href=["']${escapeRegExp(brokenUrl)}["']`, "g");
	content = content.replace(doubleQuotePattern, `href="${correctedUrl}"`);
	await query("UPDATE articles SET content = ? WHERE id = ?", [content, articleId]);
	return { success: true };
});
function escapeRegExp(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//#endregion
export { fixBrokenLinkServer_createServerFn_handler, getRedirectRulesServer_createServerFn_handler, incrementRedirectHitServer_createServerFn_handler, saveRedirectRulesServer_createServerFn_handler, scanBrokenLinksServer_createServerFn_handler };

//# sourceMappingURL=redirect-rules-Cj_AynWp.js.map