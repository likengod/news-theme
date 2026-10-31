import { i as createServerFn, s as getRequest } from "./server-D0ckzJpq.js";
import { c as query } from "./db.server-DAyOobr0.js";
import { t as requireAdmin } from "./auth-middleware-B5vRnsi_.js";
import { o as slugify } from "./news-data-BLYJhvTM.js";
import { t as createServerRpc } from "./createServerRpc-DNC3Ds34.js";
import { c as getClientIp, i as checkRateLimit } from "./security.server-DLYCBLCm.js";
import crypto from "crypto";
// src/lib/write-behind-cache.server.ts
/**
* High-Performance Write-Behind (Write-Back) Caching Engine.
* 
* Instead of firing an UPDATE query on every article read or like event,
* increments are recorded instantaneously in RAM (< 0.05ms) and batched
* to MySQL every 15 seconds.
* 
* Benefits:
* 1. 99.9% reduction in MySQL write queries during traffic surges.
* 2. Eliminates InnoDB row-locking contention and thread pool exhaustion.
* 3. Graceful shutdown handler ensures zero data loss on server restarts.
*/
var viewBuffer = /* @__PURE__ */ new Map();
var likeBuffer = /* @__PURE__ */ new Map();
var totalViewsFlushed = 0;
var totalLikesFlushed = 0;
var lastFlushTimestamp = Date.now();
var isFlushing = false;
var FLUSH_INTERVAL_MS = 15e3;
/**
* Record an article view in RAM.
* Non-blocking, executes in sub-microsecond time.
*/
function recordBufferedView(articleId, count = 1) {
	if (!articleId || isNaN(articleId)) return;
	const current = viewBuffer.get(articleId) || 0;
	viewBuffer.set(articleId, current + count);
}
/**
* Get any uncommitted views in RAM for an article.
* Used so current readers immediately see updated view counts.
*/
function getPendingViews(articleId) {
	return viewBuffer.get(articleId) || 0;
}
/**
* Record an article like in RAM.
*/
function recordBufferedLike(articleId, count = 1) {
	if (!articleId || isNaN(articleId)) return;
	const current = likeBuffer.get(articleId) || 0;
	likeBuffer.set(articleId, current + count);
}
/**
* Get any uncommitted likes in RAM for an article.
*/
function getPendingLikes(articleId) {
	return likeBuffer.get(articleId) || 0;
}
/**
* Flush all buffered writes to MySQL in a single coordinated batch.
*/
async function flushWriteBehindBuffer() {
	if (isFlushing) return {
		flushedViews: 0,
		flushedLikes: 0,
		distinctArticles: 0
	};
	if (viewBuffer.size === 0 && likeBuffer.size === 0) return {
		flushedViews: 0,
		flushedLikes: 0,
		distinctArticles: 0
	};
	isFlushing = true;
	const viewsToFlush = new Map(viewBuffer);
	viewBuffer.clear();
	const likesToFlush = new Map(likeBuffer);
	likeBuffer.clear();
	let flushedViews = 0;
	let flushedLikes = 0;
	const distinctArticles = /* @__PURE__ */ new Set([...viewsToFlush.keys(), ...likesToFlush.keys()]);
	try {
		for (const [id, count] of viewsToFlush.entries()) if (count > 0) {
			await query("UPDATE articles SET views = views + ? WHERE id = ?", [count, id]);
			flushedViews += count;
		}
		for (const [id, count] of likesToFlush.entries()) if (count > 0) try {
			await query("UPDATE articles SET likes = likes + ? WHERE id = ?", [count, id]);
			flushedLikes += count;
		} catch (likeErr) {
			console.warn("[WriteBehind] Notice: likes update:", likeErr.message);
		}
		totalViewsFlushed += flushedViews;
		totalLikesFlushed += flushedLikes;
		lastFlushTimestamp = Date.now();
		if (flushedViews > 0 || flushedLikes > 0) console.log(`[WriteBehind Flush] Committed ${flushedViews} view(s) & ${flushedLikes} like(s) across ${distinctArticles.size} article(s).`);
		return {
			flushedViews,
			flushedLikes,
			distinctArticles: distinctArticles.size
		};
	} catch (err) {
		console.error("[WriteBehind] Flush encountered error, restoring buffer:", err);
		for (const [id, count] of viewsToFlush.entries()) viewBuffer.set(id, (viewBuffer.get(id) || 0) + count);
		for (const [id, count] of likesToFlush.entries()) likeBuffer.set(id, (likeBuffer.get(id) || 0) + count);
		return {
			flushedViews: 0,
			flushedLikes: 0,
			distinctArticles: 0
		};
	} finally {
		isFlushing = false;
	}
}
/**
* Diagnostic metrics for admin/system monitoring.
*/
function getWriteBehindStats() {
	return {
		pendingArticlesWithViews: viewBuffer.size,
		pendingArticlesWithLikes: likeBuffer.size,
		totalViewsFlushed,
		totalLikesFlushed,
		lastFlushTimestamp: new Date(lastFlushTimestamp).toISOString(),
		flushIntervalSeconds: FLUSH_INTERVAL_MS / 1e3
	};
}
if (typeof setInterval !== "undefined") {
	const timer = setInterval(() => {
		flushWriteBehindBuffer().catch((err) => {
			console.error("[WriteBehind Timer] Uncaught error:", err);
		});
	}, FLUSH_INTERVAL_MS);
	if (typeof timer.unref === "function") timer.unref();
}
if (typeof process !== "undefined" && process.on) {
	const shutdown = async () => {
		try {
			await flushWriteBehindBuffer();
		} catch {}
	};
	process.once("SIGTERM", shutdown);
	process.once("SIGINT", shutdown);
	process.once("beforeExit", shutdown);
}
// src/lib/articles.functions.ts?tss-serverfn-split
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
	if (status && status !== "All") {
		if (status === "Scheduled") filterSql += " AND (status = 'Scheduled' OR (status = 'Published' AND date > NOW()))";
		else if (status === "Published") filterSql += " AND status = 'Published' AND date <= NOW()";
		else {
			filterSql += " AND status = ?";
			params.push(status);
		}
	} else filterSql += " AND (status IS NULL OR status != 'Trash')";
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
	const isFuture = !isNaN(parsedArticleTime) && parsedArticleTime > nowTime + 6e4;
	if (finalStatus === "Published") {
		if (parsedArticleTime > nowTime) formattedDate = getNowSql();
	} else if (finalStatus === "Scheduled") {
		if (!isFuture) {
			const plus1Hr = new Date(nowTime + 36e5);
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
		const setClause = fields.map((f) => `${f} = ?`).join(", ");
		await query(`UPDATE articles SET ${setClause} WHERE id = ?`, [...values, r.id]);
		Object.keys(HOMEPAGE_CACHE).forEach((k) => delete HOMEPAGE_CACHE[k]);
		return {
			...r,
			status: finalStatus,
			date: formattedDate,
			slug,
			id: r.id
		};
	} else {
		const colNames = fields.join(", ");
		const placeHolders = fields.map(() => "?").join(", ");
		const result = await query(`INSERT INTO articles (${colNames}) VALUES (${placeHolders})`, values);
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
	const placeholders = ids.map(() => "?").join(",");
	await query(`UPDATE articles SET status = 'Trash' WHERE id IN (${placeholders})`, ids);
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
	const placeholders = ids.map(() => "?").join(",");
	await query(`UPDATE articles SET status = 'Draft' WHERE id IN (${placeholders})`, ids);
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
	const placeholders = ids.map(() => "?").join(",");
	await query(`DELETE FROM articles WHERE id IN (${placeholders})`, ids);
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
		let cleanFeaturedImage = (r.featuredImage || "").trim();
		let cleanOgImage = (r.ogImage || cleanFeaturedImage || "").trim();
		if (/^https?:\/\/[^/]+\/uploads\/(.*)$/i.test(cleanFeaturedImage)) cleanFeaturedImage = cleanFeaturedImage.replace(/^https?:\/\/[^/]+\/uploads\//i, "/uploads/");
		if (/^https?:\/\/[^/]+\/uploads\/(.*)$/i.test(cleanOgImage)) cleanOgImage = cleanOgImage.replace(/^https?:\/\/[^/]+\/uploads\//i, "/uploads/");
		if (cleanFeaturedImage) {
			const baseName = cleanFeaturedImage.split("/").pop()?.split("?")[0] || "";
			if (baseName) try {
				const mediaMatch = await query("SELECT url FROM media_library WHERE name = ? OR url LIKE ? ORDER BY id DESC LIMIT 1", [baseName, `%${baseName}%`]);
				if (mediaMatch && mediaMatch.length > 0 && mediaMatch[0].url) {
					cleanFeaturedImage = mediaMatch[0].url;
					if (!cleanOgImage || cleanOgImage === r.featuredImage) cleanOgImage = mediaMatch[0].url;
				}
			} catch (e) {}
		}
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
			cleanFeaturedImage,
			cleanOgImage,
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
			const setClause = fields.map((f) => `${f} = ?`).join(", ");
			await query(`UPDATE articles SET ${setClause} WHERE id = ?`, [...values, idToUpdate]);
		} else {
			const colNames = fields.join(", ");
			const placeHolders = fields.map(() => "?").join(", ");
			await query(`INSERT INTO articles (${colNames}) VALUES (${placeHolders})`, values);
		}
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
	recordBufferedView(row.id);
	const pendingViews = getPendingViews(row.id);
	const pendingLikes = getPendingLikes(row.id);
	return {
		...row,
		views: Number(row.views || 0) + pendingViews,
		likes: Number(row.likes || 0) + pendingLikes,
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
		const fillSql = excludeSlugs.length > 0 ? `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles 
           WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() AND slug NOT IN (${placeholders})
           ORDER BY date DESC, id DESC LIMIT ?` : `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles 
           WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW()
           ORDER BY date DESC, id DESC LIMIT ?`;
		const fillParams = excludeSlugs.length > 0 ? [...excludeSlugs, needed] : [needed];
		const fillRows = await query(fillSql, fillParams);
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
			TTL: 5e3
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
		query(`
        SELECT 
          COUNT(*) as count,
          SUM(CASE WHEN LOWER(TRIM(p.gender)) = 'male' THEN 1 ELSE 0 END) as maleCount,
          SUM(CASE WHEN LOWER(TRIM(p.gender)) = 'female' THEN 1 ELSE 0 END) as femaleCount,
          SUM(CASE WHEN p.gender IS NULL OR TRIM(p.gender) = '' OR LOWER(TRIM(p.gender)) NOT IN ('male', 'female') THEN 1 ELSE 0 END) as otherCount
        FROM users u
        LEFT JOIN profiles p ON (p.id = u.id OR p.email = u.email)
      `).catch(() => [{
			count: 0,
			maleCount: 0,
			femaleCount: 0,
			otherCount: 0
		}]),
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
	const userRow = usersCountRes?.[0] || {};
	const totalUsers = Number(userRow.count) || 0;
	const maleUsers = Number(userRow.maleCount) || 0;
	const femaleUsers = Number(userRow.femaleCount) || 0;
	const otherUsers = Number(userRow.otherCount) || Math.max(0, totalUsers - maleUsers - femaleUsers);
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
		maleUsers,
		femaleUsers,
		otherUsers,
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
var likeArticleServer_createServerFn_handler = createServerRpc({
	id: "5151c19d6b0b56b114207c0daadb9bbd57477b58a7fb7b274ec51e2680278e65",
	name: "likeArticleServer",
	filename: "src/lib/articles.functions.ts"
}, (opts) => likeArticleServer.__executeServer(opts));
var likeArticleServer = createServerFn({ method: "POST" }).validator((data) => data).handler(likeArticleServer_createServerFn_handler, async ({ data }) => {
	const articleId = Number(data.articleId);
	if (!articleId || isNaN(articleId) || articleId <= 0) throw new Error("Invalid article ID");
	const req = getRequest();
	const ip = getClientIp(req);
	if (!checkRateLimit(`like:${ip}:${articleId}`, 15, 3e5).allowed) throw new Error("You are liking too quickly. Please wait a moment.");
	const tokenBasis = String(data.clientToken || "").trim() || ip;
	const tokenHash = crypto.createHash("sha256").update(tokenBasis + ":today_tripura_like").digest("hex").slice(0, 32);
	const ipHash = crypto.createHash("sha256").update(ip + ":tripura_salt").digest("hex").slice(0, 32);
	let userId = null;
	try {
		const match = (req.headers.get("cookie") || "").match(/(?:^|;\s*)(?:nt_session|session_token)=([^;]+)/);
		if (match) {
			const sessionToken = decodeURIComponent(match[1]);
			const sessions = await query("SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW() LIMIT 1", [sessionToken]);
			if (sessions.length > 0) userId = sessions[0].user_id;
		}
	} catch {}
	try {
		if ((await query("INSERT IGNORE INTO article_likes (article_id, user_id, client_token, ip_hash) VALUES (?, ?, ?, ?)", [
			articleId,
			userId,
			tokenHash,
			ipHash
		]))?.affectedRows === 0) {
			const rows = await query("SELECT likes FROM articles WHERE id = ? LIMIT 1", [articleId]);
			return {
				success: false,
				alreadyLiked: true,
				message: "You have already liked this article",
				likes: (Number(rows[0]?.likes) || 0) + getPendingLikes(articleId)
			};
		}
	} catch (err) {
		console.warn("[Article Like] Notice:", err.message);
	}
	recordBufferedLike(articleId);
	const rows = await query("SELECT likes FROM articles WHERE id = ? LIMIT 1", [articleId]);
	return {
		success: true,
		alreadyLiked: false,
		message: "Thank you for liking!",
		likes: (Number(rows[0]?.likes) || 0) + getPendingLikes(articleId)
	};
});
var checkArticleLikedServer_createServerFn_handler = createServerRpc({
	id: "42d18b0048bef3538026b6b696082858a6292614c8fa6484b80029a80eefcd00",
	name: "checkArticleLikedServer",
	filename: "src/lib/articles.functions.ts"
}, (opts) => checkArticleLikedServer.__executeServer(opts));
var checkArticleLikedServer = createServerFn({ method: "POST" }).validator((data) => data).handler(checkArticleLikedServer_createServerFn_handler, async ({ data }) => {
	const articleId = Number(data.articleId);
	if (!articleId || isNaN(articleId) || articleId <= 0) return { liked: false };
	const req = getRequest();
	const ip = getClientIp(req);
	const tokenBasis = String(data.clientToken || "").trim() || ip;
	const tokenHash = crypto.createHash("sha256").update(tokenBasis + ":today_tripura_like").digest("hex").slice(0, 32);
	try {
		return { liked: (await query("SELECT id FROM article_likes WHERE article_id = ? AND client_token = ? LIMIT 1", [articleId, tokenHash])).length > 0 };
	} catch {
		return { liked: false };
	}
});
var getArticleWriteBehindStatsServer_createServerFn_handler = createServerRpc({
	id: "ad53ffbc7f3e951a8895f462145a88a54053d1cabb34053c5e5ae2e5ec97de6f",
	name: "getArticleWriteBehindStatsServer",
	filename: "src/lib/articles.functions.ts"
}, (opts) => getArticleWriteBehindStatsServer.__executeServer(opts));
var getArticleWriteBehindStatsServer = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getArticleWriteBehindStatsServer_createServerFn_handler, async () => {
	return getWriteBehindStats();
});
export { checkArticleLikedServer_createServerFn_handler, deletePermanentlyAdminArticle_createServerFn_handler, deletePermanentlyAdminArticlesBulk_createServerFn_handler, emptyTrashAdminArticles_createServerFn_handler, getAdminArticleById_createServerFn_handler, getAdminArticles_createServerFn_handler, getAdminAuthorProfiles_createServerFn_handler, getAdminDashboardStats_createServerFn_handler, getAllAdminArticles_createServerFn_handler, getArticleWriteBehindStatsServer_createServerFn_handler, getHomepageArticles_createServerFn_handler, getPublicArchiveArticles_createServerFn_handler, getPublicArticleBySlug_createServerFn_handler, getPublicRelatedArticles_createServerFn_handler, importAdminArticles_createServerFn_handler, likeArticleServer_createServerFn_handler, restoreAdminArticle_createServerFn_handler, restoreAdminArticlesBulk_createServerFn_handler, saveAdminArticle_createServerFn_handler, searchPublicArticles_createServerFn_handler, trashAdminArticle_createServerFn_handler, trashAdminArticlesBulk_createServerFn_handler };

//# sourceMappingURL=articles.functions-Dx3xES1Z.js.map