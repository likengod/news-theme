import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as getAllCommentsFn, i as getAdminComments, l as updateCommentStatus, n as deleteComment, r as generateDummyCommentsFn, s as importCommentsFn, t as deleteAllCommentsFn } from "./comments.functions-4_Xk8u_A.js";
import { t as CsvImportExport } from "./CsvImportExport-CHUh-RCw.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronLeft, ChevronRight, Search, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/comments/CommentTable.tsx
var badge = {
	Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	Pending: "bg-amber-50 text-amber-700 border-amber-200",
	Spam: "bg-red-50 text-red-700 border-red-200"
};
function CommentTable({ comments, onSetStatus, onDelete }) {
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "User"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Comment Body"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Article"
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
				children: [comments.map((c) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-slate-50/70 transition-colors",
					children: [
						/* @__PURE__ */ jsxs("td", {
							className: "px-5 py-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-slate-900",
								children: c.user || "Anonymous"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: c.email
							})]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-700 max-w-sm",
							children: c.body
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-600 font-medium max-w-xs truncate",
							children: /* @__PURE__ */ jsx("a", {
								href: `/news/${c.articleSlug}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:underline text-blue-600",
								children: c.articleTitle || c.articleSlug
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3",
							children: /* @__PURE__ */ jsx("span", {
								className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge[c.status]}`,
								children: c.status
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex gap-1",
								children: [
									c.status !== "Approved" && /* @__PURE__ */ jsx("button", {
										onClick: () => onSetStatus(c.id, "Approved"),
										title: "Approve Comment",
										className: "rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100",
										children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" })
									}),
									c.status !== "Spam" && /* @__PURE__ */ jsx("button", {
										onClick: () => onSetStatus(c.id, "Spam"),
										title: "Mark as Spam",
										className: "rounded-md border border-amber-200 bg-amber-50 p-1.5 text-amber-800 hover:bg-amber-100",
										children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => onDelete(c.id),
										title: "Delete Comment",
										className: "rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100",
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						})
					]
				}, c.id)), comments.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "px-5 py-8 text-center text-xs text-slate-400",
					children: "No comments found in this tab."
				}) })]
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.comments.tsx?tsr-split=component
var tabs = [
	"All",
	"Pending",
	"Approved",
	"Spam"
];
function CommentsPage() {
	const getCommentsFn = useServerFn(getAdminComments);
	const updateStatusFn = useServerFn(updateCommentStatus);
	const deleteCommentFn = useServerFn(deleteComment);
	const deleteAllFn = useServerFn(deleteAllCommentsFn);
	const getAllFn = useServerFn(getAllCommentsFn);
	const importFn = useServerFn(importCommentsFn);
	const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);
	const handleImport = async (data) => {
		try {
			const res = await importFn({ data });
			toast.success(`Successfully imported ${res.inserted} comment${res.inserted !== 1 ? "s" : ""}!`);
			loadComments();
		} catch (err) {
			toast.error(err.message || "Import failed");
		}
	};
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("All");
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [showAiModal, setShowAiModal] = useState(false);
	const [aiPublicUserId, setAiPublicUserId] = useState("");
	const [aiArticleSlug, setAiArticleSlug] = useState("");
	const [aiCount, setAiCount] = useState(5);
	const [aiPositivity, setAiPositivity] = useState(80);
	const [aiLanguage, setAiLanguage] = useState("Bengali");
	const [aiGenerating, setAiGenerating] = useState(false);
	const generateAiComments = useServerFn(generateDummyCommentsFn);
	const handleGenerateAi = async (e) => {
		e.preventDefault();
		if (!aiPublicUserId || !aiArticleSlug || aiCount < 1) return;
		try {
			setAiGenerating(true);
			await generateAiComments({ data: {
				publicUserIds: aiPublicUserId,
				articleSlug: aiArticleSlug,
				count: aiCount,
				positivity: aiPositivity,
				language: aiLanguage
			} });
			toast.success(`Successfully generated \${res.count} comments!`);
			setShowAiModal(false);
			setAiPublicUserId("");
			setAiArticleSlug("");
			setAiCount(5);
			setAiPositivity(80);
			setAiLanguage("Bengali");
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to generate comments");
		} finally {
			setAiGenerating(false);
		}
	};
	const loadComments = async () => {
		try {
			setLoading(true);
			const res = await getCommentsFn({ data: {
				status: tab,
				q,
				page,
				limit: 20
			} });
			setRows(res.rows);
			setTotalPages(res.totalPages);
			setTotal(res.total);
		} catch (err) {
			toast.error(err.message || "Failed to load comments");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadComments();
	}, [
		tab,
		q,
		page
	]);
	const setStatus = async (id, status) => {
		try {
			await updateStatusFn({ data: {
				id,
				status
			} });
			toast.success(`Comment marked as ${status}`);
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to update comment");
		}
	};
	const remove = async (id) => {
		if (!confirm("Delete this comment permanently?")) return;
		try {
			await deleteCommentFn({ data: id });
			toast.success("Comment deleted");
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to delete comment");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Comment Moderation"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-sm text-slate-500",
					children: [
						"Review, approve, or mark reader comments as spam across articles.",
						" ",
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700",
							children: [
								total.toLocaleString(),
								" total comment",
								total !== 1 ? "s" : ""
							]
						})
					]
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsx(CsvImportExport, {
							data: rows,
							getData: getAllFn,
							filename: "comments",
							onImport: handleImport
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => setShowAiModal(true),
							className: "inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }), " AI Generate"]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => setShowDeleteAllModal(true),
							className: "inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), " Delete All"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1.5",
					children: tabs.map((t) => /* @__PURE__ */ jsx("button", {
						onClick: () => {
							setTab(t);
							setPage(1);
						},
						className: `rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${tab === t ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
						children: t
					}, t))
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						},
						placeholder: "Search comment content...",
						className: "h-9 w-64 rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
					})]
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" })
			}) : /* @__PURE__ */ jsx(CommentTable, {
				comments: rows,
				onSetStatus: setStatus,
				onDelete: remove
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-t border-slate-200 pt-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs text-slate-500",
					children: [
						"Showing ",
						/* @__PURE__ */ jsx("strong", { children: rows.length }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: total.toLocaleString() }),
						" comment",
						total !== 1 ? "s" : "",
						totalPages > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
							" — Page ",
							/* @__PURE__ */ jsx("strong", { children: page }),
							" of ",
							/* @__PURE__ */ jsx("strong", { children: totalPages })
						] })
					]
				}), totalPages > 1 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page <= 1,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }), " Previous"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page >= totalPages,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: ["Next ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })]
					})]
				})]
			}),
			showAiModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-6 py-4",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-lg font-bold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-blue-600" }), " Generate AI Comments"]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowAiModal(false),
							className: "text-slate-400 hover:text-slate-600",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleGenerateAi,
						className: "p-6 space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "mb-1.5 block text-sm font-semibold text-slate-700",
									children: "User Public IDs (comma separated)"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									required: true,
									placeholder: "e.g. 1000000000, 1000000001",
									value: aiPublicUserId,
									onChange: (e) => setAiPublicUserId(e.target.value),
									className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-slate-500",
									children: "Multiple Public IDs can be added separated by commas."
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1.5 block text-sm font-semibold text-slate-700",
								children: "Article Slug / Link"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								placeholder: "e.g. my-awesome-article",
								value: aiArticleSlug,
								onChange: (e) => setAiArticleSlug(e.target.value),
								className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1.5 block text-sm font-semibold text-slate-700",
									children: "Number of Comments"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									required: true,
									min: "1",
									max: "50",
									value: aiCount,
									onChange: (e) => setAiCount(parseInt(e.target.value) || 1),
									className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1.5 block text-sm font-semibold text-slate-700",
									children: "Positivity (%)"
								}), /* @__PURE__ */ jsx("input", {
									type: "number",
									required: true,
									min: "0",
									max: "100",
									value: aiPositivity,
									onChange: (e) => setAiPositivity(parseInt(e.target.value) || 0),
									className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1.5 block text-sm font-semibold text-slate-700",
								children: "Language"
							}), /* @__PURE__ */ jsxs("select", {
								value: aiLanguage,
								onChange: (e) => setAiLanguage(e.target.value),
								className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "Bengali",
										children: "Bengali"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "English",
										children: "English"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Hinglish",
										children: "Hinglish"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Mixed (Bengali & English)",
										children: "Mixed (Bengali & English)"
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-end gap-3 pt-4 border-t border-slate-100",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowAiModal(false),
									className: "rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: aiGenerating,
									className: "inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
									children: aiGenerating ? /* @__PURE__ */ jsx(Fragment, { children: "Generating..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }), " Generate"] })
								})]
							})
						]
					})]
				})
			}),
			showDeleteAllModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 px-6 py-4",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-lg font-bold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5 text-red-600" }), " Delete All Comments"]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowDeleteAllModal(false),
							className: "text-slate-400 hover:text-slate-600",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-red-200 bg-red-50 p-4 mb-5",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold text-red-800 mb-1",
									children: "⚠️ This action is permanent!"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-red-700",
									children: tab === "All" ? "All comments will be permanently deleted from the database and cannot be recovered." : `All "${tab}" comments will be permanently deleted and cannot be recovered.`
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-sm text-slate-600 mb-6",
								children: [
									"Currently viewing: ",
									/* @__PURE__ */ jsx("strong", { children: tab }),
									" tab.",
									tab !== "All" && " Only comments in this tab will be deleted."
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-end gap-3",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setShowDeleteAllModal(false),
									disabled: deletingAll,
									className: "rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50",
									children: "Cancel"
								}), /* @__PURE__ */ jsxs("button", {
									onClick: async () => {
										try {
											setDeletingAll(true);
											await deleteAllFn({ data: { status: tab } });
											toast.success(`All ${tab === "All" ? "" : tab + " "}comments permanently deleted!`);
											setShowDeleteAllModal(false);
											loadComments();
										} catch (err) {
											toast.error(err.message || "Failed to delete comments");
										} finally {
											setDeletingAll(false);
										}
									},
									disabled: deletingAll,
									className: "inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), deletingAll ? "Deleting..." : `Yes, Delete All ${tab === "All" ? "" : tab}`]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { CommentsPage as component };

//# sourceMappingURL=admin.comments-Bfuh9M1n.js.map