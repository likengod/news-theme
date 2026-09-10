import { i as createServerFn } from "./esm-Dova13aH.js";
import { N as createSsrRpc } from "./site-content-B62E6PyF.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { z } from "zod";
//#region src/lib/auth.functions.ts
var signUpServer = createServerFn({ method: "POST" }).validator((data) => z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters").optional(),
	displayName: z.string().max(50).optional(),
	turnstileToken: z.string().min(1, "Captcha verification is required")
}).parse(data)).handler(createSsrRpc("df8b16c859c7fd668587be4aacb40208f4cc4b6c8458c7a094215fd98e8e361f"));
var signInServer = createServerFn({ method: "POST" }).validator((data) => z.object({
	email: z.string().min(1, "Identifier is required"),
	password: z.string().min(1, "Password is required").optional()
}).parse(data)).handler(createSsrRpc("7767b80dfc8a05617da49ed7b2fff2ef4cf1d9172125810f5a1bb8fe9159ac0f"));
var signOutServer = createServerFn({ method: "POST" }).validator((data) => z.object({ token: z.string() }).parse(data)).handler(createSsrRpc("f8f7c94053b6df65dd311c004de419a04972d1da2641bd4652225fe862ccc09f"));
var getSessionServer = createServerFn({ method: "GET" }).validator((token) => z.string().parse(token)).handler(createSsrRpc("4ef4526c7851016d95d34a2a71feba58eb4669c50021f14c2f9649d2bf686d9d"));
var getUserServer = createServerFn({ method: "GET" }).validator((token) => z.string().parse(token)).handler(createSsrRpc("b5d698999d02b005eeeb606cbdbd6f6d4fd0b8f52dd673d424fc0e7d35d91a8f"));
createServerFn({ method: "GET" }).validator((userId) => z.string().uuid().parse(userId)).handler(createSsrRpc("c197567c90b8a1cde5691024f8c8cba20ff2582a13a5bad48a45cbc91f16fc6d"));
var getCurrentUserRole = createServerFn({ method: "GET" }).validator((token) => z.string().parse(token)).handler(createSsrRpc("3b48b6e744f1a5c5ddc8bb4f3d6872f7099a6a2da7ab09a9160e985265508366"));
var changeMyPassword = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({ password: z.string().min(8, "Password must be at least 8 characters") }).parse(data)).handler(createSsrRpc("e3e3d3d1e25a2df540963a5960e082801c0920dfc74b6fb332b8a471307562ab"));
var getCurrentUserProfile = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("7b186d766aa8c796c848f3fedb34e6679caf6d5177470f7bbe3fd7316adcf994"));
var updateCurrentUserProfile = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	phone: z.string().max(20).optional(),
	bank_name: z.string().max(100).optional(),
	bank_account_name: z.string().max(100).optional(),
	bank_account_no: z.string().max(50).optional(),
	bank_ifsc: z.string().max(20).optional()
}).parse(data)).handler(createSsrRpc("e2f69f0542cf632edc163e1724bec5f208985dacb09a88cc9ae9e5807b50ece0"));
createServerFn({ method: "POST" }).middleware([requireAuth]).handler(createSsrRpc("2fbc4bc91a8b91f84dda5db092625db5003a98c6e7237acd1fb15e7efc1d8420"));
//#endregion
//#region src/lib/auth-client.ts
/**
* Client-side MySQL Authentication Manager.
* Communicates directly with backend MySQL server functions.
*/
var SESSION_KEY = "nt:mysql_session:v1";
var listeners = /* @__PURE__ */ new Set();
function notify(event, session) {
	for (const listener of listeners) try {
		listener(event, session);
	} catch (e) {
		console.error("[Auth] Listener error:", e);
	}
}
var authClient = { auth: {
	async signInWithPassword(credentials) {
		try {
			const res = await signInServer({ data: credentials });
			if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, JSON.stringify(res.session));
			notify("SIGNED_IN", res.session);
			return {
				data: res,
				error: null
			};
		} catch (err) {
			return {
				data: {
					session: null,
					user: null
				},
				error: { message: err.message || "Sign in failed" }
			};
		}
	},
	async signUp(credentials) {
		try {
			const res = await signUpServer({ data: {
				email: credentials.email,
				password: credentials.password,
				displayName: credentials.options?.data?.display_name,
				turnstileToken: credentials.turnstileToken || ""
			} });
			if (typeof window !== "undefined") localStorage.setItem(SESSION_KEY, JSON.stringify(res.session));
			notify("SIGNED_IN", res.session);
			return {
				data: res,
				error: null
			};
		} catch (err) {
			return {
				data: {
					session: null,
					user: null
				},
				error: { message: err.message || "Sign up failed" }
			};
		}
	},
	async signOut() {
		try {
			if (typeof window !== "undefined") {
				const raw = localStorage.getItem(SESSION_KEY);
				if (raw) {
					const session = JSON.parse(raw);
					if (session?.access_token) await signOutServer({ data: { token: session.access_token } });
				}
				localStorage.removeItem(SESSION_KEY);
			}
			notify("SIGNED_OUT", null);
			return { error: null };
		} catch (err) {
			if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
			notify("SIGNED_OUT", null);
			return { error: null };
		}
	},
	async getSession() {
		if (typeof window === "undefined") return {
			data: { session: null },
			error: null
		};
		try {
			const raw = localStorage.getItem(SESSION_KEY);
			if (!raw) return {
				data: { session: null },
				error: null
			};
			const local = JSON.parse(raw);
			if (!local?.access_token) return {
				data: { session: null },
				error: null
			};
			const res = await getSessionServer({ data: local.access_token });
			if (!res.session) {
				localStorage.removeItem(SESSION_KEY);
				return {
					data: { session: null },
					error: null
				};
			}
			return {
				data: { session: res.session },
				error: null
			};
		} catch (err) {
			return {
				data: { session: null },
				error: null
			};
		}
	},
	async getUser() {
		if (typeof window === "undefined") return {
			data: { user: null },
			error: null
		};
		try {
			const raw = localStorage.getItem(SESSION_KEY);
			if (!raw) return {
				data: { user: null },
				error: null
			};
			const local = JSON.parse(raw);
			if (!local?.access_token) return {
				data: { user: null },
				error: null
			};
			return {
				data: { user: (await getUserServer({ data: local.access_token })).user || null },
				error: null
			};
		} catch (err) {
			return {
				data: { user: null },
				error: null
			};
		}
	},
	onAuthStateChange(callback) {
		listeners.add(callback);
		return { data: { subscription: { unsubscribe() {
			listeners.delete(callback);
		} } } };
	},
	async resetPasswordForEmail(_email) {
		return {
			data: {},
			error: null
		};
	},
	async updateUser(_attributes) {
		return {
			data: {},
			error: null
		};
	}
} };
//#endregion
export { getUserServer as a, getCurrentUserRole as i, changeMyPassword as n, updateCurrentUserProfile as o, getCurrentUserProfile as r, authClient as t };
