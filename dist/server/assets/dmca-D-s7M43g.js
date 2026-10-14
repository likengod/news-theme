import { b as getCustomPagesServer } from "./articles.functions-DV8UheU_.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dmca.tsx
var $$splitComponentImporter = () => import("./dmca-DlSHNH33.js");
var Route = createFileRoute("/dmca")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "dmca");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "DMCA Notice & Policy",
		defaultDescription: "How to submit a DMCA copyright takedown notice to News Theme.",
		slug: "/dmca"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=dmca-D-s7M43g.js.map