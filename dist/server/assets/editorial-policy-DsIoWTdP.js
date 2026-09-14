import { c as getCustomPagesServer } from "./site-content-B6BH1ZP8.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/editorial-policy.tsx
var $$splitComponentImporter = () => import("./editorial-policy-Dkf5WOWd.js");
var Route = createFileRoute("/editorial-policy")({
	head: () => ({
		meta: [
			{ title: "Editorial Policy — News Theme" },
			{
				name: "description",
				content: "Our standards for sourcing, verification, corrections and editorial independence."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/editorial-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/editorial-policy"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "editorial-policy");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=editorial-policy-DsIoWTdP.js.map