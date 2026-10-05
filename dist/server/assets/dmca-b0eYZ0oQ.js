import { t as getCustomPagesServer } from "./custom-pages-ldZclO95.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dmca.tsx
var $$splitComponentImporter = () => import("./dmca-DvsERwoD.js");
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

//# sourceMappingURL=dmca-b0eYZ0oQ.js.map