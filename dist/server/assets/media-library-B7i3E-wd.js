//#region src/lib/media-library.ts
var memoryCache = [];
var dbPromise = null;
function getDB() {
	if (typeof window === "undefined") return Promise.resolve(null);
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open("NT_MediaDB", 1);
		request.onupgradeneeded = (e) => {
			const db = e.target.result;
			if (!db.objectStoreNames.contains("store")) db.createObjectStore("store", { keyPath: "id" });
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	return dbPromise;
}
if (typeof window !== "undefined") getDB().then((db) => {
	if (!db) return;
	const req = db.transaction("store", "readonly").objectStore("store").get("media-list");
	req.onsuccess = () => {
		if (req.result?.data) {
			memoryCache = req.result.data;
			window.dispatchEvent(new Event("media-library-change"));
		}
	};
});
function write(items) {
	memoryCache = items;
	window.dispatchEvent(new Event("media-library-change"));
	getDB().then((db) => {
		if (!db) return;
		db.transaction("store", "readwrite").objectStore("store").put({
			id: "media-list",
			data: items
		});
	});
}
var mediaLibrary = {
	list() {
		return memoryCache.sort((a, b) => b.createdAt - a.createdAt);
	},
	add(item) {
		const full = {
			...item,
			id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
			createdAt: Date.now()
		};
		write([full, ...memoryCache]);
		return full;
	},
	get(id) {
		return memoryCache.find((m) => m.id === id);
	},
	update(id, patch) {
		write(memoryCache.map((m) => m.id === id ? {
			...m,
			...patch
		} : m));
	},
	remove(id) {
		write(memoryCache.filter((m) => m.id !== id));
	},
	clear() {
		write([]);
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
	return mediaLibrary.add({
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

//# sourceMappingURL=media-library-B7i3E-wd.js.map