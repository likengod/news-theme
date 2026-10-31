import { s as getRequest } from "./server-BgZ4iWFx.js";
// src/lib/security.server.ts
/**
* Server-Side Security, Anti-Spam & Rate-Limiting Guard.
* Provides multi-layer defense against bot spam, brute force attacks,
* subscription floods, and database/server denial-of-service.
*/
function getClientIp(request) {
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
var rateLimitStore = /* @__PURE__ */ new Map();
if (typeof setInterval !== "undefined") {
	const timer = setInterval(() => {
		const now = Date.now();
		for (const [key, record] of rateLimitStore.entries()) if (record.resetAt <= now) rateLimitStore.delete(key);
	}, 3e5);
	if (typeof timer.unref === "function") timer.unref();
}
/**
* Checks and increments a rate limit bucket.
* Returns true if allowed, false if limit exceeded.
*/
function checkRateLimit(key, maxRequests, windowMs) {
	const now = Date.now();
	const existing = rateLimitStore.get(key);
	if (!existing || existing.resetAt <= now) {
		rateLimitStore.set(key, {
			count: 1,
			resetAt: now + windowMs
		});
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetInSeconds: Math.ceil(windowMs / 1e3)
		};
	}
	if (existing.count >= maxRequests) return {
		allowed: false,
		remaining: 0,
		resetInSeconds: Math.ceil((existing.resetAt - now) / 1e3)
	};
	existing.count += 1;
	return {
		allowed: true,
		remaining: maxRequests - existing.count,
		resetInSeconds: Math.ceil((existing.resetAt - now) / 1e3)
	};
}
var tokenBucketStore = /* @__PURE__ */ new Map();
/**
* Token Bucket Rate Limiter:
* - capacity: Maximum burst capacity (e.g. 5 tokens).
* - refillWindowSeconds: Time required to refill from 0 to full capacity.
* Allows smooth bursts up to capacity, while enforcing steady refill rate.
*/
function checkTokenBucket(key, capacity, refillWindowSeconds) {
	const now = Date.now();
	const refillRatePerMs = capacity / (refillWindowSeconds * 1e3);
	let bucket = tokenBucketStore.get(key);
	if (!bucket) {
		bucket = {
			tokens: capacity,
			lastRefill: now
		};
		tokenBucketStore.set(key, bucket);
	}
	const elapsedMs = Math.max(0, now - bucket.lastRefill);
	bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMs * refillRatePerMs);
	bucket.lastRefill = now;
	if (bucket.tokens >= 1) {
		bucket.tokens -= 1;
		return {
			allowed: true,
			remaining: Math.floor(bucket.tokens),
			retryAfterSeconds: 0
		};
	}
	const missing = 1 - bucket.tokens;
	const retryAfterSeconds = Math.ceil(missing / (refillRatePerMs * 1e3));
	return {
		allowed: false,
		remaining: 0,
		retryAfterSeconds: Math.max(1, retryAfterSeconds)
	};
}
var FAILED_LOGIN_WINDOW_MS = 9e5;
var MAX_FAILED_LOGINS = 5;
/**
* Ensures IP hasn't exceeded failed login limit.
* Throws an error if locked out.
*/
function checkLoginRateLimit(ip) {
	const key = `login_fail:${ip}`;
	const record = rateLimitStore.get(key);
	const now = Date.now();
	if (record && record.resetAt > now && record.count >= MAX_FAILED_LOGINS) {
		const minutes = Math.ceil((record.resetAt - now) / 6e4);
		throw new Error(`Too many failed login attempts from this network. For security, please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`);
	}
}
function recordFailedLogin(ip) {
	const key = `login_fail:${ip}`;
	const now = Date.now();
	const existing = rateLimitStore.get(key);
	if (!existing || existing.resetAt <= now) rateLimitStore.set(key, {
		count: 1,
		resetAt: now + FAILED_LOGIN_WINDOW_MS
	});
	else existing.count += 1;
}
function clearLoginRateLimit(ip) {
	rateLimitStore.delete(`login_fail:${ip}`);
}
/**
* Fast in-memory guard on registration to prevent CPU exhaustion on PBKDF2 hashing.
* Max 3 attempts per 10 minutes per IP.
*/
function checkSignupRateLimit(ip) {
	const res = checkRateLimit(`signup_fast:${ip}`, 3, 6e5);
	if (!res.allowed) throw new Error(`Registration request limit reached. Please wait ${res.resetInSeconds} seconds before trying again.`);
}
/**
* Honeypot anti-bot validation.
* Hidden fields in forms are invisible to humans. Automated spam bots fill them out.
*/
function validateHoneypot(trapValue) {
	if (trapValue && typeof trapValue === "string" && trapValue.trim().length > 0) throw new Error("Automated submission detected. Request rejected.");
}
var FORGOT_EMAIL_WINDOW_MS = 18e5;
var FORGOT_IP_WINDOW_MS = 9e5;
/**
* Enforces dual-key rate limiting on forgot password:
* 1. Target Email Key: forgot:email:${cleanEmail} -> Max 5 per 30 minutes
* 2. Client IP Key: forgot:ip:${ip} -> Max 5 per 15 minutes
* 3. Honeypot Trap check
*/
function checkForgotPasswordRateLimit(email, ip, trapValue) {
	validateHoneypot(trapValue);
	const cleanEmail = (email || "").trim().toLowerCase();
	if (!cleanEmail) throw new Error("Email address is required.");
	const emailRes = checkTokenBucket(`forgot:email:${cleanEmail}`, 5, FORGOT_EMAIL_WINDOW_MS / 1e3);
	if (!emailRes.allowed) {
		const minutes = Math.ceil(emailRes.retryAfterSeconds / 60);
		throw new Error(`Too many password reset requests for ${cleanEmail}. For security, please wait ${minutes} minute${minutes > 1 ? "s" : ""} before requesting another link.`);
	}
	const ipRes = checkTokenBucket(`forgot:ip:${ip}`, 5, FORGOT_IP_WINDOW_MS / 1e3);
	if (!ipRes.allowed) {
		const minutes = Math.ceil(ipRes.retryAfterSeconds / 60);
		throw new Error(`Too many password reset requests from this network. Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before trying again.`);
	}
}
var SUBSCRIPTION_WINDOW_MS = 6e4;
var MAX_SUBSCRIPTION_ATTEMPTS = 3;
/**
* Enforces cooldown on subscription order creation:
* Max 3 order attempts per 60 seconds per user and per IP.
*/
function checkSubscriptionRateLimit(userId, ip) {
	const userRes = checkRateLimit(`sub_user:${userId}`, MAX_SUBSCRIPTION_ATTEMPTS, SUBSCRIPTION_WINDOW_MS);
	if (!userRes.allowed) throw new Error(`Too many subscription attempts on this account. Please wait ${userRes.resetInSeconds} seconds before trying again.`);
	const ipRes = checkRateLimit(`sub_ip:${ip}`, MAX_SUBSCRIPTION_ATTEMPTS, SUBSCRIPTION_WINDOW_MS);
	if (!ipRes.allowed) throw new Error(`Too many subscription orders from your network. Please wait ${ipRes.resetInSeconds} seconds before trying again.`);
}
var FORM_LIMITS = {
	contact: {
		max: 3,
		windowMs: 3e5,
		label: "contact messages"
	},
	comments: {
		max: 5,
		windowMs: 3e5,
		label: "comments"
	},
	event: {
		max: 3,
		windowMs: 3e5,
		label: "event registrations"
	},
	work_with_us: {
		max: 3,
		windowMs: 6e5,
		label: "applications"
	},
	journalist_application: {
		max: 2,
		windowMs: 9e5,
		label: "journalist applications"
	}
};
/**
* Enforces rate limiting on public form submissions to protect database tables from bloat.
*/
function checkPublicFormRateLimit(type, ip) {
	const conf = FORM_LIMITS[type] || {
		max: 5,
		windowMs: 3e5,
		label: "submissions"
	};
	const res = checkRateLimit(`form:${type}:${ip}`, conf.max, conf.windowMs);
	if (!res.allowed) {
		const minutes = Math.ceil(res.resetInSeconds / 60);
		throw new Error(`You have reached the maximum number of ${conf.label} allowed. Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before submitting again.`);
	}
}
export { checkSignupRateLimit as a, getClientIp as c, checkRateLimit as i, recordFailedLogin as l, checkLoginRateLimit as n, checkSubscriptionRateLimit as o, checkPublicFormRateLimit as r, clearLoginRateLimit as s, checkForgotPasswordRateLimit as t, validateHoneypot as u };

//# sourceMappingURL=security.server-CYN-SF4Z.js.map