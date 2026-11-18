import { B as Link$1, H as useSearch } from "./vendor-tanstack-router-DyNvzQpG.js";
import { t as Footer } from "./Footer-BGqiWw89.js";
import { t as Header } from "./Header-DzQpWCgj.js";
import { c as verifyPromoCodeServer, n as claimPromoCodeInStoreServer } from "./vouchers-V476PAvK.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Building2, Check, CheckCircle2, Clock, Copy, Info, Lock, RotateCcw, Search, ShieldCheck, Sparkles, Store, Tag, XCircle } from "lucide-react";
// src/routes/claim-offer.tsx?tsr-split=component
function ClaimOfferPage() {
	const search = useSearch({ from: "/claim-offer" });
	const [codeInput, setCodeInput] = useState(search.code || "");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [result, setResult] = useState(null);
	const [inputError, setInputError] = useState(null);
	const [claimError, setClaimError] = useState(null);
	const [storeName, setStoreName] = useState("Local Partner Store");
	const [claimedSuccess, setClaimedSuccess] = useState(false);
	const [claimedRecord, setClaimedRecord] = useState(null);
	const [copied, setCopied] = useState(false);
	const verifyCode = async (codeToTest) => {
		const clean = codeToTest.trim();
		if (!clean) {
			setInputError("Please enter a promo code first");
			setResult(null);
			return;
		}
		setInputError(null);
		setClaimError(null);
		setLoading(true);
		setClaimedSuccess(false);
		try {
			const res = await verifyPromoCodeServer({ data: { code: clean } });
			setResult(res);
		} catch (err) {
			setInputError(err?.message || "Failed to verify promo code");
			setResult(null);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (search.code) {
			const upper = search.code.toUpperCase();
			setCodeInput(upper);
			verifyCode(upper);
		}
	}, [search.code]);
	const handleClaim = async () => {
		const code = codeInput.trim().toUpperCase();
		if (!code) return;
		setClaimError(null);
		setSubmitting(true);
		try {
			const res = await claimPromoCodeInStoreServer({ data: {
				code,
				storeName: storeName.trim() || "Local Partner Store"
			} });
			setClaimedSuccess(true);
			setClaimedRecord(res.record);
			setResult(null);
		} catch (err) {
			setClaimError(err?.message || "Failed to claim promo code");
		} finally {
			setSubmitting(false);
		}
	};
	const handleReset = () => {
		setCodeInput("");
		setResult(null);
		setInputError(null);
		setClaimError(null);
		setClaimedSuccess(false);
		setClaimedRecord(null);
	};
	const copyCodeToClipboard = (txt) => {
		navigator.clipboard.writeText(txt);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50/60 dark:bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-2xl px-4 py-8 sm:py-12 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-center mb-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 shadow-2xs dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 mb-3",
								children: [/* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }), " Partner Merchant Verification Portal"]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white",
								children: "Verify & Claim Promo Code"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed",
								children: "Scan customer QR codes or type promo codes to check real-time validity, discount terms, previous usage, and permanently claim discounts."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md dark:border-border dark:bg-card mb-6",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5",
								children: "Enter Promo / Voucher Code"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row gap-2.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative flex-1",
									children: [/* @__PURE__ */ jsx(Tag, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: codeInput,
										onChange: (e) => {
											setCodeInput(e.target.value.toUpperCase());
											setInputError(null);
										},
										onKeyDown: (e) => e.key === "Enter" && verifyCode(codeInput),
										placeholder: "e.g. STORE50-A101 or NT-VOUCHER-...",
										className: "w-full font-mono text-sm uppercase rounded-xl border border-slate-200 pl-10 pr-4 py-3 bg-slate-50 font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-border dark:bg-muted/40 dark:text-white dark:focus:bg-muted transition"
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									disabled: loading || !codeInput.trim(),
									onClick: () => verifyCode(codeInput),
									className: "inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-rose-700 active:scale-[0.99] disabled:opacity-50 transition shrink-0",
									children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 animate-spin" }), " Checking..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), " Check Offer"] })
								})]
							}),
							inputError && /* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300",
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 shrink-0 text-red-600" }), /* @__PURE__ */ jsx("span", { children: inputError })]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Info, { className: "h-3.5 w-3.5 text-slate-400 shrink-0" }), "Both admin-generated pre-loaded promo codes and user-withdrawn voucher passes can be verified."]
							})
						]
					}),
					claimedSuccess && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-6 sm:p-7 text-center shadow-lg dark:bg-emerald-950/40 dark:border-emerald-600 animate-in fade-in duration-200 space-y-4 mb-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md",
								children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-9 w-9" })
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200",
									children: "Discount Successfully Applied"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-2.5 text-2xl font-black text-emerald-950 dark:text-emerald-100",
									children: "Promo Code Redeemed!"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-emerald-800 dark:text-emerald-300",
									children: "This code is now permanently locked and marked as used in the database."
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-emerald-200 bg-white p-4 text-left text-xs space-y-2.5 shadow-2xs dark:border-emerald-900/60 dark:bg-card",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Promo Code:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-mono font-bold text-slate-900 dark:text-white text-sm",
											children: claimedRecord?.code || codeInput
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Offer Title:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900 dark:text-white",
											children: claimedRecord?.voucherTitle || "Store Offer"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Store / Branch:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900 dark:text-white",
											children: claimedRecord?.usedByStoreName || storeName
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Time of Redemption:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900 dark:text-white",
											children: (/* @__PURE__ */ new Date()).toLocaleString()
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: true,
								className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 px-5 text-sm sm:text-base font-black text-white shadow-md cursor-not-allowed opacity-95 transition",
								children: [/* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }), "Already Claimed / Code Locked"]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleReset,
								className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 shadow-xs transition",
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), " Verify Another Code"]
							})
						]
					}),
					result?.status === "already_used" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-red-400 bg-red-50/95 p-6 shadow-md dark:bg-red-950/40 dark:border-red-600 animate-in fade-in duration-200 space-y-4 mb-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-red-600 text-white shadow-xs shrink-0",
									children: /* @__PURE__ */ jsx(XCircle, { className: "h-7 w-7" })
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-900 dark:bg-red-900/60 dark:text-red-200",
										children: "Duplicate Redemption Blocked"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-xl font-black text-red-950 dark:text-red-100 mt-1",
										children: "ALREADY USED & REDEEMED"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-800 dark:text-red-300 mt-0.5 leading-relaxed",
										children: result.message
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-red-200 bg-white p-4 text-xs space-y-2 dark:border-red-900/50 dark:bg-card",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Offer Title:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-slate-900 dark:text-white",
											children: result.record?.voucherTitle || result.voucher?.title
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Code:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-mono font-bold text-red-700 dark:text-red-400",
											children: result.record?.code
										})]
									}),
									result.record?.usedAt && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "First Used On:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900 dark:text-white",
											children: new Date(result.record.usedAt).toLocaleString()
										})]
									}),
									result.record?.usedByStoreName && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Redeemed At:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900 dark:text-white",
											children: result.record.usedByStoreName
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "rounded-lg bg-red-100/90 dark:bg-red-900/30 p-2.5 text-center text-xs font-bold text-red-800 dark:text-red-200",
								children: "⚠️ DO NOT provide discounts for this code. It has already been redeemed once!"
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: true,
								className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 px-5 text-sm sm:text-base font-black text-white shadow-md cursor-not-allowed opacity-95 transition",
								children: [/* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }), "Already Claimed / Grant Discount Blocked"]
							})
						]
					}),
					result?.status === "expired" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-6 shadow-sm dark:bg-amber-950/40 dark:border-amber-700 animate-in fade-in duration-200 space-y-4 mb-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-12 w-12 place-items-center rounded-xl bg-amber-600 text-white shadow-xs shrink-0",
								children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-7 w-7" })
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:bg-amber-900 dark:text-amber-200",
									children: "Validity Expired"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-xl font-black text-amber-950 dark:text-amber-100 mt-1",
									children: "Coupon Expired"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed",
									children: result.message
								})
							] })]
						}), /* @__PURE__ */ jsx("div", {
							className: "rounded-xl border border-amber-200 bg-white p-4 text-xs space-y-2 dark:border-amber-900/50 dark:bg-card",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "Expired Date:"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-amber-900 dark:text-amber-300",
									children: result.record?.expiresAt ? new Date(result.record.expiresAt).toLocaleDateString() : "Expired"
								})]
							})
						})]
					}),
					result?.status === "invalid" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 text-center shadow-sm dark:border-border dark:bg-card space-y-3 mb-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-muted dark:text-slate-400",
								children: /* @__PURE__ */ jsx(Lock, { className: "h-7 w-7" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold text-slate-900 dark:text-white",
								children: "Code Not Recognized"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed",
								children: result.message
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleReset,
								className: "text-xs font-semibold text-rose-600 hover:underline pt-2",
								children: "Try Another Code"
							})
						]
					}),
					result?.status === "valid" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-7 shadow-xl dark:border-emerald-600 dark:bg-card animate-in fade-in duration-200 space-y-5 mb-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 p-3.5 text-xs sm:text-sm font-bold text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-600 dark:text-emerald-200",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Promo code is valid and ready to claim!" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-3 flex-wrap",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-2xs dark:bg-emerald-950 dark:text-emerald-400 shrink-0",
										children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
											children: "✓ Code Verified & Valid"
										}), result.voucher?.tag && /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-muted dark:text-slate-300",
											children: result.voucher.tag
										})]
									}), /* @__PURE__ */ jsx("h2", {
										className: "text-xl font-black text-slate-900 dark:text-white mt-1",
										children: result.record?.voucherTitle || result.voucher?.title
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right dark:bg-emerald-950/40 dark:border-emerald-800",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block",
										children: "Status"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-emerald-700 dark:text-emerald-400",
										children: "Ready to Claim"
									})]
								})]
							}),
							(result.record?.discountDescription || result.voucher?.description) && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-muted/40 p-3 rounded-xl border border-slate-100 dark:border-border leading-relaxed",
								children: result.record?.discountDescription || result.voucher?.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs space-y-2.5 dark:border-border dark:bg-muted/20",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-200/60 dark:border-border/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Promo Code:"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-mono font-black text-rose-600 text-base sm:text-lg tracking-wide",
												children: result.record?.code
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => copyCodeToClipboard(result.record?.code || ""),
												className: "inline-flex items-center gap-1 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition",
												title: "Copy Code",
												children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-bold text-emerald-600",
													children: "Copied!"
												})] }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-200/60 dark:border-border/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Valid Until:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-emerald-700 dark:text-emerald-400",
											children: result.record?.expiresAt ? new Date(result.record.expiresAt).toLocaleDateString() : "Active"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-slate-400",
											children: "Redemption Type:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800 dark:text-slate-200",
											children: "Single-Use In-Store Discount"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300",
									children: "Store Name / Branch Name (Saved for your audit log):"
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Building2, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: storeName,
										onChange: (e) => setStoreName(e.target.value),
										placeholder: "e.g. Agartala City Store / Cashier Counter 1",
										className: "w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none dark:border-border dark:bg-muted/40 dark:text-white"
									})]
								})]
							}),
							claimError && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 rounded-xl bg-red-50 border-2 border-red-300 p-3.5 text-xs sm:text-sm font-bold text-red-900 dark:bg-red-950/60 dark:border-red-700 dark:text-red-200",
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-600 shrink-0" }), /* @__PURE__ */ jsx("span", { children: claimError })]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: submitting,
								onClick: handleClaim,
								className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-5 text-sm sm:text-base font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50",
								children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 animate-spin" }), " Redeeming & Locking Code..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }), "Mark as Claimed / Grant Discount"] })
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed",
								children: [
									"🔒 ",
									/* @__PURE__ */ jsx("strong", { children: "Single-Use Protection:" }),
									" Clicking \"Claim Offer\" permanently marks this code as used in the database. It cannot be used again by anyone."
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-border dark:bg-card",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center",
							children: "How Store Verification Works"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-3 text-center",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs mx-auto mb-2",
											children: "1"
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: "Scan or Enter"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
											children: "Scan customer QR pass or type the promo code above."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs mx-auto mb-2",
											children: "2"
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: "Instant Check"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
											children: "Verify discount title, active validity, and check for duplicate usage."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs mx-auto mb-2",
											children: "3"
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: "Claim & Lock"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
											children: "Click claim to grant discount and permanently lock code against reuse."
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-center mt-8",
						children: /* @__PURE__ */ jsx(Link$1, {
							to: "/withdraw-points",
							className: "text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition",
							children: "← Back to Withdraw Points"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
export { ClaimOfferPage as component };

//# sourceMappingURL=claim-offer-BIxswdYt.js.map