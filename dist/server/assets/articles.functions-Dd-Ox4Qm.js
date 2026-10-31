import { t as __exportAll } from "./rolldown-runtime-D70C1uOS.js";
import { i as createServerFn } from "./server-rotgP4LI.js";
import { t as createSsrRpc } from "./createSsrRpc-CfzAkpDR.js";
import { t as requireAdmin } from "./auth-middleware-CsBFZhSC.js";
// src/lib/articles.functions.ts
var articles_functions_exports = /* @__PURE__ */ __exportAll({
	PUBLIC_CARD_COLUMNS: () => PUBLIC_CARD_COLUMNS,
	checkArticleLikedServer: () => checkArticleLikedServer,
	clearHomepageArticlesCache: () => clearHomepageArticlesCache,
	deletePermanentlyAdminArticle: () => deletePermanentlyAdminArticle,
	deletePermanentlyAdminArticlesBulk: () => deletePermanentlyAdminArticlesBulk,
	emptyTrashAdminArticles: () => emptyTrashAdminArticles,
	getAdminArticleById: () => getAdminArticleById,
	getAdminArticles: () => getAdminArticles,
	getAdminAuthorProfiles: () => getAdminAuthorProfiles,
	getAdminDashboardStats: () => getAdminDashboardStats,
	getAllAdminArticles: () => getAllAdminArticles,
	getHomepageArticles: () => getHomepageArticles,
	getPublicArchiveArticles: () => getPublicArchiveArticles,
	getPublicArticleBySlug: () => getPublicArticleBySlug,
	getPublicRelatedArticles: () => getPublicRelatedArticles,
	importAdminArticles: () => importAdminArticles,
	likeArticleServer: () => likeArticleServer,
	restoreAdminArticle: () => restoreAdminArticle,
	restoreAdminArticlesBulk: () => restoreAdminArticlesBulk,
	saveAdminArticle: () => saveAdminArticle,
	trashAdminArticle: () => trashAdminArticle,
	trashAdminArticlesBulk: () => trashAdminArticlesBulk
});
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
var HOMEPAGE_CACHE = {};
function clearHomepageArticlesCache() {
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
}
var getHomepageArticles = createServerFn({ method: "GET" }).validator((limit) => limit).handler(createSsrRpc("c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7"));
var getAdminDashboardStats = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba"));
/**
* Public: Like an article with 3NF duplicate-prevention, write-behind buffering, and anti-spam rate limiting.
*/
var likeArticleServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5151c19d6b0b56b114207c0daadb9bbd57477b58a7fb7b274ec51e2680278e65"));
/**
* Public: Check if the current visitor / user has already liked an article.
*/
var checkArticleLikedServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("42d18b0048bef3538026b6b696082858a6292614c8fa6484b80029a80eefcd00"));
createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("ad53ffbc7f3e951a8895f462145a88a54053d1cabb34053c5e5ae2e5ec97de6f"));
export { trashAdminArticlesBulk as S, likeArticleServer as _, deletePermanentlyAdminArticlesBulk as a, saveAdminArticle as b, getAdminArticles as c, getAllAdminArticles as d, getHomepageArticles as f, importAdminArticles as g, getPublicRelatedArticles as h, deletePermanentlyAdminArticle as i, getAdminAuthorProfiles as l, getPublicArticleBySlug as m, articles_functions_exports as n, emptyTrashAdminArticles as o, getPublicArchiveArticles as p, checkArticleLikedServer as r, getAdminArticleById as s, PUBLIC_CARD_COLUMNS as t, getAdminDashboardStats as u, restoreAdminArticle as v, trashAdminArticle as x, restoreAdminArticlesBulk as y };

//# sourceMappingURL=articles.functions-Dd-Ox4Qm.js.map