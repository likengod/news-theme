import { a as useSiteSettings } from "./AdSettingsContext-PNuhIbgF.js";
import { t as authClient } from "./auth-client-CXXVHNf9.js";
import { t as Footer } from "./Footer-BbyMDuKi.js";
import { t as Header } from "./Header-BmP2gCQ6.js";
import { c as submitEventRegistration } from "./inbox.functions-Cs5wCo2s.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Award, Calendar, CheckCircle2, Flame, Loader2, Lock, MapPin, Send, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/event.tsx?tsr-split=component
function EventPage() {
	const s = useSiteSettings();
	const [userId, setUserId] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [customField, setCustomField] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				const u = data.session.user;
				setUserId(u.id);
				setUserEmail(u.email ?? null);
				const dName = u.user_metadata?.display_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "User";
				setUserDisplayName(dName);
				setName(dName);
			}
		}).finally(() => setAuthLoading(false));
	}, []);
	const eventTitle = s.eventTitle || "শারদ সম্মান ২০২৬";
	const eventSubtitle = s.eventSubtitle || "সেরা দুর্গোৎসব মূল্যায়ন ও শারদ সম্মাননা প্রতিযোগিতা";
	const eventDesc = s.eventDescription || "আসন্ন শারদোৎসবে ত্রিপুরার ঐতিহ্যবাহী ও সর্বজনীন দুর্গাপূজা কমিটি এবং ক্লাবগুলোর জন্য বিশেষ শারদ সম্মান প্রতিযোগিতা। শ্রেষ্ঠ মণ্ডপসজ্জা, প্রতিমা নির্মাণ, আলোকসজ্জা ও পরিবেশবান্ধব ভাবনার ওপর ভিত্তি করে প্রদান করা হবে বিশেষ পুরস্কার ও স্মারক সম্মাননা।";
	const eventDate = s.eventDate || "শারদীয়া দুর্গাপূজা ২০২৬ (মহা পঞ্চমী থেকে বিজয়া দশমী)";
	const eventLocation = s.eventLocation || "ত্রিপুরা ও সংলগ্ন অঞ্চল";
	const customLabel = s.eventCustomInputLabel || "ক্লাবের নাম / Club Name";
	const buttonText = s.eventButtonText || "নিবন্ধন করুন";
	const isButtonEnabled = s.eventButtonEnabled !== false;
	const isFormEnabled = s.eventFormEnabled !== false;
	const prizeList = (s.eventPrizes || "১ম স্থান: ৫০,০০০ টাকা ও বিশেষ শারদ স্মারক\n২য় স্থান: ৩০,০০০ টাকা ও রৌপ্য স্মারক\n৩য় স্থান: ২০,০০০ টাকা ও সম্মাননা পত্র\nবিশেষ বিভাগ: সেরা আলোকসজ্জা, সেরা প্রতিমা ও সেরা শৃঙ্খলা পুরস্কার").split("\n").map((p) => p.trim()).filter(Boolean);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!userId) {
			toast.error("ইভেন্টে যোগ দিতে অনুগ্রহ করে প্রথমে লগইন করুন।");
			return;
		}
		if (!name.trim() || !phone.trim() || !address.trim()) {
			toast.error("দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
			return;
		}
		try {
			setSubmitting(true);
			await submitEventRegistration({ data: {
				name: name.trim(),
				email: userEmail || "",
				phone: phone.trim(),
				address: address.trim(),
				customField: customField.trim(),
				customFieldLabel: customLabel,
				eventName: eventTitle
			} });
			setSubmitted(true);
			toast.success("আপনার নিবন্ধন সফলভাবে জমা হয়েছে!");
		} catch (err) {
			toast.error(err.message || "নিবন্ধন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FFFDF9] text-[#141414] dark:bg-[#0c0c0e] dark:text-[#ededed]",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-8 md:py-12",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "relative overflow-hidden rounded-2xl border-2 border-[#E5A93C]/40 bg-gradient-to-b from-[#FFF5E6] via-[#FFF9F0] to-[#FFFDF9] p-6 text-center shadow-lg dark:from-[#241708] dark:via-[#1a1208] dark:to-[#0c0c0e] dark:border-[#92400e]/50 md:p-12",
						children: [
							/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-600/10" }),
							/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-red-500/20 blur-2xl dark:bg-red-700/10" }),
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 dark:border-amber-500/30 mb-4",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ jsx("span", { children: "শুভ শারদীয়া দুর্গোৎসব প্রতিযোগিতা" })]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-serif text-3xl font-extrabold tracking-tight text-[#991b1b] dark:text-[#f87171] sm:text-4xl md:text-5xl",
								children: eventTitle
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mx-auto mt-2 max-w-2xl text-sm font-medium text-amber-900/90 dark:text-amber-200/90 sm:text-base",
								children: eventSubtitle
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#44403c] dark:text-[#d6d3d1]",
								children: eventDesc
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#78350f] dark:text-[#fde68a]",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/50 px-3 py-1.5 border border-amber-300/60 dark:border-amber-800/60",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ jsx("span", { children: eventDate })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 rounded-lg bg-red-100/70 dark:bg-red-950/50 px-3 py-1.5 border border-red-300/60 dark:border-red-800/60",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-red-600 dark:text-red-400" }), /* @__PURE__ */ jsx("span", { children: eventLocation })]
								})]
							}),
							isButtonEnabled && isFormEnabled && /* @__PURE__ */ jsx("div", {
								className: "mt-6",
								children: /* @__PURE__ */ jsxs("a", {
									href: "#register",
									className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b91c1c] to-[#c2410c] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:from-[#991b1b] hover:to-[#9a3412] hover:shadow-lg transition-all",
									children: [/* @__PURE__ */ jsx(Flame, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: buttonText })]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[#991b1b] dark:text-[#f87171] mb-2 font-bold text-sm",
									children: [/* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "পুরস্কার ও সম্মাননা" })]
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-1.5 text-xs text-[#57534e] dark:text-[#a8a29e]",
									children: prizeList.map((prize, idx) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-1.5 leading-snug",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-amber-500 font-bold",
											children: "•"
										}), /* @__PURE__ */ jsx("span", { children: prize })]
									}, idx))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2 font-bold text-sm",
									children: [/* @__PURE__ */ jsx(Award, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "মূল্যায়নের মূল ভিত্তি" })]
								}), /* @__PURE__ */ jsxs("ul", {
									className: "space-y-1.5 text-xs text-[#57534e] dark:text-[#a8a29e]",
									children: [
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-1.5 leading-snug",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold",
												children: "•"
											}), /* @__PURE__ */ jsx("span", { children: "ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-1.5 leading-snug",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold",
												children: "•"
											}), /* @__PURE__ */ jsx("span", { children: "স্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-1.5 leading-snug",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold",
												children: "•"
											}), /* @__PURE__ */ jsx("span", { children: "পরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-1.5 leading-snug",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold",
												children: "•"
											}), /* @__PURE__ */ jsx("span", { children: "শৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs sm:col-span-2 md:col-span-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2 font-bold text-sm",
										children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "অংশগ্রহণকারী নির্দেশিকা" })]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-[#57534e] dark:text-[#a8a29e] leading-relaxed",
										children: "ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায় অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "অংশগ্রহণ সম্পূর্ণ বিনামূল্যে" })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("section", {
						id: "register",
						className: "mt-10 scroll-mt-10",
						children: /* @__PURE__ */ jsxs("div", {
							className: "overflow-hidden rounded-2xl border border-amber-300/80 bg-white dark:bg-[#141417] dark:border-zinc-800 shadow-md",
							children: [/* @__PURE__ */ jsx("div", {
								className: "bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-6 py-4 text-white",
								children: /* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
										className: "text-base font-bold sm:text-lg flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Flame, { className: "h-5 w-5 text-amber-300" }), /* @__PURE__ */ jsx("span", { children: "ইভেন্ট নিবন্ধন ফরম (Event Registration)" })]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-xs text-amber-100",
										children: "শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য জমা দিন"
									})] })
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "p-6 md:p-8",
								children: !isFormEnabled ? /* @__PURE__ */ jsxs("div", {
									className: "py-8 text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
											children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "mt-3 text-sm font-bold text-slate-900 dark:text-slate-100",
											children: "অনলাইন নিবন্ধন আপাতত বন্ধ রয়েছে"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs text-slate-500",
											children: "শারদ সম্মান প্রতিযোগিতার নিবন্ধন সাময়িকভাবে স্থগিত বা সম্পন্ন হয়েছে।"
										})
									]
								}) : submitted ? /* @__PURE__ */ jsxs("div", {
									className: "py-8 text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
											children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "mt-3 text-base font-bold text-slate-900 dark:text-slate-100",
											children: "ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mx-auto mt-2 max-w-md text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
											children: "আপনার ক্লাবের নাম ও আবেদনপত্র অ্যাডমিন ইনবক্সে জমা হয়েছে। আমাদের শারদ সম্মান টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => {
												setSubmitted(false);
												setPhone("");
												setAddress("");
												setCustomField("");
											},
											className: "mt-4 rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300",
											children: "আরেকটি নিবন্ধন করুন"
										})
									]
								}) : !userId ? /* @__PURE__ */ jsxs("div", {
									className: "py-6 text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
											children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "mt-3 text-sm font-bold text-slate-900 dark:text-slate-100",
											children: "নিবন্ধন করতে লগইন করা আবশ্যক"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400",
											children: "শুধুমাত্র নিবন্ধিত ও লগইন করা ব্যবহারকারীগণ শারদ সম্মানে নিজেদের ক্লাবের নাম অন্তর্ভুক্ত করতে পারবেন।"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-4",
											children: /* @__PURE__ */ jsxs(Link, {
												to: "/auth",
												search: { redirect: "/event" },
												className: "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-5 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition-opacity",
												children: [/* @__PURE__ */ jsx("span", { children: "লগইন / সাইন আপ করুন" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })]
											})
										})
									]
								}) : /* @__PURE__ */ jsxs("form", {
									onSubmit: handleSubmit,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-200",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ jsxs("span", { children: [
													"লগইন করা আছেন: ",
													/* @__PURE__ */ jsx("strong", { children: userDisplayName || "User" }),
													" (",
													userEmail,
													")"
												] })]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider",
												children: "Verified User"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
												children: ["আপনার নাম (Full Name) ", /* @__PURE__ */ jsx("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												required: true,
												value: name,
												onChange: (e) => setName(e.target.value),
												placeholder: "আপনার পুরো নাম লিখুন",
												className: "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
											})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
												children: ["ফোন নম্বর (Phone Number) ", /* @__PURE__ */ jsx("span", {
													className: "text-red-500",
													children: "*"
												})]
											}), /* @__PURE__ */ jsx("input", {
												type: "tel",
												required: true,
												value: phone,
												onChange: (e) => setPhone(e.target.value),
												placeholder: "যেমন: +91 98765 43210",
												className: "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
											})] })]
										}),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("label", {
												className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
												children: [
													customLabel,
													" ",
													/* @__PURE__ */ jsx("span", {
														className: "text-red-500",
														children: "*"
													})
												]
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												required: true,
												value: customField,
												onChange: (e) => setCustomField(e.target.value),
												placeholder: "যেমন: ভারত রত্ন সংঘ / মিলন সংঘ / ইত্যাদি",
												className: "w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[11px] text-slate-500",
												children: "আপনার পূজা কমিটি বা ক্লাবের আনুষ্ঠানিক নাম উল্লেখ করুন।"
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
											className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1",
											children: ["পূজামণ্ডপ / ক্লাবের পূর্ণ ঠিকানা (Address) ", /* @__PURE__ */ jsx("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											required: true,
											rows: 3,
											value: address,
											onChange: (e) => setAddress(e.target.value),
											placeholder: "রাস্তা, এলাকা, পাড়া, পিনকোড ও জেলা উল্লেখ করুন...",
											className: "w-full rounded-lg border border-slate-300 bg-background p-3 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
										})] }),
										isButtonEnabled ? /* @__PURE__ */ jsx("div", {
											className: "pt-2",
											children: /* @__PURE__ */ jsx("button", {
												type: "submit",
												disabled: submitting,
												className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow hover:from-[#7f1d1d] hover:to-[#9a3412] disabled:opacity-50 transition-all sm:w-auto",
												children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "জমা দেওয়া হচ্ছে..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: buttonText })] })
											})
										}) : /* @__PURE__ */ jsx("div", {
											className: "rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200",
											children: "নিবন্ধন বাটনটি বর্তমানে নিষ্ক্রিয় রাখা হয়েছে।"
										})
									]
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { EventPage as component };

//# sourceMappingURL=event-B2wNnkCG.js.map