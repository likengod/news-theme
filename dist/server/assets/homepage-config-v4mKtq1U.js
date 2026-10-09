import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BqJBKbDJ.js";
import { n as requireAuth } from "./auth-middleware-Cqd3GFjU.js";
import { c as top, i as lead, r as grid } from "./news-data-CiXcY3JG.js";
//#region src/lib/news-data-helpers.ts
/**
* Separated from homepage-config.ts to break the synchronous import chain:
*   homepage-config.js → news-data.js
* Components that use articlesByCategory() already import news-data anyway,
* so this file only adds a dependency for consumers that actually call it.
*/
/** Pick items matching a category (kicker substring match), latest first. */
function articlesByCategory(category) {
	const pool = [
		lead,
		...top,
		...grid
	];
	if (!category || category === "Auto (Latest)") return pool;
	const c = category.toLowerCase();
	const matched = pool.filter((a) => (a.kicker ?? "").toLowerCase().includes(c));
	return matched.length > 0 ? matched : pool;
}
var ALL_CATEGORY_OPTIONS = ["Auto (Latest)", ...[
	"Northeast",
	"Breaking",
	"Global",
	"Politics",
	"Business",
	"Crime",
	"Tech",
	"Sports",
	"Opinion",
	"Others"
]];
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
		autoplay: true,
		provider: "youtube",
		youtubeChannelId: "",
		youtubeVideoId: "",
		facebookPageUrl: "https://www.facebook.com/facebook",
		title: "লাইভ সংবাদ কভারেজ"
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
var KEY = "nt:homepage-config:v1";
var EVENT = "nt:homepage-updated";
var getHomepageConfigServer = createServerFn({ method: "GET" }).handler(createSsrRpc("bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2"));
var saveHomepageConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(createSsrRpc("8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893"));
/**
* Server-side YouTube channel & live-stream detector.
* Resolves @handles, channel URLs, live URLs, video IDs to verified channel ID and active live video.
*/
var resolveYouTubeServer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("75c16329e4ea959e4c4bf240a428d8dffbff669bab981b5ad419e945345cddfb"));
function loadHomepageConfig() {
	if (typeof window === "undefined") return defaultHomepageConfig;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultHomepageConfig;
		const parsed = JSON.parse(raw);
		return {
			...defaultHomepageConfig,
			...parsed,
			newsGridColumns: Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5 ? parsed.newsGridColumns : defaultHomepageConfig.newsGridColumns
		};
	} catch {
		return defaultHomepageConfig;
	}
}
async function saveHomepageConfig(cfg) {
	if (typeof window !== "undefined") {
		localStorage.setItem(KEY, JSON.stringify(cfg));
		window.dispatchEvent(new Event(EVENT));
	}
	return await saveHomepageConfigServer({ data: cfg });
}
function onHomepageConfigChange(cb) {
	if (typeof window === "undefined") return () => {};
	const handler = () => cb();
	window.addEventListener(EVENT, handler);
	window.addEventListener("storage", handler);
	return () => {
		window.removeEventListener(EVENT, handler);
		window.removeEventListener("storage", handler);
	};
}
//#endregion
export { onHomepageConfigChange as a, articlesByCategory as c, loadHomepageConfig as i, defaultHomepageConfig as n, resolveYouTubeServer as o, getHomepageConfigServer as r, saveHomepageConfig as s, ALL_CATEGORY_OPTIONS as t };

//# sourceMappingURL=homepage-config-v4mKtq1U.js.map