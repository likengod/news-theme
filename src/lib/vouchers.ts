import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";

export type Voucher = {
  id: string;
  title: string;
  cost: number;
  tag: string;
  icon: string;
  color: string;
  featured?: boolean;
  freeUnlock?: boolean;
  enabled?: boolean;
};

export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: "premium6m",
    title: "Premium User — 6 Months Free",
    cost: 0,
    tag: "Featured",
    icon: "Crown",
    color: "amber",
    featured: true,
    freeUnlock: true,
    enabled: true,
  },
  {
    id: "recharge299",
    title: "Phone Recharge ₹299",
    cost: 299,
    tag: "Mobile",
    icon: "Smartphone",
    color: "sky",
    enabled: true,
  },
  {
    id: "flipkart500",
    title: "Flipkart Wallet ₹500",
    cost: 500,
    tag: "Shopping",
    icon: "ShoppingBag",
    color: "indigo",
    enabled: true,
  },
  {
    id: "amazon500",
    title: "Amazon Gift Card ₹500",
    cost: 500,
    tag: "Shopping",
    icon: "ShoppingBag",
    color: "orange",
    enabled: true,
  },
  {
    id: "swiggy500",
    title: "Swiggy Gift Card ₹500",
    cost: 500,
    tag: "Food",
    icon: "UtensilsCrossed",
    color: "rose",
    enabled: true,
  },
  {
    id: "zomato500",
    title: "Zomato Gift Card ₹500",
    cost: 500,
    tag: "Food",
    icon: "UtensilsCrossed",
    color: "red",
    enabled: true,
  },
];

const STORAGE_KEY = "nt:vouchers_config:v1";

export const getVouchersServer = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const rows = await query(
      "SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'",
    );
    if (rows && rows.length > 0 && rows[0].value) {
      const parsed = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Voucher[];
      }
    }
  } catch (err) {
    console.warn("[Vouchers] Failed to load vouchers from DB:", err);
  }
  return DEFAULT_VOUCHERS;
});

export const saveVouchersServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((vouchers: Voucher[]) => vouchers)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );
    return { success: true };
  });

export function loadVouchers(): Voucher[] {
  if (typeof window === "undefined") return DEFAULT_VOUCHERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VOUCHERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VOUCHERS;
  } catch {
    return DEFAULT_VOUCHERS;
  }
}

export function saveVouchers(vouchers: Voucher[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  }
  saveVouchersServer({ data: vouchers }).catch((err) => {
    console.error("[Vouchers] Save error:", err);
  });
}
