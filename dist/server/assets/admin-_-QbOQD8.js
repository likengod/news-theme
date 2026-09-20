import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-yItKZZnH.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-BsHQ3iyj.js");
var verifiedAdminTokens = /* @__PURE__ */ new Map();
var Route = createFileRoute("/admin")({
	ssr: false,
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
//#endregion
export { Route as t };

//# sourceMappingURL=admin-_-QbOQD8.js.map