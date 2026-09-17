import { t as getCustomPagesServer } from "./custom-pages-BMyoYyGR.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cookie-policy.tsx
var $$splitComponentImporter = () => import("./cookie-policy-8uwY5ki8.js");
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

//# sourceMappingURL=cookie-policy-Jrn2IIci.js.map