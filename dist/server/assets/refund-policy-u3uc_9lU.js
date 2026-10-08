import { b as getCustomPagesServer } from "./articles.functions-BCQm5p-_.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/refund-policy.tsx
var $$splitComponentImporter = () => import("./refund-policy-OcPHXrmy.js");
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

//# sourceMappingURL=refund-policy-u3uc_9lU.js.map