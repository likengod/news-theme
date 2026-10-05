import { t as getCustomPagesServer } from "./custom-pages-de8xf-cQ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/refund-policy.tsx
var $$splitComponentImporter = () => import("./refund-policy-BOLhwR_3.js");
var Route = createFileRoute("/refund-policy")({
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "refund-policy");
	},
	head: ({ loaderData: page }) => buildPageHead({
		page,
		defaultTitle: "Refund Policy",
		defaultDescription: "Refund eligibility, timelines and process for News Theme subscriptions.",
		slug: "/refund-policy"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=refund-policy-6rE4My4U.js.map