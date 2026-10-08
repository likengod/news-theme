import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-B299oylq.js";
import { useEffect, useState } from "react";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-gVLpXQkg.js");
var $$splitErrorComponentImporter = () => import("./admin-F33_sldM.js");
var verifiedAdminTokens = /* @__PURE__ */ new Map();
var Route = createFileRoute("/admin")({
	ssr: false,
	pendingComponent: AdminPendingFallback,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	beforeLoad: async () => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user || !data.session?.access_token) throw redirect({ to: "/auth" });
		const token = data.session.access_token;
		const now = Date.now();
		const cachedExpiry = verifiedAdminTokens.get(token);
		if (cachedExpiry && cachedExpiry > now) return { user: data.session.user };
		try {
			const [res, roleRes] = await Promise.all([getUserServer({ data: token }), getCurrentUserRole({ data: token })]);
			if (!res.user) {
				verifiedAdminTokens.delete(token);
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			if (!roleRes.role || !["admin", "editor"].includes(roleRes.role)) {
				verifiedAdminTokens.delete(token);
				throw redirect({ to: "/" });
			}
			verifiedAdminTokens.set(token, now + 120 * 1e3);
		} catch (e) {
			verifiedAdminTokens.delete(token);
			if (e?.headers || e?.to) throw e;
			await authClient.auth.signOut();
			throw redirect({ to: "/auth" });
		}
		return { user: data.session.user };
	},
	head: () => ({ meta: [
		{ title: "Admin Dashboard - News Timeline" },
		{
			name: "description",
			content: "Administrative control center and dashboard."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function AdminPendingFallback() {
	const [takingLong, setTakingLong] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setTakingLong(true);
		}, 4e3);
		return () => clearTimeout(timer);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3 text-center max-w-sm",
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" }),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold text-slate-700",
					children: "Connecting to Admin Dashboard..."
				}),
				takingLong && /* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex flex-col items-center gap-2 animate-in fade-in duration-300",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Update was applied. Click below to load the new version."
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							if (typeof window !== "undefined") {
								if ("caches" in window) caches.keys().then((keys) => {
									keys.forEach((k) => caches.delete(k));
								}).catch(() => {});
								window.location.reload();
							}
						},
						className: "px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
						children: "Refresh Dashboard"
					})]
				})
			]
		})
	});
}
//#endregion
export { Route as t };

//# sourceMappingURL=admin-Xo_mx5s2.js.map