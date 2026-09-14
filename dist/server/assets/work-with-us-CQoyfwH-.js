import { u as getSiteSettingsServer } from "./site-content-J6c_9Nu1.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import "lucide-react";
//#region src/routes/work-with-us.tsx
var $$splitComponentImporter = () => import("./work-with-us-DSAqKjn0.js");
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

//# sourceMappingURL=work-with-us-CQoyfwH-.js.map