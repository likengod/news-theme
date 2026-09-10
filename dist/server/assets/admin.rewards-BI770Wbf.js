import { a as saveRanks, n as loadRanks, t as getJournalistRanksServer } from "./journalist-ranks-DwnYxfhX.js";
import { a as loadAllPendingClaims, c as getRewardsServer, d as newRecurring, f as saveRewards, i as getPendingClaimsServer, l as loadRewards, n as saveSocialLinks, o as updateClaimStatus, t as loadSocialLinks, u as newOneTime } from "./social-links-D69NXKPc.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Award, Ban, Gift, Link, Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";
//#region src/components/admin/rewards/RewardRulesTable.tsx
function RewardRulesTable({ currentGroup, onAddRecurring, onEditRecurring, onDeleteRecurring, onAddOneTime, onEditOneTime, onDeleteOneTime }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xs font-bold uppercase tracking-wider text-slate-600",
					children: "Recurring Reward Tasks"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-slate-500",
					children: "Daily or per-action rewards for users"
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: onAddRecurring,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " Add Task"]
				})]
			}), /* @__PURE__ */ jsxs("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3",
							children: "Task Title"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3",
							children: "Reward Amount"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3",
							children: "Daily Cap"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3 text-right",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y divide-slate-100",
					children: [currentGroup.recurring.map((item) => /* @__PURE__ */ jsxs("tr", {
						className: "hover:bg-slate-50/60 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 font-semibold text-slate-900",
								children: item.title
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 text-emerald-700 font-medium",
								children: item.reward
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 text-slate-600",
								children: item.cap
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ jsxs("div", {
									className: "inline-flex gap-1.5",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => onEditRecurring(item),
										className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50",
										children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => onDeleteRecurring(item.id),
										className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Delete"]
									})]
								})
							})
						]
					}, item.id)), currentGroup.recurring.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 4,
						className: "px-5 py-6 text-center text-xs text-slate-400",
						children: "No recurring reward tasks defined yet."
					}) })]
				})]
			})]
		}), /* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-xs font-bold uppercase tracking-wider text-slate-600",
					children: "One-Time Bonus Tasks"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-slate-500",
					children: "Signup and social follow bonus points"
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: onAddOneTime,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " Add Task"]
				})]
			}), /* @__PURE__ */ jsxs("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3",
							children: "Task Title"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3",
							children: "Points Awarded"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "px-5 py-3 text-right",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ jsxs("tbody", {
					className: "divide-y divide-slate-100",
					children: [currentGroup.oneTime.map((item) => /* @__PURE__ */ jsxs("tr", {
						className: "hover:bg-slate-50/60 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 font-semibold text-slate-900",
								children: item.title
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-5 py-3 text-amber-700 font-bold",
								children: [
									"+",
									item.points,
									" pts"
								]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ jsxs("div", {
									className: "inline-flex gap-1.5",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => onEditOneTime(item),
										className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50",
										children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => onDeleteOneTime(item.id),
										className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Delete"]
									})]
								})
							})
						]
					}, item.id)), currentGroup.oneTime.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 3,
						className: "px-5 py-6 text-center text-xs text-slate-400",
						children: "No one-time tasks defined yet."
					}) })]
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/rewards/JournalistRanksEditor.tsx
function JournalistRanksEditor({ ranks, onChangeField, onSave }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-100 pb-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-amber-600" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-sm font-bold uppercase tracking-wider text-slate-800",
					children: "Journalist Rank Tier Points Scale"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500",
					children: "Configure points per article published at each journalist rank"
				})] })]
			}), /* @__PURE__ */ jsxs("button", {
				onClick: onSave,
				className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800",
				children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save Rank Scale"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: ranks.map((r) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-sm font-bold text-slate-900",
							children: [r.name, " Rank"]
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase",
							children: "Tier"
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs text-slate-500",
						children: "Articles Required"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						value: r.minNews,
						onChange: (e) => onChangeField(r.id, "minNews", Number(e.target.value)),
						className: "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs text-slate-500",
						children: "Points / Published Article"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						value: r.pointsPerNews,
						onChange: (e) => onChangeField(r.id, "pointsPerNews", Number(e.target.value)),
						className: "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-amber-700 focus:border-slate-900 focus:outline-none"
					})] })
				]
			}, r.id))
		})]
	});
}
//#endregion
//#region src/components/admin/rewards/SocialLinksEditor.tsx
var PLATFORMS = [
	{
		key: "facebook",
		label: "Facebook Page URL",
		icon: FaFacebookF,
		color: "#1877F2",
		placeholder: "https://facebook.com/..."
	},
	{
		key: "youtube",
		label: "YouTube Channel URL",
		icon: FaYoutube,
		color: "#FF0000",
		placeholder: "https://youtube.com/@..."
	},
	{
		key: "instagram",
		label: "Instagram Profile URL",
		icon: FaInstagram,
		color: "#E4405F",
		placeholder: "https://instagram.com/..."
	},
	{
		key: "whatsapp",
		label: "WhatsApp Channel URL",
		icon: FaWhatsapp,
		color: "#25D366",
		placeholder: "https://whatsapp.com/channel/..."
	}
];
function SocialLinksEditor() {
	const [links, setLinks] = useState(() => loadSocialLinks());
	const [saved, setSaved] = useState(false);
	const handleSave = () => {
		saveSocialLinks(links);
		setSaved(true);
		toast.success("Social links saved! Earn-points page will use these URLs.");
		setTimeout(() => setSaved(false), 2e3);
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-100 pb-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Link, { className: "h-5 w-5 text-blue-600" }), /* @__PURE__ */ jsx("h2", {
					className: "text-sm font-bold uppercase tracking-wider text-slate-800",
					children: "Social Media Channel Links"
				})]
			}), /* @__PURE__ */ jsxs("button", {
				onClick: handleSave,
				className: `inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`,
				children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Saved!" : "Save Social Links"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: PLATFORMS.map((p) => {
				const Icon = p.icon;
				return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
					className: "mb-1 flex items-center gap-2 text-xs font-semibold text-slate-600",
					children: [/* @__PURE__ */ jsx(Icon, {
						className: "h-3.5 w-3.5",
						style: { color: p.color }
					}), p.label]
				}), /* @__PURE__ */ jsx("input", {
					type: "url",
					value: links[p.key],
					onChange: (e) => setLinks({
						...links,
						[p.key]: e.target.value
					}),
					placeholder: p.placeholder,
					className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})] }, p.key);
			})
		})]
	});
}
//#endregion
//#region src/components/admin/rewards/PendingClaimsTable.tsx
function PendingClaimsTable({ claims, onApprove, onReject }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-slate-100 bg-slate-50/60 px-5 py-3",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-xs font-bold uppercase tracking-wider text-slate-600",
				children: "User Social Proof Claims Review"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-slate-500",
				children: "Approve or reject social follow/subscribe submissions to credit MySQL user points"
			})]
		}), /* @__PURE__ */ jsxs("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "User Name"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Platform"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Submitted Handle"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Points"
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
				children: [claims.map((c) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-slate-50/60 transition-colors",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 font-semibold text-slate-900",
							children: c.userName || "User"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 capitalize font-medium text-slate-700",
							children: c.platform
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 font-mono text-xs text-slate-600",
							children: c.handle
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "px-5 py-3 font-bold text-amber-700",
							children: [
								"+",
								c.points,
								" pts"
							]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3",
							children: /* @__PURE__ */ jsx("span", {
								className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : c.status === "rejected" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`,
								children: c.status
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex gap-1.5",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => onApprove(c),
									disabled: c.status === "approved",
									className: "inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }), " Approve"]
								}), /* @__PURE__ */ jsxs("button", {
									onClick: () => onReject(c),
									disabled: c.status === "rejected",
									className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40",
									children: [/* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" }), " Reject"]
								})]
							})
						})
					]
				}, c.id)), claims.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 6,
					className: "px-5 py-8 text-center text-xs text-slate-400",
					children: "No social proof claims submitted yet."
				}) })]
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/rewards/RewardEditorModal.tsx
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white p-5 shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-center justify-between border-b border-slate-100 pb-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-900",
					children: title
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded p-1 text-slate-400 hover:bg-slate-100",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children
			})]
		})
	});
}
function SaveBar({ onSave, onCancel }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3",
		children: [/* @__PURE__ */ jsx("button", {
			onClick: onCancel,
			className: "rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50",
			children: "Cancel"
		}), /* @__PURE__ */ jsxs("button", {
			onClick: onSave,
			className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800",
			children: [/* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), " Save Task"]
		})]
	});
}
//#endregion
//#region src/routes/admin.rewards.tsx?tsr-split=component
function RewardsPage() {
	const [groups, setGroups] = useState(() => loadRewards());
	const [active, setActive] = useState("all");
	const [ranksList, setRanksList] = useState(() => loadRanks());
	const [claims, setClaims] = useState(() => loadAllPendingClaims());
	useEffect(() => {
		getRewardsServer().then((r) => setGroups(r)).catch(() => {});
		getJournalistRanksServer().then((r) => setRanksList(r)).catch(() => {});
		getPendingClaimsServer().then((c) => setClaims(c)).catch(() => {});
	}, []);
	const persist = (next) => {
		setGroups(next);
		saveRewards(next);
	};
	const handleUpdateRankField = (id, field, val) => {
		setRanksList(ranksList.map((r) => r.id === id ? {
			...r,
			[field]: val
		} : r));
	};
	const handleSaveRanks = () => {
		saveRanks(ranksList);
		toast.success("Journalist ranks points scale saved to MySQL!");
	};
	const handleApproveClaim = (claim) => {
		updateClaimStatus(claim.userId, claim.id, "approved");
		toast.success(`Claim approved! Awarded +${claim.points} pts to user in MySQL`);
		setClaims((prev) => prev.map((c) => c.id === claim.id ? {
			...c,
			status: "approved"
		} : c));
	};
	const handleRejectClaim = (claim) => {
		updateClaimStatus(claim.userId, claim.id, "rejected");
		toast.success("Claim rejected");
		setClaims((prev) => prev.map((c) => c.id === claim.id ? {
			...c,
			status: "rejected"
		} : c));
	};
	const current = groups.find((g) => g.roleId === active) ?? groups[0];
	const updateCurrent = (patch) => {
		persist(groups.map((g) => g.roleId === current.roleId ? {
			...g,
			...patch
		} : g));
	};
	const [recEdit, setRecEdit] = useState(null);
	const [recIsNew, setRecIsNew] = useState(false);
	const [oneEdit, setOneEdit] = useState(null);
	const [oneIsNew, setOneIsNew] = useState(false);
	const saveRecurring = () => {
		if (!recEdit || !recEdit.title.trim()) return toast.error("Title is required");
		const list = current.recurring;
		updateCurrent({ recurring: recIsNew ? [...list, recEdit] : list.map((r) => r.id === recEdit.id ? recEdit : r) });
		toast.success(recIsNew ? "Task added" : "Task updated");
		setRecEdit(null);
	};
	const deleteRecurring = (id) => {
		updateCurrent({ recurring: current.recurring.filter((r) => r.id !== id) });
		toast.success("Task removed");
	};
	const saveOneTime = () => {
		if (!oneEdit || !oneEdit.title.trim()) return toast.error("Title is required");
		const list = current.oneTime;
		updateCurrent({ oneTime: oneIsNew ? [...list, oneEdit] : list.map((r) => r.id === oneEdit.id ? oneEdit : r) });
		toast.success(oneIsNew ? "Task added" : "Task updated");
		setOneEdit(null);
	};
	const deleteOneTime = (id) => {
		updateCurrent({ oneTime: current.oneTime.filter((r) => r.id !== id) });
		toast.success("Task removed");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Rewards & Points Rules"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Define earning rules per user role, journalist rank scales, and review social proof claims."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800",
					children: [/* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-amber-600" }), " MySQL Points Engine Active"]
				})]
			}),
			/* @__PURE__ */ jsx(JournalistRanksEditor, {
				ranks: ranksList,
				onChangeField: handleUpdateRankField,
				onSave: handleSaveRanks
			}),
			/* @__PURE__ */ jsx(SocialLinksEditor, {}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2",
					children: groups.map((g) => /* @__PURE__ */ jsx("button", {
						onClick: () => setActive(g.roleId),
						className: `rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${active === g.roleId ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
						children: g.label
					}, g.roleId))
				}), /* @__PURE__ */ jsx(RewardRulesTable, {
					currentGroup: current,
					onAddRecurring: () => {
						setRecEdit(newRecurring());
						setRecIsNew(true);
					},
					onEditRecurring: (item) => {
						setRecEdit({ ...item });
						setRecIsNew(false);
					},
					onDeleteRecurring: deleteRecurring,
					onAddOneTime: () => {
						setOneEdit(newOneTime());
						setOneIsNew(true);
					},
					onEditOneTime: (item) => {
						setOneEdit({ ...item });
						setOneIsNew(false);
					},
					onDeleteOneTime: deleteOneTime
				})]
			}),
			/* @__PURE__ */ jsx(PendingClaimsTable, {
				claims,
				onApprove: handleApproveClaim,
				onReject: handleRejectClaim
			}),
			recEdit && /* @__PURE__ */ jsxs(Modal, {
				title: recIsNew ? "Add Recurring Task" : "Edit Recurring Task",
				onClose: () => setRecEdit(null),
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Task Title"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: recEdit.title,
						onChange: (e) => setRecEdit({
							...recEdit,
							title: e.target.value
						}),
						placeholder: "e.g. Share news article",
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Reward Text"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: recEdit.reward,
						onChange: (e) => setRecEdit({
							...recEdit,
							reward: e.target.value
						}),
						placeholder: "e.g. ₹0.20 per share",
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Daily Cap"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: recEdit.cap,
						onChange: (e) => setRecEdit({
							...recEdit,
							cap: e.target.value
						}),
						placeholder: "e.g. up to ₹1 / day",
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsx(SaveBar, {
						onSave: saveRecurring,
						onCancel: () => setRecEdit(null)
					})
				]
			}),
			oneEdit && /* @__PURE__ */ jsxs(Modal, {
				title: oneIsNew ? "Add One-Time Task" : "Edit One-Time Task",
				onClose: () => setOneEdit(null),
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Task Title"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: oneEdit.title,
						onChange: (e) => setOneEdit({
							...oneEdit,
							title: e.target.value
						}),
						placeholder: "e.g. Subscribe to YouTube Channel",
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Points Awarded"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						value: oneEdit.points,
						onChange: (e) => setOneEdit({
							...oneEdit,
							points: Number(e.target.value) || 0
						}),
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm font-bold text-amber-700 focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsx(SaveBar, {
						onSave: saveOneTime,
						onCancel: () => setOneEdit(null)
					})
				]
			})
		]
	});
}
//#endregion
export { RewardsPage as component };
