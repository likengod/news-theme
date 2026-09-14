import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { c as postArticleComment, o as getArticleComments } from "./comments.functions-B-L9Wj95.js";
import { t as authClient } from "./auth-client-CgmvlXls.js";
import { i as trackComment } from "./user-actions-tracker-DJQ5cFC2.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, Feather, Loader2, MessageSquare, Reply } from "lucide-react";
import { toast } from "sonner";
//#region src/components/site/CommentsSection.tsx
var SITE_NAME = "News Theme";
var MIN_CHARACTERS = 81;
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
			toast(`Reply must be at least ${minChars} characters (currently ${body.length}).`);
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
		className: "mt-3 ml-10 pl-4 border-l-2 border-primary/20",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 mb-2 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ jsx(Reply, { className: "h-3.5 w-3.5 text-primary/60" }),
				/* @__PURE__ */ jsxs("span", { children: ["Replying to ", /* @__PURE__ */ jsx("strong", {
					className: "text-foreground",
					children: replyToName
				})] }),
				userDisplayName && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground/40",
					children: "·"
				}), /* @__PURE__ */ jsxs("span", { children: ["as ", /* @__PURE__ */ jsx("strong", {
					className: "text-foreground",
					children: userDisplayName
				})] })] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex gap-2.5 items-start",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center shrink-0 mt-1 text-primary",
				children: /* @__PURE__ */ jsx(Feather, { className: "h-4 w-4" })
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
					className: "w-full resize-none border-0 border-b border-border bg-transparent pb-1 pt-0.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mt-2",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-[11px] text-muted-foreground/70",
						children: [
							dr.length,
							" / 500 ",
							dr.length < 15 && dr.length > 0 && /* @__PURE__ */ jsx("span", {
								className: "text-amber-500",
								children: "(min 15)"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [onCancel && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onCancel,
							className: "text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: sub || dr.trim().length < 15,
							className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-80 disabled:opacity-30 transition-opacity",
							children: [sub && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }), "Reply"]
						})]
					})]
				})]
			})]
		})]
	}) : /* @__PURE__ */ jsxs("form", {
		onSubmit,
		className: "mt-5 space-y-4 rounded-lg border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
					children: "Your Name"
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					required: true,
					value: n,
					onChange: (e) => setN(e.target.value),
					placeholder: "e.g. John Doe",
					className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
					children: "Your Email"
				}), /* @__PURE__ */ jsx("input", {
					type: "email",
					required: true,
					value: em,
					onChange: (e) => setEm(e.target.value),
					placeholder: "e.g. john@example.com",
					className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
				className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
				children: "Comment"
			}), /* @__PURE__ */ jsx("textarea", {
				required: true,
				value: dr,
				onChange: (e) => setDr(e.target.value),
				placeholder: "Write your comment... (minimum 81 characters, links are automatically blocked)",
				rows: 4,
				maxLength: 1e3,
				className: "w-full border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-xs text-muted-foreground",
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
						className: "px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: sub || !dr.trim() || !n.trim() || !em.trim(),
						className: "bg-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5",
						children: [sub && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }), "Submit Comment"]
					})]
				})]
			})
		]
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-10 border-t border-border pt-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("h3", {
					className: "headline font-serif text-2xl font-bold text-primary flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5" }),
						"Comments (",
						topLevel.length,
						")"
					]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setShowForm((s) => !s),
					className: "bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 transition-opacity",
					children: showForm ? "Cancel" : "Post Comment"
				})]
			}),
			showForm && commentFormFields(false, name, setName, email, setEmail, draft, setDraft, submitting, (e) => submitComment(e, null), () => setShowForm(false)),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center py-8 text-slate-400",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin mr-2" }), /* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Loading comments..."
				})]
			}) : /* @__PURE__ */ jsxs("ul", {
				className: "mt-6 space-y-5",
				children: [visibleTopLevel.map((c) => {
					const replies = getReplies(c.id);
					const isReplyingThis = replyingTo?.id === c.id;
					return /* @__PURE__ */ jsxs("li", {
						className: "border-b border-border pb-4 last:border-0 last:pb-0",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold text-foreground",
									children: c.user
								}), /* @__PURE__ */ jsxs("button", {
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
									className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0",
									children: [/* @__PURE__ */ jsx(Reply, { className: "h-3.5 w-3.5" }), " Reply"]
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
								children: c.body
							}),
							replies.length > 0 && /* @__PURE__ */ jsx("ul", {
								className: "mt-3 ml-6 space-y-3 border-l-2 border-border pl-4",
								children: replies.map((r) => /* @__PURE__ */ jsxs("li", {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold text-foreground",
										children: r.user
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
										children: r.body
									})]
								}, r.id))
							}),
							isReplyingThis && commentFormFields(true, "", () => {}, "", () => {}, replyDraft, setReplyDraft, replySubmitting, (e) => submitComment(e, c.id), () => setReplyingTo(null), c.user)
						]
					}, c.id);
				}), topLevel.length === 0 && /* @__PURE__ */ jsx("li", {
					className: "py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card/50",
					children: "No approved comments yet. Be the first to comment!"
				})]
			}),
			hasMore && /* @__PURE__ */ jsx("div", {
				className: "mt-6 text-center",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: () => setVisibleCount((v) => v + PAGE_SIZE),
					className: "inline-flex items-center gap-2 border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-card transition-colors",
					children: [
						/* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }),
						"Load More Comments (",
						topLevel.length - visibleCount,
						" remaining)"
					]
				})
			})
		]
	});
}
//#endregion
export { CommentsSection, CommentsSection as default };

//# sourceMappingURL=CommentsSection-B7wM1LOg.js.map