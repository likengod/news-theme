import { t as getCustomPagesServer } from "./custom-pages-BMRmjpE6.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dmca.tsx
var $$splitComponentImporter = () => import("./dmca-CoLaGy0M.js");
var Route = createFileRoute("/dmca")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "dmca");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "DMCA Notice & Policy",
		defaultDescription: "How to submit a DMCA copyright takedown notice to News Theme.",
		slug: "/dmca"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=dmca-J3xJW4QC.js.map