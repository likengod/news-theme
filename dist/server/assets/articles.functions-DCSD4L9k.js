import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-C7n5bDo7.js";
import { t as requireAdmin } from "./auth-middleware-U4OjYGQK.js";
import { o as slugify } from "./news-data-BCdeOjjW.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/articles.functions.ts?tss-serverfn-split
var getAdminArticles_createServerFn_handler = createServerRpc({
	id: "1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6",
	name: "getAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAdminArticles.__executeServer(opts));
var getAdminArticles = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => data).handler(getAdminArticles_createServerFn_handler, async ({ data }) => {
	const { q = "", category = "All", status = "All", page = 1, limit = 20 } = data;
	await query("UPDATE articles SET status = 'Published' WHERE status = 'Scheduled' AND date <= NOW()").catch(() => {});
	const safeLimit = Math.min(Math.max(1, limit), 200);
	const offset = (Math.max(1, page) - 1) * safeLimit;
	let filterSql = " WHERE 1=1";
	const params = [];
	const cleanQ = (q || "").trim();
	if (cleanQ) {
		const words = cleanQ.split(/\s+/).filter(Boolean);
		if (words.length > 1) {
			const wordConditions = [];
			for (const w of words) {
				const wTerm = `%${w}%`;
				wordConditions.push("(title LIKE ? OR slug LIKE ? OR excerpt LIKE ? OR tags LIKE ?)");
				params.push(wTerm, wTerm, wTerm, wTerm);
			}
			filterSql += ` AND (${wordConditions.join(" AND ")})`;
		} else {
			filterSql += " AND (title LIKE ? OR slug LIKE ? OR excerpt LIKE ? OR tags LIKE ?)";
			const term = `%${cleanQ}%`;
			params.push(term, term, term, term);
		}
	}
	if (category && category !== "All") {
		filterSql += " AND (LOWER(category) = LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?))";
		params.push(category, `${category},%`, `%, ${category}`, `%, ${category},%`, `%,${category},%`);
	}
	if (status && status !== "All") if (status === "Scheduled") filterSql += " AND (status = 'Scheduled' OR (status = 'Published' AND date > NOW()))";
	else if (status === "Published") filterSql += " AND status = 'Published' AND date <= NOW()";
	else {
		filterSql += " AND status = ?";
		params.push(status);
	}
	else filterSql += " AND (status IS NULL OR status != 'Trash')";
	const [countRes, rows, statusCounts] = await Promise.all([
		query(`SELECT COUNT(*) AS total FROM articles${filterSql}`, params),
		query(`SELECT id, title, slug, category, city, state, country, author, views, status, date,
                  excerpt, content, featuredImage, ogImage, imageCaption, imageCredit, metaTitle, metaDescription, tags,
                  featured, newsType, journalistId, journalistName, access_level
           FROM articles${filterSql} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`, [
			...params,
			safeLimit,
			offset
		]),
		query(`
          SELECT 
            SUM(CASE WHEN status IS NULL OR status != 'Trash' THEN 1 ELSE 0 END) AS allCount,
            SUM(CASE WHEN status = 'Published' AND date <= NOW() THEN 1 ELSE 0 END) AS publishedCount,
            SUM(CASE WHEN status = 'Scheduled' OR (status = 'Published' AND date > NOW()) THEN 1 ELSE 0 END) AS scheduledCount,
            SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draftCount,
            SUM(CASE WHEN status = 'Review' THEN 1 ELSE 0 END) AS reviewCount,
            SUM(CASE WHEN status = 'Trash' THEN 1 ELSE 0 END) AS trashCount
          FROM articles
        `)
	]);
	const sc = statusCounts && statusCounts[0] || {};
	const total = Number(countRes[0]?.total ?? 0);
	const trashCount = Number(sc.trashCount ?? 0);
	const scheduledCount = Number(sc.scheduledCount ?? 0);
	const allCount = Number(sc.allCount ?? 0);
	const publishedCount = Number(sc.publishedCount ?? 0);
	const draftCount = Number(sc.draftCount ?? 0);
	const reviewCount = Number(sc.reviewCount ?? 0);
	return {
		rows: rows.map((r) => ({
			...r,
			featured: Boolean(r.featured)
		})),
		total,
		allCount,
		publishedCount,
		scheduledCount,
		draftCount,
		reviewCount,
		trashCount,
		totalPages: Math.max(1, Math.ceil(total / safeLimit))
	};
});
var getAdminArticleById_createServerFn_handler = createServerRpc({
	id: "f74d25128cb65249eb9cd4c8c2bb7864f753953899ec42f1d96073ca0a4d1354",
	name: "getAdminArticleById",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAdminArticleById.__executeServer(opts));
var getAdminArticleById = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((id) => id).handler(getAdminArticleById_createServerFn_handler, async ({ data: id }) => {
	if (!id || id <= 0) return null;
	const rows = await query(`SELECT id, title, slug, category, city, state, country, author, views, status, date,
              excerpt, content, featuredImage, ogImage, imageCaption, imageCredit, metaTitle, metaDescription, tags,
              featured, newsType, journalistId, journalistName, access_level
       FROM articles WHERE id = ? LIMIT 1`, [id]);
	if (!rows || rows.length === 0) return null;
	const r = rows[0];
	return {
		...r,
		featured: Boolean(r.featured)
	};
});
var saveAdminArticle_createServerFn_handler = createServerRpc({
	id: "193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5",
	name: "saveAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => saveAdminArticle.__executeServer(opts));
var saveAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(saveAdminArticle_createServerFn_handler, async ({ data }) => {
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
		"imageCaption",
		"imageCredit",
		"metaTitle",
		"metaDescription",
		"tags",
		"featured",
		"newsType",
		"journalistId",
		"journalistName",
		"access_level"
	];
	let isExisting = false;
	let existingRow = null;
	if (r.id && Number(r.id) > 0) {
		const existingCheck = await query("SELECT * FROM articles WHERE id = ?", [r.id]);
		if (existingCheck.length > 0) {
			isExisting = true;
			existingRow = existingCheck[0];
		}
	}
	const getNowSql = () => {
		const now = /* @__PURE__ */ new Date();
		const pad = (n) => String(n).padStart(2, "0");
		return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
	};
	let formattedDate = getNowSql();
	if (r.date) {
		const rawDate = String(r.date).trim();
		if (rawDate.includes("Z") || /[+-]\d{2}:\d{2}$/.test(rawDate)) {
			const d = new Date(rawDate);
			if (!isNaN(d.getTime())) {
				const pad = (n) => String(n).padStart(2, "0");
				formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
			}
		} else {
			let clean = rawDate.replace("T", " ").trim();
			if (clean.length === 10) {
				const now = /* @__PURE__ */ new Date();
				const pad = (n) => String(n).padStart(2, "0");
				clean += ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
			} else if (clean.length === 16) clean += ":00";
			formattedDate = clean.substring(0, 19);
		}
	} else if (existingRow?.date) {
		const d = new Date(existingRow.date);
		if (!isNaN(d.getTime())) {
			const pad = (n) => String(n).padStart(2, "0");
			formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
		} else formattedDate = String(existingRow.date).replace("T", " ").replace("Z", "").substring(0, 19);
	}
	let finalStatus = r.status || (existingRow?.status ?? "Draft");
	const parsedArticleTime = new Date(formattedDate.replace(" ", "T")).getTime();
	const nowTime = Date.now();
	const isFuture = !isNaN(parsedArticleTime) && parsedArticleTime > nowTime + 60 * 1e3;
	if (finalStatus === "Published") {
		if (parsedArticleTime > nowTime) formattedDate = getNowSql();
	} else if (finalStatus === "Scheduled") {
		if (!isFuture) {
			const plus1Hr = new Date(nowTime + 3600 * 1e3);
			const pad = (n) => String(n).padStart(2, "0");
			formattedDate = `${plus1Hr.getFullYear()}-${pad(plus1Hr.getMonth() + 1)}-${pad(plus1Hr.getDate())} ${pad(plus1Hr.getHours())}:${pad(plus1Hr.getMinutes())}:00`;
		}
	}
	const values = [
		r.title || (existingRow?.title ?? ""),
		slug,
		r.category || (existingRow?.category ?? "Uncategorized"),
		r.city ?? existingRow?.city ?? "",
		r.state ?? existingRow?.state ?? "",
		r.country ?? existingRow?.country ?? "",
		r.author || (existingRow?.author ?? "Admin User"),
		Number(r.views ?? existingRow?.views ?? 0) || 0,
		finalStatus,
		formattedDate,
		r.excerpt ?? existingRow?.excerpt ?? "",
		r.content ?? existingRow?.content ?? "",
		r.featuredImage ?? existingRow?.featuredImage ?? "",
		r.ogImage || r.featuredImage || (existingRow?.ogImage ?? ""),
		r.imageCaption ?? existingRow?.imageCaption ?? "",
		r.imageCredit ?? existingRow?.imageCredit ?? "",
		r.metaTitle ?? existingRow?.metaTitle ?? "",
		r.metaDescription ?? existingRow?.metaDescription ?? "",
		r.tags ?? existingRow?.tags ?? "",
		(r.featured !== void 0 ? Boolean(r.featured) : Boolean(existingRow?.featured)) ? 1 : 0,
		r.newsType || (existingRow?.newsType ?? "Standard"),
		r.journalistId ?? existingRow?.journalistId ?? "",
		r.journalistName ?? existingRow?.journalistName ?? "",
		r.access_level || (existingRow?.access_level ?? "Free")
	];
	if (isExisting) {
		await query(`UPDATE articles SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`, [...values, r.id]);
		Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
		return {
			...r,
			status: finalStatus,
			date: formattedDate,
			slug,
			id: r.id
		};
	} else {
		const result = await query(`INSERT INTO articles (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`, values);
		Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
		return {
			...r,
			status: finalStatus,
			date: formattedDate,
			slug,
			id: result.insertId
		};
	}
});
var getAdminAuthorProfiles_createServerFn_handler = createServerRpc({
	id: "4f060819d3520f81ab864fe370ef176de6c7d786ba07ef7cb5f8964d28bed07f",
	name: "getAdminAuthorProfiles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAdminAuthorProfiles.__executeServer(opts));
var getAdminAuthorProfiles = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getAdminAuthorProfiles_createServerFn_handler, async () => {
	try {
		return (await query(`
        SELECT DISTINCT u.id, COALESCE(p.display_name, u.display_name, u.email) AS name, u.username, u.email, p.phone, r.role
        FROM users u
        LEFT JOIN profiles p ON u.id = p.id
        JOIN user_roles r ON u.id = r.user_id
        WHERE r.role IN ('admin', 'editor', 'author', 'journalist')
        ORDER BY FIELD(r.role, 'admin', 'editor', 'author', 'journalist'), name ASC
      `)).map((r) => ({
			id: r.id,
			name: r.name,
			username: r.username,
			role: r.role
		}));
	} catch {
		return (await query(`
        SELECT DISTINCT 
          u.id, 
          COALESCE(p.display_name, u.display_name, u.email) AS name, 
          r.role
        FROM users u
        LEFT JOIN profiles p ON u.id = p.id
        JOIN user_roles r ON u.id = r.user_id
        WHERE r.role IN ('admin', 'editor', 'author', 'journalist')
        ORDER BY FIELD(r.role, 'admin', 'editor', 'author', 'journalist'), name ASC
      `)).map((r) => ({
			id: r.id,
			name: r.name,
			role: r.role
		}));
	}
});
var trashAdminArticle_createServerFn_handler = createServerRpc({
	id: "47f3e98dfa8065a7eb67b3c8ebe13819fd9ecf8a2128a4f73e1c19d4c3cd5508",
	name: "trashAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => trashAdminArticle.__executeServer(opts));
var trashAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(trashAdminArticle_createServerFn_handler, async ({ data: id }) => {
	await query("UPDATE articles SET status = 'Trash' WHERE id = ?", [id]);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var restoreAdminArticle_createServerFn_handler = createServerRpc({
	id: "d14c976fc9d27f7cba055065c2d8be0c91411a65384e1cee39634635f87cd1cc",
	name: "restoreAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => restoreAdminArticle.__executeServer(opts));
var restoreAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(restoreAdminArticle_createServerFn_handler, async ({ data: id }) => {
	await query("UPDATE articles SET status = 'Draft' WHERE id = ?", [id]);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var deletePermanentlyAdminArticle_createServerFn_handler = createServerRpc({
	id: "2a539a1f2abfb0faa00e3c69f05d6961a00be0f490e8ac4a1e983afb2cea8b08",
	name: "deletePermanentlyAdminArticle",
	filename: "src/lib/articles.functions.ts"
}, (opts) => deletePermanentlyAdminArticle.__executeServer(opts));
var deletePermanentlyAdminArticle = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((id) => id).handler(deletePermanentlyAdminArticle_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM articles WHERE id = ?", [id]);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var trashAdminArticlesBulk_createServerFn_handler = createServerRpc({
	id: "89fc6e633758384ac3ff1727b979f26efdb0707b0620698d8e1b69bf02cbe1d3",
	name: "trashAdminArticlesBulk",
	filename: "src/lib/articles.functions.ts"
}, (opts) => trashAdminArticlesBulk.__executeServer(opts));
var trashAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(trashAdminArticlesBulk_createServerFn_handler, async ({ data: ids }) => {
	if (ids.length === 0) return { success: true };
	await query(`UPDATE articles SET status = 'Trash' WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var restoreAdminArticlesBulk_createServerFn_handler = createServerRpc({
	id: "d5a9474dac158835730ec1660c29a33bc39e42dbf22db6c74184a5837442ce3c",
	name: "restoreAdminArticlesBulk",
	filename: "src/lib/articles.functions.ts"
}, (opts) => restoreAdminArticlesBulk.__executeServer(opts));
var restoreAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(restoreAdminArticlesBulk_createServerFn_handler, async ({ data: ids }) => {
	if (ids.length === 0) return { success: true };
	await query(`UPDATE articles SET status = 'Draft' WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var deletePermanentlyAdminArticlesBulk_createServerFn_handler = createServerRpc({
	id: "5793221b7208fe5998cf899cbabb3dc0129a36e9333df1fd20efee344b372c3a",
	name: "deletePermanentlyAdminArticlesBulk",
	filename: "src/lib/articles.functions.ts"
}, (opts) => deletePermanentlyAdminArticlesBulk.__executeServer(opts));
var deletePermanentlyAdminArticlesBulk = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((ids) => ids).handler(deletePermanentlyAdminArticlesBulk_createServerFn_handler, async ({ data: ids }) => {
	if (ids.length === 0) return { success: true };
	await query(`DELETE FROM articles WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var emptyTrashAdminArticles_createServerFn_handler = createServerRpc({
	id: "c57cf768f00d2d98b4493cfc9864c3854c188071e1099484f44c676f99ce2cb2",
	name: "emptyTrashAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => emptyTrashAdminArticles.__executeServer(opts));
var emptyTrashAdminArticles = createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(emptyTrashAdminArticles_createServerFn_handler, async () => {
	await query("DELETE FROM articles WHERE status = 'Trash'");
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var getAllAdminArticles_createServerFn_handler = createServerRpc({
	id: "e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3",
	name: "getAllAdminArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getAllAdminArticles.__executeServer(opts));
var getAllAdminArticles = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getAllAdminArticles_createServerFn_handler, async () => {
	return (await query(`
      SELECT id, title, slug, category, city, state, country, author, views, status, date,
             excerpt, content, featuredImage, ogImage, imageCaption, imageCredit, metaTitle, metaDescription, tags, featured,
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
var importAdminArticles = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((articles) => articles).handler(importAdminArticles_createServerFn_handler, async ({ data: articles }) => {
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
			r.category || "Uncategorized",
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
	Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
	return { success: true };
});
var PUBLIC_CARD_COLUMNS = `
  id, title, slug, category, city, state, country, author, views, status, date,
  excerpt, featuredImage, ogImage, imageCaption, imageCredit, tags, featured, newsType, journalistId, journalistName, access_level
`;
var searchPublicArticles_createServerFn_handler = createServerRpc({
	id: "476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3",
	name: "searchPublicArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => searchPublicArticles.__executeServer(opts));
var searchPublicArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(searchPublicArticles_createServerFn_handler, async ({ data }) => {
	const { q = "", category = "All", page = 1, limit = 15 } = data;
	const offset = (page - 1) * limit;
	let countSql = "SELECT COUNT(*) as total FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()";
	let selectSql = `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()`;
	const params = [];
	let filterSql = "";
	if (q) {
		filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)";
		const term = `%${q}%`;
		params.push(term, term, term);
	}
	if (category && category !== "All") {
		filterSql += " AND (category = ? OR category LIKE ? OR category LIKE ? OR category LIKE ? OR category LIKE ?)";
		params.push(category, `${category},%`, `%, ${category}`, `%, ${category},%`, `%,${category},%`);
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
	let decoded = slug;
	try {
		decoded = decodeURIComponent(slug);
	} catch (_) {}
	const rows = await query("SELECT * FROM articles WHERE slug = ? OR slug = ? LIMIT 1", [slug, decoded]);
	if (rows.length === 0) return null;
	const row = rows[0];
	if (row.status === "Trash") return null;
	if ((row.status === "Scheduled" || row.status === "Published") && row.date && new Date(row.date).getTime() > Date.now()) return null;
	query("UPDATE articles SET views = views + 1 WHERE id = ?", [row.id]).catch((err) => {
		console.error("[MySQL] Failed to increment views:", err);
	});
	return {
		...row,
		featured: Boolean(row.featured)
	};
});
var getPublicRelatedArticles_createServerFn_handler = createServerRpc({
	id: "c74c43aca09bd4ab35cb549fc9dd0b4b72af2f5002be44cbebcff373c6340867",
	name: "getPublicRelatedArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getPublicRelatedArticles.__executeServer(opts));
var getPublicRelatedArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(getPublicRelatedArticles_createServerFn_handler, async ({ data }) => {
	const { category, currentSlug = "", limit = 4 } = data;
	const safeLimit = Math.min(Math.max(1, limit), 8);
	let rows = [];
	if (category && category !== "All" && category.trim()) rows = await query(`SELECT ${PUBLIC_CARD_COLUMNS} FROM articles 
         WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() AND slug != ?
         AND (category = ? OR category LIKE ? OR category LIKE ? OR category LIKE ? OR category LIKE ?)
         ORDER BY date DESC, id DESC LIMIT ?`, [
		currentSlug,
		category,
		`${category},%`,
		`%, ${category}`,
		`%, ${category},%`,
		`%,${category},%`,
		safeLimit
	]);
	if (rows.length < safeLimit) {
		const needed = safeLimit - rows.length;
		const excludeSlugs = [currentSlug, ...rows.map((r) => r.slug)].filter(Boolean);
		const placeholders = excludeSlugs.map(() => "?").join(", ");
		const fillRows = await query(excludeSlugs.length > 0 ? `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles 
           WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() AND slug NOT IN (${placeholders})
           ORDER BY date DESC, id DESC LIMIT ?` : `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles 
           WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()
           ORDER BY date DESC, id DESC LIMIT ?`, excludeSlugs.length > 0 ? [...excludeSlugs, needed] : [needed]);
		rows = [...rows, ...fillRows || []];
	}
	return (rows || []).map((r) => ({
		...r,
		featured: Boolean(r.featured)
	}));
});
var getPublicArchiveArticles_createServerFn_handler = createServerRpc({
	id: "7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e",
	name: "getPublicArchiveArticles",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getPublicArchiveArticles.__executeServer(opts));
var getPublicArchiveArticles = createServerFn({ method: "GET" }).validator((data) => data).handler(getPublicArchiveArticles_createServerFn_handler, async ({ data }) => {
	const { year, month, day, page = 1, limit = 15 } = data;
	const offset = (page - 1) * limit;
	let sql = `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()`;
	let countSql = "SELECT COUNT(*) as total FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()";
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
                excerpt, SUBSTRING(content, 1, 2500) AS content, featuredImage, ogImage, tags, featured, newsType, journalistId, journalistName, access_level
         FROM articles 
         WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() 
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
			TTL: 5 * 1e3
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
var getAdminDashboardStats = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getAdminDashboardStats_createServerFn_handler, async () => {
	const [articlesCountRes, viewsCountRes, usersCountRes, commentsCountRes, subscribersCountRes, journalistsCountRes, recentArticles, topArticles, categoryStats] = await Promise.all([
		query("SELECT COUNT(*) as count FROM articles").catch(() => [{ count: 0 }]),
		query("SELECT COALESCE(SUM(views), 0) as count FROM articles").catch(() => [{ count: 0 }]),
		query("SELECT COUNT(*) as count FROM users").catch(() => [{ count: 0 }]),
		query("SELECT COUNT(*) as count FROM comments").catch(() => [{ count: 0 }]),
		query(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM user_roles 
        WHERE role IN ('premium', 'subscriber')
      `).catch(() => [{ count: 0 }]),
		query(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM user_roles 
        WHERE role = 'journalist'
      `).catch(async () => {
			return query("SELECT COUNT(*) as count FROM profiles WHERE journalist_id IS NOT NULL AND journalist_id != ''").catch(() => [{ count: 0 }]);
		}),
		query(`
        SELECT id, title, slug, category, views, date, featuredImage, featured, newsType, status 
        FROM articles 
        ORDER BY date DESC, id DESC 
        LIMIT 10
      `).catch(() => []),
		query(`
        SELECT id, title, slug, category, views, date, featuredImage, featured, newsType, status 
        FROM articles 
        ORDER BY views DESC, id DESC 
        LIMIT 30
      `).catch(() => []),
		query(`
        SELECT category as name, COUNT(*) as count, COALESCE(SUM(views), 0) as views 
        FROM articles 
        WHERE category IS NOT NULL AND category != '' 
        GROUP BY category 
        ORDER BY count DESC 
        LIMIT 8
      `).catch(() => [])
	]);
	const totalArticles = Number(articlesCountRes?.[0]?.count) || 0;
	const totalViews = Number(viewsCountRes?.[0]?.count) || 0;
	const totalUsers = Number(usersCountRes?.[0]?.count) || 0;
	const totalComments = Number(commentsCountRes?.[0]?.count) || 0;
	let totalSubscribers = Number(subscribersCountRes?.[0]?.count) || 0;
	let totalJournalists = Number(journalistsCountRes?.[0]?.count) || 0;
	if (totalJournalists === 0) try {
		const pJournalists = await query("SELECT COUNT(*) as count FROM profiles WHERE journalist_id IS NOT NULL AND journalist_id != ''");
		totalJournalists = Number(pJournalists?.[0]?.count) || 0;
	} catch {}
	const totalRevenue = totalSubscribers > 0 ? totalSubscribers * 149 : 0;
	const featuredArticles = (topArticles || []).filter((a) => Boolean(a.featured) || a.newsType === "Featured" || a.newsType === "Exclusive");
	return {
		totalArticles,
		totalViews,
		totalUsers,
		totalComments,
		totalSubscribers,
		totalJournalists,
		totalRevenue,
		recentArticles: recentArticles || [],
		topArticles: topArticles || [],
		featuredArticles: featuredArticles.length > 0 ? featuredArticles : (recentArticles || []).slice(0, 5),
		categoryStats: categoryStats || [],
		currencySymbol: "₹"
	};
});
//#endregion
export { deletePermanentlyAdminArticle_createServerFn_handler, deletePermanentlyAdminArticlesBulk_createServerFn_handler, emptyTrashAdminArticles_createServerFn_handler, getAdminArticleById_createServerFn_handler, getAdminArticles_createServerFn_handler, getAdminAuthorProfiles_createServerFn_handler, getAdminDashboardStats_createServerFn_handler, getAllAdminArticles_createServerFn_handler, getHomepageArticles_createServerFn_handler, getPublicArchiveArticles_createServerFn_handler, getPublicArticleBySlug_createServerFn_handler, getPublicRelatedArticles_createServerFn_handler, importAdminArticles_createServerFn_handler, restoreAdminArticle_createServerFn_handler, restoreAdminArticlesBulk_createServerFn_handler, saveAdminArticle_createServerFn_handler, searchPublicArticles_createServerFn_handler, trashAdminArticle_createServerFn_handler, trashAdminArticlesBulk_createServerFn_handler };

//# sourceMappingURL=articles.functions-DCSD4L9k.js.map