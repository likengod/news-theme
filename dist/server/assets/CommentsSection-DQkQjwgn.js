import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { i as postArticleComment, r as getArticleComments } from "./comments.functions-BsFFeNpW.js";
import { t as authClient } from "./auth-client-DTMpFaPl.js";
import { i as trackComment } from "./user-actions-tracker-DJQ5cFC2.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
//#region src/components/site/CommentsSection.tsx
var SITE_NAME = "News Theme";
var MIN_CHARACTERS = 81;
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
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [draft, setDraft] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [userId, setUserId] = useState(null);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session?.user) setUserId(data.session.user.id);
		});
	}, []);
	const loadComments = async () => {
		try {
			setLoading(true);
			setComments((await getCommentsFn({ data: articleSlug })).map((r) => ({
				id: r.id,
				user: r.user,
				email: r.email,
				body: r.body,
				date: r.date
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
	const submit = async (e) => {
		e.preventDefault();
		const body = draft.trim();
		const authorName = name.trim();
		const authorEmail = email.trim();
		if (!body || !authorName || !authorEmail) {
			toast.error("Please fill in all fields (Name, Email, and Comment).");
			return;
		}
		if (containsLinkOrScript(body)) {
			toast(`YOU CAN'T POST THIS COMMENT, BECAUSE OUR ${SITE_NAME.toUpperCase()} DISABLED THIS FEATURE TO PROTECT FOR SCAMER SPAM AND PROMOTION.`);
			return;
		}
		if (body.length < MIN_CHARACTERS) {
			toast(`Please ${authorName}, your comment is too short — it must be at least ${MIN_CHARACTERS} characters (currently ${body.length} characters).`);
			return;
		}
		if (hasExcessiveWordRepetition(body)) {
			toast(`Please ${authorName}, your comment has been flagged. A single word cannot be repeated more than 5 times. Please submit a genuine comment.`);
			return;
		}
		try {
			setSubmitting(true);
			await postCommentFn({ data: {
				articleSlug,
				articleTitle,
				name: authorName,
				email: authorEmail,
				body
			} });
			if (userId) trackComment(userId, articleSlug);
			toast.success("Comment submitted! It is pending administrator approval before appearing here.");
			setDraft("");
			setName("");
			setEmail("");
			setShowForm(false);
		} catch (err) {
			toast.error(err.message || "Failed to submit comment");
		} finally {
			setSubmitting(false);
		}
	};
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
						comments.length,
						")"
					]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setShowForm((s) => !s),
					className: "bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 transition-opacity",
					children: showForm ? "Cancel" : "Post Comment"
				})]
			}),
			showForm && /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
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
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. John Doe",
							className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
							children: "Your Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "e.g. john@example.com",
							className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
						children: "Comment"
					}), /* @__PURE__ */ jsx("textarea", {
						required: true,
						value: draft,
						onChange: (e) => setDraft(e.target.value),
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
								draft.length,
								"/",
								MIN_CHARACTERS,
								" min characters (",
								draft.length,
								" total)"
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: submitting || !draft.trim() || !name.trim() || !email.trim(),
							className: "bg-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-40 transition-opacity inline-flex items-center gap-1.5",
							children: [submitting && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }), "Submit Comment"]
						})]
					})
				]
			}),
			loading ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center py-8 text-slate-400",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin mr-2" }), /* @__PURE__ */ jsx("span", {
					className: "text-sm",
					children: "Loading comments..."
				})]
			}) : /* @__PURE__ */ jsxs("ul", {
				className: "mt-6 space-y-5",
				children: [comments.map((c) => /* @__PURE__ */ jsxs("li", {
					className: "border-b border-border pb-4 last:border-0 last:pb-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-start justify-between gap-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "text-sm font-semibold text-foreground",
							children: [c.user, /* @__PURE__ */ jsxs("span", {
								className: "ml-2 text-xs font-normal text-muted-foreground inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 inline" }),
									" ",
									c.date
								]
							})]
						})
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
						children: c.body
					})]
				}, c.id)), comments.length === 0 && /* @__PURE__ */ jsx("li", {
					className: "py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card/50",
					children: "No approved comments yet. Be the first to comment!"
				})]
			})
		]
	});
}
//#endregion
export { CommentsSection, CommentsSection as default };
