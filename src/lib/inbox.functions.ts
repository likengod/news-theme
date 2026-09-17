import { createServerFn } from "@tanstack/react-start";
import { requireAuth, requireAdmin } from "@/lib/auth-middleware";
import { query } from "./db.server";
import { persistDocumentImage } from "./ad-storage.server";
import { z } from "zod";
import crypto from "crypto";

async function generateJournalistId(): Promise<string> {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 50; i++) {
    const candidate =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)] +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0") +
      letters[Math.floor(Math.random() * 26)];
    const check = await query("SELECT id FROM profiles WHERE journalist_id = ?", [candidate]);
    if (check.length === 0) return candidate;
  }
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type InboxType =
  | "contact"
  | "work_with_us"
  | "withdraw"
  | "delete_account"
  | "event"
  | "journalist_application";
export type InboxStatus = "Pending" | "Approved" | "Rejected";

// ─── Submit Functions (Public / Authenticated) ────────────────────────────────

/**
 * Submit a contact message (public — no auth required)
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
        name: z.string().min(1, "Name is required").max(100),
        email: z.string().email("Invalid email").max(100),
        subject: z.string().max(100).optional(),
        message: z.string().min(1, "Message is required").max(5000),
      })
      .parse(data),
  )
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
      ],
    );
    return { ok: true };
  });

/**
 * Submit a work-with-us application (public — no auth required)
 */
export const submitWorkWithUs = createServerFn({ method: "POST" })
  .validator((data) =>
    z
      .object({
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
        pitch: z.string().min(1, "Pitch is required").max(5000),
      })
      .parse(data),
  )
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
      ],
    );
    return { ok: true };
  });

/**
 * Submit a withdrawal request (authenticated user)
 */
export const submitWithdrawRequest = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) =>
    z
      .object({
        voucherId: z.string().min(1, "Voucher is required"),
        voucherTitle: z.string(),
        amount: z.number().positive(),
        paymentMethod: z.string().optional(),
        paymentDetails: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    // Get user info
    const users = await query(
      "SELECT p.display_name, p.email, p.bank_name, p.bank_account_no, p.bank_ifsc FROM profiles p WHERE p.id = ?",
      [context.userId],
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
      ],
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
    const profiles = await query("SELECT display_name, email FROM profiles WHERE id = ?", [
      context.userId,
    ]);
    const profile = profiles[0] ?? {};

    // Mark on profiles table
    await query("UPDATE profiles SET delete_requested = TRUE WHERE id = ?", [context.userId]);

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
      ],
    );
    return { ok: true };
  });

/**
 * Submit event registration (authenticated user)
 */
export const submitEventRegistration = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) =>
    z
      .object({
        name: z.string().min(1, "Name is required").max(100),
        email: z.string().email("Invalid email").max(100),
        phone: z.string().min(1, "Phone number is required").max(25),
        address: z.string().min(1, "Address is required").max(500),
        customField: z.string().max(255).optional(),
        customFieldLabel: z.string().optional(),
        eventName: z.string().default("শারদ সম্মান"),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const details = JSON.stringify({
      "Event Name": data.eventName,
      "Phone": data.phone.trim(),
      "Address": data.address.trim(),
      [data.customFieldLabel || "Club Name"]: data.customField?.trim() || "N/A",
    });

    await query(
      `INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        "event",
        context.userId || null,
        data.email.trim(),
        data.name.trim(),
        `Event Registration — ${data.eventName}`,
        details,
      ],
    );

    return { ok: true };
  });

/**
 * Submit journalist application (authenticated user)
 */
export const submitJournalistApplication = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) =>
    z
      .object({
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
        avatarUrl: z.string().max(500000).optional(),
        address: z.string().max(300).optional(),
        state: z.string().max(80).optional(),
        country: z.string().max(80).optional(),
        pinCode: z.string().max(20).optional(),
        bio: z.string().max(2000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const savedDocUrl = data.documentUrl
      ? persistDocumentImage(data.documentUrl, "doc")
      : "";

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
      husbandName:
        data.gender === "Female" && data.maritalStatus === "Married"
          ? data.husbandName?.trim() || ""
          : "",
      documentType: data.documentType?.trim() || "",
      documentUrl: savedDocUrl,
      avatarUrl: data.avatarUrl?.trim() || "",
      address: data.address?.trim() || "",
      state: data.state?.trim() || "",
      country: data.country?.trim() || "",
      pinCode: data.pinCode?.trim() || "",
      bio: data.bio?.trim() || "",
    });

    await query(
      `INSERT INTO inbox_requests (type, user_id, user_email, user_name, title, details, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        "journalist_application",
        context.userId,
        data.email.trim(),
        data.displayName.trim(),
        `Journalist Application — ${data.displayName.trim()}`,
        details,
      ],
    );

    return { ok: true };
  });

// ─── Admin Functions ──────────────────────────────────────────────────────────

/**
 * Admin: Get all inbox requests (optionally filter by type/status)
 */
export const adminGetInboxRequests = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .validator((data) =>
    z.object({ type: z.string().optional(), status: z.string().optional() }).optional().parse(data),
  )
  .handler(async ({ data }) => {
    let sql = "SELECT * FROM inbox_requests WHERE 1=1";
    const params: any[] = [];

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
    const rows = await query(sql, params);
    return { requests: rows };
  });

/**
 * Admin: Get inbox summary counts
 */
export const adminGetInboxSummary = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const rows = await query(
      `SELECT type, status, COUNT(*) as count
         FROM inbox_requests
         GROUP BY type, status`,
    );
    return { summary: rows };
  });

/**
 * Admin: Update inbox request status (Approved / Rejected)
 */
export const adminUpdateInboxStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data) =>
    z
      .object({
        id: z.number(),
        status: z.enum(["Pending", "Approved", "Rejected"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await query("UPDATE inbox_requests SET status = ? WHERE id = ?", [data.status, data.id]);
    return { ok: true };
  });

/**
 * Admin: Approve account deletion — permanently deletes user and all their data
 * This is destructive and irreversible.
 */
export const adminApproveAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data) =>
    z
      .object({
        requestId: z.number(),
        userId: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // Delete user data in correct order (FK constraints)
    // Sessions → roles → profiles → users (CASCADE handles most, but explicit is safer)
    await query("DELETE FROM sessions WHERE user_id = ?", [data.userId]);
    await query("DELETE FROM user_roles WHERE user_id = ?", [data.userId]);
    await query("DELETE FROM profiles WHERE id = ?", [data.userId]);
    await query("DELETE FROM users WHERE id = ?", [data.userId]);

    // Mark request as approved
    await query("UPDATE inbox_requests SET status = 'Approved' WHERE id = ?", [data.requestId]);

    return { ok: true };
  });

/**
 * Admin: Delete inbox request entry
 */
export const adminDeleteInboxRequest = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data) => z.object({ id: z.number() }).parse(data))
  .handler(async ({ data }) => {
    await query("DELETE FROM inbox_requests WHERE id = ?", [data.id]);
    return { ok: true };
  });

/**
 * Admin: Approve journalist application
 * 1. Automatically syncs submitted details into user profile.
 * 2. If user's role is not 'Journalist', automatically updates user role to 'Journalist'.
 * 3. Assigns unique 8-char journalist_id and 3-year press card validity if not already set.
 * 4. Marks request as Approved.
 */
export const adminApproveJournalistApplication = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((data) => z.object({ requestId: z.number() }).parse(data))
  .handler(async ({ data }) => {
    const rows = await query("SELECT * FROM inbox_requests WHERE id = ?", [data.requestId]);
    if (rows.length === 0) throw new Error("Request not found");
    const req = rows[0];

    let details: any = {};
    try {
      if (req.details) details = JSON.parse(req.details);
    } catch {}

    // Find the applicant's user account
    let userId = req.user_id;
    if (!userId && req.user_email) {
      const uRows = await query("SELECT id FROM users WHERE email = ?", [req.user_email]);
      if (uRows.length > 0) userId = uRows[0].id;
    }
    if (!userId && details.email) {
      const uRows = await query("SELECT id FROM users WHERE email = ?", [details.email]);
      if (uRows.length > 0) userId = uRows[0].id;
    }

    if (!userId) {
      throw new Error("Cannot find user associated with this application");
    }

    // 1. Role update: Check if user role is 'journalist'. If not, update to 'journalist'
    const roleRows = await query("SELECT role FROM user_roles WHERE user_id = ?", [userId]);
    const hasJournalistRole = roleRows.some((r: any) => r.role === "journalist");

    if (!hasJournalistRole) {
      if (roleRows.length > 0) {
        await query("UPDATE user_roles SET role = 'journalist' WHERE user_id = ?", [userId]);
      } else {
        await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'journalist')", [
          crypto.randomUUID(),
          userId,
        ]);
      }
    }

    // 2. Profile update: fetch existing profile or create one
    const profRows = await query("SELECT * FROM profiles WHERE id = ?", [userId]);
    const journalistId = profRows[0]?.journalist_id || (await generateJournalistId());
    const validTill =
      profRows[0]?.valid_till ||
      new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    if (profRows.length === 0) {
      let publicUserId = "";
      for (let i = 0; i < 50; i++) {
        publicUserId =
          (1 + Math.floor(Math.random() * 9)).toString() +
          Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(9, "0");
        const existing = await query("SELECT id FROM profiles WHERE public_user_id = ?", [
          publicUserId,
        ]);
        if (existing.length === 0) break;
      }
      if (!publicUserId) publicUserId = crypto.randomBytes(5).toString("hex");

      await query(
        `INSERT INTO profiles (id, public_user_id, display_name, email, phone, blood_group, dob, father_name, mother_name, gender, marital_status, husband_name, document_type, document_url, avatar_url, address, state, country, pin_code, journalist_id, valid_till, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
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
          validTill,
        ],
      );
    } else {
      const existing = profRows[0];
      const patch: any = {
        display_name: details.displayName || existing.display_name,
        phone: details.phone || existing.phone,
        blood_group: details.bloodGroup || existing.blood_group,
        dob: details.dob || existing.dob,
        father_name: details.fatherName !== undefined ? (details.fatherName || null) : existing.father_name,
        mother_name: details.motherName !== undefined ? (details.motherName || null) : existing.mother_name,
        gender: details.gender !== undefined ? (details.gender || null) : existing.gender,
        marital_status: details.maritalStatus !== undefined ? (details.maritalStatus || null) : existing.marital_status,
        husband_name: details.husbandName !== undefined ? (details.husbandName || null) : existing.husband_name,
        document_type: details.documentType !== undefined ? (details.documentType || null) : existing.document_type,
        document_url: details.documentUrl !== undefined ? (details.documentUrl || null) : existing.document_url,
        address: details.address || existing.address,
        state: details.state || existing.state,
        country: details.country || existing.country,
        pin_code: details.pinCode || existing.pin_code,
        journalist_id: journalistId,
        valid_till: validTill,
        active: 1,
      };
      if (details.avatarUrl) {
        patch.avatar_url = details.avatarUrl;
      }

      const keys = Object.keys(patch);
      const setClause = keys.map((k) => `${k} = ?`).join(", ");
      await query(`UPDATE profiles SET ${setClause} WHERE id = ?`, [
        ...keys.map((k) => patch[k]),
        userId,
      ]);
    }

    // 3. Sync display_name to users table
    if (details.displayName) {
      await query("UPDATE users SET display_name = ? WHERE id = ?", [details.displayName, userId]);
    }

    // 4. Mark request as Approved
    await query("UPDATE inbox_requests SET status = 'Approved' WHERE id = ?", [data.requestId]);

    return { ok: true };
  });

