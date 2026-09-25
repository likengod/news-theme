import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BfzG-VT4.js";
import { n as requireAuth, t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { z } from "zod";
//#region src/lib/inbox.functions.ts
/**
* Submit a contact message (public — no auth required)
*/
var submitContactMessage = createServerFn({ method: "POST" }).validator((data) => z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	subject: z.string().max(100).optional(),
	message: z.string().min(1, "Message is required").max(5e3)
}).parse(data)).handler(createSsrRpc("d296691172b6166ca20eee958357a08c2f40f1de3af5b5b23c9ab00dd920d54e"));
/**
* Submit a work-with-us application (public — no auth required)
*/
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
}).parse(data)).handler(createSsrRpc("16ce89c2eb2fca21f96b4f6bba1222693de042ef4995a45331af6ff4fb932aae"));
/**
* Submit a withdrawal request (authenticated user)
*/
var submitWithdrawRequest = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	voucherId: z.string().min(1, "Voucher is required"),
	voucherTitle: z.string(),
	amount: z.number().positive(),
	paymentMethod: z.string().optional(),
	paymentDetails: z.string().optional()
}).parse(data)).handler(createSsrRpc("b1b7c2049f9fd39ff484d5780be121d634dec8fc9387b4af69c0fc546d841511"));
/**
* Submit account deletion request (authenticated user)
* Also sets delete_requested = TRUE on the profiles table
*/
var submitDeleteAccountRequest = createServerFn({ method: "POST" }).middleware([requireAuth]).handler(createSsrRpc("7ae569f1f945df118a54485d2422ff53e4ee9dccc16c5867fc1b42c7b0cdcf34"));
/**
* Submit event registration (authenticated user)
*/
var submitEventRegistration = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").max(100),
	phone: z.string().min(1, "Phone number is required").max(25),
	address: z.string().min(1, "Address is required").max(500),
	customField: z.string().max(255).optional(),
	customFieldLabel: z.string().optional(),
	eventName: z.string().default("শারদ সম্মান")
}).parse(data)).handler(createSsrRpc("6c259ade959c851cd70340313263eb8505cc9ec3b200d13ef96c63eff4e5a00f"));
/**
* Submit journalist application (authenticated user)
*/
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
}).parse(data)).handler(createSsrRpc("aae3045fa12508107196bec8b35c12823003d4de5f5ee5ab44551e208a987c23"));
/**
* Admin: Get all inbox requests (optionally filter by type/status)
*/
var adminGetInboxRequests = createServerFn({ method: "GET" }).middleware([requireAdmin]).validator((data) => z.object({
	type: z.string().optional(),
	status: z.string().optional()
}).optional().parse(data)).handler(createSsrRpc("b5112734f93085547420b85a9164457598dbdbca42f9bad3acc9fdd652a1ce7f"));
/**
* Admin: Get inbox summary counts
*/
var adminGetInboxSummary = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("a2cd0096acae8fe7ede91a9dbfb5402cdc97389227b6119619b8779199a18708"));
/**
* Admin: Update inbox request status (Approved / Rejected)
*/
var adminUpdateInboxStatus = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
	id: z.number(),
	status: z.enum([
		"Pending",
		"Approved",
		"Rejected"
	])
}).parse(data)).handler(createSsrRpc("c8f150db49105e8920ef4f4b599173f2209d60195550f302cc89ed3133ecf7b6"));
/**
* Admin: Approve account deletion — permanently deletes user and all their data
* This is destructive and irreversible.
*/
var adminApproveAccountDeletion = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
	requestId: z.number(),
	userId: z.string().uuid()
}).parse(data)).handler(createSsrRpc("3c25065a9854b8f41b454c04f5082fc4b0279d108c26242fe4b00da52ce9d501"));
/**
* Admin: Delete inbox request entry
*/
var adminDeleteInboxRequest = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({ id: z.number() }).parse(data)).handler(createSsrRpc("2c0b0242c5348aaf049db4f8d306cbd4e7bd491678e5a4656209a7b52c9c8038"));
/**
* Admin: Approve journalist application
* 1. Automatically syncs submitted details into user profile.
* 2. If user's role is not 'Journalist', automatically updates user role to 'Journalist'.
* 3. Assigns unique 8-char journalist_id and 3-year press card validity if not already set.
* 4. Marks request as Approved.
*/
var adminApproveJournalistApplication = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({ requestId: z.number() }).parse(data)).handler(createSsrRpc("1ef32f84e1de0f5e22e29eb24ba235da8be53f367660995e70160ae1013b1e13"));
//#endregion
export { adminGetInboxSummary as a, submitDeleteAccountRequest as c, submitWithdrawRequest as d, submitWorkWithUs as f, adminGetInboxRequests as i, submitEventRegistration as l, adminApproveJournalistApplication as n, adminUpdateInboxStatus as o, adminDeleteInboxRequest as r, submitContactMessage as s, adminApproveAccountDeletion as t, submitJournalistApplication as u };
