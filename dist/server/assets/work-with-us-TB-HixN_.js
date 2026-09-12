import { u as getSiteSettingsServer } from "./site-content-D2ezJ40R.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import "lucide-react";
//#region src/routes/work-with-us.tsx
var $$splitComponentImporter = () => import("./work-with-us-B1i1Wkt0.js");
var Route = createFileRoute("/work-with-us")({
	loader: async () => {
		return { settings: await getSiteSettingsServer() };
	},
	head: () => ({ meta: [{ title: "Work With Us — News Theme" }, {
		name: "description",
		content: "Apply as a volunteer journalist and grow into an Intern and Permanent role at News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=work-with-us-TB-HixN_.js.map