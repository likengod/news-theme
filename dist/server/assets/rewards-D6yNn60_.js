import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-KusBKFrP.js";
import { t as requireAuth } from "./auth-middleware-LOdLQKQi.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/rewards.ts?tss-serverfn-split
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
var getRewardsServer_createServerFn_handler = createServerRpc({
	id: "4fa6f5bc37fef053d73e12215a610604a3727a81c4d2685fff68092276b1b89b",
	name: "getRewardsServer",
	filename: "src/lib/rewards.ts"
}, (opts) => getRewardsServer.__executeServer(opts));
var getRewardsServer = createServerFn({ method: "GET" }).handler(getRewardsServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'rewards_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) return mergeDefaults(parsed);
		}
	} catch {}
	return DEFAULT_REWARDS;
});
var saveRewardsServer_createServerFn_handler = createServerRpc({
	id: "3680d7ceec851db2d9971fd03a526ac19102d718a3bfc6d25320ac29524d8bdc",
	name: "saveRewardsServer",
	filename: "src/lib/rewards.ts"
}, (opts) => saveRewardsServer.__executeServer(opts));
var saveRewardsServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((groups) => groups).handler(saveRewardsServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('rewards_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return { success: true };
});
//#endregion
export { getRewardsServer_createServerFn_handler, saveRewardsServer_createServerFn_handler };
