import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-CZlnVnEd.js";
import { t as protectCanvasAndExport } from "./image-protection-BvTFVLZp.js";
//#region src/lib/media.functions.ts
var uploadMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2d84dc33d0d55e73323d721355f17c3b57fbabc53b5cbd8b1444ceaea4227d14"));
var getMediaListServer = createServerFn({ method: "GET" }).handler(createSsrRpc("5171cfe7a5eb72c85b80892422db2c978d7f6ca631e43682141b0447064c407b"));
var updateMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e30b47418872d7ca1fb2d3af3e86d8b52c3f8a1c070269d6763789d0886ee8f4"));
var replaceMediaFileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6329335e43e59c703022ecded4636f3342709f33f8890f22cc106cb8e99ae796"));
var batchUpdateAltTextServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7df5206812c5eb96c69bf01f4466216c73e5df24362927076561735849872a91"));
var deleteMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("494a2753d65953536e1f3934b3921e0f62393deb0838cc47539f0ea3de769dbd"));
var deleteMultipleMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("81db0087bd1cbae6f062c40d636a90261aeee5fe44b493c6eaaa70ed8f0a148e"));
//#endregion
//#region src/lib/media-library.ts
/**
* Automatically cleans and formats a raw file name into a human-friendly Alt Text for SEO
* e.g., "rahul_gandhi-speech (1).webp" -> "Rahul Gandhi Speech"
*/
function deriveAltText(filename) {
	if (!filename) return "";
	let name = filename.replace(/\.[a-zA-Z0-9]+$/, "");
	name = name.replace(/[\(\[\{]\d+[\)\]\}]/g, " ");
	name = name.replace(/[_\-\.\+]/g, " ");
	name = name.replace(/\s+/g, " ").trim();
	if (!name) return filename;
	return name.split(" ").map((w) => {
		if (w.length <= 3 && w.toUpperCase() === w) return w;
		return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
	}).join(" ");
}
var memoryCache = [];
if (typeof window !== "undefined") getMediaListServer().then((data) => {
	if (data) {
		memoryCache = data;
		window.dispatchEvent(new Event("media-library-change"));
	}
}).catch((err) => console.error("Failed to load media library from server:", err));
function notifyChange() {
	window.dispatchEvent(new Event("media-library-change"));
}
var mediaLibrary = {
	list() {
		return memoryCache.sort((a, b) => b.createdAt - a.createdAt);
	},
	async add(item) {
		const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		const effectiveAltText = item.altText || deriveAltText(item.name);
		const res = await uploadMediaServer({ data: {
			id,
			name: item.name,
			type: item.type,
			size: item.size,
			dataUrl: item.dataUrl,
			usage: item.usage,
			altText: effectiveAltText,
			description: item.description
		} });
		const full = {
			...item,
			id,
			altText: effectiveAltText,
			dataUrl: res.url,
			createdAt: Date.now()
		};
		memoryCache = [full, ...memoryCache];
		notifyChange();
		return full;
	},
	get(id) {
		return memoryCache.find((m) => m.id === id);
	},
	async update(id, patch) {
		memoryCache = memoryCache.map((m) => m.id === id ? {
			...m,
			...patch
		} : m);
		notifyChange();
		await updateMediaServer({ data: {
			id,
			...patch
		} });
	},
	async replace(id, file, customName, customAltText) {
		const dataUrl = await fileToDataUrl(file);
		const size = Math.round(dataUrl.length * .75);
		const type = file.type.startsWith("image/") ? "image/webp" : file.type || "application/octet-stream";
		const existing = this.get(id);
		const effectiveName = customName || (existing ? existing.name : file.name);
		const effectiveAltText = customAltText || (existing?.altText ? existing.altText : deriveAltText(effectiveName));
		const res = await replaceMediaFileServer({ data: {
			id,
			dataUrl,
			size,
			type,
			name: effectiveName,
			altText: effectiveAltText
		} });
		const updated = {
			...existing || {
				id,
				usage: "other",
				createdAt: Date.now()
			},
			name: effectiveName,
			altText: effectiveAltText,
			dataUrl: res.url,
			size,
			type
		};
		memoryCache = memoryCache.map((m) => m.id === id ? updated : m);
		notifyChange();
		return updated;
	},
	async autoFillMissingAltTexts() {
		const missing = memoryCache.filter((m) => !m.altText || m.altText.trim() === "");
		if (!missing.length) return 0;
		const updates = missing.map((m) => ({
			id: m.id,
			altText: deriveAltText(m.name)
		}));
		memoryCache = memoryCache.map((m) => {
			const u = updates.find((x) => x.id === m.id);
			return u ? {
				...m,
				altText: u.altText
			} : m;
		});
		notifyChange();
		await batchUpdateAltTextServer({ data: { items: updates } });
		return updates.length;
	},
	async remove(id) {
		memoryCache = memoryCache.filter((m) => m.id !== id);
		notifyChange();
		await deleteMediaServer({ data: { id } });
	},
	async removeMultiple(ids) {
		if (!ids || ids.length === 0) return;
		const set = new Set(ids);
		memoryCache = memoryCache.filter((m) => !set.has(m.id));
		notifyChange();
		await deleteMultipleMediaServer({ data: { ids } });
	},
	clear() {
		memoryCache = [];
		notifyChange();
	}
};
/**
* Retrieves current site settings for image protection branding
*/
function getProtectionConfig() {
	let domain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";
	let siteName = "Today Tripura";
	let socials = {};
	if (typeof window !== "undefined") try {
		const raw = localStorage.getItem("nt:site-settings");
		if (raw) {
			const s = JSON.parse(raw);
			if (s.siteName) siteName = s.siteName;
			if (s.facebook) socials.facebook = s.facebook;
			if (s.twitter) socials.twitter = s.twitter;
			if (s.instagram) socials.instagram = s.instagram;
			if (s.youtube) socials.youtube = s.youtube;
			if (s.telegram) socials.telegram = s.telegram;
		}
	} catch {}
	return {
		domain,
		siteName,
		socials
	};
}
function fileToDataUrl(file, watermarkData, maxDimension = 1920, quality = .82) {
	if (typeof window === "undefined" || typeof document === "undefined" || !file.type.startsWith("image/") || file.type === "image/svg+xml") return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(file);
	});
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const rawDataUrl = String(e.target?.result || "");
			const img = new Image();
			img.onload = () => {
				let { width, height } = img;
				if (width > maxDimension || height > maxDimension) if (width > height) {
					height = Math.round(height * maxDimension / width);
					width = maxDimension;
				} else {
					width = Math.round(width * maxDimension / height);
					height = maxDimension;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d", { willReadFrequently: true });
				if (!ctx) {
					resolve(rawDataUrl);
					return;
				}
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				ctx.drawImage(img, 0, 0, width, height);
				const { domain, siteName, socials } = getProtectionConfig();
				resolve(protectCanvasAndExport(canvas, {
					domain,
					siteName,
					ownershipText: watermarkData || `This image belongs to ${domain}. All rights reserved. Registered with ${siteName}.`,
					socials,
					strength: 3
				}, "image/webp", quality));
			};
			img.onerror = () => resolve(rawDataUrl);
			img.src = rawDataUrl;
		};
		reader.onerror = () => resolve("");
		reader.readAsDataURL(file);
	});
}
var MAX_MEDIA_FILE_SIZE = 1 * 1024 * 1024;
async function trackUpload(file, usage = "other", customName, customDescription, watermarkData, customAltText) {
	if (file.size > 1048576) throw new Error(`File "${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit. Please upload a file less than 1 MB.`);
	const dataUrl = await fileToDataUrl(file, watermarkData);
	const effectiveName = customName || file.name;
	const effectiveAltText = customAltText || deriveAltText(effectiveName);
	return await mediaLibrary.add({
		name: effectiveName,
		type: file.type.startsWith("image/") ? "image/webp" : file.type || "application/octet-stream",
		size: Math.round(dataUrl.length * .75),
		dataUrl,
		usage,
		altText: effectiveAltText,
		description: customDescription
	});
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
//#endregion
export { trackUpload as a, mediaLibrary as i, deriveAltText as n, formatBytes as r, MAX_MEDIA_FILE_SIZE as t };

//# sourceMappingURL=media-library-DByzIaGz.js.map