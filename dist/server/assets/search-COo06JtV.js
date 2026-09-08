import { d as searchPublicArticles } from "./articles.functions-C1BZ18RU.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/search.tsx
var $$splitComponentImporter = () => import("./search-C9Tf1kaq.js");
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
		return await searchPublicArticles({ data: {
			q: deps.q || "",
			category: deps.category || "All",
			page: deps.page || 1,
			limit: 15
		} });
	},
	head: () => ({ meta: [{ title: "Search – News Theme" }, {
		name: "description",
		content: "Search the News Theme news archive."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
