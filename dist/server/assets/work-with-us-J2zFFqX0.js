import { n as defaultSettings, r as getSiteSettingsServer } from "./site-settings-BUmudUHt.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import "lucide-react";
//#region src/routes/work-with-us.tsx
var $$splitComponentImporter = () => import("./work-with-us-hk6VCZlR.js");
var Route = createFileRoute("/work-with-us")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) || defaultSettings };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.workWithUsHeroTitle || "Work With Us",
				metaTitle: s?.workWithUsMetaTitle,
				metaDescription: s?.workWithUsMetaDescription,
				ogImage: s?.workWithUsOgImage,
				metaKeywords: s?.workWithUsKeywords,
				canonicalUrl: s?.workWithUsCanonicalUrl,
				noIndex: s?.workWithUsNoIndex
			},
			defaultTitle: "Work With Us",
			defaultDescription: "Apply as a volunteer journalist and grow into an Intern and Permanent role at News Theme.",
			slug: "/work-with-us"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

//# sourceMappingURL=work-with-us-J2zFFqX0.js.map