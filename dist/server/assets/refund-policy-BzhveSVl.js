import { c as getCustomPagesServer } from "./site-content-D2ezJ40R.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/refund-policy.tsx
var $$splitComponentImporter = () => import("./refund-policy-DDnOgsHk.js");
var Route = createFileRoute("/refund-policy")({
	head: () => ({
		meta: [
			{ title: "Refund Policy — News Theme" },
			{
				name: "description",
				content: "Refund eligibility, timelines and process for News Theme subscriptions."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/refund-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/refund-policy"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "refund-policy");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=refund-policy-BzhveSVl.js.map