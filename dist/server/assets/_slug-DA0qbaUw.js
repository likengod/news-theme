import { i as getCategoryData } from "./taxonomy.functions-rJeBUiY9.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/$slug.tsx
var $$splitComponentImporter = () => import("./_slug-Bf8LUqfu.js");
var Route = createFileRoute("/$slug")({
	validateSearch: (raw) => ({ page: Number(raw.page) > 0 ? Number(raw.page) : 1 }),
	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: async ({ params, deps }) => {
		return await getCategoryData({ data: {
			slug: params.slug,
			page: deps.page || 1,
			limit: 10
		} });
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
