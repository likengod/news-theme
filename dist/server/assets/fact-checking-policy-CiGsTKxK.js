import { t as getCustomPagesServer } from "./custom-pages-Bj1aqmJT.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/fact-checking-policy.tsx
var $$splitComponentImporter = () => import("./fact-checking-policy-xkirkmjA.js");
var Route = createFileRoute("/fact-checking-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "fact-checking-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Fact-Checking Policy — News Theme",
		defaultDescription: "Our editorial standards for fact-checking, multi-source verification, digital media analysis, and factual accuracy.",
		slug: "/fact-checking-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
