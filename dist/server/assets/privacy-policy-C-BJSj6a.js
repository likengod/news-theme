import { b as getCustomPagesServer } from "./articles.functions-Gf_fB9aR.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/privacy-policy.tsx
var $$splitComponentImporter = () => import("./privacy-policy-Cat4MEeB.js");
var Route = createFileRoute("/privacy-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "privacy-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Privacy Policy",
		defaultDescription: "How News Theme collects, uses and protects your personal information.",
		slug: "/privacy-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=privacy-policy-C-BJSj6a.js.map