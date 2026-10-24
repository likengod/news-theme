/**
 * Server-Side Security, Anti-Spam & Rate-Limiting Guard.
 * Provides multi-layer defense against bot spam, brute force attacks,
 * subscription floods, and database/server denial-of-service.
 */

import { getRequest } from "@tanstack/react-start/server";

// ─── IP Extraction ───────────────────────────────────────────────────────────

export function getClientIp(request?: Request): string {
  const req = request || getRequest();
  if (!req) return "127.0.0.1";

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const clientIp = req.headers.get("x-client-ip");
  if (clientIp) return clientIp.trim();

  return "127.0.0.1";
}

// ─── In-Memory Rate Limiting Engine ──────────────────────────────────────────

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes to keep memory minimal
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (typeof timer.unref === "function") {
    timer.unref();
  }
}

/**
 * Checks and increments a rate limit bucket.
 * Returns true if allowed, false if limit exceeded.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

// ─── Layer 2: Account & Login Protection ────────────────────────────────────

const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_LOGINS = 5;

/**
 * Ensures IP hasn't exceeded failed login limit.
 * Throws an error if locked out.
 */
export function checkLoginRateLimit(ip: string) {
  const key = `login_fail:${ip}`;
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (record && record.resetAt > now && record.count >= MAX_FAILED_LOGINS) {
    const minutes = Math.ceil((record.resetAt - now) / 60000);
    throw new Error(
      `Too many failed login attempts from this network. For security, please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    );
  }
}

export function recordFailedLogin(ip: string) {
  const key = `login_fail:${ip}`;
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + FAILED_LOGIN_WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

export function clearLoginRateLimit(ip: string) {
  rateLimitStore.delete(`login_fail:${ip}`);
}

/**
 * Fast in-memory guard on registration to prevent CPU exhaustion on PBKDF2 hashing.
 * Max 3 attempts per 10 minutes per IP.
 */
export function checkSignupRateLimit(ip: string) {
  const res = checkRateLimit(`signup_fast:${ip}`, 3, 10 * 60 * 1000);
  if (!res.allowed) {
    throw new Error(
      `Registration request limit reached. Please wait ${res.resetInSeconds} seconds before trying again.`,
    );
  }
}

/**
 * Honeypot anti-bot validation.
 * Hidden fields in forms are invisible to humans. Automated spam bots fill them out.
 */
export function validateHoneypot(trapValue?: string | null) {
  if (trapValue && typeof trapValue === "string" && trapValue.trim().length > 0) {
    throw new Error("Automated submission detected. Request rejected.");
  }
}

// ─── Layer 3: Subscription & Order Flood Protection ─────────────────────────

const SUBSCRIPTION_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_SUBSCRIPTION_ATTEMPTS = 3; // 3 order attempts per 60 seconds

/**
 * Enforces cooldown on subscription order creation:
 * Max 3 order attempts per 60 seconds per user and per IP.
 */
export function checkSubscriptionRateLimit(userId: string, ip: string) {
  // Check user limit
  const userRes = checkRateLimit(
    `sub_user:${userId}`,
    MAX_SUBSCRIPTION_ATTEMPTS,
    SUBSCRIPTION_WINDOW_MS,
  );
  if (!userRes.allowed) {
    throw new Error(
      `Too many subscription attempts on this account. Please wait ${userRes.resetInSeconds} seconds before trying again.`,
    );
  }

  // Check IP limit
  const ipRes = checkRateLimit(
    `sub_ip:${ip}`,
    MAX_SUBSCRIPTION_ATTEMPTS,
    SUBSCRIPTION_WINDOW_MS,
  );
  if (!ipRes.allowed) {
    throw new Error(
      `Too many subscription orders from your network. Please wait ${ipRes.resetInSeconds} seconds before trying again.`,
    );
  }
}

// ─── Layer 4: Public Form & Inbox Rate Limiting ─────────────────────────────

type PublicFormType = "contact" | "comments" | "event" | "work_with_us" | "journalist_application";

const FORM_LIMITS: Record<PublicFormType, { max: number; windowMs: number; label: string }> = {
  contact: { max: 3, windowMs: 5 * 60 * 1000, label: "contact messages" },
  comments: { max: 5, windowMs: 5 * 60 * 1000, label: "comments" },
  event: { max: 3, windowMs: 5 * 60 * 1000, label: "event registrations" },
  work_with_us: { max: 3, windowMs: 10 * 60 * 1000, label: "applications" },
  journalist_application: { max: 2, windowMs: 15 * 60 * 1000, label: "journalist applications" },
};

/**
 * Enforces rate limiting on public form submissions to protect database tables from bloat.
 */
export function checkPublicFormRateLimit(type: PublicFormType, ip: string) {
  const conf = FORM_LIMITS[type] || { max: 5, windowMs: 5 * 60 * 1000, label: "submissions" };
  const res = checkRateLimit(`form:${type}:${ip}`, conf.max, conf.windowMs);

  if (!res.allowed) {
    const minutes = Math.ceil(res.resetInSeconds / 60);
    throw new Error(
      `You have reached the maximum number of ${conf.label} allowed. Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before submitting again.`,
    );
  }
}
