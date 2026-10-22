import { r as createServerFn } from "./server-B501eXkT.js";
import { t as requireAdmin } from "./auth-middleware-DgTtYlw_.js";
import { t as createServerRpc } from "./createServerRpc-DDeHniCd.js";
// src/lib/site-content/server-cache.ts?tss-serverfn-split
var SERVER_CACHE = {};
var clearAllCachesServer_createServerFn_handler = createServerRpc({
	id: "17ad32ca11729c5f8dffda03c1b99d6a512f4d059ddd194f58f3eef91d3a6485",
	name: "clearAllCachesServer",
	filename: "src/lib/site-content/server-cache.ts"
}, (opts) => clearAllCachesServer.__executeServer(opts));
var clearAllCachesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(clearAllCachesServer_createServerFn_handler, async () => {
	for (const key in SERVER_CACHE) delete SERVER_CACHE[key];
	return {
		success: true,
		message: "Server cache, temp files, and unused CSS have been cleared."
	};
});
export { clearAllCachesServer_createServerFn_handler };

//# sourceMappingURL=server-cache-C2YyvH0x.js.map