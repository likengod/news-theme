import { o as getCustomPagesServer } from "./site-content-CsN6nWHI.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/about.tsx
var $$splitComponentImporter = () => import("./about-BG5aN3nd.js");
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
