import { a as useSiteSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { t as Route } from "./fact-checking-policy-CiGsTKxK.js";
import { t as PolicyLayout } from "./PolicyLayout-DkS8Ba1t.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
//#region src/routes/fact-checking-policy.tsx?tsr-split=component
function FactCheckingPage() {
	const page = Route.useLoaderData();
	const isEnterprise = (useSiteSettings()?.licenseType || "").toLowerCase().includes("enterprise");
	return /* @__PURE__ */ jsx(PolicyLayout, {
		title: page?.title || "Fact-Checking Policy",
		intro: page?.intro || "Our editorial commitment to accuracy, transparent sourcing, multi-point verification, and combating misinformation across all reporting.",
		headerAction: isEnterprise ? /* @__PURE__ */ jsxs(Link, {
			to: "/fact-check",
			className: "inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs group",
			children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" }), /* @__PURE__ */ jsx("span", { children: "Live Fact-Check Scanner →" })]
		}) : void 0,
		notice: isEnterprise ? /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsx("span", { children: "Want to verify a suspicious news article, WhatsApp forward, or viral claim right now?" }), /* @__PURE__ */ jsxs(Link, {
				to: "/fact-check",
				className: "inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-2 hover:opacity-80",
				children: [/* @__PURE__ */ jsx("span", { children: "Open Fact-Check Scanner" }), /* @__PURE__ */ jsx("span", { children: "→" })]
			})]
		}) : void 0,
		sections: page?.sections && page.sections.length > 0 ? page.sections.map((s) => ({
			heading: s.heading,
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: s.body } })
		})) : [{
			heading: page?.title || "Fact-Checking Standards",
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: page?.body || "<p>We adhere to strict non-partisanship, transparent sourcing, verifiable evidence, and transparent corrections. Every claim published is corroborated with primary documents and official records.</p>" } })
		}]
	});
}
//#endregion
export { FactCheckingPage as component };
