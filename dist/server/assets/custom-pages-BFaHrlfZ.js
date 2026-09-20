import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BP1dEv6O.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { t as defaultPages } from "./default-pages-DQPnt0Sy.js";
import { z } from "zod";
//#region src/lib/site-content/custom-pages.ts
var PAGES_KEY = "nt:site-pages";
var getCustomPagesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("692ea2f55d4ecec9ef0a88eea92718428ba0af1975105119862bde2e25106d67"));
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
}).passthrough().parse(page)).handler(createSsrRpc("7179a38770baf2cdf7e3286c4ecc116948c0125097a3a5e488afd664b1e90777"));
function loadPages() {
	if (typeof window === "undefined") return defaultPages;
	try {
		const raw = localStorage.getItem(PAGES_KEY);
		if (!raw) return defaultPages;
		const parsed = JSON.parse(raw);
		const map = new Map(parsed.map((p) => [p.slug, p]));
		return defaultPages.map((d) => {
			const saved = map.get(d.slug);
			return saved ? {
				...d,
				...saved
			} : d;
		});
	} catch {
		return defaultPages;
	}
}
function savePages(p) {
	if (typeof window !== "undefined") localStorage.setItem(PAGES_KEY, JSON.stringify(p));
}
//#endregion
export { savePages as i, loadPages as n, saveCustomPageServer as r, getCustomPagesServer as t };

//# sourceMappingURL=custom-pages-BFaHrlfZ.js.map