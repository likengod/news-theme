import { B as Link$1, H as useSearch } from "./vendor-tanstack-router-DyNvzQpG.js";
import { t as Footer } from "./Footer-2SdwkGhM.js";
import { t as Header } from "./Header-FFsKyEtO.js";
import { c as verifyPromoCodeServer, n as claimPromoCodeInStoreServer } from "./vouchers-CIfEA0uS.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, CheckCircle2, Lock, RotateCcw, Search, ShieldCheck, Sparkles, Store, Tag, XCircle } from "lucide-react";
import { toast } from "sonner";
// src/routes/claim-offer.tsx?tsr-split=component
function ClaimOfferPage() {
	const search = useSearch({ from: "/claim-offer" });
	const [codeInput, setCodeInput] = useState(search.code || "");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [result, setResult] = useState(null);
	const [storeName, setStoreName] = useState("Local Partner Store");
	const [claimedSuccess, setClaimedSuccess] = useState(false);
	const [claimedRecord, setClaimedRecord] = useState(null);
	const verifyCode = async (codeToTest) => {
		const clean = codeToTest.trim();
		if (!clean) {
			toast.error("Please enter a promo code");
			return;
		}
		setLoading(true);
		setClaimedSuccess(false);
		try {
			const res = await verifyPromoCodeServer({ data: { code: clean } });
			setResult(res);
			if (res.status === "valid") toast.success("Promo code is valid and ready to claim!");
			else if (res.status === "already_used") toast.error("This promo code has ALREADY been used!");
			else if (res.status === "expired") toast.warning("This promo code has expired.");
			else toast.error(res.message);
		} catch (err) {
			toast.error(err?.message || "Failed to verify promo code");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (search.code) {
			setCodeInput(search.code);
			verifyCode(search.code);
		}
	}, [search.code]);
	const handleClaim = async () => {
		if (!codeInput.trim()) return;
		setSubmitting(true);
		try {
			const res = await claimPromoCodeInStoreServer({ data: {
				code: codeInput.trim(),
				storeName: storeName.trim() || "Local Partner Store"
			} });
			setClaimedSuccess(true);
			setClaimedRecord(res.record);
			setResult(null);
			toast.success(res.message);
		} catch (err) {
			toast.error(err?.message || "Failed to claim promo code");
		} finally {
			setSubmitting(false);
		}
	};
	const handleReset = () => {
		setCodeInput("");
		setResult(null);
		setClaimedSuccess(false);
		setClaimedRecord(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-xl px-4 py-8 sm:py-12 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-center mb-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-3",
								children: [/* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }), " Partner Merchant Verification Portal"]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900",
								children: "Verify & Claim Store Offer"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto",
								children: "Scan customer QR code or input the promo code below to verify validity, check previous usage, and grant the store discount."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-6",
						children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2",
							children: "Enter Promo / Voucher Code"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ jsx(Tag, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: codeInput,
									onChange: (e) => setCodeInput(e.target.value.toUpperCase()),
									onKeyDown: (e) => e.key === "Enter" && verifyCode(codeInput),
									placeholder: "e.g. STORE50-AB12 or NT-FLIPKART500-...",
									className: "w-full font-mono text-sm uppercase rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: loading || !codeInput.trim(),
								onClick: () => verifyCode(codeInput),
								className: "inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition",
								children: loading ? "Checking..." : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), " Check Offer"] })
							})]
						})]
					}),
					claimedSuccess && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-emerald-300 bg-emerald-50/80 p-6 text-center shadow-md animate-in fade-in duration-200 space-y-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-sm",
								children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8" })
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800",
									children: "Discount Successfully Applied"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-2 text-xl font-black text-emerald-950",
									children: "Promo Code Redeemed!"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-emerald-700",
									children: "This coupon code has now been permanently locked and marked as used."
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-emerald-200 bg-white p-4 text-left text-xs space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Promo Code:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-mono font-bold text-slate-900 text-sm",
											children: claimedRecord?.code || codeInput
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Store / Merchant:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900",
											children: claimedRecord?.usedByStoreName || storeName
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Time of Redemption:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900",
											children: (/* @__PURE__ */ new Date()).toLocaleString()
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleReset,
								className: "inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs",
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), " Check Another Code"]
							})
						]
					}),
					result?.status === "already_used" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-red-300 bg-red-50/90 p-6 shadow-sm animate-in fade-in duration-200 space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-white shrink-0",
									children: /* @__PURE__ */ jsx(XCircle, { className: "h-6 w-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-900",
										children: "Action Blocked"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-lg font-black text-red-950 mt-1",
										children: "ALREADY USED & REDEEMED"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-800 mt-0.5 leading-relaxed",
										children: result.message
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-red-200 bg-white/90 p-4 text-xs space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Offer Title:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-slate-900",
											children: result.record?.voucherTitle || result.voucher?.title
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Code:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-mono font-bold text-red-700",
											children: result.record?.code
										})]
									}),
									result.record?.usedAt && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-100 pb-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "First Used At:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900",
											children: new Date(result.record.usedAt).toLocaleString()
										})]
									}),
									result.record?.usedByStoreName && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Redeemed At:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-900",
											children: result.record.usedByStoreName
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-red-700 text-center font-medium",
								children: "⚠️ Do NOT provide discounts for this coupon. It has already been redeemed once."
							})
						]
					}),
					result?.status === "expired" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-6 shadow-sm animate-in fade-in duration-200 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-600 text-white shrink-0",
								children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6" })
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900",
									children: "Validity Expired"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-lg font-black text-amber-950 mt-1",
									children: "Coupon Expired"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-amber-800 mt-0.5 leading-relaxed",
									children: result.message
								})
							] })]
						}), /* @__PURE__ */ jsx("div", {
							className: "rounded-xl border border-amber-200 bg-white/90 p-4 text-xs space-y-2",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "Expired Date:"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-amber-900",
									children: result.record?.expiresAt ? new Date(result.record.expiresAt).toLocaleDateString() : "Expired"
								})]
							})
						})]
					}),
					(result?.status === "invalid" || result?.status === "unclaimed_by_user") && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400",
								children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: "Code Not Recognized"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 max-w-sm mx-auto leading-relaxed",
								children: result.message
							})
						]
					}),
					result?.status === "valid" && /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border-2 border-emerald-400 bg-white p-6 shadow-lg animate-in fade-in duration-200 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0",
									children: /* @__PURE__ */ jsx(Sparkles, { className: "h-6 w-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800",
										children: "Verified & Ready"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-lg font-black text-slate-900 mt-1",
										children: result.record?.voucherTitle || result.voucher?.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500",
										children: result.record?.discountDescription || result.voucher?.description
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-200/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Promo Code:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-mono font-black text-rose-600 text-base",
											children: result.record?.code
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center border-b border-slate-200/60 pb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Customer Claim Date:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800",
											children: result.record?.claimedAt ? new Date(result.record.claimedAt).toLocaleDateString() : "Active"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500",
											children: "Valid Until:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-emerald-700",
											children: result.record?.expiresAt ? new Date(result.record.expiresAt).toLocaleDateString() : "No expiration"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 pt-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-700",
									children: "Store Name / Cashier Name (for record):"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: storeName,
									onChange: (e) => setStoreName(e.target.value),
									placeholder: "e.g. Agartala Branch / Cashier 1",
									className: "w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: submitting,
								onClick: handleClaim,
								className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50",
								children: submitting ? "Redeeming..." : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }), "Mark as Claimed / Grant Discount"] })
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-400 text-center",
								children: "⚠️ Once you click \"Mark as Claimed\", this code will be permanently used and cannot be claimed again."
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-center mt-8",
						children: /* @__PURE__ */ jsx(Link$1, {
							to: "/withdraw-points",
							className: "text-xs font-semibold text-slate-500 hover:text-slate-800 transition",
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

//# sourceMappingURL=claim-offer-DNA-FAK3.js.map