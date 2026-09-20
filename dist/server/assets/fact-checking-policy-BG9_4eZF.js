import { t as getCustomPagesServer } from "./custom-pages-BFaHrlfZ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/fact-checking-policy.tsx
var $$splitComponentImporter = () => import("./fact-checking-policy-CWzWGxcV.js");
var Route = createFileRoute("/fact-checking-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "fact-checking-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Fact-Checking Policy",
		defaultDescription: "Our standards for fact-checking, multi-source verification, digital media analysis, and factual accuracy.",
		slug: "/fact-checking-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=fact-checking-policy-BG9_4eZF.js.map