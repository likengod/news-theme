import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-BbeveDGb.js";
import { t as requireAuth } from "./auth-middleware-DY2CGsEm.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
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
	showTicker: true,
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
var getHomepageConfigServer_createServerFn_handler = createServerRpc({
	id: "bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2",
	name: "getHomepageConfigServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => getHomepageConfigServer.__executeServer(opts));
var getHomepageConfigServer = createServerFn({ method: "GET" }).handler(getHomepageConfigServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'homepage_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			return {
				...defaultHomepageConfig,
				...parsed,
				newsGridColumns: Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5 ? parsed.newsGridColumns : defaultHomepageConfig.newsGridColumns
			};
		}
	} catch {}
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
	return { success: true };
});
//#endregion
export { getHomepageConfigServer_createServerFn_handler, saveHomepageConfigServer_createServerFn_handler };

//# sourceMappingURL=homepage-config-BWfrHna7.js.map