import { u as Route } from "./router-ipLUeN-s.js";
import { t as PolicyLayout } from "./PolicyLayout-CPbqw7Yi.js";
import { jsx } from "react/jsx-runtime";
// src/routes/refund-policy.tsx?tsr-split=component
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
export { RefundPage as component };

//# sourceMappingURL=refund-policy-BRcTLNlt.js.map