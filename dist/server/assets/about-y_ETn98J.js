import { t as Route } from "./about-DrFBPNFc.js";
import { t as PolicyLayout } from "./PolicyLayout-CFlFfWPp.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/about.tsx?tsr-split=component
function AboutPage() {
	const page = Route.useLoaderData();
	const rawTitle = page?.title || "About Us";
	const displayTitle = rawTitle.trim() === "About News Theme" || !rawTitle.trim() ? "About Us" : rawTitle;
	const validSections = (page?.sections || []).filter((s) => s.heading && s.heading.trim().toLowerCase() !== "about us" && s.heading.trim().toLowerCase() !== "about news theme" && s.heading.trim().toLowerCase() !== "about" && (s.body || "").replace(/<[^>]*>/g, "").trim().length > 0).map((s) => ({
		heading: s.heading,
		body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: s.body } })
	}));
	const hasBody = Boolean((page?.body || "").replace(/<[^>]*>/g, "").trim());
	return /* @__PURE__ */ jsx(PolicyLayout, {
		eyebrow: "",
		lastUpdated: "",
		hideDivider: true,
		dropCapIntro: true,
		title: displayTitle,
		intro: page?.intro || "",
		content: hasBody ? /* @__PURE__ */ jsx("div", {
			className: "prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed",
			dangerouslySetInnerHTML: { __html: page?.body || "" }
		}) : null,
		sections: validSections
	});
}
//#endregion
export { AboutPage as component };

//# sourceMappingURL=about-y_ETn98J.js.map