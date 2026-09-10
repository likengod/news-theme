import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-k3X20UAX.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-D8q3QP5R.js");
var Route = createFileRoute("/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user) throw redirect({ to: "/auth" });
		try {
			const [res, roleRes] = await Promise.all([getUserServer({ data: data.session.access_token }), getCurrentUserRole({ data: data.session.access_token })]);
			if (!res.user) {
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			if (!roleRes.role || !["admin", "editor"].includes(roleRes.role)) throw redirect({ to: "/" });
		} catch (e) {
			if (e?.headers || e?.to) throw e;
			await authClient.auth.signOut();
			throw redirect({ to: "/auth" });
		}
		return { user: data.session.user };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
