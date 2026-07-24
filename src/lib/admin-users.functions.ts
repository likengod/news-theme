import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireAuth } from "@/lib/auth-middleware";
import { query, hashPassword } from "./db.server";
import crypto from "crypto";

type AppRole = "admin" | "editor" | "author" | "journalist" | "premium" | "reader";

export type AdminUserRow = {
  id: string;
  email: string;
  publicUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: AppRole;
  points: number;
  createdAt: string;
  status: "Active" | "Suspended";
};

async function assertAdmin(userId: string) {
  const roles = await query("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'", [userId]);
  if (roles.length === 0) throw new Error("Forbidden: admin role required");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .validator((data?: { q?: string; role?: string; sort?: string; page?: number; limit?: number }) => data ?? {})
  .handler(async ({ context, data }): Promise<{ rows: AdminUserRow[]; total: number; totalPages: number }> => {
    await assertAdmin(context.userId);

    const { q = "", role = "all", sort = "recent", page = 1, limit = 20 } = data;
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    let filterSql = " WHERE 1=1";
    const params: any[] = [];

    if (q) {
      filterSql += " AND (u.email LIKE ? OR p.display_name LIKE ? OR p.public_user_id LIKE ?)";
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    if (role && role !== "all") {
      filterSql += " AND r.role = ?";
      params.push(role);
    }

    let orderSql = " ORDER BY u.created_at DESC";
    if (sort === "points_desc") orderSql = " ORDER BY p.points DESC, u.created_at DESC";
    else if (sort === "points_asc") orderSql = " ORDER BY p.points ASC, u.created_at DESC";
    else if (sort === "name") orderSql = " ORDER BY p.display_name ASC, u.email ASC";

    const [countRes, rows] = await Promise.all([
      query(
        `SELECT COUNT(DISTINCT u.id) AS total
         FROM users u
         LEFT JOIN profiles p ON u.id = p.id
         LEFT JOIN user_roles r ON u.id = r.user_id
         ${filterSql}`,
        params
      ),
      query(
        `SELECT 
           u.id, 
           u.email, 
           u.created_at,
           p.public_user_id, 
           p.display_name, 
           p.avatar_url, 
           p.points, 
           p.active,
           r.role
         FROM users u
         LEFT JOIN profiles p ON u.id = p.id
         LEFT JOIN user_roles r ON u.id = r.user_id
         ${filterSql}
         ${orderSql}
         LIMIT ? OFFSET ?`,
        [...params, safeLimit, offset]
      ),
    ]);

    const total = Number(countRes[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    const mappedRows: AdminUserRow[] = rows.map((u: any) => ({
      id: u.id,
      email: u.email,
      publicUserId: u.public_user_id || "0000000000",
      displayName: u.display_name || null,
      avatarUrl: u.avatar_url || null,
      role: (u.role || "reader") as AppRole,
      points: Number(u.points || 0),
      createdAt: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString(),
      status: u.active === 0 || u.active === false ? "Suspended" : "Active",
    }));

    return { rows: mappedRows, total, totalPages };
  });

export const getAllAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.userId);
    const rows = await query(`
      SELECT 
        u.id, 
        u.email, 
        u.created_at,
        p.public_user_id, 
        p.display_name, 
        p.avatar_url, 
        p.points, 
        p.active,
        r.role
      FROM users u
      LEFT JOIN profiles p ON u.id = p.id
      LEFT JOIN user_roles r ON u.id = r.user_id
      ORDER BY u.created_at DESC
    `);
    
    return rows.map((u: any) => ({
      id: u.id,
      email: u.email,
      publicUserId: u.public_user_id || "0000000000",
      displayName: u.display_name || null,
      avatarUrl: u.avatar_url || null,
      role: (u.role || "reader") as AppRole,
      points: Number(u.points || 0),
      createdAt: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString(),
      status: u.active === 0 || u.active === false ? "Suspended" : "Active",
    }));
  });

export const importAdminUsers = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((users: any[]) => users)
  .handler(async ({ data: users, context }) => {
    await assertAdmin(context.userId);
    if (!users || users.length === 0) return { success: true };

    for (const u of users) {
      if (!u.email) continue;
      
      const check = await query("SELECT id FROM users WHERE email = ?", [u.email]);
      if (check.length > 0) {
        // Skip existing to avoid password overwriting complexities, or handle gracefully
        // For simplicity, we just skip existing ones for import
        continue;
      }
      
      const uid = crypto.randomUUID();
      const passHash = hashPassword("User@123"); // Default password
      const name = u.displayName || u.email.split("@")[0];
      const role = u.role || "reader";
      
      await query(
        "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)",
        [uid, u.email, passHash, name]
      );
      
      await query(
        "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)",
        [crypto.randomUUID(), uid, role]
      );
      
      // Gen public user ID
      let publicUserId = u.publicUserId || crypto.randomBytes(5).toString("hex");
      if (!u.publicUserId) {
        for (let i = 0; i < 10; i++) {
          const candidate = (1 + Math.floor(Math.random() * 9)).toString() +
            Math.floor(Math.random() * 1000000000).toString().padStart(9, "0");
          const existing = await query("SELECT id FROM profiles WHERE public_user_id = ?", [candidate]);
          if (existing.length === 0) {
            publicUserId = candidate;
            break;
          }
        }
      }
      
      let journalistId = null;
      if (role === "journalist") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        journalistId = 
          letters[Math.floor(Math.random() * 26)] +
          letters[Math.floor(Math.random() * 26)] +
          letters[Math.floor(Math.random() * 26)] +
          Math.floor(Math.random() * 10000).toString().padStart(4, "0") +
          letters[Math.floor(Math.random() * 26)];
      }

      await query(
        `INSERT INTO profiles (id, public_user_id, display_name, email, active, points, journalist_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uid, publicUserId, name, u.email, u.status === "Suspended" ? 0 : 1, Number(u.points || 0), journalistId]
      );
    }
    
    return { success: true };
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(
    (data: {
      email: string;
      password: string;
      displayName?: string;
      role?: AppRole;
    }) => {
      if (!data.email || !data.email.includes("@")) throw new Error("Valid email required");
      if (!data.password || data.password.length < 8)
        throw new Error("Password must be at least 8 characters");
      return data;
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const check = await query("SELECT id FROM users WHERE email = ?", [data.email]);
    if (check.length > 0) throw new Error("User already exists");

    const uid = crypto.randomUUID();
    const passHash = hashPassword(data.password);
    const name = data.displayName || data.email.split("@")[0];

    // Insert user
    await query(
      "INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)",
      [uid, data.email, passHash, name]
    );

    // Insert role
    const role = data.role || "reader";
    await query(
      "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)",
      [crypto.randomUUID(), uid, role]
    );

    // Generate public user ID
    let publicUserId = "";
    for (let i = 0; i < 50; i++) {
      publicUserId = (1 + Math.floor(Math.random() * 9)).toString() +
        Math.floor(Math.random() * 1000000000).toString().padStart(9, "0");
      const existing = await query("SELECT id FROM profiles WHERE public_user_id = ?", [publicUserId]);
      if (existing.length === 0) break;
    }
    if (!publicUserId) publicUserId = crypto.randomBytes(5).toString("hex");

    // Insert profile
    let journalistId = null;
    if (role === "journalist") {
      // 3 letters + 4 digits + 1 letter
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      journalistId = 
        letters[Math.floor(Math.random() * 26)] +
        letters[Math.floor(Math.random() * 26)] +
        letters[Math.floor(Math.random() * 26)] +
        Math.floor(Math.random() * 10000).toString().padStart(4, "0") +
        letters[Math.floor(Math.random() * 26)];
    }

    await query(
      `INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uid, publicUserId, name, data.email, true, journalistId]
    );

    return { ok: true, id: uid };
  });

export const setAdminUserRole = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string; role: AppRole }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    // Delete old roles
    await query("DELETE FROM user_roles WHERE user_id = ?", [data.userId]);
    // Insert new role
    await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [crypto.randomUUID(), data.userId, data.role]);

    // Check journalist promotion
    if (data.role === "journalist") {
      const profs = await query("SELECT journalist_id FROM profiles WHERE id = ?", [data.userId]);
      if (profs.length > 0 && !profs[0].journalist_id) {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const gen = 
          letters[Math.floor(Math.random() * 26)] +
          letters[Math.floor(Math.random() * 26)] +
          letters[Math.floor(Math.random() * 26)] +
          Math.floor(Math.random() * 10000).toString().padStart(4, "0") +
          letters[Math.floor(Math.random() * 26)];
        
        await query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [gen, data.userId]);
      }
    }

    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete yourself");

    await query("DELETE FROM users WHERE id = ?", [data.userId]);
    return { ok: true };
  });

export const toggleAdminUserBan = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string; suspend: boolean }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot suspend yourself");

    await query("UPDATE profiles SET active = ? WHERE id = ?", [data.suspend ? 0 : 1, data.userId]);
    return { ok: true };
  });

export const bulkDeleteAdminUsers = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const validIds = (data.userIds ?? []).filter((id) => id !== context.userId);
    if (validIds.length === 0) return { ok: true, deletedCount: 0 };

    const placeholders = validIds.map(() => "?").join(",");
    await query(`DELETE FROM users WHERE id IN (${placeholders})`, validIds);
    return { ok: true, deletedCount: validIds.length };
  });

export const bulkToggleAdminUserBan = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userIds: string[]; suspend: boolean }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const validIds = (data.userIds ?? []).filter((id) => id !== context.userId);
    if (validIds.length === 0) return { ok: true, updatedCount: 0 };

    const placeholders = validIds.map(() => "?").join(",");
    await query(`UPDATE profiles SET active = ? WHERE id IN (${placeholders})`, [data.suspend ? 0 : 1, ...validIds]);
    return { ok: true, updatedCount: validIds.length };
  });

export const regeneratePublicUserId = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    
    let candidate = "";
    for (let i = 0; i < 20; i++) {
      const first = 1 + Math.floor(Math.random() * 9);
      const rest = Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0");
      candidate = `${first}${rest}`;
      try {
        await query("UPDATE profiles SET public_user_id = ? WHERE id = ?", [candidate, data.userId]);
        return { ok: true, publicUserId: candidate };
      } catch (err: any) {
        if (!/duplicate|unique/i.test(err.message)) throw err;
      }
    }
    throw new Error("Could not generate unique ID");
  });

export const setUserPoints = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(
    (data: { userId: string; mode: "set" | "add"; amount: number }) => {
      if (!data.userId) throw new Error("userId required");
      if (typeof data.amount !== "number" || Number.isNaN(data.amount))
        throw new Error("amount must be a number");
      return data;
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    
    let next = data.amount;
    if (data.mode === "add") {
      const cur = await query("SELECT points FROM profiles WHERE id = ?", [data.userId]);
      next = Number(cur[0]?.points || 0) + data.amount;
    }
    if (next < 0) next = 0;
    
    await query("UPDATE profiles SET points = ? WHERE id = ?", [next, data.userId]);
    return { ok: true, points: next };
  });

export const updateAdminUserPassword = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string; password: string }) => {
    if (!data.password || data.password.length < 8)
      throw new Error("Password must be at least 8 characters");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    
    const passHash = hashPassword(data.password);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [passHash, data.userId]);
    
    // Invalidate all active sessions for the user except the currently active admin session token
    // (so the admin is not logged out if they change their own password, but other devices are logged out)
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

    if (token) {
      await query("DELETE FROM sessions WHERE user_id = ? AND id != ?", [data.userId, token]);
    } else {
      await query("DELETE FROM sessions WHERE user_id = ?", [data.userId]);
    }
    return { ok: true };
  });

export const updateAdminUserDetails = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator(
    (data: { userId: string; email?: string; displayName?: string; avatarUrl?: string }) => data,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.email) {
      // Check existing email
      const check = await query("SELECT id FROM users WHERE email = ? AND id != ?", [data.email, data.userId]);
      if (check.length > 0) throw new Error("Email already in use");

      await query("UPDATE users SET email = ? WHERE id = ?", [data.email, data.userId]);
      await query("UPDATE profiles SET email = ? WHERE id = ?", [data.email, data.userId]);
    }

    if (data.displayName !== undefined) {
      await query("UPDATE users SET display_name = ? WHERE id = ?", [data.displayName, data.userId]);
      await query("UPDATE profiles SET display_name = ? WHERE id = ?", [data.displayName, data.userId]);
    }

    if (data.avatarUrl !== undefined) {
      await query("UPDATE users SET avatar_url = ? WHERE id = ?", [data.avatarUrl, data.userId]);
      await query("UPDATE profiles SET avatar_url = ? WHERE id = ?", [data.avatarUrl, data.userId]);
    }

    return { ok: true };
  });

export const deleteAdminUsersBulk = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userIds: string[] }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const ids = data.userIds.filter((id) => id !== context.userId);
    if (ids.length === 0) return { ok: true, count: 0 };

    const placeholders = ids.map(() => "?").join(",");
    await query(`DELETE FROM users WHERE id IN (${placeholders})`, ids);
    return { ok: true, count: ids.length };
  });
