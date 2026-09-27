//#region src/lib/site-content/page-seo.ts
function buildPageHead({ page, defaultTitle, defaultDescription, slug, siteName = "News Theme", origin }) {
	const baseOrigin = origin || (typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://todaytripura.com");
	const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;
	const title = page?.metaTitle?.trim() || `${page?.title || defaultTitle} — ${siteName}`;
	const description = page?.metaDescription?.trim() || page?.intro?.trim() || defaultDescription;
	const canonicalUrl = page?.canonicalUrl?.trim() || `${baseOrigin}${cleanSlug}`;
	const ogImage = page?.ogImage?.trim();
	const keywords = page?.metaKeywords?.trim();
	const noIndex = !!page?.noIndex;
	const meta = [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: canonicalUrl
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: ogImage ? "summary_large_image" : "summary"
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		}
	];
	if (keywords) meta.push({
		name: "keywords",
		content: keywords
	});
	if (ogImage) {
		meta.push({
			property: "og:image",
			content: ogImage
		});
		meta.push({
			name: "twitter:image",
			content: ogImage
		});
	}
	if (noIndex) meta.push({
		name: "robots",
		content: "noindex, nofollow"
	});
	else meta.push({
		name: "robots",
		content: "index, follow"
	});
	return {
		meta,
		links: [{
			rel: "canonical",
			href: canonicalUrl
		}]
	};
}
//#endregion
export { buildPageHead as t };

//# sourceMappingURL=page-seo-DqfajxWt.js.map