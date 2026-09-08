import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/roles.ts?tss-serverfn-split
var DEFAULTS = [
	{
		id: "admin",
		name: "Admin",
		description: "Full access to every admin tool and setting.",
		color: "violet",
		builtin: true,
		seesPopupAds: false
	},
	{
		id: "editor",
		name: "Editor",
		description: "Can publish and edit any article.",
		color: "blue",
		builtin: true,
		seesPopupAds: false
	},
	{
		id: "author",
		name: "Author",
		description: "Can write and submit own articles.",
		color: "emerald",
		builtin: true,
		seesPopupAds: false
	},
	{
		id: "journalist",
		name: "Journalist",
		description: "Verified journalist who reports and submits news.",
		color: "sky",
		builtin: true,
		seesPopupAds: false
	},
	{
		id: "premium",
		name: "Premium user",
		description: "Paid reader with access to premium articles and ad-free reading.",
		color: "amber",
		builtin: true,
		seesPopupAds: false
	},
	{
		id: "reader",
		name: "Reader",
		description: "Default signed-in visitor.",
		color: "slate",
		builtin: true,
		seesPopupAds: true
	}
];
function mergeBuiltins(roles) {
	const byId = new Map(roles.map((r) => [r.id, r]));
	for (const def of DEFAULTS) {
		const existing = byId.get(def.id);
		if (!existing) byId.set(def.id, def);
		else byId.set(def.id, {
			...existing,
			builtin: true
		});
	}
	return Array.from(byId.values());
}
var getRolesServer_createServerFn_handler = createServerRpc({
	id: "44c2b244a154cd9bc6306696fd578a3756f03ae68ae423ffb59681668e80655c",
	name: "getRolesServer",
	filename: "src/lib/roles.ts"
}, (opts) => getRolesServer.__executeServer(opts));
var getRolesServer = createServerFn({ method: "GET" }).handler(getRolesServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'user_roles_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) return mergeBuiltins(parsed);
		}
	} catch {}
	return DEFAULTS;
});
var saveRolesServer_createServerFn_handler = createServerRpc({
	id: "5c8cf393ab6d7dc22b596958c14fc70206128b2d1b8f92272c11ce262e738bcb",
	name: "saveRolesServer",
	filename: "src/lib/roles.ts"
}, (opts) => saveRolesServer.__executeServer(opts));
var saveRolesServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((roles) => roles).handler(saveRolesServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('user_roles_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return { success: true };
});
var upgradeToPremiumServer_createServerFn_handler = createServerRpc({
	id: "afb7555d6a34adc5b0e662eb11f4a7f6971738589c83e37b63b29ef9bf924cb1",
	name: "upgradeToPremiumServer",
	filename: "src/lib/roles.ts"
}, (opts) => upgradeToPremiumServer.__executeServer(opts));
var upgradeToPremiumServer = createServerFn({ method: "POST" }).middleware([requireAuth]).handler(upgradeToPremiumServer_createServerFn_handler, async ({ context }) => {
	const [rows] = await query("SELECT role FROM user_roles WHERE user_id = ?", [context.userId]);
	const currentRole = rows?.[0]?.role || "reader";
	if ([
		"admin",
		"editor",
		"journalist",
		"author",
		"premium"
	].includes(currentRole)) return {
		success: true,
		message: "Already have equal or higher privileges."
	};
	await query("DELETE FROM user_roles WHERE user_id = ?", [context.userId]);
	await query("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'premium')", [context.userId]);
	return { success: true };
});
//#endregion
export { getRolesServer_createServerFn_handler, saveRolesServer_createServerFn_handler, upgradeToPremiumServer_createServerFn_handler };
