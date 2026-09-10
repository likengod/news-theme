import { s as getPublicArchiveArticles } from "./articles.functions-CpNjpl1s.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/archive.tsx
var $$splitComponentImporter = () => import("./archive-AJe4meAM.js");
var Route = createFileRoute("/archive")({
	validateSearch: (raw) => ({
		day: typeof raw.day === "string" ? raw.day : void 0,
		month: typeof raw.month === "string" ? raw.month : void 0,
		year: typeof raw.year === "string" ? raw.year : void 0,
		page: Number(raw.page) > 0 ? Number(raw.page) : 1
	}),
	loaderDeps: ({ search: { day, month, year, page } }) => ({
		day,
		month,
		year,
		page
	}),
	loader: async ({ deps }) => {
		try {
			return await getPublicArchiveArticles({ data: {
				year: deps.year,
				month: deps.month,
				day: deps.day,
				page: deps.page || 1,
				limit: 15
			} });
		} catch (err) {
			console.warn("[Archive loader] Error:", err);
			return {
				rows: [],
				total: 0,
				totalPages: 1
			};
		}
	},
	head: () => ({ meta: [{ title: "Archive – News Theme" }, {
		name: "description",
		content: "Browse past stories by day, month or year."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
