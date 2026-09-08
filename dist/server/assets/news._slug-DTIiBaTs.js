import { i as createServerFn } from "./esm-Dova13aH.js";
import { k as createSsrRpc } from "./site-content-CTdFps3N.js";
import { c as getPublicArticleBySlug } from "./articles.functions-BLEI1ivH.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
//#region src/lib/article-data.ts
async function getArticleData(slug) {
	try {
		const art = await getPublicArticleBySlug({ data: slug });
		if (!art) {
			const rawTitle = slug.replace(/-/g, " ");
			const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
			return {
				slug,
				title: title || "Exclusive Market Report",
				category: "Markets",
				author: "Justina Lee",
				date: (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric"
				}),
				publishedISO: (/* @__PURE__ */ new Date()).toISOString(),
				modifiedISO: (/* @__PURE__ */ new Date()).toISOString(),
				hero: "/placeholder.svg",
				midImage: "/placeholder.svg",
				paragraphs: [
					"Lottery-like options and speculative markets have captured the attention of a new generation of traders looking to navigate high inflation, rising home prices, and structural shifts in the job market. This shift has reshaped the landscape for retail investing.",
					"While financial regulators caution against the high volatility of short-dated derivatives and speculative instruments, market volumes continue to reach new records. Platforms have responded by tailoring interface designs to match mobile-first user behaviors.",
					"As retail trading continues to evolve, market experts advise focusing on core economic indicators and long-term asset building. Our weekly updates will continue tracking this ongoing story with insights from market analysts and local brokerage feeds."
				],
				views: 184320,
				excerpt: `${title} — read the full report and coverage on News Theme.`,
				access_level: "Free"
			};
		}
		const published = new Date(art.date);
		return {
			slug: art.slug,
			title: art.title,
			category: art.category,
			author: art.author || "Newsroom",
			date: published.toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit"
			}),
			publishedISO: published.toISOString(),
			modifiedISO: published.toISOString(),
			hero: art.featuredImage || "",
			midImage: art.featuredImage || "",
			paragraphs: [art.content || art.excerpt || art.title],
			views: art.views || 0,
			excerpt: art.excerpt || `${art.title} — read the full report on News Theme.`,
			access_level: art.access_level || "Free"
		};
	} catch (err) {
		console.error("[MySQL] Error loading article data:", err);
		return null;
	}
}
function articleQueryOptions(slug) {
	return queryOptions({
		queryKey: ["article", slug],
		queryFn: () => getArticleData(slug)
	});
}
//#endregion
//#region src/lib/origin.functions.ts
var getRequestOrigin = createServerFn({ method: "GET" }).handler(createSsrRpc("5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f"));
//#endregion
//#region src/routes/news.$slug.tsx
var $$splitComponentImporter = () => import("./news._slug-C2gPno0G.js");
var $$splitNotFoundComponentImporter = () => import("./news._slug-CBPh4QEV.js");
var $$splitErrorComponentImporter = () => import("./news._slug-Cxd2LUsz.js");
var Route = createFileRoute("/news/$slug")({
	loader: async ({ params, context }) => {
		const [data, origin] = await Promise.all([context.queryClient.ensureQueryData(articleQueryOptions(params.slug)), getRequestOrigin()]);
		return {
			data,
			origin
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData || !loaderData.data) return { meta: [{ title: "Article Not Found – News Theme" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { data, origin } = loaderData;
		const absImg = (data.hero || "").startsWith("http") ? data.hero : `${origin}${data.hero || ""}`;
		const url = `${origin}/news/${data.slug}`;
		return {
			meta: [
				{ title: `${data.title} – News Theme` },
				{
					name: "description",
					content: data.excerpt
				},
				{
					name: "robots",
					content: "index,follow"
				},
				{
					name: "author",
					content: data.author
				},
				{
					property: "og:title",
					content: data.title
				},
				{
					property: "og:description",
					content: data.excerpt
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: url
				},
				{
					property: "og:image",
					content: absImg
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
					property: "article:published_time",
					content: data.publishedISO
				},
				{
					property: "article:modified_time",
					content: data.modifiedISO
				},
				{
					property: "article:author",
					content: data.author
				},
				{
					property: "article:section",
					content: data.category
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: data.title
				},
				{
					name: "twitter:description",
					content: data.excerpt
				},
				{
					name: "twitter:image",
					content: absImg
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}, {
				rel: "preload",
				as: "image",
				href: data.hero,
				fetchPriority: "high"
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "NewsArticle",
					headline: data.title,
					image: [absImg],
					datePublished: data.publishedISO,
					dateModified: data.modifiedISO,
					author: [{
						"@type": "Person",
						name: data.author
					}],
					publisher: {
						"@type": "Organization",
						name: "News Theme",
						logo: {
							"@type": "ImageObject",
							url: `${origin}/favicon.ico`
						}
					},
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": url
					},
					description: data.excerpt
				})
			}]
		};
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { articleQueryOptions as n, Route as t };
