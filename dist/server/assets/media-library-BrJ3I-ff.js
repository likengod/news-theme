//#region src/lib/media-library.ts
var KEY = "nt_media_library_v1";
function read() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem(KEY) || "[]");
	} catch {
		return [];
	}
}
function write(items) {
	try {
		localStorage.setItem(KEY, JSON.stringify(items));
		window.dispatchEvent(new Event("media-library-change"));
	} catch (e) {
		console.warn("Media library quota exceeded, pruning older items...", e);
		try {
			const pruned = items.slice(0, 4);
			localStorage.setItem(KEY, JSON.stringify(pruned));
			window.dispatchEvent(new Event("media-library-change"));
		} catch {
			try {
				localStorage.removeItem(KEY);
			} catch {}
		}
	}
}
var mediaLibrary = {
	list() {
		return read().sort((a, b) => b.createdAt - a.createdAt);
	},
	add(item) {
		const full = {
			...item,
			id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
			createdAt: Date.now()
		};
		write([full, ...read()]);
		return full;
	},
	update(id, patch) {
		write(read().map((m) => m.id === id ? {
			...m,
			...patch
		} : m));
	},
	remove(id) {
		write(read().filter((m) => m.id !== id));
	},
	clear() {
		write([]);
	}
};
/**
* Reads a File and produces an optimized data URL.
* Automatically compresses large raster images using HTML5 canvas to keep
* file sizes under ~200 KB and prevent browser QuotaExceededError.
*/
function fileToDataUrl(file, maxDimension = 1920, quality = .82) {
	if (typeof window === "undefined" || typeof document === "undefined" || !file.type.startsWith("image/") || file.type === "image/svg+xml") return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(file);
	});
	if (file.size < 75 * 1024) return new Promise((resolve, reject) => {
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
				try {
					const webp = canvas.toDataURL("image/webp", quality);
					if (webp.startsWith("data:image/webp") && webp.length < rawDataUrl.length) {
						resolve(webp);
						return;
					}
				} catch {}
				try {
					const jpeg = canvas.toDataURL("image/jpeg", quality);
					if (jpeg.length < rawDataUrl.length) {
						resolve(jpeg);
						return;
					}
				} catch {}
				resolve(rawDataUrl);
			};
			img.onerror = () => resolve(rawDataUrl);
			img.src = rawDataUrl;
		};
		reader.onerror = () => resolve("");
		reader.readAsDataURL(file);
	});
}
async function trackUpload(file, usage = "other") {
	const dataUrl = await fileToDataUrl(file);
	return mediaLibrary.add({
		name: file.name,
		type: file.type || "application/octet-stream",
		size: Math.round(dataUrl.length * .75),
		dataUrl,
		usage
	});
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
//#endregion
export { mediaLibrary as n, trackUpload as r, formatBytes as t };

//# sourceMappingURL=media-library-BrJ3I-ff.js.map