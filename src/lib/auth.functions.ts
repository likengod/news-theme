import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireAuth } from "@/lib/auth-middleware";
import crypto from "crypto";
import { query, hashPassword } from "./db.server";
import { z } from "zod";
import disposableDomains from "disposable-email-domains";

// Generator for public_user_id (10 digits)
async function generatePublicUserId(): Promise<string> {
  let candidate = "";
  for (let i = 0; i < 50; i++) {
    candidate = (1 + Math.floor(Math.random() * 9)).toString() +
      Math.floor(Math.random() * 1000000000).toString().padStart(9, "0");
    const existing = await query("SELECT id FROM profiles WHERE public_user_id = ?", [candidate]);
    if (existing.length === 0) return candidate;
  }
  return crypto.randomBytes(5).toString("hex");
}

export const signUpServer = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    displayName: z.string().max(50).optional(),
    turnstileToken: z.string().min(1, "Captcha verification is required")
  }).parse(data))
  .handler(async ({ data }) => {
    const { email, password, displayName, turnstileToken } = data;
    if (!email || !password) throw new Error("Email and password are required");

    // 1. Verify Turnstile Token
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
    const req = getRequest();
    const ip = req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req?.headers?.get("cf-connecting-ip") || 
               "unknown";

    if (turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${turnstileToken}&remoteip=${ip}`
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error("Captcha verification failed. Please try again.");
      }
    }

    // 2. Check for Disposable Email
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      throw new Error("Disposable email addresses are not allowed.");
    }

    // 3. IP Rate Limiting (1 account per 90 days)
    if (ip !== "unknown") {
      const logs = await query(
        "SELECT created_at FROM signup_logs WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 90 DAY)", 
        [ip]
      );
      if (logs.length > 0) {
        throw new Error("You can only create 1 account per 90 days from this network.");
      }
    }

    // Check if user already exists
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) throw new Error("User already exists");

    const userId = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    const passHash = hashPassword(password, salt);
    const name = displayName || email.split("@")[0];

    // Insert user
    await query(
      "INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)",
      [userId, email, passHash, salt, name]
    );

    // Insert role
    await query(
      "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)",
      [crypto.randomUUID(), userId, "reader"]
    );

    // Insert profile
    const publicUserId = await generatePublicUserId();
    await query(
      "INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)",
      [userId, publicUserId, name, email, true]
    );

    // Generate session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [token, userId, expiresAt]
    );

    if (ip !== "unknown") {
      await query("INSERT INTO signup_logs (ip_address) VALUES (?)", [ip]);
    }

    return {
      session: {
        access_token: token,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        user: { id: userId, email }
      },
      user: { id: userId, email }
    };
  });

export const signInServer = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    email: z.string().min(1, "Identifier is required"),
    password: z.string().min(1, "Password is required").optional()
  }).parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data;
    if (!email || !password) throw new Error("Email and password are required");

    const users = await query(
      `SELECT u.* FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.email = ? OR u.display_name = ? OR p.phone = ?`,
      [email, email, email]
    );
    if (users.length === 0) throw new Error("Invalid email, username, phone or password");

    const user = users[0];
    
    // Support lazy migration for legacy passwords
    const passHash = hashPassword(password, user.salt || undefined);
    if (user.password_hash !== passHash) throw new Error("Invalid email, username, phone or password");

    // Retroactive secure migration for users missing a salt
    if (!user.salt) {
      const newSalt = crypto.randomBytes(16).toString("hex");
      const newPassHash = hashPassword(password, newSalt);
      await query("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?", [newPassHash, newSalt, user.id]);
    }

    // Generate session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
      [token, user.id, expiresAt]
    );

    return {
      session: {
        access_token: token,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        user: { id: user.id, email: user.email }
      },
      user: { id: user.id, email: user.email }
    };
  });

export const signOutServer = createServerFn({ method: "POST" })
  .validator((data) => z.object({ token: z.string() }).parse(data))
  .handler(async ({ data }) => {
    if (data.token) {
      await query("DELETE FROM sessions WHERE id = ?", [data.token]);
    }
    return { error: null };
  });

export const getSessionServer = createServerFn({ method: "GET" })
  .validator((token) => z.string().parse(token))
  .handler(async ({ data: token }) => {
    if (!token) return { session: null };

    const sessions = await query(
      `SELECT s.*, u.email FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [token]
    );

    if (sessions.length === 0) return { session: null };

    const session = sessions[0];
    return {
      session: {
        access_token: token,
        user: { id: session.user_id, email: session.email }
      }
    };
  });

export const getUserServer = createServerFn({ method: "GET" })
  .validator((token) => z.string().parse(token))
  .handler(async ({ data: token }) => {
    if (!token) return { user: null };

    const sessions = await query(
      `SELECT s.*, u.email FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [token]
    );

    if (sessions.length === 0) return { user: null };

    const session = sessions[0];
    return {
      user: { id: session.user_id, email: session.email }
    };
  });

export const getProfileServer = createServerFn({ method: "GET" })
  .validator((userId) => z.string().uuid().parse(userId))
  .handler(async ({ data: userId }) => {
    const profiles = await query("SELECT * FROM profiles WHERE id = ?", [userId]);
    if (profiles.length === 0) return null;
    return profiles[0];
  });

export const getCurrentUserRole = createServerFn({ method: "GET" })
  .validator((token) => z.string().parse(token))
  .handler(async ({ data: token }) => {
    if (!token) return { role: null };
    const sessions = await query(
      `SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()`,
      [token]
    );
    if (sessions.length === 0) return { role: null };
    const roles = await query("SELECT role FROM user_roles WHERE user_id = ?", [sessions[0].user_id]);
    if (roles.length === 0) return { role: null };
    return { role: roles[0].role };
  });

export const changeMyPassword = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({ password: z.string().min(8, "Password must be at least 8 characters") }).parse(data))
  .handler(async ({ data, context }) => {
    const newSalt = crypto.randomBytes(16).toString("hex");
    const passHash = hashPassword(data.password, newSalt);
    await query("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?", [passHash, newSalt, context.userId]);

    // Delete other active sessions except the currently active one
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

    if (token) {
      await query("DELETE FROM sessions WHERE user_id = ? AND id != ?", [context.userId, token]);
    } else {
      await query("DELETE FROM sessions WHERE user_id = ?", [context.userId]);
    }
    return { ok: true };
  });

export const getCurrentUserProfile = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const profiles = await query("SELECT * FROM profiles WHERE id = ?", [context.userId]);
    if (profiles.length === 0) throw new Error("Profile not found");

    const rolesRows = await query("SELECT role FROM user_roles WHERE user_id = ?", [context.userId]);
    const roles = rolesRows.map((r: any) => r.role);

    return {
      profile: profiles[0],
      roles,
    };
  });

export const updateCurrentUserProfile = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({
    phone: z.string().max(20).optional(),
    bank_name: z.string().max(100).optional(),
    bank_account_name: z.string().max(100).optional(),
    bank_account_no: z.string().max(50).optional(),
    bank_ifsc: z.string().max(20).optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.phone !== undefined) {
      fields.push("phone = ?");
      values.push(data.phone);
    }
    if (data.bank_name !== undefined) {
      fields.push("bank_name = ?");
      values.push(data.bank_name);
    }
    if (data.bank_account_name !== undefined) {
      fields.push("bank_account_name = ?");
      values.push(data.bank_account_name);
    }
    if (data.bank_account_no !== undefined) {
      fields.push("bank_account_no = ?");
      values.push(data.bank_account_no);
    }
    if (data.bank_ifsc !== undefined) {
      fields.push("bank_ifsc = ?");
      values.push(data.bank_ifsc);
    }

    if (fields.length === 0) return { ok: true };

    values.push(context.userId);
    await query(`UPDATE profiles SET ${fields.join(", ")} WHERE id = ?`, values);
    return { ok: true };
  });

export const requestCurrentUserAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    await query("UPDATE profiles SET delete_requested = TRUE WHERE id = ?", [context.userId]);
    return { ok: true };
  });
