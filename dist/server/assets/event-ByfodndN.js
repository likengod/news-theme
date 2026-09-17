import { a as useSiteSettings } from "./AdSettingsContext-CToAjqf3.js";
import { t as authClient } from "./auth-client-Cmm6fxwS.js";
import { t as Footer } from "./Footer-Dlq3f3nd.js";
import { t as Header } from "./Header-BMkaALjf.js";
import { l as submitEventRegistration } from "./inbox.functions-BtGqtmMr.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Award, Calendar, CheckCircle2, Flame, Loader2, Lock, MapPin, Send, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/event.tsx?tsr-split=component
/** Symmetrical Festive Flourish Divider */
function FestiveDivider({ title = "॥ শুভ শারদীয়া ॥" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-3 py-8",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-amber-700 dark:text-amber-300 font-serif font-bold text-xs sm:text-sm tracking-wider",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-red-600 dark:text-red-400",
						children: "✦"
					}),
					/* @__PURE__ */ jsx("span", { children: title }),
					/* @__PURE__ */ jsx("span", {
						className: "text-red-600 dark:text-red-400",
						children: "✦"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" })
		]
	});
}
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
	const eventImageUrl = s.eventImageUrl || "/durga-face.png";
	const isButtonEnabled = s.eventButtonEnabled !== false;
	const isFormEnabled = s.eventFormEnabled !== false;
	const eventGreeting = s.eventGreeting || "॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥";
	const eventSection1Divider = s.eventSection1Divider || "॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥";
	const eventPrizesTitle = s.eventPrizesTitle || "পুরস্কার ও সম্মাননা";
	const eventCriteriaTitle = s.eventCriteriaTitle || "মূল্যায়নের মূল ভিত্তি";
	const criteriaList = (s.eventCriteria || "ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা\nস্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব\nপরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা\nশৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা").split("\n").map((c) => c.trim()).filter(Boolean);
	const eventGuidelinesTitle = s.eventGuidelinesTitle || "অংশগ্রহণকারী নির্দেশিকা";
	const eventGuidelinesText = s.eventGuidelinesText || "ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায় অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।";
	const eventGuidelinesBadge = s.eventGuidelinesBadge || "অংশগ্রহণ সম্পূর্ণ বিনামূল্যে";
	const eventSection2Divider = s.eventSection2Divider || "॥ শারদ সম্মান আবেদন পত্র ॥";
	const eventFormTitle = s.eventFormTitle || "ইভেন্ট নিবন্ধন ফরম (Event Registration)";
	const eventFormSubtitle = s.eventFormSubtitle || "শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন";
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
		className: "min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFFDF9] text-[#1a1a1a] dark:from-[#0d0c0a] dark:via-[#16120b] dark:to-[#0d0c0a] dark:text-[#f3f3f3] flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-8 md:py-14 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "relative text-center py-6 md:py-10",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-amber-400/20 via-red-500/10 to-transparent blur-3xl -z-10 dark:from-amber-600/15 dark:via-red-900/10",
								"aria-hidden": "true"
							}),
							eventImageUrl && /* @__PURE__ */ jsx("div", {
								className: "mx-auto mb-4 flex justify-center",
								children: /* @__PURE__ */ jsx("img", {
									src: eventImageUrl,
									alt: eventTitle,
									className: "h-28 sm:h-36 md:h-44 w-auto object-contain select-none"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-red-500/15 to-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-serif font-bold text-amber-900 dark:text-amber-200 mb-4 tracking-wide shadow-xs",
								children: [
									/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400" }),
									/* @__PURE__ */ jsx("span", { children: eventGreeting }),
									/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400" })
								]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-serif text-3xl font-black tracking-tight text-red-800 dark:text-red-400 sm:text-5xl md:text-6xl drop-shadow-xs",
								children: eventTitle
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mx-auto mt-3 max-w-2xl text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200",
								children: eventSubtitle
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300",
								children: eventDesc
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-full bg-amber-50 border border-amber-300/80 px-4 py-2 text-amber-950 dark:bg-[#20180b] dark:border-amber-700/60 dark:text-amber-200 shadow-xs",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: eventDate })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-full bg-red-50 border border-red-300/80 px-4 py-2 text-red-950 dark:bg-[#230f0f] dark:border-red-800/60 dark:text-red-200 shadow-xs",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-red-600 dark:text-red-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: eventLocation })]
								})]
							}),
							isButtonEnabled && isFormEnabled && /* @__PURE__ */ jsx("div", {
								className: "mt-8",
								children: /* @__PURE__ */ jsxs("a", {
									href: "#register",
									className: "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-red-700 via-crimson-600 to-amber-600 px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-700/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/30 border border-amber-300/40",
									children: [/* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-amber-200 transition-transform group-hover:rotate-12" }), /* @__PURE__ */ jsx("span", { children: buttonText })]
								})
							})
						]
					}),
					/* @__PURE__ */ jsx(FestiveDivider, { title: eventSection1Divider }),
					/* @__PURE__ */ jsx("section", {
						className: "py-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid gap-8 sm:grid-cols-2 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-300/40 dark:divide-amber-800/40",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "pt-6 md:pt-0 md:px-6 first:pl-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5 text-red-800 dark:text-red-400 mb-3 font-serif font-bold text-base",
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-300/60 dark:border-red-800/60",
											children: /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" })
										}), /* @__PURE__ */ jsx("span", { children: eventPrizesTitle })]
									}), /* @__PURE__ */ jsx("ul", {
										className: "space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300",
										children: prizeList.map((prize, idx) => /* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-2 leading-relaxed",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold text-sm leading-none mt-0.5",
												children: "✦"
											}), /* @__PURE__ */ jsx("span", { children: prize })]
										}, idx))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-6 md:pt-0 md:px-6",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5 text-amber-800 dark:text-amber-300 mb-3 font-serif font-bold text-base",
										children: [/* @__PURE__ */ jsx("div", {
											className: "flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60",
											children: /* @__PURE__ */ jsx(Award, { className: "h-4 w-4" })
										}), /* @__PURE__ */ jsx("span", { children: eventCriteriaTitle })]
									}), /* @__PURE__ */ jsx("ul", {
										className: "space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300",
										children: criteriaList.map((criterion, idx) => /* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-2 leading-relaxed",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-amber-500 font-bold text-sm leading-none mt-0.5",
												children: "✦"
											}), /* @__PURE__ */ jsx("span", { children: criterion })]
										}, idx))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-6 md:pt-0 md:px-6 last:pr-0 sm:col-span-2 md:col-span-1",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5 text-amber-900 dark:text-amber-200 mb-3 font-serif font-bold text-base",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60",
												children: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
											}), /* @__PURE__ */ jsx("span", { children: eventGuidelinesTitle })]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed",
											children: eventGuidelinesText
										}),
										eventGuidelinesBadge && /* @__PURE__ */ jsxs("div", {
											className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-300/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300",
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: eventGuidelinesBadge })]
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(FestiveDivider, { title: eventSection2Divider }),
					/* @__PURE__ */ jsxs("section", {
						id: "register",
						className: "relative scroll-mt-10 my-10 max-w-2xl mx-auto px-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center mb-8",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300",
									children: /* @__PURE__ */ jsx(Flame, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "font-serif text-2xl sm:text-3xl font-bold text-red-800 dark:text-red-400",
									children: eventFormTitle
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300",
									children: eventFormSubtitle
								})
							]
						}), !isFormEnabled ? /* @__PURE__ */ jsxs("div", {
							className: "py-8 text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
									children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-3 text-sm font-bold text-stone-900 dark:text-stone-100",
									children: "অনলাইন নিবন্ধন আপাতত বন্ধ রয়েছে"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-stone-500",
									children: "শারদ সম্মান প্রতিযোগিতার নিবন্ধন সাময়িকভাবে স্থগিত বা সম্পন্ন হয়েছে।"
								})
							]
						}) : submitted ? /* @__PURE__ */ jsxs("div", {
							className: "py-8 text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
									children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-4 font-serif text-lg font-bold text-stone-900 dark:text-stone-100",
									children: "ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mx-auto mt-2 max-w-md text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed",
									children: "আপনার ক্লাবের নাম ও আবেদনপত্র অ্যাডমিন ইনবক্সে জমা হয়েছে। আমাদের শারদ সম্মান টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setSubmitted(false);
										setPhone("");
										setAddress("");
										setCustomField("");
									},
									className: "mt-6 rounded-full border border-amber-400 px-6 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 dark:border-amber-700 dark:text-amber-200 transition-colors",
									children: "আরেকটি নিবন্ধন জমা দিন"
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
									className: "mt-3 font-serif text-base font-bold text-stone-900 dark:text-stone-100",
									children: "নিবন্ধন করতে লগইন করা আবশ্যক"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mx-auto mt-1 max-w-md text-xs text-stone-600 dark:text-stone-400",
									children: "শুধুমাত্র নিবন্ধিত ও লগইন করা ব্যবহারকারীগণ শারদ সম্মানে নিজেদের ক্লাবের নাম অন্তর্ভুক্ত করতে পারবেন।"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-5",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/auth",
										search: { redirect: "/event" },
										className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-amber-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:from-red-800 hover:to-amber-800 transition-all",
										children: [/* @__PURE__ */ jsx("span", { children: "লগইন / সাইন আপ করুন" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
									})
								})
							]
						}) : /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							className: "space-y-5 max-w-2xl mx-auto",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 px-4 py-2.5 text-xs text-amber-950 dark:text-amber-200",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
											"লগইন আছেন: ",
											/* @__PURE__ */ jsx("strong", { children: userDisplayName || "User" }),
											" (",
											userEmail,
											")"
										] })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-md",
										children: "Verified"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5",
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
										className: "w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5",
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
										className: "w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5",
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
										className: "w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-stone-500 dark:text-stone-400",
										children: "আপনার পূজা কমিটি বা ক্লাবের আনুষ্ঠানিক নাম উল্লেখ করুন।"
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5",
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
									className: "w-full rounded-xl border border-amber-300/70 bg-white/90 p-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
								})] }),
								isButtonEnabled ? /* @__PURE__ */ jsx("div", {
									className: "pt-3 text-center",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: submitting,
										className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 via-crimson-600 to-amber-600 px-10 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-700/25 hover:from-red-800 hover:to-amber-700 disabled:opacity-50 transition-all border border-amber-300/40",
										children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "জমা দেওয়া হচ্ছে..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: buttonText })] })
									})
								}) : /* @__PURE__ */ jsx("div", {
									className: "rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 text-center",
									children: "নিবন্ধন বাটনটি বর্তমানে নিষ্ক্রিয় রাখা হয়েছে।"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { EventPage as component };

//# sourceMappingURL=event-ByfodndN.js.map