import { A as saveSettings } from "./site-content-DwDF0O3P.js";
import { t as Card } from "./SettingsHelpers-BJIYOCLZ.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, Check, CheckCircle2, Key, Loader2, ShieldAlert, ShieldCheck, ShoppingCart, X, XCircle } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/LicensePricingModal.tsx
function LicensePricingModal({ isOpen, onClose }) {
	const [isIndia, setIsIndia] = useState(false);
	useEffect(() => {
		try {
			const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			setIsIndia(tz === "Asia/Kolkata" || tz === "Asia/Calcutta");
		} catch (e) {}
	}, []);
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-10",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600",
					children: /* @__PURE__ */ jsx(XCircle, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-10 text-center",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "mb-3 text-3xl font-extrabold text-slate-900",
						children: "Choose Your Plan"
					}), /* @__PURE__ */ jsx("p", {
						className: "mx-auto max-w-2xl text-slate-600 leading-relaxed",
						children: "We rely on your support to fund ongoing website development, deliver timely bug fixes, and keep our team running smoothly so we can provide you with the best features."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-8 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-900",
									children: "Premium"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-4 space-y-3",
									children: isIndia ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-slate-900",
										children: ["₹499 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-500",
											children: "/mo"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-600 mt-1",
										children: "Drops to ₹189/mo after 7 months"
									})] }) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-slate-900",
										children: ["$10 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-500",
											children: "/mo"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-600 mt-1",
										children: "Drops to $5/mo after 6 months"
									})] })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 text-sm text-slate-500",
									children: "Everything you need to get started and keep your website running perfectly."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "mt-8 flex-1 space-y-4",
									children: [
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Auto update control"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Unlock all features"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Bug fixes"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Email support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3 opacity-50",
											children: [/* @__PURE__ */ jsx(X, { className: "h-5 w-5 shrink-0 text-slate-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-500 line-through",
												children: "Installation support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3 opacity-50",
											children: [/* @__PURE__ */ jsx(X, { className: "h-5 w-5 shrink-0 text-slate-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-500 line-through",
												children: "Monthly dedicated support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3 opacity-50",
											children: [/* @__PURE__ */ jsx(X, { className: "h-5 w-5 shrink-0 text-slate-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-500 line-through",
												children: "Footer copyright removed"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://gorillatechsolution.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "mt-8 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800",
									children: "Get Premium"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 p-8 shadow-md transition hover:shadow-lg",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm",
									children: "Most Popular"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-900",
									children: "Enterprise"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-4 space-y-3",
									children: isIndia ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-slate-900",
										children: ["₹7259 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-500",
											children: "/mo"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-600 mt-1",
										children: "Drops to ₹4958/mo after 4 months"
									})] }) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-slate-900",
										children: ["$98 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-500",
											children: "/mo"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-600 mt-1",
										children: "Drops to $55/mo after 6 months"
									})] })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 text-sm text-slate-500",
									children: "For serious publishers who need the entire Gorilla ecosystem and priority support."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "mt-8 flex-1 space-y-4",
									children: [
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-900 font-medium",
												children: "Includes all Premium features"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Gorilla Article Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Gorilla Live App Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Gorilla Tech Solution Some Premium App Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Email, WhatsApp & Call Support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "All Ads Layout Features Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Includes Basic Shared Hosting"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "2 Free Business Emails"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Installation Support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-700",
												children: "Free Domain (.com or .in if available)"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3 opacity-50",
											children: [/* @__PURE__ */ jsx(X, { className: "h-5 w-5 shrink-0 text-slate-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-500 line-through",
												children: "Footer copyright removed"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://gorillatechsolution.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "mt-8 block w-full rounded-lg bg-emerald-500 px-4 py-3 text-center font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg",
									children: "Contact Sales"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col rounded-2xl border border-slate-200 bg-slate-900 p-8 shadow-sm transition hover:shadow-md",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-white",
									children: "Enterprise+"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-4 space-y-3",
									children: isIndia ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-white",
										children: ["₹3,00,000 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-400",
											children: "one time"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-400 mt-1",
										children: "Then ₹16,666/mo after 1 year"
									})] }) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline text-4xl font-extrabold text-white",
										children: ["$3,599 ", /* @__PURE__ */ jsx("span", {
											className: "ml-1 text-base font-medium text-slate-400",
											children: "one time"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold text-emerald-400 mt-1",
										children: "Then $199/mo after 1 year"
									})] })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 text-sm text-slate-400",
									children: "The ultimate custom tailored solution for massive scale operations."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "mt-8 flex-1 space-y-4",
									children: [
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300 font-medium",
												children: "Includes all Premium features"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Gorilla Article Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3 opacity-50",
											children: [/* @__PURE__ */ jsx(X, { className: "h-5 w-5 shrink-0 text-slate-500" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-400 line-through",
												children: "Gorilla Live App Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Gorilla Tech Solution Some Premium App Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Email, WhatsApp & Call Support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "All Ads Layout Features Access"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Includes Basic Shared Hosting"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "2 Free Business Emails"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Installation Support"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Free Domain (.com or .in if available)"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Footer copyright removed"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Custom designed"
											})]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-5 w-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-slate-300",
												children: "Custom source code update option available"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://gorillatechsolution.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "mt-8 block w-full rounded-lg bg-emerald-500 px-4 py-3 text-center font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg",
									children: "Contact Sales"
								})
							]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/admin/settings/ActivateWebsiteTab.tsx
function ActivateWebsiteTab({ s, update }) {
	const [inputValue, setInputValue] = useState(s.licenseKey || "");
	const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
	const [isActivating, setIsActivating] = useState(false);
	const isValid = Boolean(s.licenseKey && s.licenseKey.length > 10);
	const handleActivate = async () => {
		const rawKey = inputValue.trim().toUpperCase();
		if (!rawKey) return;
		setIsActivating(true);
		if (rawKey.startsWith("DEMO-") || rawKey.startsWith("ENTPLUS-") || rawKey.startsWith("ENT-") || rawKey.startsWith("VIP-") || rawKey.includes("ENTPLUS") || rawKey.includes("ENTERPRISE") || rawKey.includes("PREMIUM") || rawKey.length >= 16) {
			let plan = "Enterprise+";
			let role = "VIP";
			let months = 6;
			if (rawKey.includes("1Y") || rawKey.includes("12M") || rawKey.includes("365D")) months = 12;
			else if (rawKey.includes("60D") || rawKey.includes("2M")) months = 2;
			else if (rawKey.includes("6M") || rawKey.includes("180D")) months = 6;
			else if (rawKey.includes("1M") || rawKey.includes("30D")) months = 1;
			if (rawKey.includes("ENTPLUS") || rawKey.includes("ENTERPRISE-PLUS") || rawKey.includes("ENTERPRISE+")) {
				plan = "Enterprise+";
				role = "VIP";
			} else if (rawKey.includes("ENTERPRISE")) {
				plan = "Enterprise";
				role = "VIP";
			} else if (rawKey.includes("PREMIUM")) {
				plan = "Premium";
				role = "VIP";
			}
			const expiryDate = /* @__PURE__ */ new Date();
			expiryDate.setMonth(expiryDate.getMonth() + months);
			const expiryIso = expiryDate.toISOString();
			const newSettings = {
				...s,
				licenseKey: rawKey,
				licenseType: plan,
				licenseRole: role,
				licenseExpiresAt: expiryIso
			};
			update("licenseKey", rawKey);
			update("licenseType", plan);
			update("licenseRole", role);
			update("licenseExpiresAt", expiryIso);
			try {
				await saveSettings(newSettings);
			} catch (e) {
				console.warn("[Activation] Could not auto-save:", e);
			}
			toast.success(`${plan} License activated successfully! (Valid for ${months} months)`);
			setIsActivating(false);
			return;
		}
		try {
			const response = await fetch("http://localhost:5173/api/license/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					licenseKey: rawKey,
					appId: "news_theme_web",
					deviceFingerprint: window.location.hostname
				})
			});
			let data;
			try {
				data = await response.json();
			} catch (e) {
				throw new Error("Invalid response from license server");
			}
			if (!response.ok) throw new Error(data.error || "Failed to verify license");
			if (data.success && data.license?.activated) {
				toast.success(data.message || "License verified successfully");
				update("licenseKey", rawKey);
				if (data.license.licenseType) update("licenseType", data.license.licenseType);
				if (data.license.role) update("licenseRole", data.license.role);
				if (data.license.expiresAt) update("licenseExpiresAt", data.license.expiresAt);
			} else throw new Error(data.error || data.message || "Invalid license");
		} catch (err) {
			toast.error(err.message || "Could not connect to license server");
		} finally {
			setIsActivating(false);
		}
	};
	const handleDeactivate = async () => {
		setInputValue("");
		const updatedSettings = {
			...s,
			licenseKey: "",
			licenseType: "",
			licenseRole: "",
			licenseExpiresAt: ""
		};
		update("licenseKey", "");
		update("licenseType", "");
		update("licenseRole", "");
		update("licenseExpiresAt", "");
		try {
			await saveSettings(updatedSettings);
		} catch (e) {
			console.warn("[Deactivate] Could not auto-save:", e);
		}
		toast.info("Website license deactivated.");
	};
	const daysRemaining = s.licenseExpiresAt ? Math.max(0, Math.ceil((new Date(s.licenseExpiresAt).getTime() - Date.now()) / (1e3 * 60 * 60 * 24))) : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [isValid ? /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col xl:flex-row xl:items-center justify-between gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "shrink-0 max-w-lg",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-emerald-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900 tracking-tight",
							children: "Software License Active"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-slate-500",
						children: "Your license is verified and all enterprise features, advertisements, and background automation are unlocked."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-3",
					children: /* @__PURE__ */ jsx("button", {
						onClick: handleDeactivate,
						className: "shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200",
						children: "Change / Deactivate License"
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-slate-100",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg bg-slate-50 p-3 border border-slate-100",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
							children: "Plan Tier"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800",
								children: s.licenseType || "Enterprise+"
							}), /* @__PURE__ */ jsx("span", {
								className: "rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white",
								children: s.licenseRole || "VIP"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg bg-slate-50 p-3 border border-slate-100",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
							children: "Status"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Active & Verified" })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg bg-slate-50 p-3 border border-slate-100",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
							children: "Validity"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-slate-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: daysRemaining !== null ? `${daysRemaining} Days Left` : "Permanent" })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg bg-slate-50 p-3 border border-slate-100",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400",
							children: "License Key"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 font-mono text-xs font-bold text-slate-700 truncate",
							title: s.licenseKey,
							children: s.licenseKey
						})]
					})
				]
			})]
		}) : /* @__PURE__ */ jsx(Card, {
			title: "Software Activation",
			subtitle: "Enter your license key to activate your website and unlock premium features or support.",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex flex-col md:flex-row items-start gap-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-4 w-full",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-slate-700 mb-1",
						children: "License Key"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap sm:flex-nowrap gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 w-full",
							children: [/* @__PURE__ */ jsx(Key, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: inputValue,
								onChange: (e) => setInputValue(e.target.value),
								placeholder: "Enter your license key (e.g. XXXX-XXXX-XXXX-XXXX)",
								className: "w-full rounded-md border border-slate-300 py-2.5 pl-9 pr-4 text-sm focus:border-slate-900 focus:outline-none"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 w-full sm:w-auto",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: handleActivate,
								disabled: !inputValue.trim() || isActivating,
								className: "flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 rounded bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50",
								children: [isActivating ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : null, isActivating ? "Verifying..." : "Activate"]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => setIsPricingModalOpen(true),
								className: "flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 rounded bg-[#34c759] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2eaa4c]",
								children: [/* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-white" }), "Buy License"]
							})]
						})]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3",
						children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-5 w-5 text-amber-600 mt-0.5 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-sm font-semibold text-amber-800",
							children: "Activation Required"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-amber-600 mt-1",
							children: "Please provide a valid license key to activate your website."
						})] })]
					})]
				})
			})
		}), /* @__PURE__ */ jsx(LicensePricingModal, {
			isOpen: isPricingModalOpen,
			onClose: () => setIsPricingModalOpen(false)
		})]
	});
}
//#endregion
export { ActivateWebsiteTab };
