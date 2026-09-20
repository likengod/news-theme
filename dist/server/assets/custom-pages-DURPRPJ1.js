import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { t as defaultPages } from "./default-pages-DQPnt0Sy.js";
import { i as setCached, n as clearCache, r as getCached } from "./server-cache-yx13wfkF.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import { z } from "zod";
//#region src/lib/site-content/custom-pages.ts?tss-serverfn-split
var getCustomPagesServer_createServerFn_handler = createServerRpc({
	id: "692ea2f55d4ecec9ef0a88eea92718428ba0af1975105119862bde2e25106d67",
	name: "getCustomPagesServer",
	filename: "src/lib/site-content/custom-pages.ts"
}, (opts) => getCustomPagesServer.__executeServer(opts));
var getCustomPagesServer = createServerFn({ method: "GET" }).handler(getCustomPagesServer_createServerFn_handler, async () => {
	const cacheKey = "custom_pages_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) {
				const merged = [...defaultPages];
				parsed.forEach((savedPage) => {
					if (savedPage.slug === "about" && savedPage.title === "About News Theme") savedPage.title = "About Us";
					const idx = merged.findIndex((p) => p.slug === savedPage.slug);
					if (idx !== -1) merged[idx] = savedPage;
					else merged.push(savedPage);
				});
				setCached(cacheKey, merged);
				return merged;
			}
		}
	} catch {}
	return defaultPages;
});
var saveCustomPageServer_createServerFn_handler = createServerRpc({
	id: "7179a38770baf2cdf7e3286c4ecc116948c0125097a3a5e488afd664b1e90777",
	name: "saveCustomPageServer",
	filename: "src/lib/site-content/custom-pages.ts"
}, (opts) => saveCustomPageServer.__executeServer(opts));
var saveCustomPageServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((page) => z.object({
	slug: z.string(),
	title: z.string(),
	intro: z.string().optional().default(""),
	body: z.string().optional().default(""),
	sections: z.array(z.object({
		heading: z.string(),
		body: z.string()
	})).optional(),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
	ogImage: z.string().optional(),
	metaKeywords: z.string().optional(),
	canonicalUrl: z.string().optional(),
	noIndex: z.boolean().optional()
}).passthrough().parse(page)).handler(saveCustomPageServer_createServerFn_handler, async ({ data: updatedPage }) => {
	let pages = defaultPages;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) pages = JSON.parse(rows[0].value);
	} catch {}
	const idx = pages.findIndex((p) => p.slug === updatedPage.slug);
	if (idx >= 0) pages[idx] = updatedPage;
	else pages.push(updatedPage);
	const json = JSON.stringify(pages);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('custom_pages_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("custom_pages_data");
	return { success: true };
});
//#endregion
export { getCustomPagesServer_createServerFn_handler, saveCustomPageServer_createServerFn_handler };

//# sourceMappingURL=custom-pages-DURPRPJ1.js.map