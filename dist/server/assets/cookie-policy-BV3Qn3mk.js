import { o as getCustomPagesServer } from "./site-content-685WOgBx.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cookie-policy.tsx
var $$splitComponentImporter = () => import("./cookie-policy-Bc6sqeTg.js");
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

//# sourceMappingURL=cookie-policy-BV3Qn3mk.js.map