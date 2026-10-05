import { t as Route } from "./privacy-policy-CSQesozx.js";
import { t as PolicyLayout } from "./PolicyLayout-CBc8AkXW.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/privacy-policy.tsx?tsr-split=component
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
//#endregion
export { PrivacyPage as component };

//# sourceMappingURL=privacy-policy-IBTGQWpa.js.map