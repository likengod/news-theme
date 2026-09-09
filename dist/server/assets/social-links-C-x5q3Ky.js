import { i as createServerFn } from "./esm-Dova13aH.js";
import { k as createSsrRpc } from "./site-content-D1ESx2fQ.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
//#region src/lib/rewards.ts
var KEY = "nt:rewards:v1";
var uid = () => Math.random().toString(36).slice(2, 9);
var DEFAULT_REWARDS = [
	{
		roleId: "all",
		label: "All users",
		enabled: true,
		note: "One-time tasks available to every earning user.",
		oneTime: [
			{
				id: "signup",
				title: "Create an account",
				points: 25
			},
			{
				id: "yt",
				title: "Subscribe our YouTube channel",
				points: 25
			},
			{
				id: "fb",
				title: "Like & follow us on Facebook",
				points: 20
			},
			{
				id: "ig",
				title: "Follow us on Instagram",
				points: 20
			},
			{
				id: "wa",
				title: "Join our WhatsApp channel",
				points: 25
			}
		],
		recurring: []
	},
	{
		roleId: "reader",
		label: "Reader",
		enabled: true,
		oneTime: [],
		recurring: [{
			id: "r_share",
			title: "Share news",
			reward: "₹0.20 per share",
			cap: "up to ₹1 / day"
		}, {
			id: "r_comment",
			title: "Comment on unique articles (after first time)",
			reward: "₹0.50 per unique article",
			cap: "up to ₹2 / day"
		}]
	},
	{
		roleId: "premium",
		label: "Premium user",
		enabled: true,
		oneTime: [],
		recurring: [{
			id: "p_share",
			title: "Share news",
			reward: "₹0.40 per share",
			cap: "up to ₹2 / day"
		}, {
			id: "p_comment",
			title: "Comment on unique articles (after first time)",
			reward: "₹0.1 per unique article",
			cap: "up to ₹4 / day"
		}]
	},
	{
		roleId: "journalist",
		label: "Journalist",
		enabled: true,
		note: "Journalists earn points per published news based on their rank. Set points and thresholds below.",
		oneTime: [],
		recurring: []
	}
];
function mergeDefaults(groups) {
	const cleanGroups = groups.map((g) => {
		if (g.roleId === "journalist") return {
			...g,
			note: "Journalists earn points per published news based on their rank. Set points and thresholds below.",
			recurring: g.recurring.filter((r) => r.id !== "j_publish")
		};
		return g;
	});
	const byId = new Map(cleanGroups.map((g) => [g.roleId, g]));
	for (const def of DEFAULT_REWARDS) if (!byId.has(def.roleId)) byId.set(def.roleId, def);
	return Array.from(byId.values());
}
var getRewardsServer = createServerFn({ method: "GET" }).handler(createSsrRpc("4fa6f5bc37fef053d73e12215a610604a3727a81c4d2685fff68092276b1b89b"));
var saveRewardsServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((groups) => groups).handler(createSsrRpc("3680d7ceec851db2d9971fd03a526ac19102d718a3bfc6d25320ac29524d8bdc"));
function loadRewards() {
	if (typeof window === "undefined") return DEFAULT_REWARDS;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULT_REWARDS;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length ? mergeDefaults(parsed) : DEFAULT_REWARDS;
	} catch {
		return DEFAULT_REWARDS;
	}
}
function saveRewards(groups) {
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(groups));
	saveRewardsServer({ data: groups }).catch(() => {});
}
var newRecurring = () => ({
	id: uid(),
	title: "",
	reward: "",
	cap: "",
	rank: "all"
});
var newOneTime = () => ({
	id: uid(),
	title: "",
	points: 0,
	rank: "all"
});
//#endregion
//#region src/lib/pending-claims.ts
var PENDING_CLAIMS_KEY = "nt:pending-social-claims:v1";
function loadAllPendingClaims() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(PENDING_CLAIMS_KEY);
		if (raw) return JSON.parse(raw);
	} catch {}
	return [];
}
function saveAllPendingClaims(claims) {
	localStorage.setItem(PENDING_CLAIMS_KEY, JSON.stringify(claims));
}
function getClaimsForUser(userId) {
	return loadAllPendingClaims().filter((c) => c.userId === userId);
}
function upsertClaim(claim) {
	const all = loadAllPendingClaims();
	const idx = all.findIndex((c) => c.userId === claim.userId && c.id === claim.id);
	if (idx >= 0) all[idx] = claim;
	else all.push(claim);
	saveAllPendingClaims(all);
}
var getPendingClaimsServer = createServerFn({ method: "GET" }).handler(createSsrRpc("2480919bc2e170d233713b1c2830944913d8799c4dcb5c1adeca1e419a19f7a6"));
var updateClaimStatusServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(createSsrRpc("cc59c9c287ab31b02d5dd933dfcae74b25340d1c5e5cf66e469416924854aa55"));
function updateClaimStatus(userId, claimId, status) {
	const all = loadAllPendingClaims();
	const claim = all.find((c) => c.userId === userId && c.id === claimId);
	if (!claim) return null;
	claim.status = status;
	saveAllPendingClaims(all);
	updateClaimStatusServer({ data: {
		userId,
		claimId,
		status,
		points: claim.points
	} }).catch(() => {});
	return claim;
}
//#endregion
//#region src/lib/social-links.ts
var SOCIAL_LINKS_KEY = "nt:admin:social-links:v1";
var DEFAULT_SOCIAL_LINKS = {
	facebook: "",
	youtube: "",
	instagram: "",
	whatsapp: ""
};
function loadSocialLinks() {
	if (typeof window === "undefined") return DEFAULT_SOCIAL_LINKS;
	try {
		const raw = localStorage.getItem(SOCIAL_LINKS_KEY);
		if (raw) return {
			...DEFAULT_SOCIAL_LINKS,
			...JSON.parse(raw)
		};
	} catch {}
	return DEFAULT_SOCIAL_LINKS;
}
function saveSocialLinks(links) {
	localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(links));
}
//#endregion
export { loadAllPendingClaims as a, getRewardsServer as c, newRecurring as d, saveRewards as f, getPendingClaimsServer as i, loadRewards as l, saveSocialLinks as n, updateClaimStatus as o, getClaimsForUser as r, upsertClaim as s, loadSocialLinks as t, newOneTime as u };
