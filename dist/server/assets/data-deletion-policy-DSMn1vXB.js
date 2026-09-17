import { t as getCustomPagesServer } from "./custom-pages-C9hl1zUB.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/data-deletion-policy.tsx
var $$splitComponentImporter = () => import("./data-deletion-policy-BceW2LZ0.js");
var Route = createFileRoute("/data-deletion-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "data-deletion-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Data Deletion Policy",
		defaultDescription: "How to request deletion of your personal data from News Theme systems.",
		slug: "/data-deletion-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=data-deletion-policy-DSMn1vXB.js.map