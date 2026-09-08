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
		console.warn("Media library quota exceeded", e);
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
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(file);
	});
}
async function trackUpload(file, usage = "other") {
	const dataUrl = await fileToDataUrl(file);
	return mediaLibrary.add({
		name: file.name,
		type: file.type || "application/octet-stream",
		size: file.size,
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
