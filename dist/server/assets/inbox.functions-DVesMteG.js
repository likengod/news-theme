import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { n as requireAuth, t as requireAdmin } from "./auth-middleware-CzbwKkqR.js";
import { persistDocumentImage } from "./ad-storage.server-B8sKpu9k.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import crypto from "crypto";
import { z } from "zod";
//#region src/lib/inbox.functions.ts?tss-serverfn-split
async function generateJournalistId() {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (let i = 0; i < 50; i++) {
		const candidate = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + Math.floor(Math.random() * 1e4).toString().padStart(4, "0") + letters[Math.floor(Math.random() * 26)];
		if ((await query("SELECT id FROM profiles WHERE journalist_id = ?", [candidate])).length === 0) return candidate;
	}
	return crypto.randomBytes(4).toString("hex").toUpperCase();
}
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
var submitEventRegistration_createServerFn_handler = createServerRpc({
	id: "6c259ade959c851cd70340313263eb8505cc9ec3b200d13ef96c63eff4e5a00f",
	name: "submitEventRegistration",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitEventRegistration.__executeServer(opts));
var submitEventRegistration = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	phone: z.string().min(1, "Phone number is required").max(25),
	address: z.string().min(1, "Address is required").max(500),
	customField: z.string().max(255).optional(),
	customFieldLabel: z.string().optional(),
	eventName: z.string().default("শারদ সম্মান")
}).parse(data)).handler(submitEventRegistration_createServerFn_handler, async ({ data, context }) => {
	const details = JSON.stringify({
		"Event Name": data.eventName,
		"Phone": data.phone.trim(),
		"Address": data.address.trim(),
		[data.customFieldLabel || "Club Name"]: data.customField?.trim() || "N/A"
	});
	await query(`INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`, [
		"event",
		context.userId || null,
		data.email.trim(),
		data.name.trim(),
		`Event Registration — ${data.eventName}`,
		details
	]);
	return { ok: true };
});
var submitJournalistApplication_createServerFn_handler = createServerRpc({
	id: "aae3045fa12508107196bec8b35c12823003d4de5f5ee5ab44551e208a987c23",
	name: "submitJournalistApplication",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => submitJournalistApplication.__executeServer(opts));
var submitJournalistApplication = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	displayName: z.string().min(2, "Full name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	phone: z.string().min(5, "Phone number is required").max(40),
	bloodGroup: z.string().max(10).optional(),
	dob: z.string().max(50).optional(),
	fatherName: z.string().max(255).optional(),
	motherName: z.string().max(255).optional(),
	gender: z.string().max(50).optional(),
	maritalStatus: z.string().max(50).optional(),
	husbandName: z.string().max(255).optional(),
	documentType: z.string().max(100).optional(),
	documentUrl: z.string().optional(),
	avatarUrl: z.string().max(5e5).optional(),
	address: z.string().max(300).optional(),
	state: z.string().max(80).optional(),
	country: z.string().max(80).optional(),
	pinCode: z.string().max(20).optional(),
	bio: z.string().max(2e3).optional()
}).parse(data)).handler(submitJournalistApplication_createServerFn_handler, async ({ data, context }) => {
	const savedDocUrl = data.documentUrl ? persistDocumentImage(data.documentUrl, "doc") : "";
	const details = JSON.stringify({
		displayName: data.displayName.trim(),
		email: data.email.trim(),
		phone: data.phone.trim(),
		bloodGroup: data.bloodGroup?.trim() || "",
		dob: data.dob?.trim() || "",
		fatherName: data.fatherName?.trim() || "",
		motherName: data.motherName?.trim() || "",
		gender: data.gender?.trim() || "",
		maritalStatus: data.maritalStatus?.trim() || "",
		husbandName: data.gender === "Female" && data.maritalStatus === "Married" ? data.husbandName?.trim() || "" : "",
		documentType: data.documentType?.trim() || "",
		documentUrl: savedDocUrl,
		avatarUrl: data.avatarUrl?.trim() || "",
		address: data.address?.trim() || "",
		state: data.state?.trim() || "",
		country: data.country?.trim() || "",
		pinCode: data.pinCode?.trim() || "",
		bio: data.bio?.trim() || ""
	});
	await query(`INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`, [
		"journalist_application",
		context.userId,
		data.email.trim(),
		data.displayName.trim(),
		`Journalist Application — ${data.displayName.trim()}`,
		details
	]);
	return { ok: true };
});
var adminGetInboxRequests_createServerFn_handler = createServerRpc({
	id: "b5112734f93085547420b85a9164457598dbdbca42f9bad3acc9fdd652a1ce7f",
	name: "adminGetInboxRequests",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminGetInboxRequests.__executeServer(opts));
var adminGetInboxRequests = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => z.object({
	type: z.string().optional(),
	status: z.string().optional()
}).optional().parse(data)).handler(adminGetInboxRequests_createServerFn_handler, async ({ data }) => {
	let sql = "SELECT * FROM inbox_requests WHERE 1=1";
	const params = [];
	const filterType = data?.type;
	const filterStatus = data?.status;
	if (filterType && filterType !== "all") {
		sql += " AND type = ?";
		params.push(filterType);
	}
	if (filterStatus && filterStatus !== "all") {
		sql += " AND status = ?";
		params.push(filterStatus);
	}
	sql += " ORDER BY created_at DESC";
	return { requests: await query(sql, params) };
});
var adminGetInboxSummary_createServerFn_handler = createServerRpc({
	id: "a2cd0096acae8fe7ede91a9dbfb5402cdc97389227b6119619b8779199a18708",
	name: "adminGetInboxSummary",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminGetInboxSummary.__executeServer(opts));
var adminGetInboxSummary = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(adminGetInboxSummary_createServerFn_handler, async () => {
	return { summary: await query(`SELECT type, status, COUNT(*) as count
         FROM inbox_requests
         GROUP BY type, status`) };
});
var adminUpdateInboxStatus_createServerFn_handler = createServerRpc({
	id: "c8f150db49105e8920ef4f4b599173f2209d60195550f302cc89ed3133ecf7b6",
	name: "adminUpdateInboxStatus",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminUpdateInboxStatus.__executeServer(opts));
var adminUpdateInboxStatus = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
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
var adminApproveAccountDeletion = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
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
var adminDeleteInboxRequest = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({ id: z.number() }).parse(data)).handler(adminDeleteInboxRequest_createServerFn_handler, async ({ data }) => {
	await query("DELETE FROM inbox_requests WHERE id = ?", [data.id]);
	return { ok: true };
});
var adminApproveJournalistApplication_createServerFn_handler = createServerRpc({
	id: "1ef32f84e1de0f5e22e29eb24ba235da8be53f367660995e70160ae1013b1e13",
	name: "adminApproveJournalistApplication",
	filename: "src/lib/inbox.functions.ts"
}, (opts) => adminApproveJournalistApplication.__executeServer(opts));
var adminApproveJournalistApplication = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({ requestId: z.number() }).parse(data)).handler(adminApproveJournalistApplication_createServerFn_handler, async ({ data }) => {
	const rows = await query("SELECT * FROM inbox_requests WHERE id = ?", [data.requestId]);
	if (rows.length === 0) throw new Error("Request not found");
	const req = rows[0];
	let details = {};
	try {
		if (req.details) details = JSON.parse(req.details);
	} catch {}
	let userId = req.user_id;
	if (!userId && req.user_email) {
		const uRows = await query("SELECT id FROM users WHERE email = ?", [req.user_email]);
		if (uRows.length > 0) userId = uRows[0].id;
	}
	if (!userId && details.email) {
		const uRows = await query("SELECT id FROM users WHERE email = ?", [details.email]);
		if (uRows.length > 0) userId = uRows[0].id;
	}
	if (!userId) throw new Error("Cannot find user associated with this application");
	const roleRows = await query("SELECT role FROM user_roles WHERE user_id = ?", [userId]);
	if (!roleRows.some((r) => r.role === "journalist")) if (roleRows.length > 0) await query("UPDATE user_roles SET role = 'journalist' WHERE user_id = ?", [userId]);
	else await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'journalist')", [crypto.randomUUID(), userId]);
	const profRows = await query("SELECT * FROM profiles WHERE id = ?", [userId]);
	const journalistId = profRows[0]?.journalist_id || await generateJournalistId();
	const validTill = profRows[0]?.valid_till || new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1e3).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
	if (profRows.length === 0) {
		let publicUserId = "";
		for (let i = 0; i < 50; i++) {
			publicUserId = (1 + Math.floor(Math.random() * 9)).toString() + Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
			if ((await query("SELECT id FROM profiles WHERE public_user_id = ?", [publicUserId])).length === 0) break;
		}
		if (!publicUserId) publicUserId = crypto.randomBytes(5).toString("hex");
		await query(`INSERT INTO profiles (id, public_user_id, display_name, email, phone, blood_group, dob, father_name, mother_name, gender, marital_status, husband_name, document_type, document_url, avatar_url, address, state, country, pin_code, journalist_id, valid_till, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`, [
			userId,
			publicUserId,
			details.displayName || req.user_name || "",
			req.user_email || details.email || "",
			details.phone || "",
			details.bloodGroup || "",
			details.dob || "",
			details.fatherName || null,
			details.motherName || null,
			details.gender || null,
			details.maritalStatus || null,
			details.husbandName || null,
			details.documentType || null,
			details.documentUrl || null,
			details.avatarUrl || null,
			details.address || "",
			details.state || "",
			details.country || "",
			details.pinCode || "",
			journalistId,
			validTill
		]);
	} else {
		const existing = profRows[0];
		const patch = {
			display_name: details.displayName || existing.display_name,
			phone: details.phone || existing.phone,
			blood_group: details.bloodGroup || existing.blood_group,
			dob: details.dob || existing.dob,
			father_name: details.fatherName !== void 0 ? details.fatherName || null : existing.father_name,
			mother_name: details.motherName !== void 0 ? details.motherName || null : existing.mother_name,
			gender: details.gender !== void 0 ? details.gender || null : existing.gender,
			marital_status: details.maritalStatus !== void 0 ? details.maritalStatus || null : existing.marital_status,
			husband_name: details.husbandName !== void 0 ? details.husbandName || null : existing.husband_name,
			document_type: details.documentType !== void 0 ? details.documentType || null : existing.document_type,
			document_url: details.documentUrl !== void 0 ? details.documentUrl || null : existing.document_url,
			address: details.address || existing.address,
			state: details.state || existing.state,
			country: details.country || existing.country,
			pin_code: details.pinCode || existing.pin_code,
			journalist_id: journalistId,
			valid_till: validTill,
			active: 1
		};
		if (details.avatarUrl) patch.avatar_url = details.avatarUrl;
		const keys = Object.keys(patch);
		await query(`UPDATE profiles SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`, [...keys.map((k) => patch[k]), userId]);
	}
	if (details.displayName) await query("UPDATE users SET display_name = ? WHERE id = ?", [details.displayName, userId]);
	await query("UPDATE inbox_requests SET status = 'Approved' WHERE id = ?", [data.requestId]);
	return { ok: true };
});
//#endregion
export { adminApproveAccountDeletion_createServerFn_handler, adminApproveJournalistApplication_createServerFn_handler, adminDeleteInboxRequest_createServerFn_handler, adminGetInboxRequests_createServerFn_handler, adminGetInboxSummary_createServerFn_handler, adminUpdateInboxStatus_createServerFn_handler, submitContactMessage_createServerFn_handler, submitDeleteAccountRequest_createServerFn_handler, submitEventRegistration_createServerFn_handler, submitJournalistApplication_createServerFn_handler, submitWithdrawRequest_createServerFn_handler, submitWorkWithUs_createServerFn_handler };

//# sourceMappingURL=inbox.functions-DVesMteG.js.map