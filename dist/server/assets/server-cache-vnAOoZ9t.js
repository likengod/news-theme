import { r as createServerFn } from "./server-tRd-_-rL.js";
import { t as createSsrRpc } from "./createSsrRpc-bhFm1qXK.js";
import { t as requireAdmin } from "./auth-middleware-CU8g4DTz.js";
// src/lib/site-content/server-cache.ts
var SERVER_CACHE = {};
var CACHE_TTL_MS = 3e5;
function getCached(key) {
	const entry = SERVER_CACHE[key];
	if (entry && entry.expiry > Date.now()) return entry.data;
	return null;
}
function setCached(key, data) {
	SERVER_CACHE[key] = {
		data,
		expiry: Date.now() + CACHE_TTL_MS
	};
}
function clearCache(key) {
	delete SERVER_CACHE[key];
}
var clearAllCachesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(createSsrRpc("17ad32ca11729c5f8dffda03c1b99d6a512f4d059ddd194f58f3eef91d3a6485"));
export { setCached as i, clearCache as n, getCached as r, clearAllCachesServer as t };

//# sourceMappingURL=server-cache-vnAOoZ9t.js.map