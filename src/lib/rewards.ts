// Reward configuration: which points each role can earn. Admins manage this
// under Admin → Reward. Persisted in localStorage (demo). Some staff roles do
// NOT earn points at all.

export type RecurringReward = {
  id: string;
  title: string;
  reward: string; // e.g. "₹0.40 per share"
  cap: string; // e.g. "up to ₹2 / day"
  rank: string; // "all" | "bronze" | "silver" | "gold" | "diamond"
};

export type OneTimeReward = {
  id: string;
  title: string;
  points: number;
  rank: string; // "all" | "bronze" | "silver" | "gold" | "diamond"
};

export type RewardGroup = {
  roleId: string; // "all" | "reader" | "premium" | "journalist" | ...
  label: string;
  enabled: boolean;
  note?: string;
  oneTime: OneTimeReward[];
  recurring: RecurringReward[];
};

// Roles that never earn reward points.
export const NON_EARNING_ROLES = new Set([
  "admin",
  "author",
  "editor",
  "developer",
]);

const KEY = "nt:rewards:v1";

const uid = () => Math.random().toString(36).slice(2, 9);

export const DEFAULT_REWARDS: RewardGroup[] = [
  {
    roleId: "all",
    label: "All users",
    enabled: true,
    note: "One-time tasks available to every earning user.",
    oneTime: [
      { id: "signup", title: "Create an account", points: 25 },
      { id: "yt", title: "Subscribe our YouTube channel", points: 25 },
      { id: "fb", title: "Like & follow us on Facebook", points: 20 },
      { id: "ig", title: "Follow us on Instagram", points: 20 },
      { id: "wa", title: "Join our WhatsApp channel", points: 25 },
    ],
    recurring: [],
  },
  {
    roleId: "reader",
    label: "Reader",
    enabled: true,
    oneTime: [],
    recurring: [
      { id: "r_share", title: "Share news", reward: "₹0.20 per share", cap: "up to ₹1 / day" },
      { id: "r_comment", title: "Comment on unique articles (after first time)", reward: "₹0.50 per unique article", cap: "up to ₹2 / day" },
    ],
  },
  {
    roleId: "premium",
    label: "Premium user",
    enabled: true,
    oneTime: [],
    recurring: [
      { id: "p_share", title: "Share news", reward: "₹0.40 per share", cap: "up to ₹2 / day" },
      { id: "p_comment", title: "Comment on unique articles (after first time)", reward: "₹0.1 per unique article", cap: "up to ₹4 / day" },
    ],
  },
  {
    roleId: "journalist",
    label: "Journalist",
    enabled: true,
    note: "Journalists earn points per published news based on their rank. Set points and thresholds below.",
    oneTime: [],
    recurring: [],
  },
];

function mergeDefaults(groups: RewardGroup[]): RewardGroup[] {
  const cleanGroups = groups.map((g) => {
    if (g.roleId === "journalist") {
      return {
        ...g,
        note: "Journalists earn points per published news based on their rank. Set points and thresholds below.",
        recurring: g.recurring.filter((r) => r.id !== "j_publish"),
      };
    }
    return g;
  });
  const byId = new Map(cleanGroups.map((g) => [g.roleId, g]));
  for (const def of DEFAULT_REWARDS) {
    if (!byId.has(def.roleId)) byId.set(def.roleId, def);
  }
  return Array.from(byId.values());
}

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// ─── Server Functions (MySQL Rewards Persistence) ───────────────────────────

export const getRewardsServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<RewardGroup[]> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'rewards_config'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as RewardGroup[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeDefaults(parsed);
        }
      }
    } catch {}
    return DEFAULT_REWARDS;
  });

export const saveRewardsServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((groups: RewardGroup[]) => groups)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('rewards_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    return { success: true };
  });

export function loadRewards(): RewardGroup[] {
  if (typeof window === "undefined") return DEFAULT_REWARDS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_REWARDS;
    const parsed = JSON.parse(raw) as RewardGroup[];
    return Array.isArray(parsed) && parsed.length ? mergeDefaults(parsed) : DEFAULT_REWARDS;
  } catch {
    return DEFAULT_REWARDS;
  }
}

export function saveRewards(groups: RewardGroup[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(groups));
  }
  // Sync centrally to MySQL database
  saveRewardsServer({ data: groups }).catch(() => {});
}

export const newRecurring = (): RecurringReward => ({ id: uid(), title: "", reward: "", cap: "", rank: "all" });
export const newOneTime = (): OneTimeReward => ({ id: uid(), title: "", points: 0, rank: "all" });

/** Get merged rewards for a specific role, combining role-specific + "all" group */
export function getRewardsForRole(roleId: string): { oneTime: OneTimeReward[]; recurring: RecurringReward[] } {
  const groups = loadRewards();
  const allGroup = groups.find((g) => g.roleId === "all");
  const roleGroup = groups.find((g) => g.roleId === roleId);
  return {
    oneTime: [...(allGroup?.oneTime ?? []), ...(roleGroup?.oneTime ?? [])],
    recurring: [...(allGroup?.recurring ?? []), ...(roleGroup?.recurring ?? [])],
  };
}
