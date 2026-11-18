import { B as Link$1 } from "./vendor-tanstack-router-DyNvzQpG.js";
import { t as Footer } from "./Footer-2SdwkGhM.js";
import { t as Header } from "./Header-FFsKyEtO.js";
import { t as authClient } from "./auth-client-DJbaTV2S.js";
import { f as submitWithdrawRequest } from "./inbox.functions-D47ukH2g.js";
import { a as loadVouchers, i as getVouchersServer, o as redeemVoucherServer } from "./vouchers-CIfEA0uS.js";
import { n as getVoucherColorClasses, r as getVoucherIconComponent } from "./VouchersManager-DaDDjxEJ.js";
import { t as VoucherQrModal } from "./VoucherQrModal-D91VUFdS.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, Gift, Lock, QrCode, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
// src/routes/withdraw-points.tsx?tsr-split=component
var MIN_WITHDRAW = 256;
var STORAGE = "nt:withdraw:v1";
function load(userId) {
	if (typeof window === "undefined") return {
		balance: 0,
		claimed: {}
	};
	try {
		const raw = localStorage.getItem(`${STORAGE}:${userId}`);
		if (raw) return JSON.parse(raw);
	} catch {}
	return {
		balance: 0,
		claimed: {}
	};
}
function save(userId, s) {
	localStorage.setItem(`${STORAGE}:${userId}`, JSON.stringify(s));
	localStorage.setItem(`nt:points:${userId}`, String(s.balance));
}
function WithdrawPointsPage() {
	const [userId, setUserId] = useState(null);
	const [userName, setUserName] = useState(void 0);
	const [userEmail, setUserEmail] = useState(void 0);
	const [state, setState] = useState({
		balance: 0,
		claimed: {}
	});
	const [vouchers, setVouchers] = useState(() => loadVouchers().filter((v) => v.enabled !== false));
	const [selectedQrVoucher, setSelectedQrVoucher] = useState(null);
	useEffect(() => {
		getVouchersServer().then((data) => {
			if (Array.isArray(data) && data.length > 0) setVouchers(data.filter((v) => v.enabled !== false));
		}).catch(() => {});
	}, []);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			const u = data.session?.user;
			if (!u) return;
			setUserId(u.id);
			setUserEmail(u.email);
			setUserName(u.user_metadata?.display_name || u.user_metadata?.full_name);
			const s = load(u.id);
			s.balance = Number(localStorage.getItem(`nt:points:${u.id}`) ?? "0");
			save(u.id, s);
			setState({ ...s });
		});
	}, []);
	const canWithdraw = state.balance >= MIN_WITHDRAW;
	const hasClaimedFree = Object.keys(state.claimed).some((id) => vouchers.find((v) => v.id === id)?.freeUnlock);
	const claim = async (v) => {
		if (!userId) return toast.error("Please sign in first");
		if (!canWithdraw) return toast.error(`You need at least ${MIN_WITHDRAW} points to withdraw`);
		if (state.claimed[v.id]) return toast.info("Already claimed");
		if (!v.freeUnlock && !hasClaimedFree) return toast.error("Claim your free 6-month Premium first to unlock other vouchers");
		if (state.balance < v.cost) return toast.error("Not enough points");
		const remainingStock = v.stockType === "codes_pool" ? (v.codesPool || []).length : v.stockType === "limited" ? v.stock ?? 0 : null;
		if (remainingStock !== null && remainingStock <= 0) return toast.error("Sorry, this voucher is currently out of stock!");
		try {
			let finalCode = "";
			let expiresAt;
			try {
				const res = await redeemVoucherServer({ data: {
					voucherId: v.id,
					userId: userId || void 0,
					userName,
					userEmail
				} });
				finalCode = res.code;
				expiresAt = res.expiresAt;
				if (res.vouchers) setVouchers(res.vouchers.filter((item) => item.enabled !== false));
			} catch (srvErr) {
				finalCode = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
				const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
				expiresAt = new Date(Date.now() + days * 864e5).toISOString();
			}
			submitWithdrawRequest({ data: {
				voucherId: v.id,
				voucherTitle: v.title,
				amount: v.cost,
				paymentMethod: "voucher"
			} }).catch(() => {});
			const next = {
				balance: state.balance - v.cost,
				claimed: {
					...state.claimed,
					[v.id]: finalCode
				}
			};
			save(userId, next);
			setState(next);
			toast.success(`Voucher claimed! Your Code: ${finalCode}`);
			setSelectedQrVoucher({
				voucher: v,
				code: finalCode,
				expiresAt
			});
		} catch (err) {
			toast.error(err?.message || "Failed to claim voucher");
		}
	};
	const progress = Math.min(100, state.balance / MIN_WITHDRAW * 100);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-10 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "mb-6 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
							children: "Wallet"
						}), /* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-4xl font-bold",
							children: "Withdraw Points"
						})] }), /* @__PURE__ */ jsx(Link$1, {
							to: "/earn-points",
							className: "text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline",
							children: "← Back to Earn Points"
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "mb-8 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/40 dark:to-background",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white",
									children: /* @__PURE__ */ jsx(Wallet, { className: "h-6 w-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "Wallet balance"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-3xl font-bold text-emerald-700 dark:text-emerald-400",
									children: ["₹", state.balance]
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !canWithdraw,
								onClick: () => canWithdraw ? toast.success("Withdrawals unlocked — pick a voucher below") : toast.error(`Reach ${MIN_WITHDRAW} points to unlock withdrawals`),
								className: `rounded-md px-5 py-2 text-sm font-bold text-white transition ${canWithdraw ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-muted-foreground/40"}`,
								children: canWithdraw ? "Withdraw" : `Locked · ${MIN_WITHDRAW}+ needed`
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full bg-emerald-600 transition-all",
									style: { width: `${progress}%` }
								})
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: canWithdraw ? "You can withdraw now." : `${MIN_WITHDRAW - state.balance} more points to unlock withdrawals.`
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("section", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center justify-between gap-2 flex-wrap",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "flex items-center gap-2 text-xl font-bold",
								children: [/* @__PURE__ */ jsx(Gift, { className: "h-5 w-5 text-rose-500" }), " Available Vouchers"]
							}), /* @__PURE__ */ jsxs(Link$1, {
								to: "/profile",
								className: "text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " View My Claimed Passes in Profile"]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: vouchers.map((v) => {
								const Icon = getVoucherIconComponent(v.icon);
								const colors = getVoucherColorClasses(v.color);
								const claimedCode = state.claimed[v.id];
								const remainingStock = v.stockType === "codes_pool" ? (v.codesPool || []).length : v.stockType === "limited" ? v.stock ?? 0 : null;
								const isOutOfStock = remainingStock !== null && remainingStock <= 0;
								const locked = !canWithdraw || !v.freeUnlock && !hasClaimedFree || isOutOfStock;
								return /* @__PURE__ */ jsxs("div", {
									className: `relative overflow-hidden rounded-xl border p-5 transition flex flex-col justify-between ${isOutOfStock ? "border-dashed border-border bg-muted/30 opacity-75" : v.featured ? "border-amber-300 bg-amber-50/60 dark:bg-amber-950/20" : "border-border bg-card"}`,
									children: [/* @__PURE__ */ jsxs("div", { children: [
										v.featured && /* @__PURE__ */ jsx("span", {
											className: "absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white",
											children: "Free"
										}),
										/* @__PURE__ */ jsx("span", {
											className: `mb-3 grid h-10 w-10 place-items-center rounded-full ${colors.bg} ${colors.text}`,
											children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
											children: v.tag
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm font-bold leading-snug",
											children: v.title
										}),
										v.description && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
											children: v.description
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-2.5 flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ jsxs("p", {
												className: "text-muted-foreground",
												children: [
													"Cost:",
													" ",
													/* @__PURE__ */ jsx("span", {
														className: "font-semibold text-foreground",
														children: v.cost === 0 ? "Free" : `₹${v.cost}`
													})
												]
											}), remainingStock !== null && /* @__PURE__ */ jsx("span", {
												className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${remainingStock > 5 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : remainingStock > 0 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"}`,
												children: remainingStock > 0 ? `${remainingStock} in stock` : "Out of Stock"
											})]
										})
									] }), claimedCode ? /* @__PURE__ */ jsxs("div", {
										className: "mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-xs dark:bg-emerald-950/40 space-y-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-semibold text-emerald-800 dark:text-emerald-300",
												children: "Claimed Code:"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-mono font-bold text-emerald-950 dark:text-emerald-100 text-sm",
												children: claimedCode
											})]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setSelectedQrVoucher({
												voucher: v,
												code: claimedCode
											}),
											className: "w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2 px-3 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs",
											children: [/* @__PURE__ */ jsx(QrCode, { className: "h-3.5 w-3.5" }), "View QR Pass / Download"]
										})]
									}) : /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => claim(v),
										disabled: locked,
										className: `mt-4 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-bold transition ${locked ? "cursor-not-allowed bg-muted text-muted-foreground" : v.featured ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-emerald-600 text-white hover:bg-emerald-700"}`,
										children: [locked ? /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), isOutOfStock ? "Out of Stock" : locked ? "Locked" : v.featured ? "Claim Free" : "Redeem"]
									})]
								}, v.id);
							})
						}),
						!hasClaimedFree && canWithdraw && /* @__PURE__ */ jsx("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "Tip: Claim the free 6-month Premium first — other vouchers unlock right after."
						})
					] })
				]
			}),
			selectedQrVoucher && /* @__PURE__ */ jsx(VoucherQrModal, {
				isOpen: true,
				onClose: () => setSelectedQrVoucher(null),
				voucherTitle: selectedQrVoucher.voucher.title,
				code: selectedQrVoucher.code,
				expiresAt: selectedQrVoucher.expiresAt,
				description: selectedQrVoucher.voucher.description,
				tag: selectedQrVoucher.voucher.tag
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
export { WithdrawPointsPage as component };

//# sourceMappingURL=withdraw-points-DuUNMvhA.js.map