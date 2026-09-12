import { c as getCustomPagesServer } from "./site-content-oAOxzZTh.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/dmca.tsx
var $$splitComponentImporter = () => import("./dmca-Bjei8lFm.js");
var Route = createFileRoute("/dmca")({
	head: () => ({
		meta: [
			{ title: "DMCA — News Theme" },
			{
				name: "description",
				content: "How to submit a DMCA copyright takedown notice to News Theme."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/dmca"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/dmca"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "dmca");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=dmca-BJGs55eZ.js.map