import { f as Route } from "./router-CB4D9jhW.js";
import { t as PolicyLayout } from "./PolicyLayout-CDz7q-f7.js";
import { jsx } from "react/jsx-runtime";
// src/routes/privacy-policy.tsx?tsr-split=component
function PrivacyPage() {
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
export { PrivacyPage as component };

//# sourceMappingURL=privacy-policy-OAjeHv_D.js.map