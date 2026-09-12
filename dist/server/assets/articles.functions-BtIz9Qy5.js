import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-685WOgBx.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
//#region src/lib/articles.functions.ts
var getAdminArticles = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6"));
var saveAdminArticle = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5"));
var deleteAdminArticle = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(createSsrRpc("565efeec1ab25fb57eae93f7945f8ef4ef742652c0a4b3bccc38842724bfecfb"));
var deleteAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((ids) => ids).handler(createSsrRpc("e7422c1d0dee309e19778cc925e6c65b59c486bec05682f414fd48988f9b3f48"));
var getAllAdminArticles = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3"));
var importAdminArticles = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((articles) => articles).handler(createSsrRpc("8db4491881a2542e7ca906cd944acb38f7c8686c7b09435d2c0689601728de06"));
var searchPublicArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3"));
var getPublicArticleBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("b875846417bf76c2373ddaf3772e07ddd0648482764372fe11e47cddb10df762"));
var getPublicArchiveArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e"));
var getHomepageArticles = createServerFn({ method: "GET" }).validator((limit) => limit).handler(createSsrRpc("c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7"));
var getAdminDashboardStats = createServerFn({ method: "GET" }).handler(createSsrRpc("39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba"));
//#endregion
export { getAllAdminArticles as a, getPublicArticleBySlug as c, searchPublicArticles as d, getAdminDashboardStats as i, importAdminArticles as l, deleteAdminArticlesBulk as n, getHomepageArticles as o, getAdminArticles as r, getPublicArchiveArticles as s, deleteAdminArticle as t, saveAdminArticle as u };

//# sourceMappingURL=articles.functions-BtIz9Qy5.js.map