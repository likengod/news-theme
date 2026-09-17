import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-CzbwKkqR.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/comments.functions.ts?tss-serverfn-split
var getAdminComments_createServerFn_handler = createServerRpc({
	id: "77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702",
	name: "getAdminComments",
	filename: "src/lib/comments.functions.ts"
}, (opts) => getAdminComments.__executeServer(opts));
var getAdminComments = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => data ?? {}).handler(getAdminComments_createServerFn_handler, async ({ data }) => {
	const { status = "All", q = "", page = 1, limit = 20 } = data;
	const safeLimit = Math.min(Math.max(1, limit), 100);
	const offset = (Math.max(1, page) - 1) * safeLimit;
	let filterSql = " WHERE 1=1";
	const params = [];
	if (status && status !== "All") {
		filterSql += " AND status = ?";
		params.push(status);
	}
	if (q) {
		filterSql += " AND (body LIKE ? OR user_name LIKE ? OR user_email LIKE ? OR article_title LIKE ?)";
		const term = `%${q}%`;
		params.push(term, term, term, term);
	}
	const [countRes, rows] = await Promise.all([query(`SELECT COUNT(*) AS total FROM comments${filterSql}`, params), query(`SELECT id, article_slug, article_title, user_name, user_email, body, status, created_at
         FROM comments${filterSql} 
         ORDER BY created_at DESC, id DESC 
         LIMIT ? OFFSET ?`, [
		...params,
		safeLimit,
		offset
	])]);
	const total = Number(countRes[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / safeLimit));
	return {
		rows: rows.map((r) => ({
			id: r.id,
			articleSlug: r.article_slug,
			articleTitle: r.article_title,
			user: r.user_name,
			email: r.user_email,
			body: r.body,
			status: r.status,
			date: new Date(r.created_at).toISOString().slice(0, 10)
		})),
		total,
		totalPages
	};
});
var updateCommentStatus_createServerFn_handler = createServerRpc({
	id: "7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c",
	name: "updateCommentStatus",
	filename: "src/lib/comments.functions.ts"
}, (opts) => updateCommentStatus.__executeServer(opts));
var updateCommentStatus = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(updateCommentStatus_createServerFn_handler, async ({ data }) => {
	await query("UPDATE comments SET status = ? WHERE id = ?", [data.status, data.id]);
	return { success: true };
});
var deleteComment_createServerFn_handler = createServerRpc({
	id: "132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575",
	name: "deleteComment",
	filename: "src/lib/comments.functions.ts"
}, (opts) => deleteComment.__executeServer(opts));
var deleteComment = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM comments WHERE id = ?", [id]);
	return { success: true };
});
var deleteAllCommentsFn_createServerFn_handler = createServerRpc({
	id: "cb6b8bf70884edd100e4ea383f633fbb54f6556775a50e424c5efbc73a7ba76d",
	name: "deleteAllCommentsFn",
	filename: "src/lib/comments.functions.ts"
}, (opts) => deleteAllCommentsFn.__executeServer(opts));
var deleteAllCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data ?? {}).handler(deleteAllCommentsFn_createServerFn_handler, async ({ data }) => {
	if (data.status && data.status !== "All") await query("DELETE FROM comments WHERE status = ?", [data.status]);
	else await query("DELETE FROM comments", []);
	const [{ count }] = await query("SELECT COUNT(*) as count FROM comments", []);
	return {
		success: true,
		remaining: count
	};
});
var getAllCommentsFn_createServerFn_handler = createServerRpc({
	id: "78f4c911acbdaabc3934ef25173a7247b252784ce0cec0a0d21a5c58599140db",
	name: "getAllCommentsFn",
	filename: "src/lib/comments.functions.ts"
}, (opts) => getAllCommentsFn.__executeServer(opts));
var getAllCommentsFn = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getAllCommentsFn_createServerFn_handler, async () => {
	return (await query(`SELECT c.id, c.article_slug, c.article_title, u.display_name AS user_name, u.email, c.body, c.status, c.created_at
       FROM comments c
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`, [])).map((r) => ({
		id: r.id,
		articleSlug: r.article_slug,
		articleTitle: r.article_title,
		user: r.user_name || "",
		email: r.email || "",
		body: r.body,
		status: r.status,
		date: new Date(r.created_at).toLocaleDateString()
	}));
});
var importCommentsFn_createServerFn_handler = createServerRpc({
	id: "dfcb04800cdeb31e774b458dd497514b9ddeaa58e171298b91f1907be9a8c7b2",
	name: "importCommentsFn",
	filename: "src/lib/comments.functions.ts"
}, (opts) => importCommentsFn.__executeServer(opts));
var importCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(importCommentsFn_createServerFn_handler, async ({ data: rows }) => {
	let inserted = 0;
	for (const row of rows) {
		if (!row.body || !row.articleSlug) continue;
		const status = [
			"Pending",
			"Approved",
			"Spam"
		].includes(row.status) ? row.status : "Pending";
		await query(`INSERT INTO comments (article_slug, article_title, body, status, created_at)
         VALUES (?, ?, ?, ?, NOW())`, [
			row.articleSlug || "",
			row.articleTitle || "",
			row.body,
			status
		]);
		inserted++;
	}
	return {
		success: true,
		inserted
	};
});
var getArticleComments_createServerFn_handler = createServerRpc({
	id: "a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401",
	name: "getArticleComments",
	filename: "src/lib/comments.functions.ts"
}, (opts) => getArticleComments.__executeServer(opts));
var getArticleComments = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getArticleComments_createServerFn_handler, async ({ data: slug }) => {
	return (await query("SELECT * FROM comments WHERE article_slug = ? AND status = 'Approved' ORDER BY created_at ASC", [slug])).map((r) => ({
		id: r.id,
		articleSlug: r.article_slug,
		articleTitle: r.article_title,
		user: r.user_name,
		email: r.user_email,
		body: r.body,
		status: r.status,
		parentId: r.parent_id ?? null,
		date: new Date(r.created_at).toLocaleDateString()
	}));
});
var postArticleComment_createServerFn_handler = createServerRpc({
	id: "77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44",
	name: "postArticleComment",
	filename: "src/lib/comments.functions.ts"
}, (opts) => postArticleComment.__executeServer(opts));
var postArticleComment = createServerFn({ method: "POST" }).validator((data) => data).handler(postArticleComment_createServerFn_handler, async ({ data }) => {
	const SITE_NAME = "News Theme";
	const minChars = data.parentId ? 15 : 30;
	if ([
		/https?:\/\//i,
		/\bwww\./i,
		/<\s*\/?\s*[a-z]+/i,
		/<\s*script/i,
		/javascript:/i,
		/on\w+\s*=/i,
		/\b[\w.-]+\s*(?:\.|\[\s*dot\s*\]|\(\s*dot\s*\)|\s+dot\s+)\s*(?:com|net|org|io|co|in|gov|edu|info|biz|app|dev|xyz|me|us|uk)\b/i,
		/[\w.+-]+@[\w-]+\.[\w.-]+/i
	].some((re) => re.test(data.body))) throw new Error(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
	if (data.body.length < minChars) throw new Error(`${data.parentId ? "Reply" : "Comment"} must be at least ${minChars} characters long.`);
	const words = data.body.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 2);
	const counts = {};
	for (const w of words) {
		const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		if (!cleanWord) continue;
		counts[cleanWord] = (counts[cleanWord] || 0) + 1;
		if (counts[cleanWord] > 5) throw new Error(`A single word cannot be repeated more than 5 times. Please submit a genuine comment.`);
	}
	await query("INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [
		data.articleSlug,
		data.articleTitle,
		data.name,
		data.email,
		data.body,
		"Approved",
		data.parentId ?? null
	]);
	return { success: true };
});
function extractSlugFromUrl(input) {
	if (!input) return "";
	let clean = input.trim();
	clean = clean.split("?")[0].split("#")[0];
	clean = clean.replace(/\/+$/, "");
	if (clean.includes("/")) {
		const parts = clean.split("/").filter(Boolean);
		clean = parts[parts.length - 1] || clean;
	}
	try {
		clean = decodeURIComponent(clean);
	} catch {}
	return clean.trim();
}
var lookupArticleByUrlOrSlugFn_createServerFn_handler = createServerRpc({
	id: "ea95d7a78753f255e229f0ab8bcfcbe50478660db4ce742569cf640edc33c4d2",
	name: "lookupArticleByUrlOrSlugFn",
	filename: "src/lib/comments.functions.ts"
}, (opts) => lookupArticleByUrlOrSlugFn.__executeServer(opts));
var lookupArticleByUrlOrSlugFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((input) => input).handler(lookupArticleByUrlOrSlugFn_createServerFn_handler, async ({ data: rawInput }) => {
	try {
		if (!rawInput || !rawInput.trim()) return {
			found: false,
			article: null
		};
		const cleanSlug = extractSlugFromUrl(rawInput);
		if (!cleanSlug) return {
			found: false,
			article: null
		};
		let rows = await query("SELECT id, title, slug, category, featuredImage FROM articles WHERE slug = ? LIMIT 1", [cleanSlug]);
		if (rows.length === 0 && !isNaN(Number(cleanSlug))) rows = await query("SELECT id, title, slug, category, featuredImage FROM articles WHERE id = ? LIMIT 1", [Number(cleanSlug)]);
		if (rows.length === 0 && cleanSlug.length > 3) rows = await query("SELECT id, title, slug, category, featuredImage FROM articles WHERE slug LIKE ? OR title LIKE ? LIMIT 1", [`%${cleanSlug}%`, `%${cleanSlug}%`]);
		if (rows.length > 0) {
			const a = rows[0];
			return {
				found: true,
				article: {
					id: a.id,
					title: a.title,
					slug: a.slug,
					category: a.category || "General",
					featuredImage: a.featuredImage || ""
				}
			};
		}
		return {
			found: false,
			article: null
		};
	} catch (err) {
		console.error("[lookupArticleByUrlOrSlugFn] error:", err);
		return {
			found: false,
			article: null
		};
	}
});
var getRecentArticlesForCommentsFn_createServerFn_handler = createServerRpc({
	id: "3557b9ece7703e953e66289bb9ad0f4391b8d47ff6fdc4d5652e508a58f71699",
	name: "getRecentArticlesForCommentsFn",
	filename: "src/lib/comments.functions.ts"
}, (opts) => getRecentArticlesForCommentsFn.__executeServer(opts));
var getRecentArticlesForCommentsFn = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(getRecentArticlesForCommentsFn_createServerFn_handler, async () => {
	try {
		return (await query("SELECT id, title, slug FROM articles ORDER BY id DESC LIMIT 50")).map((r) => ({
			id: r.id,
			title: r.title,
			slug: r.slug
		}));
	} catch {
		return [];
	}
});
//#endregion
export { deleteAllCommentsFn_createServerFn_handler, deleteComment_createServerFn_handler, getAdminComments_createServerFn_handler, getAllCommentsFn_createServerFn_handler, getArticleComments_createServerFn_handler, getRecentArticlesForCommentsFn_createServerFn_handler, importCommentsFn_createServerFn_handler, lookupArticleByUrlOrSlugFn_createServerFn_handler, postArticleComment_createServerFn_handler, updateCommentStatus_createServerFn_handler };

//# sourceMappingURL=comments.functions-DnemYWqN.js.map