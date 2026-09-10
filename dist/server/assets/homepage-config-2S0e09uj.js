import { i as createServerFn } from "./esm-Dova13aH.js";
import { d as lead, f as sections, h as top, u as grid } from "./db.server-Chz3iTW3.js";
import { P as createSsrRpc } from "./site-content-BKtfkHB_.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
//#region src/lib/homepage-config.ts
var ALL_CATEGORY_OPTIONS = ["Auto (Latest)", ...sections];
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
var KEY = "nt:homepage-config:v1";
var EVENT = "nt:homepage-updated";
var getHomepageConfigServer = createServerFn({ method: "GET" }).handler(createSsrRpc("bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2"));
var saveHomepageConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(createSsrRpc("8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893"));
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
function saveHomepageConfig(cfg) {
	if (typeof window !== "undefined") {
		localStorage.setItem(KEY, JSON.stringify(cfg));
		window.dispatchEvent(new Event(EVENT));
	}
	saveHomepageConfigServer({ data: cfg }).catch(() => {});
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
//#endregion
export { loadHomepageConfig as a, getHomepageConfigServer as i, articlesByCategory as n, onHomepageConfigChange as o, defaultHomepageConfig as r, saveHomepageConfig as s, ALL_CATEGORY_OPTIONS as t };
