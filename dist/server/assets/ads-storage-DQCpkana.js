import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { i as setCached, n as clearCache, r as getCached } from "./server-cache-YpZMGkZx.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import { z } from "zod";
//#region src/lib/site-content/ads-storage.ts?tss-serverfn-split
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
/**
* Robust localStorage.setItem wrapper that intercepts QuotaExceededError,
* frees up stale/heavy cached items, and ensures site code never crashes.
*/
var deleteAdStaticFilesServer_createServerFn_handler = createServerRpc({
	id: "a76ed6fe6d9e768c9b491e3918e54e2f3edbe342884378d0c60678bcca5b54fe",
	name: "deleteAdStaticFilesServer",
	filename: "src/lib/site-content/ads-storage.ts"
}, (opts) => deleteAdStaticFilesServer.__executeServer(opts));
var deleteAdStaticFilesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((urls) => z.array(z.string()).parse(urls)).handler(deleteAdStaticFilesServer_createServerFn_handler, async ({ data: urls }) => {
	const fs = await import("node:fs");
	const path = await import("node:path");
	const cwd = process.cwd();
	let deletedCount = 0;
	for (const url of urls) {
		if (!url || typeof url !== "string" || !(url.startsWith("/uploads/ads/") || url.startsWith("/uploads/promos/"))) continue;
		const filename = url.replace("/uploads/ads/", "").replace("/uploads/promos/", "");
		if (filename.includes("/") || filename.includes("..")) continue;
		const targetDirs = [
			path.join(cwd, "public", "uploads", "promos"),
			path.join(cwd, "dist", "client", "uploads", "promos"),
			path.join(cwd, "uploads", "promos"),
			path.join(cwd, "public", "uploads", "ads"),
			path.join(cwd, "dist", "client", "uploads", "ads"),
			path.join(cwd, "uploads", "ads")
		];
		for (const dir of targetDirs) {
			const filePath = path.join(dir, filename);
			try {
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
					deletedCount++;
				}
			} catch (e) {
				console.error("[AdStorage] Failed to delete static ad file:", filePath, e);
			}
		}
	}
	return {
		success: true,
		deletedCount
	};
});
var getAdConfigurationServer_createServerFn_handler = createServerRpc({
	id: "e10c1724b54a5d0e4ddc7f147e00f08845b00a2e41a59862625f5831cfba8629",
	name: "getAdConfigurationServer",
	filename: "src/lib/site-content/ads-storage.ts"
}, (opts) => getAdConfigurationServer.__executeServer(opts));
var getAdConfigurationServer = createServerFn({ method: "GET" }).handler(getAdConfigurationServer_createServerFn_handler, async () => {
	const cacheKey = "ad_configuration_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'");
		if (rows.length > 0 && rows[0].value) {
			let parsed = JSON.parse(rows[0].value);
			if (parsed?.slots) {
				parsed.slots.reel_ads = parsed.slots.reel_ads || [];
				parsed.slots.hero_showcase = parsed.slots.hero_showcase || [];
			}
			if (parsed?.modes) parsed.modes.reel_ads = parsed.modes.reel_ads || "image";
			if (parsed?.rotations) parsed.rotations.reel_ads = parsed.rotations.reel_ads || 5;
			if (parsed?.scripts) parsed.scripts.reel_ads = parsed.scripts.reel_ads || "";
			try {
				const { persistAllAdConfiguration } = await import("./ad-storage.server-B8sKpu9k.js");
				const { config: cleanConfig, changed } = persistAllAdConfiguration(parsed);
				if (changed) {
					parsed = cleanConfig;
					query(`UPDATE site_settings SET value = ? WHERE setting_key = 'ad_configuration_data'`, [JSON.stringify(cleanConfig)]).catch((err) => console.error("[AdStorage] Background MySQL update error:", err));
				}
			} catch (storageErr) {
				console.error("[AdStorage] Auto-migration error:", storageErr);
			}
			setCached(cacheKey, parsed);
			return parsed;
		}
	} catch {}
	return {
		slots: {
			home1: defaultAdSlides,
			home2: defaultAdSlidesHome2,
			ad3: defaultAdSlidesAd3,
			popup: defaultAdSlidesPopup,
			leaderboard: defaultAdSlidesLeaderboard,
			hero_showcase: defaultAdSlidesHome2,
			reel_ads: []
		},
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
		},
		popupConfig: defaultPopupConfig
	};
});
var saveAdConfigurationServer_createServerFn_handler = createServerRpc({
	id: "867751394f3b0a32d0e5596bca686f87633494837852fe31aadabda10cc1fb52",
	name: "saveAdConfigurationServer",
	filename: "src/lib/site-content/ads-storage.ts"
}, (opts) => saveAdConfigurationServer.__executeServer(opts));
var saveAdConfigurationServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((config) => z.object({
	slots: z.record(z.any()),
	modes: z.record(z.any()),
	scripts: z.record(z.any()),
	rotations: z.record(z.any()),
	popupConfig: z.record(z.any()).optional()
}).parse(config)).handler(saveAdConfigurationServer_createServerFn_handler, async ({ data }) => {
	let cleanData = data;
	try {
		const { persistAllAdConfiguration } = await import("./ad-storage.server-B8sKpu9k.js");
		const { config: cleanConfig } = persistAllAdConfiguration(data);
		cleanData = cleanConfig;
	} catch (storageErr) {
		console.error("[AdStorage] Save persistence error:", storageErr);
	}
	const json = JSON.stringify(cleanData);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('ad_configuration_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("ad_configuration_data");
	return { success: true };
});
//#endregion
export { deleteAdStaticFilesServer_createServerFn_handler, getAdConfigurationServer_createServerFn_handler, saveAdConfigurationServer_createServerFn_handler };
