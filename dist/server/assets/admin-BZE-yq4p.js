import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-RJN0C8cq.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-CSKBPBMY.js");
var Route = createFileRoute("/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user) throw redirect({ to: "/auth" });
		try {
			if (!(await getUserServer({ data: data.session.access_token })).user) {
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			const roleRes = await getCurrentUserRole({ data: data.session.access_token });
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
