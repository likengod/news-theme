import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/font-config.ts?tss-serverfn-split
var SYSTEM_FONTS = [
	{
		id: "sys-noto-serif-bengali",
		name: "Noto Serif Bengali",
		family: "Noto Serif Bengali",
		source: "google",
		weights: [
			"400",
			"500",
			"600",
			"700",
			"800",
			"900"
		],
		isDefault: true,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-solaiman-lipi",
		name: "SolaimanLipi",
		family: "SolaimanLipi",
		source: "upload",
		weights: ["400", "700"],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-anek-bangla",
		name: "Anek Bangla",
		family: "Anek Bangla",
		source: "google",
		weights: [
			"400",
			"500",
			"600",
			"700",
			"800"
		],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-kalpurush",
		name: "Kalpurush",
		family: "Kalpurush",
		source: "upload",
		weights: ["400", "700"],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-hind-siliguri",
		name: "Hind Siliguri",
		family: "Hind Siliguri",
		source: "google",
		weights: [
			"300",
			"400",
			"500",
			"600",
			"700"
		],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-noto-bengali",
		name: "Noto Sans Bengali",
		family: "Noto Sans Bengali",
		source: "google",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-inter",
		name: "Inter",
		family: "Inter",
		source: "google",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "sys-news-cycle",
		name: "News Cycle",
		family: "News Cycle",
		source: "google",
		weights: ["400", "700"],
		isDefault: false,
		isSystem: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
];
var defaultFontConfig = {
	fonts: SYSTEM_FONTS,
	sectionMapping: {
		headlines: "sys-noto-serif-bengali",
		body: "sys-noto-serif-bengali",
		navigation: "sys-noto-serif-bengali",
		footer: "sys-noto-serif-bengali",
		ticker: "sys-noto-serif-bengali",
		buttons: "sys-noto-serif-bengali"
	}
};
function mergeFonts(savedFonts) {
	if (!savedFonts) return [...SYSTEM_FONTS];
	const systemIds = new Set(SYSTEM_FONTS.map((f) => f.id));
	const userOnly = savedFonts.filter((f) => !systemIds.has(f.id));
	return [...SYSTEM_FONTS, ...userOnly];
}
var CACHE_TTL_MS = 1e4;
var cache = /* @__PURE__ */ new Map();
function getCached(key) {
	const item = cache.get(key);
	if (!item) return null;
	if (Date.now() > item.expiry) {
		cache.delete(key);
		return null;
	}
	return item.value;
}
function setCached(key, value) {
	cache.set(key, {
		value,
		expiry: Date.now() + CACHE_TTL_MS
	});
}
function clearCache(key) {
	cache.delete(key);
}
var getFontConfigServer_createServerFn_handler = createServerRpc({
	id: "315817cf7049c35693ab4ae90f01139b3471377a5fba02601046ce0bfe6b9d72",
	name: "getFontConfigServer",
	filename: "src/lib/font-config.ts"
}, (opts) => getFontConfigServer.__executeServer(opts));
var getFontConfigServer = createServerFn({ method: "GET" }).handler(getFontConfigServer_createServerFn_handler, async () => {
	const cacheKey = "font_configuration_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = ?", [cacheKey]);
		if (rows && rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			const rawMapping = {
				...defaultFontConfig.sectionMapping,
				...parsed.sectionMapping || {}
			};
			for (const k of Object.keys(rawMapping)) if (rawMapping[k] === "sys-tiro-bangla" || rawMapping[k] === "sys-galada" || rawMapping[k] === "sys-hind-siliguri" || rawMapping[k] === "sys-solaiman-lipi") rawMapping[k] = "sys-noto-serif-bengali";
			const config = {
				...defaultFontConfig,
				...parsed,
				fonts: mergeFonts(parsed.fonts),
				sectionMapping: rawMapping
			};
			setCached(cacheKey, config);
			return config;
		}
	} catch (e) {
		console.error("Error retrieving font config from DB:", e);
	}
	setCached(cacheKey, defaultFontConfig);
	return defaultFontConfig;
});
var saveFontConfigServer_createServerFn_handler = createServerRpc({
	id: "a9524f219d84d7feedeb9446b2f236f589c9b507df590a19a028c57c50e8eddb",
	name: "saveFontConfigServer",
	filename: "src/lib/font-config.ts"
}, (opts) => saveFontConfigServer.__executeServer(opts));
var saveFontConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(saveFontConfigServer_createServerFn_handler, async ({ data }) => {
	const cacheKey = "font_configuration_data";
	const jsonValue = JSON.stringify(data);
	try {
		await query(`INSERT INTO site_settings (setting_key, value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = ?`, [
			cacheKey,
			jsonValue,
			jsonValue
		]);
		clearCache(cacheKey);
		return { success: true };
	} catch (e) {
		console.error("Error saving font config to DB:", e);
		throw e;
	}
});
//#endregion
export { getFontConfigServer_createServerFn_handler, saveFontConfigServer_createServerFn_handler };
