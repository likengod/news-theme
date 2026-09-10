import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { n as deleteJournalist, o as upsertJournalist, r as listJournalists } from "./journalist.functions-CTNmwiF6.js";
import { n as MediaField } from "./MediaField-CAywNcmk.js";
import { t as Field } from "./Field-DPKVWHIh.js";
import { o as roleBadgeClass, u as slugify } from "./roles-DF1BURd3.js";
import { n as getJournalistStats } from "./articles-store-CLlyCzQu.js";
import { a as saveRanks, i as rankForCount, n as loadRanks } from "./journalist-ranks-DmpN8CMn.js";
import { n as loadAuthorized, r as saveAuthorized, t as DEFAULT_AUTHORIZED } from "./authorized-settings-C6PPe013.js";
import { d as toggleAdminUserBan } from "./admin-users.functions-CGopcPOH.js";
import { Suspense, lazy, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Award, Building2, ChevronLeft, ChevronRight, Coins, Copy, Eye, Loader2, Newspaper, Pencil, Plus, Save, Search, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
//#region src/components/admin/journalists/AuthorizedPanel.tsx
function AuthorizedPanel({ value, onChange, onSave, onReset, saving }) {
	const set = (k, v) => onChange({
		...value,
		[k]: v
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-200 px-5 py-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
				className: "flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500",
				children: [/* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), " Authorized signature & back card config"]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-xs text-slate-500",
				children: "Edit office contact, disclaimer notes, and upload transparent PNG/WEBP authorized signature for press cards."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: onReset,
					className: "rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50",
					children: "Reset defaults"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: onSave,
					disabled: saving,
					className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60",
					children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), "Save settings"]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 p-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-4 rounded-lg border border-slate-200 p-4 bg-slate-50/50",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "border-b border-slate-200 pb-2",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Authorized Signature Config"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-[11px] text-slate-500",
							children: "Upload signature image or customize cursive text shown on the back of journalist press cards."
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Signature Cursive Name / Text",
						value: value.signatureName,
						onChange: (v) => set("signatureName", v),
						placeholder: "Editor-in-Chief"
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Signature Bottom Label",
						value: value.signatureLabel,
						onChange: (v) => set("signatureLabel", v),
						placeholder: "AUTHORIZED SIGNATURE"
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium text-slate-700",
						children: "Upload Official Signature Image (PNG or WEBP)"
					}), /* @__PURE__ */ jsx(MediaField, {
						value: value.signatureImageUrl,
						onChange: (v) => set("signatureImageUrl", v),
						usage: "other",
						hint: "Upload a transparent PNG or WEBP file of the signature for best quality.",
						recommendedSize: "Recommended size: 240×80 px (transparent PNG or WEBP)",
						compact: true
					})] }),
					value.signatureImageUrl ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-dashed border-slate-300 bg-white p-3 text-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400",
								children: "Signature Image Preview"
							}),
							/* @__PURE__ */ jsx("img", {
								src: value.signatureImageUrl,
								alt: "Signature Preview",
								className: "mx-auto h-12 max-w-[200px] object-contain"
							}),
							/* @__PURE__ */ jsx("div", { className: "mt-2 mx-auto w-32 border-b border-slate-400" }),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[10px] font-black uppercase italic tracking-widest text-slate-800",
								children: value.signatureLabel || "AUTHORIZED SIGNATURE"
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-dashed border-slate-200 bg-white p-3 text-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400",
								children: "Default Cursive Text Preview"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-700",
								style: {
									fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
									fontSize: 22
								},
								children: value.signatureName || "Editor-in-Chief"
							}),
							/* @__PURE__ */ jsx("div", { className: "mt-1 mx-auto w-32 border-b border-slate-400" }),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[10px] font-black uppercase italic tracking-widest text-slate-800",
								children: value.signatureLabel || "AUTHORIZED SIGNATURE"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4 rounded-lg border border-slate-200 p-4 bg-slate-50/50",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "border-b border-slate-200 pb-2",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Office Details & Back Card Text"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-[11px] text-slate-500",
							children: "Custom contact details, note, and legal disclaimer printed on the back card."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Office Phone",
							value: value.officePhone,
							onChange: (v) => set("officePhone", v),
							placeholder: "9089050144"
						}), /* @__PURE__ */ jsx(Field, {
							label: "Office Email",
							type: "email",
							value: value.officeEmail,
							onChange: (v) => set("officeEmail", v),
							placeholder: "contact@northeasttimeline.com"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Office Website",
							value: value.officeWebsite,
							onChange: (v) => set("officeWebsite", v),
							placeholder: "northeasttimeline.com"
						}), /* @__PURE__ */ jsx(Field, {
							label: "Office PIN / ZIP Code",
							value: value.officePin,
							onChange: (v) => set("officePin", v),
							placeholder: "799277"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Office State",
							value: value.officeState,
							onChange: (v) => set("officeState", v),
							placeholder: "Tripura"
						}), /* @__PURE__ */ jsx(Field, {
							label: "Office Country",
							value: value.officeCountry,
							onChange: (v) => set("officeCountry", v),
							placeholder: "India"
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium text-slate-700",
						children: "Office Address"
					}), /* @__PURE__ */ jsx("textarea", {
						value: value.officeAddress,
						onChange: (e) => set("officeAddress", e.target.value),
						rows: 2,
						placeholder: "College Road, Kailasahar",
						className: "w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium text-slate-700",
						children: "Back Card Note"
					}), /* @__PURE__ */ jsx("textarea", {
						value: value.cardNote,
						onChange: (e) => set("cardNote", e.target.value),
						rows: 2,
						placeholder: "This card certifies that the bearer is an authorized journalist...",
						className: "w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium text-slate-700",
						children: "Back Card Legal Disclaimer"
					}), /* @__PURE__ */ jsx("textarea", {
						value: value.cardDisclaimer,
						onChange: (e) => set("cardDisclaimer", e.target.value),
						rows: 2,
						placeholder: "Tampering or misuse of this card is a punishable offense.",
						className: "w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
					})] })
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/admin.journalists.tsx?tsr-split=component
var emptyForm = () => ({
	email: "",
	password: "",
	displayName: "",
	phone: "",
	bloodGroup: "",
	dob: "",
	validTill: "",
	address: "",
	state: "",
	country: "",
	pinCode: "",
	avatarUrl: "",
	active: true
});
var JournalistFormModal = lazy(() => import("./JournalistFormModal-BJQaeslE.js").then((m) => ({ default: m.JournalistFormModal })));
var JournalistProfileModal = lazy(() => import("./JournalistProfileModal-C6sd40dk.js").then((m) => ({ default: m.JournalistProfileModal })));
var RankEditModal = lazy(() => import("./RankEditModal-BZ-JvAGe.js").then((m) => ({ default: m.RankEditModal })));
function emptyRank() {
	return {
		id: "",
		name: "",
		minNews: 0,
		pointsPerNews: 0,
		color: "slate"
	};
}
var PAGE_SIZE = 20;
function JournalistsPage() {
	const qc = useQueryClient();
	const [tab, setTab] = useState("journalists");
	const [ranks, setRanks] = useState(() => loadRanks());
	const [authorized, setAuthorized] = useState(() => loadAuthorized());
	const [authSaving, setAuthSaving] = useState(false);
	useMemo(() => getJournalistStats(), []);
	const list = useServerFn(listJournalists);
	const upsert = useServerFn(upsertJournalist);
	const remove = useServerFn(deleteJournalist);
	const toggleBan = useServerFn(toggleAdminUserBan);
	const query = useQuery({
		queryKey: ["admin-journalists"],
		queryFn: () => list()
	});
	const journalists = query.data ?? [];
	const handleToggleBan = async (j) => {
		const willSuspend = j.active;
		try {
			await toggleBan({ data: {
				userId: j.userId,
				suspend: willSuspend
			} });
			toast.success(willSuspend ? `Journalist account suspended` : `Journalist account activated`);
			if (viewTarget?.userId === j.userId) setViewTarget({
				...viewTarget,
				active: !willSuspend
			});
			qc.invalidateQueries({ queryKey: ["admin-journalists"] });
		} catch (e) {
			toast.error(e.message || "Failed to update status");
		}
	};
	const [q, setQ] = useState("");
	const [sort, setSort] = useState("points_desc");
	const [rankFilter, setRankFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [viewTarget, setViewTarget] = useState(null);
	const publishedCount = (j) => j.articlesPublished ?? 0;
	const enriched = useMemo(() => journalists.map((j) => {
		const published = publishedCount(j);
		const rank = rankForCount(published, ranks);
		return {
			j,
			published,
			rankId: rank?.id ?? "unranked",
			rankName: rank?.name ?? "Unranked"
		};
	}), [journalists, ranks]);
	const filtered = useMemo(() => {
		const term = q.trim().toLowerCase();
		let rows = enriched.filter(({ j, rankId }) => {
			if (term && !`${j.displayName ?? ""}${j.journalistId ?? ""}${j.publicUserId}${j.email ?? ""}`.toLowerCase().includes(term)) return false;
			if (rankFilter !== "all" && rankId !== rankFilter) return false;
			if (statusFilter === "active" && !j.active) return false;
			if (statusFilter === "inactive" && j.active) return false;
			return true;
		});
		rows.sort((a, b) => {
			switch (sort) {
				case "name": return (a.j.displayName ?? "").localeCompare(b.j.displayName ?? "");
				case "points_desc": return b.j.points - a.j.points;
				case "points_asc": return a.j.points - b.j.points;
				case "articles_desc": return b.published - a.published;
				case "articles_asc": return a.published - b.published;
				case "rank": {
					const ra = ranks.find((r) => r.id === a.rankId)?.minNews ?? -1;
					return (ranks.find((r) => r.id === b.rankId)?.minNews ?? -1) - ra;
				}
			}
		});
		return rows;
	}, [
		enriched,
		q,
		sort,
		rankFilter,
		statusFilter,
		ranks
	]);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const [editing, setEditing] = useState(null);
	const [isNew, setIsNew] = useState(false);
	const [form, setForm] = useState(null);
	const [saving, setSaving] = useState(false);
	const persist = (next) => {
		const sorted = [...next].sort((a, b) => a.minNews - b.minNews);
		setRanks(sorted);
		saveRanks(sorted);
	};
	const onSave = () => {
		if (!editing) return;
		const name = editing.name.trim();
		if (!name) return toast.error("Rank name is required");
		const id = isNew ? slugify(name) : editing.id;
		if (isNew && ranks.some((r) => r.id === id)) return toast.error("Rank already exists");
		persist(isNew ? [...ranks, {
			...editing,
			id
		}] : ranks.map((r) => r.id === id ? {
			...editing,
			id
		} : r));
		toast.success(isNew ? "Rank created" : "Rank updated");
		setEditing(null);
	};
	const onDelete = (r) => {
		if (r.builtin) return toast.error("Built-in ranks cannot be deleted");
		if (!confirm(`Delete rank "${r.name}"?`)) return;
		persist(ranks.filter((x) => x.id !== r.id));
		toast.success("Rank deleted");
	};
	const copy = async (v) => {
		try {
			await navigator.clipboard.writeText(v);
			toast.success(`Copied ${v}`);
		} catch {
			toast.error("Copy failed");
		}
	};
	const openNew = () => setForm(emptyForm());
	const openEdit = (j) => setForm({
		userId: j.userId,
		email: j.email ?? "",
		password: "",
		displayName: j.displayName ?? "",
		phone: j.phone ?? "",
		bloodGroup: j.bloodGroup ?? "",
		dob: j.dob ?? "",
		validTill: j.validTill ?? "",
		address: j.address ?? "",
		state: j.state ?? "",
		country: j.country ?? "",
		pinCode: j.pinCode ?? "",
		avatarUrl: j.avatarUrl ?? "",
		articlesPublished: j.articlesPublished ?? 0,
		points: j.points ?? 0,
		active: j.active
	});
	const submitForm = async () => {
		if (!form) return;
		setSaving(true);
		try {
			await upsert({ data: {
				userId: form.userId,
				email: form.email,
				password: form.password || void 0,
				displayName: form.displayName,
				phone: form.phone,
				bloodGroup: form.bloodGroup,
				address: form.address,
				state: form.state,
				country: form.country,
				pinCode: form.pinCode,
				avatarUrl: form.avatarUrl,
				articlesPublished: form.articlesPublished,
				points: form.points,
				active: form.active
			} });
			toast.success(form.userId ? "Journalist updated" : "Journalist created");
			setForm(null);
			qc.invalidateQueries({ queryKey: ["admin-journalists"] });
		} catch (e) {
			toast.error(e?.message ?? "Save failed");
		} finally {
			setSaving(false);
		}
	};
	const removeOne = async (j) => {
		if (!confirm(`Permanently delete "${j.displayName ?? j.publicUserId}"? This removes the account everywhere.`)) return;
		try {
			await remove({ data: { userId: j.userId } });
			toast.success("Journalist deleted");
			qc.invalidateQueries({ queryKey: ["admin-journalists"] });
		} catch (e) {
			toast.error(e?.message ?? "Delete failed");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "flex items-center gap-2 text-2xl font-bold tracking-tight",
				children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-6 w-6 text-slate-700" }), " Journalist"]
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-sm text-slate-500",
				children: [
					"Only users with the ",
					/* @__PURE__ */ jsx("strong", { children: "Journalist" }),
					" role appear here. Each has a unique 8-character Journalist ID (3 letters + 4 digits + 1 letter, e.g. ",
					/* @__PURE__ */ jsx("code", {
						className: "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px]",
						children: "ABC1234Z"
					}),
					")."
				]
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm",
				children: [
					{
						id: "journalists",
						label: "Journalists",
						icon: Newspaper
					},
					{
						id: "ranks",
						label: "Rank tiers & points",
						icon: Award
					},
					{
						id: "authorized",
						label: "Authorized",
						icon: ShieldCheck
					}
				].map((t) => {
					const Icon = t.icon;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => setTab(t.id),
						className: `inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${tab === t.id ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-100"}`,
						children: [
							/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
							" ",
							t.label
						]
					}, t.id);
				})
			}),
			tab === "journalists" && /* @__PURE__ */ jsxs("section", {
				className: "overflow-hidden rounded-lg border border-slate-200 bg-white",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-sm font-semibold uppercase tracking-wider text-slate-500",
							children: [
								"Journalists (",
								filtered.length,
								")"
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative min-w-[220px]",
									children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
										value: q,
										onChange: (e) => {
											setQ(e.target.value);
											setPage(1);
										},
										placeholder: "Search name, ID, emailâ€¦",
										className: "w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
									})]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: rankFilter,
									onChange: (e) => {
										setRankFilter(e.target.value);
										setPage(1);
									},
									className: "rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm",
									title: "Filter by rank",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All ranks"
										}),
										ranks.map((r) => /* @__PURE__ */ jsx("option", {
											value: r.id,
											children: r.name
										}, r.id)),
										/* @__PURE__ */ jsx("option", {
											value: "unranked",
											children: "Unranked"
										})
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: statusFilter,
									onChange: (e) => {
										setStatusFilter(e.target.value);
										setPage(1);
									},
									className: "rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All status"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "active",
											children: "Active"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "inactive",
											children: "Inactive"
										})
									]
								}),
								/* @__PURE__ */ jsxs("select", {
									value: sort,
									onChange: (e) => setSort(e.target.value),
									className: "rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm",
									title: "Sort",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "points_desc",
											children: "Highest points"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "points_asc",
											children: "Lowest points"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "articles_desc",
											children: "Most articles"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "articles_asc",
											children: "Fewest articles"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "rank",
											children: "Top rank"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "name",
											children: "Name (A-Z)"
										})
									]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: openNew,
									className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New journalist"]
								})
							]
						})]
					}),
					query.isLoading ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Loading journalistsâ€¦"]
					}) : query.isError ? /* @__PURE__ */ jsx("div", {
						className: "px-5 py-16 text-center text-sm text-red-600",
						children: query.error?.message ?? "Failed to load"
					}) : /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[960px] text-sm",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: "Journalist"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: "Journalist ID"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-3 w-3" }), " Published"]
										})
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }), " Rank"]
										})
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Coins, { className: "h-3 w-3" }), " Wallet"]
										})
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-5 py-3 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ jsxs("tbody", {
								className: "divide-y divide-slate-100",
								children: [pageRows.map(({ j, published, rankId }) => {
									const rank = ranks.find((r) => r.id === rankId) ?? null;
									const name = j.displayName ?? `User ${j.publicUserId}`;
									return /* @__PURE__ */ jsxs("tr", {
										className: `hover:bg-slate-50/60 ${j.active ? "" : "opacity-70"}`,
										children: [
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3",
													children: [j.avatarUrl ? /* @__PURE__ */ jsx("img", {
														src: j.avatarUrl,
														alt: "",
														className: "h-9 w-9 rounded-full object-cover"
													}) : /* @__PURE__ */ jsx("div", {
														className: "grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white",
														children: name.slice(0, 2).toUpperCase()
													}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
														className: "font-medium",
														children: name
													}), /* @__PURE__ */ jsx("p", {
														className: "text-xs text-slate-500",
														children: j.email ?? `Public ID ${j.publicUserId}`
													})] })]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3",
												children: j.journalistId ? /* @__PURE__ */ jsxs("div", {
													className: "inline-flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx("code", {
														className: "rounded bg-slate-100 px-2 py-0.5 font-mono text-xs tracking-wider text-slate-800",
														children: j.journalistId
													}), /* @__PURE__ */ jsx("button", {
														onClick: () => copy(j.journalistId),
														className: "grid h-6 w-6 place-items-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100",
														title: "Copy Journalist ID",
														children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
													})]
												}) : /* @__PURE__ */ jsx("span", {
													className: "text-xs text-slate-400",
													children: "â€”"
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3 text-slate-700",
												children: published.toLocaleString()
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3",
												children: rank ? /* @__PURE__ */ jsxs("span", {
													className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(rank.color)}`,
													children: [
														/* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
														" ",
														rank.name
													]
												}) : /* @__PURE__ */ jsx("span", {
													className: "text-xs text-slate-400",
													children: "Unranked"
												})
											}),
											/* @__PURE__ */ jsxs("td", {
												className: "px-5 py-3 font-semibold text-slate-800",
												children: [j.points.toLocaleString(), " pts"]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3",
												children: /* @__PURE__ */ jsxs("select", {
													value: j.active ? "active" : "suspended",
													onChange: (e) => {
														const targetState = e.target.value;
														if (targetState === "active" && !j.active || targetState === "suspended" && j.active) handleToggleBan(j);
													},
													className: `rounded-full border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${j.active ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"}`,
													children: [/* @__PURE__ */ jsx("option", {
														value: "active",
														className: "bg-white text-emerald-700 font-semibold",
														children: "â— Active"
													}), /* @__PURE__ */ jsx("option", {
														value: "suspended",
														className: "bg-white text-red-700 font-semibold",
														children: "â— Suspended"
													})]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-5 py-3 text-right",
												children: /* @__PURE__ */ jsxs("div", {
													className: "inline-flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ jsx("button", {
															onClick: () => setViewTarget(j),
															className: "rounded-md border border-slate-200 p-1.5 text-xs text-slate-600 hover:bg-slate-100",
															title: "View Profile",
															children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
														}),
														/* @__PURE__ */ jsx("button", {
															onClick: () => openEdit(j),
															className: "rounded-md border border-slate-200 p-1.5 text-xs text-slate-700 hover:bg-slate-100",
															title: "Edit Journalist",
															children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
														}),
														/* @__PURE__ */ jsx("button", {
															onClick: () => removeOne(j),
															className: "rounded-md border border-slate-200 p-1.5 text-xs text-red-600 hover:bg-red-50",
															title: "Delete Journalist",
															children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
														})
													]
												})
											})
										]
									}, j.userId);
								}), pageRows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 7,
									className: "px-5 py-8 text-center text-slate-500",
									children: journalists.length === 0 ? "No journalists yet. Assign the Journalist role to a user under Admin â†’ Users." : "No results match your search."
								}) })]
							})]
						})
					}),
					filtered.length > PAGE_SIZE && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-slate-500",
							children: [
								"Showing ",
								/* @__PURE__ */ jsx("strong", { children: (currentPage - 1) * PAGE_SIZE + 1 }),
								"â€“",
								/* @__PURE__ */ jsx("strong", { children: Math.min(currentPage * PAGE_SIZE, filtered.length) }),
								" of ",
								filtered.length
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setPage(Math.max(1, currentPage - 1)),
									disabled: currentPage === 1,
									className: "grid h-8 w-8 place-items-center rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50",
									children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
								}),
								Array.from({ length: pageCount }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5).map((n) => /* @__PURE__ */ jsx("button", {
									onClick: () => setPage(n),
									className: `h-8 min-w-8 rounded-md border px-2 text-xs ${n === currentPage ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"}`,
									children: n
								}, n)),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setPage(Math.min(pageCount, currentPage + 1)),
									disabled: currentPage === pageCount,
									className: "grid h-8 w-8 place-items-center rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50",
									children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
								})
							]
						})]
					})
				]
			}),
			tab === "ranks" && /* @__PURE__ */ jsxs("section", {
				className: "overflow-hidden rounded-lg border border-slate-200 bg-white",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 px-5 py-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-sm font-semibold uppercase tracking-wider text-slate-500",
						children: "Rank tiers & points"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-xs text-slate-500",
						children: "A journalist upgrades when their published count reaches the threshold. Points are earned per published article at their current rank."
					})] }), /* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setEditing(emptyRank());
							setIsNew(true);
						},
						className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " New rank"]
					})]
				}), /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Rank"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Published news required"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Points per news"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Type"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-slate-100",
						children: ranks.map((r) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-slate-50/60",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ jsxs("span", {
										className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(r.color)}`,
										children: [
											/* @__PURE__ */ jsx(Award, { className: "h-3 w-3" }),
											" ",
											r.name
										]
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-5 py-3 text-slate-700",
									children: [r.minNews.toLocaleString(), "+"]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-5 py-3 text-slate-700",
									children: [r.pointsPerNews, " pts"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400",
									children: r.builtin ? "Built-in" : "Custom"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "inline-flex gap-2",
										children: [/* @__PURE__ */ jsxs("button", {
											onClick: () => {
												setEditing({ ...r });
												setIsNew(false);
											},
											className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50",
											children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
										}), /* @__PURE__ */ jsxs("button", {
											onClick: () => onDelete(r),
											disabled: r.builtin,
											className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white",
											children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Delete"]
										})]
									})
								})
							]
						}, r.id))
					})]
				})]
			}),
			tab === "authorized" && /* @__PURE__ */ jsx(AuthorizedPanel, {
				value: authorized,
				onChange: setAuthorized,
				saving: authSaving,
				onSave: () => {
					setAuthSaving(true);
					try {
						saveAuthorized(authorized);
						toast.success("Authorized settings saved");
					} finally {
						setAuthSaving(false);
					}
				},
				onReset: () => {
					setAuthorized(DEFAULT_AUTHORIZED);
					saveAuthorized(DEFAULT_AUTHORIZED);
					toast.success("Authorized settings reset");
				}
			}),
			editing && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(RankEditModal, {
					editing,
					isNew,
					setEditing,
					onSave
				})
			}),
			form && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(JournalistFormModal, {
					form,
					setForm,
					saving,
					submitForm
				})
			}),
			viewTarget && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(JournalistProfileModal, {
					viewTarget,
					setViewTarget,
					handleToggleBan
				})
			})
		]
	});
}
//#endregion
export { JournalistsPage as component };
