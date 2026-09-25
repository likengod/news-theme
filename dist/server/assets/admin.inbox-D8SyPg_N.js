import { a as isEnterprisePlusLicense } from "./site-settings-TC6eL9IL.js";
import { a as useSiteSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { a as adminGetInboxSummary, i as adminGetInboxRequests, n as adminApproveJournalistApplication, o as adminUpdateInboxStatus, r as adminDeleteInboxRequest, t as adminApproveAccountDeletion } from "./inbox.functions-C_dGCJHb.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Briefcase, CheckCircle2, ChevronDown, ChevronUp, Clock, Filter, Inbox, Mail, Newspaper, RefreshCw, Sparkles, Trash2, UserX, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/inbox/types.ts
var TYPE_META = {
	contact: {
		label: "Contact Message",
		icon: Mail,
		color: "text-blue-600",
		bg: "bg-blue-50"
	},
	work_with_us: {
		label: "Work Application",
		icon: Briefcase,
		color: "text-purple-600",
		bg: "bg-purple-50"
	},
	withdraw: {
		label: "Withdrawal Request",
		icon: Wallet,
		color: "text-emerald-600",
		bg: "bg-emerald-50"
	},
	delete_account: {
		label: "Account Deletion",
		icon: UserX,
		color: "text-red-600",
		bg: "bg-red-50"
	},
	event: {
		label: "Event Registration",
		icon: Sparkles,
		color: "text-amber-600",
		bg: "bg-amber-50"
	},
	journalist_application: {
		label: "Journalist Application",
		icon: Newspaper,
		color: "text-indigo-600",
		bg: "bg-indigo-50"
	}
};
var STATUS_STYLES = {
	Pending: "bg-amber-100 text-amber-700",
	Approved: "bg-emerald-100 text-emerald-700",
	Rejected: "bg-red-100 text-red-700"
};
//#endregion
//#region src/components/admin/inbox/InboxSummaryCards.tsx
function InboxSummaryCards({ filterType, setFilterType, countFor, isEnterprisePlus }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
		children: Object.entries(TYPE_META).filter(([type]) => isEnterprisePlus || type !== "withdraw").map(([type, meta]) => {
			const Icon = meta.icon;
			const pending = countFor(type, "Pending");
			const total = countFor(type);
			return /* @__PURE__ */ jsxs("button", {
				onClick: () => setFilterType(filterType === type ? "all" : type),
				className: `rounded-xl border p-4 text-left transition ${filterType === type ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`,
				children: [
					/* @__PURE__ */ jsx("div", {
						className: `mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${filterType === type ? "bg-white/10" : meta.bg}`,
						children: /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 ${filterType === type ? "text-white" : meta.color}` })
					}),
					/* @__PURE__ */ jsx("p", {
						className: `text-xs font-semibold ${filterType === type ? "text-white/70" : "text-slate-500"}`,
						children: meta.label
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-1 flex items-end gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-2xl font-bold",
							children: total
						}), pending > 0 && /* @__PURE__ */ jsxs("span", {
							className: `mb-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filterType === type ? "bg-amber-400 text-slate-900" : "bg-amber-100 text-amber-700"}`,
							children: [pending, " new"]
						})]
					})
				]
			}, type);
		})
	});
}
//#endregion
//#region src/components/admin/inbox/InboxFilterBar.tsx
function InboxFilterBar({ filterType, setFilterType, filterStatus, setFilterStatus, isEnterprisePlus }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3",
		children: [
			/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4 text-slate-400" }),
			/* @__PURE__ */ jsx("span", {
				className: "text-xs font-semibold uppercase tracking-widest text-slate-400",
				children: "Filters"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1",
				children: [
					"all",
					"contact",
					"work_with_us",
					"withdraw",
					"delete_account",
					"event"
				].filter((t) => isEnterprisePlus || t !== "withdraw").map((t) => /* @__PURE__ */ jsx("button", {
					onClick: () => setFilterType(t),
					className: `rounded-md px-3 py-1.5 text-xs font-medium transition ${filterType === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`,
					children: t === "all" ? "All Types" : TYPE_META[t]?.label
				}, t))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "ml-auto flex gap-1",
				children: [
					"all",
					"Pending",
					"Approved",
					"Rejected"
				].map((s) => /* @__PURE__ */ jsx("button", {
					onClick: () => setFilterStatus(s),
					className: `rounded-md px-3 py-1.5 text-xs font-medium transition ${filterStatus === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`,
					children: s === "all" ? "All Status" : s
				}, s))
			})
		]
	});
}
//#endregion
//#region src/components/admin/inbox/InboxRequestItem.tsx
var DETAIL_LABELS = {
	displayName: "Full Name",
	email: "Email Address",
	phone: "Phone Number",
	bloodGroup: "Blood Group",
	dob: "Date of Birth (DOB)",
	fatherName: "Father's Name",
	motherName: "Mother's Name",
	gender: "Gender",
	maritalStatus: "Marital Status",
	husbandName: "Husband's Name",
	documentType: "Verification Document Type",
	documentUrl: "ID Proof Document",
	address: "Address",
	state: "State",
	country: "Country",
	pinCode: "PIN / ZIP Code",
	bio: "Bio / Experience"
};
function InboxRequestItem({ req, isExpanded, onToggleExpand, isSelected, onToggleSelect, isLoading, handleApprove, handleReject, handleDelete }) {
	const meta = TYPE_META[req.type] ?? TYPE_META.contact;
	const Icon = meta.icon;
	let parsedDetails = null;
	try {
		if (req.details && req.details.startsWith("{")) parsedDetails = JSON.parse(req.details);
	} catch {}
	return /* @__PURE__ */ jsxs("li", {
		className: "group",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-slate-50",
			onClick: onToggleExpand,
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex h-9 items-center justify-center pt-0.5 shrink-0",
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ jsx("input", {
						type: "checkbox",
						className: "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer",
						checked: isSelected,
						"aria-label": `Select request from ${req.user_name || req.title}`,
						onChange: onToggleSelect
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: `mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`,
					children: /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${meta.color}` })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-sm font-semibold text-slate-800",
									children: req.title
								}),
								/* @__PURE__ */ jsx("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[req.status]}`,
									children: req.status
								}),
								req.type === "delete_account" && req.status === "Pending" && /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }), "Destructive"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500",
							children: [
								req.user_name && /* @__PURE__ */ jsx("span", {
									className: "font-medium text-slate-700",
									children: req.user_name
								}),
								req.user_email && /* @__PURE__ */ jsx("span", { children: req.user_email }),
								/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }), new Date(req.created_at).toLocaleString("en-IN", {
										dateStyle: "medium",
										timeStyle: "short"
									})]
								})
							]
						}),
						!isExpanded && req.details && !parsedDetails && /* @__PURE__ */ jsx("p", {
							className: "mt-1 line-clamp-1 text-xs text-slate-500",
							children: req.details
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex shrink-0 items-center gap-2 pl-2",
					children: isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-slate-400" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-slate-400" })
				})
			]
		}), isExpanded && /* @__PURE__ */ jsxs("div", {
			className: "border-t border-slate-100 bg-slate-50/70 px-5 pb-5 pt-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4 rounded-lg border border-slate-200 bg-white p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400",
						children: "Request Details"
					}), parsedDetails ? /* @__PURE__ */ jsx("dl", {
						className: "grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3",
						children: Object.entries(parsedDetails).map(([k, v]) => {
							if (!v) return null;
							if (k === "avatarUrl" || k === "avatar") return /* @__PURE__ */ jsxs("div", {
								className: "col-span-2 sm:col-span-3",
								children: [/* @__PURE__ */ jsx("dt", {
									className: "text-xs font-medium capitalize text-slate-400",
									children: "Applicant Photo / Avatar"
								}), /* @__PURE__ */ jsxs("dd", {
									className: "mt-1.5 flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("img", {
										src: String(v),
										alt: "Applicant",
										className: "h-20 w-20 rounded-xl object-cover border border-slate-200 shadow-xs bg-slate-100"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-400",
										children: "Saved in application and will be assigned to profile on approval"
									})]
								})]
							}, k);
							if (k === "documentUrl" || k === "document") return /* @__PURE__ */ jsxs("div", {
								className: "col-span-2 sm:col-span-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4",
								children: [/* @__PURE__ */ jsxs("dt", {
									className: "text-xs font-bold text-slate-800 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										"Identity Verification Document (",
										parsedDetails.documentType || "ID Proof",
										")"
									] }), /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 uppercase",
										children: parsedDetails.documentType || "Valid ID"
									})]
								}), /* @__PURE__ */ jsxs("dd", {
									className: "mt-2.5 flex flex-wrap items-start gap-4",
									children: [/* @__PURE__ */ jsxs("a", {
										href: String(v),
										target: "_blank",
										rel: "noopener noreferrer",
										className: "group/doc relative block overflow-hidden rounded-lg border border-slate-300 shadow-sm bg-white",
										title: "Click to view full size",
										children: [/* @__PURE__ */ jsx("img", {
											src: String(v),
											alt: "Verification Document",
											className: "h-32 w-auto max-w-xs object-contain transition duration-200 group-hover/doc:scale-105"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold",
											children: /* @__PURE__ */ jsx("span", { children: "Open Full Size ↗" })
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-xs text-slate-600 space-y-1.5",
										children: [
											/* @__PURE__ */ jsxs("p", {
												className: "font-semibold text-slate-800",
												children: ["Selected Document: ", /* @__PURE__ */ jsx("span", {
													className: "text-blue-700 font-bold",
													children: parsedDetails.documentType || "Official ID"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-500",
												children: "Official government ID document uploaded by the applicant."
											}),
											/* @__PURE__ */ jsx("a", {
												href: String(v),
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline pt-1",
												children: /* @__PURE__ */ jsx("span", { children: "Inspect Document in New Tab ↗" })
											})
										]
									})]
								})]
							}, k);
							if (k === "documentType" && parsedDetails.documentUrl) return null;
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs font-medium text-slate-400",
								children: DETAIL_LABELS[k] || k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-0.5 font-medium text-slate-800",
								children: String(v)
							})] }, k);
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "whitespace-pre-wrap text-sm text-slate-700",
						children: req.details || "—"
					})]
				}),
				(req.user_id || req.user_email) && /* @__PURE__ */ jsxs("div", {
					className: "mb-4 rounded-lg border border-slate-200 bg-white p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400",
						children: "User Info"
					}), /* @__PURE__ */ jsxs("dl", {
						className: "grid grid-cols-2 gap-x-8 gap-y-2 text-sm",
						children: [
							req.user_name && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs font-medium text-slate-400",
								children: "Name"
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-0.5 font-medium text-slate-800",
								children: req.user_name
							})] }),
							req.user_email && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs font-medium text-slate-400",
								children: "Email"
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-0.5 font-medium text-slate-800",
								children: req.user_email
							})] }),
							req.user_id && /* @__PURE__ */ jsxs("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ jsx("dt", {
									className: "text-xs font-medium text-slate-400",
									children: "User ID"
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-0.5 font-mono text-xs text-slate-600",
									children: req.user_id
								})]
							})
						]
					})]
				}),
				req.status === "Pending" && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ jsxs("button", {
							disabled: isLoading,
							onClick: (e) => {
								e.stopPropagation();
								handleApprove(req);
							},
							className: `flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${req.type === "delete_account" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`,
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), req.type === "delete_account" ? "Approve & Delete User" : "Approve"]
						}),
						/* @__PURE__ */ jsxs("button", {
							disabled: isLoading,
							onClick: (e) => {
								e.stopPropagation();
								handleReject(req);
							},
							className: "flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60",
							children: [/* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }), "Reject"]
						}),
						/* @__PURE__ */ jsxs("button", {
							disabled: isLoading,
							onClick: (e) => {
								e.stopPropagation();
								handleDelete(req.id);
							},
							className: "ml-auto flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), "Remove"]
						})
					]
				}),
				req.status !== "Pending" && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${STATUS_STYLES[req.status]}`,
						children: [req.status === "Approved" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }), req.status]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: (e) => {
							e.stopPropagation();
							handleDelete(req.id);
						},
						className: "ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/inbox/ConfirmDeleteModal.tsx
function ConfirmDeleteModal({ confirmDelete, actionLoading, confirmAction, onCancel }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl",
			children: confirmDelete.isDeletion ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100",
					children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6 text-red-600" })
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold text-slate-800",
					children: "Permanently Delete User?"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-2 text-sm text-slate-600",
					children: [
						"This will ",
						/* @__PURE__ */ jsx("strong", { children: "permanently delete" }),
						" the user account and all associated data including profiles, articles, sessions, and roles.",
						" ",
						/* @__PURE__ */ jsx("strong", { children: "This action cannot be undone." })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: confirmAction,
						disabled: !!actionLoading,
						className: "flex-1 rounded-md bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60",
						children: "Yes, Delete Permanently"
					}), /* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						className: "flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50",
						children: "Cancel"
					})]
				})
			] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold text-slate-800",
					children: "Remove Request?"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-slate-600",
					children: "This will permanently remove this inbox entry. The action cannot be undone."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: confirmAction,
						disabled: !!actionLoading,
						className: "flex-1 rounded-md bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60",
						children: "Remove"
					}), /* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						className: "flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50",
						children: "Cancel"
					})]
				})
			] })
		})
	});
}
//#endregion
//#region src/routes/admin.inbox.tsx?tsr-split=component
function AdminInboxPage() {
	const isEnterprisePlus = isEnterprisePlusLicense(useSiteSettings());
	const [requests, setRequests] = useState([]);
	const visibleRequests = requests.filter((req) => isEnterprisePlus || req.type !== "withdraw");
	const [summary, setSummary] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");
	const [expandedId, setExpandedId] = useState(null);
	const [actionLoading, setActionLoading] = useState(null);
	const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
	const [confirmDelete, setConfirmDelete] = useState(null);
	useEffect(() => {
		setSelected(/* @__PURE__ */ new Set());
	}, [requests]);
	const load = async () => {
		setLoading(true);
		try {
			const [reqRes, sumRes] = await Promise.all([adminGetInboxRequests({ data: {
				type: filterType,
				status: filterStatus
			} }), adminGetInboxSummary()]);
			setRequests(reqRes.requests || []);
			setSummary(sumRes.summary || []);
		} catch (err) {
			toast.error("Failed to load inbox: " + err.message);
		} finally {
			setLoading(false);
		}
	};
	const handleBulkDelete = async () => {
		if (selected.size === 0) return;
		if (!confirm(`Are you sure you want to delete ${selected.size} selected request(s)?`)) return;
		setLoading(true);
		try {
			await Promise.all(Array.from(selected).map((id) => adminDeleteInboxRequest({ data: { id } })));
			toast.success(`${selected.size} request(s) removed from inbox`);
			setSelected(/* @__PURE__ */ new Set());
			await load();
		} catch (err) {
			toast.error("Bulk delete failed: " + err.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		load();
	}, [filterType, filterStatus]);
	const countFor = (type, status) => {
		return summary.filter((r) => isEnterprisePlus || r.type !== "withdraw").filter((r) => (type === "all" || r.type === type) && (!status || r.status === status)).reduce((acc, r) => acc + Number(r.count), 0);
	};
	const handleApprove = async (req) => {
		if (req.type === "delete_account") {
			setConfirmDelete({
				id: req.id,
				userId: req.user_id,
				isDeletion: true
			});
			return;
		}
		if (req.type === "journalist_application") {
			setActionLoading(req.id);
			try {
				await adminApproveJournalistApplication({ data: { requestId: req.id } });
				toast.success("Journalist application approved and profile updated!");
				await load();
			} catch (err) {
				toast.error(err.message || "Failed to approve journalist application");
			} finally {
				setActionLoading(null);
			}
			return;
		}
		setActionLoading(req.id);
		try {
			await adminUpdateInboxStatus({ data: {
				id: req.id,
				status: "Approved"
			} });
			toast.success("Request approved");
			await load();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setActionLoading(null);
		}
	};
	const handleReject = async (req) => {
		setActionLoading(req.id);
		try {
			await adminUpdateInboxStatus({ data: {
				id: req.id,
				status: "Rejected"
			} });
			toast.success("Request rejected");
			await load();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setActionLoading(null);
		}
	};
	const handleDelete = async (id) => {
		setConfirmDelete({
			id,
			isDeletion: false
		});
	};
	const confirmAction = async () => {
		if (!confirmDelete) return;
		setActionLoading(confirmDelete.id);
		try {
			if (confirmDelete.isDeletion && confirmDelete.userId) {
				await adminApproveAccountDeletion({ data: {
					requestId: confirmDelete.id,
					userId: confirmDelete.userId
				} });
				toast.success("User account permanently deleted");
			} else {
				await adminDeleteInboxRequest({ data: { id: confirmDelete.id } });
				toast.success("Request removed from inbox");
			}
			setConfirmDelete(null);
			await load();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setActionLoading(null);
		}
	};
	const pendingTotal = countFor("all", "Pending");
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
					className: "flex items-center gap-2 text-2xl font-bold text-slate-800",
					children: [
						/* @__PURE__ */ jsx(Inbox, { className: "h-6 w-6 text-slate-600" }),
						"Admin Inbox",
						pendingTotal > 0 && /* @__PURE__ */ jsxs("span", {
							className: "rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white",
							children: [pendingTotal, " pending"]
						})
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-slate-500",
					children: "Review contact messages, work applications, withdrawals and account deletion requests."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: load,
					disabled: loading,
					className: "flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
				})]
			}),
			/* @__PURE__ */ jsx(InboxSummaryCards, {
				filterType,
				setFilterType,
				countFor,
				isEnterprisePlus
			}),
			/* @__PURE__ */ jsx(InboxFilterBar, {
				filterType,
				setFilterType,
				filterStatus,
				setFilterStatus,
				isEnterprisePlus
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-slate-200 bg-white",
				children: loading ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-center py-16 text-slate-400",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-5 w-5 animate-spin" }), "Loading requests…"]
				}) : visibleRequests.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-16 text-slate-400",
					children: [
						/* @__PURE__ */ jsx(Inbox, { className: "mb-3 h-10 w-10 opacity-30" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium",
							children: "No requests found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs",
							children: "Try changing the filter or check back later."
						})
					]
				}) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							className: "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer",
							checked: visibleRequests.length > 0 && selected.size === visibleRequests.length,
							onChange: (e) => {
								if (e.target.checked) setSelected(new Set(visibleRequests.map((r) => r.id)));
								else setSelected(/* @__PURE__ */ new Set());
							}
						}), "Select All"]
					}), selected.size > 0 && /* @__PURE__ */ jsxs("button", {
						onClick: handleBulkDelete,
						className: "flex items-center gap-1.5 rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
							"Delete Selected (",
							selected.size,
							")"
						]
					})]
				}), /* @__PURE__ */ jsx("ul", {
					className: "divide-y divide-slate-100",
					children: visibleRequests.map((req) => /* @__PURE__ */ jsx(InboxRequestItem, {
						req,
						isExpanded: expandedId === req.id,
						onToggleExpand: () => setExpandedId(expandedId === req.id ? null : req.id),
						isSelected: selected.has(req.id),
						onToggleSelect: () => {
							const newSet = new Set(selected);
							if (newSet.has(req.id)) newSet.delete(req.id);
							else newSet.add(req.id);
							setSelected(newSet);
						},
						isLoading: actionLoading === req.id,
						handleApprove,
						handleReject,
						handleDelete
					}, req.id))
				})] })
			}),
			confirmDelete && /* @__PURE__ */ jsx(ConfirmDeleteModal, {
				confirmDelete,
				actionLoading,
				confirmAction,
				onCancel: () => setConfirmDelete(null)
			})
		]
	});
}
//#endregion
export { AdminInboxPage as component };
