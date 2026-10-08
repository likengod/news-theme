import { h as getCustomPagesServer } from "./articles.functions-C513lTPQ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/disclaimer.tsx
var $$splitComponentImporter = () => import("./disclaimer-DKsOYebc.js");
var Route = createFileRoute("/disclaimer")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "disclaimer");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Disclaimer",
		defaultDescription: "Editorial, financial and general disclaimers for content published by News Theme.",
		slug: "/disclaimer"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=disclaimer-DVcst_GS.js.map