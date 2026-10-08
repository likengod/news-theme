import { b as getCustomPagesServer } from "./articles.functions-Bp2zOjMU.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/terms-and-conditions.tsx
var $$splitComponentImporter = () => import("./terms-and-conditions-D_-Ky3BJ.js");
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

//# sourceMappingURL=terms-and-conditions-BzzrL3N3.js.map