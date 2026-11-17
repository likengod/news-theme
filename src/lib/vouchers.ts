import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";

export type ClaimedCodeRecord = {
  code: string;
  userId?: string;
  claimedAt: string;
};

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
  description?: string;
  stockType?: "unlimited" | "limited" | "codes_pool";
  stock?: number;
  codesPool?: string[];
  claimedCodes?: ClaimedCodeRecord[];
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
    stockType: "unlimited",
    description: "Instant 6 months full access to all exclusive stories, audio articles, and ad-free experience.",
  },
  {
    id: "recharge299",
    title: "Phone Recharge ₹299",
    cost: 299,
    tag: "Mobile",
    icon: "Smartphone",
    color: "sky",
    enabled: true,
    stockType: "limited",
    stock: 50,
    description: "Mobile recharge voucher valid for Jio, Airtel, Vi, and BSNL numbers across India.",
  },
  {
    id: "flipkart500",
    title: "Flipkart Wallet ₹500",
    cost: 500,
    tag: "Shopping",
    icon: "ShoppingBag",
    color: "indigo",
    enabled: true,
    stockType: "limited",
    stock: 30,
    description: "Digital Flipkart gift card code sent to your wallet. Redeem on Flipkart for any item.",
  },
  {
    id: "amazon500",
    title: "Amazon Gift Card ₹500",
    cost: 500,
    tag: "Shopping",
    icon: "ShoppingBag",
    color: "orange",
    enabled: true,
    stockType: "limited",
    stock: 40,
    description: "Amazon Pay gift voucher balance redeemable on amazon.in shopping and bill payments.",
  },
  {
    id: "swiggy500",
    title: "Swiggy Gift Card ₹500",
    cost: 500,
    tag: "Food",
    icon: "UtensilsCrossed",
    color: "rose",
    enabled: true,
    stockType: "limited",
    stock: 25,
    description: "Swiggy food delivery and Instamart balance voucher code.",
  },
  {
    id: "zomato500",
    title: "Zomato Gift Card ₹500",
    cost: 500,
    tag: "Food",
    icon: "UtensilsCrossed",
    color: "red",
    enabled: true,
    stockType: "limited",
    stock: 25,
    description: "Zomato online food order discount card.",
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

export const redeemVoucherServer = createServerFn({ method: "POST" })
  .validator((d: { voucherId: string; userId?: string }) => d)
  .handler(async ({ data }) => {
    const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
    let vouchers: Voucher[] = DEFAULT_VOUCHERS;
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      } catch {}
    }

    const vIndex = vouchers.findIndex((item) => item.id === data.voucherId);
    if (vIndex === -1) {
      throw new Error("Voucher not found");
    }

    const v = vouchers[vIndex];
    if (v.enabled === false) {
      throw new Error("This voucher is currently inactive");
    }

    // Check stock if limited
    if (v.stockType === "limited" && typeof v.stock === "number" && v.stock <= 0) {
      throw new Error("Sorry, this voucher is out of stock!");
    }

    let codeToDeliver = "";
    if (v.stockType === "codes_pool") {
      v.codesPool = v.codesPool || [];
      if (v.codesPool.length === 0) {
        throw new Error("Sorry, all promo codes for this voucher have been claimed!");
      }
      codeToDeliver = v.codesPool.shift()!;
      v.stock = v.codesPool.length;
      v.claimedCodes = v.claimedCodes || [];
      v.claimedCodes.push({
        code: codeToDeliver,
        userId: data.userId || "anonymous",
        claimedAt: new Date().toISOString(),
      });
    } else if (v.stockType === "limited" && typeof v.stock === "number") {
      v.stock = Math.max(0, v.stock - 1);
      codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      v.claimedCodes = v.claimedCodes || [];
      v.claimedCodes.push({
        code: codeToDeliver,
        userId: data.userId || "anonymous",
        claimedAt: new Date().toISOString(),
      });
    } else {
      codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }

    // Save updated stock state back to MySQL
    const json = JSON.stringify(vouchers);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );

    return {
      success: true,
      code: codeToDeliver,
      remainingStock: v.stockType === "codes_pool" ? v.codesPool?.length : v.stock,
      vouchers,
    };
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
