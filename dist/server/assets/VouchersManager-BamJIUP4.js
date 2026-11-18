import { a as loadVouchers, i as getVouchersServer, s as saveVouchers, t as DEFAULT_VOUCHERS } from "./vouchers-BxwKWVvP.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Boxes, Coffee, Copy, Crown, Download, Film, Gift, History, KeyRound, Landmark, Pencil, Plus, RotateCcw, Search, ShoppingBag, Smartphone, Sparkles, Tag, Ticket, Trash2, UtensilsCrossed, Wand2, X, Zap } from "lucide-react";
import { toast } from "sonner";
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
	},
	{
		name: "Tag",
		label: "Discount Coupon",
		icon: Tag
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
function generateUniquePromoCodes(count, prefix) {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const codes = /* @__PURE__ */ new Set();
	let cleanPrefix = (prefix || "PROMO-").trim().toUpperCase();
	if (!cleanPrefix.endsWith("-") && !cleanPrefix.endsWith("_")) cleanPrefix += "-";
	let attempts = 0;
	while (codes.size < count && attempts < count * 30) {
		attempts++;
		let rand = "";
		for (let i = 0; i < 5; i++) rand += chars.charAt(Math.floor(Math.random() * 32));
		codes.add(`${cleanPrefix}${rand}`);
	}
	return Array.from(codes);
}
function VouchersManager() {
	const [vouchers, setVouchers] = useState(() => loadVouchers());
	const [editingVoucher, setEditingVoucher] = useState(null);
	const [isNew, setIsNew] = useState(false);
	const [rawCodesInput, setRawCodesInput] = useState("");
	const [historyVoucher, setHistoryVoucher] = useState(null);
	const [genCount, setGenCount] = useState(50);
	const [genPrefix, setGenPrefix] = useState("STORE50-");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterTag, setFilterTag] = useState("all");
	const allTags = useMemo(() => {
		const set = /* @__PURE__ */ new Set();
		vouchers.forEach((v) => {
			if (v.tag?.trim()) set.add(v.tag.trim());
		});
		return Array.from(set);
	}, [vouchers]);
	const filteredVouchers = useMemo(() => {
		return vouchers.filter((v) => {
			if (filterTag !== "all" && v.tag?.toLowerCase() !== filterTag.toLowerCase()) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchesTitle = v.title.toLowerCase().includes(q);
				const matchesTag = v.tag?.toLowerCase().includes(q);
				const matchesDesc = v.description?.toLowerCase().includes(q);
				const matchesCodes = v.codesPool?.some((c) => c.toLowerCase().includes(q));
				return matchesTitle || matchesTag || matchesDesc || matchesCodes;
			}
			return true;
		});
	}, [
		vouchers,
		searchQuery,
		filterTag
	]);
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
			enabled: true,
			stockType: "codes_pool",
			stock: 50,
			codesPool: [],
			claimedCodes: [],
			description: "",
			expiryDays: 30
		});
		setRawCodesInput("");
		setIsNew(true);
	};
	const handleOpenEdit = (v) => {
		setEditingVoucher({ ...v });
		setRawCodesInput((v.codesPool || []).join("\n"));
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
	const handleGenerateCodes = (append = false) => {
		const newCodes = generateUniquePromoCodes(Math.min(1e3, Math.max(1, Number(genCount) || 50)), genPrefix);
		if (append) {
			const existing = rawCodesInput.split("\n").map((c) => c.trim()).filter(Boolean);
			const combined = Array.from(/* @__PURE__ */ new Set([...existing, ...newCodes]));
			setRawCodesInput(combined.join("\n"));
			toast.success(`Appended ${newCodes.length} codes! Total: ${combined.length} in pool`);
		} else {
			setRawCodesInput(newCodes.join("\n"));
			toast.success(`Generated ${newCodes.length} unique promo codes!`);
		}
	};
	const handleCopyAllCodes = () => {
		const codes = rawCodesInput.trim();
		if (!codes) return toast.error("No codes to copy");
		navigator.clipboard.writeText(codes);
		toast.success("All promo codes copied to clipboard!");
	};
	const handleDownloadCodesTxt = () => {
		const codes = rawCodesInput.trim();
		if (!codes) return toast.error("No codes to download");
		const blob = new Blob([codes], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${editingVoucher?.title || "promo-codes"}-list.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("Promo codes list downloaded as .txt!");
	};
	const handleSaveModal = (e) => {
		e.preventDefault();
		if (!editingVoucher) return;
		if (!editingVoucher.title.trim()) return toast.error("Please provide a voucher title");
		let updatedVoucher = { ...editingVoucher };
		if (editingVoucher.stockType === "codes_pool") {
			const parsedCodes = rawCodesInput.split("\n").map((c) => c.trim()).filter(Boolean);
			updatedVoucher.codesPool = parsedCodes;
			updatedVoucher.stock = parsedCodes.length;
		}
		const next = isNew ? [...vouchers, updatedVoucher] : vouchers.map((v) => v.id === updatedVoucher.id ? updatedVoucher : v);
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
							children: "Available Vouchers, Gift Cards & Promo Inventory"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700",
							children: [vouchers.length, " Total"]
						})
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-slate-500",
					children: "Manage your store coupons, pre-loaded local discount promo codes (50%, 60%, 70%), wallet gift cards, and live withdrawal stock."
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
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Add New Voucher / Promo Pool"]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex-1 min-w-[200px] max-w-sm",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" }),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search cards by name, tag, code...",
							className: "w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none"
						}),
						searchQuery && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSearchQuery(""),
							className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5",
							children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setFilterTag("all"),
						className: `rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${filterTag === "all" ? "bg-slate-900 text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
						children: [
							"All (",
							vouchers.length,
							")"
						]
					}), allTags.map((tag) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setFilterTag(tag),
						className: `rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${filterTag === tag ? "bg-rose-600 text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
						children: tag
					}, tag))]
				})]
			}),
			filteredVouchers.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "py-10 text-center space-y-2",
				children: [
					/* @__PURE__ */ jsx(Search, { className: "h-6 w-6 text-slate-300 mx-auto" }),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs font-bold text-slate-700",
						children: [
							"No voucher cards match \"",
							searchQuery,
							"\""
						]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setSearchQuery("");
							setFilterTag("all");
						},
						className: "text-xs font-semibold text-rose-600 hover:underline",
						children: "Clear Search & Filters"
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "mt-3.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filteredVouchers.map((v) => {
					const Icon = getVoucherIconComponent(v.icon);
					const colors = getVoucherColorClasses(v.color);
					const isOff = v.enabled === false;
					const remainingStock = v.stockType === "codes_pool" ? (v.codesPool || []).length : v.stockType === "limited" ? v.stock ?? 0 : null;
					const claimedCount = (v.claimedCodes || []).length;
					return /* @__PURE__ */ jsxs("div", {
						className: `relative flex flex-col justify-between rounded-xl border p-3 transition-all ${isOff ? "border-dashed border-slate-200 bg-slate-50/70 opacity-60" : v.featured ? "border-amber-300 bg-amber-50/30 shadow-2xs" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-1.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ jsx("span", {
										className: `grid h-7 w-7 place-items-center rounded-lg ${colors.bg} ${colors.text} shadow-2xs shrink-0`,
										children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate",
											children: v.tag || "Reward"
										}), /* @__PURE__ */ jsx("h3", {
											className: "text-xs font-bold text-slate-900 truncate leading-snug",
											title: v.title,
											children: v.title
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 shrink-0",
									children: [
										v.featured && /* @__PURE__ */ jsx("span", {
											className: "rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-bold uppercase text-white shadow-2xs",
											children: "Featured"
										}),
										v.freeUnlock && /* @__PURE__ */ jsx("span", {
											className: "rounded bg-emerald-600 px-1.5 py-0.2 text-[9px] font-bold uppercase text-white shadow-2xs",
											children: "Free"
										}),
										isOff && /* @__PURE__ */ jsx("span", {
											className: "rounded bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold uppercase text-slate-600",
											children: "Off"
										})
									]
								})]
							}),
							v.description && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-slate-500 line-clamp-1 leading-normal",
								title: v.description,
								children: v.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-slate-900 text-[11px]",
									children: v.cost === 0 ? "Free" : `₹${v.cost}`
								}), v.stockType === "unlimited" ? /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600",
									children: [/* @__PURE__ */ jsx(Boxes, { className: "h-2.5 w-2.5" }), " Unlimited"]
								}) : /* @__PURE__ */ jsxs("span", {
									className: `inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${(remainingStock ?? 0) > 5 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : (remainingStock ?? 0) > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"}`,
									children: [/* @__PURE__ */ jsx(Boxes, { className: "h-2.5 w-2.5" }), (remainingStock ?? 0) > 0 ? `${remainingStock} in stock` : "Out of stock"]
								})]
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleToggleEnabled(v.id),
									className: `text-[10px] font-semibold transition ${isOff ? "text-emerald-600 hover:underline" : "text-slate-400 hover:text-slate-600"}`,
									children: isOff ? "Enable" : "Disable"
								}), claimedCount > 0 && /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setHistoryVoucher(v),
									className: "inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800",
									children: [/* @__PURE__ */ jsx(History, { className: "h-3 w-3" }), claimedCount]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleOpenEdit(v),
									className: "inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3 text-slate-400" }), "Edit"]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleDelete(v.id),
									className: "rounded border border-slate-200 bg-white p-1 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition shadow-2xs",
									title: "Delete Voucher",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
								})]
							})]
						})]
					}, v.id);
				})
			}),
			historyVoucher && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(History, { className: "h-5 w-5 text-indigo-500" }), /* @__PURE__ */ jsxs("h3", {
								className: "text-base font-bold text-slate-900",
								children: ["Claimed Redemption Codes: ", historyVoucher.title]
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setHistoryVoucher(null),
							className: "rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-6 max-h-96 overflow-y-auto space-y-2",
						children: (historyVoucher.claimedCodes || []).length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "text-center text-sm text-slate-400 py-6",
							children: "No codes claimed yet."
						}) : historyVoucher.claimedCodes.map((c, i) => {
							const isUsedInStore = c.status === "used_in_store";
							const isExpired = c.expiresAt && /* @__PURE__ */ new Date() > new Date(c.expiresAt);
							return /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs gap-2",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono font-bold text-slate-900 text-sm tracking-wider",
											children: c.code
										}), c.userId && /* @__PURE__ */ jsxs("span", {
											className: "text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.2 rounded",
											children: [
												"User: ",
												c.userId.slice(0, 8),
												"..."
											]
										})]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-[11px] text-slate-500 mt-0.5",
										children: ["Issued: ", new Date(c.claimedAt).toLocaleString()]
									}),
									c.expiresAt && /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-slate-400",
										children: ["Valid until: ", new Date(c.expiresAt).toLocaleDateString()]
									}),
									isUsedInStore && c.usedAt && /* @__PURE__ */ jsxs("p", {
										className: "text-[11px] font-semibold text-blue-700 mt-0.5",
										children: [
											"✅ Used at store: ",
											c.usedByStoreName || "Store",
											" (",
											new Date(c.usedAt).toLocaleString(),
											")"
										]
									})
								] }), /* @__PURE__ */ jsx("div", {
									className: "shrink-0",
									children: isUsedInStore ? /* @__PURE__ */ jsx("span", {
										className: "rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-800",
										children: "Used in Store"
									}) : isExpired ? /* @__PURE__ */ jsx("span", {
										className: "rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600",
										children: "Expired"
									}) : /* @__PURE__ */ jsx("span", {
										className: "rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800",
										children: "Active (Unclaimed in Store)"
									})
								})]
							}, i);
						})
					})]
				})
			}),
			editingVoucher && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 my-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Gift, { className: "h-5 w-5 text-rose-500" }), /* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-slate-900",
								children: isNew ? "Add New Voucher / Promo Pool" : "Edit Voucher & Inventory"
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
								placeholder: "e.g. Agartala Fashion 50% Off, Flipkart Wallet ₹500, Swiggy ₹200",
								className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
								children: "Description / Store Offer Terms"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: editingVoucher.description || "",
								onChange: (e) => setEditingVoucher({
									...editingVoucher,
									description: e.target.value
								}),
								placeholder: "e.g. Valid at Agartala store on purchases above ₹1,000. Show code at counter.",
								className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
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
											children: "0 means Free for readers"
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
										children: "Category Tag"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: editingVoucher.tag,
										onChange: (e) => setEditingVoucher({
											...editingVoucher,
											tag: e.target.value
										}),
										placeholder: "e.g. Local Store, Shopping, Food",
										className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1",
											children: "Expiry Validity (Days)"
										}),
										/* @__PURE__ */ jsx("input", {
											type: "number",
											min: 1,
											value: editingVoucher.expiryDays ?? 30,
											onChange: (e) => setEditingVoucher({
												...editingVoucher,
												expiryDays: Math.max(1, Number(e.target.value) || 30)
											}),
											placeholder: "e.g. 30",
											className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-400",
											children: "e.g. 30 days after claim"
										})
									] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold uppercase tracking-wider text-slate-900",
										children: "Inventory & Stock Delivery Mode"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setEditingVoucher({
													...editingVoucher,
													stockType: "codes_pool"
												}),
												className: `p-2.5 rounded-lg border text-left transition ${editingVoucher.stockType === "codes_pool" ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500" : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"}`,
												children: [/* @__PURE__ */ jsxs("p", {
													className: "font-bold text-xs flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5 text-rose-500" }), " Pre-loaded Codes"]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-[10px] text-slate-500 mt-1",
													children: "Paste 50, 60 unique promo codes"
												})]
											}),
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setEditingVoucher({
													...editingVoucher,
													stockType: "limited"
												}),
												className: `p-2.5 rounded-lg border text-left transition ${editingVoucher.stockType === "limited" ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500" : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"}`,
												children: [/* @__PURE__ */ jsxs("p", {
													className: "font-bold text-xs flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(Boxes, { className: "h-3.5 w-3.5 text-indigo-500" }), " Limited Stock"]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-[10px] text-slate-500 mt-1",
													children: "Set numeric limit (e.g. 50 items)"
												})]
											}),
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setEditingVoucher({
													...editingVoucher,
													stockType: "unlimited"
												}),
												className: `p-2.5 rounded-lg border text-left transition ${editingVoucher.stockType === "unlimited" ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500" : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"}`,
												children: [/* @__PURE__ */ jsxs("p", {
													className: "font-bold text-xs flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(Crown, { className: "h-3.5 w-3.5 text-amber-500" }), " Unlimited"]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-[10px] text-slate-500 mt-1",
													children: "Always available to readers"
												})]
											})
										]
									}),
									editingVoucher.stockType === "codes_pool" && /* @__PURE__ */ jsxs("div", {
										className: "mt-3 space-y-3 pt-3 border-t border-slate-200",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 space-y-2.5",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "flex items-center gap-1.5 text-xs font-bold text-rose-950",
														children: [/* @__PURE__ */ jsx(Wand2, { className: "h-4 w-4 text-rose-600" }), "Auto-Generate Unique Promo Codes"]
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[10px] text-rose-700 font-semibold bg-white/90 border border-rose-200 px-2 py-0.5 rounded-full shadow-2xs",
														children: "Bulk Code Generator"
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "grid grid-cols-1 sm:grid-cols-12 gap-2 items-end",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "sm:col-span-4",
															children: [/* @__PURE__ */ jsx("label", {
																className: "block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1",
																children: "How Many Codes?"
															}), /* @__PURE__ */ jsxs("div", {
																className: "flex items-center gap-1",
																children: [
																	/* @__PURE__ */ jsx("input", {
																		type: "number",
																		min: 1,
																		max: 1e3,
																		value: genCount,
																		onChange: (e) => setGenCount(Math.max(1, Number(e.target.value) || 1)),
																		placeholder: "50",
																		className: "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-rose-500 focus:outline-none"
																	}),
																	/* @__PURE__ */ jsx("button", {
																		type: "button",
																		onClick: () => setGenCount(50),
																		className: "rounded bg-white px-1.5 py-1.5 text-[10px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-100",
																		title: "Set 50",
																		children: "50"
																	}),
																	/* @__PURE__ */ jsx("button", {
																		type: "button",
																		onClick: () => setGenCount(100),
																		className: "rounded bg-white px-1.5 py-1.5 text-[10px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-100",
																		title: "Set 100",
																		children: "100"
																	})
																]
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "sm:col-span-4",
															children: [/* @__PURE__ */ jsx("label", {
																className: "block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1",
																children: "Code Prefix"
															}), /* @__PURE__ */ jsx("input", {
																type: "text",
																value: genPrefix,
																onChange: (e) => setGenPrefix(e.target.value.toUpperCase()),
																placeholder: "STORE50-",
																className: "w-full font-mono uppercase rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-rose-500 focus:outline-none"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "sm:col-span-4 flex items-center gap-1.5",
															children: [/* @__PURE__ */ jsxs("button", {
																type: "button",
																onClick: () => handleGenerateCodes(false),
																className: "flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-[0.99] transition",
																title: "Generate unique codes (Replaces current list)",
																children: [
																	/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }),
																	"Generate ",
																	genCount
																]
															}), /* @__PURE__ */ jsx("button", {
																type: "button",
																onClick: () => handleGenerateCodes(true),
																className: "inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition",
																title: "Append to existing list",
																children: "+Add"
															})]
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between flex-wrap gap-2 pt-1",
												children: [/* @__PURE__ */ jsxs("label", {
													className: "text-xs font-bold text-slate-700 flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx("span", { children: "Active Promo Codes Pool:" }), /* @__PURE__ */ jsxs("span", {
														className: "rounded bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700",
														children: [rawCodesInput.split("\n").filter((c) => c.trim()).length, " Codes in Pool"]
													})]
												}), /* @__PURE__ */ jsx("div", {
													className: "flex items-center gap-1",
													children: rawCodesInput.trim() && /* @__PURE__ */ jsxs(Fragment, { children: [
														/* @__PURE__ */ jsxs("button", {
															type: "button",
															onClick: handleCopyAllCodes,
															className: "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs",
															title: "Copy all codes to clipboard",
															children: [/* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 text-slate-500" }), " Copy All"]
														}),
														/* @__PURE__ */ jsxs("button", {
															type: "button",
															onClick: handleDownloadCodesTxt,
															className: "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs",
															title: "Download .txt list to share with store owner",
															children: [/* @__PURE__ */ jsx(Download, { className: "h-3 w-3 text-slate-500" }), " Download List (.txt)"]
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => {
																if (confirm("Clear all promo codes in this box?")) setRawCodesInput("");
															},
															className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition shadow-2xs",
															title: "Clear all",
															children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
														})
													] })
												})]
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 6,
												value: rawCodesInput,
												onChange: (e) => setRawCodesInput(e.target.value),
												placeholder: `AGARTALA50-A101\nAGARTALA50-B202\nAGARTALA50-C303\n...`,
												className: "w-full font-mono text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:border-rose-500 focus:outline-none"
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-[11px] text-slate-500",
												children: [
													"💡 Each reader who claims this voucher will instantly receive one unused code from this pool. Once all codes are claimed, it automatically shows \"Out of Stock\" on the withdrawal page. You can click ",
													/* @__PURE__ */ jsx("strong", { children: "Download List (.txt)" }),
													" to send the authorized codes to your partner store owner!"
												]
											})
										]
									}),
									editingVoucher.stockType === "limited" && /* @__PURE__ */ jsxs("div", {
										className: "mt-3 pt-2 border-t border-slate-200",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "Available Stock Quantity:"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 0,
											value: editingVoucher.stock ?? 50,
											onChange: (e) => setEditingVoucher({
												...editingVoucher,
												stock: Math.max(0, Number(e.target.value))
											}),
											className: "w-48 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium bg-white"
										})]
									})
								]
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
export { getVoucherColorClasses as n, getVoucherIconComponent as r, VouchersManager as t };

//# sourceMappingURL=VouchersManager-BamJIUP4.js.map