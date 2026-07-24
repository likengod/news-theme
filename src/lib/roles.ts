// Lightweight client-side role registry persisted in localStorage.
// Used by Admin → Roles (CRUD) and Admin → Users (assignment dropdown).

export type Role = {
  id: string;
  name: string;
  description: string;
  color: string; // tailwind palette key: violet|blue|emerald|amber|slate|rose|sky
  builtin?: boolean; // built-in roles cannot be deleted
  seesPopupAds?: boolean; // whether users with this role see popup advertisements
};

const VIEWER_KEY = "nt:viewer-role";


const KEY = "ne_roles_v1";

export const ROLE_COLORS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "slate",
  "rose",
  "sky",
] as const;

export const roleBadgeClass = (color: string) => {
  const map: Record<string, string> = {
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return map[color] ?? map.slate;
};

const DEFAULTS: Role[] = [
  { id: "admin", name: "Admin", description: "Full access to every admin tool and setting.", color: "violet", builtin: true, seesPopupAds: false },
  { id: "editor", name: "Editor", description: "Can publish and edit any article.", color: "blue", builtin: true, seesPopupAds: false },
  { id: "author", name: "Author", description: "Can write and submit own articles.", color: "emerald", builtin: true, seesPopupAds: false },
  { id: "journalist", name: "Journalist", description: "Verified journalist who reports and submits news.", color: "sky", builtin: true, seesPopupAds: false },
  { id: "premium", name: "Premium user", description: "Paid reader with access to premium articles and ad-free reading.", color: "amber", builtin: true, seesPopupAds: false },
  { id: "reader", name: "Reader", description: "Default signed-in visitor.", color: "slate", builtin: true, seesPopupAds: true },
];


function mergeBuiltins(roles: Role[]): Role[] {
  // Ensure every built-in role always exists (even for older saved data),
  // and keep built-in flags authoritative so they can't be deleted.
  const byId = new Map(roles.map((r) => [r.id, r]));
  for (const def of DEFAULTS) {
    const existing = byId.get(def.id);
    if (!existing) byId.set(def.id, def);
    else byId.set(def.id, { ...existing, builtin: true });
  }
  return Array.from(byId.values());
}

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// ─── Server Functions (MySQL Roles Persistence) ─────────────────────────────

export const getRolesServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<Role[]> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'user_roles_config'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as Role[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeBuiltins(parsed);
        }
      }
    } catch {}
    return DEFAULTS;
  });

export const saveRolesServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((roles: Role[]) => roles)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('user_roles_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    return { success: true };
  });

export const upgradeToPremiumServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    // Check existing role
    const [rows]: any = await query("SELECT role FROM user_roles WHERE user_id = ?", [context.userId]);
    const currentRole = rows?.[0]?.role || "reader";
    
    // Don't downgrade admins, editors, journalists, or authors
    if (["admin", "editor", "journalist", "author", "premium"].includes(currentRole)) {
      return { success: true, message: "Already have equal or higher privileges." };
    }

    // Delete any existing role first
    await query("DELETE FROM user_roles WHERE user_id = ?", [context.userId]);
    // Insert premium role
    await query("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'premium')", [context.userId]);
    return { success: true };
  });

export function loadRoles(): Role[] {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Role[];
    return Array.isArray(parsed) && parsed.length ? mergeBuiltins(parsed) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveRoles(roles: Role[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(roles));
  }
  // Sync centrally to MySQL database
  saveRolesServer({ data: roles }).catch(() => {});
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Get the current viewer's role id (demo: localStorage override, default 'reader'). */
export function getCurrentRoleId(): string {
  if (typeof window === "undefined") return "reader";
  return localStorage.getItem(VIEWER_KEY) || "reader";
}

export function setCurrentRoleId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEWER_KEY, id);
}

/** Whether the current viewer's role is configured to see popup ads. */
export function currentRoleSeesPopups(): boolean {
  const id = getCurrentRoleId();
  const role = loadRoles().find((r) => r.id === id);
  return role?.seesPopupAds ?? true;
}

