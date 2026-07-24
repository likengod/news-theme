const PENDING_CLAIMS_KEY = "nt:pending-social-claims:v1";

export type PendingClaim = {
  id: string;
  userId: string;
  userName: string;
  platform: string;
  handle: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  points: number;
};

export function loadAllPendingClaims(): PendingClaim[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_CLAIMS_KEY);
    if (raw) return JSON.parse(raw) as PendingClaim[];
  } catch {}
  return [];
}

export function saveAllPendingClaims(claims: PendingClaim[]) {
  localStorage.setItem(PENDING_CLAIMS_KEY, JSON.stringify(claims));
}

export function getClaimsForUser(userId: string): PendingClaim[] {
  return loadAllPendingClaims().filter((c) => c.userId === userId);
}

export function upsertClaim(claim: PendingClaim) {
  const all = loadAllPendingClaims();
  const idx = all.findIndex((c) => c.userId === claim.userId && c.id === claim.id);
  if (idx >= 0) all[idx] = claim; else all.push(claim);
  saveAllPendingClaims(all);
}

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// ─── Server Functions (MySQL Claims & Points Awarding) ──────────────────────

export const getPendingClaimsServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<PendingClaim[]> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'social_claims_data'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as PendingClaim[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

export const updateClaimStatusServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data: { userId: string; claimId: string; status: "approved" | "rejected"; points?: number }) => data)
  .handler(async ({ data }) => {
    const { userId, claimId, status, points = 0 } = data;
    
    let claims: PendingClaim[] = [];
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'social_claims_data'");
      if (rows.length > 0 && rows[0].value) {
        claims = JSON.parse(rows[0].value);
      }
    } catch {}

    const claim = claims.find((c) => c.id === claimId || (c.userId === userId && c.platform === claimId));
    if (claim) {
      claim.status = status;
    }

    const json = JSON.stringify(claims);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('social_claims_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );

    // Increment points in MySQL database profile
    if (status === "approved" && points > 0 && userId) {
      await query("UPDATE profiles SET points = COALESCE(points, 0) + ? WHERE id = ?", [points, userId]);
    }

    return { success: true, status };
  });

export function updateClaimStatus(userId: string, claimId: string, status: "approved" | "rejected"): PendingClaim | null {
  const all = loadAllPendingClaims();
  const claim = all.find((c) => c.userId === userId && c.id === claimId);
  if (!claim) return null;
  claim.status = status;
  saveAllPendingClaims(all);

  // Sync to MySQL
  updateClaimStatusServer({ data: { userId, claimId, status, points: claim.points } }).catch(() => {});
  return claim;
}
