// Journalist rank tiers, editable (CRUD) by admins and persisted in
// localStorage. A journalist's rank is derived from how many news articles
// they have published; each rank earns a configurable number of points per
// published article.

export type JournalistRank = {
  id: string;
  name: string;
  minNews: number; // published articles required to reach this rank
  pointsPerNews: number; // points earned per published article at this rank
  color: string; // tailwind palette key (see roleBadgeClass)
  builtin?: boolean;
};

const KEY = "nt:journalist-ranks:v1";

export const DEFAULT_RANKS: JournalistRank[] = [
  { id: "bronze", name: "Bronze", minNews: 100, pointsPerNews: 10, color: "amber", builtin: true },
  { id: "silver", name: "Silver", minNews: 500, pointsPerNews: 20, color: "slate", builtin: true },
  { id: "gold", name: "Gold", minNews: 1000, pointsPerNews: 30, color: "amber", builtin: true },
  { id: "diamond", name: "Diamond", minNews: 8000, pointsPerNews: 50, color: "sky", builtin: true },
];

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// ─── Server Functions (MySQL Journalist Ranks Persistence) ──────────────────

export const getJournalistRanksServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<JournalistRank[]> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'journalist_ranks_config'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as JournalistRank[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed].sort((a, b) => a.minNews - b.minNews);
        }
      }
    } catch {}
    return DEFAULT_RANKS;
  });

export const saveJournalistRanksServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((ranks: JournalistRank[]) => ranks)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('journalist_ranks_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    return { success: true };
  });

export function loadRanks(): JournalistRank[] {
  if (typeof window === "undefined") return DEFAULT_RANKS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_RANKS;
    const parsed = JSON.parse(raw) as JournalistRank[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_RANKS;
    return [...parsed].sort((a, b) => a.minNews - b.minNews);
  } catch {
    return DEFAULT_RANKS;
  }
}

export function saveRanks(ranks: JournalistRank[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(ranks));
  }
  // Sync centrally to MySQL database
  saveJournalistRanksServer({ data: ranks }).catch(() => {});
}

/** Highest rank whose threshold is met by `published`, or null if below all. */
export function rankForCount(
  published: number,
  ranks: JournalistRank[] = loadRanks(),
): JournalistRank | null {
  const sorted = [...ranks].sort((a, b) => a.minNews - b.minNews);
  let match: JournalistRank | null = null;
  for (const r of sorted) {
    if (published >= r.minNews) match = r;
  }
  return match;
}

/** Next rank above the current one, for progress display. */
export function nextRank(
  published: number,
  ranks: JournalistRank[] = loadRanks(),
): JournalistRank | null {
  const sorted = [...ranks].sort((a, b) => a.minNews - b.minNews);
  return sorted.find((r) => published < r.minNews) ?? null;
}
