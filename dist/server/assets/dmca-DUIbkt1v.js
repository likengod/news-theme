import { h as getCustomPagesServer } from "./articles.functions-B_Uv83uf.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dmca.tsx
var $$splitComponentImporter = () => import("./dmca-B90_LLaF.js");
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

//# sourceMappingURL=dmca-DUIbkt1v.js.map