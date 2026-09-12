import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-BO_fBlco.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-CNiycMI0.js");
var Route = createFileRoute("/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user) throw redirect({ to: "/auth" });
		let isCached = false;
		if (typeof window !== "undefined") {
			const cachedTime = sessionStorage.getItem("admin_auth_check_time");
			const cachedResult = sessionStorage.getItem("admin_auth_result");
			if (cachedTime && cachedResult === "allowed") {
				if (Date.now() - parseInt(cachedTime) < 180 * 1e3) isCached = true;
			}
		}
		if (isCached) return { user: data.session.user };
		try {
			const [res, roleRes] = await Promise.all([getUserServer({ data: data.session.access_token }), getCurrentUserRole({ data: data.session.access_token })]);
			if (!res.user) {
				if (typeof window !== "undefined") sessionStorage.removeItem("admin_auth_result");
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			if (!roleRes.role || !["admin", "editor"].includes(roleRes.role)) {
				if (typeof window !== "undefined") {
					sessionStorage.setItem("admin_auth_result", "denied");
					sessionStorage.setItem("admin_auth_check_time", Date.now().toString());
				}
				throw redirect({ to: "/" });
			}
			if (typeof window !== "undefined") {
				sessionStorage.setItem("admin_auth_result", "allowed");
				sessionStorage.setItem("admin_auth_check_time", Date.now().toString());
			}
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

//# sourceMappingURL=admin-4Jr6OoHJ.js.map