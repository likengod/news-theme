import { t as getCustomPagesServer } from "./custom-pages-de8xf-cQ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cookie-policy.tsx
var $$splitComponentImporter = () => import("./cookie-policy-DKa5G3MA.js");
var Route = createFileRoute("/cookie-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "cookie-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Cookie Policy",
		defaultDescription: "How News Theme uses cookies and similar technologies, and how to manage them.",
		slug: "/cookie-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=cookie-policy-ogZPO9O7.js.map