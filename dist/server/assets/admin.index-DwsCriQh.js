import { o as getAdminDashboardStats } from "./articles.functions-BUJgIytL.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.index.tsx
var $$splitComponentImporter = () => import("./admin.index-BBw-6I0g.js");
var Route = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.index-DwsCriQh.js.map