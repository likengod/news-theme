import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query, r as hashPassword } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
import crypto from "crypto";
//#region src/lib/admin-users.functions.ts?tss-serverfn-split
async function assertAdmin(userId) {
	if ((await query("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'", [userId])).length === 0) throw new Error("Forbidden: admin role required");
}
var listAdminUsers_createServerFn_handler = createServerRpc({
	id: "e4f613da354b95ded8ce2081279082f37e586523eb22e7ba9403d1ead85e95f2",
	name: "listAdminUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => listAdminUsers.__executeServer(opts));
var listAdminUsers = createServerFn({ method: "GET" }).middleware([requireAuth]).validator((data) => data ?? {}).handler(listAdminUsers_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const { q = "", role = "all", sort = "recent", page = 1, limit = 20 } = data;
	const safeLimit = Math.min(Math.max(1, limit), 100);
	const offset = (Math.max(1, page) - 1) * safeLimit;
	let filterSql = " WHERE 1=1";
	const params = [];
	if (q) {
		filterSql += " AND (u.email LIKE ? OR p.display_name LIKE ? OR p.public_user_id LIKE ?)";
		const term = `%${q}%`;
		params.push(term, term, term);
	}
	if (role && role !== "all") {
		filterSql += " AND r.role = ?";
		params.push(role);
	}
	let orderSql = " ORDER BY u.created_at DESC";
	if (sort === "points_desc") orderSql = " ORDER BY p.points DESC, u.created_at DESC";
	else if (sort === "points_asc") orderSql = " ORDER BY p.points ASC, u.created_at DESC";
	else if (sort === "name") orderSql = " ORDER BY p.display_name ASC, u.email ASC";
	const [countRes, rows] = await Promise.all([query(`SELECT COUNT(DISTINCT u.id) AS total
         FROM users u
         LEFT JOIN profiles p ON u.id = p.id
         LEFT JOIN user_roles r ON u.id = r.user_id
         ${filterSql}`, params), query(`SELECT 
           u.id, 
           u.email, 
           u.created_at,
           p.public_user_id, 
           p.display_name, 
           p.avatar_url, 
           p.points, 
           p.active,
           r.role
         FROM users u
         LEFT JOIN profiles p ON u.id = p.id
         LEFT JOIN user_roles r ON u.id = r.user_id
         ${filterSql}
         ${orderSql}
         LIMIT ? OFFSET ?`, [
		...params,
		safeLimit,
		offset
	])]);
	const total = Number(countRes[0]?.total ?? 0);
	const totalPages = Math.max(1, Math.ceil(total / safeLimit));
	return {
		rows: rows.map((u) => ({
			id: u.id,
			email: u.email,
			publicUserId: u.public_user_id || "0000000000",
			displayName: u.display_name || null,
			avatarUrl: u.avatar_url || null,
			role: u.role || "reader",
			points: Number(u.points || 0),
			createdAt: u.created_at ? new Date(u.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
			status: u.active === 0 || u.active === false ? "Suspended" : "Active"
		})),
		total,
		totalPages
	};
});
var getAllAdminUsers_createServerFn_handler = createServerRpc({
	id: "b6036d0bc738454474507449abce75eb56abbf37fec319140f402be356cf4f37",
	name: "getAllAdminUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => getAllAdminUsers.__executeServer(opts));
var getAllAdminUsers = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(getAllAdminUsers_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return (await query(`
      SELECT 
        u.id, 
        u.email, 
        u.created_at,
        p.public_user_id, 
        p.display_name, 
        p.avatar_url, 
        p.points, 
        p.active,
        r.role
      FROM users u
      LEFT JOIN profiles p ON u.id = p.id
      LEFT JOIN user_roles r ON u.id = r.user_id
      ORDER BY u.created_at DESC
    `)).map((u) => ({
		id: u.id,
		email: u.email,
		publicUserId: u.public_user_id || "0000000000",
		displayName: u.display_name || null,
		avatarUrl: u.avatar_url || null,
		role: u.role || "reader",
		points: Number(u.points || 0),
		createdAt: u.created_at ? new Date(u.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
		status: u.active === 0 || u.active === false ? "Suspended" : "Active"
	}));
});
var importAdminUsers_createServerFn_handler = createServerRpc({
	id: "48fe8cb020169719d3cd57f8962b6b1845ce528dab34e360f2be0bef0c3d06bc",
	name: "importAdminUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => importAdminUsers.__executeServer(opts));
var importAdminUsers = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((users) => users).handler(importAdminUsers_createServerFn_handler, async ({ data: users, context }) => {
	await assertAdmin(context.userId);
	if (!users || users.length === 0) return { success: true };
	for (const u of users) {
		if (!u.email) continue;
		if ((await query("SELECT id FROM users WHERE email = ?", [u.email])).length > 0) continue;
		const uid = crypto.randomUUID();
		const passHash = hashPassword("User@123");
		const name = u.displayName || u.email.split("@")[0];
		const role = u.role || "reader";
		await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [
			uid,
			u.email,
			passHash,
			name
		]);
		await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
			crypto.randomUUID(),
			uid,
			role
		]);
		let publicUserId = u.publicUserId || crypto.randomBytes(5).toString("hex");
		if (!u.publicUserId) for (let i = 0; i < 10; i++) {
			const candidate = (1 + Math.floor(Math.random() * 9)).toString() + Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
			if ((await query("SELECT id FROM profiles WHERE public_user_id = ?", [candidate])).length === 0) {
				publicUserId = candidate;
				break;
			}
		}
		let journalistId = null;
		if (role === "journalist") {
			const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			journalistId = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + Math.floor(Math.random() * 1e4).toString().padStart(4, "0") + letters[Math.floor(Math.random() * 26)];
		}
		await query(`INSERT INTO profiles (id, public_user_id, display_name, email, active, points, journalist_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
			uid,
			publicUserId,
			name,
			u.email,
			u.status === "Suspended" ? 0 : 1,
			Number(u.points || 0),
			journalistId
		]);
	}
	return { success: true };
});
var createAdminUser_createServerFn_handler = createServerRpc({
	id: "44648476b52f75748fa9e061f78c31dfe57f35f10cdf3043e81e50dfae452846",
	name: "createAdminUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => createAdminUser.__executeServer(opts));
var createAdminUser = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.email || !data.email.includes("@")) throw new Error("Valid email required");
	if (!data.password || data.password.length < 8) throw new Error("Password must be at least 8 characters");
	return data;
}).handler(createAdminUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	if ((await query("SELECT id FROM users WHERE email = ?", [data.email])).length > 0) throw new Error("User already exists");
	const uid = crypto.randomUUID();
	const passHash = hashPassword(data.password);
	const name = data.displayName || data.email.split("@")[0];
	await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [
		uid,
		data.email,
		passHash,
		name
	]);
	const role = data.role || "reader";
	await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
		crypto.randomUUID(),
		uid,
		role
	]);
	let publicUserId = "";
	for (let i = 0; i < 50; i++) {
		publicUserId = (1 + Math.floor(Math.random() * 9)).toString() + Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
		if ((await query("SELECT id FROM profiles WHERE public_user_id = ?", [publicUserId])).length === 0) break;
	}
	if (!publicUserId) publicUserId = crypto.randomBytes(5).toString("hex");
	let journalistId = null;
	if (role === "journalist") {
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		journalistId = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + Math.floor(Math.random() * 1e4).toString().padStart(4, "0") + letters[Math.floor(Math.random() * 26)];
	}
	await query(`INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
		uid,
		publicUserId,
		name,
		data.email,
		true,
		journalistId
	]);
	return {
		ok: true,
		id: uid
	};
});
var setAdminUserRole_createServerFn_handler = createServerRpc({
	id: "ba730ab7529c25c3f6ecd56d5e41e85a92653f22b92925befe98d3ae9a58e52c",
	name: "setAdminUserRole",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => setAdminUserRole.__executeServer(opts));
var setAdminUserRole = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(setAdminUserRole_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	await query("DELETE FROM user_roles WHERE user_id = ?", [data.userId]);
	await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
		crypto.randomUUID(),
		data.userId,
		data.role
	]);
	if (data.role === "journalist") {
		const profs = await query("SELECT journalist_id FROM profiles WHERE id = ?", [data.userId]);
		if (profs.length > 0 && !profs[0].journalist_id) {
			const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			await query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + Math.floor(Math.random() * 1e4).toString().padStart(4, "0") + letters[Math.floor(Math.random() * 26)], data.userId]);
		}
	}
	return { ok: true };
});
var deleteAdminUser_createServerFn_handler = createServerRpc({
	id: "64423d826bbc714ede86951c9f1916f7f0b77d8d1a2f932f86789450e9b7f8b6",
	name: "deleteAdminUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteAdminUser.__executeServer(opts));
var deleteAdminUser = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(deleteAdminUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	if (data.userId === context.userId) throw new Error("You cannot delete yourself");
	await query("DELETE FROM users WHERE id = ?", [data.userId]);
	return { ok: true };
});
var toggleAdminUserBan_createServerFn_handler = createServerRpc({
	id: "242f7a281f1bd9c0156e0defdfa248b20daa2720f35e430daac740ec37792361",
	name: "toggleAdminUserBan",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => toggleAdminUserBan.__executeServer(opts));
var toggleAdminUserBan = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(toggleAdminUserBan_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	if (data.userId === context.userId) throw new Error("You cannot suspend yourself");
	await query("UPDATE profiles SET active = ? WHERE id = ?", [data.suspend ? 0 : 1, data.userId]);
	return { ok: true };
});
var bulkDeleteAdminUsers_createServerFn_handler = createServerRpc({
	id: "e5bfa53b8bb05306086be3399e030e1e91d57b9aade854e12065b2e1beea5725",
	name: "bulkDeleteAdminUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => bulkDeleteAdminUsers.__executeServer(opts));
var bulkDeleteAdminUsers = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(bulkDeleteAdminUsers_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const validIds = (data.userIds ?? []).filter((id) => id !== context.userId);
	if (validIds.length === 0) return {
		ok: true,
		deletedCount: 0
	};
	await query(`DELETE FROM users WHERE id IN (${validIds.map(() => "?").join(",")})`, validIds);
	return {
		ok: true,
		deletedCount: validIds.length
	};
});
var bulkToggleAdminUserBan_createServerFn_handler = createServerRpc({
	id: "c1d937c34a7fb32d17695c2e775aa0d34df5549df8dda2ac848c787668183790",
	name: "bulkToggleAdminUserBan",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => bulkToggleAdminUserBan.__executeServer(opts));
var bulkToggleAdminUserBan = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(bulkToggleAdminUserBan_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const validIds = (data.userIds ?? []).filter((id) => id !== context.userId);
	if (validIds.length === 0) return {
		ok: true,
		updatedCount: 0
	};
	await query(`UPDATE profiles SET active = ? WHERE id IN (${validIds.map(() => "?").join(",")})`, [data.suspend ? 0 : 1, ...validIds]);
	return {
		ok: true,
		updatedCount: validIds.length
	};
});
var regeneratePublicUserId_createServerFn_handler = createServerRpc({
	id: "0f76d5daec30f22ed2b4abe100480ff9f820fe0691e971349d3d5b31af064c95",
	name: "regeneratePublicUserId",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => regeneratePublicUserId.__executeServer(opts));
var regeneratePublicUserId = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(regeneratePublicUserId_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	let candidate = "";
	for (let i = 0; i < 20; i++) {
		candidate = `${1 + Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 1e9).toString().padStart(9, "0")}`;
		try {
			await query("UPDATE profiles SET public_user_id = ? WHERE id = ?", [candidate, data.userId]);
			return {
				ok: true,
				publicUserId: candidate
			};
		} catch (err) {
			if (!/duplicate|unique/i.test(err.message)) throw err;
		}
	}
	throw new Error("Could not generate unique ID");
});
var setUserPoints_createServerFn_handler = createServerRpc({
	id: "7f3705a23943e0d335f1e588bc9def784ae013d70f854e527352bbe3e91d7b6c",
	name: "setUserPoints",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => setUserPoints.__executeServer(opts));
var setUserPoints = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.userId) throw new Error("userId required");
	if (typeof data.amount !== "number" || Number.isNaN(data.amount)) throw new Error("amount must be a number");
	return data;
}).handler(setUserPoints_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	let next = data.amount;
	if (data.mode === "add") {
		const cur = await query("SELECT points FROM profiles WHERE id = ?", [data.userId]);
		next = Number(cur[0]?.points || 0) + data.amount;
	}
	if (next < 0) next = 0;
	await query("UPDATE profiles SET points = ? WHERE id = ?", [next, data.userId]);
	return {
		ok: true,
		points: next
	};
});
var updateAdminUserPassword_createServerFn_handler = createServerRpc({
	id: "69521f1e7392e34389c335e12d6c56785c32af5c1bcf47157ef32029c1829db4",
	name: "updateAdminUserPassword",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => updateAdminUserPassword.__executeServer(opts));
var updateAdminUserPassword = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data.password || data.password.length < 8) throw new Error("Password must be at least 8 characters");
	return data;
}).handler(updateAdminUserPassword_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	await query("UPDATE users SET password_hash = ? WHERE id = ?", [hashPassword(data.password), data.userId]);
	const authHeader = getRequest()?.headers?.get("authorization");
	const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
	if (token) await query("DELETE FROM sessions WHERE user_id = ? AND id != ?", [data.userId, token]);
	else await query("DELETE FROM sessions WHERE user_id = ?", [data.userId]);
	return { ok: true };
});
var updateAdminUserDetails_createServerFn_handler = createServerRpc({
	id: "d6fff43b8c882c22c23d05f462c3d8a1e8d63e06f94d1c05315b49b296cd751b",
	name: "updateAdminUserDetails",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => updateAdminUserDetails.__executeServer(opts));
var updateAdminUserDetails = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(updateAdminUserDetails_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	if (data.email) {
		if ((await query("SELECT id FROM users WHERE email = ? AND id != ?", [data.email, data.userId])).length > 0) throw new Error("Email already in use");
		await query("UPDATE users SET email = ? WHERE id = ?", [data.email, data.userId]);
		await query("UPDATE profiles SET email = ? WHERE id = ?", [data.email, data.userId]);
	}
	if (data.displayName !== void 0) {
		await query("UPDATE users SET display_name = ? WHERE id = ?", [data.displayName, data.userId]);
		await query("UPDATE profiles SET display_name = ? WHERE id = ?", [data.displayName, data.userId]);
	}
	if (data.avatarUrl !== void 0) {
		await query("UPDATE users SET avatar_url = ? WHERE id = ?", [data.avatarUrl, data.userId]);
		await query("UPDATE profiles SET avatar_url = ? WHERE id = ?", [data.avatarUrl, data.userId]);
	}
	return { ok: true };
});
var deleteAdminUsersBulk_createServerFn_handler = createServerRpc({
	id: "36d3e819f19ad290ee03e8f40f4d538efa60e4d071740ffcd196f321ea09dbac",
	name: "deleteAdminUsersBulk",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteAdminUsersBulk.__executeServer(opts));
var deleteAdminUsersBulk = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => data).handler(deleteAdminUsersBulk_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const ids = data.userIds.filter((id) => id !== context.userId);
	if (ids.length === 0) return {
		ok: true,
		count: 0
	};
	await query(`DELETE FROM users WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
	return {
		ok: true,
		count: ids.length
	};
});
//#endregion
export { bulkDeleteAdminUsers_createServerFn_handler, bulkToggleAdminUserBan_createServerFn_handler, createAdminUser_createServerFn_handler, deleteAdminUser_createServerFn_handler, deleteAdminUsersBulk_createServerFn_handler, getAllAdminUsers_createServerFn_handler, importAdminUsers_createServerFn_handler, listAdminUsers_createServerFn_handler, regeneratePublicUserId_createServerFn_handler, setAdminUserRole_createServerFn_handler, setUserPoints_createServerFn_handler, toggleAdminUserBan_createServerFn_handler, updateAdminUserDetails_createServerFn_handler, updateAdminUserPassword_createServerFn_handler };
