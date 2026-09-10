import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/reels.tsx
var $$splitComponentImporter = () => import("./reels-Dh5c5GLF.js");
var Route = createFileRoute("/reels")({
	validateSearch: (raw) => ({ page: Number(raw.page) > 0 ? Number(raw.page) : 1 }),
	head: () => ({ meta: [{ title: "Reels & Shorts — Vanguard News" }, {
		name: "description",
		content: "Explore trending news reels, shorts, and video stories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
