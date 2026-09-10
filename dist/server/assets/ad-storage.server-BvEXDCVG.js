import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/lib/ad-storage.server.ts
var MIME_TO_EXT = {
	"image/webp": ".webp",
	"image/jpeg": ".jpg",
	"image/jpg": ".jpg",
	"image/png": ".png",
	"image/gif": ".gif",
	"image/svg+xml": ".svg",
	"image/avif": ".avif"
};
/**
* Ensures a directory exists, creating nested directories if necessary.
*/
function ensureDir(dirPath) {
	try {
		if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
	} catch (err) {
		console.error(`[AdStorage] Failed to create directory ${dirPath}:`, err);
	}
}
/**
* Decodes a base64 data URL and writes it to disk as a static image file.
* Returns the public web URL path (e.g. "/uploads/ads/home1_ad-1_abc123.webp").
* If the input is already a URL or not base64, returns it unchanged.
*/
function persistBase64Image(dataUrl, prefix = "ad") {
	if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) return dataUrl;
	const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
	if (!match) return dataUrl;
	const mimeType = match[1].toLowerCase();
	const base64Data = match[2];
	const ext = MIME_TO_EXT[mimeType] || ".webp";
	const hash = crypto.createHash("md5").update(base64Data).digest("hex").slice(0, 12);
	const filename = `${prefix.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30)}_${hash}${ext}`;
	const buffer = Buffer.from(base64Data, "base64");
	const cwd = process.cwd();
	const targetDirs = [
		path.join(cwd, "public", "uploads", "ads"),
		path.join(cwd, "dist", "client", "uploads", "ads"),
		path.join(cwd, "uploads", "ads")
	];
	for (const dir of targetDirs) try {
		ensureDir(dir);
		const filePath = path.join(dir, filename);
		if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, buffer);
	} catch (err) {
		console.error(`[AdStorage] Error writing ${filename} to ${dir}:`, err);
	}
	return `/uploads/ads/${filename}`;
}
/**
* Iterates through ad items in a slot, converting any base64 images into static file URLs.
*/
function persistSlotAds(ads, slotName) {
	if (!Array.isArray(ads) || ads.length === 0) return {
		ads: ads || [],
		changed: false
	};
	let changed = false;
	return {
		ads: ads.map((ad, idx) => {
			let adChanged = false;
			const cleanAd = { ...ad };
			const id = cleanAd.id || `ad-${idx}`;
			if (cleanAd.image && cleanAd.image.startsWith("data:image/")) {
				cleanAd.image = persistBase64Image(cleanAd.image, `${slotName}_${id}_main`);
				adChanged = true;
			}
			if (cleanAd.imagePortrait && cleanAd.imagePortrait.startsWith("data:image/")) {
				cleanAd.imagePortrait = persistBase64Image(cleanAd.imagePortrait, `${slotName}_${id}_portrait`);
				adChanged = true;
			}
			if (cleanAd.imageLandscape && cleanAd.imageLandscape.startsWith("data:image/")) {
				cleanAd.imageLandscape = persistBase64Image(cleanAd.imageLandscape, `${slotName}_${id}_landscape`);
				adChanged = true;
			}
			if (adChanged) changed = true;
			return cleanAd;
		}),
		changed
	};
}
/**
* Scans the entire AdConfiguration object across all slots and persists any base64 images.
*/
function persistAllAdConfiguration(config) {
	if (!config || !config.slots) return {
		config,
		changed: false
	};
	let overallChanged = false;
	const newSlots = { ...config.slots };
	for (const slotKey of Object.keys(newSlots)) {
		const { ads, changed } = persistSlotAds(newSlots[slotKey], slotKey);
		if (changed) {
			newSlots[slotKey] = ads;
			overallChanged = true;
		}
	}
	return {
		config: {
			...config,
			slots: newSlots
		},
		changed: overallChanged
	};
}
//#endregion
export { persistAllAdConfiguration };
