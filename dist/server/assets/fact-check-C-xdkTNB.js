import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BfzG-VT4.js";
import { a as useSiteSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { t as Footer } from "./Footer-CGCJ6p7l.js";
import { t as Header } from "./Header-B3gpV5PI.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Clipboard, ExternalLink, Globe, HelpCircle, Link as Link$1, Lock, RotateCcw, Search, ShieldCheck, Sparkles, XCircle } from "lucide-react";
//#region src/lib/fact-check.functions.ts
var checkNewsFactServer = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("a2ce65b73cdceb218f08412d4b04448d9996eaefcdb48ef0511661fe6b7d9c60"));
//#endregion
//#region src/components/site/FactCheckScanner.tsx
var SAMPLE_QUERIES = [
	"Government announces free laptops to all college students",
	"NASA confirms 3 days of total darkness across Earth",
	"Viral scheme claims ₹5000 credited under new national allowance"
];
function FactCheckScanner() {
	const [query, setQuery] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const [scanStep, setScanStep] = useState("");
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	const handleScan = async (searchQuery) => {
		const textToSearch = (searchQuery ?? query).trim();
		if (!textToSearch) {
			setError("Please paste a news article URL or type a headline/claim to verify.");
			return;
		}
		setError(null);
		setIsScanning(true);
		setResult(null);
		setScanStep(/^https?:\/\//i.test(textToSearch) ? "Extracting article title & OpenGraph metadata..." : "Querying Google Fact Check Tools API & international registries...");
		const steps = [
			"Cross-referencing accredited debunk registries (PIB, Boom Live, AFP)...",
			"Analyzing editorial ratings & linguistic credibility signals...",
			"Synthesizing investigative verdict & primary sources..."
		];
		let stepIdx = 0;
		const interval = setInterval(() => {
			if (stepIdx < steps.length) {
				setScanStep(steps[stepIdx]);
				stepIdx++;
			}
		}, 600);
		try {
			setResult(await checkNewsFactServer({ data: { query: textToSearch } }));
		} catch (err) {
			console.error("[FactCheckScanner] Error:", err);
			setError(err?.message || "Failed to scan news. Please check your connection and try again.");
		} finally {
			clearInterval(interval);
			setIsScanning(false);
			setScanStep("");
		}
	};
	const handlePasteClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				setQuery(text.trim());
				handleScan(text.trim());
			}
		} catch {
			setError("Could not read clipboard. Please paste directly into the box.");
		}
	};
	const handleReset = () => {
		setQuery("");
		setResult(null);
		setError(null);
	};
	const getVerdictBadge = (rating, type) => {
		switch (type) {
			case "false": return {
				bg: "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
				icon: XCircle,
				label: rating || "False / Debunked"
			};
			case "misleading": return {
				bg: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
				icon: AlertTriangle,
				label: rating || "Misleading / Missing Context"
			};
			case "true": return {
				bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
				icon: CheckCircle2,
				label: rating || "Verified True"
			};
			default: return {
				bg: "bg-slate-500/10 text-slate-700 border-slate-500/30 dark:bg-slate-800 dark:text-slate-300",
				icon: HelpCircle,
				label: rating || "Unverified / Varied"
			};
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card via-background to-card shadow-sm",
		children: [/* @__PURE__ */ jsx("div", {
			className: "border-b border-border bg-muted/40 px-5 py-4 sm:px-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background",
						children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-base font-bold text-foreground sm:text-lg",
						children: "Live News & Claim Fact-Check Scanner"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Powered by Google Fact Check Tools API & Accredited Global Fact-Checkers"
					})] })]
				}), /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs",
					children: [/* @__PURE__ */ jsx(Globe, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ jsx("span", { children: "Multi-Source Registry" })]
				})]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5 sm:p-7",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex flex-col gap-2 rounded-xl border border-border bg-background p-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-2xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-2 px-2 pt-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "mt-2 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ jsx("textarea", {
								value: query,
								onChange: (e) => {
									setQuery(e.target.value);
									if (error) setError(null);
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleScan();
									}
								},
								rows: 2,
								placeholder: "Paste news article URL (e.g. https://...) or type a headline/viral claim to scan...",
								className: "w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handlePasteClipboard,
								className: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition",
								children: [/* @__PURE__ */ jsx(Clipboard, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Paste from Clipboard" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [query && /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleReset,
									className: "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted transition",
									children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Clear" })]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleScan(),
									disabled: isScanning || !query.trim(),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90 disabled:opacity-50 shadow-2xs",
									children: isScanning ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" }), /* @__PURE__ */ jsx("span", { children: "Scanning..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Verify News" })] })
								})]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-foreground/80",
							children: "Try sample:"
						}), SAMPLE_QUERIES.map((sample, idx) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								setQuery(sample);
								handleScan(sample);
							},
							className: "rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground transition text-left",
							children: [
								"\"",
								sample.slice(0, 38),
								"...\""
							]
						}, idx))]
					})]
				}),
				error && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 shrink-0 text-red-600 dark:text-red-400" }), /* @__PURE__ */ jsx("span", { children: error })]
				}),
				isScanning && /* @__PURE__ */ jsxs("div", {
					className: "mt-6 rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 animate-pulse" })
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm font-semibold text-foreground",
							children: "Cross-referencing Global Fact-Checking Registries..."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: scanStep
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ jsx("div", { className: "h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-primary" })
						})
					]
				}),
				result && !isScanning && /* @__PURE__ */ jsxs("div", {
					className: "mt-6 space-y-4",
					children: [
						result.isUrl && /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-border bg-muted/30 p-4 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 font-semibold text-foreground",
									children: [
										/* @__PURE__ */ jsx(Link$1, { className: "h-3.5 w-3.5 text-primary" }),
										/* @__PURE__ */ jsx("span", { children: "Scanned Web Page:" }),
										result.sourceDomain && /* @__PURE__ */ jsx("span", {
											className: "rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground",
											children: result.sourceDomain
										})
									]
								}),
								result.extractedTitle && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm font-medium text-foreground",
									children: result.extractedTitle
								}),
								result.extractedDescription && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-muted-foreground line-clamp-2",
									children: result.extractedDescription
								})
							]
						}),
						result.claims && result.claims.length > 0 ? /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: [
										"Accredited Fact-Check Findings (",
										result.claims.length,
										")"
									]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Official Fact Check Registry"
								})]
							}), result.claims.map((item, idx) => {
								const badge = getVerdictBadge(item.review.rating, item.review.verdictType);
								const BadgeIcon = badge.icon;
								return /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-primary/40",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center justify-between gap-2.5 border-b border-border/60 pb-3.5",
											children: [/* @__PURE__ */ jsxs("div", {
												className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.bg}`,
												children: [/* @__PURE__ */ jsx(BadgeIcon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("span", { children: ["Rating: ", badge.label] })]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ jsx("span", {
													className: "font-semibold text-foreground",
													children: item.review.publisherName
												}), item.review.reviewDate && /* @__PURE__ */ jsxs("span", { children: [
													"·",
													" ",
													new Date(item.review.reviewDate).toLocaleDateString(void 0, {
														year: "numeric",
														month: "short",
														day: "numeric"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-3.5",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
													children: "Claim Checked"
												}),
												/* @__PURE__ */ jsxs("p", {
													className: "mt-1 text-sm font-medium text-foreground leading-relaxed",
													children: [
														"\"",
														item.text,
														"\""
													]
												}),
												item.claimant && /* @__PURE__ */ jsxs("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: [
														"Claimant:",
														" ",
														/* @__PURE__ */ jsx("span", {
															className: "font-medium text-foreground",
															children: item.claimant
														})
													]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 p-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "text-xs",
												children: [/* @__PURE__ */ jsx("p", {
													className: "font-semibold text-foreground",
													children: item.review.title
												}), /* @__PURE__ */ jsx("p", {
													className: "text-muted-foreground",
													children: "Investigated by accredited fact-checker"
												})]
											}), /* @__PURE__ */ jsxs("a", {
												href: item.review.reviewUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition",
												children: [/* @__PURE__ */ jsx("span", { children: "Read Full Debunk Report" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })]
											})]
										})
									]
								}, idx);
							})]
						}) : null,
						result.aiAnalysis && /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h3", {
											className: "text-sm font-bold text-foreground",
											children: "AI Credibility & Hoax Analysis"
										})]
									}), /* @__PURE__ */ jsxs("span", {
										className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
										children: [
											"Verdict: ",
											result.aiAnalysis.verdict,
											" (",
											result.aiAnalysis.confidence,
											"% confidence)"
										]
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-3 text-xs sm:text-sm leading-relaxed text-foreground/90",
									children: result.aiAnalysis.explanation
								}),
								result.aiAnalysis.riskFactors && result.aiAnalysis.riskFactors.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Risk / Credibility Indicators"
									}), /* @__PURE__ */ jsx("ul", {
										className: "mt-1 space-y-1 text-xs text-foreground/80",
										children: result.aiAnalysis.riskFactors.map((r, i) => /* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-primary",
												children: "•"
											}), /* @__PURE__ */ jsx("span", { children: r })]
										}, i))
									})]
								}),
								result.aiAnalysis.recommendation && /* @__PURE__ */ jsxs("p", {
									className: "mt-3 rounded-lg bg-background/80 p-2.5 text-xs text-muted-foreground border border-border/60",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Recommendation: "
									}), result.aiAnalysis.recommendation]
								})
							]
						}),
						result.claims.length === 0 && !result.aiAnalysis && /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl border border-border bg-muted/20 p-6 text-center",
							children: [
								/* @__PURE__ */ jsx(HelpCircle, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
								/* @__PURE__ */ jsx("h4", {
									className: "mt-2 text-sm font-bold text-foreground",
									children: "No Direct Debunk Match in Google Fact Check Registry"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground max-w-md mx-auto",
									children: "This specific headline or link has not yet been logged by accredited global fact-checkers. Please practice digital media literacy: verify with official press releases, government gazettes, and cross-reference multiple credible news outlets."
								})
							]
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/fact-check.tsx?tsr-split=component
function FactCheckPage() {
	if (!(useSiteSettings()?.licenseType || "").toLowerCase().includes("enterprise")) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
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
							children: "Enterprise Feature Locked"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "The Live News & Claim Fact-Check Scanner is exclusively available on Enterprise and Enterprise Plus licenses. Please ask your site administrator to upgrade their license to unlock this feature."
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
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-5xl px-4 py-10 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "mb-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-background shadow-xs",
									children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
									children: "Verification Desk"
								}), /* @__PURE__ */ jsx("h1", {
									className: "font-serif text-3xl font-bold leading-tight sm:text-4xl text-foreground",
									children: "Live Fact-Check Scanner"
								})] })]
							}), /* @__PURE__ */ jsxs(Link, {
								to: "/fact-checking-policy",
								className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-2xs",
								children: [
									/* @__PURE__ */ jsx(BookOpen, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ jsx("span", { children: "Read Our Fact-Checking Policy" }),
									/* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 opacity-60" })
								]
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground",
							children: "Paste any news article link or viral social claim below. Our automated scanner cross-references international accredited fact-check registries (such as PIB Fact Check, Boom Live, AFP, PolitiFact, and Snopes) and analyzes source credibility in real time."
						})]
					}),
					/* @__PURE__ */ jsx(FactCheckScanner, {}),
					/* @__PURE__ */ jsxs("section", {
						className: "mt-12 grid gap-6 md:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border bg-card/40 p-5 shadow-2xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3",
										children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Multi-Registry Verification"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
										children: "Every query is checked against certified fact-checking databases worldwide, ensuring investigations follow the International Fact-Checking Network (IFCN) code of principles."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border bg-card/40 p-5 shadow-2xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3",
										children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-foreground",
										children: "Transparent Primary Sources"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
										children: "We provide direct links to the official debunk articles, government gazettes, and archived records so you can verify the evidence yourself."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border bg-card/40 p-5 shadow-2xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3",
										children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-foreground",
										children: "AI Credibility Signals"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
										children: "For emerging breaking news not yet cataloged in official registries, our AI model evaluates linguistic sensationalism, phishing indicators, and domain trust."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "mt-10 rounded-2xl border border-border bg-gradient-to-r from-muted/50 to-muted/20 p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Learn about our Newsroom Fact-Checking Standards"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Read how our journalists verify sources, review corrections, and maintain non-partisan accuracy."
						})] }), /* @__PURE__ */ jsx(Link, {
							to: "/fact-checking-policy",
							className: "inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition",
							children: /* @__PURE__ */ jsx("span", { children: "Fact-Checking Policy →" })
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { FactCheckPage as component };
