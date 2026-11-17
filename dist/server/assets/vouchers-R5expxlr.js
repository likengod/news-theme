import { i as createServerFn } from "./server-B_aptaj-.js";
import { c as query } from "./db.server-Bwn3VlXQ.js";
import { t as requireAdmin } from "./auth-middleware-BiPoMWjc.js";
import { t as attachAuth } from "./auth-attacher-B9vIVJlg.js";
import { t as createServerRpc } from "./createServerRpc-BOGxQwAd.js";
// src/lib/vouchers.ts?tss-serverfn-split
var DEFAULT_VOUCHERS = [
	{
		id: "premium6m",
		title: "Premium User — 6 Months Free",
		cost: 0,
		tag: "Featured",
		icon: "Crown",
		color: "amber",
		featured: true,
		freeUnlock: true,
		enabled: true
	},
	{
		id: "recharge299",
		title: "Phone Recharge ₹299",
		cost: 299,
		tag: "Mobile",
		icon: "Smartphone",
		color: "sky",
		enabled: true
	},
	{
		id: "flipkart500",
		title: "Flipkart Wallet ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "indigo",
		enabled: true
	},
	{
		id: "amazon500",
		title: "Amazon Gift Card ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "orange",
		enabled: true
	},
	{
		id: "swiggy500",
		title: "Swiggy Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "rose",
		enabled: true
	},
	{
		id: "zomato500",
		title: "Zomato Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "red",
		enabled: true
	}
];
var getVouchersServer_createServerFn_handler = createServerRpc({
	id: "105ca7e7b1d584c04f0813d16b8f7af6a70178c783d3de71ac0946d4856e635f",
	name: "getVouchersServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => getVouchersServer.__executeServer(opts));
var getVouchersServer = createServerFn({ method: "GET" }).handler(getVouchersServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
		if (rows && rows.length > 0 && rows[0].value) {
			const parsed = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch (err) {
		console.warn("[Vouchers] Failed to load vouchers from DB:", err);
	}
	return DEFAULT_VOUCHERS;
});
var saveVouchersServer_createServerFn_handler = createServerRpc({
	id: "1539d254a416960ca6a8b71c55a32c7b8855be361861d42ae6be5767df9beb7a",
	name: "saveVouchersServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => saveVouchersServer.__executeServer(opts));
var saveVouchersServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((vouchers) => vouchers).handler(saveVouchersServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return { success: true };
});
export { getVouchersServer_createServerFn_handler, saveVouchersServer_createServerFn_handler };

//# sourceMappingURL=vouchers-R5expxlr.js.map