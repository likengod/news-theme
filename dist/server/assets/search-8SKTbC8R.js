import { f as searchPublicArticles } from "./articles.functions-D_cLt0OU.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/search.tsx
var $$splitComponentImporter = () => import("./search-OydGGaSg.js");
var Route = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : "",
		category: typeof raw.category === "string" ? raw.category : "All",
		page: Number(raw.page) > 0 ? Number(raw.page) : 1
	}),
	loaderDeps: ({ search: { q, category, page } }) => ({
		q,
		category,
		page
	}),
	loader: async ({ deps }) => {
		try {
			return await searchPublicArticles({ data: {
				q: deps.q || "",
				category: deps.category || "All",
				page: deps.page || 1,
				limit: 15
			} });
		} catch (err) {
			console.warn("[Search loader] Error:", err);
			return {
				items: [],
				total: 0,
				totalPages: 1
			};
		}
	},
	head: () => ({ meta: [{ title: "Search – News Theme" }, {
		name: "description",
		content: "Search the News Theme news archive."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=search-8SKTbC8R.js.map