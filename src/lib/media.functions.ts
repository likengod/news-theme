import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { persistBase64Image } from "./ad-storage.server";

export const uploadMediaServer = createServerFn({ method: "POST" })
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
    // 1. Save base64 to disk
    const publicUrl = persistBase64Image(data.dataUrl, `media_${Date.now()}`);

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
    usage: r.usage_type,
    altText: r.alt_text,
    description: r.description,
    createdAt: new Date(r.created_at).getTime(),
  }));
});

export const updateMediaServer = createServerFn({ method: "POST" })
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
    const publicUrl = persistBase64Image(data.dataUrl, `media_${Date.now()}`);
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
  .validator((data: { items: { id: string; altText: string }[] }) => data)
  .handler(async ({ data }) => {
    for (const it of data.items) {
      await query("UPDATE media_library SET alt_text = ? WHERE id = ?", [it.altText, it.id]);
    }
    return { success: true, count: data.items.length };
  });

export const deleteMediaServer = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await query("DELETE FROM media_library WHERE id = ?", [data.id]);
    return { success: true };
  });
