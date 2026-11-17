import { i as createServerFn } from "./server-B_aptaj-.js";
import { t as createSsrRpc } from "./createSsrRpc-BFfoDaEO.js";
import { t as requireAdmin } from "./auth-middleware-BiPoMWjc.js";
import { t as attachAuth } from "./auth-attacher-B9vIVJlg.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Coffee, Crown, Film, Gift, Landmark, Pencil, Plus, RotateCcw, ShoppingBag, Smartphone, Sparkles, Ticket, Trash2, UtensilsCrossed, X, Zap } from "lucide-react";
import { toast } from "sonner";
// src/lib/vouchers.ts
var DEFAULT_VOUCHERS = [
	{
		id: "premium6m",
		title: "Premium User — 6 Months Free",
		cost: 0,
		tag: "Featured",
		icon: "Crown",
		color: "amber",
		featured: true,
		freeUnlock: true,
		enabled: true
	},
	{
		id: "recharge299",
		title: "Phone Recharge ₹299",
		cost: 299,
		tag: "Mobile",
		icon: "Smartphone",
		color: "sky",
		enabled: true
	},
	{
		id: "flipkart500",
		title: "Flipkart Wallet ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "indigo",
		enabled: true
	},
	{
		id: "amazon500",
		title: "Amazon Gift Card ₹500",
		cost: 500,
		tag: "Shopping",
		icon: "ShoppingBag",
		color: "orange",
		enabled: true
	},
	{
		id: "swiggy500",
		title: "Swiggy Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "rose",
		enabled: true
	},
	{
		id: "zomato500",
		title: "Zomato Gift Card ₹500",
		cost: 500,
		tag: "Food",
		icon: "UtensilsCrossed",
		color: "red",
		enabled: true
	}
];
var STORAGE_KEY = "nt:vouchers_config:v1";
var getVouchersServer = createServerFn({ method: "GET" }).handler(createSsrRpc("105ca7e7b1d584c04f0813d16b8f7af6a70178c783d3de71ac0946d4856e635f"));
var saveVouchersServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((vouchers) => vouchers).handler(createSsrRpc("1539d254a416960ca6a8b71c55a32c7b8855be361861d42ae6be5767df9beb7a"));
function loadVouchers() {
	if (typeof window === "undefined") return DEFAULT_VOUCHERS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_VOUCHERS;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VOUCHERS;
	} catch {
		return DEFAULT_VOUCHERS;
	}
}
function saveVouchers(vouchers) {
	if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
	saveVouchersServer({ data: vouchers }).catch((err) => {
		console.error("[Vouchers] Save error:", err);
	});
}
// src/components/admin/rewards/VouchersManager.tsx
var ICON_OPTIONS = [
	{
		name: "Gift",
		label: "Gift Box",
		icon: Gift
	},
	{
		name: "Crown",
		label: "Crown / VIP",
		icon: Crown
	},
	{
		name: "Smartphone",
		label: "Phone / Mobile",
		icon: Smartphone
	},
	{
		name: "ShoppingBag",
		label: "Shopping Bag",
		icon: ShoppingBag
	},
	{
		name: "UtensilsCrossed",
		label: "Food / Restaurant",
		icon: UtensilsCrossed
	},
	{
		name: "Sparkles",
		label: "Special / Fashion",
		icon: Sparkles
	},
	{
		name: "Film",
		label: "Movie / Cinema",
		icon: Film
	},
	{
		name: "Landmark",
		label: "Bank / Cash",
		icon: Landmark
	},
	{
		name: "Coffee",
		label: "Cafe / Drinks",
		icon: Coffee
	},
	{
		name: "Zap",
		label: "Recharge / Utility",
		icon: Zap
	},
	{
		name: "Ticket",
		label: "Ticket / Event",
		icon: Ticket
	}
];
var COLOR_OPTIONS = [
	{
		name: "amber",
		label: "Gold / Amber",
		bg: "bg-amber-100",
		text: "text-amber-700",
		border: "border-amber-300"
	},
	{
		name: "sky",
		label: "Sky Blue",
		bg: "bg-sky-100",
		text: "text-sky-700",
		border: "border-sky-300"
	},
	{
		name: "indigo",
		label: "Indigo",
		bg: "bg-indigo-100",
		text: "text-indigo-700",
		border: "border-indigo-300"
	},
	{
		name: "orange",
		label: "Orange",
		bg: "bg-orange-100",
		text: "text-orange-700",
		border: "border-orange-300"
	},
	{
		name: "rose",
		label: "Rose Pink",
		bg: "bg-rose-100",
		text: "text-rose-700",
		border: "border-rose-300"
	},
	{
		name: "red",
		label: "Red",
		bg: "bg-red-100",
		text: "text-red-700",
		border: "border-red-300"
	},
	{
		name: "emerald",
		label: "Green",
		bg: "bg-emerald-100",
		text: "text-emerald-700",
		border: "border-emerald-300"
	},
	{
		name: "purple",
		label: "Purple",
		bg: "bg-purple-100",
		text: "text-purple-700",
		border: "border-purple-300"
	}
];
function getVoucherIconComponent(iconName) {
	const match = ICON_OPTIONS.find((i) => i.name.toLowerCase() === (iconName || "").toLowerCase());
	return match ? match.icon : Gift;
}
function getVoucherColorClasses(colorName) {
	return COLOR_OPTIONS.find((c) => c.name === colorName) || COLOR_OPTIONS[0];
}
function VouchersManager() {
	const [vouchers, setVouchers] = useState(() => loadVouchers());
	const [editingVoucher, setEditingVoucher] = useState(null);
	const [isNew, setIsNew] = useState(false);
	useEffect(() => {
		getVouchersServer().then((data) => {
			if (Array.isArray(data) && data.length > 0) setVouchers(data);
		}).catch(() => {});
	}, []);
	const handleOpenAdd = () => {
		setEditingVoucher({
			id: "voucher_" + Math.random().toString(36).slice(2, 9),
			title: "",
			cost: 500,
			tag: "Shopping",
			icon: "ShoppingBag",
			color: "indigo",
			featured: false,
			freeUnlock: false,
			enabled: true
		});
		setIsNew(true);
	};
	const handleOpenEdit = (v) => {
		setEditingVoucher({ ...v });
		setIsNew(false);
	};
	const handleDelete = (id) => {
		if (confirm("Are you sure you want to delete this voucher?")) {
			const next = vouchers.filter((v) => v.id !== id);
			setVouchers(next);
			saveVouchers(next);
			toast.success("Voucher deleted successfully");
		}
	};
	const handleResetDefaults = () => {
		if (confirm("Reset all vouchers back to system defaults?")) {
			setVouchers(DEFAULT_VOUCHERS);
			saveVouchers(DEFAULT_VOUCHERS);
			toast.success("Vouchers reset to defaults");
		}
	};
	const handleSaveModal = (e) => {
		e.preventDefault();
		if (!editingVoucher) return;
		if (!editingVoucher.title.trim()) return toast.error("Please provide a voucher title");
		const next = isNew ? [...vouchers, editingVoucher] : vouchers.map((v) => v.id === editingVoucher.id ? editingVoucher : v);
		setVouchers(next);
		saveVouchers(next);
		toast.success(isNew ? "Voucher created successfully" : "Voucher updated successfully");
		setEditingVoucher(null);
	};
	const handleToggleEnabled = (id) => {
		const next = vouchers.map((v) => v.id === id ? {
			...v,
			enabled: v.enabled === false
		} : v);
		setVouchers(next);
		saveVouchers(next);
		toast.success("Voucher status updated");
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Gift, { className: "h-5 w-5 text-rose-500" }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-slate-900",
							children: "Available Vouchers & Gift Cards"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700",
							children: [vouchers.length, " Total"]
						})
					]
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-xs text-slate-500",
					children: [
						"Add, edit, or remove reward vouchers that users can claim on the withdrawal page (",
						/* @__PURE__ */ jsx("code", {
							className: "rounded bg-slate-100 px-1 py-0.5 text-[11px] font-mono text-slate-700",
							children: "/withdraw-points"
						}),
						")."
					]
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: handleResetDefaults,
						title: "Reset to default vouchers",
						className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition",
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5 text-slate-500" }), "Reset Defaults"]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: handleOpenAdd,
						className: "inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Add Voucher"]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: vouchers.map((v) => {
					const Icon = getVoucherIconComponent(v.icon);
					const colors = getVoucherColorClasses(v.color);
					const isOff = v.enabled === false;
					return /* @__PURE__ */ jsxs("div", {
						className: `relative flex flex-col justify-between rounded-xl border p-4 transition-all ${isOff ? "border-dashed border-slate-200 bg-slate-50/70 opacity-60" : v.featured ? "border-amber-300 bg-amber-50/40 shadow-xs" : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: `grid h-10 w-10 place-items-center rounded-xl ${colors.bg} ${colors.text} shadow-xs shrink-0`,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 flex-wrap justify-end",
								children: [
									v.featured && /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs",
										children: "Featured"
									}),
									v.freeUnlock && /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs",
										children: "Free Unlock"
									}),
									isOff && /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600",
										children: "Disabled"
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-[10px] font-bold uppercase tracking-wider text-slate-400",
									children: v.tag || "Reward"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-0.5 text-sm font-bold text-slate-900 leading-snug",
									children: v.title
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1.5 text-xs text-slate-500",
									children: [
										"Cost:",
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "font-bold text-slate-900",
											children: v.cost === 0 ? "Free" : `₹${v.cost} (${v.cost} pts)`
										})
									]
								})
							]
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center justify-between border-t border-slate-100 pt-3",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleToggleEnabled(v.id),
								className: `text-[11px] font-semibold transition ${isOff ? "text-emerald-600 hover:underline" : "text-slate-400 hover:text-slate-600"}`,
								children: isOff ? "Enable" : "Disable"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleOpenEdit(v),
									className: "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5 text-slate-500" }), "Edit"]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleDelete(v.id),
									className: "rounded-md border border-slate-200 bg-white p-1 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition",
									title: "Delete Voucher",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
								})]
							})]
						})]
					}, v.id);
				})
			}),
			editingVoucher && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Gift, { className: "h-5 w-5 text-rose-500" }), /* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: isNew ? "Add New Voucher" : "Edit Voucher"
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEditingVoucher(null),
							className: "rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSaveModal,
						className: "p-6 space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
								children: "Voucher Title *"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								value: editingVoucher.title,
								onChange: (e) => setEditingVoucher({
									...editingVoucher,
									title: e.target.value
								}),
								placeholder: "e.g. Amazon Gift Card ₹500, Phone Recharge ₹299",
								className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
										children: "Points Cost *"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										required: true,
										value: editingVoucher.cost,
										onChange: (e) => setEditingVoucher({
											...editingVoucher,
											cost: Math.max(0, Number(e.target.value))
										}),
										placeholder: "e.g. 500 (0 for Free)",
										className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400",
										children: "0 means Free for users"
									})
								] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
									children: "Category Tag"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: editingVoucher.tag,
									onChange: (e) => setEditingVoucher({
										...editingVoucher,
										tag: e.target.value
									}),
									placeholder: "e.g. Shopping, Mobile, Food, Cash",
									className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5",
								children: "Select Icon"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-4 sm:grid-cols-6 gap-2",
								children: ICON_OPTIONS.map((item) => {
									const Ic = item.icon;
									const selected = editingVoucher.icon === item.name;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setEditingVoucher({
											...editingVoucher,
											icon: item.name
										}),
										className: `flex flex-col items-center justify-center p-2 rounded-lg border text-center transition ${selected ? "border-rose-500 bg-rose-50 text-rose-600 shadow-xs" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`,
										children: [/* @__PURE__ */ jsx(Ic, { className: "h-5 w-5 mb-1" }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-medium truncate w-full",
											children: item.label.split(" ")[0]
										})]
									}, item.name);
								})
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5",
								children: "Badge Color"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center gap-2",
								children: COLOR_OPTIONS.map((c) => {
									const selected = editingVoucher.color === c.name;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setEditingVoucher({
											...editingVoucher,
											color: c.name
										}),
										className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${selected ? `${c.border} ${c.bg} ${c.text} ring-2 ring-rose-500 ring-offset-1` : `${c.bg} ${c.text} opacity-70 hover:opacity-100`}`,
										children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-current" }), c.label]
									}, c.name);
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2.5 cursor-pointer",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: editingVoucher.featured || false,
										onChange: (e) => setEditingVoucher({
											...editingVoucher,
											featured: e.target.checked
										}),
										className: "h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-800",
										children: "Mark as Featured Voucher (Gold highlight)"
									})]
								}), /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2.5 cursor-pointer",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: editingVoucher.freeUnlock || false,
										onChange: (e) => setEditingVoucher({
											...editingVoucher,
											freeUnlock: e.target.checked
										}),
										className: "h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-800",
										children: "Free Unlock for First Withdrawal (Unlocks remaining vouchers)"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-end gap-2 pt-4 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setEditingVoucher(null),
									className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition",
									children: isNew ? "Create Voucher" : "Save Changes"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
export { loadVouchers as a, getVouchersServer as i, getVoucherColorClasses as n, getVoucherIconComponent as r, VouchersManager as t };

//# sourceMappingURL=VouchersManager-ANOc9Ogl.js.map