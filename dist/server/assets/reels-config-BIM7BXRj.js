import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-VM_6QRfA.js";
import { n as requireAuth } from "./auth-middleware-ZE8MSokF.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/reels-config.ts?tss-serverfn-split
var defaultReelsConfig = {
	enabled: true,
	provider: "youtube",
	mode: "manual",
	title: "Reels & Shorts",
	urls: [],
	youtube: {
		apiKey: "",
		channelId: "",
		maxResults: 8
	},
	facebook: {
		accessToken: "",
		pageId: "",
		maxResults: 8
	}
};
var reelsConfigCache = null;
var CACHE_TTL_MS = 60 * 1e3;
var getReelsConfigServer_createServerFn_handler = createServerRpc({
	id: "02dd087da9491aa68558b9de13a4861735f8ea28b497ce2394d9627b9f16bee4",
	name: "getReelsConfigServer",
	filename: "src/lib/reels-config.ts"
}, (opts) => getReelsConfigServer.__executeServer(opts));
var getReelsConfigServer = createServerFn({ method: "GET" }).handler(getReelsConfigServer_createServerFn_handler, async () => {
	if (reelsConfigCache && reelsConfigCache.expiry > Date.now()) return reelsConfigCache.data;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'reels_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			const res = {
				...defaultReelsConfig,
				...parsed,
				urls: Array.isArray(parsed.urls) ? parsed.urls.filter((u) => typeof u === "string") : [],
				youtube: {
					...defaultReelsConfig.youtube,
					...parsed.youtube ?? {}
				},
				facebook: {
					...defaultReelsConfig.facebook,
					...parsed.facebook ?? {}
				}
			};
			reelsConfigCache = {
				data: res,
				expiry: Date.now() + CACHE_TTL_MS
			};
			return res;
		}
	} catch {}
	reelsConfigCache = {
		data: defaultReelsConfig,
		expiry: Date.now() + CACHE_TTL_MS
	};
	return defaultReelsConfig;
});
var saveReelsConfigServer_createServerFn_handler = createServerRpc({
	id: "702655ca1b3fca4307cb686a091790c96919c26dd8288220df2010c9f93b5cd8",
	name: "saveReelsConfigServer",
	filename: "src/lib/reels-config.ts"
}, (opts) => saveReelsConfigServer.__executeServer(opts));
var saveReelsConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(saveReelsConfigServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('reels_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	reelsConfigCache = null;
	return { success: true };
});
//#endregion
export { getReelsConfigServer_createServerFn_handler, saveReelsConfigServer_createServerFn_handler };

//# sourceMappingURL=reels-config-BIM7BXRj.js.map