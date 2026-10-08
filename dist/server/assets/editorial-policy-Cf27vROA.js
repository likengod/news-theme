import { h as getCustomPagesServer } from "./articles.functions-Bi9KG4eO.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/editorial-policy.tsx
var $$splitComponentImporter = () => import("./editorial-policy-B9msJn0E.js");
var Route = createFileRoute("/editorial-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "editorial-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Editorial Policy",
		defaultDescription: "Our standards for sourcing, verification, corrections and editorial independence.",
		slug: "/editorial-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=editorial-policy-Cf27vROA.js.map