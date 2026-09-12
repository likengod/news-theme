import { i as createServerFn } from "./esm-Dova13aH.js";
import { I as createSsrRpc } from "./site-content-CKhGm4KQ.js";
import { t as requireAuth } from "./auth-middleware-DY2CGsEm.js";
//#region src/lib/journalist-ranks.ts
var KEY = "nt:journalist-ranks:v1";
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
var getJournalistRanksServer = createServerFn({ method: "GET" }).handler(createSsrRpc("867f8fd34f32acecfe9ec627f5b33ef8762a5eabab40b2b297e14b09e6fd5382"));
var saveJournalistRanksServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((ranks) => ranks).handler(createSsrRpc("35a302f18de1d0793e7e730eeef2831b0cc516d86513b175f171d21a439cfea8"));
function loadRanks() {
	if (typeof window === "undefined") return DEFAULT_RANKS;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULT_RANKS;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_RANKS;
		return [...parsed].sort((a, b) => a.minNews - b.minNews);
	} catch {
		return DEFAULT_RANKS;
	}
}
function saveRanks(ranks) {
	if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(ranks));
	saveJournalistRanksServer({ data: ranks }).catch(() => {});
}
/** Highest rank whose threshold is met by `published`, or null if below all. */
function rankForCount(published, ranks = loadRanks()) {
	const sorted = [...ranks].sort((a, b) => a.minNews - b.minNews);
	let match = null;
	for (const r of sorted) if (published >= r.minNews) match = r;
	return match;
}
/** Next rank above the current one, for progress display. */
function nextRank(published, ranks = loadRanks()) {
	return [...ranks].sort((a, b) => a.minNews - b.minNews).find((r) => published < r.minNews) ?? null;
}
//#endregion
export { saveRanks as a, rankForCount as i, loadRanks as n, nextRank as r, getJournalistRanksServer as t };

//# sourceMappingURL=journalist-ranks-DnNsIOna.js.map