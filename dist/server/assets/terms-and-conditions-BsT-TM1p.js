import { c as getCustomPagesServer } from "./site-content-oAOxzZTh.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/terms-and-conditions.tsx
var $$splitComponentImporter = () => import("./terms-and-conditions-BQnpo2uu.js");
var Route = createFileRoute("/terms-and-conditions")({
	head: () => ({
		meta: [
			{ title: "Terms & Conditions — News Theme" },
			{
				name: "description",
				content: "The terms governing your use of News Theme's website, apps and services."
			},
			{
				property: "og:title",
				content: "Terms & Conditions — News Theme"
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/terms-and-conditions"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/terms-and-conditions"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "terms-and-conditions");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=terms-and-conditions-BsT-TM1p.js.map