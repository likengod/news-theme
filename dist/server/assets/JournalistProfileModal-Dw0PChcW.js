import { a as useSiteSettings } from "./AdSettingsContext-Dzko-urs.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle, ExternalLink, Eye, FileCheck, ShieldCheck, ShieldOff, X } from "lucide-react";
//#region src/components/admin/journalists/JournalistProfileModal.tsx
function JournalistProfileModal({ viewTarget, setViewTarget, handleToggleBan }) {
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	const isEnterprisePlus = planType.includes("enterprise+") || planType.includes("enterprise plus");
	const [viewingDoc, setViewingDoc] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4",
		onClick: () => setViewTarget(null),
		children: [/* @__PURE__ */ jsxs("div", {
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
									children: "Father's Name"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.fatherName || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Mother's Name"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.motherName || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Gender"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.gender || "—"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Marital Status"
								}), /* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-slate-700 font-medium",
									children: viewTarget.maritalStatus || "—"
								})] }),
								viewTarget.husbandName && /* @__PURE__ */ jsxs("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
										children: "Husband's Name"
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-1 block text-slate-700 font-medium",
										children: viewTarget.husbandName
									})]
								}),
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
								isEnterprisePlus && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider",
									children: "Wallet Balance"
								}), /* @__PURE__ */ jsxs("span", {
									className: "mt-1 block text-slate-700 font-medium font-semibold text-amber-700",
									children: [viewTarget.points, " pts"]
								})] })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "border-t border-slate-100 pt-4 space-y-3",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "block text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(FileCheck, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("span", { children: "Verification Document (ID Proof)" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200 bg-slate-50/70 p-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-between gap-2 mb-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block text-[11px] font-semibold text-slate-400 uppercase",
										children: "Document Type"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold text-slate-800",
										children: viewTarget.documentType || "Not Specified"
									})] }), viewTarget.documentUrl ? /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200",
										children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }), " Document Available"]
									}) : /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500",
										children: "No Document Uploaded"
									})]
								}), viewTarget.documentUrl ? /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-start gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										onClick: () => setViewingDoc(true),
										className: "group relative cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xs hover:ring-2 hover:ring-blue-500 transition shrink-0",
										children: [/* @__PURE__ */ jsx("img", {
											src: viewTarget.documentUrl,
											alt: "Verification Document",
											className: "h-28 w-40 object-contain p-1 group-hover:scale-105 transition duration-200"
										}), /* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition text-white text-[11px] font-semibold gap-1",
											children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Click to view" })]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 space-y-2 text-xs text-slate-600",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-slate-500",
											children: "Official document uploaded by applicant for journalist accreditation and identity verification."
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap gap-2 pt-1",
											children: [/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setViewingDoc(true),
												className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer",
												children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "View Document" })]
											}), /* @__PURE__ */ jsxs("a", {
												href: viewTarget.documentUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-2xs",
												children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Open Full Image ↗" })]
											})]
										})]
									})]
								}) : /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-400 italic",
									children: "No official ID document was submitted for this journalist record."
								})]
							})]
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
						className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer",
						children: "Close"
					})]
				})
			]
		}), viewingDoc && viewTarget.documentUrl && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-60 grid place-items-center bg-black/80 p-4",
			onClick: () => setViewingDoc(false),
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative max-h-[90vh] max-w-3xl rounded-2xl bg-white p-4 shadow-2xl overflow-hidden",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-200",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(FileCheck, { className: "h-5 w-5 text-blue-600" }), /* @__PURE__ */ jsxs("span", {
							className: "font-bold text-slate-900 text-sm",
							children: [
								viewTarget.documentType || "ID Document",
								" — ",
								viewTarget.displayName
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("a", {
							href: viewTarget.documentUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100",
							children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Open Full Size" })]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setViewingDoc(false),
							className: "rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer",
							title: "Close viewer",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex items-center justify-center max-h-[75vh] overflow-auto bg-slate-900/5 rounded-xl p-2",
					children: /* @__PURE__ */ jsx("img", {
						src: viewTarget.documentUrl,
						alt: "Document Full View",
						className: "max-h-[70vh] w-auto object-contain rounded-lg shadow-sm"
					})
				})]
			})
		})]
	});
}
//#endregion
export { JournalistProfileModal };

//# sourceMappingURL=JournalistProfileModal-Dw0PChcW.js.map