import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/admin.settings.tsx
var $$splitComponentImporter = () => import("./admin.settings-1p57rS1o.js");
var Route = createFileRoute("/admin/settings")({
	validateSearch: (search) => {
		return { tab: search.tab || "general" };
	},
	head: () => ({ meta: [{ title: "Site Settings - Admin Dashboard" }, {
		name: "description",
		content: "Manage site branding, SEO, analytics, and integrations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=admin.settings-CPpD_IPe.js.map