import { c as getAdminDashboardStats } from "./articles.functions-PKTTwpkq.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.index.tsx
var $$splitComponentImporter = () => import("./admin.index-Dv8QMrXv.js");
var Route = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.index-DNZNtYLC.js.map