import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-Chz3iTW3.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/pending-claims.ts?tss-serverfn-split
var getPendingClaimsServer_createServerFn_handler = createServerRpc({
	id: "2480919bc2e170d233713b1c2830944913d8799c4dcb5c1adeca1e419a19f7a6",
	name: "getPendingClaimsServer",
	filename: "src/lib/pending-claims.ts"
}, (opts) => getPendingClaimsServer.__executeServer(opts));
var getPendingClaimsServer = createServerFn({ method: "GET" }).handler(getPendingClaimsServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'social_claims_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch {}
	return [];
});
var updateClaimStatusServer_createServerFn_handler = createServerRpc({
	id: "cc59c9c287ab31b02d5dd933dfcae74b25340d1c5e5cf66e469416924854aa55",
	name: "updateClaimStatusServer",
	filename: "src/lib/pending-claims.ts"
}, (opts) => updateClaimStatusServer.__executeServer(opts));
var updateClaimStatusServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => data).handler(updateClaimStatusServer_createServerFn_handler, async ({ data }) => {
	const { userId, claimId, status, points = 0 } = data;
	let claims = [];
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'social_claims_data'");
		if (rows.length > 0 && rows[0].value) claims = JSON.parse(rows[0].value);
	} catch {}
	const claim = claims.find((c) => c.id === claimId || c.userId === userId && c.platform === claimId);
	if (claim) claim.status = status;
	const json = JSON.stringify(claims);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('social_claims_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	if (status === "approved" && points > 0 && userId) await query("UPDATE profiles SET points = COALESCE(points, 0) + ? WHERE id = ?", [points, userId]);
	return {
		success: true,
		status
	};
});
//#endregion
export { getPendingClaimsServer_createServerFn_handler, updateClaimStatusServer_createServerFn_handler };

//# sourceMappingURL=pending-claims-BBULnwHP.js.map