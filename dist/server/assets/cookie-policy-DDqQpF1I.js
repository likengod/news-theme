import { c as getCustomPagesServer } from "./site-content-CDp-F3e7.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cookie-policy.tsx
var $$splitComponentImporter = () => import("./cookie-policy-CfBq7oO6.js");
var Route = createFileRoute("/cookie-policy")({
	head: () => ({
		meta: [
			{ title: "Cookie Policy — News Theme" },
			{
				name: "description",
				content: "How News Theme uses cookies and similar technologies, and how to manage them."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/cookie-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/cookie-policy"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "cookie-policy");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=cookie-policy-DDqQpF1I.js.map