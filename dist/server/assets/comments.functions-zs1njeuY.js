import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-BbeveDGb.js";
import { t as requireAuth } from "./auth-middleware-DY2CGsEm.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/comments.functions.ts?tss-serverfn-split
var getAdminComments_createServerFn_handler = createServerRpc({
	id: "77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702",
	name: "getAdminComments",
	filename: "src/lib/comments.functions.ts"
}, (opts) => getAdminComments.__executeServer(opts));
var getAdminComments = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(getAdminComments_createServerFn_handler, async ({ data }) => {
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
var updateCommentStatus = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(updateCommentStatus_createServerFn_handler, async ({ data }) => {
	await query("UPDATE comments SET status = ? WHERE id = ?", [data.status, data.id]);
	return { success: true };
});
var deleteComment_createServerFn_handler = createServerRpc({
	id: "132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575",
	name: "deleteComment",
	filename: "src/lib/comments.functions.ts"
}, (opts) => deleteComment.__executeServer(opts));
var deleteComment = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM comments WHERE id = ?", [id]);
	return { success: true };
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
	const MIN_CHARACTERS = 81;
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
	if (data.body.length < MIN_CHARACTERS) throw new Error(`Comment must be at least ${MIN_CHARACTERS} characters long.`);
	const words = data.body.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 2);
	const counts = {};
	for (const w of words) {
		const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		if (!cleanWord) continue;
		counts[cleanWord] = (counts[cleanWord] || 0) + 1;
		if (counts[cleanWord] > 5) throw new Error(`A single word cannot be repeated more than 5 times. Please submit a genuine comment.`);
	}
	await query("INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)", [
		data.articleSlug,
		data.articleTitle,
		data.name,
		data.email,
		data.body,
		"Approved"
	]);
	return { success: true };
});
//#endregion
export { deleteComment_createServerFn_handler, getAdminComments_createServerFn_handler, getArticleComments_createServerFn_handler, postArticleComment_createServerFn_handler, updateCommentStatus_createServerFn_handler };

//# sourceMappingURL=comments.functions-zs1njeuY.js.map