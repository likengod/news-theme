import { o as getAdminDashboardStats } from "./articles.functions-Dn9T3hen.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.index.tsx
var $$splitComponentImporter = () => import("./admin.index-B1FnHYVm.js");
var Route = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.index-jGjhE2hA.js.map