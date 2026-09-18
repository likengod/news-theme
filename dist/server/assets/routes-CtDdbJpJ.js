import { g as hero_markets_default, n as getArticleImage } from "./news-data-CFwG4BZ_.js";
import { a as getTags } from "./taxonomy.functions-BttjdV_k.js";
import { o as getHomepageArticles } from "./articles.functions-ew3tHYlT.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-B4yE-CuH.js");
var SITE_URL = "https://gorillatechsolution.com";
var HOME_IMG = `${SITE_URL}${hero_markets_default}`;
var HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
var HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
var Route = createFileRoute("/")({
	loader: async () => {
		try {
			const [articles, tags] = await Promise.all([getHomepageArticles({ data: 25 }).catch((err) => {
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
	head: ({ loaderData }) => {
		const firstArticle = loaderData?.articles?.[0];
		const heroImage = firstArticle ? getArticleImage(firstArticle.featuredImage, 0) : HOME_IMG;
		const links = [{
			rel: "canonical",
			href: SITE_URL
		}];
		if (heroImage) links.push({
			rel: "preload",
			as: "image",
			href: heroImage,
			fetchPriority: "high"
		});
		return {
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
					content: heroImage || HOME_IMG
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
					content: heroImage || HOME_IMG
				}
			],
			links
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=routes-CtDdbJpJ.js.map