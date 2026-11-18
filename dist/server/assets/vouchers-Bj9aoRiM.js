import { i as createServerFn } from "./server-DL9zr2xn.js";
import { c as query } from "./db.server-BFj0NMl2.js";
import { t as requireAdmin } from "./auth-middleware-Bg4VzwAa.js";
import { t as attachAuth } from "./auth-attacher-CfkwdFwb.js";
import { t as createServerRpc } from "./createServerRpc-SlDstHLL.js";
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
		enabled: true,
		stockType: "unlimited",
		expiryDays: 180,
		description: "Instant 6 months full access to all exclusive stories, audio articles, and ad-free experience."
	},
	{
		id: "recharge299",
		title: "Phone Recharge ₹299",
		cost: 299,
		tag: "Mobile",
		icon: "Smartphone",
		color: "sky",
		enabled: true,
		stockType: "limited",
		stock: 50,
		expiryDays: 30,
		description: "Mobile recharge voucher valid for Jio, Airtel, Vi, and BSNL numbers across India."
	},
	{
		id: "flipkart500",
		title: "Flipkart Wallet ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "indigo",
		enabled: true,
		stockType: "limited",
		stock: 30,
		expiryDays: 60,
		description: "Digital Flipkart gift card code sent to your wallet. Redeem on Flipkart for any item."
	},
	{
		id: "amazon500",
		title: "Amazon Gift Card ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "orange",
		enabled: true,
		stockType: "limited",
		stock: 40,
		expiryDays: 60,
		description: "Amazon Pay gift voucher balance redeemable on amazon.in shopping and bill payments."
	},
	{
		id: "swiggy500",
		title: "Swiggy Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "rose",
		enabled: true,
		stockType: "limited",
		stock: 25,
		expiryDays: 30,
		description: "Swiggy food delivery and Instamart balance voucher code."
	},
	{
		id: "zomato500",
		title: "Zomato Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "red",
		enabled: true,
		stockType: "limited",
		stock: 25,
		expiryDays: 30,
		description: "Zomato online food order discount card."
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
var redeemVoucherServer_createServerFn_handler = createServerRpc({
	id: "ec22cfc650bcccf39d54345d7c01cf8bd55477a24b28827ad4402b7a07eed6f5",
	name: "redeemVoucherServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => redeemVoucherServer.__executeServer(opts));
var redeemVoucherServer = createServerFn({ method: "POST" }).validator((d) => d).handler(redeemVoucherServer_createServerFn_handler, async ({ data }) => {
	const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
	let vouchers = DEFAULT_VOUCHERS;
	if (rows && rows.length > 0 && rows[0].value) try {
		vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
	} catch {}
	const vIndex = vouchers.findIndex((item) => item.id === data.voucherId);
	if (vIndex === -1) throw new Error("Voucher not found");
	const v = vouchers[vIndex];
	if (v.enabled === false) throw new Error("This voucher is currently inactive");
	if (v.stockType === "limited" && typeof v.stock === "number" && v.stock <= 0) throw new Error("Sorry, this voucher is out of stock!");
	let codeToDeliver = "";
	if (v.stockType === "codes_pool") {
		v.codesPool = v.codesPool || [];
		if (v.codesPool.length === 0) throw new Error("Sorry, all promo codes for this voucher have been claimed!");
		codeToDeliver = v.codesPool.shift().trim();
		v.stock = v.codesPool.length;
	} else if (v.stockType === "limited" && typeof v.stock === "number") {
		v.stock = Math.max(0, v.stock - 1);
		codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
	} else codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
	const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
	const expiresAt = new Date(Date.now() + days * 864e5).toISOString();
	const record = {
		code: codeToDeliver,
		userId: data.userId || "anonymous",
		userName: data.userName,
		userEmail: data.userEmail,
		claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
		voucherId: v.id,
		voucherTitle: v.title,
		discountDescription: v.description || "",
		status: "active",
		expiresAt
	};
	v.claimedCodes = v.claimedCodes || [];
	v.claimedCodes.push(record);
	const json = JSON.stringify(vouchers);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return {
		success: true,
		code: codeToDeliver,
		record,
		expiresAt,
		voucherTitle: v.title,
		remainingStock: v.stockType === "codes_pool" ? v.codesPool?.length : v.stock,
		vouchers
	};
});
var verifyPromoCodeServer_createServerFn_handler = createServerRpc({
	id: "3ee0cc9a0744ceec31c2149b7b7bd76cc09522e051ce52257a6c2ffea6f51e76",
	name: "verifyPromoCodeServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => verifyPromoCodeServer.__executeServer(opts));
var verifyPromoCodeServer = createServerFn({ method: "POST" }).validator((d) => d).handler(verifyPromoCodeServer_createServerFn_handler, async ({ data }) => {
	const rawCode = (data.code || "").trim();
	if (!rawCode) return {
		status: "invalid",
		message: "Please provide a valid promo code."
	};
	const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
	let vouchers = DEFAULT_VOUCHERS;
	if (rows && rows.length > 0 && rows[0].value) try {
		vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
	} catch {}
	const searchCode = rawCode.toUpperCase();
	for (const v of vouchers) if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
		const found = v.claimedCodes.find((c) => c.code.trim().toUpperCase() === searchCode);
		if (found) {
			const voucherInfo = {
				id: v.id,
				title: v.title,
				tag: v.tag,
				color: v.color,
				icon: v.icon,
				description: v.description
			};
			if (found.status === "used_in_store") return {
				status: "already_used",
				record: found,
				voucher: voucherInfo,
				message: `This promo code was ALREADY REDEEMED on ${found.usedAt ? new Date(found.usedAt).toLocaleString() : "previously"} at ${found.usedByStoreName || "Partner Store"}. It cannot be reused!`
			};
			if (found.expiresAt && /* @__PURE__ */ new Date() > new Date(found.expiresAt)) {
				const expDate = new Date(found.expiresAt).toLocaleDateString();
				return {
					status: "expired",
					record: {
						...found,
						status: "expired"
					},
					voucher: voucherInfo,
					message: `This promo code expired on ${expDate}. It is no longer valid for store redemption.`
				};
			}
			return {
				status: "valid",
				record: found,
				voucher: voucherInfo,
				message: "Promo code verified! Ready to apply store discount."
			};
		}
	}
	for (const v of vouchers) if (v.codesPool && Array.isArray(v.codesPool)) {
		if (v.codesPool.some((c) => c.trim().toUpperCase() === searchCode)) {
			const voucherInfo = {
				id: v.id,
				title: v.title,
				tag: v.tag,
				color: v.color,
				icon: v.icon,
				description: v.description
			};
			const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
			return {
				status: "valid",
				record: {
					code: searchCode,
					userId: "direct_store_customer",
					userName: "Direct Customer",
					claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
					voucherId: v.id,
					voucherTitle: v.title,
					discountDescription: v.description || "",
					status: "active",
					expiresAt: new Date(Date.now() + days * 864e5).toISOString()
				},
				voucher: voucherInfo,
				message: `Promo code verified! Ready to apply store discount for "${v.title}".`
			};
		}
	}
	return {
		status: "invalid",
		message: `Invalid promo code "${rawCode}". No matching record or active inventory found.`
	};
});
var claimPromoCodeInStoreServer_createServerFn_handler = createServerRpc({
	id: "26590cadb59750adefb2c14d439eb641fe46bf6c72f5fce7ef595814bd61825e",
	name: "claimPromoCodeInStoreServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => claimPromoCodeInStoreServer.__executeServer(opts));
var claimPromoCodeInStoreServer = createServerFn({ method: "POST" }).validator((d) => d).handler(claimPromoCodeInStoreServer_createServerFn_handler, async ({ data }) => {
	const rawCode = (data.code || "").trim();
	if (!rawCode) throw new Error("Promo code is required");
	const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
	let vouchers = DEFAULT_VOUCHERS;
	if (rows && rows.length > 0 && rows[0].value) try {
		vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
	} catch {}
	const searchCode = rawCode.toUpperCase();
	let targetVoucher = null;
	let targetRecord = null;
	for (const v of vouchers) if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
		const found = v.claimedCodes.find((c) => c.code.trim().toUpperCase() === searchCode);
		if (found) {
			targetVoucher = v;
			targetRecord = found;
			break;
		}
	}
	if (!targetRecord) {
		for (const v of vouchers) if (v.codesPool && Array.isArray(v.codesPool)) {
			const poolIndex = v.codesPool.findIndex((c) => c.trim().toUpperCase() === searchCode);
			if (poolIndex !== -1) {
				v.codesPool.splice(poolIndex, 1);
				v.stock = v.codesPool.length;
				const nowIso = (/* @__PURE__ */ new Date()).toISOString();
				const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
				const newRecord = {
					code: searchCode,
					userId: "direct_store_customer",
					userName: "Direct Customer",
					claimedAt: nowIso,
					voucherId: v.id,
					voucherTitle: v.title,
					discountDescription: v.description || "",
					status: "used_in_store",
					usedAt: nowIso,
					usedByStoreName: (data.storeName || "").trim() || "Local Partner Store",
					expiresAt: new Date(Date.now() + days * 864e5).toISOString()
				};
				v.claimedCodes = v.claimedCodes || [];
				v.claimedCodes.push(newRecord);
				targetVoucher = v;
				targetRecord = newRecord;
				break;
			}
		}
	}
	if (!targetRecord || !targetVoucher) throw new Error(`Promo code "${rawCode}" not found in inventory.`);
	if (targetRecord.status === "used_in_store") {
		const usedDate = targetRecord.usedAt ? new Date(targetRecord.usedAt).toLocaleString() : "previously";
		throw new Error(`This code was ALREADY REDEEMED on ${usedDate} at ${targetRecord.usedByStoreName || "Store"}. Duplicate redemptions are strictly blocked!`);
	}
	if (targetRecord.expiresAt && /* @__PURE__ */ new Date() > new Date(targetRecord.expiresAt)) throw new Error(`This promo code has expired on ${new Date(targetRecord.expiresAt).toLocaleDateString()}!`);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	targetRecord.status = "used_in_store";
	targetRecord.usedAt = nowIso;
	targetRecord.usedByStoreName = (data.storeName || "").trim() || "Local Partner Store";
	const json = JSON.stringify(vouchers);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return {
		success: true,
		message: `Promo code successfully verified and marked as used! Discount granted at ${targetRecord.usedByStoreName}.`,
		record: targetRecord,
		voucherTitle: targetVoucher.title
	};
});
var getUserClaimedVouchersServer_createServerFn_handler = createServerRpc({
	id: "1c66f6c298d50f6878d50ce5fcfeb86ad6ae2aad2f087d9d9460aef476840273",
	name: "getUserClaimedVouchersServer",
	filename: "src/lib/vouchers.ts"
}, (opts) => getUserClaimedVouchersServer.__executeServer(opts));
var getUserClaimedVouchersServer = createServerFn({ method: "POST" }).validator((d) => d).handler(getUserClaimedVouchersServer_createServerFn_handler, async ({ data }) => {
	if (!data.userId) return [];
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
		if (!rows || rows.length === 0 || !rows[0].value) return [];
		const vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
		const userRecords = [];
		const now = /* @__PURE__ */ new Date();
		for (const v of vouchers) if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
			for (const c of v.claimedCodes) if (c.userId === data.userId) {
				const item = { ...c };
				if (item.status === "active" && item.expiresAt && now > new Date(item.expiresAt)) item.status = "expired";
				userRecords.push(item);
			}
		}
		userRecords.sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());
		return userRecords;
	} catch (err) {
		console.error("[Vouchers] Failed to load user vouchers:", err);
		return [];
	}
});
export { claimPromoCodeInStoreServer_createServerFn_handler, getUserClaimedVouchersServer_createServerFn_handler, getVouchersServer_createServerFn_handler, redeemVoucherServer_createServerFn_handler, saveVouchersServer_createServerFn_handler, verifyPromoCodeServer_createServerFn_handler };

//# sourceMappingURL=vouchers-Bj9aoRiM.js.map