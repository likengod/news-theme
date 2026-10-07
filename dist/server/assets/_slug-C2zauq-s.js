import { i as getCategoryData } from "./taxonomy.functions-tZGnapwK.js";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
//#region src/routes/$slug.tsx
var $$splitComponentImporter = () => import("./_slug-DxksH8LB.js");
var Route = createFileRoute("/$slug")({
	validateSearch: (raw) => {
		const p = Number(raw.page);
		return { page: p > 0 ? p : void 0 };
	},
	loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
	loader: async ({ params, deps }) => {
		try {
			const data = await getCategoryData({ data: {
				slug: params.slug,
				page: deps.page || 1,
				limit: 10
			} });
			if (data?.category?.redirectUrl) throw redirect({ href: data.category.redirectUrl });
			return data;
		} catch (err) {
			if (err && typeof err === "object" && ("to" in err || "href" in err || "status" in err || err.isRedirect)) throw err;
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

//# sourceMappingURL=_slug-C2zauq-s.js.map