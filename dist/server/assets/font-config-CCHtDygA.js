import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-B0GnrEDb.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
//#region src/lib/font-config.ts
var FONT_SECTIONS = [
	{
		key: "headlines",
		label: "Headlines",
		description: "H1, H2, H3, H4 headings",
		cssVar: "--font-headlines"
	},
	{
		key: "body",
		label: "Body Text",
		description: "Paragraphs, article content",
		cssVar: "--font-body"
	},
	{
		key: "navigation",
		label: "Navigation",
		description: "Menu items, nav links",
		cssVar: "--font-nav"
	},
	{
		key: "footer",
		label: "Footer",
		description: "Footer text and links",
		cssVar: "--font-footer"
	},
	{
		key: "ticker",
		label: "News Ticker",
		description: "Breaking news ticker bar",
		cssVar: "--font-ticker"
	},
	{
		key: "buttons",
		label: "Buttons & CTAs",
		description: "Buttons, call-to-action elements",
		cssVar: "--font-buttons"
	}
];
var GOOGLE_FONTS_CATALOG = [
	{
		name: "Inter",
		family: "Inter",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Roboto",
		family: "Roboto",
		weights: [
			"400",
			"500",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Poppins",
		family: "Poppins",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Open Sans",
		family: "Open Sans",
		weights: [
			"400",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Lato",
		family: "Lato",
		weights: ["400", "700"],
		category: "Sans-serif"
	},
	{
		name: "Montserrat",
		family: "Montserrat",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Nunito",
		family: "Nunito",
		weights: [
			"400",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Raleway",
		family: "Raleway",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Work Sans",
		family: "Work Sans",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Outfit",
		family: "Outfit",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "DM Sans",
		family: "DM Sans",
		weights: [
			"400",
			"500",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Source Sans 3",
		family: "Source Sans 3",
		weights: [
			"400",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Playfair Display",
		family: "Playfair Display",
		weights: [
			"400",
			"700",
			"800",
			"900"
		],
		category: "Serif"
	},
	{
		name: "Merriweather",
		family: "Merriweather",
		weights: ["400", "700"],
		category: "Serif"
	},
	{
		name: "Lora",
		family: "Lora",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Serif"
	},
	{
		name: "PT Serif",
		family: "PT Serif",
		weights: ["400", "700"],
		category: "Serif"
	},
	{
		name: "News Cycle",
		family: "News Cycle",
		weights: ["400", "700"],
		category: "Serif"
	},
	{
		name: "Bodoni Moda",
		family: "Bodoni Moda",
		weights: [
			"700",
			"800",
			"900"
		],
		category: "Serif"
	},
	{
		name: "DM Serif Display",
		family: "DM Serif Display",
		weights: ["400"],
		category: "Serif"
	},
	{
		name: "Hind Siliguri",
		family: "Hind Siliguri",
		weights: [
			"300",
			"400",
			"500",
			"600",
			"700"
		],
		category: "Bengali"
	},
	{
		name: "Anek Bangla",
		family: "Anek Bangla",
		weights: [
			"400",
			"500",
			"600",
			"700",
			"800"
		],
		category: "Bengali"
	},
	{
		name: "Noto Sans Bengali",
		family: "Noto Sans Bengali",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Bengali"
	},
	{
		name: "Mina",
		family: "Mina",
		weights: ["400", "700"],
		category: "Bengali"
	},
	{
		name: "JetBrains Mono",
		family: "JetBrains Mono",
		weights: ["400", "600"],
		category: "Monospace"
	},
	{
		name: "Fira Code",
		family: "Fira Code",
		weights: [
			"400",
			"500",
			"700"
		],
		category: "Monospace"
	},
	{
		name: "Dancing Script",
		family: "Dancing Script",
		weights: ["400", "700"],
		category: "Display"
	},
	{
		name: "Oswald",
		family: "Oswald",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Sans-serif"
	},
	{
		name: "Noto Serif Bengali",
		family: "Noto Serif Bengali",
		weights: [
			"400",
			"500",
			"600",
			"700"
		],
		category: "Bengali"
	},
	{
		name: "Tiro Bangla",
		family: "Tiro Bangla",
		weights: ["400"],
		category: "Bengali"
	},
	{
		name: "Galada",
		family: "Galada",
		weights: ["400"],
		category: "Bengali"
	}
];
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
var getFontConfigServer = createServerFn({ method: "GET" }).handler(createSsrRpc("315817cf7049c35693ab4ae90f01139b3471377a5fba02601046ce0bfe6b9d72"));
var saveFontConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("a9524f219d84d7feedeb9446b2f236f589c9b507df590a19a028c57c50e8eddb"));
var FONT_CONFIG_KEY = "nt:font-config";
function loadFontConfig() {
	if (typeof window === "undefined") return defaultFontConfig;
	try {
		const stored = localStorage.getItem(FONT_CONFIG_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			const rawMapping = {
				...defaultFontConfig.sectionMapping,
				...parsed.sectionMapping || {}
			};
			for (const k of Object.keys(rawMapping)) if (rawMapping[k] === "sys-tiro-bangla" || rawMapping[k] === "sys-galada" || rawMapping[k] === "sys-hind-siliguri" || rawMapping[k] === "sys-solaiman-lipi") rawMapping[k] = "sys-noto-serif-bengali";
			return {
				...defaultFontConfig,
				...parsed,
				fonts: mergeFonts(parsed.fonts),
				sectionMapping: rawMapping
			};
		}
	} catch (e) {
		console.error("Failed to load font config from localStorage", e);
	}
	return defaultFontConfig;
}
function saveFontConfig(config) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(config));
		window.dispatchEvent(new Event("nt:fonts-updated"));
		window.dispatchEvent(new Event("nt:settings-updated"));
		saveFontConfigServer({ data: config }).catch((err) => {
			console.error("Failed to sync font config to server", err);
		});
	} catch (e) {
		console.error("Error saving font config", e);
	}
}
function buildGoogleFontsUrl(fonts, activeFontIds) {
	let googleFonts = fonts.filter((f) => f.source === "google");
	if (activeFontIds && activeFontIds.length > 0) {
		const idSet = new Set(activeFontIds.filter(Boolean));
		if (idSet.size > 0) googleFonts = googleFonts.filter((f) => idSet.has(f.id) || f.isDefault);
	}
	if (googleFonts.length === 0) return "";
	return `https://fonts.googleapis.com/css2?${googleFonts.map((font) => {
		const name = font.family.replace(/ /g, "+");
		const coreWeights = [
			"400",
			"500",
			"600",
			"700"
		];
		const weights = (font.weights && font.weights.length > 0 ? font.weights.filter((w) => coreWeights.includes(w)) : [
			"400",
			"600",
			"700"
		]).sort().join(";");
		return weights ? `family=${name}:wght@${weights}` : `family=${name}`;
	}).join("&")}&display=swap`;
}
function buildFontFaceCss(fonts) {
	const uploadFonts = fonts.filter((f) => f.source === "upload" && f.fileDataUrl);
	if (uploadFonts.length === 0) return "";
	return uploadFonts.map((font) => {
		const weight = font.weights && font.weights.length > 0 ? font.weights[0] : "normal";
		return `
@font-face {
  font-family: '${font.family}';
  src: url('${font.fileDataUrl}') format('woff2');
  font-display: swap;
  font-weight: ${weight};
}`.trim();
	}).join("\n\n");
}
function getFontById(fontId, fonts) {
	return fonts.find((f) => f.id === fontId);
}
function buildSectionCssVars(config) {
	const vars = [];
	for (const section of FONT_SECTIONS) {
		const fontId = config.sectionMapping[section.key];
		let family = `"Noto Serif Bengali", "SolaimanLipi", "Kalpurush", Georgia, serif`;
		if (fontId) {
			const font = getFontById(fontId, config.fonts);
			if (font) family = `"${font.family}", "Noto Serif Bengali", "SolaimanLipi", "Kalpurush", Georgia, serif`;
		}
		vars.push(`  ${section.cssVar}: ${family};`);
	}
	return `:root {\n${vars.join("\n")}\n}`;
}
function generateFontId() {
	return `font-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
//#endregion
export { buildGoogleFontsUrl as a, generateFontId as c, loadFontConfig as d, saveFontConfig as f, buildFontFaceCss as i, getFontById as l, FONT_SECTIONS as n, buildSectionCssVars as o, GOOGLE_FONTS_CATALOG as r, defaultFontConfig as s, FONT_CONFIG_KEY as t, getFontConfigServer as u };
