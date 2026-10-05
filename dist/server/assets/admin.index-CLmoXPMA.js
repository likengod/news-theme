import { a as getAdminDashboardStats } from "./articles.functions-N4vpYj7A.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.index.tsx
var $$splitComponentImporter = () => import("./admin.index-DpQa48f_.js");
var Route = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.index-CLmoXPMA.js.map