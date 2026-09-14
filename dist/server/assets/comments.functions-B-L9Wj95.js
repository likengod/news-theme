import { i as createServerFn } from "./esm-Dova13aH.js";
import { I as createSsrRpc } from "./site-content-C7W_w-Y_.js";
import { t as requireAuth } from "./auth-middleware-CI6bjHrS.js";
//#region src/lib/comments.functions.ts
var getAdminComments = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(createSsrRpc("77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702"));
var updateCommentStatus = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c"));
var deleteComment = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575"));
var deleteAllCommentsFn = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(createSsrRpc("cb6b8bf70884edd100e4ea383f633fbb54f6556775a50e424c5efbc73a7ba76d"));
var getAllCommentsFn = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("78f4c911acbdaabc3934ef25173a7247b252784ce0cec0a0d21a5c58599140db"));
var importCommentsFn = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("dfcb04800cdeb31e774b458dd497514b9ddeaa58e171298b91f1907be9a8c7b2"));
var getArticleComments = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401"));
var postArticleComment = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44"));
var generateDummyCommentsFn = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(createSsrRpc("9c0af1cd2d70f4c5578b85770551e19f78953ddfd853ad2e99715702151b54fd"));
//#endregion
export { getAllCommentsFn as a, postArticleComment as c, getAdminComments as i, updateCommentStatus as l, deleteComment as n, getArticleComments as o, generateDummyCommentsFn as r, importCommentsFn as s, deleteAllCommentsFn as t };

//# sourceMappingURL=comments.functions-B-L9Wj95.js.map