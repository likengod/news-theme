import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Rocket } from "lucide-react";
//#region src/routes/admin.tsx?tsr-split=errorComponent
function AdminErrorFallback() {
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 text-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md w-full rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600",
					children: /* @__PURE__ */ jsx(Rocket, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold text-slate-900 mb-2",
					children: "Reconnecting to Server"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed",
					children: "The server is applying an update or restarting. Please click retry once the server completes rebooting."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row gap-2.5 justify-center",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							if (typeof window !== "undefined") window.location.reload();
						},
						className: "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition",
						children: "Retry Connection"
					}), /* @__PURE__ */ jsx("a", {
						href: "/auth",
						className: "w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition",
						children: "Return to Login"
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminErrorFallback as errorComponent };

//# sourceMappingURL=admin-F33_sldM.js.map