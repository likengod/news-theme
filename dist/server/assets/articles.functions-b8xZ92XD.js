import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query, p as slugify } from "./db.server-Chz3iTW3.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/articles.functions.ts?tss-serverfn-split
var getAdminArticles_createServerFn_handler = createServerRpc({
	id: "1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6",
	name: "getAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAdminArticles.__executeServer(opts));
var getAdminArticles = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data).handler(getAdminArticles_createServerFn_handler, async ({ data }) => {
	const { q = "", category = "All", status = "All", page = 1, limit = 20 } = data;
	const safeLimit = Math.min(Math.max(1, limit), 200);
	const offset = (Math.max(1, page) - 1) * safeLimit;
	let filterSql = " WHERE 1=1";
	const params = [];
	if (q) {
		filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)";
		const term = `%${q}%`;
		params.push(term, term, term);
	}
	if (category && category !== "All") {
		filterSql += " AND category = ?";
		params.push(category);
	}
	if (status && status !== "All") {
		filterSql += " AND status = ?";
		params.push(status);
	}
	const [countRes, rows] = await Promise.all([query(`SELECT COUNT(*) AS total FROM articles${filterSql}`, params), query(`SELECT id, title, slug, category, author, views, status, date,
                featuredImage, featured, newsType, journalistId, journalistName, access_level
         FROM articles${filterSql} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`, [
		...params,
		safeLimit,
		offset
	])]);
	const total = Number(countRes[0]?.total ?? 0);
	return {
		rows: rows.map((r) => ({
			...r,
			featured: Boolean(r.featured)
		})),
		total,
		totalPages: Math.max(1, Math.ceil(total / safeLimit))
	};
});
var saveAdminArticle_createServerFn_handler = createServerRpc({
	id: "193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5",
	name: "saveAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => saveAdminArticle.__executeServer(opts));
var saveAdminArticle = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(saveAdminArticle_createServerFn_handler, async ({ data }) => {
	const r = data;
	const finalSlug = r.slug || slugify(r.title);
	const checkExisting = await query("SELECT id FROM articles WHERE slug = ? AND id != ?", [finalSlug, r.id || 0]);
	let slug = finalSlug;
	if (checkExisting.length > 0) slug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
	const fields = [
		"title",
		"slug",
		"category",
		"city",
		"state",
		"country",
		"author",
		"views",
		"status",
		"date",
		"excerpt",
		"content",
		"featuredImage",
		"ogImage",
		"metaTitle",
		"metaDescription",
		"tags",
		"featured",
		"newsType",
		"journalistId",
		"journalistName",
		"access_level"
	];
	let formattedDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
	if (r.date) formattedDate = String(r.date).replace("T", " ").replace("Z", "").substring(0, 19);
	const values = [
		r.title,
		slug,
		r.category,
		r.city,
		r.state,
		r.country,
		r.author,
		r.views || 0,
		r.status,
		formattedDate,
		r.excerpt,
		r.content,
		r.featuredImage,
		r.ogImage || r.featuredImage,
		r.metaTitle,
		r.metaDescription,
		r.tags,
		r.featured ? 1 : 0,
		r.newsType || "Standard",
		r.journalistId,
		r.journalistName,
		r.access_level || "Free"
	];
	if (r.id) {
		await query(`UPDATE articles SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`, [...values, r.id]);
		Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
		return {
			...r,
			slug,
			id: r.id
		};
	} else {
		const result = await query(`INSERT INTO articles (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`, values);
		Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
		return {
			...r,
			slug,
			id: result.insertId
		};
	}
});
var deleteAdminArticle_createServerFn_handler = createServerRpc({
	id: "565efeec1ab25fb57eae93f7945f8ef4ef742652c0a4b3bccc38842724bfecfb",
	name: "deleteAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => deleteAdminArticle.__executeServer(opts));
var deleteAdminArticle = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(deleteAdminArticle_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM articles WHERE id = ?", [id]);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var deleteAdminArticlesBulk_createServerFn_handler = createServerRpc({
	id: "e7422c1d0dee309e19778cc925e6c65b59c486bec05682f414fd48988f9b3f48",
	name: "deleteAdminArticlesBulk",
	filename: "src/lib/articles.functions.ts"
}, (opts) => deleteAdminArticlesBulk.__executeServer(opts));
var deleteAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((ids) => ids).handler(deleteAdminArticlesBulk_createServerFn_handler, async ({ data: ids }) => {
	if (ids.length === 0) return { success: true };
	await query(`DELETE FROM articles WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var getAllAdminArticles_createServerFn_handler = createServerRpc({
	id: "e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3",
	name: "getAllAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAllAdminArticles.__executeServer(opts));
var getAllAdminArticles = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(getAllAdminArticles_createServerFn_handler, async () => {
	return (await query(`
      SELECT id, title, slug, category, city, state, country, author, views, status, date,
             excerpt, content, featuredImage, ogImage, metaTitle, metaDescription, tags, featured,
             newsType, journalistId, journalistName, access_level
      FROM articles ORDER BY date DESC, id DESC
    `)).map((r) => ({
		...r,
		featured: Boolean(r.featured)
	}));
});
var importAdminArticles_createServerFn_handler = createServerRpc({
	id: "8db4491881a2542e7ca906cd944acb38f7c8686c7b09435d2c0689601728de06",
	name: "importAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => importAdminArticles.__executeServer(opts));
var importAdminArticles = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((articles) => articles).handler(importAdminArticles_createServerFn_handler, async ({ data: articles }) => {
	if (!articles || articles.length === 0) return { success: true };
	const fields = [
		"title",
		"slug",
		"category",
		"city",
		"state",
		"country",
		"author",
		"views",
		"status",
		"date",
		"excerpt",
		"content",
		"featuredImage",
		"ogImage",
		"metaTitle",
		"metaDescription",
		"tags",
		"featured",
		"newsType",
		"journalistId",
		"journalistName",
		"access_level"
	];
	for (const r of articles) {
		const finalSlug = r.slug || slugify(r.title);
		let formattedDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
		if (r.date) formattedDate = String(r.date).replace("T", " ").replace("Z", "").substring(0, 19);
		const values = [
			r.title || "Untitled",
			finalSlug,
			r.category || "General",
			r.city || "",
			r.state || "",
			r.country || "",
			r.author || "Admin",
			Number(r.views) || 0,
			r.status || "Draft",
			formattedDate,
			r.excerpt || "",
			r.content || "",
			r.featuredImage || "",
			r.ogImage || r.featuredImage || "",
			r.metaTitle || "",
			r.metaDescription || "",
			r.tags || "",
			r.featured === "true" || r.featured === true || r.featured === 1 ? 1 : 0,
			r.newsType || "Standard",
			r.journalistId || "",
			r.journalistName || "",
			r.access_level || "Free"
		];
		const existing = await query("SELECT id FROM articles WHERE id = ? OR slug = ?", [r.id || 0, finalSlug]);
		if (existing.length > 0) {
			const idToUpdate = existing[0].id;
			await query(`UPDATE articles SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`, [...values, idToUpdate]);
		} else await query(`INSERT INTO articles (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`, values);
	}
	return { success: true };
});
var searchPublicArticles_createServerFn_handler = createServerRpc({
	id: "476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3",
	name: "searchPublicArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => searchPublicArticles.__executeServer(opts));
var searchPublicArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(searchPublicArticles_createServerFn_handler, async ({ data }) => {
	const { q = "", category = "All", page = 1, limit = 15 } = data;
	const offset = (page - 1) * limit;
	let countSql = "SELECT COUNT(*) as total FROM articles WHERE status = 'Published' AND date <= NOW()";
	let selectSql = "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW()";
	const params = [];
	let filterSql = "";
	if (q) {
		filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
		const term = `%${q}%`;
		params.push(term, term, term);
	}
	if (category && category !== "All") {
		filterSql += " AND category = ?";
		params.push(category);
	}
	countSql += filterSql;
	selectSql += filterSql + " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
	const total = (await query(countSql, params))[0]?.total || 0;
	const selectParams = [
		...params,
		limit,
		offset
	];
	return {
		items: (await query(selectSql, selectParams)).map((r) => ({
			...r,
			featured: Boolean(r.featured)
		})),
		total,
		totalPages: Math.ceil(total / limit)
	};
});
var getPublicArticleBySlug_createServerFn_handler = createServerRpc({
	id: "b875846417bf76c2373ddaf3772e07ddd0648482764372fe11e47cddb10df762",
	name: "getPublicArticleBySlug",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getPublicArticleBySlug.__executeServer(opts));
var getPublicArticleBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getPublicArticleBySlug_createServerFn_handler, async ({ data: slug }) => {
	const rows = await query("SELECT * FROM articles WHERE slug = ?", [slug]);
	if (rows.length === 0) return null;
	query("UPDATE articles SET views = views + 1 WHERE id = ?", [rows[0].id]).catch((err) => {
		console.error("[MySQL] Failed to increment views:", err);
	});
	return {
		...rows[0],
		featured: Boolean(rows[0].featured)
	};
});
var getPublicArchiveArticles_createServerFn_handler = createServerRpc({
	id: "7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e",
	name: "getPublicArchiveArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getPublicArchiveArticles.__executeServer(opts));
var getPublicArchiveArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(getPublicArchiveArticles_createServerFn_handler, async ({ data }) => {
	const { year, month, day, page = 1, limit = 15 } = data;
	const offset = (page - 1) * limit;
	let sql = "SELECT * FROM articles WHERE status = 'Published' AND date <= NOW()";
	let countSql = "SELECT COUNT(*) as total FROM articles WHERE status = 'Published' AND date <= NOW()";
	const params = [];
	if (year) {
		sql += " AND YEAR(date) = ?";
		countSql += " AND YEAR(date) = ?";
		params.push(Number(year));
	}
	if (month) {
		sql += " AND MONTH(date) = ?";
		countSql += " AND MONTH(date) = ?";
		params.push(Number(month));
	}
	if (day) {
		sql += " AND DAY(date) = ?";
		countSql += " AND DAY(date) = ?";
		params.push(Number(day));
	}
	sql += " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
	const total = (await query(countSql, params))[0]?.total || 0;
	return {
		items: (await query(sql, [
			...params,
			limit,
			offset
		])).map((r) => ({
			...r,
			featured: Boolean(r.featured)
		})),
		total,
		totalPages: Math.ceil(total / limit)
	};
});
var HOMEPAGE_CACHE = {};
var getHomepageArticles_createServerFn_handler = createServerRpc({
	id: "c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7",
	name: "getHomepageArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getHomepageArticles.__executeServer(opts));
var getHomepageArticles = createServerFn({ method: "GET" }).validator((limit) => limit).handler(getHomepageArticles_createServerFn_handler, async ({ data }) => {
	try {
		let rawLimit = 30;
		if (typeof data === "number") rawLimit = data;
		else if (typeof data === "string") rawLimit = parseInt(data, 10) || 30;
		else if (typeof data === "object" && data !== null) rawLimit = parseInt(data.data || data.limit, 10) || 30;
		const limitNum = Math.min(Math.max(1, rawLimit), 100);
		const now = Date.now();
		const cache = HOMEPAGE_CACHE[limitNum];
		if (cache && now - cache.lastFetched < cache.TTL) {
			console.log(`[Cache Hit] Serving homepage articles (limit: ${limitNum})`);
			return cache.data;
		}
		console.log(`[Cache Miss] Fetching homepage articles from MySQL (limit: ${limitNum})`);
		const items = await query(`SELECT id, title, slug, category, city, state, country, author, views, status, date,
                excerpt, featuredImage, ogImage, tags, featured, newsType, journalistId, journalistName, access_level
         FROM articles 
         WHERE status = 'Published' AND date <= NOW() 
         ORDER BY date DESC, id DESC 
         LIMIT ?`, [limitNum]);
		if (!Array.isArray(items)) return [];
		const mapped = items.map((r) => ({
			...r,
			featured: Boolean(r.featured)
		}));
		HOMEPAGE_CACHE[limitNum] = {
			data: mapped,
			lastFetched: now,
			TTL: 60 * 1e3
		};
		return mapped;
	} catch (err) {
		console.error("[getHomepageArticles] Error fetching articles:", err?.message || err);
		const fallbackLimit = 30;
		if (HOMEPAGE_CACHE[fallbackLimit]?.data) return HOMEPAGE_CACHE[fallbackLimit].data;
		return [];
	}
});
var getAdminDashboardStats_createServerFn_handler = createServerRpc({
	id: "39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba",
	name: "getAdminDashboardStats",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAdminDashboardStats.__executeServer(opts));
var getAdminDashboardStats = createServerFn({ method: "GET" }).handler(getAdminDashboardStats_createServerFn_handler, async () => {
	const [articlesCount] = await query("SELECT COUNT(*) as count FROM articles");
	const [viewsCount] = await query("SELECT COALESCE(SUM(views), 0) as count FROM articles");
	const [usersCount] = await query("SELECT COUNT(*) as count FROM users");
	let commentsCount = 0;
	try {
		const [rows] = await query("SELECT COUNT(*) as count FROM comments");
		commentsCount = rows?.count || 0;
	} catch (e) {
		commentsCount = 0;
	}
	const recentArticles = await query(`
      SELECT title, category, views, date, featuredImage 
      FROM articles 
      ORDER BY date DESC, id DESC 
      LIMIT 6
    `);
	const categoryStats = await query(`
      SELECT category as name, COUNT(*) as count 
      FROM articles 
      GROUP BY category 
      ORDER BY count DESC 
      LIMIT 6
    `);
	return {
		totalArticles: articlesCount?.count || 0,
		totalViews: Number(viewsCount?.count) || 0,
		totalUsers: usersCount?.count || 0,
		totalComments: commentsCount,
		recentArticles: recentArticles || [],
		categoryStats: categoryStats || []
	};
});
//#endregion
export { deleteAdminArticle_createServerFn_handler, deleteAdminArticlesBulk_createServerFn_handler, getAdminArticles_createServerFn_handler, getAdminDashboardStats_createServerFn_handler, getAllAdminArticles_createServerFn_handler, getHomepageArticles_createServerFn_handler, getPublicArchiveArticles_createServerFn_handler, getPublicArticleBySlug_createServerFn_handler, importAdminArticles_createServerFn_handler, saveAdminArticle_createServerFn_handler, searchPublicArticles_createServerFn_handler };
