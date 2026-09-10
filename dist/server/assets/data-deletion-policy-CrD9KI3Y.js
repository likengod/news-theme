import { a as getCustomPagesServer } from "./site-content-D1yh80Dh.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/data-deletion-policy.tsx
var $$splitComponentImporter = () => import("./data-deletion-policy-DOhpCFY0.js");
var Route = createFileRoute("/data-deletion-policy")({
	head: () => ({
		meta: [
			{ title: "Data Deletion Policy | News Theme" },
			{
				name: "description",
				content: "How to request deletion of your personal data from News Theme systems."
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/data-deletion-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/data-deletion-policy"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "data-deletion-policy");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
