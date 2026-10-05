import { t as Route } from "./terms-and-conditions-USE6lCMx.js";
import { t as PolicyLayout } from "./PolicyLayout-88wF_wiG.js";
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

//# sourceMappingURL=terms-and-conditions-D60SOLWC.js.map