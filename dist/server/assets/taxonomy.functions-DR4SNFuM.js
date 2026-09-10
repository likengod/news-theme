import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query, p as slugify } from "./db.server-Chz3iTW3.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/taxonomy.functions.ts?tss-serverfn-split
var getCategories_createServerFn_handler = createServerRpc({
	id: "03e56af06bac9556b433ca2c960715be210a02a6e76a33dd5ea6f6d79c24f055",
	name: "getCategories",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => getCategories.__executeServer(opts));
var getCategories = createServerFn({ method: "GET" }).validator((data) => data ?? {}).handler(getCategories_createServerFn_handler, async ({ data }) => {
	try {
		const q = data?.q ? `%${data.q}%` : null;
		let sql = `
        SELECT c.*, COUNT(a.id) as count 
        FROM categories c 
        LEFT JOIN articles a ON c.name = a.category AND a.status = 'Published'
      `;
		const params = [];
		if (q) {
			sql += " WHERE c.name LIKE ? OR c.description LIKE ?";
			params.push(q, q);
		}
		sql += " GROUP BY c.id ORDER BY c.name ASC";
		const rows = await query(sql, params);
		if (!Array.isArray(rows)) return [];
		return rows.map((r) => ({
			id: r.id,
			name: r.name,
			slug: r.slug,
			description: r.description || "",
			metaTitle: r.meta_title || "",
			metaDescription: r.meta_description || "",
			showInHeader: Boolean(r.show_in_header),
			count: Number(r.count || 0)
		}));
	} catch (err) {
		console.warn("[getCategories] Query warning:", err?.message || err);
		return [];
	}
});
var saveCategory_createServerFn_handler = createServerRpc({
	id: "b3095e70e29c64e8fdcdde5fbc447132d5211556bec99ac668eb0ff2de5657aa",
	name: "saveCategory",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => saveCategory.__executeServer(opts));
var saveCategory = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(saveCategory_createServerFn_handler, async ({ data }) => {
	const c = data;
	const slug = c.slug || slugify(c.name);
	if (c.id && c.id < 1e6) {
		await query(`UPDATE categories 
         SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ?, show_in_header = ? 
         WHERE id = ?`, [
			c.name,
			slug,
			c.description || "",
			c.metaTitle || "",
			c.metaDescription || "",
			c.showInHeader ? 1 : 0,
			c.id
		]);
		return {
			...c,
			slug
		};
	} else {
		const res = await query(`INSERT INTO categories (name, slug, description, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?)`, [
			c.name,
			slug,
			c.description || "",
			c.metaTitle || "",
			c.metaDescription || "",
			c.showInHeader ? 1 : 0
		]);
		return {
			...c,
			slug,
			id: res.insertId
		};
	}
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "73da229e9bba97b2e3b47fcf9f861a6b89c3ec72511b4c8964a3e5c9e092b53d",
	name: "deleteCategory",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(deleteCategory_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM categories WHERE id = ?", [id]);
	return { success: true };
});
var importCategories_createServerFn_handler = createServerRpc({
	id: "f2b55fcbc61de640bdc246a756afade094af300f815b713c633816f7f0b40536",
	name: "importCategories",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => importCategories.__executeServer(opts));
var importCategories = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cats) => cats).handler(importCategories_createServerFn_handler, async ({ data: cats }) => {
	if (!cats || cats.length === 0) return { success: true };
	for (const c of cats) {
		if (!c.name) continue;
		const finalSlug = c.slug || slugify(c.name);
		const existing = await query("SELECT id FROM categories WHERE id = ? OR slug = ?", [c.id || 0, finalSlug]);
		if (existing.length > 0) {
			const idToUpdate = existing[0].id;
			await query(`UPDATE categories SET name = ?, slug = ?, description = ?, meta_title = ?, meta_description = ?, show_in_header = ? WHERE id = ?`, [
				c.name,
				finalSlug,
				c.description || "",
				c.metaTitle || "",
				c.metaDescription || "",
				idToUpdate
			]);
		} else await query(`INSERT INTO categories (name, slug, description, meta_title, meta_description, show_in_header) VALUES (?, ?, ?, ?, ?, ?)`, [
			c.name,
			finalSlug,
			c.description || "",
			c.metaTitle || "",
			c.metaDescription || ""
		]);
	}
	return { success: true };
});
var getTags_createServerFn_handler = createServerRpc({
	id: "b51eb31b9d36ce8ad6724bbbef81a5b0b5f0ee5403bd22eeb33f98d43c91fcfb",
	name: "getTags",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => getTags.__executeServer(opts));
var getTags = createServerFn({ method: "GET" }).handler(getTags_createServerFn_handler, async () => {
	try {
		const tags = await query("SELECT * FROM tags ORDER BY name ASC");
		if (!Array.isArray(tags)) return [];
		let articles = [];
		try {
			articles = await query("SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL");
		} catch {
			articles = [];
		}
		const counts = /* @__PURE__ */ new Map();
		if (Array.isArray(articles)) articles.forEach((a) => {
			if (typeof a?.tags === "string") a.tags.split(",").map((t) => t.trim().toLowerCase()).forEach((t) => {
				counts.set(t, (counts.get(t) || 0) + 1);
			});
		});
		return tags.map((r) => ({
			id: r.id,
			name: r.name,
			slug: r.slug,
			count: counts.get(r.name?.toLowerCase?.() || "") || 0
		}));
	} catch (err) {
		console.warn("[getTags] Query warning:", err?.message || err);
		return [];
	}
});
var saveTag_createServerFn_handler = createServerRpc({
	id: "5e45b55e814da1ee45b2c220ed8509e0fc09d858adfa040131700cfd9259dc45",
	name: "saveTag",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => saveTag.__executeServer(opts));
var saveTag = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(saveTag_createServerFn_handler, async ({ data }) => {
	const t = data;
	const slug = t.slug || slugify(t.name);
	if (t.id && t.id < 1e6) {
		await query("UPDATE tags SET name = ?, slug = ? WHERE id = ?", [
			t.name,
			slug,
			t.id
		]);
		return {
			...t,
			slug
		};
	} else {
		const res = await query("INSERT INTO tags (name, slug) VALUES (?, ?)", [t.name, slug]);
		return {
			...t,
			slug,
			id: res.insertId
		};
	}
});
var deleteTag_createServerFn_handler = createServerRpc({
	id: "456a04395d91d0c6af478600bc3d2d7698126db44c195a057c14f79bc2f06e8d",
	name: "deleteTag",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => deleteTag.__executeServer(opts));
var deleteTag = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((id) => id).handler(deleteTag_createServerFn_handler, async ({ data: id }) => {
	await query("DELETE FROM tags WHERE id = ?", [id]);
	return { success: true };
});
var importTags_createServerFn_handler = createServerRpc({
	id: "2728870d1d2a6ca869b49740daab9a7138ab559359a7149922ab6ef7fdee087e",
	name: "importTags",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => importTags.__executeServer(opts));
var importTags = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((tags) => tags).handler(importTags_createServerFn_handler, async ({ data: tags }) => {
	if (!tags || tags.length === 0) return { success: true };
	for (const t of tags) {
		if (!t.name) continue;
		const finalSlug = t.slug || slugify(t.name);
		const existing = await query("SELECT id FROM tags WHERE id = ? OR slug = ?", [t.id || 0, finalSlug]);
		if (existing.length > 0) {
			const idToUpdate = existing[0].id;
			await query("UPDATE tags SET name = ?, slug = ? WHERE id = ?", [
				t.name,
				finalSlug,
				idToUpdate
			]);
		} else await query("INSERT INTO tags (name, slug) VALUES (?, ?)", [t.name, finalSlug]);
	}
	return { success: true };
});
var getCategoryData_createServerFn_handler = createServerRpc({
	id: "0da83c6ba72d428ef4d313202f748761bb822abb6fd298a5d991a8378d21bf96",
	name: "getCategoryData",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => getCategoryData.__executeServer(opts));
var getCategoryData = createServerFn({ method: "GET" }).validator((data) => data).handler(getCategoryData_createServerFn_handler, async ({ data }) => {
	try {
		const slug = typeof data === "string" ? data : data?.slug || "";
		const page = typeof data === "object" && Number(data?.page) > 0 ? Number(data.page) : 1;
		const limit = typeof data === "object" && Number(data?.limit) > 0 ? Number(data.limit) : 10;
		const offset = (page - 1) * limit;
		const catRows = await query("SELECT * FROM categories WHERE slug = ?", [slug]);
		if (!Array.isArray(catRows) || catRows.length === 0) return null;
		const cat = catRows[0];
		const [countRes, articles, latestRows] = await Promise.all([
			query("SELECT COUNT(*) as total FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW()", [cat.name]),
			query("SELECT * FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT ? OFFSET ?", [
				cat.name,
				limit,
				offset
			]),
			query("SELECT * FROM articles WHERE category = ? AND status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 5", [cat.name])
		]);
		const total = Number(countRes?.[0]?.total || 0);
		const totalPages = Math.max(1, Math.ceil(total / limit));
		const mapped = (Array.isArray(articles) ? articles : []).map((r) => ({
			...r,
			featured: Boolean(r.featured)
		}));
		const featured = (page === 1 ? mapped.slice(0, 3) : []).map((a) => ({
			title: a.title,
			excerpt: a.excerpt,
			date: new Date(a.date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			}),
			img: a.featuredImage,
			tags: a.tags ? a.tags.split(",").map((t) => t.trim()) : [cat.name],
			slug: a.slug,
			views: a.views,
			author: a.author || "Newsroom",
			kickers: a.tags ? a.tags.split(",").map((t) => t.trim()).slice(0, 2) : [cat.name]
		}));
		const list = (page === 1 ? mapped.slice(3) : mapped).map((a) => ({
			title: a.title,
			excerpt: a.excerpt,
			date: new Date(a.date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			}),
			img: a.featuredImage,
			tags: a.tags ? a.tags.split(",").map((t) => t.trim()) : [cat.name],
			slug: a.slug,
			views: a.views,
			author: a.author || "Newsroom"
		}));
		const latest = (Array.isArray(latestRows) ? latestRows : []).map((a) => ({
			title: a.title,
			date: new Date(a.date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			}),
			img: a.featuredImage,
			slug: a.slug
		}));
		return {
			category: {
				name: cat.name,
				slug: cat.slug,
				description: cat.description || `Latest ${cat.name} news, analysis and updates.`,
				metaTitle: cat.meta_title || `${cat.name} News - News Theme`,
				metaDescription: cat.meta_description || `Read latest ${cat.name} articles and coverage.`
			},
			featured,
			list,
			latest,
			total,
			totalPages,
			page
		};
	} catch (err) {
		console.warn("[getCategoryData] Query warning:", err?.message || err);
		return null;
	}
});
var getTopTags_createServerFn_handler = createServerRpc({
	id: "0d3e907d8ae66780e1453f78ed08c9c482ba98198c822ff82e6767a06b7a2599",
	name: "getTopTags",
	filename: "src/lib/taxonomy.functions.ts"
}, (opts) => getTopTags.__executeServer(opts));
var getTopTags = createServerFn({ method: "GET" }).handler(getTopTags_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT tags FROM articles WHERE status = 'Published' AND tags IS NOT NULL AND tags != '' ORDER BY date DESC LIMIT 60");
		const set = /* @__PURE__ */ new Set();
		for (const r of rows) {
			if (!r.tags) continue;
			const parts = r.tags.split(",").map((t) => t.trim()).filter(Boolean);
			for (const p of parts) {
				const formatted = p.charAt(0).toUpperCase() + p.slice(1);
				set.add(formatted);
				if (set.size >= 10) break;
			}
			if (set.size >= 10) break;
		}
		for (const f of [
			"Infrastructure",
			"Trade",
			"Governance",
			"Healthcare",
			"Economy",
			"Finance",
			"Space",
			"Tech",
			"Sports",
			"Culture"
		]) {
			if (set.size >= 10) break;
			set.add(f);
		}
		return Array.from(set).slice(0, 10);
	} catch (err) {
		console.error("[MySQL] Error fetching top tags:", err);
		return [
			"Infrastructure",
			"Trade",
			"Governance",
			"Healthcare",
			"Economy",
			"Finance",
			"Space",
			"Tech",
			"Sports",
			"Culture"
		];
	}
});
//#endregion
export { deleteCategory_createServerFn_handler, deleteTag_createServerFn_handler, getCategories_createServerFn_handler, getCategoryData_createServerFn_handler, getTags_createServerFn_handler, getTopTags_createServerFn_handler, importCategories_createServerFn_handler, importTags_createServerFn_handler, saveCategory_createServerFn_handler, saveTag_createServerFn_handler };
