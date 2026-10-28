import { r as createServerFn } from "./server-tRd-_-rL.js";
import { c as query } from "./db.server-C6BR1yx2.js";
import { t as requireAdmin } from "./auth-middleware-CU8g4DTz.js";
import { t as attachAuth } from "./auth-attacher-CDNgXTi6.js";
import { persistMediaImage } from "./ad-storage.server-DG5zgLnY.js";
import { t as createServerRpc } from "./createServerRpc-Buj7DiYE.js";
import fs from "node:fs";
import path from "node:path";
// src/lib/media.functions.ts?tss-serverfn-split
var uploadMediaServer_createServerFn_handler = createServerRpc({
	id: "2d84dc33d0d55e73323d721355f17c3b57fbabc53b5cbd8b1444ceaea4227d14",
	name: "uploadMediaServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => uploadMediaServer.__executeServer(opts));
var uploadMediaServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(uploadMediaServer_createServerFn_handler, async ({ data }) => {
	const publicUrl = persistMediaImage(data.dataUrl, `media_${Date.now()}`);
	await query("INSERT INTO media_library (id, name, type, size, url, usage_type, alt_text, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
		data.id,
		data.name,
		data.type,
		data.size,
		publicUrl,
		data.usage,
		data.altText || data.name || null,
		data.description || null
	]);
	return {
		success: true,
		url: publicUrl
	};
});
var getMediaListServer_createServerFn_handler = createServerRpc({
	id: "5171cfe7a5eb72c85b80892422db2c978d7f6ca631e43682141b0447064c407b",
	name: "getMediaListServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => getMediaListServer.__executeServer(opts));
var getMediaListServer = createServerFn({ method: "GET" }).handler(getMediaListServer_createServerFn_handler, async () => {
	return (await query("SELECT * FROM media_library ORDER BY created_at DESC")).map((r) => ({
		id: r.id,
		name: r.name,
		type: r.type,
		size: r.size,
		dataUrl: r.url,
		url: r.url,
		usage: r.usage_type,
		altText: r.alt_text,
		description: r.description,
		createdAt: new Date(r.created_at).getTime()
	}));
});
var updateMediaServer_createServerFn_handler = createServerRpc({
	id: "e30b47418872d7ca1fb2d3af3e86d8b52c3f8a1c070269d6763789d0886ee8f4",
	name: "updateMediaServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => updateMediaServer.__executeServer(opts));
var updateMediaServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(updateMediaServer_createServerFn_handler, async ({ data }) => {
	const updates = [];
	const params = [];
	if (data.name !== void 0) {
		updates.push("name = ?");
		params.push(data.name);
	}
	if (data.altText !== void 0) {
		updates.push("alt_text = ?");
		params.push(data.altText);
	}
	if (data.description !== void 0) {
		updates.push("description = ?");
		params.push(data.description);
	}
	if (updates.length > 0) {
		params.push(data.id);
		await query(`UPDATE media_library SET ${updates.join(", ")} WHERE id = ?`, params);
	}
	return { success: true };
});
var replaceMediaFileServer_createServerFn_handler = createServerRpc({
	id: "6329335e43e59c703022ecded4636f3342709f33f8890f22cc106cb8e99ae796",
	name: "replaceMediaFileServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => replaceMediaFileServer.__executeServer(opts));
var replaceMediaFileServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(replaceMediaFileServer_createServerFn_handler, async ({ data }) => {
	const publicUrl = persistMediaImage(data.dataUrl, `media_${Date.now()}`);
	const updates = [
		"url = ?",
		"size = ?",
		"type = ?"
	];
	const params = [
		publicUrl,
		data.size,
		data.type
	];
	if (data.name !== void 0) {
		updates.push("name = ?");
		params.push(data.name);
	}
	if (data.altText !== void 0) {
		updates.push("alt_text = ?");
		params.push(data.altText);
	}
	if (data.description !== void 0) {
		updates.push("description = ?");
		params.push(data.description);
	}
	params.push(data.id);
	await query(`UPDATE media_library SET ${updates.join(", ")} WHERE id = ?`, params);
	return {
		success: true,
		url: publicUrl
	};
});
var batchUpdateAltTextServer_createServerFn_handler = createServerRpc({
	id: "7df5206812c5eb96c69bf01f4466216c73e5df24362927076561735849872a91",
	name: "batchUpdateAltTextServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => batchUpdateAltTextServer.__executeServer(opts));
var batchUpdateAltTextServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(batchUpdateAltTextServer_createServerFn_handler, async ({ data }) => {
	for (const it of data.items) await query("UPDATE media_library SET alt_text = ? WHERE id = ?", [it.altText, it.id]);
	return {
		success: true,
		count: data.items.length
	};
});
async function removeFileFromDisk(fileUrl) {
	if (!fileUrl || typeof fileUrl !== "string") return;
	const cleanUrl = fileUrl.split("?")[0].replace(/^https?:\/\/[^/]+/i, "");
	if (!cleanUrl.includes("/uploads/")) return;
	const filename = path.basename(cleanUrl);
	if (!filename || filename === ".gitkeep" || filename.includes("..")) return;
	const cwd = process.cwd();
	const searchDirs = [
		path.join(cwd, "public", "uploads"),
		path.join(cwd, "public", "uploads", "media"),
		path.join(cwd, "public", "uploads", "promos"),
		path.join(cwd, "public", "uploads", "ads"),
		path.join(cwd, "public", "uploads", "documents"),
		path.join(cwd, "dist", "client", "uploads"),
		path.join(cwd, "dist", "client", "uploads", "media"),
		path.join(cwd, "dist", "client", "uploads", "promos"),
		path.join(cwd, "dist", "client", "uploads", "ads"),
		path.join(cwd, "dist", "client", "uploads", "documents"),
		path.join(cwd, "uploads"),
		path.join(cwd, "uploads", "media"),
		path.join(cwd, "uploads", "promos"),
		path.join(cwd, "uploads", "ads"),
		path.join(cwd, "uploads", "documents")
	];
	for (const dir of searchDirs) {
		const targetFile = path.join(dir, filename);
		try {
			if (fs.existsSync(targetFile)) fs.unlinkSync(targetFile);
		} catch (e) {
			console.error(`[MediaDelete] Failed to unlink file ${targetFile}:`, e);
		}
	}
	try {
		await query("UPDATE articles SET featured_image = NULL WHERE featured_image LIKE ?", [`%${filename}%`]);
	} catch {}
}
var deleteMediaServer_createServerFn_handler = createServerRpc({
	id: "494a2753d65953536e1f3934b3921e0f62393deb0838cc47539f0ea3de769dbd",
	name: "deleteMediaServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => deleteMediaServer.__executeServer(opts));
var deleteMediaServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(deleteMediaServer_createServerFn_handler, async ({ data }) => {
	try {
		const rows = await query("SELECT url FROM media_library WHERE id = ?", [data.id]);
		if (Array.isArray(rows) && rows[0]?.url) await removeFileFromDisk(rows[0].url);
	} catch {}
	await query("DELETE FROM media_library WHERE id = ?", [data.id]);
	return { success: true };
});
var deleteMultipleMediaServer_createServerFn_handler = createServerRpc({
	id: "81db0087bd1cbae6f062c40d636a90261aeee5fe44b493c6eaaa70ed8f0a148e",
	name: "deleteMultipleMediaServer",
	filename: "src/lib/media.functions.ts"
}, (opts) => deleteMultipleMediaServer.__executeServer(opts));
var deleteMultipleMediaServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((data) => data).handler(deleteMultipleMediaServer_createServerFn_handler, async ({ data }) => {
	if (!data.ids || data.ids.length === 0) return {
		success: true,
		count: 0
	};
	try {
		const placeholders = data.ids.map(() => "?").join(",");
		const rows = await query(`SELECT url FROM media_library WHERE id IN (${placeholders})`, data.ids);
		if (Array.isArray(rows)) {
			for (const r of rows) if (r?.url) await removeFileFromDisk(r.url);
		}
	} catch {}
	const placeholders = data.ids.map(() => "?").join(",");
	await query(`DELETE FROM media_library WHERE id IN (${placeholders})`, data.ids);
	return {
		success: true,
		count: data.ids.length
	};
});
export { batchUpdateAltTextServer_createServerFn_handler, deleteMediaServer_createServerFn_handler, deleteMultipleMediaServer_createServerFn_handler, getMediaListServer_createServerFn_handler, replaceMediaFileServer_createServerFn_handler, updateMediaServer_createServerFn_handler, uploadMediaServer_createServerFn_handler };

//# sourceMappingURL=media.functions-BoE6TFxi.js.map