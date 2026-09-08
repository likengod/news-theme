import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.settings.tsx
var $$splitComponentImporter = () => import("./admin.settings-DdpXGMnM.js");
var Route = createFileRoute("/admin/settings")({
	validateSearch: (search) => {
		return { tab: search.tab || "general" };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
