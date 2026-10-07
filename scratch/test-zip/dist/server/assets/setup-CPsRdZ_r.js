import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/setup.tsx?tsr-split=errorComponent
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ jsx("div", {
	className: "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6",
	children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-md w-full bg-slate-800 p-6 rounded-lg border border-red-500/30",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-red-400 font-bold text-lg mb-2",
				children: "Setup Wizard Error"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-300 font-mono break-all",
				children: error?.message || String(error)
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: () => window.location.reload(),
				className: "mt-4 px-4 py-2 bg-amber-500 text-slate-900 rounded font-semibold text-xs hover:bg-amber-400",
				children: "Reload Page"
			})
		]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };

//# sourceMappingURL=setup-CPsRdZ_r.js.map