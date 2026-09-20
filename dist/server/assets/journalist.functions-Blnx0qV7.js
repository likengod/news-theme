import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { r as createServerFn } from "./esm-B50dUWcE.js";
import { i as hashPassword, s as query } from "./db.server-BkLt9eJ8.js";
import { n as requireAuth } from "./auth-middleware-BNC9rUei.js";
import { persistDocumentImage } from "./ad-storage.server-B8sKpu9k.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import { a as rankForCount, t as DEFAULT_RANKS } from "./journalist-ranks-5jGsCoOl.js";
import crypto from "crypto";
//#region src/lib/journalist.functions.ts?tss-serverfn-split
async function assertAdmin(userId) {
	if ((await query("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'", [userId])).length === 0) throw new Error("Forbidden: admin role required");
}
async function generateJournalistId() {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (let i = 0; i < 50; i++) {
		const candidate = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + Math.floor(Math.random() * 1e4).toString().padStart(4, "0") + letters[Math.floor(Math.random() * 26)];
		if ((await query("SELECT id FROM profiles WHERE journalist_id = ?", [candidate])).length === 0) return candidate;
	}
	return crypto.randomBytes(4).toString("hex").toUpperCase();
}
var listJournalists_createServerFn_handler = createServerRpc({
	id: "8cea322cbc4f6bcc495d4f79eecafc364597765e92569763076616465537f853",
	name: "listJournalists",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => listJournalists.__executeServer(opts));
var listJournalists = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(listJournalists_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	const profiles = await query(`
      SELECT p.* 
      FROM profiles p
      INNER JOIN user_roles ur ON p.id = ur.user_id
      WHERE ur.role = 'journalist'
    `);
	if (profiles.length === 0) return [];
	const stats = await query(`SELECT journalistId, COUNT(*) as count 
       FROM articles 
       WHERE status = 'Published' AND journalistId IS NOT NULL 
       GROUP BY journalistId`);
	const countMap = /* @__PURE__ */ new Map();
	for (const r of stats) if (r.journalistId) countMap.set(r.journalistId.trim(), Number(r.count || 0));
	const updates = [];
	for (const p of profiles) {
		if (!p.journalist_id) {
			const gen = await generateJournalistId();
			updates.push(query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [gen, p.id]));
			p.journalist_id = gen;
		}
		const actualCount = countMap.get(p.journalist_id.trim()) ?? 0;
		if (Number(p.articles_published ?? 0) !== actualCount) {
			updates.push(query("UPDATE profiles SET articles_published = ? WHERE id = ?", [actualCount, p.id]));
			p.articles_published = actualCount;
		}
	}
	if (updates.length > 0) await Promise.all(updates);
	return profiles.map((p) => ({
		userId: p.id,
		journalistId: p.journalist_id ?? null,
		publicUserId: p.public_user_id,
		displayName: p.display_name,
		avatarUrl: p.avatar_url,
		points: Number(p.points ?? 0),
		createdAt: p.created_at ? new Date(p.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
		active: Number(p.active) !== 0 && p.active !== false && p.active !== "0" && p.active !== null,
		email: p.email ?? null,
		phone: p.phone ?? null,
		bloodGroup: p.blood_group ?? null,
		dob: p.dob ?? p.date_of_birth ?? null,
		validTill: p.valid_till ?? null,
		fatherName: p.father_name ?? null,
		motherName: p.mother_name ?? null,
		gender: p.gender ?? null,
		maritalStatus: p.marital_status ?? null,
		husbandName: p.husband_name ?? null,
		documentType: p.document_type ?? null,
		documentUrl: p.document_url ?? null,
		address: p.address ?? null,
		state: p.state ?? null,
		country: p.country ?? null,
		pinCode: p.pin_code ?? null,
		articlesPublished: Number(p.articles_published ?? 0),
		bankName: p.bank_name ?? null,
		bankAccountName: p.bank_account_name ?? null,
		bankAccountNo: p.bank_account_no ?? null,
		bankIfsc: p.bank_ifsc ?? null
	}));
});
var JOURNALIST_ROLES = /* @__PURE__ */ new Set([
	"author",
	"editor",
	"admin"
]);
var JOURNALIST_ROLES_ALL = /* @__PURE__ */ new Set([
	"author",
	"editor",
	"admin",
	"journalist"
]);
var lookupJournalist_createServerFn_handler = createServerRpc({
	id: "d11f8218e1bc2394af4f78dca0f87578d9aed581749b5a90533c8ba434f6b8d8",
	name: "lookupJournalist",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => lookupJournalist.__executeServer(opts));
var lookupJournalist = createServerFn({ method: "POST" }).inputValidator((data) => {
	const id = String(data?.publicUserId ?? "").trim();
	if (id.length < 3) throw new Error("Enter a valid Journalist ID, User ID, or Phone Number");
	return { publicUserId: id };
}).handler(lookupJournalist_createServerFn_handler, async ({ data }) => {
	const q = data.publicUserId;
	const cleanId = q.toUpperCase().replace(/-/g, "");
	const cleanDigits = q.replace(/\D/g, "");
	const last10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : "";
	let sql = `SELECT * FROM profiles 
               WHERE public_user_id = ? 
                  OR REPLACE(journalist_id, '-', '') = ?`;
	const params = [q, cleanId];
	if (last10) {
		sql += ` OR REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+', ''), '-', ''), '(', '') LIKE ?`;
		params.push(`%${last10}`);
	}
	sql += " LIMIT 1";
	const profiles = await query(sql, params);
	if (profiles.length === 0) return { found: false };
	const p = profiles[0];
	const roles = await query("SELECT role FROM user_roles WHERE user_id = ?", [p.id]);
	const rank = {
		admin: 5,
		editor: 4,
		author: 3,
		journalist: 3,
		premium: 2,
		reader: 1
	};
	const best = roles.map((r) => r.role).sort((a, b) => (rank[b] ?? 0) - (rank[a] ?? 0))[0] ?? "reader";
	return {
		found: true,
		userId: p.id,
		verified: JOURNALIST_ROLES_ALL.has(best),
		active: Number(p.active) !== 0 && p.active !== false && p.active !== "0" && p.active !== null,
		role: best,
		displayName: p.display_name,
		publicUserId: p.public_user_id,
		journalistId: p.journalist_id ?? null,
		avatarUrl: p.avatar_url ?? null,
		email: p.email ?? null,
		phone: p.phone ?? null,
		bloodGroup: p.blood_group ?? null,
		dob: p.dob ?? p.date_of_birth ?? null,
		validTill: p.valid_till ?? null,
		fatherName: p.father_name ?? null,
		motherName: p.mother_name ?? null,
		gender: p.gender ?? null,
		maritalStatus: p.marital_status ?? null,
		husbandName: p.husband_name ?? null,
		address: p.address ?? null,
		state: p.state ?? null,
		country: p.country ?? null,
		pinCode: p.pin_code ?? null,
		articlesPublished: Number(p.articles_published ?? 0),
		memberSince: p.created_at ? new Date(p.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
	};
});
var getJournalistPrivateStats_createServerFn_handler = createServerRpc({
	id: "be945b3b1850d06957e0c1f1206a296f68186767b6bc3e5f7332ebab888698a4",
	name: "getJournalistPrivateStats",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => getJournalistPrivateStats.__executeServer(opts));
var getJournalistPrivateStats = createServerFn({ method: "POST" }).inputValidator((data) => {
	if (!data?.targetUserId) throw new Error("targetUserId is required");
	return {
		targetUserId: String(data.targetUserId).trim(),
		sessionToken: data.sessionToken ? String(data.sessionToken).trim() : void 0
	};
}).handler(getJournalistPrivateStats_createServerFn_handler, async ({ data }) => {
	let token = data.sessionToken;
	if (!token) try {
		const authHeader = getRequest()?.headers?.get("authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.replace("Bearer ", "").trim();
	} catch {}
	if (!token) return { authorized: false };
	const sessions = await query(`SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()`, [token]);
	if (sessions.length === 0) return { authorized: false };
	const viewerUserId = sessions[0].user_id;
	const viewerRoles = (await query(`SELECT role FROM user_roles WHERE user_id = ?`, [viewerUserId])).map((r) => String(r.role).toLowerCase());
	const isAdminOrEditor = viewerRoles.includes("admin") || viewerRoles.includes("editor");
	const isOwnerJournalist = viewerUserId === data.targetUserId;
	if (!isAdminOrEditor && !isOwnerJournalist) return { authorized: false };
	const targetProfiles = await query(`SELECT * FROM profiles WHERE id = ?`, [data.targetUserId]);
	if (targetProfiles.length === 0) return { authorized: false };
	const p = targetProfiles[0];
	const artStats = await query(`SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as last_month,
         SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 365 DAY) THEN 1 ELSE 0 END) as last_year
       FROM articles 
       WHERE status = 'Published' 
         AND (journalistId = ? OR journalistId = ? OR journalistId = ?)`, [
		p.public_user_id,
		p.journalist_id ?? "",
		p.id
	]);
	const artTotal = Number(artStats[0]?.total ?? 0);
	const publishedTotal = Math.max(Number(p.articles_published ?? 0), artTotal);
	const publishedLastMonth = Number(artStats[0]?.last_month ?? 0);
	const publishedLastYear = Number(artStats[0]?.last_year ?? 0);
	let ranks = DEFAULT_RANKS;
	try {
		const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'journalist_ranks_config'");
		if (settingRows.length > 0 && settingRows[0].value) {
			const parsed = JSON.parse(settingRows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) ranks = [...parsed].sort((a, b) => a.minNews - b.minNews);
		}
	} catch {}
	const rankMatch = rankForCount(publishedTotal, ranks);
	return {
		authorized: true,
		publishedTotal,
		publishedLastMonth,
		publishedLastYear,
		rankName: rankMatch ? rankMatch.name : "Reporter",
		rankColor: rankMatch ? rankMatch.color : "emerald",
		rankPointsPerNews: rankMatch ? rankMatch.pointsPerNews : 5,
		walletPoints: Number(p.points ?? 0)
	};
});
var searchJournalists_createServerFn_handler = createServerRpc({
	id: "85a69b0fa82aba24f7f596912ea912b9ee983194c4b1169716362810332f93cd",
	name: "searchJournalists",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => searchJournalists.__executeServer(opts));
var searchJournalists = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const query = String(data?.query ?? "").trim();
	if (query.length < 2) throw new Error("Enter at least 2 characters");
	return { query };
}).handler(searchJournalists_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const q = data.query;
	const isNumeric = /^\d+$/.test(q);
	let profiles;
	if (isNumeric) profiles = await query("SELECT id, display_name, public_user_id FROM profiles WHERE public_user_id LIKE ? LIMIT 12", [`${q}%`]);
	else profiles = await query("SELECT id, display_name, public_user_id FROM profiles WHERE display_name LIKE ? LIMIT 12", [`%${q}%`]);
	if (profiles.length === 0) return [];
	const ids = profiles.map((p) => p.id);
	const roles = await query(`SELECT user_id, role FROM user_roles WHERE user_id IN (${ids.map(() => "?").join(",")})`, ids);
	const bestRole = /* @__PURE__ */ new Map();
	const rank = {
		admin: 5,
		editor: 4,
		author: 3,
		journalist: 3,
		premium: 2,
		reader: 1
	};
	roles.forEach((r) => {
		const cur = bestRole.get(r.user_id);
		if (!cur || rank[r.role] > rank[cur]) bestRole.set(r.user_id, r.role);
	});
	return profiles.map((p) => {
		const role = bestRole.get(p.id) ?? "reader";
		return {
			userId: p.id,
			publicUserId: p.public_user_id,
			displayName: p.display_name,
			role,
			verified: JOURNALIST_ROLES.has(role)
		};
	});
});
var awardJournalistPoints_createServerFn_handler = createServerRpc({
	id: "a6002267c4d192ba76a3c675b580d90351bd78a0e67a36f81933b37bd786cf2e",
	name: "awardJournalistPoints",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => awardJournalistPoints.__executeServer(opts));
var awardJournalistPoints = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const publicUserId = String(data?.publicUserId ?? "").trim();
	const points = Math.floor(Number(data?.points));
	if (!/^\d{10}$/.test(publicUserId)) throw new Error("Invalid 10-digit User ID");
	if (!Number.isFinite(points) || points === 0) throw new Error("Enter a non-zero point amount");
	if (Math.abs(points) > 1e5) throw new Error("Amount too large (max ±100000)");
	return {
		publicUserId,
		points,
		reason: String(data?.reason ?? "").trim().slice(0, 200) || null
	};
}).handler(awardJournalistPoints_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	const profiles = await query("SELECT id, display_name, public_user_id, points FROM profiles WHERE public_user_id = ?", [data.publicUserId]);
	if (profiles.length === 0) throw new Error("Journalist not found");
	const p = profiles[0];
	const newBalance = Number(p.points ?? 0) + data.points;
	await query("UPDATE profiles SET points = ? WHERE id = ?", [newBalance, p.id]);
	return {
		publicUserId: p.public_user_id,
		displayName: p.display_name,
		awarded: data.points,
		newBalance
	};
});
function cleanText(v, max = 200) {
	const s = String(v ?? "").trim();
	return s ? s.slice(0, max) : null;
}
var upsertJournalist_createServerFn_handler = createServerRpc({
	id: "6ee862fc9a6e094cb784d2759dd3f559deb4caabd5b844a6255c1e2f7a255d25",
	name: "upsertJournalist",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => upsertJournalist.__executeServer(opts));
var upsertJournalist = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const email = String(data?.email ?? "").trim().toLowerCase();
	const displayName = String(data?.displayName ?? "").trim();
	if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email required");
	if (!displayName) throw new Error("Name is required");
	if (!data.userId && (!data.password || data.password.length < 8)) throw new Error("Password (min 8 chars) required for new journalists");
	return {
		userId: data.userId,
		email,
		password: data.password,
		displayName: displayName.slice(0, 100),
		phone: cleanText(data.phone, 40),
		bloodGroup: cleanText(data.bloodGroup, 8),
		dob: cleanText(data.dob, 40),
		validTill: cleanText(data.validTill, 40),
		fatherName: cleanText(data.fatherName, 255),
		motherName: cleanText(data.motherName, 255),
		gender: cleanText(data.gender, 50),
		maritalStatus: cleanText(data.maritalStatus, 50),
		husbandName: data.gender === "Female" && data.maritalStatus === "Married" ? cleanText(data.husbandName, 255) : null,
		documentType: cleanText(data.documentType, 100),
		documentUrl: data.documentUrl ? String(data.documentUrl).trim() : void 0,
		address: cleanText(data.address, 300),
		state: cleanText(data.state, 80),
		country: cleanText(data.country, 80),
		pinCode: cleanText(data.pinCode, 20),
		avatarUrl: cleanText(data.avatarUrl, 500),
		articlesPublished: Number.isFinite(data.articlesPublished) ? Math.max(0, Math.floor(Number(data.articlesPublished))) : void 0,
		points: Number.isFinite(data.points) ? Math.max(0, Math.floor(Number(data.points))) : void 0,
		active: typeof data.active === "boolean" ? data.active : void 0
	};
}).handler(upsertJournalist_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	let userId = data.userId ?? "";
	if (!userId) {
		if ((await query("SELECT id FROM users WHERE email = ?", [data.email])).length > 0) throw new Error("User with this email already exists");
		userId = crypto.randomUUID();
		const salt = crypto.randomBytes(16).toString("hex");
		const passHash = hashPassword(data.password, salt);
		await query("INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)", [
			userId,
			data.email,
			passHash,
			salt,
			data.displayName
		]);
		await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
			crypto.randomUUID(),
			userId,
			"journalist"
		]);
		let publicUserId = "";
		for (let i = 0; i < 50; i++) {
			publicUserId = (1 + Math.floor(Math.random() * 9)).toString() + Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
			if ((await query("SELECT id FROM profiles WHERE public_user_id = ?", [publicUserId])).length === 0) break;
		}
		if (!publicUserId) publicUserId = crypto.randomBytes(5).toString("hex");
		const journalistId = await generateJournalistId();
		const savedDocUrl = data.documentUrl ? data.documentUrl.startsWith("data:image/") ? persistDocumentImage(data.documentUrl, "doc") : data.documentUrl : null;
		await query(`INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id, phone, blood_group, dob, valid_till, father_name, mother_name, gender, marital_status, husband_name, document_type, document_url, address, state, country, pin_code, avatar_url, articles_published, points) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			userId,
			publicUserId,
			data.displayName,
			data.email,
			true,
			journalistId,
			data.phone,
			data.bloodGroup,
			data.dob,
			data.validTill,
			data.fatherName,
			data.motherName,
			data.gender,
			data.maritalStatus,
			data.husbandName,
			data.documentType ?? null,
			savedDocUrl,
			data.address,
			data.state,
			data.country,
			data.pinCode,
			data.avatarUrl,
			data.articlesPublished || 0,
			data.points || 0
		]);
	} else {
		if (data.password) {
			const salt = crypto.randomBytes(16).toString("hex");
			await query("UPDATE users SET password_hash = ?, salt = ?, email = ? WHERE id = ?", [
				hashPassword(data.password, salt),
				salt,
				data.email,
				userId
			]);
		} else await query("UPDATE users SET email = ? WHERE id = ?", [data.email, userId]);
		const savedDocUrl = data.documentUrl ? data.documentUrl.startsWith("data:image/") ? persistDocumentImage(data.documentUrl, "doc") : data.documentUrl : data.documentUrl;
		const patch = {
			display_name: data.displayName,
			email: data.email,
			phone: data.phone,
			blood_group: data.bloodGroup,
			dob: data.dob,
			valid_till: data.validTill,
			father_name: data.fatherName,
			mother_name: data.motherName,
			gender: data.gender,
			marital_status: data.maritalStatus,
			husband_name: data.husbandName,
			address: data.address,
			state: data.state,
			country: data.country,
			pin_code: data.pinCode
		};
		if (data.documentType !== void 0) patch.document_type = data.documentType;
		if (savedDocUrl !== void 0) patch.document_url = savedDocUrl;
		if (data.avatarUrl !== null) patch.avatar_url = data.avatarUrl;
		if (typeof data.articlesPublished === "number") patch.articles_published = data.articlesPublished;
		if (typeof data.points === "number") patch.points = data.points;
		if (typeof data.active === "boolean") patch.active = data.active ? 1 : 0;
		const keys = Object.keys(patch);
		await query(`UPDATE profiles SET ${keys.map((k) => `${k.replace(/([A-Z])/g, "_$1").toLowerCase()} = ?`).join(", ")} WHERE id = ?`, [...keys.map((k) => patch[k]), userId]);
		const profs = await query("SELECT journalist_id FROM profiles WHERE id = ?", [userId]);
		if (profs.length > 0 && !profs[0].journalist_id) await query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [await generateJournalistId(), userId]);
	}
	return {
		ok: true,
		userId
	};
});
var setJournalistActive_createServerFn_handler = createServerRpc({
	id: "65600bf083ec71d5df1045a46b6e8e2965c827f1fa1a8b147499ee9ddedc3bbe",
	name: "setJournalistActive",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => setJournalistActive.__executeServer(opts));
var setJournalistActive = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data?.userId) throw new Error("userId required");
	return {
		userId: String(data.userId),
		active: !!data.active
	};
}).handler(setJournalistActive_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	await query("UPDATE profiles SET active = ? WHERE id = ?", [data.active, data.userId]);
	return { ok: true };
});
var deleteJournalist_createServerFn_handler = createServerRpc({
	id: "038d145f9e0f2fc7deb5d774c689275e369c15a619a4098bc7ba48b9425491b3",
	name: "deleteJournalist",
	filename: "src/lib/journalist.functions.ts"
}, (opts) => deleteJournalist.__executeServer(opts));
var deleteJournalist = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data?.userId) throw new Error("userId required");
	return { userId: String(data.userId) };
}).handler(deleteJournalist_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.userId);
	if (data.userId === context.userId) throw new Error("You cannot delete yourself");
	await query("DELETE FROM users WHERE id = ?", [data.userId]);
	return { ok: true };
});
//#endregion
export { awardJournalistPoints_createServerFn_handler, deleteJournalist_createServerFn_handler, getJournalistPrivateStats_createServerFn_handler, listJournalists_createServerFn_handler, lookupJournalist_createServerFn_handler, searchJournalists_createServerFn_handler, setJournalistActive_createServerFn_handler, upsertJournalist_createServerFn_handler };

//# sourceMappingURL=journalist.functions-Blnx0qV7.js.map