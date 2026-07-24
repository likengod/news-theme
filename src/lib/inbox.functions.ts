import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { z } from "zod";

// ─── Types ───────────────────────────────────────────────────────────────────

export type InboxType = "contact" | "work_with_us" | "withdraw" | "delete_account";
export type InboxStatus = "Pending" | "Approved" | "Rejected";

// ─── Submit Functions (Public / Authenticated) ────────────────────────────────

/**
 * Submit a contact message (public — no auth required)
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email").max(100),
    subject: z.string().max(100).optional(),
    message: z.string().min(1, "Message is required").max(5000),
  }).parse(data))
  .handler(async ({ data }) => {
    await query(
      `INSERT INTO inbox_requests (type, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [
        "contact",
        data.email.trim(),
        data.name.trim(),
        `Contact: ${data.subject || "General Enquiry"}`,
        data.message.trim(),
      ]
    );
    return { ok: true };
  });

/**
 * Submit a work-with-us application (public — no auth required)
 */
export const submitWorkWithUs = createServerFn({ method: "POST" })
  .validator((data) => z.object({
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
    pitch: z.string().min(1, "Pitch is required").max(5000)
  }).parse(data))
  .handler(async ({ data }) => {
    const details = JSON.stringify({
      phone: data.phone || "",
      alternativePhone: data.alternativePhone || "",
      city: data.city || "",
      zip: data.zip || "",
      country: data.country || "",
      beat: data.beat || "",
      tier: data.tier,
      portfolio: data.portfolio || "",
      pitch: data.pitch,
    });
    await query(
      `INSERT INTO inbox_requests (type, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [
        "work_with_us",
        data.email.trim(),
        data.name.trim(),
        `Work Application — ${data.tier}`,
        details,
      ]
    );
    return { ok: true };
  });

/**
 * Submit a withdrawal request (authenticated user)
 */
export const submitWithdrawRequest = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({
    voucherId: z.string().min(1, "Voucher is required"),
    voucherTitle: z.string(),
    amount: z.number().positive(),
    paymentMethod: z.string().optional(),
    paymentDetails: z.string().optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    // Get user info
    const users = await query(
      "SELECT p.display_name, p.email, p.bank_name, p.bank_account_no, p.bank_ifsc FROM profiles p WHERE p.id = ?",
      [context.userId]
    );
    const profile = users[0] ?? {};

    const details = JSON.stringify({
      voucherId: data.voucherId,
      voucherTitle: data.voucherTitle,
      amount: data.amount,
      paymentMethod: data.paymentMethod || "voucher",
      paymentDetails: data.paymentDetails || "",
      bankName: profile.bank_name || "",
      bankAccount: profile.bank_account_no || "",
      bankIfsc: profile.bank_ifsc || "",
    });

    await query(
      `INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        "withdraw",
        context.userId,
        profile.email || "",
        profile.display_name || "",
        `Withdraw: ${data.voucherTitle}`,
        details,
      ]
    );
    return { ok: true };
  });

/**
 * Submit account deletion request (authenticated user)
 * Also sets delete_requested = TRUE on the profiles table
 */
export const submitDeleteAccountRequest = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    // Get user profile
    const profiles = await query(
      "SELECT display_name, email FROM profiles WHERE id = ?",
      [context.userId]
    );
    const profile = profiles[0] ?? {};

    // Mark on profiles table
    await query(
      "UPDATE profiles SET delete_requested = TRUE WHERE id = ?",
      [context.userId]
    );

    // Add to inbox for admin review
    await query(
      `INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        "delete_account",
        context.userId,
        profile.email || "",
        profile.display_name || "Unknown User",
        "Account Deletion Request",
        `User ${profile.display_name || profile.email} has requested account deletion.`,
      ]
    );
    return { ok: true };
  });

// ─── Admin Functions ──────────────────────────────────────────────────────────

/**
 * Admin: Get all inbox requests (optionally filter by type/status)
 */
export const adminGetInboxRequests = createServerFn({ method: "GET" })
  .validator((data) => z.object({ type: z.string().optional(), status: z.string().optional() }).optional().parse(data))
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM inbox_requests WHERE 1=1";
    const params: any[] = [];

    if (data.type && data.type !== "all") {
      sql += " AND type = ?";
      params.push(data.type);
    }
    if (data.status && data.status !== "all") {
      sql += " AND status = ?";
      params.push(data.status);
    }

    sql += " ORDER BY created_at DESC";
    const rows = await query(sql, params);
    return { requests: rows };
  });

/**
 * Admin: Get inbox summary counts
 */
export const adminGetInboxSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    const rows = await query(
      `SELECT type, status, COUNT(*) as count
       FROM inbox_requests
       GROUP BY type, status`
    );
    return { summary: rows };
  });

/**
 * Admin: Update inbox request status (Approved / Rejected)
 */
export const adminUpdateInboxStatus = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    id: z.number(),
    status: z.enum(["Pending", "Approved", "Rejected"])
  }).parse(data))
  .handler(async ({ data }) => {
    await query(
      "UPDATE inbox_requests SET status = ? WHERE id = ?",
      [data.status, data.id]
    );
    return { ok: true };
  });

/**
 * Admin: Approve account deletion — permanently deletes user and all their data
 * This is destructive and irreversible.
 */
export const adminApproveAccountDeletion = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    requestId: z.number(),
    userId: z.string().uuid()
  }).parse(data))
  .handler(async ({ data }) => {
    // Delete user data in correct order (FK constraints)
    // Sessions → roles → profiles → users (CASCADE handles most, but explicit is safer)
    await query("DELETE FROM sessions WHERE user_id = ?", [data.userId]);
    await query("DELETE FROM user_roles WHERE user_id = ?", [data.userId]);
    await query("DELETE FROM profiles WHERE id = ?", [data.userId]);
    await query("DELETE FROM users WHERE id = ?", [data.userId]);

    // Mark request as approved
    await query(
      "UPDATE inbox_requests SET status = 'Approved' WHERE id = ?",
      [data.requestId]
    );

    return { ok: true };
  });

/**
 * Admin: Delete inbox request entry
 */
export const adminDeleteInboxRequest = createServerFn({ method: "POST" })
  .validator((data) => z.object({ id: z.number() }).parse(data))
  .handler(async ({ data }) => {
    await query("DELETE FROM inbox_requests WHERE id = ?", [data.id]);
    return { ok: true };
  });
