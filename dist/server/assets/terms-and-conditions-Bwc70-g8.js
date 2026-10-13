import { t as Route } from "./terms-and-conditions-e7Evx4Gy.js";
import { t as PolicyLayout } from "./PolicyLayout-GXw-aLBw.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/terms-and-conditions.tsx?tsr-split=component
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
//#endregion
export { TermsPage as component };

//# sourceMappingURL=terms-and-conditions-Bwc70-g8.js.map