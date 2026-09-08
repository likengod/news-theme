import { C as hero_markets_default } from "./db.server-CLva-TlE.js";
import { a as getTags } from "./taxonomy.functions-Pe7WDm8S.js";
import { o as getHomepageArticles } from "./articles.functions-CpxgGCGy.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-DVaMXEkt.js");
var SITE_URL = "https://gorillatechsolution.com";
var HOME_IMG = `${SITE_URL}${hero_markets_default}`;
var HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
var HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
var Route = createFileRoute("/")({
	loader: async () => {
		const [articles, tags] = await Promise.all([getHomepageArticles({ data: 50 }), getTags()]);
		return {
			articles,
			tags
		};
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
