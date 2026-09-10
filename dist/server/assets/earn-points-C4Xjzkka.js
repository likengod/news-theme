import { a as useSiteSettings } from "./AdSettingsContext-2890WKne.js";
import { t as authClient } from "./auth-client-k3X20UAX.js";
import { n as getUniqueReadsCount, r as getUniqueSharesCount, t as getUniqueCommentsCount } from "./user-actions-tracker-DJQ5cFC2.js";
import { t as Footer } from "./Footer-zejz-h2h.js";
import { t as Header } from "./Header-nuM3gkPY.js";
import { a as loadAllPendingClaims, l as loadRewards, r as getClaimsForUser, s as upsertClaim, t as loadSocialLinks } from "./social-links-Dr5AUDbc.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, BookOpen, Check, Clock, Coins, ExternalLink, Info, Lock, MessageCircle, Share2, UserPlus, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";
//#region src/components/earn-points/ProofModal.tsx
function ProofModal({ task, onSubmit, onClose }) {
	const [visited, setVisited] = useState(false);
	const [handle, setHandle] = useState("");
	const [agreed, setAgreed] = useState(false);
	const socialLinks = loadSocialLinks();
	const submit = () => {
		if (!visited) {
			toast.error(`Please visit and ${task.actionLabel.toLowerCase()} our ${task.platform} page first`);
			return;
		}
		if (handle.trim().length < 2) {
			toast.error("Please enter your handle/username");
			return;
		}
		if (!agreed) {
			toast.error("Please confirm the declaration");
			return;
		}
		onSubmit(handle.trim());
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-2xl bg-white shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 px-5 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(task.icon, {
						className: "h-5 w-5",
						style: { color: task.iconColor }
					}), /* @__PURE__ */ jsxs("h2", {
						className: "text-base font-bold text-slate-900",
						children: ["Submit proof for ", task.platform]
					})]
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-5 space-y-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: `rounded-xl border p-4 transition-all ${visited ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: `grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${visited ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`,
									children: visited ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : "1"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ jsxs("p", {
										className: "text-sm font-semibold text-slate-800",
										children: [
											"Visit ",
											task.platform,
											" & ",
											task.actionLabel
										]
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-slate-500",
										children: [
											"Open the page and actually ",
											task.actionLabel.toLowerCase(),
											" us"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: socialLinks[task.hrefKey] || "#",
									target: "_blank",
									rel: "noopener noreferrer",
									onClick: () => setVisited(true),
									className: `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${visited ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"}`,
									children: [
										visited && /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
										task.actionLabel,
										!visited && /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
									]
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `rounded-xl border p-4 transition-all ${!visited ? "opacity-50 pointer-events-none" : "border-slate-200"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 mb-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: `grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${handle.length > 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`,
									children: handle.length > 2 ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : "2"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-semibold text-slate-800",
									children: [
										"Enter your ",
										task.platform,
										" handle"
									]
								})]
							}),
							/* @__PURE__ */ jsx("label", {
								className: "mb-1.5 block text-xs text-slate-500",
								children: task.handleLabel
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: handle,
								onChange: (e) => setHandle(e.target.value),
								placeholder: task.handlePlaceholder,
								className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-[11px] text-slate-400",
								children: "Our team will verify this handle actually follows us within 24–48 hours."
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: `rounded-xl border p-4 transition-all ${!visited || handle.length < 2 ? "opacity-50 pointer-events-none" : "border-slate-200"}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: `grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold mt-0.5 ${agreed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`,
								children: agreed ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : "3"
							}), /* @__PURE__ */ jsxs("label", {
								className: "flex items-start gap-2 cursor-pointer",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: agreed,
									onChange: (e) => setAgreed(e.target.checked),
									className: "mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-xs text-slate-700",
									children: [
										"I confirm I have ",
										/* @__PURE__ */ jsxs("strong", { children: [task.actionLabel.toLowerCase(), "ed"] }),
										" the News Theme ",
										task.platform,
										" page using the account ",
										/* @__PURE__ */ jsx("strong", { children: handle || "provided above" }),
										". I understand that false claims will result in points being revoked and account suspension."
									]
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-700",
						children: [/* @__PURE__ */ jsx(Info, { className: "h-3.5 w-3.5 mt-0.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Points are credited after admin verification (24–48 hrs). Fake submissions will be permanently banned from the rewards program." })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 pt-1",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							onClick: submit,
							className: "flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700",
							children: "Submit for Review"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/earn-points/TaskCard.tsx
function TaskCard({ title, pointsLabel, icon, done, pending, progressText, claimable = true, onClaim, actionLabel = "Claim" }) {
	const isPending = pending?.status === "pending";
	const isRejected = pending?.status === "rejected";
	const isApproved = pending?.status === "approved";
	return /* @__PURE__ */ jsxs("div", {
		className: `flex items-center justify-between gap-3 rounded-xl border p-4 transition-all ${done || isApproved ? "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20" : isPending ? "border-amber-200 bg-amber-50/40" : isRejected ? "border-red-200 bg-red-50/40" : "border-border bg-card hover:shadow-sm"}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ jsx("span", {
				className: `grid h-10 w-10 shrink-0 place-items-center rounded-full ${done || isApproved ? "bg-emerald-600 text-white" : isPending ? "bg-amber-100 text-amber-700" : "bg-muted"}`,
				children: done || isApproved ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) : isPending ? /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5" }) : icon
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold truncate",
						children: title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-emerald-700 dark:text-emerald-400",
						children: pointsLabel
					}),
					isPending && /* @__PURE__ */ jsxs("p", {
						className: "text-[11px] text-amber-600 font-medium mt-0.5",
						children: ["⏳ Under review — submitted as ", /* @__PURE__ */ jsx("em", { children: pending.handle })]
					}),
					isRejected && /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-red-600 font-medium mt-0.5",
						children: "❌ Rejected — please resubmit with correct handle"
					}),
					progressText && !done && /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500",
						children: progressText
					})
				]
			})]
		}), done || isApproved ? /* @__PURE__ */ jsx("span", {
			className: "shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase text-emerald-700",
			children: "Claimed"
		}) : isPending ? /* @__PURE__ */ jsxs("span", {
			className: "shrink-0 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase text-amber-700 flex items-center gap-1",
			children: [/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }), " Pending"]
		}) : /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: onClaim,
			disabled: !claimable,
			className: `shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${claimable ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`,
			children: isRejected ? "Resubmit" : actionLabel
		})]
	});
}
function DailyTaskCard({ title, reward, cap, icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-2 flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700",
					children: icon
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold",
					children: title
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Reward"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm font-bold text-emerald-700",
				children: reward
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-1 text-[11px] uppercase tracking-wider text-muted-foreground",
				children: ["Cap: ", cap]
			})
		]
	});
}
//#endregion
//#region src/routes/earn-points.tsx?tsr-split=component
var SOCIAL_TASK_META = {
	fb: {
		platform: "Facebook",
		icon: FaFacebookF,
		iconColor: "#1877F2",
		actionLabel: "Follow",
		hrefKey: "facebook",
		handleLabel: "Your Facebook profile URL or username",
		handlePlaceholder: "https://facebook.com/yourname or @yourname"
	},
	yt: {
		platform: "YouTube",
		icon: FaYoutube,
		iconColor: "#FF0000",
		actionLabel: "Subscribe",
		hrefKey: "youtube",
		handleLabel: "Your YouTube channel URL or username",
		handlePlaceholder: "https://youtube.com/@yourhandle"
	},
	ig: {
		platform: "Instagram",
		icon: FaInstagram,
		iconColor: "#E4405F",
		actionLabel: "Follow",
		hrefKey: "instagram",
		handleLabel: "Your Instagram username",
		handlePlaceholder: "@yourinstagram"
	},
	wa: {
		platform: "WhatsApp",
		icon: FaWhatsapp,
		iconColor: "#25D366",
		actionLabel: "Join",
		hrefKey: "whatsapp",
		handleLabel: "Your WhatsApp number (for verification)",
		handlePlaceholder: "+91 98765 43210"
	}
};
var OTHER_TASK_ICONS = {
	signup: UserPlus,
	first_comments: MessageCircle,
	first_shares: Share2,
	first_reads: BookOpen
};
var DAILY_TASK_ICONS = {
	r_share: Share2,
	p_share: Share2,
	share_daily: Share2,
	r_comment: MessageCircle,
	p_comment: MessageCircle,
	comment_daily: MessageCircle
};
var STORAGE = "nt:earn-points:v1";
function loadState(userId) {
	if (typeof window === "undefined") return {
		completed: {},
		balance: 0
	};
	try {
		const raw = localStorage.getItem(`${STORAGE}:${userId}`);
		if (raw) return JSON.parse(raw);
	} catch {}
	return {
		completed: {},
		balance: 0
	};
}
function saveState(userId, state) {
	localStorage.setItem(`${STORAGE}:${userId}`, JSON.stringify(state));
	localStorage.setItem(`nt:points:${userId}`, String(state.balance));
}
function EarnPointsPage() {
	const settings = useSiteSettings();
	const isPremium = [
		"Enterprise",
		"Enterprise+",
		"Premium"
	].includes(settings.licenseType || "") || settings.licenseRole === "VIP";
	const [userId, setUserId] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [state, setState] = useState({
		completed: {},
		balance: 0
	});
	const [pendingClaims, setPendingClaims] = useState([]);
	const [shareCount, setShareCount] = useState(0);
	const [commentCount, setCommentCount] = useState(0);
	const [readCount, setReadCount] = useState(0);
	const [proofModal, setProofModal] = useState(null);
	const [socialTasks, setSocialTasks] = useState([]);
	const [otherTasks, setOtherTasks] = useState([]);
	const [dailyTasks, setDailyTasks] = useState([]);
	useEffect(() => {
		if (!isPremium) return;
		const groups = loadRewards();
		const allGroup = groups.find((g) => g.roleId === "all");
		const readerGroup = groups.find((g) => g.roleId === "reader");
		const socialIds = /* @__PURE__ */ new Set([
			"fb",
			"yt",
			"ig",
			"wa"
		]);
		const social = (allGroup?.oneTime ?? []).filter((t) => socialIds.has(t.id));
		const other = (allGroup?.oneTime ?? []).filter((t) => !socialIds.has(t.id));
		setSocialTasks(social);
		setOtherTasks(other);
		setDailyTasks(readerGroup?.recurring ?? []);
	}, []);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			const u = data.session?.user;
			if (u) {
				setUserId(u.id);
				setUserEmail(u.email ?? null);
				const loaded = loadState(u.id);
				const existing = Number(localStorage.getItem(`nt:points:${u.id}`) ?? "0");
				if (!loaded.balance && existing) loaded.balance = existing;
				if (!loaded.completed.signup) {
					const signupTask = otherTasks.find((t) => t.id === "signup") ?? socialTasks.find((t) => t.id === "signup");
					loaded.completed.signup = true;
					loaded.balance += signupTask?.points ?? 25;
				}
				saveState(u.id, loaded);
				setState({ ...loaded });
				setPendingClaims(getClaimsForUser(u.id));
				setShareCount(getUniqueSharesCount(u.id));
				setCommentCount(getUniqueCommentsCount(u.id));
				setReadCount(getUniqueReadsCount(u.id));
				const userClaims = loadAllPendingClaims().filter((c) => c.userId === u.id);
				let changed = false;
				const updatedState = { ...loaded };
				userClaims.forEach((c) => {
					if (c.status === "approved" && !updatedState.completed[c.id]) {
						updatedState.completed[c.id] = true;
						updatedState.balance += c.points;
						changed = true;
					}
				});
				if (changed) {
					saveState(u.id, updatedState);
					setState(updatedState);
				}
			}
		});
	}, [socialTasks, otherTasks]);
	const getPending = (taskId) => pendingClaims.find((c) => c.id === taskId);
	const submitSocialProof = (task, handle) => {
		if (!userId || !userEmail) return;
		upsertClaim({
			id: task.id,
			userId,
			userName: userEmail,
			platform: task.platform,
			handle,
			submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
			status: "pending",
			points: task.points
		});
		setPendingClaims(getClaimsForUser(userId));
		setProofModal(null);
		toast.success(`Submitted! Our team will verify your ${task.platform} follow within 24–48 hours.`);
	};
	const claimOther = (task) => {
		if (!userId) {
			toast.error("Please sign in to claim points");
			return;
		}
		if (state.completed[task.id]) {
			toast.info("Already claimed");
			return;
		}
		if (task.id === "first_shares" && shareCount < 5) {
			toast.error(`Share 5 unique articles first. You have ${shareCount} so far.`);
			return;
		}
		if (task.id === "first_comments" && commentCount < 5) {
			toast.error(`Comment on 5 unique articles first. You have ${commentCount} so far.`);
			return;
		}
		if (task.id === "first_reads" && readCount < 5) {
			toast.error(`Read 5 unique articles first. You have ${readCount} so far.`);
			return;
		}
		const next = {
			completed: {
				...state.completed,
				[task.id]: true
			},
			balance: state.balance + task.points
		};
		saveState(userId, next);
		setState(next);
		toast.success(`+${task.points} points added!`);
	};
	const totalAvailable = [...socialTasks, ...otherTasks].reduce((s, t) => s + t.points, 0);
	const getProgress = (id) => {
		if (id === "first_shares") return {
			text: `${shareCount}/5 articles shared`,
			ok: shareCount >= 5
		};
		if (id === "first_comments") return {
			text: `${commentCount}/5 articles commented`,
			ok: commentCount >= 5
		};
		if (id === "first_reads") return {
			text: `${readCount}/5 articles read`,
			ok: readCount >= 5
		};
		return {
			text: "",
			ok: true
		};
	};
	if (!isPremium) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 flex items-center justify-center p-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-8 w-8 text-muted-foreground" })
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-6 text-xl font-bold text-card-foreground",
							children: "Feature Locked"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "The Wallet and Rewards system is exclusively available on Premium, Enterprise, and Enterprise+ licenses. Please upgrade your license to unlock this feature."
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "mt-6 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800",
							children: "Return Home"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
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
						className: "mb-8",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
								children: "Wallet Rewards"
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-2 font-serif text-4xl font-bold leading-tight",
								children: "Earn Points"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 max-w-2xl text-sm text-muted-foreground",
								children: "Complete tasks to grow your News Theme wallet. Social media points are credited after admin verification."
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "mb-10 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/40 dark:to-background",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white",
									children: /* @__PURE__ */ jsx(Wallet, { className: "h-6 w-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-xs uppercase tracking-widest text-muted-foreground",
										children: "Wallet balance"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-3xl font-bold text-emerald-700 dark:text-emerald-400",
										children: ["₹", state.balance]
									}),
									userEmail && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: userEmail
									})
								] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-end gap-2 text-right text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", { children: "Total one-time rewards available" }), /* @__PURE__ */ jsxs("p", {
									className: "text-lg font-semibold text-foreground",
									children: ["₹", totalAvailable]
								})] }), /* @__PURE__ */ jsx(Link, {
									to: "/withdraw-points",
									className: "rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700",
									children: "Withdraw Points →"
								})]
							})]
						}), !userId && /* @__PURE__ */ jsxs("div", {
							className: "mt-4 rounded-lg border border-dashed border-emerald-300 bg-white/60 p-3 text-sm",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/auth",
								className: "font-semibold text-emerald-700 underline-offset-2 hover:underline",
								children: "Sign in"
							}), " to start earning."]
						})]
					}),
					socialTasks.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "mb-10",
						children: [
							/* @__PURE__ */ jsxs("h2", {
								className: "mb-1 flex items-center gap-2 text-xl font-bold",
								children: [/* @__PURE__ */ jsx(Coins, { className: "h-5 w-5 text-amber-500" }), " Social Media Tasks"]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mb-4 text-xs text-slate-500",
								children: "Points credited after admin verifies your follow. Our team checks within 24–48 hours."
							}),
							/* @__PURE__ */ jsx("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: socialTasks.map((task) => {
									const meta = SOCIAL_TASK_META[task.id];
									if (!meta) return null;
									const pending = getPending(task.id);
									const Icon = meta.icon;
									return /* @__PURE__ */ jsx(TaskCard, {
										title: task.title,
										pointsLabel: `+${task.points} points`,
										icon: /* @__PURE__ */ jsx(Icon, {
											className: "h-5 w-5",
											style: { color: meta.iconColor }
										}),
										done: !!state.completed[task.id],
										pending,
										onClaim: () => {
											if (!userId) {
												toast.error("Sign in to earn points");
												return;
											}
											setProofModal({
												...meta,
												id: task.id,
												title: task.title,
												points: task.points
											});
										},
										actionLabel: `${meta.actionLabel} & Claim`
									}, task.id);
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800",
								children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", { children: "Why pending verification?" }), " Social platforms do not allow websites to verify follows automatically. Our admins manually check your submitted handle within 24–48 hours."] })]
							})
						]
					}),
					otherTasks.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "mb-12",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "mb-4 flex items-center gap-2 text-xl font-bold",
							children: [/* @__PURE__ */ jsx(Coins, { className: "h-5 w-5 text-amber-500" }), " One-time Tasks"]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: otherTasks.map((task) => {
								const Icon = OTHER_TASK_ICONS[task.id] ?? BookOpen;
								const progress = getProgress(task.id);
								return /* @__PURE__ */ jsx(TaskCard, {
									title: task.title,
									pointsLabel: `+${task.points} points`,
									icon: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
									done: !!state.completed[task.id],
									progressText: progress.text,
									claimable: progress.ok,
									onClaim: () => claimOther(task)
								}, task.id);
							})
						})]
					}),
					dailyTasks.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "mb-12",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "mb-4 flex items-center gap-2 text-xl font-bold",
							children: [/* @__PURE__ */ jsx(Coins, { className: "h-5 w-5 text-amber-500" }), " Every Day Rewards"]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: dailyTasks.map((t) => {
								const Icon = DAILY_TASK_ICONS[t.id] ?? Share2;
								return /* @__PURE__ */ jsx(DailyTaskCard, {
									title: t.title,
									reward: t.reward,
									cap: t.cap,
									icon: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
								}, t.id);
							})
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-xl border border-border bg-muted/30 p-5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx("p", {
							className: "mb-1 font-semibold text-foreground",
							children: "How social verification works"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc space-y-1 pl-5",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									"Click ",
									/* @__PURE__ */ jsx("strong", { children: "Follow & Claim" }),
									" → our page opens + a proof form appears"
								] }),
								/* @__PURE__ */ jsx("li", { children: "Enter your handle/username and confirm you followed" }),
								/* @__PURE__ */ jsxs("li", { children: ["Our admin team checks your handle within ", /* @__PURE__ */ jsx("strong", { children: "24–48 hours" })] }),
								/* @__PURE__ */ jsx("li", { children: "Points are credited after approval — you'll see them in your wallet" }),
								/* @__PURE__ */ jsx("li", { children: "Fake submissions permanently ban you from the rewards program" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			proofModal && /* @__PURE__ */ jsx(ProofModal, {
				task: proofModal,
				onSubmit: (handle) => submitSocialProof(proofModal, handle),
				onClose: () => setProofModal(null)
			})
		]
	});
}
//#endregion
export { EarnPointsPage as component };
