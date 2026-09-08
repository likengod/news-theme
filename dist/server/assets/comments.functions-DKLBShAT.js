import { i as createServerFn } from "./esm-Dova13aH.js";
import { k as createSsrRpc } from "./site-content-BzPQwjRN.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
//#region src/lib/comments.functions.ts
var getAdminComments = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(createSsrRpc("77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702"));
var updateCommentStatus = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c"));
var deleteComment = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575"));
var getArticleComments = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401"));
var postArticleComment = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44"));
//#endregion
export { updateCommentStatus as a, postArticleComment as i, getAdminComments as n, getArticleComments as r, deleteComment as t };
