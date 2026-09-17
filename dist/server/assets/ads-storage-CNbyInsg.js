import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-CbCBE447.js";
import { t as requireAdmin } from "./auth-middleware-CzbwKkqR.js";
import { z } from "zod";
//#region src/lib/site-content/ads-storage.ts
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
var SLOT_MODE_KEY = "nt:ad-slot-mode";
var SLOT_SCRIPT_KEY = "nt:ad-slot-script";
var DEFAULT_SLOT_MODE = {
	home1: "image",
	home2: "image",
	ad3: "image",
	popup: "image",
	leaderboard: "image",
	hero_showcase: "image",
	reel_ads: "image"
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
	reel_ads: "nt:ads:v2:reel_ads"
};
var TRASH_KEY = "nt:site-ads-trash";
var TRASH_TTL_MS = 720 * 60 * 60 * 1e3;
var ROTATION_KEY = "nt:site-ads-rotation";
var DEFAULT_ROTATION = {
	home1: 5,
	home2: 5,
	ad3: 5,
	popup: 6,
	leaderboard: 5,
	hero_showcase: 5,
	reel_ads: 5
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
	reel_ads: []
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
			reel_ads: loadAds("reel_ads")
		},
		modes: {
			home1: loadAdSlotMode("home1"),
			home2: loadAdSlotMode("home2"),
			ad3: loadAdSlotMode("ad3"),
			popup: loadAdSlotMode("popup"),
			leaderboard: loadAdSlotMode("leaderboard"),
			hero_showcase: loadAdSlotMode("hero_showcase"),
			reel_ads: loadAdSlotMode("reel_ads")
		},
		scripts: {
			home1: loadAdSlotScript("home1"),
			home2: loadAdSlotScript("home2"),
			ad3: loadAdSlotScript("ad3"),
			popup: loadAdSlotScript("popup"),
			leaderboard: loadAdSlotScript("leaderboard"),
			hero_showcase: loadAdSlotScript("hero_showcase"),
			reel_ads: loadAdSlotScript("reel_ads")
		},
		rotations: {
			home1: loadAdRotation("home1"),
			home2: loadAdRotation("home2"),
			ad3: loadAdRotation("ad3"),
			popup: loadAdRotation("popup"),
			leaderboard: loadAdRotation("leaderboard"),
			hero_showcase: loadAdRotation("hero_showcase"),
			reel_ads: loadAdRotation("reel_ads")
		},
		popupConfig: loadPopupConfig()
	} }).catch(() => {});
}
//#endregion
export { saveAds as _, loadAdRotation as a, loadAds as c, processExpiredAds as d, purgeFromTrash as f, saveAdSlotScript as g, saveAdSlotMode as h, injectReelAds as i, loadPopupConfig as l, saveAdRotation as m, deleteAdStaticFilesServer as n, loadAdSlotMode as o, restoreFromTrash as p, getAdConfigurationServer as r, loadAdSlotScript as s, defaultPopupConfig as t, loadTrash as u, savePopupConfig as v, trashAds as y };

//# sourceMappingURL=ads-storage-CNbyInsg.js.map