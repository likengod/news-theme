import { n as searchUnifiedPublic } from "./Header-58kimup8.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/search.tsx
var $$splitComponentImporter = () => import("./search-BUvsFA8u.js");
var Route = createFileRoute("/search")({
	validateSearch: (raw) => ({
		q: typeof raw.q === "string" ? raw.q : "",
		category: typeof raw.category === "string" ? raw.category : "All",
		page: Number(raw.page) > 0 ? Number(raw.page) : 1,
		tab: raw.tab === "articles" || raw.tab === "categories" || raw.tab === "pages" ? raw.tab : "all"
	}),
	loaderDeps: ({ search: { q, category, page, tab } }) => ({
		q,
		category,
		page,
		tab
	}),
	loader: async ({ deps }) => {
		try {
			return await searchUnifiedPublic({ data: {
				q: deps.q || "",
				category: deps.category || "All",
				page: deps.page || 1,
				limit: 15,
				tab: deps.tab || "all"
			} });
		} catch (err) {
			console.warn("[Search loader] Error:", err);
			return {
				query: deps.q || "",
				selectedCategory: deps.category || "All",
				activeTab: deps.tab || "all",
				articles: {
					items: [],
					total: 0,
					totalPages: 1
				},
				categories: [],
				pages: [],
				allCategories: [],
				counts: {
					articles: 0,
					categories: 0,
					pages: 0,
					total: 0
				}
			};
		}
	},
	head: ({ loaderData }) => {
		const q = loaderData?.query;
		return { meta: [{ title: q ? `Results for "${q}" – News Archive & Search` : "Search Site – News Theme" }, {
			name: "description",
			content: "Search across published news stories, editorial categories, information desks, and policy pages."
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=search-B8aFZy_c.js.map