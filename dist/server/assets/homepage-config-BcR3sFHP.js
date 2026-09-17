import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { n as requireAuth } from "./auth-middleware-CzbwKkqR.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/homepage-config.ts?tss-serverfn-split
var defaultHomepageConfig = {
	heroTopStories: {
		title: "Top Stories",
		fontSize: 12,
		color: "#1A1110"
	},
	heroCultureMusic: {
		title: "Culture & Music",
		fontSize: 12,
		color: "#1A1110"
	},
	heroOpinion: {
		title: "Opinion",
		fontSize: 12,
		color: "#1A1110"
	},
	heroPopular: {
		title: "Popular",
		fontSize: 12,
		color: "#1A1110"
	},
	heroFeatured: {
		title: "Featured",
		fontSize: 12,
		color: "#1A1110",
		category: "Auto (Latest)",
		autoSlide: true,
		slideInterval: 5,
		showMultiple: true,
		slideCount: 3
	},
	watch: {
		title: "Watch",
		fontSize: 16,
		color: "#1A1110"
	},
	marketsMagazine: {
		title: "Markets Magazine",
		fontSize: 16,
		color: "#1A1110"
	},
	showTicker: false,
	showBreakingBar: true,
	liveVideo: {
		enabled: true,
		provider: "youtube",
		youtubeChannelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
		facebookPageUrl: "https://www.facebook.com/facebook",
		title: "LIVE: Markets Now — breaking coverage"
	},
	newsGridColumns: [
		{
			title: "World",
			fontSize: 12,
			color: "#1A1110",
			category: "Global"
		},
		{
			title: "Politics",
			fontSize: 12,
			color: "#1A1110",
			category: "Politics"
		},
		{
			title: "Opinion",
			fontSize: 12,
			color: "#1A1110",
			category: "Opinion"
		},
		{
			title: "Culture",
			fontSize: 12,
			color: "#1A1110",
			category: "Auto (Latest)"
		},
		{
			title: "Arts",
			fontSize: 12,
			color: "#1A1110",
			category: "Auto (Latest)"
		}
	]
};
var homepageConfigCache = null;
var CACHE_TTL_MS = 300 * 1e3;
var getHomepageConfigServer_createServerFn_handler = createServerRpc({
	id: "bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2",
	name: "getHomepageConfigServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => getHomepageConfigServer.__executeServer(opts));
var getHomepageConfigServer = createServerFn({ method: "GET" }).handler(getHomepageConfigServer_createServerFn_handler, async () => {
	if (homepageConfigCache && homepageConfigCache.expiry > Date.now()) return homepageConfigCache.data;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'homepage_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			const res = {
				...defaultHomepageConfig,
				...parsed,
				newsGridColumns: Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5 ? parsed.newsGridColumns : defaultHomepageConfig.newsGridColumns
			};
			homepageConfigCache = {
				data: res,
				expiry: Date.now() + CACHE_TTL_MS
			};
			return res;
		}
	} catch {}
	homepageConfigCache = {
		data: defaultHomepageConfig,
		expiry: Date.now() + CACHE_TTL_MS
	};
	return defaultHomepageConfig;
});
var saveHomepageConfigServer_createServerFn_handler = createServerRpc({
	id: "8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893",
	name: "saveHomepageConfigServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => saveHomepageConfigServer.__executeServer(opts));
var saveHomepageConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(saveHomepageConfigServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('homepage_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	homepageConfigCache = null;
	return { success: true };
});
//#endregion
export { getHomepageConfigServer_createServerFn_handler, saveHomepageConfigServer_createServerFn_handler };

//# sourceMappingURL=homepage-config-BcR3sFHP.js.map