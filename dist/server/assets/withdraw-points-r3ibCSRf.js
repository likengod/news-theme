import { t as authClient } from "./auth-client-D_N-v-0R.js";
import { t as Footer } from "./Footer-B_OBwFBg.js";
import { t as Header } from "./Header-BulrGdZI.js";
import { c as submitWithdrawRequest } from "./inbox.functions-D0I3rzyA.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, Crown, Gift, Lock, ShoppingBag, Smartphone, UtensilsCrossed, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/withdraw-points.tsx?tsr-split=component
var MIN_WITHDRAW = 256;
var VOUCHERS = [
	{
		id: "premium6m",
		title: "Premium User — 6 Months Free",
		cost: 0,
		tag: "Featured",
		icon: Crown,
		color: "amber",
		featured: true,
		freeUnlock: true
	},
	{
		id: "recharge299",
		title: "Phone Recharge ₹299",
		cost: 299,
		tag: "Mobile",
		icon: Smartphone,
		color: "sky"
	},
	{
		id: "flipkart500",
		title: "Flipkart Wallet ₹500",
		cost: 500,
		tag: "Shopping",
		icon: ShoppingBag,
		color: "indigo"
	},
	{
		id: "amazon500",
		title: "Amazon Gift Card ₹500",
		cost: 500,
		tag: "Shopping",
		icon: ShoppingBag,
		color: "orange"
	},
	{
		id: "swiggy500",
		title: "Swiggy Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: UtensilsCrossed,
		color: "rose"
	},
	{
		id: "zomato500",
		title: "Zomato Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: UtensilsCrossed,
		color: "red"
	}
];
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
	const [state, setState] = useState({
		balance: 0,
		claimed: {}
	});
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			const u = data.session?.user;
			if (!u) return;
			setUserId(u.id);
			const s = load(u.id);
			s.balance = Number(localStorage.getItem(`nt:points:${u.id}`) ?? "0");
			save(u.id, s);
			setState({ ...s });
		});
	}, []);
	const canWithdraw = state.balance >= MIN_WITHDRAW;
	const hasClaimedFree = Object.keys(state.claimed).some((id) => VOUCHERS.find((v) => v.id === id)?.freeUnlock);
	const claim = async (v) => {
		if (!userId) return toast.error("Please sign in first");
		if (!canWithdraw) return toast.error(`You need at least ${MIN_WITHDRAW} points to withdraw`);
		if (state.claimed[v.id]) return toast.info("Already claimed");
		if (!v.freeUnlock && !hasClaimedFree) return toast.error("Claim your free 6-month Premium first to unlock other vouchers");
		if (state.balance < v.cost) return toast.error("Not enough points");
		try {
			await submitWithdrawRequest({ data: {
				voucherId: v.id,
				voucherTitle: v.title,
				amount: v.cost,
				paymentMethod: "voucher"
			} });
			const code = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
			const next = {
				balance: state.balance - v.cost,
				claimed: {
					...state.claimed,
					[v.id]: code
				}
			};
			save(userId, next);
			setState(next);
			toast.success(`Withdrawal request submitted! Code: ${code}`);
		} catch (err) {
			const code = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
			const next = {
				balance: state.balance - v.cost,
				claimed: {
					...state.claimed,
					[v.id]: code
				}
			};
			save(userId, next);
			setState(next);
			toast.success(`Voucher claimed! Code: ${code}`);
		}
	};
	const progress = Math.min(100, state.balance / MIN_WITHDRAW * 100);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-10",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "mb-6 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
							children: "Wallet"
						}), /* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-4xl font-bold",
							children: "Withdraw Points"
						})] }), /* @__PURE__ */ jsx(Link, {
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
						/* @__PURE__ */ jsxs("h2", {
							className: "mb-4 flex items-center gap-2 text-xl font-bold",
							children: [/* @__PURE__ */ jsx(Gift, { className: "h-5 w-5 text-rose-500" }), " Available Vouchers"]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: VOUCHERS.map((v) => {
								const Icon = v.icon;
								const claimedCode = state.claimed[v.id];
								const locked = !canWithdraw || !v.freeUnlock && !hasClaimedFree;
								return /* @__PURE__ */ jsxs("div", {
									className: `relative overflow-hidden rounded-xl border p-5 transition ${v.featured ? "border-amber-300 bg-amber-50/60 dark:bg-amber-950/20" : "border-border bg-card"}`,
									children: [
										v.featured && /* @__PURE__ */ jsx("span", {
											className: "absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white",
											children: "Free"
										}),
										/* @__PURE__ */ jsx("span", {
											className: `mb-3 grid h-10 w-10 place-items-center rounded-full bg-${v.color}-100 text-${v.color}-700`,
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
										/* @__PURE__ */ jsxs("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: ["Cost: ", /* @__PURE__ */ jsx("span", {
												className: "font-semibold text-foreground",
												children: v.cost === 0 ? "Free" : `₹${v.cost}`
											})]
										}),
										claimedCode ? /* @__PURE__ */ jsxs("div", {
											className: "mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-2 text-xs dark:bg-emerald-950/40",
											children: [/* @__PURE__ */ jsx("p", {
												className: "font-semibold text-emerald-700 dark:text-emerald-300",
												children: "Claimed"
											}), /* @__PURE__ */ jsx("p", {
												className: "font-mono text-[11px] text-emerald-900 dark:text-emerald-200",
												children: claimedCode
											})]
										}) : /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => claim(v),
											disabled: locked,
											className: `mt-3 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-bold transition ${locked ? "cursor-not-allowed bg-muted text-muted-foreground" : v.featured ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-emerald-600 text-white hover:bg-emerald-700"}`,
											children: [locked ? /* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), locked ? "Locked" : v.featured ? "Claim Free" : "Redeem"]
										})
									]
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
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { WithdrawPointsPage as component };
