import { t as Route } from "./refund-policy-Bvh9ROVo.js";
import { t as PolicyLayout } from "./PolicyLayout-WkelVl0F.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/refund-policy.tsx?tsr-split=component
function RefundPage() {
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
export { RefundPage as component };
