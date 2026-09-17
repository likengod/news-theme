import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-C5FUYsYg.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
//#region src/lib/comments.ai.ts
var generateDummyCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(createSsrRpc("3f45f09c0a8c44c2e7fec139cc3fdb27d935e1757387119c458a56c601a5a3f0"));
//#endregion
//#region src/lib/comments.functions.ts
var getAdminComments = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => data ?? {}).handler(createSsrRpc("77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702"));
var updateCommentStatus = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(createSsrRpc("7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c"));
var deleteComment = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(createSsrRpc("132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575"));
var deleteAllCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data ?? {}).handler(createSsrRpc("cb6b8bf70884edd100e4ea383f633fbb54f6556775a50e424c5efbc73a7ba76d"));
var getAllCommentsFn = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("78f4c911acbdaabc3934ef25173a7247b252784ce0cec0a0d21a5c58599140db"));
var importCommentsFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => data).handler(createSsrRpc("dfcb04800cdeb31e774b458dd497514b9ddeaa58e171298b91f1907be9a8c7b2"));
var getArticleComments = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401"));
var postArticleComment = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44"));
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
var lookupArticleByUrlOrSlugFn = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((input) => input).handler(createSsrRpc("ea95d7a78753f255e229f0ab8bcfcbe50478660db4ce742569cf640edc33c4d2"));
var getRecentArticlesForCommentsFn = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("3557b9ece7703e953e66289bb9ad0f4391b8d47ff6fdc4d5652e508a58f71699"));
//#endregion
export { getAllCommentsFn as a, importCommentsFn as c, updateCommentStatus as d, generateDummyCommentsFn as f, getAdminComments as i, lookupArticleByUrlOrSlugFn as l, deleteComment as n, getArticleComments as o, extractSlugFromUrl as r, getRecentArticlesForCommentsFn as s, deleteAllCommentsFn as t, postArticleComment as u };

//# sourceMappingURL=comments.functions-BfiNlLzL.js.map