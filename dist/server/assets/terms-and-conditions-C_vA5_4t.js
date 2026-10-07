import { h as getCustomPagesServer } from "./articles.functions-mASEQ4tr.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/terms-and-conditions.tsx
var $$splitComponentImporter = () => import("./terms-and-conditions-FroM82Q4.js");
var Route = createFileRoute("/terms-and-conditions")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "terms-and-conditions");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Terms & Conditions",
		defaultDescription: "The terms governing your use of News Theme's website, apps and services.",
		slug: "/terms-and-conditions"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=terms-and-conditions-C_vA5_4t.js.map