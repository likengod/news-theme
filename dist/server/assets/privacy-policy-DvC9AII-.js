import { b as getCustomPagesServer } from "./articles.functions-DV8UheU_.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/privacy-policy.tsx
var $$splitComponentImporter = () => import("./privacy-policy-r9_2OS-9.js");
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

//# sourceMappingURL=privacy-policy-DvC9AII-.js.map