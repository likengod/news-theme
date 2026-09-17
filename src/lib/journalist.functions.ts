import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireAuth } from "@/lib/auth-middleware";
import { query, hashPassword } from "./db.server";
import { persistDocumentImage } from "./ad-storage.server";
import { DEFAULT_RANKS, rankForCount } from "./journalist-ranks";
import crypto from "crypto";

export type JournalistListRow = {
  userId: string;
  journalistId: string | null;
  publicUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
  points: number;
  createdAt: string;
  active: boolean;
  email: string | null;
  phone: string | null;
  bloodGroup: string | null;
  dob: string | null;
  validTill: string | null;
  fatherName: string | null;
  motherName: string | null;
  gender: string | null;
  maritalStatus: string | null;
  husbandName: string | null;
  documentType: string | null;
  documentUrl: string | null;
  address: string | null;
  state: string | null;
  country: string | null;
  pinCode: string | null;
  articlesPublished: number;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNo: string | null;
  bankIfsc: string | null;
};

async function assertAdmin(userId: string) {
  const roles = await query("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'", [
    userId,
  ]);
  if (roles.length === 0) throw new Error("Forbidden: admin role required");
}

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

export const listJournalists = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }): Promise<JournalistListRow[]> => {
    await assertAdmin(context.userId);

    const profiles = await query(`
      SELECT p.* 
      FROM profiles p
      INNER JOIN user_roles ur ON p.id = ur.user_id
      WHERE ur.role = 'journalist'
    `);

    if (profiles.length === 0) return [];

    // Fetch actual published articles count from MySQL database
    const stats = await query(
      `SELECT journalistId, COUNT(*) as count 
       FROM articles 
       WHERE status = 'Published' AND journalistId IS NOT NULL 
       GROUP BY journalistId`,
    );
    const countMap = new Map<string, number>();
    for (const r of stats) {
      if (r.journalistId) {
        countMap.set(r.journalistId.trim(), Number(r.count || 0));
      }
    }

    const updates: Promise<any>[] = [];

    // Backfill journalist_id and sync actual articles_published count
    for (const p of profiles) {
      if (!p.journalist_id) {
        const gen = await generateJournalistId();
        updates.push(query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [gen, p.id]));
        p.journalist_id = gen;
      }
      const actualCount = countMap.get(p.journalist_id.trim()) ?? 0;
      if (Number(p.articles_published ?? 0) !== actualCount) {
        updates.push(query("UPDATE profiles SET articles_published = ? WHERE id = ?", [actualCount, p.id]));
        p.articles_published = actualCount;
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return profiles.map((p: any) => ({
      userId: p.id,
      journalistId: p.journalist_id ?? null,
      publicUserId: p.public_user_id,
      displayName: p.display_name,
      avatarUrl: p.avatar_url,
      points: Number(p.points ?? 0),
      createdAt: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
      active: Number(p.active) !== 0 && p.active !== false && p.active !== "0" && p.active !== null,
      email: p.email ?? null,
      phone: p.phone ?? null,
      bloodGroup: p.blood_group ?? null,
      dob: p.dob ?? p.date_of_birth ?? null,
      validTill: p.valid_till ?? null,
      fatherName: p.father_name ?? null,
      motherName: p.mother_name ?? null,
      gender: p.gender ?? null,
      maritalStatus: p.marital_status ?? null,
      husbandName: p.husband_name ?? null,
      documentType: p.document_type ?? null,
      documentUrl: p.document_url ?? null,
      address: p.address ?? null,
      state: p.state ?? null,
      country: p.country ?? null,
      pinCode: p.pin_code ?? null,
      articlesPublished: Number(p.articles_published ?? 0),
      bankName: p.bank_name ?? null,
      bankAccountName: p.bank_account_name ?? null,
      bankAccountNo: p.bank_account_no ?? null,
      bankIfsc: p.bank_ifsc ?? null,
    }));
  });

export type JournalistLookup =
  | { found: false }
  | {
      found: true;
      userId: string;
      verified: boolean;
      active: boolean;
      role: string;
      displayName: string | null;
      publicUserId: string;
      journalistId: string | null;
      avatarUrl: string | null;
      email: string | null;
      phone: string | null;
      bloodGroup: string | null;
      dob: string | null;
      validTill: string | null;
      fatherName: string | null;
      motherName: string | null;
      gender: string | null;
      maritalStatus: string | null;
      husbandName: string | null;
      address: string | null;
      state: string | null;
      country: string | null;
      pinCode: string | null;
      articlesPublished: number;
      memberSince: string;
    };

const JOURNALIST_ROLES = new Set(["author", "editor", "admin"]);
const JOURNALIST_ROLES_ALL = new Set(["author", "editor", "admin", "journalist"]);

export const lookupJournalist = createServerFn({ method: "POST" })
  .inputValidator((data: { publicUserId: string }) => {
    const id = String(data?.publicUserId ?? "").trim();
    if (id.length < 3) throw new Error("Enter a valid Journalist ID, User ID, or Phone Number");
    return { publicUserId: id };
  })
  .handler(async ({ data }): Promise<JournalistLookup> => {
    const q = data.publicUserId;
    const cleanId = q.toUpperCase().replace(/-/g, "");
    const cleanDigits = q.replace(/\D/g, "");
    const last10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : "";

    let sql = `SELECT * FROM profiles 
               WHERE public_user_id = ? 
                  OR REPLACE(journalist_id, '-', '') = ?`;
    const params: any[] = [q, cleanId];
    if (last10) {
      sql += ` OR REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+', ''), '-', ''), '(', '') LIKE ?`;
      params.push(`%${last10}`);
    }
    sql += " LIMIT 1";

    const profiles = await query(sql, params);

    if (profiles.length === 0) return { found: false };
    const p = profiles[0];

    const roles = await query("SELECT role FROM user_roles WHERE user_id = ?", [p.id]);
    const rank: Record<string, number> = {
      admin: 5,
      editor: 4,
      author: 3,
      journalist: 3,
      premium: 2,
      reader: 1,
    };
    const best =
      roles
        .map((r: any) => r.role as string)
        .sort((a: string, b: string) => (rank[b] ?? 0) - (rank[a] ?? 0))[0] ?? "reader";

    return {
      found: true,
      userId: p.id,
      verified: JOURNALIST_ROLES_ALL.has(best),
      active: Number(p.active) !== 0 && p.active !== false && p.active !== "0" && p.active !== null,
      role: best,
      displayName: p.display_name,
      publicUserId: p.public_user_id,
      journalistId: p.journalist_id ?? null,
      avatarUrl: p.avatar_url ?? null,
      email: p.email ?? null,
      phone: p.phone ?? null,
      bloodGroup: p.blood_group ?? null,
      dob: p.dob ?? p.date_of_birth ?? null,
      validTill: p.valid_till ?? null,
      fatherName: p.father_name ?? null,
      motherName: p.mother_name ?? null,
      gender: p.gender ?? null,
      maritalStatus: p.marital_status ?? null,
      husbandName: p.husband_name ?? null,
      address: p.address ?? null,
      state: p.state ?? null,
      country: p.country ?? null,
      pinCode: p.pin_code ?? null,
      articlesPublished: Number(p.articles_published ?? 0),
      memberSince: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
    };
  });

export type JournalistPrivateStats =
  | { authorized: false }
  | {
      authorized: true;
      publishedTotal: number;
      publishedLastMonth: number;
      publishedLastYear: number;
      rankName: string;
      rankColor: string;
      rankPointsPerNews: number;
      walletPoints: number;
    };

export const getJournalistPrivateStats = createServerFn({ method: "POST" })
  .inputValidator((data: { targetUserId: string; sessionToken?: string }) => {
    if (!data?.targetUserId) throw new Error("targetUserId is required");
    return {
      targetUserId: String(data.targetUserId).trim(),
      sessionToken: data.sessionToken ? String(data.sessionToken).trim() : undefined,
    };
  })
  .handler(async ({ data }): Promise<JournalistPrivateStats> => {
    // 1. Determine viewer's identity and authenticate session
    let token = data.sessionToken;
    if (!token) {
      try {
        const req = getRequest();
        const authHeader = req?.headers?.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "").trim();
        }
      } catch {}
    }

    if (!token) {
      return { authorized: false };
    }

    const sessions = await query(
      `SELECT user_id FROM sessions WHERE id = ? AND expires_at > NOW()`,
      [token],
    );
    if (sessions.length === 0) {
      return { authorized: false };
    }

    const viewerUserId = sessions[0].user_id;

    // Check roles of viewer
    const rolesRows = await query(`SELECT role FROM user_roles WHERE user_id = ?`, [viewerUserId]);
    const viewerRoles = rolesRows.map((r: any) => String(r.role).toLowerCase());
    const isAdminOrEditor = viewerRoles.includes("admin") || viewerRoles.includes("editor");
    const isOwnerJournalist = viewerUserId === data.targetUserId;

    // Only the journalist themselves or an admin/editor can view private performance & wallet metrics
    if (!isAdminOrEditor && !isOwnerJournalist) {
      return { authorized: false };
    }

    // 2. Fetch target profile
    const targetProfiles = await query(`SELECT * FROM profiles WHERE id = ?`, [data.targetUserId]);
    if (targetProfiles.length === 0) {
      return { authorized: false };
    }
    const p = targetProfiles[0];

    // 3. Count published news: total, last month, last year
    const artStats = await query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as last_month,
         SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 365 DAY) THEN 1 ELSE 0 END) as last_year
       FROM articles 
       WHERE status = 'Published' 
         AND (journalistId = ? OR journalistId = ? OR journalistId = ?)`,
      [p.public_user_id, p.journalist_id ?? "", p.id],
    );

    const artTotal = Number(artStats[0]?.total ?? 0);
    const publishedTotal = Math.max(Number(p.articles_published ?? 0), artTotal);
    const publishedLastMonth = Number(artStats[0]?.last_month ?? 0);
    const publishedLastYear = Number(artStats[0]?.last_year ?? 0);

    // 4. Derive rank configuration
    let ranks = DEFAULT_RANKS;
    try {
      const settingRows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'journalist_ranks_config'",
      );
      if (settingRows.length > 0 && settingRows[0].value) {
        const parsed = JSON.parse(settingRows[0].value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ranks = [...parsed].sort((a: any, b: any) => a.minNews - b.minNews);
        }
      }
    } catch {}

    const rankMatch = rankForCount(publishedTotal, ranks);
    const rankName = rankMatch ? rankMatch.name : "Reporter";
    const rankColor = rankMatch ? rankMatch.color : "emerald";
    const rankPointsPerNews = rankMatch ? rankMatch.pointsPerNews : 5;

    return {
      authorized: true,
      publishedTotal,
      publishedLastMonth,
      publishedLastYear,
      rankName,
      rankColor,
      rankPointsPerNews,
      walletPoints: Number(p.points ?? 0),
    };
  });

export type JournalistSearchResult = {
  userId: string;
  publicUserId: string;
  displayName: string | null;
  role: string;
  verified: boolean;
};

export const searchJournalists = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { query: string }) => {
    const query = String(data?.query ?? "").trim();
    if (query.length < 2) throw new Error("Enter at least 2 characters");
    return { query };
  })
  .handler(async ({ data, context }): Promise<JournalistSearchResult[]> => {
    await assertAdmin(context.userId);

    const q = data.query;
    const isNumeric = /^\d+$/.test(q);

    let profiles;
    if (isNumeric) {
      profiles = await query(
        "SELECT id, display_name, public_user_id FROM profiles WHERE public_user_id LIKE ? LIMIT 12",
        [`${q}%`],
      );
    } else {
      profiles = await query(
        "SELECT id, display_name, public_user_id FROM profiles WHERE display_name LIKE ? LIMIT 12",
        [`%${q}%`],
      );
    }

    if (profiles.length === 0) return [];

    const ids = profiles.map((p: any) => p.id);
    const placeholders = ids.map(() => "?").join(",");
    const roles = await query(
      `SELECT user_id, role FROM user_roles WHERE user_id IN (${placeholders})`,
      ids,
    );

    const bestRole = new Map<string, string>();
    const rank: Record<string, number> = {
      admin: 5,
      editor: 4,
      author: 3,
      journalist: 3,
      premium: 2,
      reader: 1,
    };
    roles.forEach((r: any) => {
      const cur = bestRole.get(r.user_id);
      if (!cur || rank[r.role] > rank[cur]) {
        bestRole.set(r.user_id, r.role);
      }
    });

    return profiles.map((p: any) => {
      const role = bestRole.get(p.id) ?? "reader";
      return {
        userId: p.id,
        publicUserId: p.public_user_id,
        displayName: p.display_name,
        role,
        verified: JOURNALIST_ROLES.has(role),
      };
    });
  });

export type AwardResult = {
  publicUserId: string;
  displayName: string | null;
  awarded: number;
  newBalance: number;
};

export const awardJournalistPoints = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { publicUserId: string; points: number; reason?: string }) => {
    const publicUserId = String(data?.publicUserId ?? "").trim();
    const points = Math.floor(Number(data?.points));
    if (!/^\d{10}$/.test(publicUserId)) throw new Error("Invalid 10-digit User ID");
    if (!Number.isFinite(points) || points === 0) throw new Error("Enter a non-zero point amount");
    if (Math.abs(points) > 100000) throw new Error("Amount too large (max ±100000)");
    const reason =
      String(data?.reason ?? "")
        .trim()
        .slice(0, 200) || null;
    return { publicUserId, points, reason };
  })
  .handler(async ({ data, context }): Promise<AwardResult> => {
    await assertAdmin(context.userId);

    const profiles = await query(
      "SELECT id, display_name, public_user_id, points FROM profiles WHERE public_user_id = ?",
      [data.publicUserId],
    );
    if (profiles.length === 0) throw new Error("Journalist not found");
    const p = profiles[0];

    const newBalance = Number(p.points ?? 0) + data.points;
    await query("UPDATE profiles SET points = ? WHERE id = ?", [newBalance, p.id]);

    return {
      publicUserId: p.public_user_id,
      displayName: p.display_name,
      awarded: data.points,
      newBalance,
    };
  });

export type JournalistUpsertInput = {
  userId?: string;
  email: string;
  password?: string;
  displayName: string;
  phone?: string;
  bloodGroup?: string;
  dob?: string;
  validTill?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  maritalStatus?: string;
  husbandName?: string;
  documentType?: string;
  documentUrl?: string;
  address?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  avatarUrl?: string;
  articlesPublished?: number;
  points?: number;
  active?: boolean;
};

function cleanText(v: unknown, max = 200): string | null {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
}

export const upsertJournalist = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: JournalistUpsertInput) => {
    const email = String(data?.email ?? "")
      .trim()
      .toLowerCase();
    const displayName = String(data?.displayName ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email required");
    if (!displayName) throw new Error("Name is required");
    if (!data.userId && (!data.password || data.password.length < 8)) {
      throw new Error("Password (min 8 chars) required for new journalists");
    }
    return {
      userId: data.userId,
      email,
      password: data.password,
      displayName: displayName.slice(0, 100),
      phone: cleanText(data.phone, 40),
      bloodGroup: cleanText(data.bloodGroup, 8),
      dob: cleanText(data.dob, 40),
      validTill: cleanText(data.validTill, 40),
      fatherName: cleanText(data.fatherName, 255),
      motherName: cleanText(data.motherName, 255),
      gender: cleanText(data.gender, 50),
      maritalStatus: cleanText(data.maritalStatus, 50),
      husbandName:
        data.gender === "Female" && data.maritalStatus === "Married"
          ? cleanText(data.husbandName, 255)
          : null,
      documentType: cleanText(data.documentType, 100),
      documentUrl: data.documentUrl ? String(data.documentUrl).trim() : undefined,
      address: cleanText(data.address, 300),
      state: cleanText(data.state, 80),
      country: cleanText(data.country, 80),
      pinCode: cleanText(data.pinCode, 20),
      avatarUrl: cleanText(data.avatarUrl, 500),
      articlesPublished: Number.isFinite(data.articlesPublished)
        ? Math.max(0, Math.floor(Number(data.articlesPublished)))
        : undefined,
      points: Number.isFinite(data.points)
        ? Math.max(0, Math.floor(Number(data.points)))
        : undefined,
      active: typeof data.active === "boolean" ? data.active : undefined,
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    let userId = data.userId ?? "";

    if (!userId) {
      // Create new user
      const check = await query("SELECT id FROM users WHERE email = ?", [data.email]);
      if (check.length > 0) throw new Error("User with this email already exists");

      userId = crypto.randomUUID();
      const salt = crypto.randomBytes(16).toString("hex");
      const passHash = hashPassword(data.password!, salt);

      await query(
        "INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)",
        [userId, data.email, passHash, salt, data.displayName],
      );

      // Journalist role
      await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
        crypto.randomUUID(),
        userId,
        "journalist",
      ]);

      // Public User ID
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

      const journalistId = await generateJournalistId();
      const savedDocUrl = data.documentUrl
        ? (data.documentUrl.startsWith("data:image/") ? persistDocumentImage(data.documentUrl, "doc") : data.documentUrl)
        : null;

      await query(
        `INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id, phone, blood_group, dob, valid_till, father_name, mother_name, gender, marital_status, husband_name, document_type, document_url, address, state, country, pin_code, avatar_url, articles_published, points) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          publicUserId,
          data.displayName,
          data.email,
          true,
          journalistId,
          data.phone,
          data.bloodGroup,
          data.dob,
          data.validTill,
          data.fatherName,
          data.motherName,
          data.gender,
          data.maritalStatus,
          data.husbandName,
          data.documentType ?? null,
          savedDocUrl,
          data.address,
          data.state,
          data.country,
          data.pinCode,
          data.avatarUrl,
          data.articlesPublished || 0,
          data.points || 0,
        ],
      );
    } else {
      // Update existing
      if (data.password) {
        const salt = crypto.randomBytes(16).toString("hex");
        const passHash = hashPassword(data.password, salt);
        await query("UPDATE users SET password_hash = ?, salt = ?, email = ? WHERE id = ?", [
          passHash,
          salt,
          data.email,
          userId,
        ]);
      } else {
        await query("UPDATE users SET email = ? WHERE id = ?", [data.email, userId]);
      }

      const savedDocUrl = data.documentUrl
        ? (data.documentUrl.startsWith("data:image/") ? persistDocumentImage(data.documentUrl, "doc") : data.documentUrl)
        : data.documentUrl;

      const patch: any = {
        display_name: data.displayName,
        email: data.email,
        phone: data.phone,
        blood_group: data.bloodGroup,
        dob: data.dob,
        valid_till: data.validTill,
        father_name: data.fatherName,
        mother_name: data.motherName,
        gender: data.gender,
        marital_status: data.maritalStatus,
        husband_name: data.husbandName,
        address: data.address,
        state: data.state,
        country: data.country,
        pin_code: data.pinCode,
      };
      if (data.documentType !== undefined) patch.document_type = data.documentType;
      if (savedDocUrl !== undefined) patch.document_url = savedDocUrl;
      if (data.avatarUrl !== null) patch.avatar_url = data.avatarUrl;
      if (typeof data.articlesPublished === "number")
        patch.articles_published = data.articlesPublished;
      if (typeof data.points === "number") patch.points = data.points;
      if (typeof data.active === "boolean") patch.active = data.active ? 1 : 0;

      const keys = Object.keys(patch);
      const setClause = keys
        .map((k) => `${k.replace(/([A-Z])/g, "_$1").toLowerCase()} = ?`)
        .join(", ");
      await query(`UPDATE profiles SET ${setClause} WHERE id = ?`, [
        ...keys.map((k) => patch[k]),
        userId,
      ]);

      // Ensure a journalist_id exists
      const profs = await query("SELECT journalist_id FROM profiles WHERE id = ?", [userId]);
      if (profs.length > 0 && !profs[0].journalist_id) {
        const gen = await generateJournalistId();
        await query("UPDATE profiles SET journalist_id = ? WHERE id = ?", [gen, userId]);
      }
    }

    return { ok: true, userId };
  });

export const setJournalistActive = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string; active: boolean }) => {
    if (!data?.userId) throw new Error("userId required");
    return { userId: String(data.userId), active: !!data.active };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    await query("UPDATE profiles SET active = ? WHERE id = ?", [data.active, data.userId]);
    return { ok: true };
  });

export const deleteJournalist = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((data: { userId: string }) => {
    if (!data?.userId) throw new Error("userId required");
    return { userId: String(data.userId) };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete yourself");

    await query("DELETE FROM users WHERE id = ?", [data.userId]);
    return { ok: true };
  });
