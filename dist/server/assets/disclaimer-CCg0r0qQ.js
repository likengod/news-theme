import { o as getCustomPagesServer } from "./site-content-CvnW9Ioy.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/disclaimer.tsx
var $$splitComponentImporter = () => import("./disclaimer-DtNUje5R.js");
var Route = createFileRoute("/disclaimer")({
	head: () => ({
		meta: [
			{ title: "Disclaimer — News Theme" },
			{
				name: "description",
				content: "Editorial, financial and general disclaimers for content published by News Theme."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/disclaimer"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/disclaimer"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "disclaimer");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=disclaimer-CCg0r0qQ.js.map