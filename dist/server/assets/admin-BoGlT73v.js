import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-DjKbIEp4.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-BiaFX_8P.js");
var $$splitErrorComponentImporter = () => import("./admin-CrOG_oDq.js");
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
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm font-semibold text-slate-600",
				children: "Connecting to Admin Dashboard..."
			})]
		})
	});
}
//#endregion
export { Route as t };

//# sourceMappingURL=admin-BoGlT73v.js.map