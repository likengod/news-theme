import { r as createServerFn } from "./server-0upW5amu.js";
import { t as requireAdmin } from "./auth-middleware-B3kjK9nb.js";
import { t as createServerRpc } from "./createServerRpc-Bw8j8gcc.js";
// src/lib/site-content/server-cache.ts?tss-serverfn-split
var SERVER_CACHE = {};
var clearAllCachesServer_createServerFn_handler = createServerRpc({
	id: "17ad32ca11729c5f8dffda03c1b99d6a512f4d059ddd194f58f3eef91d3a6485",
	name: "clearAllCachesServer",
	filename: "src/lib/site-content/server-cache.ts"
}, (opts) => clearAllCachesServer.__executeServer(opts));
var clearAllCachesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(clearAllCachesServer_createServerFn_handler, async () => {
	for (const key in SERVER_CACHE) delete SERVER_CACHE[key];
	try {
		const { clearHomepageArticlesCache } = await import("./articles.functions-mt5ffmv1.js").then((n) => n.n);
		clearHomepageArticlesCache();
	} catch {}
	try {
		const { clearCategoriesCache, clearTagsCache } = await import("./taxonomy.functions-Clk_B0dB.js").then((n) => n.d);
		clearCategoriesCache();
		clearTagsCache();
	} catch {}
	try {
		const { clearFontCache } = await import("./font-config-QWLf75QP.js").then((n) => n.c);
		clearFontCache();
	} catch {}
	try {
		const port = process.env.PORT || "3000";
		const req = (await import("node:http")).request({
			hostname: "127.0.0.1",
			port: Number(port),
			path: "/api/internal/clear-cache",
			method: "GET",
			timeout: 2e3
		});
		req.on("error", () => {});
		req.end();
	} catch {}
	let purgedCount = 0;
	try {
		const fs = await import("node:fs");
		const path = await import("node:path");
		const { query } = await import("./db.server-CtOYKQDV.js").then((n) => n.r);
		const cwd = process.cwd();
		const activeFilenames = /* @__PURE__ */ new Set();
		try {
			const adRows = await query("SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'");
			if (adRows && adRows[0]?.value) {
				const cfg = JSON.parse(adRows[0].value);
				if (cfg?.slots) for (const s of Object.keys(cfg.slots)) {
					const arr = cfg.slots[s];
					if (Array.isArray(arr)) for (const it of arr) {
						if (it?.image) activeFilenames.add(path.basename(it.image.split("?")[0]));
						if (it?.imagePortrait) activeFilenames.add(path.basename(it.imagePortrait.split("?")[0]));
						if (it?.imageLandscape) activeFilenames.add(path.basename(it.imageLandscape.split("?")[0]));
					}
				}
			}
		} catch {}
		try {
			const mediaRows = await query("SELECT url FROM media_library");
			if (Array.isArray(mediaRows)) {
				for (const m of mediaRows) if (m?.url) activeFilenames.add(path.basename(m.url.split("?")[0]));
			}
		} catch {}
		try {
			const articleRows = await query("SELECT featured_image FROM articles WHERE featured_image IS NOT NULL");
			if (Array.isArray(articleRows)) {
				for (const a of articleRows) if (a?.featured_image) activeFilenames.add(path.basename(a.featured_image.split("?")[0]));
			}
		} catch {}
		const checkDirs = [
			path.join(cwd, "public", "uploads", "promos"),
			path.join(cwd, "dist", "client", "uploads", "promos"),
			path.join(cwd, "uploads", "promos"),
			path.join(cwd, "uploads"),
			path.join(cwd, "tmp"),
			path.join(cwd, "temp")
		];
		const now = Date.now();
		const MIN_AGE_MS = 6e4;
		for (const dir of checkDirs) {
			if (!fs.existsSync(dir)) continue;
			try {
				const entries = fs.readdirSync(dir, { withFileTypes: true });
				for (const ent of entries) {
					if (!ent.isFile()) continue;
					const fname = ent.name;
					if (fname === ".gitkeep" || fname.startsWith(".")) continue;
					const fullPath = path.join(dir, fname);
					try {
						if (now - fs.statSync(fullPath).mtimeMs < MIN_AGE_MS) continue;
						if (!activeFilenames.has(fname)) {
							fs.unlinkSync(fullPath);
							purgedCount++;
						}
					} catch {}
				}
			} catch {}
		}
	} catch (e) {
		console.error("[CacheCleanup] Disk cleanup error:", e);
	}
	return {
		success: true,
		message: purgedCount > 0 ? `Server cache cleared and ${purgedCount} unused orphaned file(s) permanently deleted from disk.` : "Server cache and performance buffers successfully refreshed.",
		purgedCount
	};
});
export { clearAllCachesServer_createServerFn_handler };

//# sourceMappingURL=server-cache-BFRNzSuR.js.map