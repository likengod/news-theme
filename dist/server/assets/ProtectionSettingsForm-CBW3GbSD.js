import { jsx, jsxs } from "react/jsx-runtime";
import { Info, Lock, ShieldAlert } from "lucide-react";
//#region src/components/admin/settings/ProtectionSettingsForm.tsx
function ProtectionSettingsForm({ s, update }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white shadow-xs",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-3.5",
				children: [
					/* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-slate-700" }),
					/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-slate-700",
						children: "Content Protection & Anti-Theft Safeguards"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800",
						children: "Active Security"
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-5 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "text-sm font-bold text-slate-800 flex items-center gap-2",
								children: ["Force HTTPS / SSL Strict Mode", /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4 text-emerald-600" })]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "When enabled, the server will automatically redirect all standard HTTP traffic to secure HTTPS. (Requires a valid SSL certificate like Let's Encrypt on your server)."
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => update("forceHttps", !s.forceHttps),
							className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${s.forceHttps ? "bg-emerald-600" : "bg-slate-300"}`,
							"aria-pressed": s.forceHttps,
							children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${s.forceHttps ? "translate-x-5" : "translate-x-0"}` })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-sm font-bold text-slate-800",
								children: "Enable Anti-Theft & Content Protection"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "When enabled, copying text, printing, right-clicking, and mobile screenshots will trigger a security notice modal requesting users to share the original link instead."
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => update("protectionEnabled", !s.protectionEnabled),
							className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${s.protectionEnabled ? "bg-slate-900" : "bg-slate-300"}`,
							"aria-pressed": s.protectionEnabled,
							children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${s.protectionEnabled ? "translate-x-5" : "translate-x-0"}` })
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold text-slate-700",
							children: "Protection Notice Modal Title"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: s.protectionModalTitle,
							onChange: (e) => update("protectionModalTitle", e.target.value),
							placeholder: "Content Protection - News Theme",
							className: "w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-slate-400",
							children: "Title heading shown inside the full-screen protection notice modal."
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold text-slate-700",
							children: "Protection Notice Message (Appeals & Guidance)"
						}),
						/* @__PURE__ */ jsx("textarea", {
							value: s.protectionModalMessage,
							onChange: (e) => update("protectionModalMessage", e.target.value),
							rows: 6,
							placeholder: "Our journalists work hard to bring you authentic news...",
							className: "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 font-sans text-xs leading-relaxed text-slate-800 focus:border-slate-900 focus:outline-none"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-slate-400",
							children: "Explain why direct link sharing supports your newsroom survival. Use double line breaks for paragraph breaks."
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-amber-200 bg-amber-50/50 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-bold text-amber-800",
							children: [/* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }), " Live Protection Notice Preview"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 rounded-lg border border-amber-200/60 bg-white p-4 text-xs text-slate-700 shadow-2xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-sm font-bold text-slate-900 mb-2",
								children: [/* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-amber-600" }), s.protectionModalTitle || "Content Protection - News Theme"]
							}), /* @__PURE__ */ jsx("p", {
								className: "whitespace-pre-line text-slate-600 text-[11px] leading-relaxed",
								children: s.protectionModalMessage || "Our journalists work hard to bring you authentic news..."
							})]
						})]
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4 text-indigo-600" }), /* @__PURE__ */ jsx("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-slate-700",
						children: "Dual-Layer Image Protection & Forensic Watermarking"
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: "rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-indigo-800",
					children: "Active Protection"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-5 sm:p-6 space-y-6",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs sm:text-sm text-slate-600 leading-relaxed",
						children: "Every image uploaded to your media library and article editor is automatically fortified with a two-tier anti-theft defense system. Even if pirates screenshot your content or strip file metadata, ownership can be mathematically proven."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800",
										children: "Layer 1"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-semibold text-blue-600",
										children: "The Surface Protection"
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-slate-900",
									children: "Cryptographic EXIF Signature"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: "Embeds hidden, encrypted text data directly into the image file's metadata (EXIF/XMP tags) behind the scenes."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "text-[11px] text-slate-500 space-y-1 list-disc list-inside",
									children: [
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
											className: "text-slate-700",
											children: "Ownership Details:"
										}), " Encrypts domain ownership and copyright."] }),
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
											className: "text-slate-700",
											children: "Social Media Linking:"
										}), " Embeds official social usernames from admin."] }),
										/* @__PURE__ */ jsxs("li", { children: [
											/* @__PURE__ */ jsx("strong", {
												className: "text-slate-700",
												children: "Digital Certificate:"
											}),
											" Instantly verified by the ",
											/* @__PURE__ */ jsx("code", {
												className: "text-blue-700",
												children: "/verify-image"
											}),
											" scanner."
										] })
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-purple-200/80 bg-purple-50/40 p-4 space-y-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-800",
										children: "Layer 2"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-semibold text-purple-600",
										children: "The Deep Protection"
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-slate-900",
									children: "Forensic Pixel Watermarking (Steganography)"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-600 leading-relaxed",
									children: "Invisibly weaves watermark DNA directly into the actual color pixels of the image using differential spatial-frequency steganography."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "text-[11px] text-slate-500 space-y-1 list-disc list-inside",
									children: [
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
											className: "text-slate-700",
											children: "Screenshot Proof:"
										}), " Survives phone/PC screen captures and clips."] }),
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
											className: "text-slate-700",
											children: "Tamper Resistant:"
										}), " Resists cropping, resizing, and JPEG compression."] }),
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
											className: "text-slate-700",
											children: "Automatic Fallback:"
										}), " Proves authentic derivative even if metadata is stripped."] })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-xs font-bold text-slate-900 uppercase tracking-wide",
							children: "Forensic Verification Scanner Tool"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Inspect any suspicious image or screenshot to extract Layer 1 signatures and Layer 2 pixel DNA."
						})] }), /* @__PURE__ */ jsxs("a", {
							href: "/verify-image",
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs shrink-0",
							children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4" }), "Open /verify-image Scanner"]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProtectionSettingsForm };
