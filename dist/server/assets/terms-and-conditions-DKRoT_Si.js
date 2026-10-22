import { c as Route } from "./router-C5Amla14.js";
import { t as PolicyLayout } from "./PolicyLayout-JfBWmEG4.js";
import { jsx } from "react/jsx-runtime";
// src/routes/terms-and-conditions.tsx?tsr-split=component
function TermsPage() {
	const page = Route.useLoaderData();
	return /* @__PURE__ */ jsx(PolicyLayout, {
		title: page?.title || "",
		intro: page?.intro || "",
		sections: page?.sections && page.sections.length > 0 ? page.sections.map((s) => ({
			heading: s.heading,
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: s.body } })
		})) : [{
			heading: page?.title || "",
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: page?.body || "" } })
		}]
	});
}
export { TermsPage as component };

//# sourceMappingURL=terms-and-conditions-DKRoT_Si.js.map