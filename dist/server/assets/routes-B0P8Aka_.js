import { r as getSiteSettingsServer } from "./site-settings-TC6eL9IL.js";
import { g as hero_markets_default, n as getArticleImage } from "./news-data-CFwG4BZ_.js";
import { a as getTags } from "./taxonomy.functions-CuyFiXig.js";
import { o as getHomepageArticles } from "./articles.functions-DEy_4BI0.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-BL_qEtIB.js");
var HOME_IMG = hero_markets_default;
var HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
var HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
var Route = createFileRoute("/")({
	loader: async () => {
		try {
			const [articles, tags, settings] = await Promise.all([
				getHomepageArticles({ data: 25 }).catch((err) => {
					console.warn("[Homepage Loader] getHomepageArticles fallback to empty:", err?.message || err);
					return [];
				}),
				getTags().catch((err) => {
					console.warn("[Homepage Loader] getTags fallback to empty:", err?.message || err);
					return [];
				}),
				getSiteSettingsServer().catch(() => null)
			]);
			return {
				articles: Array.isArray(articles) ? articles : [],
				tags: Array.isArray(tags) ? tags : [],
				settings
			};
		} catch (err) {
			console.error("[Homepage Loader] Top-level error, rendering fallback:", err);
			return {
				articles: [],
				tags: [],
				settings: null
			};
		}
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		const firstArticle = loaderData?.articles?.[0];
		const heroImage = firstArticle ? getArticleImage(firstArticle.featuredImage, 0) : HOME_IMG;
		const canonicalUrl = `${s?.seoCanonicalBaseUrl?.trim()?.replace(/\/$/, "") || (typeof process !== "undefined" && process.env?.APP_ORIGIN ? process.env.APP_ORIGIN.replace(/\/$/, "") : "") || (typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://todaytripura.com")}/`;
		const links = [{
			rel: "canonical",
			href: canonicalUrl
		}];
		const siteTitle = s?.siteName || "News Theme";
		const title = s?.siteName ? `${s.siteName} – ${s.tagline || "Breaking News"}` : HOME_TITLE;
		const desc = s?.metaDescription || HOME_DESC;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: desc
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: desc
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: canonicalUrl
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
					content: siteTitle
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: desc
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
