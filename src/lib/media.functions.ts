import fs from "node:fs";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { persistMediaImage } from "./ad-storage.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";

export const uploadMediaServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator(
    (data: {
      id: string;
      name: string;
      type: string;
      size: number;
      dataUrl: string;
      usage: string;
      altText?: string;
      description?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    // 1. Save base64 to disk under /uploads/media/
    const publicUrl = persistMediaImage(data.dataUrl, `media_${Date.now()}`);

    // 2. Insert into database
    await query(
      "INSERT INTO media_library (id, name, type, size, url, usage_type, alt_text, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.id,
        data.name,
        data.type,
        data.size,
        publicUrl,
        data.usage,
        data.altText || data.name || null,
        data.description || null,
      ],
    );

    return { success: true, url: publicUrl };
  });

export const getMediaListServer = createServerFn({ method: "GET" }).handler(async () => {
  const results = await query("SELECT * FROM media_library ORDER BY created_at DESC");
  return results.map((r: any) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    size: r.size,
    dataUrl: r.url, // we map the url to dataUrl for backward compatibility with frontend
    url: r.url,
    usage: r.usage_type,
    altText: r.alt_text,
    description: r.description,
    createdAt: new Date(r.created_at).getTime(),
  }));
});

export const updateMediaServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((data: { id: string; name?: string; altText?: string; description?: string }) => data)
  .handler(async ({ data }) => {
    const updates = [];
    const params = [];
    if (data.name !== undefined) {
      updates.push("name = ?");
      params.push(data.name);
    }
    if (data.altText !== undefined) {
      updates.push("alt_text = ?");
      params.push(data.altText);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description);
    }

    if (updates.length > 0) {
      params.push(data.id);
      await query(`UPDATE media_library SET ${updates.join(", ")} WHERE id = ?`, params);
    }
    return { success: true };
  });

export const replaceMediaFileServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator(
    (data: {
      id: string;
      dataUrl: string;
      size: number;
      type: string;
      name?: string;
      altText?: string;
      description?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const publicUrl = persistMediaImage(data.dataUrl, `media_${Date.now()}`);
    const updates = ["url = ?", "size = ?", "type = ?"];
    const params: any[] = [publicUrl, data.size, data.type];
    if (data.name !== undefined) {
      updates.push("name = ?");
      params.push(data.name);
    }
    if (data.altText !== undefined) {
      updates.push("alt_text = ?");
      params.push(data.altText);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description);
    }
    params.push(data.id);
    await query(`UPDATE media_library SET ${updates.join(", ")} WHERE id = ?`, params);
    return { success: true, url: publicUrl };
  });

export const batchUpdateAltTextServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((data: { items: { id: string; altText: string }[] }) => data)
  .handler(async ({ data }) => {
    for (const it of data.items) {
      await query("UPDATE media_library SET alt_text = ? WHERE id = ?", [it.altText, it.id]);
    }
    return { success: true, count: data.items.length };
  });


async function removeFileFromDisk(fileUrl?: string) {
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
    path.join(cwd, "uploads", "documents"),
  ];

  for (const dir of searchDirs) {
    const targetFile = path.join(dir, filename);
    try {
      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
    } catch (e) {
      console.error(`[MediaDelete] Failed to unlink file ${targetFile}:`, e);
    }
  }

  // Clear article featured_image reference if it was linked to this file
  try {
    await query("UPDATE articles SET featured_image = NULL WHERE featured_image LIKE ?", [`%${filename}%`]);
  } catch {}
}

export const deleteMediaServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const rows: any = await query("SELECT url FROM media_library WHERE id = ?", [data.id]);
      if (Array.isArray(rows) && rows[0]?.url) {
        await removeFileFromDisk(rows[0].url);
      }
    } catch {}
    await query("DELETE FROM media_library WHERE id = ?", [data.id]);
    return { success: true };
  });

export const deleteMultipleMediaServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    if (!data.ids || data.ids.length === 0) return { success: true, count: 0 };
    try {
      const placeholders = data.ids.map(() => "?").join(",");
      const rows: any = await query(`SELECT url FROM media_library WHERE id IN (${placeholders})`, data.ids);
      if (Array.isArray(rows)) {
        for (const r of rows) {
          if (r?.url) await removeFileFromDisk(r.url);
        }
      }
    } catch {}
    const placeholders = data.ids.map(() => "?").join(",");
    await query(`DELETE FROM media_library WHERE id IN (${placeholders})`, data.ids);
    return { success: true, count: data.ids.length };
  });

