import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { c as postArticleComment, o as getArticleComments } from "./comments.functions-D_WGTNkA.js";
import { t as authClient } from "./auth-client-CXXVHNf9.js";
import { i as trackComment } from "./user-actions-tracker-DJQ5cFC2.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, Feather, Loader2, MessageSquare, Reply } from "lucide-react";
import { toast } from "sonner";
//#region src/components/site/CommentsSection.tsx
var SITE_NAME = "News Theme";
var MIN_CHARACTERS = 30;
var PAGE_SIZE = 6;
var URL_PATTERNS = [
	/https?:\/\//i,
	/\bwww\./i,
	/<\s*\/?\s*[a-z]+/i,
	/<\s*script/i,
	/javascript:/i,
	/on\w+\s*=/i,
	/\b[\w.-]+\s*(?:\.|\[\s*dot\s*\]|\(\s*dot\s*\)|\s+dot\s+)\s*(?:com|net|org|io|co|in|gov|edu|info|biz|app|dev|xyz|me|us|uk)\b/i,
	/[\w.+-]+@[\w-]+\.[\w.-]+/i
];
function containsLinkOrScript(s) {
	return URL_PATTERNS.some((re) => re.test(s));
}
function hasExcessiveWordRepetition(s) {
	const words = s.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 2);
	const counts = {};
	for (const w of words) {
		const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
		if (!cleanWord) continue;
		counts[cleanWord] = (counts[cleanWord] || 0) + 1;
		if (counts[cleanWord] > 5) return true;
	}
	return false;
}
function CommentsSection({ articleSlug, articleTitle }) {
	const getCommentsFn = useServerFn(getArticleComments);
	const postCommentFn = useServerFn(postArticleComment);
	const [allComments, setAllComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyDraft, setReplyDraft] = useState("");
	const [replySubmitting, setReplySubmitting] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [draft, setDraft] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [userId, setUserId] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				const u = data.session.user;
				setUserId(u.id);
				setUserEmail(u.email ?? null);
				setUserDisplayName(u.user_metadata?.display_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "User");
			}
		});
	}, []);
	const loadComments = async () => {
		try {
			setLoading(true);
			setAllComments((await getCommentsFn({ data: articleSlug })).map((r) => ({
				id: r.id,
				user: r.user,
				email: r.email,
				body: r.body,
				date: r.date,
				parentId: r.parentId ?? null
			})));
		} catch (err) {
			console.error("Failed to load comments:", err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (articleSlug) loadComments();
	}, [articleSlug]);
	const submitComment = async (e, parentId) => {
		e.preventDefault();
		const isReply = !!parentId;
		const body = (isReply ? replyDraft : draft).trim();
		const minChars = isReply ? 15 : MIN_CHARACTERS;
		const authorName = isReply ? userDisplayName || "" : name.trim();
		const authorEmail = isReply ? userEmail || "" : email.trim();
		if (!body || !authorName || !authorEmail) {
			toast.error(isReply ? "Please login to reply." : "Please fill in all fields.");
			return;
		}
		if (containsLinkOrScript(body)) {
			toast(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
			return;
		}
		if (body.length < minChars) {
			toast(`${isReply ? "Reply" : "Comment"} must be at least ${minChars} characters (currently ${body.length}).`);
			return;
		}
		if (!isReply && hasExcessiveWordRepetition(body)) {
			toast(`Please ${authorName}, your comment has been flagged. A single word cannot be repeated more than 5 times.`);
			return;
		}
		try {
			isReply ? setReplySubmitting(true) : setSubmitting(true);
			await postCommentFn({ data: {
				articleSlug,
				articleTitle,
				name: authorName,
				email: authorEmail,
				body,
				parentId: parentId ?? null
			} });
			if (userId) trackComment(userId, articleSlug);
			toast.success(isReply ? "Reply submitted! Pending approval." : "Comment submitted! It is pending administrator approval before appearing here.");
			if (isReply) {
				setReplyDraft("");
				setReplyingTo(null);
			} else {
				setDraft("");
				setName("");
				setEmail("");
				setShowForm(false);
			}
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to submit comment");
		} finally {
			isReply ? setReplySubmitting(false) : setSubmitting(false);
		}
	};
	const topLevel = allComments.filter((c) => !c.parentId);
	const getReplies = (parentId) => allComments.filter((c) => c.parentId === parentId);
	const visibleTopLevel = topLevel.slice(0, visibleCount);
	const hasMore = visibleCount < topLevel.length;
	const commentFormFields = (isReply, n, setN, em, setEm, dr, setDr, sub, onSubmit, onCancel, replyToName) => isReply ? /* @__PURE__ */ jsxs("form", {
		onSubmit,
		className: "mt-2 ml-3 pl-2.5 border-l-2 border-sky-400",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1.5 mb-1.5 text-xs text-sky-700",
			children: [
				/* @__PURE__ */ jsx(Reply, { className: "h-3 w-3 text-sky-500" }),
				/* @__PURE__ */ jsxs("span", {
					className: "text-[11px]",
					children: ["Replying to ", /* @__PURE__ */ jsx("strong", {
						className: "font-semibold text-sky-950",
						children: replyToName
					})]
				}),
				userDisplayName && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "text-sky-400",
					children: "·"
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[11px] text-sky-700",
					children: ["as ", /* @__PURE__ */ jsx("strong", {
						className: "font-semibold text-sky-950",
						children: userDisplayName
					})]
				})] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex gap-2 items-start bg-sky-50/50 border border-sky-100 rounded-lg p-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center shrink-0 mt-0.5 text-sky-500",
				children: /* @__PURE__ */ jsx(Feather, { className: "h-3.5 w-3.5" })
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ jsx("textarea", {
					required: true,
					value: dr,
					onChange: (e) => setDr(e.target.value),
					placeholder: "Write your reply... (min. 15 characters)",
					rows: 2,
					maxLength: 500,
					autoFocus: true,
					className: "w-full resize-none border-0 bg-transparent p-0 text-xs text-[#141414] placeholder:text-muted-foreground/60 focus:outline-none transition-colors"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mt-1.5 pt-1.5 border-t border-sky-100",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-[10px] text-muted-foreground",
						children: [
							dr.length,
							"/500 ",
							dr.length < 15 && dr.length > 0 && /* @__PURE__ */ jsx("span", {
								className: "text-amber-600 font-medium",
								children: "(min 15)"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [onCancel && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onCancel,
							className: "text-[11px] text-muted-foreground hover:text-sky-700 transition-colors px-2 py-0.5 font-medium",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: sub || dr.trim().length < 15,
							className: "inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-600 disabled:opacity-30 transition-opacity",
							children: [sub && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin text-white" }), "Reply"]
						})]
					})]
				})]
			})]
		})]
	}) : /* @__PURE__ */ jsxs("form", {
		onSubmit,
		className: "mt-3 space-y-3 rounded-lg border border-border/70 bg-card/60 p-3.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1",
					children: "Your Name"
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					required: true,
					value: n,
					onChange: (e) => setN(e.target.value),
					placeholder: "e.g. John Doe",
					className: "w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1",
					children: "Your Email"
				}), /* @__PURE__ */ jsx("input", {
					type: "email",
					required: true,
					value: em,
					onChange: (e) => setEm(e.target.value),
					placeholder: "e.g. john@example.com",
					className: "w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
				className: "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1",
				children: "Comment"
			}), /* @__PURE__ */ jsx("textarea", {
				required: true,
				value: dr,
				onChange: (e) => setDr(e.target.value),
				placeholder: "Write your comment... (minimum 30 characters, links are automatically blocked)",
				rows: 3,
				maxLength: 1e3,
				className: "w-full rounded border border-border bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-[11px] text-muted-foreground",
					children: [
						dr.length,
						"/",
						MIN_CHARACTERS,
						" min characters (",
						dr.length,
						" total)"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [onCancel && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onCancel,
						className: "px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: sub || !dr.trim() || !n.trim() || !em.trim(),
						className: "rounded-full bg-[#141414] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5",
						children: [sub && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin text-white" }), "Submit Comment"]
					})]
				})]
			})
		]
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-8 border-t border-border pt-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-2.5 border-b border-border",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4 text-foreground" }), /* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-bold uppercase tracking-wider text-foreground",
						children: ["Comments ", /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-medium text-muted-foreground ml-0.5",
							children: [
								"(",
								topLevel.length,
								")"
							]
						})]
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setShowForm((s) => !s),
					className: "rounded-full bg-[#141414] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#141414]/90 transition-opacity",
					children: showForm ? "Cancel" : "Post Comment"
				})]
			}),
			showForm && commentFormFields(false, name, setName, email, setEmail, draft, setDraft, submitting, (e) => submitComment(e, null), () => setShowForm(false)),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center py-6 text-slate-400",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }), /* @__PURE__ */ jsx("span", {
					className: "text-xs",
					children: "Loading comments..."
				})]
			}) : /* @__PURE__ */ jsxs("ul", {
				className: "divide-y divide-border/50",
				children: [visibleTopLevel.map((c) => {
					const replies = getReplies(c.id);
					const isReplyingThis = replyingTo?.id === c.id;
					return /* @__PURE__ */ jsxs("li", {
						className: "py-2.5 first:pt-2 last:pb-0",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold text-[#141414] tracking-tight",
								children: c.user
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[13px] text-[#222222] leading-snug whitespace-pre-line",
								children: c.body
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 flex items-center",
								children: /* @__PURE__ */ jsxs("button", {
									onClick: () => {
										if (!userId) {
											toast.error("Please login to reply.");
											return;
										}
										setReplyingTo(isReplyingThis ? null : {
											id: c.id,
											name: c.user
										});
										setReplyDraft("");
									},
									className: "inline-flex items-center gap-1 text-[11px] font-semibold text-sky-500 hover:text-sky-600 transition-colors py-0.5",
									children: [/* @__PURE__ */ jsx(Reply, { className: "h-3 w-3 text-sky-500" }), /* @__PURE__ */ jsx("span", { children: isReplyingThis ? "Cancel" : "Reply" })]
								})
							}),
							replies.length > 0 && /* @__PURE__ */ jsx("ul", {
								className: "mt-2 ml-3 space-y-1.5 border-l-2 border-slate-200 pl-3",
								children: replies.map((r) => /* @__PURE__ */ jsxs("li", {
									className: "bg-slate-50/70 border border-slate-100 rounded-md px-2.5 py-1.5",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-bold text-[#141414]",
											children: r.user
										}), r.user.toLowerCase() === "admin" && /* @__PURE__ */ jsx("span", {
											className: "bg-slate-900 text-white text-[9px] font-bold uppercase px-1 py-0.2 rounded tracking-wide",
											children: "Staff"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-xs text-[#2b2b2b] leading-relaxed whitespace-pre-line",
										children: r.body
									})]
								}, r.id))
							}),
							isReplyingThis && commentFormFields(true, "", () => {}, "", () => {}, replyDraft, setReplyDraft, replySubmitting, (e) => submitComment(e, c.id), () => setReplyingTo(null), c.user)
						]
					}, c.id);
				}), topLevel.length === 0 && /* @__PURE__ */ jsx("li", {
					className: "py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-card/40 mt-3",
					children: "No approved comments yet. Be the first to comment!"
				})]
			}),
			hasMore && /* @__PURE__ */ jsx("div", {
				className: "mt-4 text-center",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: () => setVisibleCount((v) => v + PAGE_SIZE),
					className: "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-background px-4 py-1.5 text-xs font-semibold text-[#141414] hover:bg-slate-50 transition-colors shadow-xs",
					children: [/* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
						"Load More Comments (",
						topLevel.length - visibleCount,
						" remaining)"
					] })]
				})
			})
		]
	});
}
//#endregion
export { CommentsSection, CommentsSection as default };

//# sourceMappingURL=CommentsSection-LaipmE94.js.map