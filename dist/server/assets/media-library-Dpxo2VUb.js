import { i as createServerFn } from "./esm-Dova13aH.js";
import { I as createSsrRpc } from "./site-content-Jb87XQWv.js";
//#region src/lib/media.functions.ts
var uploadMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2d84dc33d0d55e73323d721355f17c3b57fbabc53b5cbd8b1444ceaea4227d14"));
var getMediaListServer = createServerFn({ method: "GET" }).handler(createSsrRpc("5171cfe7a5eb72c85b80892422db2c978d7f6ca631e43682141b0447064c407b"));
var updateMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e30b47418872d7ca1fb2d3af3e86d8b52c3f8a1c070269d6763789d0886ee8f4"));
var deleteMediaServer = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("494a2753d65953536e1f3934b3921e0f62393deb0838cc47539f0ea3de769dbd"));
//#endregion
//#region src/lib/media-library.ts
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
		const res = await uploadMediaServer({ data: {
			id,
			name: item.name,
			type: item.type,
			size: item.size,
			dataUrl: item.dataUrl,
			usage: item.usage,
			description: item.description
		} });
		const full = {
			...item,
			id,
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
	async remove(id) {
		memoryCache = memoryCache.filter((m) => m.id !== id);
		notifyChange();
		await deleteMediaServer({ data: { id } });
	},
	clear() {
		memoryCache = [];
		notifyChange();
	}
};
/**
* Injects a hidden watermark directly into the binary file data (Metadata Injection).
* This works with WebP and keeps file sizes tiny.
*/
function injectMetadata(dataUrl, text) {
	const base64 = dataUrl.split(",")[1];
	const mime = dataUrl.split(",")[0];
	const binaryString = atob(base64);
	const payload = "\n---WATERMARK_START---\n" + text + "\n---WATERMARK_END---\n";
	const newBinaryString = binaryString + unescape(encodeURIComponent(payload));
	return mime + "," + btoa(newBinaryString);
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
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(rawDataUrl);
					return;
				}
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				ctx.drawImage(img, 0, 0, width, height);
				let finalDataUrl = rawDataUrl;
				try {
					const webp = canvas.toDataURL("image/webp", quality);
					if (webp.startsWith("data:image/webp") && webp.length < rawDataUrl.length) finalDataUrl = webp;
				} catch {}
				if (finalDataUrl === rawDataUrl) try {
					const jpeg = canvas.toDataURL("image/jpeg", quality);
					if (jpeg.length < rawDataUrl.length) finalDataUrl = jpeg;
				} catch {}
				if (watermarkData) try {
					finalDataUrl = injectMetadata(finalDataUrl, watermarkData);
				} catch (err) {
					console.error("Watermark injection failed", err);
				}
				resolve(finalDataUrl);
			};
			img.onerror = () => resolve(rawDataUrl);
			img.src = rawDataUrl;
		};
		reader.onerror = () => resolve("");
		reader.readAsDataURL(file);
	});
}
async function trackUpload(file, usage = "other", customName, customDescription, watermarkData) {
	const dataUrl = await fileToDataUrl(file, watermarkData);
	return await mediaLibrary.add({
		name: customName || file.name,
		type: watermarkData ? "image/png" : file.type || "application/octet-stream",
		size: Math.round(dataUrl.length * .75),
		dataUrl,
		usage,
		description: customDescription
	});
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
//#endregion
export { mediaLibrary as n, trackUpload as r, formatBytes as t };

//# sourceMappingURL=media-library-Dpxo2VUb.js.map