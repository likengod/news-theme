import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-yq3xI-Mp.js";
import { r as getSiteSettingsServer } from "./site-settings-B5-evvXQ.js";
import { c as getHomepageArticles, u as getPublicArticleBySlug } from "./articles.functions-DxUTj2Uw.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
//#region src/lib/article-data.ts
function parseArticleDate(dateVal) {
	if (!dateVal) return /* @__PURE__ */ new Date();
	if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? /* @__PURE__ */ new Date() : dateVal;
	if (typeof dateVal === "string") {
		const trimmed = dateVal.trim();
		if (!trimmed || trimmed.startsWith("0000-00-00")) return /* @__PURE__ */ new Date();
		let d = new Date(trimmed);
		if (!isNaN(d.getTime())) return d;
		if (trimmed.includes(" ")) {
			d = new Date(trimmed.replace(" ", "T"));
			if (!isNaN(d.getTime())) return d;
		}
		if (trimmed.includes(" ") && !trimmed.endsWith("Z")) {
			d = /* @__PURE__ */ new Date(trimmed.replace(" ", "T") + "Z");
			if (!isNaN(d.getTime())) return d;
		}
	}
	if (typeof dateVal === "number") {
		const d = new Date(dateVal);
		if (!isNaN(d.getTime())) return d;
	}
	return /* @__PURE__ */ new Date();
}
async function getArticleData(slug) {
	try {
		const art = await getPublicArticleBySlug({ data: slug });
		if (!art) {
			const rawTitle = slug.replace(/-/g, " ");
			const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
			const paragraphs = [
				"Lottery-like options and speculative markets have captured the attention of a new generation of traders looking to navigate high inflation, rising home prices, and structural shifts in the job market. This shift has reshaped the landscape for retail investing.",
				"While financial regulators caution against the high volatility of short-dated derivatives and speculative instruments, market volumes continue to reach new records. Platforms have responded by tailoring interface designs to match mobile-first user behaviors.",
				"As retail trading continues to evolve, market experts advise focusing on core economic indicators and long-term asset building. Our weekly updates will continue tracking this ongoing story with insights from market analysts and local brokerage feeds."
			];
			const now = /* @__PURE__ */ new Date();
			return {
				slug,
				title: title || "Exclusive Market Report",
				category: "Markets",
				author: "Justina Lee",
				date: now.toLocaleString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric"
				}),
				publishedISO: now.toISOString(),
				modifiedISO: now.toISOString(),
				hero: "/placeholder.svg",
				midImage: "/placeholder.svg",
				paragraphs,
				views: 184320,
				excerpt: `${title} — read the full report and coverage on News Theme.`,
				access_level: "Free"
			};
		}
		const published = parseArticleDate(art.date);
		const isoString = published.toISOString();
		let displayDate = "";
		try {
			displayDate = published.toLocaleString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit"
			});
		} catch {
			displayDate = published.toDateString();
		}
		let paragraphs = [];
		if (art.content && typeof art.content === "string" && art.content.trim()) paragraphs = [art.content];
		else if (art.excerpt && typeof art.excerpt === "string" && art.excerpt.trim()) paragraphs = [art.excerpt];
		else paragraphs = [art.title || ""];
		return {
			slug: art.slug,
			title: art.title || "",
			category: art.category || "News",
			author: art.author || "Newsroom",
			date: displayDate,
			publishedISO: isoString,
			modifiedISO: isoString,
			hero: art.featuredImage || "",
			midImage: art.featuredImage || "",
			imageCaption: art.imageCaption || "",
			imageCredit: art.imageCredit || "",
			paragraphs,
			views: Number(art.views) || 0,
			excerpt: art.excerpt || art.title || "",
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
var $$splitComponentImporter = () => import("./news._slug-D05_rL8G.js");
var $$splitNotFoundComponentImporter = () => import("./news._slug-CBPh4QEV.js");
var $$splitErrorComponentImporter = () => import("./news._slug-Cxd2LUsz.js");
var Route = createFileRoute("/news/$slug")({
	loader: async ({ params, context }) => {
		try {
			const [data, origin, settings, trendingArticles] = await Promise.all([
				context.queryClient.ensureQueryData(articleQueryOptions(params.slug)).catch(() => null),
				getRequestOrigin().catch(() => ""),
				getSiteSettingsServer().catch(() => null),
				getHomepageArticles({ data: 8 }).catch(() => [])
			]);
			return {
				data,
				origin,
				siteName: settings?.siteName || "Today Tripura",
				trendingArticles: Array.isArray(trendingArticles) ? trendingArticles : []
			};
		} catch (err) {
			console.warn("[Article loader] Error:", err);
			return {
				data: null,
				origin: "",
				siteName: "Today Tripura",
				trendingArticles: []
			};
		}
	},
	head: ({ loaderData }) => {
		const siteName = loaderData?.siteName || "Today Tripura";
		if (!loaderData || !loaderData.data) return { meta: [{ title: `Article Not Found – ${siteName}` }, {
			name: "robots",
			content: "noindex"
		}] };
		const { data, origin } = loaderData;
		const absImg = (data.hero || "").startsWith("http") ? data.hero : `${origin}${data.hero || ""}`;
		const url = `${origin}/news/${data.slug}`;
		return {
			meta: [
				{ title: `${data.title} – ${siteName}` },
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
					content: siteName
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
			}, ...data.hero && typeof data.hero === "string" && data.hero.trim() ? [{
				rel: "preload",
				as: "image",
				href: absImg,
				fetchPriority: "high"
			}] : []],
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
						name: siteName,
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

//# sourceMappingURL=news._slug-BKPS5u2o.js.map