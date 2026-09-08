import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { n as changeMyPassword, o as updateCurrentUserProfile, r as getCurrentUserProfile, t as authClient } from "./auth-client-OWjZWPR5.js";
import { t as Footer } from "./Footer-Bm6dwnfc.js";
import { t as Header } from "./Header-wdu8y5RN.js";
import { s as submitDeleteAccountRequest } from "./inbox.functions-DRYC-S2T.js";
import { i as rankForCount, n as loadRanks, r as nextRank } from "./journalist-ranks-2GE3s0bq.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Award, Building2, Check, ChevronRight, Crown, Eye, EyeOff, Loader2, Lock, Phone, Save, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/profile.tsx?tsr-split=component
var ROLE_LABEL = {
	admin: "Admin",
	editor: "Editor",
	author: "Senior Journalist",
	journalist: "Journalist",
	premium: "Premium Member",
	reader: "Reader"
};
var ROLE_COLOR = {
	admin: "bg-red-100 text-red-700 ring-red-200",
	editor: "bg-purple-100 text-purple-700 ring-purple-200",
	author: "bg-sky-100 text-sky-700 ring-sky-200",
	journalist: "bg-blue-100 text-blue-700 ring-blue-200",
	premium: "bg-amber-100 text-amber-700 ring-amber-200",
	reader: "bg-slate-100 text-slate-600 ring-slate-200"
};
var RANK_COLOR = {
	bronze: "text-amber-700 bg-amber-50 ring-amber-200",
	silver: "text-slate-600 bg-slate-100 ring-slate-200",
	gold: "text-yellow-700 bg-yellow-50 ring-yellow-200",
	diamond: "text-sky-700 bg-sky-50 ring-sky-200"
};
function ProfilePage() {
	const navigate = useNavigate();
	const getProfile = useServerFn(getCurrentUserProfile);
	const doChangePassword = useServerFn(changeMyPassword);
	const doUpdateProfile = useServerFn(updateCurrentUserProfile);
	const doDeleteRequest = useServerFn(submitDeleteAccountRequest);
	const [tab, setTab] = useState("overview");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [profile, setProfile] = useState(null);
	const [roles, setRoles] = useState([]);
	const [points, setPoints] = useState(0);
	const [token, setToken] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [bankName, setBankName] = useState("");
	const [bankAccountName, setBankAccountName] = useState("");
	const [bankAccountNo, setBankAccountNo] = useState("");
	const [bankIfsc, setBankIfsc] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState("");
	const [deleteRequested, setDeleteRequested] = useState(false);
	const [ranks] = useState(() => loadRanks());
	useEffect(() => {
		authClient.auth.getSession().then(async ({ data }) => {
			if (!data.session?.user) {
				navigate({ to: "/auth" });
				return;
			}
			setToken(data.session.access_token);
			const uid = data.session.user.id;
			const stored = localStorage.getItem(`nt:points:${uid}`);
			setPoints(stored !== null ? Number(stored) : 0);
			try {
				const res = await getProfile({ data: data.session.access_token });
				setProfile(res.profile);
				setRoles(res.roles);
				setPhone(res.profile.phone ?? "");
				setBankName(res.profile.bank_name ?? "");
				setBankAccountName(res.profile.bank_account_name ?? "");
				setBankAccountNo(res.profile.bank_account_no ?? "");
				setBankIfsc(res.profile.bank_ifsc ?? "");
				setDeleteRequested(!!res.profile.delete_requested);
			} catch {
				toast.error("Could not load profile");
			} finally {
				setLoading(false);
			}
		});
	}, []);
	const isJournalist = roles.some((r) => [
		"journalist",
		"author",
		"editor",
		"admin"
	].includes(r));
	const isPremium = roles.includes("premium");
	const articlesPublished = Number(profile?.articles_published ?? 0);
	const currentRank = rankForCount(articlesPublished, ranks);
	const nextRankObj = nextRank(articlesPublished, ranks);
	const progressPct = nextRankObj ? Math.min(100, Math.round((articlesPublished - (currentRank?.minNews ?? 0)) / (nextRankObj.minNews - (currentRank?.minNews ?? 0)) * 100)) : 100;
	async function handleChangePassword(e) {
		e.preventDefault();
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		setSaving(true);
		try {
			await doChangePassword({ data: { password } });
			toast.success("Password changed! Other sessions have been signed out.");
			setPassword("");
			setConfirmPassword("");
		} catch (err) {
			toast.error(err?.message ?? "Failed to change password");
		} finally {
			setSaving(false);
		}
	}
	async function handleSavePhone(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await doUpdateProfile({ data: { phone } });
			toast.success("Phone number updated!");
		} catch (err) {
			toast.error(err?.message ?? "Failed to update phone");
		} finally {
			setSaving(false);
		}
	}
	async function handleSaveBank(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await doUpdateProfile({ data: {
				bank_name: bankName,
				bank_account_name: bankAccountName,
				bank_account_no: bankAccountNo,
				bank_ifsc: bankIfsc
			} });
			toast.success("Bank account details saved!");
		} catch (err) {
			toast.error(err?.message ?? "Failed to save bank details");
		} finally {
			setSaving(false);
		}
	}
	async function handleDeleteRequest(e) {
		e.preventDefault();
		if (deleteConfirm !== "DELETE") {
			toast.error("Type \"DELETE\" to confirm");
			return;
		}
		setSaving(true);
		try {
			await doDeleteRequest({ data: {} });
			setDeleteRequested(true);
			toast.success("Deletion request submitted. Our team will review it within 48 hours.");
		} catch (err) {
			toast.error(err?.message ?? "Failed to submit deletion request");
		} finally {
			setSaving(false);
		}
	}
	const navItems = [
		{
			key: "overview",
			label: "Overview",
			icon: User
		},
		{
			key: "password",
			label: "Change Password",
			icon: Lock
		},
		...isJournalist ? [{
			key: "phone",
			label: "Phone Number",
			icon: Phone
		}, {
			key: "bank",
			label: "Bank Account",
			icon: Building2
		}] : [],
		{
			key: "delete",
			label: "Delete Account",
			icon: Trash2
		}
	];
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-slate-50 flex items-center justify-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-slate-400" })
	});
	const name = profile?.display_name ?? "Account";
	const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
	const primaryRole = roles[0] ?? "reader";
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-10 sm:px-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-slate-900",
						children: "My Profile"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-slate-500 mt-0.5",
						children: "Manage your account settings and preferences"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-6 lg:grid-cols-[240px_1fr]",
					children: [/* @__PURE__ */ jsxs("aside", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center text-center gap-2",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-2xl font-bold text-white shadow",
										children: initials
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-semibold text-slate-900",
										children: name
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500 truncate max-w-[160px]",
										children: profile?.email ?? ""
									})] }),
									/* @__PURE__ */ jsxs("span", {
										className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${ROLE_COLOR[primaryRole] ?? ROLE_COLOR.reader}`,
										children: [isPremium && /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), ROLE_LABEL[primaryRole] ?? primaryRole]
									}),
									/* @__PURE__ */ jsxs(Link, {
										to: "/earn-points",
										className: "mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors",
										children: [
											/* @__PURE__ */ jsxs("span", { children: ["₹", points] }),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs font-normal text-emerald-600",
												children: "Wallet"
											}),
											/* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
										]
									}),
									!isPremium && /* @__PURE__ */ jsxs(Link, {
										to: "/subscription",
										className: "mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors",
										children: [/* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), "Upgrade to Premium"]
									})
								]
							})
						}), /* @__PURE__ */ jsx("nav", {
							className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
							children: navItems.map(({ key, label, icon: Icon }) => /* @__PURE__ */ jsxs("button", {
								onClick: () => setTab(key),
								className: `flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-medium transition-colors last:border-b-0 ${tab === key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"} ${key === "delete" && tab !== "delete" ? "text-red-600 hover:bg-red-50" : ""}`,
								children: [
									/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 flex-shrink-0" }),
									label,
									tab === key && /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-3.5 w-3.5" })
								]
							}, key))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
						children: [
							tab === "overview" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "border-b border-slate-100 bg-slate-50 px-6 py-4",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-bold text-slate-900",
									children: "Account Overview"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: "Your membership summary and status"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-6 space-y-6",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "rounded-lg border border-slate-100 p-4",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
													children: "Account Type"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-2 flex items-center gap-2",
													children: [isPremium ? /* @__PURE__ */ jsx(Crown, { className: "h-5 w-5 text-amber-500" }) : /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-slate-400" }), /* @__PURE__ */ jsx("span", {
														className: "text-lg font-bold text-slate-900",
														children: isPremium ? "Premium" : "Free"
													})]
												}),
												!isPremium && /* @__PURE__ */ jsxs(Link, {
													to: "/subscription",
													className: "mt-3 inline-flex items-center gap-1 text-xs text-amber-600 hover:underline font-medium",
													children: [/* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), " Upgrade now"]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "rounded-lg border border-slate-100 p-4",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
													children: "Wallet Balance"
												}),
												/* @__PURE__ */ jsx("div", {
													className: "mt-2 flex items-center gap-2",
													children: /* @__PURE__ */ jsxs("span", {
														className: "text-2xl font-bold text-emerald-600",
														children: ["₹", points]
													})
												}),
												/* @__PURE__ */ jsx(Link, {
													to: "/withdraw-points",
													className: "mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium",
													children: "Withdraw points →"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
										children: "Roles"
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: roles.map((r) => /* @__PURE__ */ jsx("span", {
											className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${ROLE_COLOR[r] ?? ROLE_COLOR.reader}`,
											children: ROLE_LABEL[r] ?? r
										}, r))
									})] }),
									isJournalist && /* @__PURE__ */ jsxs("div", {
										className: "rounded-lg border border-blue-100 bg-blue-50 p-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 mb-3",
											children: [/* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-blue-600" }), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-bold text-blue-900",
												children: "Journalist Rank"
											})]
										}), currentRank ? /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: `rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${RANK_COLOR[currentRank.id] ?? RANK_COLOR.bronze}`,
													children: currentRank.name
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-xs text-slate-500",
													children: [articlesPublished, " articles published"]
												})]
											}),
											nextRankObj && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
												className: "h-2 w-full rounded-full bg-blue-100 overflow-hidden",
												children: /* @__PURE__ */ jsx("div", {
													className: "h-2 rounded-full bg-blue-500 transition-all",
													style: { width: `${progressPct}%` }
												})
											}), /* @__PURE__ */ jsxs("p", {
												className: "mt-1.5 text-xs text-blue-700",
												children: [
													nextRankObj.minNews - articlesPublished,
													" more articles to reach ",
													/* @__PURE__ */ jsx("strong", { children: nextRankObj.name })
												]
											})] }),
											/* @__PURE__ */ jsxs("p", {
												className: "mt-2 text-xs text-slate-500",
												children: [
													"Earning ",
													/* @__PURE__ */ jsxs("strong", { children: [currentRank.pointsPerNews, " pts"] }),
													" per published article at this rank"
												]
											})
										] }) : /* @__PURE__ */ jsxs("p", {
											className: "text-sm text-slate-600",
											children: [
												"Publish ",
												/* @__PURE__ */ jsx("strong", { children: ranks[0]?.minNews ?? 100 }),
												" articles to earn your first rank badge.",
												/* @__PURE__ */ jsx("br", {}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-xs text-slate-400",
													children: [articlesPublished, " published so far"]
												})
											]
										})]
									}),
									isJournalist && profile?.journalist_id && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
										children: "Journalist ID"
									}), /* @__PURE__ */ jsx("code", {
										className: "mt-1 block font-mono text-slate-800 text-sm font-semibold tracking-widest",
										children: profile.journalist_id
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-slate-400",
										children: "Member Since"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-sm font-medium text-slate-700",
										children: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", {
											day: "2-digit",
											month: "long",
											year: "numeric"
										}) : "—"
									})] })
								]
							})] }),
							tab === "password" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "border-b border-slate-100 bg-slate-50 px-6 py-4",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-bold text-slate-900",
									children: "Change Password"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: "Your other active sessions will be signed out automatically"
								})]
							}), /* @__PURE__ */ jsxs("form", {
								onSubmit: handleChangePassword,
								className: "p-6 space-y-5 max-w-md",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1.5 block text-sm font-medium text-slate-700",
										children: "New Password"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("input", {
											type: showPassword ? "text" : "password",
											autoComplete: "new-password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "Minimum 8 characters",
											className: "w-full rounded-lg border border-slate-200 py-2.5 pl-4 pr-10 text-sm focus:border-slate-900 focus:outline-none"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setShowPassword((v) => !v),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
											children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1.5 block text-sm font-medium text-slate-700",
										children: "Confirm New Password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										autoComplete: "new-password",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										placeholder: "Repeat new password",
										className: "w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
									})] }),
									confirmPassword && password !== confirmPassword && /* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-1.5 text-xs text-red-600",
										children: [/* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }), " Passwords do not match"]
									}),
									confirmPassword && password === confirmPassword && password.length >= 8 && /* @__PURE__ */ jsxs("p", {
										className: "flex items-center gap-1.5 text-xs text-emerald-600",
										children: [/* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }), " Passwords match"]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: saving || password.length < 8 || password !== confirmPassword,
										className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors",
										children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save Password"]
									})
								]
							})] }),
							tab === "phone" && isJournalist && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "border-b border-slate-100 bg-slate-50 px-6 py-4",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-bold text-slate-900",
									children: "Phone Number"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: "Used on your press credential card"
								})]
							}), /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSavePhone,
								className: "p-6 space-y-5 max-w-md",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1.5 block text-sm font-medium text-slate-700",
									children: "Phone Number"
								}), /* @__PURE__ */ jsx("input", {
									type: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "+91 98765 43210",
									className: "w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
								})] }), /* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: saving,
									className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors",
									children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save Phone"]
								})]
							})] }),
							tab === "bank" && isJournalist && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "border-b border-slate-100 bg-slate-50 px-6 py-4",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-bold text-slate-900",
									children: "Bank Account Details"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: "Used to process earnings withdrawals. Only visible to admins."
								})]
							}), /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSaveBank,
								className: "p-6 space-y-5 max-w-md",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5 mt-0.5 flex-shrink-0" }), "Your bank details are encrypted and only visible to authorised admins for payout purposes."]
									}),
									[
										{
											label: "Bank Name",
											value: bankName,
											set: setBankName,
											placeholder: "e.g. State Bank of India"
										},
										{
											label: "Account Holder Name",
											value: bankAccountName,
											set: setBankAccountName,
											placeholder: "Full name as on bank account"
										},
										{
											label: "Account Number",
											value: bankAccountNo,
											set: setBankAccountNo,
											placeholder: "e.g. 1234567890"
										},
										{
											label: "IFSC Code",
											value: bankIfsc,
											set: setBankIfsc,
											placeholder: "e.g. SBIN0001234"
										}
									].map(({ label, value, set, placeholder }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1.5 block text-sm font-medium text-slate-700",
										children: label
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value,
										onChange: (e) => set(e.target.value),
										placeholder,
										className: "w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
									})] }, label)),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: saving,
										className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors",
										children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save Bank Details"]
									})
								]
							})] }),
							tab === "delete" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "border-b border-red-100 bg-red-50 px-6 py-4",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base font-bold text-red-900",
									children: "Delete Account"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-red-700 mt-0.5",
									children: "This submits a deletion request to our team. It cannot be undone."
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "p-6",
								children: deleteRequested ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-semibold text-amber-900",
										children: "Deletion request submitted"
									}), /* @__PURE__ */ jsxs("p", {
										className: "mt-1 text-sm text-amber-800",
										children: [
											"Our team will review your request and delete your account within 48 hours. If you have any questions, email ",
											/* @__PURE__ */ jsx("a", {
												href: "mailto:support@northeasttimeline.com",
												className: "underline",
												children: "support@northeasttimeline.com"
											}),
											"."
										]
									})] })]
								}) : /* @__PURE__ */ jsxs("form", {
									onSubmit: handleDeleteRequest,
									className: "max-w-md space-y-5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "rounded-lg border border-red-200 bg-red-50 p-4 space-y-2",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-sm font-semibold text-red-900",
												children: "What happens when you delete your account:"
											}), /* @__PURE__ */ jsxs("ul", {
												className: "space-y-1 text-sm text-red-800 list-disc pl-4",
												children: [
													/* @__PURE__ */ jsx("li", { children: "Your profile and personal data will be permanently removed" }),
													/* @__PURE__ */ jsx("li", { children: "Your wallet balance will be forfeited" }),
													/* @__PURE__ */ jsx("li", { children: "Your published articles will be retained under an anonymous byline" }),
													/* @__PURE__ */ jsx("li", { children: "This action cannot be undone" })
												]
											})]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
											className: "mb-1.5 block text-sm font-medium text-slate-700",
											children: [
												"Type ",
												/* @__PURE__ */ jsx("strong", {
													className: "font-mono",
													children: "DELETE"
												}),
												" to confirm"
											]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: deleteConfirm,
											onChange: (e) => setDeleteConfirm(e.target.value),
											placeholder: "DELETE",
											className: "w-full rounded-lg border border-red-200 py-2.5 px-4 text-sm focus:border-red-500 focus:outline-none"
										})] }),
										/* @__PURE__ */ jsxs("button", {
											type: "submit",
											disabled: saving || deleteConfirm !== "DELETE",
											className: "inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors",
											children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), "Request Account Deletion"]
										})
									]
								})
							})] })
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ProfilePage as component };
