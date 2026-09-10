import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-Chz3iTW3.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
import { z } from "zod";
//#region src/lib/inbox.functions.ts?tss-serverfn-split
var submitContactMessage_createServerFn_handler = createServerRpc({
	id: "d296691172b6166ca20eee958357a08c2f40f1de3af5b5b23c9ab00dd920d54e",
	name: "submitContactMessage",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitContactMessage.__executeServer(opts));
var submitContactMessage = createServerFn({ method: "POST" }).validator((data) => z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	subject: z.string().max(100).optional(),
	message: z.string().min(1, "Message is required").max(5e3)
}).parse(data)).handler(submitContactMessage_createServerFn_handler, async ({ data }) => {
	await query(`INSERT INTO inbox_requests (type, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`, [
		"contact",
		data.email.trim(),
		data.name.trim(),
		`Contact: ${data.subject || "General Enquiry"}`,
		data.message.trim()
	]);
	return { ok: true };
});
var submitWorkWithUs_createServerFn_handler = createServerRpc({
	id: "16ce89c2eb2fca21f96b4f6bba1222693de042ef4995a45331af6ff4fb932aae",
	name: "submitWorkWithUs",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitWorkWithUs.__executeServer(opts));
var submitWorkWithUs = createServerFn({ method: "POST" }).validator((data) => z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	phone: z.string().max(20).optional(),
	alternativePhone: z.string().max(20).optional(),
	city: z.string().max(100).optional(),
	zip: z.string().max(20).optional(),
	country: z.string().max(100).optional(),
	beat: z.string().max(100).optional(),
	tier: z.string().max(50),
	portfolio: z.string().max(500).optional(),
	pitch: z.string().min(1, "Pitch is required").max(5e3)
}).parse(data)).handler(submitWorkWithUs_createServerFn_handler, async ({ data }) => {
	const details = JSON.stringify({
		phone: data.phone || "",
		alternativePhone: data.alternativePhone || "",
		city: data.city || "",
		zip: data.zip || "",
		country: data.country || "",
		beat: data.beat || "",
		tier: data.tier,
		portfolio: data.portfolio || "",
		pitch: data.pitch
	});
	await query(`INSERT INTO inbox_requests (type, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`, [
		"work_with_us",
		data.email.trim(),
		data.name.trim(),
		`Work Application — ${data.tier}`,
		details
	]);
	return { ok: true };
});
var submitWithdrawRequest_createServerFn_handler = createServerRpc({
	id: "b1b7c2049f9fd39ff484d5780be121d634dec8fc9387b4af69c0fc546d841511",
	name: "submitWithdrawRequest",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitWithdrawRequest.__executeServer(opts));
var submitWithdrawRequest = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	voucherId: z.string().min(1, "Voucher is required"),
	voucherTitle: z.string(),
	amount: z.number().positive(),
	paymentMethod: z.string().optional(),
	paymentDetails: z.string().optional()
}).parse(data)).handler(submitWithdrawRequest_createServerFn_handler, async ({ data, context }) => {
	const profile = (await query("SELECT p.display_name, p.email, p.bank_name, p.bank_account_no, p.bank_ifsc FROM profiles p WHERE p.id = ?", [context.userId]))[0] ?? {};
	const details = JSON.stringify({
		voucherId: data.voucherId,
		voucherTitle: data.voucherTitle,
		amount: data.amount,
		paymentMethod: data.paymentMethod || "voucher",
		paymentDetails: data.paymentDetails || "",
		bankName: profile.bank_name || "",
		bankAccount: profile.bank_account_no || "",
		bankIfsc: profile.bank_ifsc || ""
	});
	await query(`INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`, [
		"withdraw",
		context.userId,
		profile.email || "",
		profile.display_name || "",
		`Withdraw: ${data.voucherTitle}`,
		details
	]);
	return { ok: true };
});
var submitDeleteAccountRequest_createServerFn_handler = createServerRpc({
	id: "7ae569f1f945df118a54485d2422ff53e4ee9dccc16c5867fc1b42c7b0cdcf34",
	name: "submitDeleteAccountRequest",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitDeleteAccountRequest.__executeServer(opts));
var submitDeleteAccountRequest = createServerFn({ method: "POST" }).middleware([requireAuth]).handler(submitDeleteAccountRequest_createServerFn_handler, async ({ context }) => {
	const profile = (await query("SELECT display_name, email FROM profiles WHERE id = ?", [context.userId]))[0] ?? {};
	await query("UPDATE profiles SET delete_requested = TRUE WHERE id = ?", [context.userId]);
	await query(`INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`, [
		"delete_account",
		context.userId,
		profile.email || "",
		profile.display_name || "Unknown User",
		"Account Deletion Request",
		`User ${profile.display_name || profile.email} has requested account deletion.`
	]);
	return { ok: true };
});
var adminGetInboxRequests_createServerFn_handler = createServerRpc({
	id: "b5112734f93085547420b85a9164457598dbdbca42f9bad3acc9fdd652a1ce7f",
	name: "adminGetInboxRequests",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminGetInboxRequests.__executeServer(opts));
var adminGetInboxRequests = createServerFn({ method: "GET" }).validator((data) => z.object({
	type: z.string().optional(),
	status: z.string().optional()
}).optional().parse(data)).handler(adminGetInboxRequests_createServerFn_handler, async ({ data }) => {
	let sql = "SELECT * FROM inbox_requests WHERE 1=1";
	const params = [];
	if (data.type && data.type !== "all") {
		sql += " AND type = ?";
		params.push(data.type);
	}
	if (data.status && data.status !== "all") {
		sql += " AND status = ?";
		params.push(data.status);
	}
	sql += " ORDER BY created_at DESC";
	return { requests: await query(sql, params) };
});
var adminGetInboxSummary_createServerFn_handler = createServerRpc({
	id: "a2cd0096acae8fe7ede91a9dbfb5402cdc97389227b6119619b8779199a18708",
	name: "adminGetInboxSummary",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminGetInboxSummary.__executeServer(opts));
var adminGetInboxSummary = createServerFn({ method: "GET" }).handler(adminGetInboxSummary_createServerFn_handler, async () => {
	return { summary: await query(`SELECT type, status, COUNT(*) as count
       FROM inbox_requests
       GROUP BY type, status`) };
});
var adminUpdateInboxStatus_createServerFn_handler = createServerRpc({
	id: "c8f150db49105e8920ef4f4b599173f2209d60195550f302cc89ed3133ecf7b6",
	name: "adminUpdateInboxStatus",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminUpdateInboxStatus.__executeServer(opts));
var adminUpdateInboxStatus = createServerFn({ method: "POST" }).validator((data) => z.object({
	id: z.number(),
	status: z.enum([
		"Pending",
		"Approved",
		"Rejected"
	])
}).parse(data)).handler(adminUpdateInboxStatus_createServerFn_handler, async ({ data }) => {
	await query("UPDATE inbox_requests SET status = ? WHERE id = ?", [data.status, data.id]);
	return { ok: true };
});
var adminApproveAccountDeletion_createServerFn_handler = createServerRpc({
	id: "3c25065a9854b8f41b454c04f5082fc4b0279d108c26242fe4b00da52ce9d501",
	name: "adminApproveAccountDeletion",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminApproveAccountDeletion.__executeServer(opts));
var adminApproveAccountDeletion = createServerFn({ method: "POST" }).validator((data) => z.object({
	requestId: z.number(),
	userId: z.string().uuid()
}).parse(data)).handler(adminApproveAccountDeletion_createServerFn_handler, async ({ data }) => {
	await query("DELETE FROM sessions WHERE user_id = ?", [data.userId]);
	await query("DELETE FROM user_roles WHERE user_id = ?", [data.userId]);
	await query("DELETE FROM profiles WHERE id = ?", [data.userId]);
	await query("DELETE FROM users WHERE id = ?", [data.userId]);
	await query("UPDATE inbox_requests SET status = 'Approved' WHERE id = ?", [data.requestId]);
	return { ok: true };
});
var adminDeleteInboxRequest_createServerFn_handler = createServerRpc({
	id: "2c0b0242c5348aaf049db4f8d306cbd4e7bd491678e5a4656209a7b52c9c8038",
	name: "adminDeleteInboxRequest",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminDeleteInboxRequest.__executeServer(opts));
var adminDeleteInboxRequest = createServerFn({ method: "POST" }).validator((data) => z.object({ id: z.number() }).parse(data)).handler(adminDeleteInboxRequest_createServerFn_handler, async ({ data }) => {
	await query("DELETE FROM inbox_requests WHERE id = ?", [data.id]);
	return { ok: true };
});
//#endregion
export { adminApproveAccountDeletion_createServerFn_handler, adminDeleteInboxRequest_createServerFn_handler, adminGetInboxRequests_createServerFn_handler, adminGetInboxSummary_createServerFn_handler, adminUpdateInboxStatus_createServerFn_handler, submitContactMessage_createServerFn_handler, submitDeleteAccountRequest_createServerFn_handler, submitWithdrawRequest_createServerFn_handler, submitWorkWithUs_createServerFn_handler };
