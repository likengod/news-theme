import { i as createServerFn } from "./server-BXSy1leT.js";
import { t as createSsrRpc } from "./createSsrRpc-Boymfnsd.js";
import { t as requireAdmin } from "./auth-middleware-Bd2mbrca.js";
import { t as attachAuth } from "./auth-attacher-CDnB-Nh0.js";
// src/lib/vouchers.ts
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
var STORAGE_KEY = "nt:vouchers_config:v1";
var getVouchersServer = createServerFn({ method: "GET" }).handler(createSsrRpc("105ca7e7b1d584c04f0813d16b8f7af6a70178c783d3de71ac0946d4856e635f"));
var saveVouchersServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((vouchers) => vouchers).handler(createSsrRpc("1539d254a416960ca6a8b71c55a32c7b8855be361861d42ae6be5767df9beb7a"));
/**
* Redeem a voucher:
* - Pops a single unique unredeemed code from the pool (never re-issued to anyone else)
* - Automatically attaches user info, unique code, creation time and calculated expiration date
* - Saves the state into the database
*/
var redeemVoucherServer = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("ec22cfc650bcccf39d54345d7c01cf8bd55477a24b28827ad4402b7a07eed6f5"));
/**
* Public Verification Check (Store Owner / Cashier / QR Scanner):
* Checks whether a promo code is:
* 1. Valid and ready to claim
* 2. Already used at a store (with timestamp and store name)
* 3. Expired
* 4. Invalid or not found
*/
var verifyPromoCodeServer = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("3ee0cc9a0744ceec31c2149b7b7bd76cc09522e051ce52257a6c2ffea6f51e76"));
/**
* In-Store Claim / Redemption Action:
* Executed by the store owner or cashier to permanently mark the promo code as USED.
* Once marked, the code is locked forever and cannot be redeemed again.
*/
var claimPromoCodeInStoreServer = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("26590cadb59750adefb2c14d439eb641fe46bf6c72f5fce7ef595814bd61825e"));
/**
* Fetch all claimed vouchers for a specific user (for User Profile / Wallet tab)
*/
var getUserClaimedVouchersServer = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("1c66f6c298d50f6878d50ce5fcfeb86ad6ae2aad2f087d9d9460aef476840273"));
function loadVouchers() {
	if (typeof window === "undefined") return DEFAULT_VOUCHERS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_VOUCHERS;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VOUCHERS;
	} catch {
		return DEFAULT_VOUCHERS;
	}
}
function saveVouchers(vouchers) {
	if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
	saveVouchersServer({ data: vouchers }).catch((err) => {
		console.error("[Vouchers] Save error:", err);
	});
}
export { loadVouchers as a, verifyPromoCodeServer as c, getVouchersServer as i, claimPromoCodeInStoreServer as n, redeemVoucherServer as o, getUserClaimedVouchersServer as r, saveVouchers as s, DEFAULT_VOUCHERS as t };

//# sourceMappingURL=vouchers-Dd_HfAFl.js.map