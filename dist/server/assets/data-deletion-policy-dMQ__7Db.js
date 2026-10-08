import { h as getCustomPagesServer } from "./articles.functions-Dmd2TpvR.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/data-deletion-policy.tsx
var $$splitComponentImporter = () => import("./data-deletion-policy-B6adJxn-.js");
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

//# sourceMappingURL=data-deletion-policy-dMQ__7Db.js.map