import { t as getCustomPagesServer } from "./custom-pages-Bj1aqmJT.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/about.tsx
var $$splitComponentImporter = () => import("./about-B0F1Z3TF.js");
var Route = createFileRoute("/about")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "about");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "About",
		defaultDescription: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
		slug: "/about"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
