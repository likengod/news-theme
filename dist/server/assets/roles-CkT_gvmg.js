import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-k2NOd45F.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
//#region src/lib/roles.ts
var VIEWER_KEY = "nt:viewer-role";
var KEY = "ne_roles_v1";
var ROLE_COLORS = [
	"violet",
	"blue",
	"emerald",
	"amber",
	"slate",
	"rose",
	"sky"
];
var roleBadgeClass = (color) => {
	const map = {
		violet: "bg-violet-50 text-violet-700 border-violet-200",
		blue: "bg-blue-50 text-blue-700 border-blue-200",
		emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
		amber: "bg-amber-50 text-amber-800 border-amber-200",
		slate: "bg-slate-100 text-slate-700 border-slate-200",
		rose: "bg-rose-50 text-rose-700 border-rose-200",
		sky: "bg-sky-50 text-sky-700 border-sky-200"
	};
	return map[color] ?? map.slate;
};
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
var getRolesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("44c2b244a154cd9bc6306696fd578a3756f03ae68ae423ffb59681668e80655c"));
var saveRolesServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((roles) => roles).handler(createSsrRpc("5c8cf393ab6d7dc22b596958c14fc70206128b2d1b8f92272c11ce262e738bcb"));
var upgradeToPremiumServer = createServerFn({ method: "POST" }).middleware([requireAuth]).handler(createSsrRpc("afb7555d6a34adc5b0e662eb11f4a7f6971738589c83e37b63b29ef9bf924cb1"));
function loadRoles() {
	if (typeof window === "undefined") return DEFAULTS;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULTS;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length ? mergeBuiltins(parsed) : DEFAULTS;
	} catch {
		return DEFAULTS;
	}
}
function saveRoles(roles) {
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(roles));
	saveRolesServer({ data: roles }).catch(() => {});
}
var slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
/** Get the current viewer's role id (demo: localStorage override, default 'reader'). */
function getCurrentRoleId() {
	if (typeof window === "undefined") return "reader";
	return localStorage.getItem(VIEWER_KEY) || "reader";
}
function setCurrentRoleId(id) {
	if (typeof window === "undefined") return;
	localStorage.setItem(VIEWER_KEY, id);
}
/** Whether the current viewer's role is configured to see popup ads. */
function currentRoleSeesPopups() {
	const id = getCurrentRoleId();
	return loadRoles().find((r) => r.id === id)?.seesPopupAds ?? true;
}
//#endregion
export { loadRoles as a, saveRolesServer as c, upgradeToPremiumServer as d, getRolesServer as i, setCurrentRoleId as l, currentRoleSeesPopups as n, roleBadgeClass as o, getCurrentRoleId as r, saveRoles as s, ROLE_COLORS as t, slugify as u };
