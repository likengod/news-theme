import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ShieldCheck, ShieldOff, X } from "lucide-react";
//#region src/components/admin/journalists/JournalistProfileModal.tsx
function JournalistProfileModal({ viewTarget, setViewTarget, handleToggleBan }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4",
		onClick: () => setViewTarget(null),
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900",
						children: "Journalist Profile"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Read-only membership details"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: () => setViewTarget(null),
						className: "text-slate-400 hover:text-slate-600",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 space-y-6 max-h-[70vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 border-b border-slate-100 pb-4",
							children: [viewTarget.avatarUrl ? /* @__PURE__ */ jsx("img", {
								src: viewTarget.avatarUrl,
								alt: "",
								className: "h-16 w-16 rounded-full object-cover ring-2 ring-slate-100 bg-slate-100"
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid h-16 w-16 place-items-center rounded-full bg-slate-900 text-xl font-bold text-white",
								children: (viewTarget.displayName ?? "J").slice(0, 2).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h4", {
									className: "text-lg font-bold text-slate-900",
									children: viewTarget.displayName ?? "Unnamed Journalist"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-500",
									children: viewTarget.email
								}),
								/* @__PURE__ */ jsx("span", {
									className: `mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${viewTarget.active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`,
									children: viewTarget.active ? "Active Partner" : "Suspended"
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Journalist ID"
								}), /* @__PURE__ */ jsx("code", {
									className: "mt-1 block font-mono text-slate-800 text-sm font-semibold",
									children: viewTarget.journalistId || "Not assigned"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Public User ID"
								}), /* @__PURE__ */ jsx("code", {
									className: "mt-1 block font-mono text-slate-800 text-sm",
									children: viewTarget.publicUserId
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Phone"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.phone || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Blood Group"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.bloodGroup || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Date of Birth (DOB)"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.dob || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Press Card Valid Till"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.validTill || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Articles Published"
								}), /* @__PURE__ */ jsxs("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: [viewTarget.articlesPublished, " articles"]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Wallet Balance"
								}), /* @__PURE__ */ jsxs("span", {
									className: "mt-1 block text-slate-700 font-medium font-semibold text-amber-700",
									children: [viewTarget.points, " pts"]
								})] })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-t border-slate-100 pt-4 space-y-3 text-sm",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
								children: "Address"
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-1 block text-slate-700 leading-relaxed",
								children: viewTarget.address || "—"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
										children: "State"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-1 block text-slate-700",
										children: viewTarget.state || "—"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
										children: "Country"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-1 block text-slate-700",
										children: viewTarget.country || "—"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
										children: "Pin / ZIP"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-1 block text-slate-700 font-mono",
										children: viewTarget.pinCode || "—"
									})] })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-t border-slate-100 pt-4 space-y-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold text-slate-900 uppercase tracking-wider",
								children: "Bank Account Details"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3.5",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-[11px] font-semibold text-slate-400 uppercase",
										children: "Bank Name"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-0.5 block text-slate-700 font-medium",
										children: viewTarget.bankName || "—"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-[11px] font-semibold text-slate-400 uppercase",
										children: "Account Name"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-0.5 block text-slate-700 font-medium",
										children: viewTarget.bankAccountName || "—"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-[11px] font-semibold text-slate-400 uppercase",
										children: "Account Number"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-0.5 block text-slate-700 font-mono text-slate-800",
										children: viewTarget.bankAccountNo || "—"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-[11px] font-semibold text-slate-400 uppercase",
										children: "IFSC / Routing Code"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-0.5 block text-slate-700 font-mono text-slate-800",
										children: viewTarget.bankIfsc || "—"
									})] })
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => handleToggleBan(viewTarget),
						className: `inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors ${viewTarget.active ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"}`,
						children: viewTarget.active ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShieldOff, { className: "h-4 w-4 text-amber-600" }), " Suspend Account"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), " Activate Account"] })
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setViewTarget(null),
						className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm",
						children: "Close"
					})]
				})
			]
		})
	});
}
//#endregion
export { JournalistProfileModal };

//# sourceMappingURL=JournalistProfileModal-C6sd40dk.js.map