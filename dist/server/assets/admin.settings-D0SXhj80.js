import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.settings.tsx
var $$splitComponentImporter = () => import("./admin.settings-CvXlwxOH.js");
var Route = createFileRoute("/admin/settings")({
	validateSearch: (search) => {
		return { tab: search.tab || "general" };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.settings-D0SXhj80.js.map