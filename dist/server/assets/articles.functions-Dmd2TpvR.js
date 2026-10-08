import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-CinayqzU.js";
import { t as requireAdmin } from "./auth-middleware-Cqd3GFjU.js";
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
//#region src/lib/articles.functions.ts
var getAdminArticles = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => data).handler(createSsrRpc("1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6"));
var getAdminArticleById = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((id) => id).handler(createSsrRpc("f74d25128cb65249eb9cd4c8c2bb7864f753953899ec42f1d96073ca0a4d1354"));
var saveAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(createSsrRpc("193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5"));
var getAdminAuthorProfiles = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("4f060819d3520f81ab864fe370ef176de6c7d786ba07ef7cb5f8964d28bed07f"));
var deleteAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(createSsrRpc("565efeec1ab25fb57eae93f7945f8ef4ef742652c0a4b3bccc38842724bfecfb"));
var deleteAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(createSsrRpc("e7422c1d0dee309e19778cc925e6c65b59c486bec05682f414fd48988f9b3f48"));
var getAllAdminArticles = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3"));
var importAdminArticles = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((articles) => articles).handler(createSsrRpc("8db4491881a2542e7ca906cd944acb38f7c8686c7b09435d2c0689601728de06"));
var PUBLIC_CARD_COLUMNS = `
  id, title, slug, category, city, state, country, author, views, status, date,
  excerpt, featuredImage, ogImage, imageCaption, imageCredit, tags, featured, newsType, journalistId, journalistName, access_level
`;
createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3"));
var getPublicArticleBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("b875846417bf76c2373ddaf3772e07ddd0648482764372fe11e47cddb10df762"));
var getPublicRelatedArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("c74c43aca09bd4ab35cb549fc9dd0b4b72af2f5002be44cbebcff373c6340867"));
var getPublicArchiveArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e"));
var getHomepageArticles = createServerFn({ method: "GET" }).validator((limit) => limit).handler(createSsrRpc("c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7"));
var getAdminDashboardStats = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba"));
//#endregion
export { saveCustomPageServer as _, getAdminArticles as a, getAllAdminArticles as c, getPublicArticleBySlug as d, getPublicRelatedArticles as f, loadPages as g, getCustomPagesServer as h, getAdminArticleById as i, getHomepageArticles as l, saveAdminArticle as m, deleteAdminArticle as n, getAdminAuthorProfiles as o, importAdminArticles as p, deleteAdminArticlesBulk as r, getAdminDashboardStats as s, PUBLIC_CARD_COLUMNS as t, getPublicArchiveArticles as u, savePages as v };

//# sourceMappingURL=articles.functions-Dmd2TpvR.js.map