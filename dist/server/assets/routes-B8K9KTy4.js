import { C as hero_markets_default } from "./db.server-Chz3iTW3.js";
import { a as getTags } from "./taxonomy.functions-CcHBngOq.js";
import { o as getHomepageArticles } from "./articles.functions-mN6d7f8T.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-CLMZZkzO.js");
var SITE_URL = "https://gorillatechsolution.com";
var HOME_IMG = `${SITE_URL}${hero_markets_default}`;
var HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
var HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
var Route = createFileRoute("/")({
	loader: async () => {
		try {
			const [articles, tags] = await Promise.all([getHomepageArticles({ data: 50 }).catch((err) => {
				console.warn("[Homepage Loader] getHomepageArticles fallback to empty:", err?.message || err);
				return [];
			}), getTags().catch((err) => {
				console.warn("[Homepage Loader] getTags fallback to empty:", err?.message || err);
				return [];
			})]);
			return {
				articles: Array.isArray(articles) ? articles : [],
				tags: Array.isArray(tags) ? tags : []
			};
		} catch (err) {
			console.error("[Homepage Loader] Top-level error, rendering fallback:", err);
			return {
				articles: [],
				tags: []
			};
		}
	},
	head: () => ({
		meta: [
			{ title: HOME_TITLE },
			{
				name: "description",
				content: HOME_DESC
			},
			{
				property: "og:title",
				content: HOME_TITLE
			},
			{
				property: "og:description",
				content: HOME_DESC
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: SITE_URL
			},
			{
				property: "og:image",
				content: HOME_IMG
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				property: "og:site_name",
				content: "News Theme"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: HOME_TITLE
			},
			{
				name: "twitter:description",
				content: HOME_DESC
			},
			{
				name: "twitter:image",
				content: HOME_IMG
			}
		],
		links: [{
			rel: "canonical",
			href: SITE_URL
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
