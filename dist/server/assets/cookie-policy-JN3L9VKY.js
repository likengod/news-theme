import { c as getCustomPagesServer } from "./site-content-TDicWjWm.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/cookie-policy.tsx
var $$splitComponentImporter = () => import("./cookie-policy-BcGcsT4E.js");
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

//# sourceMappingURL=cookie-policy-JN3L9VKY.js.map