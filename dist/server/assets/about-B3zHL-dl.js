import { c as getCustomPagesServer } from "./site-content-D2ezJ40R.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/about.tsx
var $$splitComponentImporter = () => import("./about-CAEbt83-.js");
var Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About — News Theme" },
			{
				name: "description",
				content: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/about"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "about");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=about-B3zHL-dl.js.map