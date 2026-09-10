import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-Bsi3qYPj.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
//#region src/lib/journalist.functions.ts
var listJournalists = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("8cea322cbc4f6bcc495d4f79eecafc364597765e92569763076616465537f853"));
var lookupJournalist = createServerFn({ method: "POST" }).inputValidator((data) => {
	const id = String(data?.publicUserId ?? "").trim();
	if (id.length < 3) throw new Error("Enter a valid Journalist ID or User ID");
	return { publicUserId: id };
}).handler(createSsrRpc("d11f8218e1bc2394af4f78dca0f87578d9aed581749b5a90533c8ba434f6b8d8"));
var searchJournalists = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const query = String(data?.query ?? "").trim();
	if (query.length < 2) throw new Error("Enter at least 2 characters");
	return { query };
}).handler(createSsrRpc("85a69b0fa82aba24f7f596912ea912b9ee983194c4b1169716362810332f93cd"));
var awardJournalistPoints = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const publicUserId = String(data?.publicUserId ?? "").trim();
	const points = Math.floor(Number(data?.points));
	if (!/^\d{10}$/.test(publicUserId)) throw new Error("Invalid 10-digit User ID");
	if (!Number.isFinite(points) || points === 0) throw new Error("Enter a non-zero point amount");
	if (Math.abs(points) > 1e5) throw new Error("Amount too large (max ±100000)");
	return {
		publicUserId,
		points,
		reason: String(data?.reason ?? "").trim().slice(0, 200) || null
	};
}).handler(createSsrRpc("a6002267c4d192ba76a3c675b580d90351bd78a0e67a36f81933b37bd786cf2e"));
function cleanText(v, max = 200) {
	const s = String(v ?? "").trim();
	return s ? s.slice(0, max) : null;
}
var upsertJournalist = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	const email = String(data?.email ?? "").trim().toLowerCase();
	const displayName = String(data?.displayName ?? "").trim();
	if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email required");
	if (!displayName) throw new Error("Name is required");
	if (!data.userId && (!data.password || data.password.length < 8)) throw new Error("Password (min 8 chars) required for new journalists");
	return {
		userId: data.userId,
		email,
		password: data.password,
		displayName: displayName.slice(0, 100),
		phone: cleanText(data.phone, 40),
		bloodGroup: cleanText(data.bloodGroup, 8),
		dob: cleanText(data.dob, 40),
		validTill: cleanText(data.validTill, 40),
		address: cleanText(data.address, 300),
		state: cleanText(data.state, 80),
		country: cleanText(data.country, 80),
		pinCode: cleanText(data.pinCode, 20),
		avatarUrl: cleanText(data.avatarUrl, 500),
		articlesPublished: Number.isFinite(data.articlesPublished) ? Math.max(0, Math.floor(Number(data.articlesPublished))) : void 0,
		points: Number.isFinite(data.points) ? Math.max(0, Math.floor(Number(data.points))) : void 0,
		active: typeof data.active === "boolean" ? data.active : void 0
	};
}).handler(createSsrRpc("6ee862fc9a6e094cb784d2759dd3f559deb4caabd5b844a6255c1e2f7a255d25"));
createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data?.userId) throw new Error("userId required");
	return {
		userId: String(data.userId),
		active: !!data.active
	};
}).handler(createSsrRpc("65600bf083ec71d5df1045a46b6e8e2965c827f1fa1a8b147499ee9ddedc3bbe"));
var deleteJournalist = createServerFn({ method: "POST" }).middleware([requireAuth]).inputValidator((data) => {
	if (!data?.userId) throw new Error("userId required");
	return { userId: String(data.userId) };
}).handler(createSsrRpc("038d145f9e0f2fc7deb5d774c689275e369c15a619a4098bc7ba48b9425491b3"));
//#endregion
export { searchJournalists as a, lookupJournalist as i, deleteJournalist as n, upsertJournalist as o, listJournalists as r, awardJournalistPoints as t };
