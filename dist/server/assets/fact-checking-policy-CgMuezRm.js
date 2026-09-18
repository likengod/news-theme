import { t as Route } from "./fact-checking-policy-D3Q1ES8F.js";
import { t as PolicyLayout } from "./PolicyLayout-CIjbOmSA.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/fact-checking-policy.tsx?tsr-split=component
function FactCheckingPage() {
	const page = Route.useLoaderData();
	return /* @__PURE__ */ jsx(PolicyLayout, {
		title: page?.title || "Fact-Checking Policy",
		intro: page?.intro || "",
		sections: page?.sections && page.sections.length > 0 ? page.sections.map((s) => ({
			heading: s.heading,
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: s.body } })
		})) : [{
			heading: page?.title || "Fact-Checking Policy",
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: page?.body || "" } })
		}]
	});
}
//#endregion
export { FactCheckingPage as component };

//# sourceMappingURL=fact-checking-policy-CgMuezRm.js.map