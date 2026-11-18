import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";

export type ClaimedCodeRecord = {
  code: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  claimedAt: string;
  voucherId: string;
  voucherTitle: string;
  discountDescription?: string;
  status: "active" | "used_in_store" | "expired";
  usedAt?: string;
  usedByStoreName?: string;
  expiresAt: string;
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
  expiryDays?: number; // default 30 days
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
    expiryDays: 180,
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
    expiryDays: 30,
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
    expiryDays: 60,
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
    expiryDays: 60,
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
    expiryDays: 30,
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
    expiryDays: 30,
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

/**
 * Redeem a voucher:
 * - Pops a single unique unredeemed code from the pool (never re-issued to anyone else)
 * - Automatically attaches user info, unique code, creation time and calculated expiration date
 * - Saves the state into the database
 */
export const redeemVoucherServer = createServerFn({ method: "POST" })
  .validator((d: { voucherId: string; userId?: string; userName?: string; userEmail?: string }) => d)
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
      // POP SINGLE UNIQUE PROMO CODE FROM POOL - permanently removes it from the pool
      codeToDeliver = v.codesPool.shift()!.trim();
      v.stock = v.codesPool.length;
    } else if (v.stockType === "limited" && typeof v.stock === "number") {
      v.stock = Math.max(0, v.stock - 1);
      codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    } else {
      codeToDeliver = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }

    const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    const record: ClaimedCodeRecord = {
      code: codeToDeliver,
      userId: data.userId || "anonymous",
      userName: data.userName,
      userEmail: data.userEmail,
      claimedAt: new Date().toISOString(),
      voucherId: v.id,
      voucherTitle: v.title,
      discountDescription: v.description || "",
      status: "active",
      expiresAt,
    };

    v.claimedCodes = v.claimedCodes || [];
    v.claimedCodes.push(record);

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
      record,
      expiresAt,
      voucherTitle: v.title,
      remainingStock: v.stockType === "codes_pool" ? v.codesPool?.length : v.stock,
      vouchers,
    };
  });

export type VerificationResult = {
  status: "valid" | "already_used" | "expired" | "unclaimed_by_user" | "invalid";
  message: string;
  record?: ClaimedCodeRecord;
  voucher?: {
    id: string;
    title: string;
    tag: string;
    color: string;
    icon: string;
    description?: string;
  };
};

/**
 * Public Verification Check (Store Owner / Cashier / QR Scanner):
 * Checks whether a promo code is:
 * 1. Valid and ready to claim
 * 2. Already used at a store (with timestamp and store name)
 * 3. Expired
 * 4. Invalid or not found
 */
export const verifyPromoCodeServer = createServerFn({ method: "POST" })
  .validator((d: { code: string }) => d)
  .handler(async ({ data }): Promise<VerificationResult> => {
    const rawCode = (data.code || "").trim();
    if (!rawCode) {
      return { status: "invalid", message: "Please provide a valid promo code." };
    }

    const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
    let vouchers: Voucher[] = DEFAULT_VOUCHERS;
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      } catch {}
    }

    const searchCode = rawCode.toUpperCase();

    // 1. Check all claimedCodes across all vouchers
    for (const v of vouchers) {
      if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
        const found = v.claimedCodes.find(
          (c) => c.code.trim().toUpperCase() === searchCode,
        );
        if (found) {
          const voucherInfo = {
            id: v.id,
            title: v.title,
            tag: v.tag,
            color: v.color,
            icon: v.icon,
            description: v.description,
          };

          // Check if already used in store
          if (found.status === "used_in_store") {
            const usedDate = found.usedAt ? new Date(found.usedAt).toLocaleString() : "previously";
            const storeName = found.usedByStoreName || "Partner Store";
            return {
              status: "already_used",
              record: found,
              voucher: voucherInfo,
              message: `This promo code was ALREADY REDEEMED on ${usedDate} at ${storeName}. It cannot be reused!`,
            };
          }

          // Check if expired
          if (found.expiresAt && new Date() > new Date(found.expiresAt)) {
            const expDate = new Date(found.expiresAt).toLocaleDateString();
            return {
              status: "expired",
              record: { ...found, status: "expired" },
              voucher: voucherInfo,
              message: `This promo code expired on ${expDate}. It is no longer valid for store redemption.`,
            };
          }

          // Valid and active
          return {
            status: "valid",
            record: found,
            voucher: voucherInfo,
            message: "Promo code verified! Ready to apply store discount.",
          };
        }
      }
    }

    // 2. Check if code exists in unredeemed codesPool (e.g. admin batch-generated or pre-loaded inventory)
    for (const v of vouchers) {
      if (v.codesPool && Array.isArray(v.codesPool)) {
        const inPool = v.codesPool.some((c) => c.trim().toUpperCase() === searchCode);
        if (inPool) {
          const voucherInfo = {
            id: v.id,
            title: v.title,
            tag: v.tag,
            color: v.color,
            icon: v.icon,
            description: v.description,
          };
          const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
          const dummyRecord: ClaimedCodeRecord = {
            code: searchCode,
            userId: "direct_store_customer",
            userName: "Direct Customer",
            claimedAt: new Date().toISOString(),
            voucherId: v.id,
            voucherTitle: v.title,
            discountDescription: v.description || "",
            status: "active",
            expiresAt: new Date(Date.now() + days * 86400000).toISOString(),
          };
          return {
            status: "valid",
            record: dummyRecord,
            voucher: voucherInfo,
            message: `Promo code verified! Ready to apply store discount for "${v.title}".`,
          };
        }
      }
    }

    return {
      status: "invalid",
      message: `Invalid promo code "${rawCode}". No matching record or active inventory found.`,
    };
  });

/**
 * In-Store Claim / Redemption Action:
 * Executed by the store owner or cashier to permanently mark the promo code as USED.
 * Once marked, the code is locked forever and cannot be redeemed again.
 */
export const claimPromoCodeInStoreServer = createServerFn({ method: "POST" })
  .validator((d: { code: string; storeName?: string; cashierNote?: string }) => d)
  .handler(async ({ data }) => {
    const rawCode = (data.code || "").trim();
    if (!rawCode) {
      throw new Error("Promo code is required");
    }

    const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
    let vouchers: Voucher[] = DEFAULT_VOUCHERS;
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        vouchers = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      } catch {}
    }

    const searchCode = rawCode.toUpperCase();
    let targetVoucher: Voucher | null = null;
    let targetRecord: ClaimedCodeRecord | null = null;

    // 1. Check existing claimedCodes first
    for (const v of vouchers) {
      if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
        const found = v.claimedCodes.find(
          (c) => c.code.trim().toUpperCase() === searchCode,
        );
        if (found) {
          targetVoucher = v;
          targetRecord = found;
          break;
        }
      }
    }

    // If already in claimedCodes: verify it wasn't already redeemed in store
    if (targetRecord) {
      if (targetRecord.status === "used_in_store") {
        const usedDate = targetRecord.usedAt ? new Date(targetRecord.usedAt).toLocaleString() : "previously";
        throw new Error(`This code was ALREADY REDEEMED on ${usedDate} at ${targetRecord.usedByStoreName || "Partner Store"}. Duplicate redemptions are strictly blocked!`);
      }

      if (targetRecord.expiresAt && new Date() > new Date(targetRecord.expiresAt)) {
        throw new Error(`This promo code expired on ${new Date(targetRecord.expiresAt).toLocaleDateString()}!`);
      }

      // Mark this claimed code as used in store now
      const nowIso = new Date().toISOString();
      targetRecord.status = "used_in_store";
      targetRecord.usedAt = nowIso;
      targetRecord.usedByStoreName = (data.storeName || "").trim() || "Local Partner Store";
    } else {
      // 2. If not in claimedCodes, check unredeemed codesPool (admin batch-generated / pre-loaded pool)
      for (const v of vouchers) {
        if (v.codesPool && Array.isArray(v.codesPool)) {
          const poolIndex = v.codesPool.findIndex((c) => c.trim().toUpperCase() === searchCode);
          if (poolIndex !== -1) {
            // Remove code from pool permanently
            v.codesPool.splice(poolIndex, 1);
            v.stock = v.codesPool.length;

            const nowIso = new Date().toISOString();
            const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
            const newRecord: ClaimedCodeRecord = {
              code: searchCode,
              userId: "direct_store_customer",
              userName: "Direct Customer",
              claimedAt: nowIso,
              voucherId: v.id,
              voucherTitle: v.title,
              discountDescription: v.description || "",
              status: "used_in_store",
              usedAt: nowIso,
              usedByStoreName: (data.storeName || "").trim() || "Local Partner Store",
              expiresAt: new Date(Date.now() + days * 86400000).toISOString(),
            };

            v.claimedCodes = v.claimedCodes || [];
            v.claimedCodes.push(newRecord);
            targetVoucher = v;
            targetRecord = newRecord;
            break;
          }
        }
      }
    }

    if (!targetRecord || !targetVoucher) {
      throw new Error(`Promo code "${rawCode}" not found in inventory.`);
    }

    // Save to database
    const json = JSON.stringify(vouchers);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('vouchers_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );

    return {
      success: true,
      message: `Promo code successfully verified and marked as used! Discount granted at ${targetRecord.usedByStoreName}.`,
      record: targetRecord,
      voucherTitle: targetVoucher.title,
    };
  });

/**
 * Fetch all claimed vouchers for a specific user (for User Profile / Wallet tab)
 */
export const getUserClaimedVouchersServer = createServerFn({ method: "POST" })
  .validator((d: { userId: string }) => d)
  .handler(async ({ data }): Promise<ClaimedCodeRecord[]> => {
    if (!data.userId) return [];
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'vouchers_config'");
      if (!rows || rows.length === 0 || !rows[0].value) return [];
      const vouchers: Voucher[] = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      const userRecords: ClaimedCodeRecord[] = [];
      const now = new Date();

      for (const v of vouchers) {
        if (v.claimedCodes && Array.isArray(v.claimedCodes)) {
          for (const c of v.claimedCodes) {
            if (c.userId === data.userId) {
              const item = { ...c };
              if (item.status === "active" && item.expiresAt && now > new Date(item.expiresAt)) {
                item.status = "expired";
              }
              userRecords.push(item);
            }
          }
        }
      }

      // Sort newest first
      userRecords.sort(
        (a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime(),
      );
      return userRecords;
    } catch (err) {
      console.error("[Vouchers] Failed to load user vouchers:", err);
      return [];
    }
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
