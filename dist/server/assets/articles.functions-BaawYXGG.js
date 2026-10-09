import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BqJBKbDJ.js";
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
var trashAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(createSsrRpc("47f3e98dfa8065a7eb67b3c8ebe13819fd9ecf8a2128a4f73e1c19d4c3cd5508"));
var restoreAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(createSsrRpc("d14c976fc9d27f7cba055065c2d8be0c91411a65384e1cee39634635f87cd1cc"));
var deletePermanentlyAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(createSsrRpc("2a539a1f2abfb0faa00e3c69f05d6961a00be0f490e8ac4a1e983afb2cea8b08"));
var trashAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(createSsrRpc("89fc6e633758384ac3ff1727b979f26efdb0707b0620698d8e1b69bf02cbe1d3"));
var restoreAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(createSsrRpc("d5a9474dac158835730ec1660c29a33bc39e42dbf22db6c74184a5837442ce3c"));
var deletePermanentlyAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(createSsrRpc("5793221b7208fe5998cf899cbabb3dc0129a36e9333df1fd20efee344b372c3a"));
var emptyTrashAdminArticles = createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(createSsrRpc("c57cf768f00d2d98b4493cfc9864c3854c188071e1099484f44c676f99ce2cb2"));
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
export { savePages as C, saveCustomPageServer as S, saveAdminArticle as _, getAdminArticleById as a, getCustomPagesServer as b, getAdminDashboardStats as c, getPublicArchiveArticles as d, getPublicArticleBySlug as f, restoreAdminArticlesBulk as g, restoreAdminArticle as h, emptyTrashAdminArticles as i, getAllAdminArticles as l, importAdminArticles as m, deletePermanentlyAdminArticle as n, getAdminArticles as o, getPublicRelatedArticles as p, deletePermanentlyAdminArticlesBulk as r, getAdminAuthorProfiles as s, PUBLIC_CARD_COLUMNS as t, getHomepageArticles as u, trashAdminArticle as v, loadPages as x, trashAdminArticlesBulk as y };

//# sourceMappingURL=articles.functions-BaawYXGG.js.map