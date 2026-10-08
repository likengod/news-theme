import { h as getCustomPagesServer } from "./articles.functions-CU1maW7Q.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/disclaimer.tsx
var $$splitComponentImporter = () => import("./disclaimer-D6SS7U0s.js");
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

//# sourceMappingURL=disclaimer-DxfQZvF7.js.map