import { o as getAdminDashboardStats } from "./articles.functions-DxUTj2Uw.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.index.tsx
var $$splitComponentImporter = () => import("./admin.index-92259bnM.js");
var Route = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.index-CHV-u7sR.js.map