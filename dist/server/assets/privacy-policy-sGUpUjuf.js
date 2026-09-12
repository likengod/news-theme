import { c as getCustomPagesServer } from "./site-content-CKhGm4KQ.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/privacy-policy.tsx
var $$splitComponentImporter = () => import("./privacy-policy-BCHR_0Sp.js");
var Route = createFileRoute("/privacy-policy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy — News Theme" },
			{
				name: "description",
				content: "How News Theme collects, uses and protects your personal information."
			},
			{
				property: "og:title",
				content: "Privacy Policy — News Theme"
			},
			{
				property: "og:url",
				content: "https://gorillatechsolution.com/privacy-policy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://gorillatechsolution.com/privacy-policy"
		}]
	}),
	loader: async () => {
		return (await getCustomPagesServer().catch(() => [])).find((p) => p.slug === "privacy-policy");
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=privacy-policy-sGUpUjuf.js.map