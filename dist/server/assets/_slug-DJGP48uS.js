import { i as getCategoryData } from "./taxonomy.functions-Dx0dEut2.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/$slug.tsx
var $$splitComponentImporter = () => import("./_slug-D2yHOHz3.js");
var Route = createFileRoute("/$slug")({
	validateSearch: (raw) => ({ page: Number(raw.page) > 0 ? Number(raw.page) : 1 }),
	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: async ({ params, deps }) => {
		try {
			return await getCategoryData({ data: {
				slug: params.slug,
				page: deps.page || 1,
				limit: 10
			} });
		} catch (err) {
			console.warn("[Category loader] Error:", err);
			return null;
		}
	},
	head: ({ params }) => {
		const title = decodeURIComponent(params.slug).replace(/-/g, " ");
		const cap = title.charAt(0).toUpperCase() + title.slice(1);
		return { meta: [{ title: `${cap} – News Theme` }, {
			name: "description",
			content: `Latest ${cap} news, analysis and reports from News Theme.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
