import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/journalist-ranks.ts?tss-serverfn-split
var DEFAULT_RANKS = [
	{
		id: "bronze",
		name: "Bronze",
		minNews: 100,
		pointsPerNews: 10,
		color: "amber",
		builtin: true
	},
	{
		id: "silver",
		name: "Silver",
		minNews: 500,
		pointsPerNews: 20,
		color: "slate",
		builtin: true
	},
	{
		id: "gold",
		name: "Gold",
		minNews: 1e3,
		pointsPerNews: 30,
		color: "amber",
		builtin: true
	},
	{
		id: "diamond",
		name: "Diamond",
		minNews: 8e3,
		pointsPerNews: 50,
		color: "sky",
		builtin: true
	}
];
var getJournalistRanksServer_createServerFn_handler = createServerRpc({
	id: "867f8fd34f32acecfe9ec627f5b33ef8762a5eabab40b2b297e14b09e6fd5382",
	name: "getJournalistRanksServer",
	filename: "src/lib/journalist-ranks.ts"
}, (opts) => getJournalistRanksServer.__executeServer(opts));
var getJournalistRanksServer = createServerFn({ method: "GET" }).handler(getJournalistRanksServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'journalist_ranks_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) return [...parsed].sort((a, b) => a.minNews - b.minNews);
		}
	} catch {}
	return DEFAULT_RANKS;
});
var saveJournalistRanksServer_createServerFn_handler = createServerRpc({
	id: "35a302f18de1d0793e7e730eeef2831b0cc516d86513b175f171d21a439cfea8",
	name: "saveJournalistRanksServer",
	filename: "src/lib/journalist-ranks.ts"
}, (opts) => saveJournalistRanksServer.__executeServer(opts));
var saveJournalistRanksServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((ranks) => ranks).handler(saveJournalistRanksServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('journalist_ranks_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return { success: true };
});
//#endregion
export { getJournalistRanksServer_createServerFn_handler, saveJournalistRanksServer_createServerFn_handler };
