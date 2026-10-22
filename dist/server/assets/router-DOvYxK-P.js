import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.js";
import { C as Link$1, S as createRootRouteWithContext, T as useRouter, b as lazyRouteComponent, m as HeadContent, p as Scripts, v as createRouter, x as createFileRoute, y as Outlet, z as redirect } from "./vendor-tanstack-router-CezffrX_.js";
import { o as getRequest, r as createServerFn } from "./server-6B0b-0LV.js";
import { t as createSsrRpc } from "./createSsrRpc-CDigsUXW.js";
import { i as hashPassword, s as query } from "./db.server-BUvgSG9u.js";
import { t as requireAdmin } from "./auth-middleware-CqYqEtQk.js";
import { n as defaultSettings, o as loadSettings, r as getSiteSettingsServer } from "./site-settings-CS7dA06x.js";
import { t as defaultPages } from "./default-pages-DgDCqR0d.js";
import { b as getCustomPagesServer, c as getAdminDashboardStats, d as getPublicArchiveArticles, f as getPublicArticleBySlug, u as getHomepageArticles } from "./articles.functions-yPA8HzF_.js";
import { t as buildPageHead } from "./page-seo-C4qWRP8w.js";
import { a as buildGoogleFontsUrl, i as buildFontFaceCss, o as buildSectionCssVars, s as defaultFontConfig, t as FONT_CONFIG_KEY, u as getFontConfigServer } from "./font-config-DLXC_hQH.js";
import { t as AdSettingsProvider } from "./AdSettingsContext-lSojmx2q.js";
import { a as sections, h as hero_markets_default, n as getArticleImage, o as slugify } from "./news-data-0ow0BI8X.js";
import { a as getTags, i as getCategoryData, r as getCategories } from "./taxonomy.functions-bW_6qgNa.js";
import { a as lookupJournalist } from "./journalist.functions-B7RGqECL.js";
import { a as executeGitPullCore, i as executeGetGitStatusCore } from "./deploy.server-BR3JhBKd.js";
import { a as themeInitScript, i as ThemeProvider, t as Footer } from "./Footer-KjZw28jt.js";
import { n as getHomepageConfigServer, t as defaultHomepageConfig } from "./homepage-config-BXMRd8tn.js";
import { r as searchUnifiedPublic, t as Header } from "./Header-Dcyw2hnn.js";
import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-17FAK75G.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, FileText, FolderOpen, FolderTree, Gift, Home, Inbox, LayoutDashboard, Megaphone, MessageSquare, Newspaper, PenLine, Rocket, Search, Settings, ShieldCheck, Tag, Users } from "lucide-react";
import { Toaster } from "sonner";
import crypto from "crypto";
import { z } from "zod";
import { QueryClient, QueryClientProvider, queryOptions } from "@tanstack/react-query";
// src/lib/site-content/redirect-rules.ts
var getRedirectRulesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("7cbf675c7bd7c9ee224e699588bfa7a4d7b38ac86b77a40ade5d857819ebe6a7"));
var saveRedirectRulesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((rules) => z.array(z.object({
	id: z.string(),
	source: z.string(),
	destination: z.string(),
	hits: z.number(),
	createdAt: z.string()
})).parse(rules)).handler(createSsrRpc("2b528109ae68caadb520b78d8504c061898b4465ebb34cde90c52d157753bde0"));
var incrementRedirectHitServer = createServerFn({ method: "POST" }).validator((id) => z.string().parse(id)).handler(createSsrRpc("fc9dae9aa403f9bc644d51588c7c5f5b486d759eecd1cfd041e553d794565167"));
var scanBrokenLinksServer = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("64074aae210bf06c1f6dd880c1ceb389e454c17f09dc8077502ecd8f6d3d97f2"));
var fixBrokenLinkServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
	articleId: z.number(),
	brokenUrl: z.string().min(1),
	correctedUrl: z.string().min(1)
}).parse(data)).handler(createSsrRpc("1f78d7f578a6afa4f03a2d2bc26fcf60e865cac4f78ccc0a2b5d02cfe41e0c1c"));
// src/lib/site-content/ads-storage.ts
var defaultPopupConfig = {
	frequencyMinutes: 10,
	initialDelaySeconds: 7,
	closeDelaySeconds: 6,
	rotateOnInterval: true
};
var defaultAdSlides = [
	{
		id: "ad-1",
		image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-2",
		image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-3",
		image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesHome2 = [
	{
		id: "ad2-1",
		image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-2",
		image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-3",
		image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-4",
		image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-5",
		image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-6",
		image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesAd3 = [
	{
		id: "ad3-1",
		image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad3-2",
		image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad3-3",
		image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesPopup = [{
	id: "pop-1",
	image: "https://placehold.co/600x800/e2e8f0/475569?text=Popup+Ad\\n600x800",
	href: "#",
	label: "Sponsored",
	orientation: "portrait"
}, {
	id: "pop-2",
	image: "https://placehold.co/1200x675/f8fafc/94a3b8?text=Popup+Ad\\n1200x675",
	href: "#",
	label: "Sponsored",
	orientation: "landscape"
}];
var defaultAdSlidesLeaderboard = [{
	id: "lead-1",
	imageLandscape: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
	imagePortrait: "https://placehold.co/600x100/e2e8f0/475569?text=Leaderboard\\n600x100",
	image: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
	href: "#",
	label: "Sponsored",
	orientation: "landscape"
}];
var defaultAdSlidesPostAds = [{
	id: "post-ad-1",
	image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=728&h=90&q=80",
	imageLandscape: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=728&h=90&q=80",
	imagePortrait: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=320&h=75&q=80",
	href: "https://scapia.cards",
	label: "Scapia Federal Credit Card",
	sponsor: "Scapia",
	headline: "₹500 के न्यूनतम लेनदेन पर UPI खर्च पर 5% रिवॉर्ड।"
}];
var SLOT_MODE_KEY = "nt:ad-slot-mode";
var SLOT_SCRIPT_KEY = "nt:ad-slot-script";
var DEFAULT_SLOT_MODE = {
	home1: "image",
	home2: "image",
	ad3: "image",
	popup: "image",
	leaderboard: "image",
	hero_showcase: "image",
	reel_ads: "image",
	post_ads: "image"
};
function loadAdSlotMode(slot) {
	if (typeof window === "undefined") return DEFAULT_SLOT_MODE[slot];
	try {
		const raw = localStorage.getItem(SLOT_MODE_KEY);
		return (raw ? JSON.parse(raw) : {})[slot] || DEFAULT_SLOT_MODE[slot];
	} catch {
		return DEFAULT_SLOT_MODE[slot];
	}
}
function saveAdSlotMode(slot, mode) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(SLOT_MODE_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = mode;
		localStorage.setItem(SLOT_MODE_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
function loadAdSlotScript(slot) {
	if (typeof window === "undefined") return "";
	try {
		const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
		return (raw ? JSON.parse(raw) : {})[slot] || "";
	} catch {
		return "";
	}
}
function saveAdSlotScript(slot, script) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = script;
		localStorage.setItem(SLOT_SCRIPT_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
var ADS_KEYS = {
	home1: "nt:ads:v2:home1",
	home2: "nt:ads:v2:home2",
	ad3: "nt:ads:v2:ad3",
	popup: "nt:ads:v2:popup",
	leaderboard: "nt:ads:v2:leaderboard",
	hero_showcase: "nt:ads:v2:hero_showcase",
	reel_ads: "nt:ads:v2:reel_ads",
	post_ads: "nt:ads:v2:post_ads"
};
var TRASH_KEY = "nt:site-ads-trash";
var TRASH_TTL_MS = 2592e6;
var ROTATION_KEY = "nt:site-ads-rotation";
var DEFAULT_ROTATION = {
	home1: 5,
	home2: 5,
	ad3: 5,
	popup: 6,
	leaderboard: 5,
	hero_showcase: 5,
	reel_ads: 5,
	post_ads: 5
};
function loadAdRotation(slot) {
	if (typeof window === "undefined") return DEFAULT_ROTATION[slot];
	try {
		const raw = localStorage.getItem(ROTATION_KEY);
		const map = raw ? JSON.parse(raw) : {};
		const v = Number(map[slot]);
		return Number.isFinite(v) && v > 0 ? v : DEFAULT_ROTATION[slot];
	} catch {
		return DEFAULT_ROTATION[slot];
	}
}
function saveAdRotation(slot, seconds) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(ROTATION_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = Math.max(1, Math.round(seconds));
		localStorage.setItem(ROTATION_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
function injectReelAds(items, ads, intervalOrOptions = 3) {
	const validAds = ads.filter((a) => !!(a.image || a.imagePortrait || a.imageLandscape));
	if (validAds.length === 0) return items.map((item, originalIndex) => ({
		isAd: false,
		item,
		originalIndex
	}));
	const sortedAds = [...validAds].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
	const result = [];
	const opts = typeof intervalOrOptions === "number" ? {
		interval: intervalOrOptions,
		firstAfter: intervalOrOptions
	} : {
		interval: intervalOrOptions?.interval ?? 3,
		firstAfter: intervalOrOptions?.firstAfter ?? intervalOrOptions?.interval ?? 3
	};
	let adIdx = 0;
	let itemsSinceLastAd = 0;
	for (let i = 0; i < items.length; i++) {
		result.push({
			isAd: false,
			item: items[i],
			originalIndex: i
		});
		itemsSinceLastAd++;
		const threshold = adIdx === 0 ? opts.firstAfter : opts.interval;
		if (itemsSinceLastAd >= threshold) {
			result.push({
				isAd: true,
				ad: sortedAds[adIdx % sortedAds.length]
			});
			adIdx++;
			itemsSinceLastAd = 0;
		}
	}
	return result;
}
var POPUP_CONFIG_KEY = "nt:popup-ad-config";
function loadPopupConfig() {
	if (typeof window === "undefined") return defaultPopupConfig;
	try {
		const raw = localStorage.getItem(POPUP_CONFIG_KEY);
		if (!raw) return defaultPopupConfig;
		const p = JSON.parse(raw);
		return {
			frequencyMinutes: typeof p.frequencyMinutes === "number" ? p.frequencyMinutes : defaultPopupConfig.frequencyMinutes,
			initialDelaySeconds: typeof p.initialDelaySeconds === "number" ? p.initialDelaySeconds : defaultPopupConfig.initialDelaySeconds,
			closeDelaySeconds: typeof p.closeDelaySeconds === "number" ? p.closeDelaySeconds : defaultPopupConfig.closeDelaySeconds,
			rotateOnInterval: p.rotateOnInterval !== false
		};
	} catch {
		return defaultPopupConfig;
	}
}
function savePopupConfig(cfg) {
	if (typeof window === "undefined") return;
	try {
		const updated = {
			...loadPopupConfig(),
			...cfg
		};
		localStorage.setItem(POPUP_CONFIG_KEY, JSON.stringify(updated));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
var DEFAULTS = {
	home1: defaultAdSlides,
	home2: defaultAdSlidesHome2,
	ad3: defaultAdSlidesAd3,
	popup: defaultAdSlidesPopup,
	leaderboard: defaultAdSlidesLeaderboard,
	hero_showcase: [],
	reel_ads: [],
	post_ads: defaultAdSlidesPostAds
};
var inMemoryAdsCache = {};
/**
* Robust localStorage.setItem wrapper that intercepts QuotaExceededError,
* frees up stale/heavy cached items, and ensures site code never crashes.
*/
function safeSetItem(key, value) {
	if (typeof window === "undefined") return false;
	try {
		localStorage.setItem(key, value);
		return true;
	} catch (e) {
		console.warn(`[Storage] Quota exceeded for "${key}". Recovering space...`, e);
		try {
			const rawMedia = localStorage.getItem("nt_media_library_v1");
			if (rawMedia && rawMedia.length > 15e4) try {
				const m = JSON.parse(rawMedia);
				if (Array.isArray(m)) localStorage.setItem("nt_media_library_v1", JSON.stringify(m.slice(0, 2)));
			} catch {
				localStorage.removeItem("nt_media_library_v1");
			}
		} catch {}
		try {
			localStorage.removeItem("nt:site-ads-trash");
		} catch {}
		try {
			localStorage.setItem(key, value);
			return true;
		} catch {}
		try {
			for (const slot of [
				"leaderboard",
				"popup",
				"ad3",
				"home2",
				"home1",
				"hero_showcase"
			]) {
				const slotKey = ADS_KEYS[slot];
				if (slotKey && slotKey !== key && localStorage.getItem(slotKey)) {
					localStorage.removeItem(slotKey);
					try {
						localStorage.setItem(key, value);
						return true;
					} catch {}
				}
			}
		} catch {}
		try {
			localStorage.setItem(key, value);
			return true;
		} catch {
			console.warn(`[Storage] Browser quota full for "${key}". Data saved to memory and syncing to server database.`);
			return false;
		}
	}
}
function sanitizeSlotAds(slot, list) {
	if (!Array.isArray(list)) return list;
	if (slot === "home1" || slot === "ad3" || slot === "reel_ads") return list.map((ad) => {
		if (ad.imagePortrait) return {
			...ad,
			image: ad.imagePortrait,
			orientation: "portrait",
			imageLandscape: void 0
		};
		return ad;
	});
	if (slot === "home2") return list.map((ad) => {
		if (ad.imageLandscape) return {
			...ad,
			image: ad.imageLandscape,
			orientation: "landscape",
			imagePortrait: void 0
		};
		return ad;
	});
	return list;
}
function readRaw(slot) {
	if (inMemoryAdsCache[slot]) return inMemoryAdsCache[slot];
	if (typeof window === "undefined") return sanitizeSlotAds(slot, DEFAULTS[slot]);
	try {
		const raw = localStorage.getItem(ADS_KEYS[slot]);
		const parsed = sanitizeSlotAds(slot, raw ? JSON.parse(raw) : DEFAULTS[slot]);
		inMemoryAdsCache[slot] = parsed;
		return parsed;
	} catch {
		return sanitizeSlotAds(slot, DEFAULTS[slot]);
	}
}
function writeRaw(slot, ads) {
	const sanitized = sanitizeSlotAds(slot, ads);
	inMemoryAdsCache[slot] = sanitized;
	safeSetItem(ADS_KEYS[slot], JSON.stringify(sanitized));
}
function loadTrash() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(TRASH_KEY);
		const items = raw ? JSON.parse(raw) : [];
		const now = Date.now();
		const fresh = items.filter((i) => i.deletedAt && now - new Date(i.deletedAt).getTime() < TRASH_TTL_MS);
		if (fresh.length !== items.length) safeSetItem(TRASH_KEY, JSON.stringify(fresh));
		return fresh;
	} catch {
		return [];
	}
}
function saveTrash(items) {
	safeSetItem(TRASH_KEY, JSON.stringify(items));
	if (typeof window !== "undefined") try {
		window.dispatchEvent(new Event("nt:ads-updated"));
	} catch {}
}
/** Automatically cleans up oversized or legacy base64 entries from localStorage to maintain healthy quota */
function cleanCloggedStorage() {
	if (typeof window === "undefined") return;
	try {
		let totalChars = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k) totalChars += (localStorage.getItem(k) || "").length;
		}
		if (totalChars > 1e6) {
			console.warn(`[Storage] High localStorage usage (${Math.round(totalChars / 1024)} KB). Deep cleaning bulky storage...`);
			localStorage.removeItem(TRASH_KEY);
			const rawMedia = localStorage.getItem("nt_media_library_v1");
			if (rawMedia) try {
				const media = JSON.parse(rawMedia);
				if (Array.isArray(media)) {
					const light = media.filter((m) => !m?.dataUrl || m.dataUrl.length < 6e4).slice(0, 3);
					if (light.length > 0) localStorage.setItem("nt_media_library_v1", JSON.stringify(light));
					else localStorage.removeItem("nt_media_library_v1");
				}
			} catch {
				localStorage.removeItem("nt_media_library_v1");
			}
			for (const slot of [
				"reel_ads",
				"home1",
				"home2",
				"ad3",
				"popup",
				"leaderboard",
				"hero_showcase"
			]) {
				const slotKey = ADS_KEYS[slot];
				const raw = localStorage.getItem(slotKey);
				if (raw && raw.length > 2e5) {
					try {
						const parsed = JSON.parse(raw);
						if (Array.isArray(parsed)) inMemoryAdsCache[slot] = parsed;
					} catch {}
					console.warn(`[Storage] Evicting oversized local cache for slot "${slot}" (${Math.round(raw.length / 1024)} KB). (Data remains safe in server database).`);
					localStorage.removeItem(slotKey);
				}
			}
			let finalChars = 0;
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k) finalChars += (localStorage.getItem(k) || "").length;
			}
			console.info(`[Storage] Deep clean finished. Storage freed to: ${Math.round(finalChars / 1024)} KB.`);
		}
	} catch {}
}
/** Move all expired (past expiresAt) ads from every slot into trash. */
function processExpiredAds() {
	if (typeof window === "undefined") return;
	cleanCloggedStorage();
	const now = Date.now();
	const trash = loadTrash();
	Object.keys(ADS_KEYS).forEach((slot) => {
		const list = readRaw(slot);
		const keep = [];
		list.forEach((ad) => {
			if (ad.expiresAt && new Date(ad.expiresAt).getTime() <= now) trash.push({
				...ad,
				slot,
				deletedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			else keep.push(ad);
		});
		if (keep.length !== list.length) writeRaw(slot, keep);
	});
	saveTrash(trash);
}
function loadAds(slot = "home1") {
	return readRaw(slot);
}
function saveAds(a, slot = "home1") {
	try {
		writeRaw(slot, a);
	} catch (err) {
		console.warn("[saveAds] writeRaw error handled:", err);
	}
	if (typeof window !== "undefined") try {
		window.dispatchEvent(new Event("nt:ads-updated"));
	} catch {}
	syncAdConfigurationToServer();
}
/** Soft-delete: remove from active slot, push to trash with deletedAt. */
function trashAds(ids, slot) {
	const list = readRaw(slot);
	const moving = list.filter((a) => ids.includes(a.id));
	writeRaw(slot, list.filter((a) => !ids.includes(a.id)));
	const trash = loadTrash();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	moving.forEach((m) => trash.push({
		...m,
		slot,
		deletedAt: now
	}));
	saveTrash(trash);
	syncAdConfigurationToServer();
}
/** Restore a trashed ad back into its slot. */
function restoreFromTrash(id) {
	const trash = loadTrash();
	const item = trash.find((t) => t.id === id);
	if (!item) return;
	const slot = item.slot || "home1";
	const list = readRaw(slot);
	const { deletedAt, slot: _s, ...clean } = item;
	writeRaw(slot, [...list, clean]);
	saveTrash(trash.filter((t) => t.id !== id));
	syncAdConfigurationToServer();
}
/** Permanently delete from trash. */
function purgeFromTrash(id) {
	saveTrash(loadTrash().filter((t) => t.id !== id));
}
var deleteAdStaticFilesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((urls) => z.array(z.string()).parse(urls)).handler(createSsrRpc("a76ed6fe6d9e768c9b491e3918e54e2f3edbe342884378d0c60678bcca5b54fe"));
var getAdConfigurationServer = createServerFn({ method: "GET" }).handler(createSsrRpc("e10c1724b54a5d0e4ddc7f147e00f08845b00a2e41a59862625f5831cfba8629"));
var saveAdConfigurationServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((config) => z.object({
	slots: z.record(z.any()),
	modes: z.record(z.any()),
	scripts: z.record(z.any()),
	rotations: z.record(z.any()),
	popupConfig: z.record(z.any()).optional()
}).parse(config)).handler(createSsrRpc("867751394f3b0a32d0e5596bca686f87633494837852fe31aadabda10cc1fb52"));
function syncAdConfigurationToServer() {
	saveAdConfigurationServer({ data: {
		slots: {
			home1: loadAds("home1"),
			home2: loadAds("home2"),
			ad3: loadAds("ad3"),
			popup: loadAds("popup"),
			leaderboard: loadAds("leaderboard"),
			hero_showcase: loadAds("hero_showcase"),
			reel_ads: loadAds("reel_ads"),
			post_ads: loadAds("post_ads")
		},
		modes: {
			home1: loadAdSlotMode("home1"),
			home2: loadAdSlotMode("home2"),
			ad3: loadAdSlotMode("ad3"),
			popup: loadAdSlotMode("popup"),
			leaderboard: loadAdSlotMode("leaderboard"),
			hero_showcase: loadAdSlotMode("hero_showcase"),
			reel_ads: loadAdSlotMode("reel_ads"),
			post_ads: loadAdSlotMode("post_ads")
		},
		scripts: {
			home1: loadAdSlotScript("home1"),
			home2: loadAdSlotScript("home2"),
			ad3: loadAdSlotScript("ad3"),
			popup: loadAdSlotScript("popup"),
			leaderboard: loadAdSlotScript("leaderboard"),
			hero_showcase: loadAdSlotScript("hero_showcase"),
			reel_ads: loadAdSlotScript("reel_ads"),
			post_ads: loadAdSlotScript("post_ads")
		},
		rotations: {
			home1: loadAdRotation("home1"),
			home2: loadAdRotation("home2"),
			ad3: loadAdRotation("ad3"),
			popup: loadAdRotation("popup"),
			leaderboard: loadAdRotation("leaderboard"),
			hero_showcase: loadAdRotation("hero_showcase"),
			reel_ads: loadAdRotation("reel_ads"),
			post_ads: loadAdRotation("post_ads")
		},
		popupConfig: loadPopupConfig()
	} }).catch(() => {});
}
// src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		position: "top-center",
		className: "toaster group",
		toastOptions: {
			style: {
				background: "#1A1110",
				color: "#ffffff",
				border: "1px solid #1A1110"
			},
			classNames: {
				toast: "group toast group-[.toaster]:shadow-lg font-medium",
				description: "group-[.toast]:text-[#141414]/90",
				actionButton: "group-[.toast]:bg-[#141414] group-[.toast]:text-white",
				cancelButton: "group-[.toast]:bg-black/10 group-[.toast]:text-[#141414]",
				title: "group-[.toast]:text-[#141414] font-semibold",
				error: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
				success: "group-[.toaster]:!bg-[#34C759] group-[.toaster]:!text-[#141414] group-[.toaster]:!border-[#2EAA4C] group-[.toaster]:shadow-md [&_[data-title]]:!text-[#141414] [&_[data-description]]:!text-[#141414] [&_[data-icon]]:!text-[#141414] [&_svg]:!text-[#141414] [&_svg]:!stroke-[#141414]"
			}
		},
		...props
	});
};
// src/components/site/AnalyticsInjector.tsx
/**
* Client-side injector for analytics/verification tags configured in
* Admin → Site Settings. Runs only in the browser; safe for SSR.
*/
function AnalyticsInjector() {
	useEffect(() => {
		const s = loadSettings();
		const head = document.head;
		const addMeta = (name, content) => {
			if (!content) return;
			if (document.querySelector(`meta[name="${name}"]`)) return;
			const m = document.createElement("meta");
			m.name = name;
			m.content = content;
			head.appendChild(m);
		};
		addMeta("google-site-verification", s.googleSiteVerification);
		addMeta("msvalidate.01", s.bingSiteVerification);
		addMeta("facebook-domain-verification", s.facebookDomainVerification);
		addMeta("p:domain_verify", s.pinterestSiteVerification);
		addMeta("yandex-verification", s.yandexVerification);
		const addScript = (id, src, inline, attrs = {}) => {
			if (document.getElementById(id)) return;
			const el = document.createElement("script");
			el.id = id;
			el.async = true;
			if (src) el.src = src;
			if (inline) el.text = inline;
			Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
			head.appendChild(el);
		};
		if (s.googleAnalyticsId) {
			addScript("ga-src", `https://www.googletagmanager.com/gtag/js?id=${s.googleAnalyticsId}`);
			addScript("ga-init", void 0, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.googleAnalyticsId}');`);
		}
		if (s.googleTagManagerId) addScript("gtm-init", void 0, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.googleTagManagerId}');`);
		if (s.googleAdsenseId) addScript("adsense-src", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${s.googleAdsenseId}`, void 0, { crossorigin: "anonymous" });
		if (s.facebookPixelId) addScript("fb-pixel", void 0, `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.facebookPixelId}');fbq('track','PageView');`);
		if (s.firebaseConfigJson) try {
			const cfg = JSON.parse(s.firebaseConfigJson);
			addScript("firebase-init", void 0, `window.__FIREBASE_CONFIG__=${JSON.stringify(cfg)};`);
		} catch {}
	}, []);
	return null;
}
// src/components/site/NotFound.tsx
function NotFound() {
	const popular = sections.filter((s) => s !== "Others").slice(0, 6);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 px-4 py-16",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-red-600",
							children: "Error 404"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-4 font-bold leading-none text-foreground",
							style: {
								fontFamily: "'Playfair Display', Georgia, serif",
								fontSize: "clamp(5rem, 18vw, 10rem)"
							},
							children: "404"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-2 text-2xl font-bold text-foreground sm:text-3xl",
							style: { fontFamily: "'Playfair Display', Georgia, serif" },
							children: "This story is missing from our archive"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base",
							children: "The page you're looking for may have been moved, removed, or never existed. Try heading back to the homepage or explore a category below."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3",
							children: [
								/* @__PURE__ */ jsxs(Link$1, {
									to: "/",
									className: "inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90",
									children: [/* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }), " Go to Homepage"]
								}),
								/* @__PURE__ */ jsxs(Link$1, {
									to: "/search",
									className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), " Search News"]
								}),
								/* @__PURE__ */ jsxs(Link$1, {
									to: "/archive",
									className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Browse Archive"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 border-t border-border pt-8",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-4 w-4" }), " Popular Categories"]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap justify-center gap-2",
								children: popular.map((name) => /* @__PURE__ */ jsx(Link$1, {
									to: "/$slug",
									params: { slug: slugify(name) },
									className: "rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background",
									children: name
								}, name))
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
// src/components/layout/ErrorComponent.tsx
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				error?.message && /* @__PURE__ */ jsx("div", {
					className: "mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md text-xs font-mono text-left break-all",
					children: error.message
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50",
						children: "Go home"
					})]
				})
			]
		})
	});
}
// src/components/layout/RootShell.tsx
var chunkRecoveryScript = `(function(){function h(e){try{var m=(e&&(e.message||(e.reason&&e.reason.message)||String(e.reason||e)))||'';if(/failed to fetch dynamically imported module/i.test(m)||/importing a module script failed/i.test(m)||/loading chunk/i.test(m)||/does not provide an export named/i.test(m)||/The requested module/i.test(m)||/ChunkLoadError/i.test(m)||/SyntaxError/i.test(m)||/Unexpected (?:end of input|token)/i.test(m)||/error #418/i.test(m)||/error #423/i.test(m)||/error #425/i.test(m)){var k='chunk_reload_ts',l=Number(sessionStorage.getItem(k)||0),n=Date.now();if(n-l>5000){sessionStorage.setItem(k,String(n));if('caches' in window){caches.keys().then(function(ks){for(var i=0;i<ks.length;i++)caches.delete(ks[i])}).catch(function(){});}window.location.reload();}}}catch(x){}}window.addEventListener('vite:preloadError',function(ev){try{if(ev&&ev.preventDefault)ev.preventDefault();var k='chunk_reload_ts',l=Number(sessionStorage.getItem(k)||0),n=Date.now();if(n-l>5000){sessionStorage.setItem(k,String(n));window.location.reload();}}catch(x){}});window.addEventListener('error',h);window.addEventListener('unhandledrejection',h);})();`;
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		className: "overflow-x-clip max-w-full",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeInitScript } }),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: chunkRecoveryScript } }),
			/* @__PURE__ */ jsx(HeadContent, {})
		] }), /* @__PURE__ */ jsxs("body", {
			className: "overflow-x-clip max-w-full min-h-screen",
			children: [children, /* @__PURE__ */ jsx(Scripts, {})]
		})]
	});
}
// src/styles.css?url
var styles_default = "/assets/styles-DgcS5UT3.css";
// src/components/layout/rootHead.ts
function generateRootHead(loaderData) {
	const s = loaderData?.settings;
	const siteTitle = s?.siteName || "News Timeline";
	const tagline = s?.tagline || "Breaking News";
	const title = s?.siteName ? `${s.siteName} – ${tagline}` : "News Timeline – Breaking News | Finance | Business | Market";
	const desc = s?.metaDescription || "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";
	const robotsContent = `${s?.seoRobotsIndex === false ? "noindex" : "index"}, ${s?.seoRobotsFollow === false ? "nofollow" : "follow"}`;
	const canonicalBase = s?.seoCanonicalBaseUrl ? s.seoCanonicalBaseUrl.replace(/\/$/, "") : "";
	const ogImage = s?.seoOgImage || (canonicalBase ? `${canonicalBase}/og-image.jpg` : "/og-image.jpg");
	const rawTwitter = s?.twitter || "";
	let twitterHandle = "@NewsTimeline";
	if (rawTwitter) {
		const cleaned = rawTwitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, "").replace(/^@/, "").trim();
		if (cleaned) twitterHandle = `@${cleaned}`;
	}
	const metaTags = [
		{ charSet: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{ title },
		{
			name: "description",
			content: desc
		},
		{
			name: "robots",
			content: robotsContent
		},
		{
			name: "author",
			content: siteTitle
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: desc
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:image",
			content: ogImage
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:site",
			content: twitterHandle
		},
		{
			name: "twitter:creator",
			content: twitterHandle
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: desc
		},
		{
			name: "twitter:image",
			content: ogImage
		}
	];
	if (s?.seoKeywords) metaTags.push({
		name: "keywords",
		content: s.seoKeywords
	});
	if (s?.seoGooglebotNews ?? true) {
		metaTags.push({
			name: "googlebot-news",
			content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		});
		metaTags.push({
			name: "googlebot",
			content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		});
	}
	metaTags.push({
		httpEquiv: "Content-Security-Policy",
		content: "upgrade-insecure-requests"
	});
	if (s?.googleSiteVerification) metaTags.push({
		name: "google-site-verification",
		content: s.googleSiteVerification
	});
	if (s?.bingSiteVerification) metaTags.push({
		name: "msvalidate.01",
		content: s.bingSiteVerification
	});
	if (s?.facebookDomainVerification) metaTags.push({
		name: "facebook-domain-verification",
		content: s.facebookDomainVerification
	});
	if (s?.pinterestSiteVerification) metaTags.push({
		name: "p:domain_verify",
		content: s.pinterestSiteVerification
	});
	if (s?.yandexVerification) metaTags.push({
		name: "yandex-verification",
		content: s.yandexVerification
	});
	const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
	const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
	const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
	const links = [
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com"
		},
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous"
		},
		{
			rel: "stylesheet",
			href: styles_default
		},
		{
			rel: "alternate",
			type: "application/rss+xml",
			title: `${siteTitle} RSS Feed`,
			href: "/rss.xml"
		}
	];
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": s?.seoOrganizationType || "NewsMediaOrganization",
		name: s?.seoNewsPublicationName || siteTitle,
		url: canonicalBase || "http://localhost:3099",
		description: desc
	};
	if (s?.logoLight || canonicalBase) orgSchema.logo = s?.logoLight || `${canonicalBase}/logo.png`;
	if (s?.seoEditorialContactEmail || s?.contactEmail) orgSchema.contactPoint = {
		"@type": "ContactPoint",
		email: s?.seoEditorialContactEmail || s?.contactEmail,
		contactType: "editorial"
	};
	orgSchema.publishingPrinciples = s?.seoEditorialPolicyUrl || "/editorial-policy";
	orgSchema.correctionsPolicy = s?.seoCorrectionsPolicyUrl || "/contact";
	orgSchema.diversityPolicy = s?.seoFactCheckingPolicyUrl || "/fact-checking-policy";
	const scripts = [{
		type: "application/ld+json",
		children: JSON.stringify(orgSchema)
	}];
	const asyncFonts = s?.asyncFontsEnabled ?? true;
	if (googleFontsUrl && typeof googleFontsUrl === "string" && googleFontsUrl.trim()) {
		if (asyncFonts) {
			links.push({
				rel: "preload",
				as: "style",
				href: googleFontsUrl
			});
			scripts.push({ children: `(function(){var append=function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(googleFontsUrl)};document.head.appendChild(l);};if(typeof requestAnimationFrame==='function'){requestAnimationFrame(append);}else{setTimeout(append,0);}})();` });
		} else links.push({
			rel: "stylesheet",
			href: googleFontsUrl
		});
	}
	return {
		meta: metaTags,
		links,
		scripts
	};
}
// src/lib/form-a11y.ts
/**
* Global Form Control Accessibility & Autofill Enhancement
* Resolves Chrome DevTools issues:
* 1. "A form field element should have an id or name attribute"
* 2. "No label associated with a form field"
*/
var initialized = false;
function initFormAccessibility() {
	if (typeof window === "undefined" || initialized) return () => {};
	initialized = true;
	let counter = 0;
	function patchElement(el) {
		const tag = el.tagName;
		if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return;
		const input = el;
		const currentId = input.getAttribute("id");
		const currentName = input.getAttribute("name");
		if (!currentId && !currentName) {
			const placeholder = input.getAttribute("placeholder") || "";
			const type = input.getAttribute("type") || tag.toLowerCase();
			const generated = `${(placeholder || type || "field").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "field"}-${++counter}`;
			input.setAttribute("id", generated);
			input.setAttribute("name", generated);
		} else if (!currentId && currentName) {
			if (document.getElementById(currentName)) input.setAttribute("id", `${currentName}-${++counter}`);
			else input.setAttribute("id", currentName);
		} else if (currentId && !currentName) input.setAttribute("name", currentId);
		const hasAriaLabel = input.getAttribute("aria-label") || input.getAttribute("aria-labelledby");
		const hasTitle = input.getAttribute("title");
		const isInsideLabel = Boolean(input.closest("label"));
		const assignedId = input.getAttribute("id");
		const hasExplicitLabel = assignedId ? Boolean(document.querySelector(`label[for="${assignedId}"]`)) : false;
		if (!hasAriaLabel && !hasTitle && !isInsideLabel && !hasExplicitLabel) {
			const parent = input.parentElement;
			const siblingLabel = parent ? parent.querySelector("label:not([for])") : null;
			if (siblingLabel && assignedId) siblingLabel.setAttribute("for", assignedId);
			else {
				const fallbackText = input.getAttribute("placeholder") || (input.getAttribute("name") || "").replace(/[-_]/g, " ") || input.getAttribute("type") || "Form field";
				input.setAttribute("aria-label", fallbackText);
			}
		}
		if (!input.hasAttribute("autocomplete")) {
			const nameOrId = (input.getAttribute("name") || input.getAttribute("id") || "").toLowerCase();
			if ([
				"country",
				"city",
				"state",
				"address",
				"zip",
				"postal",
				"phone",
				"tel",
				"mobile",
				"email",
				"author",
				"username",
				"password",
				"search",
				"q",
				"query",
				"title",
				"name",
				"first-name",
				"last-name"
			].some((kw) => nameOrId.includes(kw))) {
				const isSearch = input.getAttribute("type") === "search" || nameOrId.includes("search") || nameOrId === "q";
				const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
				if (isSearch || isAdmin) input.setAttribute("autocomplete", "off");
				else if (nameOrId.includes("email")) input.setAttribute("autocomplete", "email");
				else if (nameOrId.includes("tel") || nameOrId.includes("phone")) input.setAttribute("autocomplete", "tel");
				else if (nameOrId.includes("country")) input.setAttribute("autocomplete", "country-name");
				else if (nameOrId.includes("city")) input.setAttribute("autocomplete", "address-level2");
				else if (nameOrId.includes("state")) input.setAttribute("autocomplete", "address-level1");
				else input.setAttribute("autocomplete", "off");
			}
		}
	}
	function patchAll() {
		try {
			document.querySelectorAll("input, textarea, select").forEach(patchElement);
		} catch {}
	}
	let timer = null;
	let observer = null;
	const startPatching = () => {
		patchAll();
		try {
			observer = new MutationObserver((mutations) => {
				for (const m of mutations) if (m.type === "childList") m.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const el = node;
						patchElement(el);
						el.querySelectorAll?.("input, textarea, select").forEach(patchElement);
					}
				});
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		} catch {}
	};
	if (typeof window !== "undefined") {
		if ("requestIdleCallback" in window) window.requestIdleCallback(startPatching, { timeout: 1500 });
		else timer = setTimeout(startPatching, 800);
	}
	return () => {
		if (timer) clearTimeout(timer);
		observer?.disconnect();
		initialized = false;
	};
}
// src/components/layout/useRootEffects.ts
function useRootEffects(loaderData) {
	useEffect(() => {
		if (loaderData?.settings?.forceHttps && window.location.protocol === "http:" && window.location.hostname !== "localhost") window.location.protocol = "https:";
		if (typeof window === "undefined" || !loaderData) return;
		const { settings, homepageConfig, adsConfig, fontConfig } = loaderData;
		if (settings) localStorage.setItem("nt:site-settings", JSON.stringify(settings));
		if (fontConfig) localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(fontConfig));
		if (homepageConfig) localStorage.setItem("nt:homepage-config:v1", JSON.stringify(homepageConfig));
		if (adsConfig) {
			if (adsConfig.slots) Object.keys(adsConfig.slots).forEach((slot) => {
				const slotAds = adsConfig.slots[slot];
				if (Array.isArray(slotAds) && slotAds.length > 0) {
					localStorage.setItem(`nt:ads:v2:${slot}`, JSON.stringify(slotAds));
					const legacyKey = slot === "home1" ? "nt:site-ads" : `nt:site-ads-${slot}`;
					localStorage.setItem(legacyKey, JSON.stringify(slotAds));
				}
			});
			if (adsConfig.modes) localStorage.setItem("nt:ad-slot-mode", JSON.stringify(adsConfig.modes));
			if (adsConfig.scripts) localStorage.setItem("nt:ad-slot-script", JSON.stringify(adsConfig.scripts));
			if (adsConfig.rotations) localStorage.setItem("nt:site-ads-rotation", JSON.stringify(adsConfig.rotations));
			if (adsConfig.popupConfig) localStorage.setItem("nt:popup-ad-config", JSON.stringify(adsConfig.popupConfig));
			window.dispatchEvent(new Event("nt:ads-updated"));
			window.dispatchEvent(new Event("nt:homepage-updated"));
		}
	}, [loaderData]);
	const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
	useEffect(() => {
		const faceCss = buildFontFaceCss(fontConfig.fonts);
		let faceStyle = document.getElementById("nt-font-face");
		if (!faceStyle) {
			faceStyle = document.createElement("style");
			faceStyle.id = "nt-font-face";
			document.head.appendChild(faceStyle);
		}
		faceStyle.textContent = faceCss;
		const varsCss = buildSectionCssVars(fontConfig);
		let varsStyle = document.getElementById("nt-font-vars");
		if (!varsStyle) {
			varsStyle = document.createElement("style");
			varsStyle.id = "nt-font-vars";
			document.head.appendChild(varsStyle);
		}
		varsStyle.textContent = varsCss;
		const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
		const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
		let fontLink = document.getElementById("nt-google-fonts");
		if (googleFontsUrl) {
			if (!fontLink) {
				fontLink = document.createElement("link");
				fontLink.id = "nt-google-fonts";
				fontLink.rel = "stylesheet";
				fontLink.href = googleFontsUrl;
				document.head.appendChild(fontLink);
			} else if (fontLink.href !== googleFontsUrl) fontLink.href = googleFontsUrl;
		}
		return () => {
			faceStyle?.remove();
			varsStyle?.remove();
		};
	}, [fontConfig]);
	useEffect(() => {
		const handleFontUpdate = (e) => {
			try {
				const detail = e.detail;
				if (detail) {
					const fc = typeof detail === "string" ? JSON.parse(detail) : detail;
					const varsCss = buildSectionCssVars(fc);
					const varsStyle = document.getElementById("nt-font-vars");
					if (varsStyle) varsStyle.textContent = varsCss;
				}
			} catch {}
		};
		window.addEventListener("nt:fonts-updated", handleFontUpdate);
		return () => window.removeEventListener("nt:fonts-updated", handleFontUpdate);
	}, []);
	useEffect(() => {
		return initFormAccessibility();
	}, []);
	useEffect(() => {
		const handleUnhandledRejection = (event) => {
			const reason = event?.reason;
			const msg = String(reason?.message || reason || "");
			if (msg.includes("Unexpected token '<'") || msg.includes("<!DOCTYPE") || msg.includes("is not valid JSON")) {
				console.warn("[App Auto-Recovery] Stale bundle / server response mismatch detected. Reloading page...");
				const lastReload = sessionStorage.getItem("app_cache_bust_reload");
				const now = Date.now();
				if (!lastReload || now - parseInt(lastReload, 10) > 8e3) {
					sessionStorage.setItem("app_cache_bust_reload", now.toString());
					window.location.reload();
				}
			}
		};
		window.addEventListener("unhandledrejection", handleUnhandledRejection);
		return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
	}, []);
}
// src/components/layout/rootUtils.ts
function buildAdConfigData(loaderAdsConfig) {
	const defaultSlots = {
		home1: defaultAdSlides,
		home2: defaultAdSlidesHome2,
		ad3: defaultAdSlidesAd3,
		popup: defaultAdSlidesPopup,
		leaderboard: defaultAdSlidesLeaderboard,
		hero_showcase: [],
		reel_ads: []
	};
	if (loaderAdsConfig) return {
		...loaderAdsConfig,
		slots: {
			...defaultSlots,
			...loaderAdsConfig.slots || {}
		}
	};
	return {
		slots: defaultSlots,
		modes: {
			home1: "image",
			home2: "image",
			ad3: "image",
			popup: "image",
			leaderboard: "image",
			hero_showcase: "image",
			reel_ads: "image"
		},
		scripts: {
			home1: "",
			home2: "",
			ad3: "",
			popup: "",
			leaderboard: "",
			hero_showcase: "",
			reel_ads: ""
		},
		rotations: {
			home1: 5,
			home2: 5,
			ad3: 5,
			popup: 6,
			leaderboard: 5,
			hero_showcase: 5,
			reel_ads: 5
		}
	};
}
// src/lib/setup.functions.ts
var checkSetupStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44"));
var testDatabaseConnection = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7bd773403e6cf1738bce63ecdf682bbfa435a41a857b4c398d398e6df9980a14"));
var executeSetup = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("424c41ecfd6de125add850459642fbb101dfbf9443245c9923f618fb115e3edc"));
// src/routes/__root.tsx
function LazyToaster() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;
	return /* @__PURE__ */ jsx(Toaster$1, {});
}
function NotFoundComponent() {
	return /* @__PURE__ */ jsx(NotFound, {});
}
var Route$60 = createRootRouteWithContext()({
	beforeLoad: async ({ location }) => {
		if (location.pathname.startsWith("/api/") || location.pathname === "/api/rss" || location.pathname === "/rss.xml" || location.pathname === "/sitemap.xml" || location.pathname === "/news-sitemap.xml") return;
		try {
			const status = await checkSetupStatus();
			const isSetupPage = location.pathname === "/setup";
			if (status.required) {
				if (!isSetupPage) throw redirect({ to: "/setup" });
				return;
			}
			if (!status.required && isSetupPage) throw redirect({ to: "/" });
		} catch (err) {
			if (err.isRedirect || err.status === 301 || err.status === 302 || err.status === 307 || err.headers) throw err;
			console.error("[__root beforeLoad] Setup check error:", err);
		}
		try {
			const rules = await getRedirectRulesServer();
			const currentPath = location.pathname;
			const matched = rules.find((r) => r.source.toLowerCase().trim() === currentPath.toLowerCase().trim());
			if (matched && matched.destination) {
				incrementRedirectHitServer({ data: matched.id }).catch(() => {});
				throw redirect({
					href: matched.destination,
					code: 301
				});
			}
		} catch (err) {
			if (err.isRedirect || err.status === 301 || err.status === 302 || err.headers) throw err;
		}
	},
	loader: async ({ location }) => {
		if (location.pathname === "/setup") return {
			settings: null,
			homepageConfig: null,
			adsConfig: null,
			fontConfig: null,
			categories: []
		};
		try {
			const [settings, homepageConfig, adsConfig, fontConfig, categories] = await Promise.all([
				getSiteSettingsServer(),
				getHomepageConfigServer(),
				getAdConfigurationServer(),
				getFontConfigServer(),
				getCategories()
			]);
			return {
				settings,
				homepageConfig,
				adsConfig,
				fontConfig,
				categories
			};
		} catch (err) {
			console.error("[Root Loader] Failed to prefetch config:", err);
			return {
				settings: null,
				homepageConfig: null,
				adsConfig: null,
				fontConfig: null,
				categories: []
			};
		}
	},
	head: ({ loaderData }) => generateRootHead(loaderData),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootComponent() {
	const { queryClient } = Route$60.useRouteContext();
	const loaderData = Route$60.useLoaderData();
	useRootEffects(loaderData);
	const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
	const adConfigData = buildAdConfigData(loaderData?.adsConfig);
	const contextValue = {
		settings: loaderData?.settings ?? defaultSettings,
		homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
		adConfig: adConfigData,
		fontConfig,
		categories: loaderData?.categories ?? []
	};
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs(AdSettingsProvider, {
			value: contextValue,
			children: [
				/* @__PURE__ */ jsx(Outlet, {}),
				/* @__PURE__ */ jsx(LazyToaster, {}),
				/* @__PURE__ */ jsx(AnalyticsInjector, {})
			]
		}) })
	});
}
// src/routes/index.tsx
var $$splitComponentImporter$51 = () => import("./routes-CUircFCh.js");
var HOME_IMG = hero_markets_default;
var HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
var HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
var Route$59 = createFileRoute("/")({
	loader: async () => {
		try {
			const [articles, tags, settings] = await Promise.all([
				getHomepageArticles({ data: 40 }).catch((err) => {
					console.warn("[Homepage Loader] getHomepageArticles fallback to empty:", err?.message || err);
					return [];
				}),
				getTags().catch((err) => {
					console.warn("[Homepage Loader] getTags fallback to empty:", err?.message || err);
					return [];
				}),
				getSiteSettingsServer().catch(() => null)
			]);
			return {
				articles: Array.isArray(articles) ? articles : [],
				tags: Array.isArray(tags) ? tags : [],
				settings
			};
		} catch (err) {
			console.error("[Homepage Loader] Top-level error, rendering fallback:", err);
			return {
				articles: [],
				tags: [],
				settings: null
			};
		}
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		const firstArticle = loaderData?.articles?.[0];
		const heroImage = firstArticle ? getArticleImage(firstArticle.featuredImage, 0) : HOME_IMG;
		const canonicalUrl = `${s?.seoCanonicalBaseUrl?.trim()?.replace(/\/$/, "") || (typeof process !== "undefined" && process.env?.APP_ORIGIN ? process.env.APP_ORIGIN.replace(/\/$/, "") : "") || (typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://todaytripura.com")}/`;
		const links = [{
			rel: "canonical",
			href: canonicalUrl
		}];
		const siteTitle = s?.siteName || "News Theme";
		const title = s?.siteName ? `${s.siteName} – ${s.tagline || "Breaking News"}` : HOME_TITLE;
		const desc = s?.metaDescription || HOME_DESC;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: desc
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: desc
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: canonicalUrl
				},
				{
					property: "og:image",
					content: heroImage || HOME_IMG
				},
				{
					property: "og:image:width",
					content: "1200"
				},
				{
					property: "og:image:height",
					content: "630"
				},
				{
					property: "og:site_name",
					content: siteTitle
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: desc
				},
				{
					name: "twitter:image",
					content: heroImage || HOME_IMG
				}
			],
			links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
// src/routes/$slug.tsx
var $$splitComponentImporter$50 = () => import("./_slug-DwiZUNCL.js");
var Route$58 = createFileRoute("/$slug")({
	validateSearch: (raw) => {
		const p = Number(raw.page);
		return { page: p > 0 ? p : void 0 };
	},
	loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
	loader: async ({ params, deps }) => {
		try {
			const data = await getCategoryData({ data: {
				slug: params.slug,
				page: deps.page || 1,
				limit: 10
			} });
			if (data?.category?.redirectUrl) throw redirect({ href: data.category.redirectUrl });
			return data;
		} catch (err) {
			if (err && typeof err === "object" && ("to" in err || "href" in err || "status" in err || err.isRedirect)) throw err;
			console.warn("[Category loader] Error:", err);
			return null;
		}
	},
	head: ({ params }) => {
		const title = decodeURIComponent(params.slug).replace(/-/g, " ");
		const cap = title.charAt(0).toUpperCase() + title.slice(1);
		return { meta: [{ title: `${cap} – News Theme` }, {
			name: "description",
			content: `Latest ${cap} news, analysis and reports from News Theme.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
// src/routes/about.tsx
var $$splitComponentImporter$49 = () => import("./about-Uh2NCFbZ.js");
var Route$57 = createFileRoute("/about")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "about");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "About",
		defaultDescription: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
		slug: "/about"
	}),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
// src/components/admin/layout/navItems.ts
var ADMIN_NAV_ITEMS = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/inbox",
		label: "Inbox",
		icon: Inbox
	},
	{
		to: "/admin/articles",
		label: "Articles",
		icon: Newspaper
	},
	{
		to: "/admin/categories",
		label: "Categories",
		icon: FolderTree
	},
	{
		to: "/admin/tags",
		label: "Tags",
		icon: Tag
	},
	{
		to: "/admin/comments",
		label: "Comments",
		icon: MessageSquare
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users
	},
	{
		to: "/admin/roles",
		label: "Roles",
		icon: ShieldCheck
	},
	{
		to: "/admin/journalists",
		label: "Journalist",
		icon: PenLine
	},
	{
		to: "/admin/rewards",
		label: "Reward",
		icon: Gift
	},
	{
		to: "/admin/pages",
		label: "Pages",
		icon: FileText
	},
	{
		to: "/admin/homepage",
		label: "Homepage Edit",
		icon: Home
	},
	{
		to: "/admin/reels",
		label: "Reels & Shorts",
		icon: Newspaper
	},
	{
		to: "/admin/advertisements",
		label: "Advertisement",
		icon: Megaphone
	},
	{
		to: "/admin/settings",
		label: "Site Settings",
		icon: Settings
	},
	{
		to: "/admin/files",
		label: "File Manager",
		icon: FolderOpen
	},
	{
		to: "/admin/updates",
		label: "Website Update",
		icon: Rocket
	}
];
/**
* Panels accessible by the 'editor' role.
* Editors can only access and view:
* /admin/articles, /admin/inbox, /admin/comments, /admin/advertisements,
* /admin/files, /admin/journalists, /admin/categories, /admin/tags
*/
var EDITOR_ALLOWED_ROUTES = [
	"/admin/articles",
	"/admin/inbox",
	"/admin/comments",
	"/admin/advertisements",
	"/admin/files",
	"/admin/journalists",
	"/admin/categories",
	"/admin/tags"
];
function isEditorAllowedRoute(pathname) {
	const clean = pathname.split("?")[0].replace(/\/+$/, "") || "/";
	return EDITOR_ALLOWED_ROUTES.some((route) => {
		const cleanRoute = route.replace(/\/+$/, "");
		return clean === cleanRoute || clean.startsWith(cleanRoute + "/");
	});
}
// src/routes/admin.tsx
var $$splitComponentImporter$48 = () => import("./admin-CKg9fDLd.js");
var $$splitErrorComponentImporter$2 = () => import("./admin-Cql23bfF.js");
var verifiedAdminTokens = /* @__PURE__ */ new Map();
var Route$56 = createFileRoute("/admin")({
	ssr: false,
	pendingComponent: AdminPendingFallback,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
	beforeLoad: async ({ location }) => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user || !data.session?.access_token) throw redirect({ to: "/auth" });
		const token = data.session.access_token;
		const now = Date.now();
		let userRole = null;
		const cached = verifiedAdminTokens.get(token);
		if (cached && cached.expiry > now) userRole = cached.role;
		else try {
			const [res, roleRes] = await Promise.all([getUserServer({ data: token }), getCurrentUserRole({ data: token })]);
			if (!res.user) {
				verifiedAdminTokens.delete(token);
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			if (!roleRes.role || !["admin", "editor"].includes(roleRes.role)) {
				verifiedAdminTokens.delete(token);
				throw redirect({ to: "/" });
			}
			userRole = roleRes.role;
			verifiedAdminTokens.set(token, {
				expiry: now + 12e4,
				role: userRole
			});
		} catch (e) {
			verifiedAdminTokens.delete(token);
			if (e?.headers || e?.to) throw e;
			await authClient.auth.signOut();
			throw redirect({ to: "/auth" });
		}
		if (userRole === "editor") {
			const currentPath = location.pathname;
			if (!isEditorAllowedRoute(currentPath)) throw redirect({ to: "/admin/articles" });
		}
		return {
			user: data.session.user,
			role: userRole
		};
	},
	head: () => ({ meta: [
		{ title: "Admin Dashboard - News Timeline" },
		{
			name: "description",
			content: "Administrative control center and dashboard."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
function AdminPendingFallback() {
	const [takingLong, setTakingLong] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setTakingLong(true);
		}, 4e3);
		return () => clearTimeout(timer);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3 text-center max-w-sm",
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" }),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold text-slate-700",
					children: "Connecting to Admin Dashboard..."
				}),
				takingLong && /* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex flex-col items-center gap-2 animate-in fade-in duration-300",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Update was applied. Click below to load the new version."
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							if (typeof window !== "undefined") {
								if ("caches" in window) caches.keys().then((keys) => {
									keys.forEach((k) => caches.delete(k));
								}).catch(() => {});
								window.location.reload();
							}
						},
						className: "px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
						children: "Refresh Dashboard"
					})]
				})
			]
		})
	});
}
// src/routes/apply.tsx
var $$splitComponentImporter$47 = () => import("./apply-Uv4-8SOA.js");
var Route$55 = createFileRoute("/apply")({
	head: () => ({ meta: [{ title: "Application Form — News Theme" }] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
// src/routes/apply-journalist.tsx
var $$splitComponentImporter$46 = () => import("./apply-journalist-DvmR1sno.js");
var Route$54 = createFileRoute("/apply-journalist")({
	head: () => ({ meta: [{ title: "Apply as Journalist — News Theme" }, {
		name: "description",
		content: "Submit your official journalist verification application to join our press newsroom."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
// src/routes/archive.tsx
var $$splitComponentImporter$45 = () => import("./archive-BaIX31PR.js");
var Route$53 = createFileRoute("/archive")({
	validateSearch: (raw) => ({
		day: typeof raw.day === "string" ? raw.day : void 0,
		month: typeof raw.month === "string" ? raw.month : void 0,
		year: typeof raw.year === "string" ? raw.year : void 0,
		page: Number(raw.page) > 0 ? Number(raw.page) : 1
	}),
	loaderDeps: ({ search: { day, month, year, page } }) => ({
		day,
		month,
		year,
		page
	}),
	loader: async ({ deps }) => {
		try {
			return await getPublicArchiveArticles({ data: {
				year: deps.year,
				month: deps.month,
				day: deps.day,
				page: deps.page || 1,
				limit: 15
			} });
		} catch (err) {
			console.warn("[Archive loader] Error:", err);
			return {
				items: [],
				total: 0,
				totalPages: 1
			};
		}
	},
	head: () => ({ meta: [{ title: "Archive – News Theme" }, {
		name: "description",
		content: "Browse past stories by day, month or year."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
// src/routes/auth.tsx
var $$splitComponentImporter$44 = () => import("./auth-C3iFe4IU.js");
var Route$52 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in or create an account — News Theme" }, {
		name: "description",
		content: "Sign in to your News Theme account or create a new one."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
// src/routes/contact.tsx
var $$splitComponentImporter$43 = () => import("./contact-BIVMD1td.js");
var Route$51 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Us – News Theme" },
		{
			name: "description",
			content: "Get in touch with the News Theme newsroom. Send tips, feedback, partnership and advertising enquiries."
		},
		{
			property: "og:title",
			content: "Contact Us – News Theme"
		},
		{
			property: "og:description",
			content: "Reach the News Theme newsroom for tips, feedback and partnerships."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
// src/routes/cookie-policy.tsx
var $$splitComponentImporter$42 = () => import("./cookie-policy-Dn6mcd2G.js");
var Route$50 = createFileRoute("/cookie-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "cookie-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Cookie Policy",
		defaultDescription: "How News Theme uses cookies and similar technologies, and how to manage them.",
		slug: "/cookie-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
// src/routes/data-deletion-policy.tsx
var $$splitComponentImporter$41 = () => import("./data-deletion-policy-Pzi86C9v.js");
var Route$49 = createFileRoute("/data-deletion-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "data-deletion-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Data Deletion Policy",
		defaultDescription: "How to request deletion of your personal data from News Theme systems.",
		slug: "/data-deletion-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
// src/routes/disclaimer.tsx
var $$splitComponentImporter$40 = () => import("./disclaimer-B3_gDc0O.js");
var Route$48 = createFileRoute("/disclaimer")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "disclaimer");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Disclaimer",
		defaultDescription: "Editorial, financial and general disclaimers for content published by News Theme.",
		slug: "/disclaimer"
	}),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
// src/routes/dmca.tsx
var $$splitComponentImporter$39 = () => import("./dmca-y8Vacqtz.js");
var Route$47 = createFileRoute("/dmca")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "dmca");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "DMCA Notice & Policy",
		defaultDescription: "How to submit a DMCA copyright takedown notice to News Theme.",
		slug: "/dmca"
	}),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
// src/routes/earn-points.tsx
var $$splitComponentImporter$38 = () => import("./earn-points-Oe45Zqal.js");
var Route$46 = createFileRoute("/earn-points")({
	head: () => ({ meta: [
		{ title: "Earn Points – News Theme Wallet Rewards" },
		{
			name: "description",
			content: "Complete tasks and earn wallet points on News Theme. Follow us on social media, share news, and grow your rewards."
		},
		{
			property: "og:title",
			content: "Earn Points – News Theme"
		},
		{
			property: "og:description",
			content: "Complete tasks and earn wallet points on News Theme."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
// src/routes/editorial-policy.tsx
var $$splitComponentImporter$37 = () => import("./editorial-policy-1fY-yM9D.js");
var Route$45 = createFileRoute("/editorial-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "editorial-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Editorial Policy",
		defaultDescription: "Our standards for sourcing, verification, corrections and editorial independence.",
		slug: "/editorial-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
// src/routes/event.tsx
var $$splitComponentImporter$36 = () => import("./event-D14y52af.js");
var Route$44 = createFileRoute("/event")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) || defaultSettings };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.eventTitle || "শারদ সম্মান ২০২৬",
				metaTitle: s?.eventMetaTitle,
				metaDescription: s?.eventMetaDescription,
				ogImage: s?.eventOgImage,
				metaKeywords: s?.eventKeywords,
				canonicalUrl: s?.eventCanonicalUrl,
				noIndex: s?.eventNoIndex
			},
			defaultTitle: "শারদ সম্মান ২০২৬ — বিশেষ দুর্গোৎসব প্রতিযোগিতা",
			defaultDescription: "শারদ সম্মান ২০২৬ দুর্গোৎসব প্রতিযোগিতা। সেরা মণ্ডপসজ্জা, সেরা প্রতিমা ও সেরা আলোকসজ্জার সম্মাননা। আজই আপনার ক্লাবের নাম নিবন্ধন করুন।",
			slug: "/event"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
// src/routes/fact-check.tsx
var $$splitComponentImporter$35 = () => import("./fact-check-D65Ewk-t.js");
var Route$43 = createFileRoute("/fact-check")({
	head: () => ({ meta: [
		{ title: "Live News & Claim Fact-Check Scanner — News Theme" },
		{
			name: "description",
			content: "Scan any news article URL or viral headline to instantly verify authenticity against accredited global fact-checking registries and Google Fact Check."
		},
		{
			property: "og:title",
			content: "Live News Fact-Check Scanner — News Theme"
		},
		{
			property: "og:description",
			content: "Instantly check any news URL or claim against accredited international fact-checkers."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
// src/routes/fact-checking-policy.tsx
var $$splitComponentImporter$34 = () => import("./fact-checking-policy-DcStglXE.js");
var Route$42 = createFileRoute("/fact-checking-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "fact-checking-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Fact-Checking Policy — News Theme",
		defaultDescription: "Our editorial standards for fact-checking, multi-source verification, digital media analysis, and factual accuracy.",
		slug: "/fact-checking-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
// src/routes/forgot-password.tsx
var $$splitComponentImporter$33 = () => import("./forgot-password-DXNxWGGO.js");
var Route$41 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot password — News Theme" }, {
		name: "description",
		content: "Reset your News Theme account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
// src/routes/news-sitemap[.]xml.ts
var Route$40 = createFileRoute("/news-sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		let publicationName = "News Vanguard 24x7";
		let publicationLang = "en";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoNewsPublicationName) publicationName = parsed.seoNewsPublicationName;
				else if (parsed?.siteName) publicationName = parsed.siteName;
				if (parsed?.defaultLanguage) publicationLang = parsed.defaultLanguage.toLowerCase().slice(0, 2);
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT slug, title, category, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() AND date >= NOW() - INTERVAL 48 HOUR ORDER BY date DESC, id DESC LIMIT 100");
		} catch {}
		if (!articles || articles.length === 0) try {
			articles = await query("SELECT slug, title, category, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 25");
		} catch {}
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;
		if (Array.isArray(articles)) for (const a of articles) {
			if (!a.slug || !a.title) continue;
			const pubDate = a.date ? new Date(a.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
			const cleanTitle = escapeXml$3(a.title);
			const cleanKeywords = escapeXml$3(a.category || "News");
			xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml$3(publicationName)}</news:name>
        <news:language>${escapeXml$3(publicationLang)}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      <news:keywords>${cleanKeywords}</news:keywords>
    </news:news>
  </url>
`;
		}
		xml += `</urlset>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=600, s-maxage=600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$3(err.message || "Error generating news sitemap")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$3(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
// src/routes/privacy-policy.tsx
var $$splitComponentImporter$32 = () => import("./privacy-policy-CiSP4Hhd.js");
var Route$39 = createFileRoute("/privacy-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "privacy-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Privacy Policy",
		defaultDescription: "How News Theme collects, uses and protects your personal information.",
		slug: "/privacy-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
// src/routes/profile.tsx
var $$splitComponentImporter$31 = () => import("./profile-awnB10kk.js");
var Route$38 = createFileRoute("/profile")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Profile – News Theme" }, {
		name: "description",
		content: "Manage your account, password, bank details and subscription on News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
// src/routes/reels.tsx
var $$splitComponentImporter$30 = () => import("./reels-DDnHS4h0.js");
var Route$37 = createFileRoute("/reels")({
	validateSearch: (raw) => ({ page: Number(raw.page) > 0 ? Number(raw.page) : 1 }),
	head: () => ({ meta: [{ title: "Reels & Shorts — Vanguard News" }, {
		name: "description",
		content: "Explore trending news reels, shorts, and video stories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
// src/routes/refund-policy.tsx
var $$splitComponentImporter$29 = () => import("./refund-policy-CQB2xyA0.js");
var Route$36 = createFileRoute("/refund-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "refund-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Refund Policy",
		defaultDescription: "Refund eligibility, timelines and process for News Theme subscriptions.",
		slug: "/refund-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
// src/routes/reset-password.tsx
var $$splitComponentImporter$28 = () => import("./reset-password-Z1Ci7T5r.js");
var Route$35 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — News Theme" }, {
		name: "description",
		content: "Choose a new password for your News Theme account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
// src/routes/results.tsx
var $$splitComponentImporter$27 = () => import("./results-DRujjaHH.js");
var Route$34 = createFileRoute("/results")({
	head: () => ({ meta: [{ title: "ত্রিপুরা পরীক্ষা ফলাফল, মার্কশিট ও সার্টিফিকেট পোর্টাল — Today Tripura" }, {
		name: "description",
		content: "Tripura Board TBSE Madhyamik, Higher Secondary, Tripura University Degree Marksheet & Certificate Verification Portal."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
// src/routes/rss[.]xml.ts
var Route$33 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		let siteName = "News Vanguard 24x7";
		let siteDesc = "Breaking news, local updates, and market intelligence from News Vanguard 24x7.";
		let language = "en-US";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoNewsPublicationName) siteName = parsed.seoNewsPublicationName;
				else if (parsed?.siteName) siteName = parsed.siteName;
				if (parsed?.metaDescription) siteDesc = parsed.metaDescription;
				if (parsed?.defaultLanguage) language = parsed.defaultLanguage.toLowerCase() === "bn" ? "bn-IN" : "en-US";
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT * FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
		} catch {}
		const lastBuildDate = (/* @__PURE__ */ new Date()).toUTCString();
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml$2(siteName)}</title>
    <description>${escapeXml$2(siteDesc)}</description>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${escapeXml$2(language)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;
		if (Array.isArray(articles)) for (const a of articles) {
			const pubDate = a.date ? new Date(a.date).toUTCString() : lastBuildDate;
			const link = `${origin}/news/${a.slug}`;
			const cleanTitle = escapeXml$2(a.title || "");
			const cleanDesc = escapeXml$2(a.excerpt || a.title || "");
			const category = escapeXml$2(a.category || "News");
			xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
    </item>
`;
		}
		xml += `  </channel>
</rss>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=1800, s-maxage=1800"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$2(err.message || "Error generating RSS feed")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$2(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
// src/routes/search.tsx
var $$splitComponentImporter$26 = () => import("./search-DooLP1hC.js");
var Route$32 = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : "",
		category: typeof raw.category === "string" ? raw.category : "All",
		page: Number(raw.page) > 0 ? Number(raw.page) : 1,
		tab: raw.tab === "articles" || raw.tab === "categories" || raw.tab === "pages" ? raw.tab : "all"
	}),
	loaderDeps: ({ search: { q, category, page, tab } }) => ({
		q,
		category,
		page,
		tab
	}),
	loader: async ({ deps }) => {
		try {
			return await searchUnifiedPublic({ data: {
				q: deps.q || "",
				category: deps.category || "All",
				page: deps.page || 1,
				limit: 15,
				tab: deps.tab || "all"
			} });
		} catch (err) {
			console.warn("[Search loader] Error:", err);
			return {
				query: deps.q || "",
				selectedCategory: deps.category || "All",
				activeTab: deps.tab || "all",
				articles: {
					items: [],
					total: 0,
					totalPages: 1
				},
				categories: [],
				pages: [],
				allCategories: [],
				counts: {
					articles: 0,
					categories: 0,
					pages: 0,
					total: 0
				}
			};
		}
	},
	head: ({ loaderData }) => {
		const q = loaderData?.query;
		return { meta: [{ title: q ? `Results for "${q}" – News Archive & Search` : "Search Site – News Theme" }, {
			name: "description",
			content: "Search across published news stories, editorial categories, information desks, and policy pages."
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
// src/routes/setup.tsx
var $$splitErrorComponentImporter$1 = () => import("./setup-XYxNIAUX.js");
var $$splitComponentImporter$25 = () => import("./setup-BSz4IBuj.js");
var Route$31 = createFileRoute("/setup")({
	head: () => ({ meta: [{ title: "Setup Wizard – News Theme" }, {
		name: "description",
		content: "Configure your database and administrator account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
// src/routes/sitemap[.]xml.ts
var Route$30 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT slug, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 1000");
		} catch {}
		let categories = [];
		try {
			categories = await query("SELECT slug FROM categories");
		} catch {}
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Homepage -->
  <url>
    <loc>${origin}/</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;
		const staticPaths = [
			"/submit-news",
			"/contact",
			"/event",
			"/subscription",
			"/work-with-us",
			"/archive",
			...defaultPages.map((p) => `/${p.slug}`)
		];
		const uniquePaths = Array.from(new Set(staticPaths));
		for (const path of uniquePaths) xml += `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
		if (Array.isArray(categories)) for (const cat of categories) {
			if (!cat.slug) continue;
			xml += `  <url>
    <loc>${origin}/${cat.slug}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
		}
		if (Array.isArray(articles)) for (const a of articles) {
			if (!a.slug) continue;
			const lastmod = a.updated_at ? new Date(a.updated_at).toISOString() : a.date ? new Date(a.date).toISOString() : nowIso;
			xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
		}
		xml += `</urlset>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$1(err.message || "Error generating sitemap")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$1(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
// src/routes/submit-news.tsx
var $$splitComponentImporter$24 = () => import("./submit-news-BWbzQy2V.js");
var Route$29 = createFileRoute("/submit-news")({
	head: () => ({ meta: [
		{ title: "Submit News — News Theme" },
		{
			name: "description",
			content: "Submit verified news to News Theme. Share tips, photos, PDFs and location details for our editorial team to review."
		},
		{
			property: "og:title",
			content: "Submit News — News Theme"
		},
		{
			property: "og:description",
			content: "Send tips, photos and PDFs to our newsroom for cross-verification."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
// src/routes/subscription.tsx
var $$splitComponentImporter$23 = () => import("./subscription-Baso56Bx.js");
var Route$28 = createFileRoute("/subscription")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.subscriptionTitle || "Subscription",
				metaTitle: s?.subscriptionMetaTitle,
				metaDescription: s?.subscriptionMetaDescription,
				ogImage: s?.subscriptionOgImage,
				metaKeywords: s?.subscriptionKeywords,
				canonicalUrl: s?.subscriptionCanonicalUrl,
				noIndex: s?.subscriptionNoIndex
			},
			defaultTitle: "Subscription",
			defaultDescription: "Upgrade to Premium for ad-free reading, exclusive stories and early access. Monthly or yearly plans.",
			slug: "/subscription"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
// src/routes/terms-and-conditions.tsx
var $$splitComponentImporter$22 = () => import("./terms-and-conditions-DCnZl03t.js");
var Route$27 = createFileRoute("/terms-and-conditions")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "terms-and-conditions");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Terms & Conditions",
		defaultDescription: "The terms governing your use of News Theme's website, apps and services.",
		slug: "/terms-and-conditions"
	}),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
// src/routes/verified-journalist.tsx
var $$splitComponentImporter$21 = () => import("./verified-journalist-DVIYoHk-.js");
var Route$26 = createFileRoute("/verified-journalist")({
	validateSearch: (search) => ({ id: (typeof search.id === "string" ? search.id : typeof search.uid === "string" ? search.uid : "") || "" }),
	loaderDeps: ({ search }) => ({ id: search.id }),
	loader: async ({ deps }) => {
		const queryId = deps.id?.trim();
		if (!queryId || queryId.length < 3) return {
			queryId: "",
			initialResult: null
		};
		try {
			return {
				queryId,
				initialResult: await lookupJournalist({ data: { publicUserId: queryId } })
			};
		} catch {
			return {
				queryId,
				initialResult: { found: false }
			};
		}
	},
	head: ({ loaderData }) => {
		const res = loaderData?.initialResult;
		const name = res && res.found ? res.displayName : "";
		return { meta: [
			{ title: name ? `Verified Press: ${name} — News Theme` : "Verify a Journalist — News Theme" },
			{
				name: "description",
				content: name ? `Official press credential verification for accredited reporter ${name}.` : "Enter a Journalist ID or 10-digit User ID to verify an accredited News Theme reporter."
			},
			{
				property: "og:title",
				content: name ? `Verified Journalist: ${name}` : "Verify a Journalist — News Theme"
			},
			{
				property: "og:description",
				content: name ? `View official verified credentials and press ID card for ${name}.` : "Instantly check if a byline belongs to a verified News Theme reporter."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
// src/routes/verify-image.tsx
var $$splitComponentImporter$20 = () => import("./verify-image-CkFRWf6Z.js");
var Route$25 = createFileRoute("/verify-image")({
	head: () => ({ meta: [{ title: "Forensic Image Verification Scanner - News Theme" }, {
		name: "description",
		content: "Scan any image or screenshot to extract cryptographic EXIF signatures and forensic pixel steganography DNA."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
// src/routes/watch.tsx
var Route$24 = createFileRoute("/watch")({ beforeLoad: () => {
	throw redirect({ to: "/reels" });
} });
// src/routes/withdraw-points.tsx
var $$splitComponentImporter$19 = () => import("./withdraw-points-BW0U6mLM.js");
var Route$23 = createFileRoute("/withdraw-points")({
	head: () => ({ meta: [{ title: "Withdraw Points – News Theme Wallet" }, {
		name: "description",
		content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
// src/routes/work-with-us.tsx
var $$splitComponentImporter$18 = () => import("./work-with-us-Cr76_so1.js");
var Route$22 = createFileRoute("/work-with-us")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) || defaultSettings };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.workWithUsHeroTitle || "Work With Us",
				metaTitle: s?.workWithUsMetaTitle,
				metaDescription: s?.workWithUsMetaDescription,
				ogImage: s?.workWithUsOgImage,
				metaKeywords: s?.workWithUsKeywords,
				canonicalUrl: s?.workWithUsCanonicalUrl,
				noIndex: s?.workWithUsNoIndex
			},
			defaultTitle: "Work With Us",
			defaultDescription: "Apply as a volunteer journalist and grow into an Intern and Permanent role at News Theme.",
			slug: "/work-with-us"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
// src/routes/admin.index.tsx
var $$splitComponentImporter$17 = () => import("./admin.index-S87c-pVh.js");
var Route$21 = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
// src/routes/admin.advertisements.tsx
var $$splitComponentImporter$16 = () => import("./admin.advertisements-D-u3Rskf.js");
var Route$20 = createFileRoute("/admin/advertisements")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
// src/routes/admin.articles.tsx
var $$splitComponentImporter$15 = () => import("./admin.articles-BDsmvBNe.js");
var Route$19 = createFileRoute("/admin/articles")({
	head: () => ({ meta: [{ title: "Manage Articles - Admin Dashboard" }, {
		name: "description",
		content: "Create, edit, filter, and manage published and drafted articles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
// src/routes/admin.categories.tsx
var $$splitComponentImporter$14 = () => import("./admin.categories-hj2rB3Xo.js");
var Route$18 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
// src/routes/admin.comments.tsx
var $$splitComponentImporter$13 = () => import("./admin.comments-DxeInF3_.js");
var Route$17 = createFileRoute("/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
// src/routes/admin.files.tsx
var $$splitComponentImporter$12 = () => import("./admin.files-kcSpFFrE.js");
var Route$16 = createFileRoute("/admin/files")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
// src/routes/admin.homepage.tsx
var $$splitComponentImporter$11 = () => import("./admin.homepage-CIETHamL.js");
var Route$15 = createFileRoute("/admin/homepage")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
// src/routes/admin.inbox.tsx
var $$splitComponentImporter$10 = () => import("./admin.inbox-whP8F8m7.js");
var Route$14 = createFileRoute("/admin/inbox")({
	head: () => ({ meta: [{ title: "Admin Inbox - News Timeline" }, {
		name: "description",
		content: "Review contact messages, journalist applications, and user requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
// src/routes/admin.journalists.tsx
var $$splitComponentImporter$9 = () => import("./admin.journalists-BONMDrzs.js").then((n) => n.t);
var Route$13 = createFileRoute("/admin/journalists")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
// src/routes/admin.pages.tsx
var $$splitComponentImporter$8 = () => import("./admin.pages-BCr5PWwI.js");
var Route$12 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
// src/routes/admin.reels.tsx
var $$splitComponentImporter$7 = () => import("./admin.reels-BvXbnSSu.js");
var Route$11 = createFileRoute("/admin/reels")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
// src/routes/admin.rewards.tsx
var $$splitComponentImporter$6 = () => import("./admin.rewards-CXZFkA5m.js");
var Route$10 = createFileRoute("/admin/rewards")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
// src/routes/admin.roles.tsx
var $$splitComponentImporter$5 = () => import("./admin.roles-DAw0IQGO.js");
var Route$9 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
// src/routes/admin.settings.tsx
var $$splitComponentImporter$4 = () => import("./admin.settings-CMb4FNHd.js");
var Route$8 = createFileRoute("/admin/settings")({
	validateSearch: (search) => {
		return { tab: search.tab || "general" };
	},
	head: () => ({ meta: [{ title: "Site Settings - Admin Dashboard" }, {
		name: "description",
		content: "Manage site branding, SEO, analytics, and integrations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
// src/routes/admin.tags.tsx
var $$splitComponentImporter$3 = () => import("./admin.tags-DnGnXcF0.js");
var Route$7 = createFileRoute("/admin/tags")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
// src/routes/admin.updates.tsx
var $$splitComponentImporter$2 = () => import("./admin.updates-Cx_GTVCj.js");
var Route$6 = createFileRoute("/admin/updates")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
// src/routes/admin.users.tsx
var $$splitComponentImporter$1 = () => import("./admin.users-7yF31-4T.js");
var Route$5 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
// src/routes/api/rss.ts
var Route$4 = createFileRoute("/api/rss")({ server: { handlers: { GET: async () => {
	try {
		const articles = await query("SELECT * FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
		const origin = "https://northeasttimeline.com";
		let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News Theme</title>
    <description>Breaking news, market intelligence, and sharp business analysis from News Theme.</description>
    <link>${origin}</link>
    <atom:link href="${origin}/api/rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
`;
		for (const a of articles) {
			const pubDate = new Date(a.date).toUTCString();
			const link = `${origin}/article/${a.slug}`;
			const cleanTitle = escapeXml(a.title);
			const cleanDesc = escapeXml(a.excerpt || a.title);
			xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>
`;
		}
		xml += `  </channel>
</rss>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Failed to generate feed")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml" }
		});
	}
} } } });
function escapeXml(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
// src/routes/api/update.ts
var Route$3 = createFileRoute("/api/update")({ server: { handlers: {
	GET: async () => {
		try {
			const status = await executeGetGitStatusCore(true);
			return new Response(JSON.stringify(status), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to get git status",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	},
	POST: async () => {
		try {
			const pullResult = await executeGitPullCore();
			return new Response(JSON.stringify(pullResult), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to execute git pull and update",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	}
} } });
// src/routes/api/updates.ts
var Route$2 = createFileRoute("/api/updates")({ server: { handlers: {
	GET: async () => {
		try {
			const status = await executeGetGitStatusCore(true);
			return new Response(JSON.stringify(status), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to get git status",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	},
	POST: async () => {
		try {
			const pullResult = await executeGitPullCore();
			return new Response(JSON.stringify(pullResult), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to execute git pull and update",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	}
} } });
// src/lib/article-data.ts
function parseArticleDate(dateVal) {
	if (!dateVal) return /* @__PURE__ */ new Date();
	if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? /* @__PURE__ */ new Date() : dateVal;
	if (typeof dateVal === "string") {
		const trimmed = dateVal.trim();
		if (!trimmed || trimmed.startsWith("0000-00-00")) return /* @__PURE__ */ new Date();
		let d = new Date(trimmed);
		if (!isNaN(d.getTime())) return d;
		if (trimmed.includes(" ")) {
			d = new Date(trimmed.replace(" ", "T"));
			if (!isNaN(d.getTime())) return d;
		}
		if (trimmed.includes(" ") && !trimmed.endsWith("Z")) {
			d = /* @__PURE__ */ new Date(trimmed.replace(" ", "T") + "Z");
			if (!isNaN(d.getTime())) return d;
		}
	}
	if (typeof dateVal === "number") {
		const d = new Date(dateVal);
		if (!isNaN(d.getTime())) return d;
	}
	return /* @__PURE__ */ new Date();
}
async function getArticleData(slug) {
	try {
		const art = await getPublicArticleBySlug({ data: slug });
		if (!art) {
			const rawTitle = slug.replace(/-/g, " ");
			const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
			const paragraphs = [
				"Lottery-like options and speculative markets have captured the attention of a new generation of traders looking to navigate high inflation, rising home prices, and structural shifts in the job market. This shift has reshaped the landscape for retail investing.",
				"While financial regulators caution against the high volatility of short-dated derivatives and speculative instruments, market volumes continue to reach new records. Platforms have responded by tailoring interface designs to match mobile-first user behaviors.",
				"As retail trading continues to evolve, market experts advise focusing on core economic indicators and long-term asset building. Our weekly updates will continue tracking this ongoing story with insights from market analysts and local brokerage feeds."
			];
			const now = /* @__PURE__ */ new Date();
			return {
				slug,
				title: title || "Exclusive Market Report",
				category: "Markets",
				author: "Justina Lee",
				date: now.toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric"
				}),
				publishedISO: now.toISOString(),
				modifiedISO: now.toISOString(),
				hero: "/placeholder.svg",
				midImage: "/placeholder.svg",
				paragraphs,
				views: 184320,
				excerpt: `${title} — read the full report and coverage on News Theme.`,
				access_level: "Free"
			};
		}
		const published = parseArticleDate(art.date);
		const isoString = published.toISOString();
		let displayDate = "";
		try {
			displayDate = published.toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit"
			});
		} catch {
			displayDate = published.toDateString();
		}
		let paragraphs = [];
		if (art.content && typeof art.content === "string" && art.content.trim()) paragraphs = [art.content];
		else if (art.excerpt && typeof art.excerpt === "string" && art.excerpt.trim()) paragraphs = [art.excerpt];
		else paragraphs = [art.title || ""];
		let parsedTags = [];
		if (art.tags && typeof art.tags === "string") parsedTags = art.tags.split(",").map((t) => t.trim()).filter(Boolean);
		else if (Array.isArray(art.tags)) parsedTags = art.tags.map((t) => String(t).trim()).filter(Boolean);
		return {
			slug: art.slug,
			title: art.title || "",
			category: art.category || "News",
			author: art.author || "Newsroom",
			date: displayDate,
			publishedISO: isoString,
			modifiedISO: isoString,
			hero: art.featuredImage || "",
			midImage: art.featuredImage || "",
			imageCaption: art.imageCaption || "",
			imageCredit: art.imageCredit || "",
			paragraphs,
			views: Number(art.views) || 0,
			excerpt: art.excerpt || art.title || "",
			tags: parsedTags,
			access_level: art.access_level || "Free"
		};
	} catch (err) {
		console.error("[MySQL] Error loading article data:", err);
		return null;
	}
}
function articleQueryOptions(slug) {
	return queryOptions({
		queryKey: ["article", slug],
		queryFn: () => getArticleData(slug)
	});
}
// src/lib/origin.functions.ts
var getRequestOrigin = createServerFn({ method: "GET" }).handler(createSsrRpc("5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f"));
// src/routes/news.$slug.tsx
var $$splitComponentImporter = () => import("./news._slug-Wbk0x9G7.js");
var $$splitNotFoundComponentImporter = () => import("./news._slug-iKsmMb9H.js");
var $$splitErrorComponentImporter = () => import("./news._slug-lMFHsVaR.js");
var Route$1 = createFileRoute("/news/$slug")({
	loader: async ({ params, context }) => {
		try {
			const [data, origin, settings, trendingArticles] = await Promise.all([
				context.queryClient.ensureQueryData(articleQueryOptions(params.slug)).catch(() => null),
				getRequestOrigin().catch(() => ""),
				getSiteSettingsServer().catch(() => null),
				getHomepageArticles({ data: 8 }).catch(() => [])
			]);
			return {
				data,
				origin,
				siteName: settings?.siteName || "Today Tripura",
				trendingArticles: Array.isArray(trendingArticles) ? trendingArticles : []
			};
		} catch (err) {
			console.warn("[Article loader] Error:", err);
			return {
				data: null,
				origin: "",
				siteName: "Today Tripura",
				trendingArticles: []
			};
		}
	},
	head: ({ loaderData }) => {
		const siteName = loaderData?.siteName || "Today Tripura";
		if (!loaderData || !loaderData.data) return { meta: [{ title: `Article Not Found – ${siteName}` }, {
			name: "robots",
			content: "noindex"
		}] };
		const { data, origin } = loaderData;
		const absImg = (data.hero || "").startsWith("http") ? data.hero : `${origin}${data.hero || ""}`;
		const url = `${origin}/news/${data.slug}`;
		return {
			meta: [
				{ title: `${data.title} – ${siteName}` },
				{
					name: "description",
					content: data.excerpt
				},
				{
					name: "robots",
					content: "index,follow"
				},
				{
					name: "author",
					content: data.author
				},
				{
					property: "og:title",
					content: data.title
				},
				{
					property: "og:description",
					content: data.excerpt
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: url
				},
				{
					property: "og:image",
					content: absImg
				},
				{
					property: "og:image:width",
					content: "1200"
				},
				{
					property: "og:image:height",
					content: "630"
				},
				{
					property: "og:site_name",
					content: siteName
				},
				{
					property: "article:published_time",
					content: data.publishedISO
				},
				{
					property: "article:modified_time",
					content: data.modifiedISO
				},
				{
					property: "article:author",
					content: data.author
				},
				{
					property: "article:section",
					content: data.category
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: data.title
				},
				{
					name: "twitter:description",
					content: data.excerpt
				},
				{
					name: "twitter:image",
					content: absImg
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}, ...data.hero && typeof data.hero === "string" && data.hero.trim() ? [{
				rel: "preload",
				as: "image",
				href: absImg,
				fetchPriority: "high"
			}] : []],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "NewsArticle",
					headline: data.title,
					image: [absImg],
					datePublished: data.publishedISO,
					dateModified: data.modifiedISO,
					author: [{
						"@type": "Person",
						name: data.author
					}],
					publisher: {
						"@type": "Organization",
						name: siteName,
						logo: {
							"@type": "ImageObject",
							url: `${origin}/favicon.ico`
						}
					},
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": url
					},
					description: data.excerpt,
					articleSection: data.category,
					inLanguage: "en",
					keywords: data.category,
					isAccessibleForFree: data.access_level !== "Premium",
					publishingPrinciples: `${origin}/editorial-policy`,
					speakable: {
						"@type": "SpeakableSpecification",
						cssSelector: [
							".article-headline",
							".article-deck",
							".article-takeaways",
							".article-paragraphs > p:first-of-type"
						]
					}
				})
			}, {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: origin
						},
						{
							"@type": "ListItem",
							position: 2,
							name: data.category,
							item: `${origin}/category/${encodeURIComponent(data.category)}`
						},
						{
							"@type": "ListItem",
							position: 3,
							name: data.title,
							item: url
						}
					]
				})
			}]
		};
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
// src/routes/api/public/seed-demo-admin.ts
var Route = createFileRoute("/api/public/seed-demo-admin")({ server: { handlers: { POST: async () => {
	try {
		const email = "admin@demo.com";
		const passHash = hashPassword("Demo@Admin#2026NE");
		const name = "Demo Admin";
		let users = await query("SELECT id FROM users WHERE email = ?", [email]);
		let userId = "";
		if (users.length === 0) {
			userId = crypto.randomUUID();
			await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [
				userId,
				email,
				passHash,
				name
			]);
		} else {
			userId = users[0].id;
			await query("UPDATE users SET password_hash = ?, salt = NULL WHERE id = ?", [passHash, userId]);
		}
		await query("INSERT IGNORE INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
			crypto.randomUUID(),
			userId,
			"admin"
		]);
		if ((await query("SELECT id FROM profiles WHERE id = ?", [userId])).length === 0) await query("INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)", [
			userId,
			"1000000000",
			name,
			email,
			true
		]);
		return new Response(JSON.stringify({
			ok: true,
			user_id: userId
		}), { headers: { "content-type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
// src/routeTree.gen.ts
var IndexRoute = Route$59.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$60
});
var SlugRoute = Route$58.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => Route$60
});
var AboutRoute = Route$57.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$60
});
var AdminRoute = Route$56.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$60
});
var ApplyRoute = Route$55.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$60
});
var ApplyJournalistRoute = Route$54.update({
	id: "/apply-journalist",
	path: "/apply-journalist",
	getParentRoute: () => Route$60
});
var ArchiveRoute = Route$53.update({
	id: "/archive",
	path: "/archive",
	getParentRoute: () => Route$60
});
var AuthRoute = Route$52.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$60
});
var ContactRoute = Route$51.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$60
});
var CookiePolicyRoute = Route$50.update({
	id: "/cookie-policy",
	path: "/cookie-policy",
	getParentRoute: () => Route$60
});
var DataDeletionPolicyRoute = Route$49.update({
	id: "/data-deletion-policy",
	path: "/data-deletion-policy",
	getParentRoute: () => Route$60
});
var DisclaimerRoute = Route$48.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$60
});
var DmcaRoute = Route$47.update({
	id: "/dmca",
	path: "/dmca",
	getParentRoute: () => Route$60
});
var EarnPointsRoute = Route$46.update({
	id: "/earn-points",
	path: "/earn-points",
	getParentRoute: () => Route$60
});
var EditorialPolicyRoute = Route$45.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$60
});
var EventRoute = Route$44.update({
	id: "/event",
	path: "/event",
	getParentRoute: () => Route$60
});
var FactCheckRoute = Route$43.update({
	id: "/fact-check",
	path: "/fact-check",
	getParentRoute: () => Route$60
});
var FactCheckingPolicyRoute = Route$42.update({
	id: "/fact-checking-policy",
	path: "/fact-checking-policy",
	getParentRoute: () => Route$60
});
var ForgotPasswordRoute = Route$41.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$60
});
var NewsSitemapDotxmlRoute = Route$40.update({
	id: "/news-sitemap.xml",
	path: "/news-sitemap.xml",
	getParentRoute: () => Route$60
});
var PrivacyPolicyRoute = Route$39.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$60
});
var ProfileRoute = Route$38.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$60
});
var ReelsRoute = Route$37.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => Route$60
});
var RefundPolicyRoute = Route$36.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$60
});
var ResetPasswordRoute = Route$35.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$60
});
var ResultsRoute = Route$34.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => Route$60
});
var RssDotxmlRoute = Route$33.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$60
});
var SearchRoute = Route$32.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$60
});
var SetupRoute = Route$31.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => Route$60
});
var SitemapDotxmlRoute = Route$30.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$60
});
var SubmitNewsRoute = Route$29.update({
	id: "/submit-news",
	path: "/submit-news",
	getParentRoute: () => Route$60
});
var SubscriptionRoute = Route$28.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => Route$60
});
var TermsAndConditionsRoute = Route$27.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$60
});
var VerifiedJournalistRoute = Route$26.update({
	id: "/verified-journalist",
	path: "/verified-journalist",
	getParentRoute: () => Route$60
});
var VerifyImageRoute = Route$25.update({
	id: "/verify-image",
	path: "/verify-image",
	getParentRoute: () => Route$60
});
var WatchRoute = Route$24.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$60
});
var WithdrawPointsRoute = Route$23.update({
	id: "/withdraw-points",
	path: "/withdraw-points",
	getParentRoute: () => Route$60
});
var WorkWithUsRoute = Route$22.update({
	id: "/work-with-us",
	path: "/work-with-us",
	getParentRoute: () => Route$60
});
var AdminIndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAdvertisementsRoute = Route$20.update({
	id: "/advertisements",
	path: "/advertisements",
	getParentRoute: () => AdminRoute
});
var AdminArticlesRoute = Route$19.update({
	id: "/articles",
	path: "/articles",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$18.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCommentsRoute = Route$17.update({
	id: "/comments",
	path: "/comments",
	getParentRoute: () => AdminRoute
});
var AdminFilesRoute = Route$16.update({
	id: "/files",
	path: "/files",
	getParentRoute: () => AdminRoute
});
var AdminHomepageRoute = Route$15.update({
	id: "/homepage",
	path: "/homepage",
	getParentRoute: () => AdminRoute
});
var AdminInboxRoute = Route$14.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => AdminRoute
});
var AdminJournalistsRoute = Route$13.update({
	id: "/journalists",
	path: "/journalists",
	getParentRoute: () => AdminRoute
});
var AdminPagesRoute = Route$12.update({
	id: "/pages",
	path: "/pages",
	getParentRoute: () => AdminRoute
});
var AdminReelsRoute = Route$11.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => AdminRoute
});
var AdminRewardsRoute = Route$10.update({
	id: "/rewards",
	path: "/rewards",
	getParentRoute: () => AdminRoute
});
var AdminRolesRoute = Route$9.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminTagsRoute = Route$7.update({
	id: "/tags",
	path: "/tags",
	getParentRoute: () => AdminRoute
});
var AdminUpdatesRoute = Route$6.update({
	id: "/updates",
	path: "/updates",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$5.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var ApiRssRoute = Route$4.update({
	id: "/api/rss",
	path: "/api/rss",
	getParentRoute: () => Route$60
});
var ApiUpdateRoute = Route$3.update({
	id: "/api/update",
	path: "/api/update",
	getParentRoute: () => Route$60
});
var ApiUpdatesRoute = Route$2.update({
	id: "/api/updates",
	path: "/api/updates",
	getParentRoute: () => Route$60
});
var NewsSlugRoute = Route$1.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$60
});
var ApiPublicSeedDemoAdminRoute = Route.update({
	id: "/api/public/seed-demo-admin",
	path: "/api/public/seed-demo-admin",
	getParentRoute: () => Route$60
});
var AdminRouteChildren = {
	AdminAdvertisementsRoute,
	AdminArticlesRoute,
	AdminCategoriesRoute,
	AdminCommentsRoute,
	AdminFilesRoute,
	AdminHomepageRoute,
	AdminInboxRoute,
	AdminJournalistsRoute,
	AdminPagesRoute,
	AdminReelsRoute,
	AdminRewardsRoute,
	AdminRolesRoute,
	AdminSettingsRoute,
	AdminTagsRoute,
	AdminUpdatesRoute,
	AdminUsersRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	SlugRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ApplyRoute,
	ApplyJournalistRoute,
	ArchiveRoute,
	AuthRoute,
	ContactRoute,
	CookiePolicyRoute,
	DataDeletionPolicyRoute,
	DisclaimerRoute,
	DmcaRoute,
	EarnPointsRoute,
	EditorialPolicyRoute,
	EventRoute,
	FactCheckRoute,
	FactCheckingPolicyRoute,
	ForgotPasswordRoute,
	NewsSitemapDotxmlRoute,
	PrivacyPolicyRoute,
	ProfileRoute,
	ReelsRoute,
	RefundPolicyRoute,
	ResetPasswordRoute,
	ResultsRoute,
	RssDotxmlRoute,
	SearchRoute,
	SetupRoute,
	SitemapDotxmlRoute,
	SubmitNewsRoute,
	SubscriptionRoute,
	TermsAndConditionsRoute,
	VerifiedJournalistRoute,
	VerifyImageRoute,
	WatchRoute,
	WithdrawPointsRoute,
	WorkWithUsRoute,
	ApiRssRoute,
	ApiUpdateRoute,
	ApiUpdatesRoute,
	NewsSlugRoute,
	ApiPublicSeedDemoAdminRoute
};
var routeTree = Route$60._addFileChildren(rootRouteChildren)._addFileTypes();
// src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 6e4,
		gcTime: 6e5,
		refetchOnWindowFocus: false
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: false,
		defaultPreloadDelay: 200,
		defaultPreloadStaleTime: 6e4
	});
};
export { getRedirectRulesServer as $, defaultAdSlidesHome2 as A, loadAds as B, Route$57 as C, testDatabaseConnection as D, executeSetup as E, deleteAdStaticFilesServer as F, restoreFromTrash as G, loadTrash as H, injectReelAds as I, saveAdSlotScript as J, saveAdRotation as K, loadAdRotation as L, defaultAdSlidesPopup as M, defaultAdSlidesPostAds as N, defaultAdSlides as O, defaultPopupConfig as P, fixBrokenLinkServer as Q, loadAdSlotMode as R, isEditorAllowedRoute as S, Route$59 as T, processExpiredAds as U, loadPopupConfig as V, purgeFromTrash as W, savePopupConfig as X, saveAds as Y, trashAds as Z, Route$49 as _, Route$21 as a, Route$56 as b, Route$27 as c, Route$37 as d, saveRedirectRulesServer as et, Route$39 as f, Route$48 as g, getRouter, Route$47 as h, Route$8 as i, defaultAdSlidesLeaderboard as j, defaultAdSlidesAd3 as k, Route$32 as l, Route$45 as m, Route$1 as n, Route$22 as o, Route$42 as p, saveAdSlotMode as q, articleQueryOptions as r, Route$26 as s, router_exports as t, scanBrokenLinksServer as tt, Route$36 as u, Route$50 as v, Route$58 as w, ADMIN_NAV_ITEMS as x, Route$53 as y, loadAdSlotScript as z };

//# sourceMappingURL=router-DOvYxK-P.js.map