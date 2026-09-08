import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { i as lookupJournalist } from "./journalist.functions-BBYDzftl.js";
import { t as Footer } from "./Footer-pKaQMZDG.js";
import { n as loadAuthorized } from "./authorized-settings-C6PPe013.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BadgeCheck, Loader2, Search, ShieldCheck, ShieldOff, User, XCircle } from "lucide-react";
//#region src/routes/verified-journalist.tsx?tsr-split=component
var ROLE_LABEL = {
	admin: "Editor-in-Chief",
	editor: "Senior Editor",
	author: "Senior Journalist",
	journalist: "Journalist",
	premium: "Premium Reader",
	reader: "Reader"
};
function VerifiedPage() {
	const lookup = useServerFn(lookupJournalist);
	const [uid, setUid] = useState("");
	const [busy, setBusy] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	const [notFound, setNotFound] = useState(false);
	const doLookup = async (searchId) => {
		const target = searchId.trim();
		if (!target) return;
		setError(null);
		setResult(null);
		setNotFound(false);
		setBusy(true);
		try {
			const r = await lookup({ data: { publicUserId: target } });
			if (r.found === false) setNotFound(true);
			else setResult(r);
		} catch (err) {
			setError(err?.message ?? "Lookup failed");
		} finally {
			setBusy(false);
		}
	};
	const onSubmit = (e) => {
		e.preventDefault();
		doLookup(uid);
	};
	useEffect(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		const paramId = params.get("id") || params.get("uid");
		if (paramId) {
			const cleanId = paramId.trim();
			setUid(cleanId);
			doLookup(cleanId);
		}
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-gradient-to-b from-slate-50 to-white",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "mx-auto max-w-3xl px-5 pt-16 pb-10 text-center",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }), " Trust Center"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl",
						children: "Verify a Journalist"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-3 text-base text-slate-600",
						children: [
							"Enter a reporter's ",
							/* @__PURE__ */ jsx("strong", { children: "Journalist ID" }),
							" (e.g. ",
							/* @__PURE__ */ jsx("code", {
								className: "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs",
								children: "ABC1234Z"
							}),
							") or their 10-digit ",
							/* @__PURE__ */ jsx("strong", { children: "User ID" }),
							" to view their official press card."
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mx-auto max-w-xl px-5 pb-8",
				children: [/* @__PURE__ */ jsxs("form", {
					onSubmit,
					className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "uid",
						className: "block text-xs font-semibold uppercase tracking-wider text-slate-500",
						children: "Journalist ID or User ID"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
								id: "uid",
								maxLength: 16,
								placeholder: "ABC1234Z or 1234567890",
								value: uid,
								onChange: (e) => setUid(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16)),
								className: "w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 font-mono text-base tracking-widest focus:border-slate-900 focus:outline-none"
							})]
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: busy || uid.trim().length < 3,
							className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40",
							children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }), "Verify"]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-6",
					children: [
						error && /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800",
							children: [/* @__PURE__ */ jsx(XCircle, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: error })]
						}),
						notFound && /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center",
							children: [
								/* @__PURE__ */ jsx(XCircle, { className: "mx-auto h-8 w-8 text-amber-600" }),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 font-semibold text-amber-900",
									children: "Journalist data not found"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-amber-800",
									children: "This ID does not belong to us. Please double-check the number, or contact our office to confirm the reporter's credentials."
								}),
								/* @__PURE__ */ jsx("a", {
									href: "mailto:trust@northeasttimeline.com",
									className: "mt-3 inline-block text-sm font-semibold text-amber-900 underline",
									children: "trust@northeasttimeline.com"
								})
							]
						}),
						result && result.found && /* @__PURE__ */ jsx(PressCard, { data: result })
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "mx-auto max-w-3xl px-5 pb-16",
				children: /* @__PURE__ */ jsxs("p", {
					className: "text-center text-xs text-slate-500",
					children: [
						"Spotted a fake byline? Email",
						" ",
						/* @__PURE__ */ jsx("a", {
							className: "underline",
							href: "mailto:trust@northeasttimeline.com",
							children: "trust@northeasttimeline.com"
						}),
						" ",
						"— we investigate within 48 hours."
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function PressCard({ data }) {
	const [auth, setAuth] = useState(loadAuthorized());
	useEffect(() => {
		setAuth(loadAuthorized());
	}, []);
	data.active;
	const roleLabel = ROLE_LABEL[data.role] ?? "Journalist";
	const name = (data.displayName ?? "News Theme Reporter").toUpperCase();
	const isSuspended = !data.active;
	const defaultValid = new Date(new Date(data.memberSince).getTime() + 3 * 365 * 24 * 60 * 60 * 1e3).toLocaleDateString(void 0, {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
	const validStr = isSuspended ? "SUSPENDED" : data.validTill || defaultValid;
	if (!data.verified) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ jsx(User, { className: "mt-0.5 h-5 w-5 shrink-0 text-slate-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
			className: "font-semibold text-slate-900",
			children: [data.displayName ?? "This account", " is not an accredited journalist"]
		}), /* @__PURE__ */ jsxs("p", {
			className: "mt-1 text-sm text-slate-600",
			children: [
				"The account exists on News Theme (role:",
				" ",
				/* @__PURE__ */ jsx("span", {
					className: "font-medium",
					children: roleLabel
				}),
				") but is not authorised to publish under a verified byline."
			]
		})] })]
	});
	const journalistId = data.journalistId ?? `NT-${data.publicUserId}`;
	const origin = typeof window !== "undefined" ? window.location.origin : "https://northeasttimeline.com";
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/verified-journalist?id=${journalistId}`)}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative shrink-0 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200",
			style: {
				width: 326,
				height: 520
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-y-0 right-0 z-30 flex w-[50px] items-center justify-center bg-red-600",
					children: /* @__PURE__ */ jsx("span", {
						className: "rotate-180 text-[32px] font-black leading-none tracking-[0.45em] text-white [writing-mode:vertical-rl]",
						children: "PRESS"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 top-0 z-0 bg-red-600",
					style: {
						width: 276,
						height: 130
					},
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 bg-[#1a2040]",
						style: { clipPath: "polygon(0 0, 74% 0, 38% 100%, 0 76%)" }
					}), /* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 bg-red-600",
						style: { clipPath: "polygon(0 58%, 0 100%, 32% 100%)" }
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 flex items-center gap-2 px-3.5 pt-3.5",
					style: { width: 220 },
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#34c759]/40 bg-[#34c759]/20 backdrop-blur-sm",
						children: /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4.5 w-4.5 text-[#34c759]" })
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[10px] font-extrabold leading-tight tracking-wide text-white",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-red-300",
								children: "NORTHEAST"
							}),
							/* @__PURE__ */ jsx("br", {}),
							"TIMELINE"
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute z-10 bg-white",
					style: {
						width: 132,
						height: 110,
						left: 138,
						top: 58,
						transform: "translateX(-50%)",
						clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)"
					}
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute z-20",
					style: {
						left: 138,
						top: 74,
						transform: "translateX(-50%)"
					},
					children: data.avatarUrl ? /* @__PURE__ */ jsx("img", {
						src: data.avatarUrl,
						alt: `Official press photo of accredited journalist ${name}`,
						loading: "eager",
						fetchPriority: "high",
						decoding: "async",
						className: "h-[80px] w-[80px] rounded-xl border-[3px] border-white object-cover shadow-md"
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid h-[80px] w-[80px] place-items-center rounded-xl border-[3px] border-white bg-slate-100 text-2xl font-bold text-slate-500 shadow-md",
						children: name.slice(0, 2)
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 right-[50px] z-10 text-center",
					style: { top: 168 },
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "px-4 text-[15px] font-black uppercase tracking-wide text-slate-900 leading-tight",
							children: name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-1.5 flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-red-600 px-2.5 py-[2px] text-[9px] font-bold uppercase tracking-widest text-white",
								children: roleLabel
							}), isSuspended ? /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-2 py-[2px] text-[9px] font-extrabold text-red-700 shadow-xs",
								children: [/* @__PURE__ */ jsx(ShieldOff, { className: "h-3.5 w-3.5 text-red-600" }), " Suspended"]
							}) : /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1 rounded-md border border-[#34c759]/50 bg-[#34c759]/15 px-2 py-[2px] text-[9px] font-extrabold text-[#1f7032] shadow-xs",
								children: [/* @__PURE__ */ jsx(BadgeCheck, { className: "h-3.5 w-3.5 text-[#34c759]" }), " Verified"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mx-3.5 mt-3 space-y-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-[1fr_auto_1fr] items-start",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "py-1 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8.5px] font-bold text-slate-900",
												children: "Department:"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[8.5px] text-slate-600",
												children: "News & Reporting"
											})]
										}),
										/* @__PURE__ */ jsx("div", { className: "mx-1 self-stretch border-l border-dashed border-red-400" }),
										/* @__PURE__ */ jsxs("div", {
											className: "py-1 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8.5px] font-bold text-slate-900",
												children: "Press ID No.:"
											}), /* @__PURE__ */ jsx("p", {
												className: "font-mono text-[8.5px] font-bold text-slate-800",
												children: journalistId
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-red-400" }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "py-1 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8px] font-bold text-slate-900",
												children: "Valid Till:"
											}), /* @__PURE__ */ jsx("p", {
												className: `text-[8px] font-bold ${isSuspended ? "text-red-600 font-black uppercase" : "text-slate-600"}`,
												children: validStr
											})]
										}),
										/* @__PURE__ */ jsx("div", { className: "mx-0.5 self-stretch border-l border-dashed border-red-400" }),
										/* @__PURE__ */ jsxs("div", {
											className: "py-1 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8px] font-bold text-slate-900",
												children: "Blood Group:"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[8px] font-bold text-red-600",
												children: data.bloodGroup || "—"
											})]
										}),
										/* @__PURE__ */ jsx("div", { className: "mx-0.5 self-stretch border-l border-dashed border-red-400" }),
										/* @__PURE__ */ jsxs("div", {
											className: "py-1 text-center",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[8px] font-bold text-slate-900",
												children: "DOB:"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[8px] text-slate-600",
												children: data.dob || "—"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-red-400" }),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-0.5 text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[8.5px] font-bold text-slate-900",
										children: "Address & Location:"
									}), (() => {
										const street = data.address || auth.officeAddress;
										const stateStr = data.state || auth.officeState || "Tripura";
										const countryStr = data.country || auth.officeCountry || "India";
										const pinStr = data.pinCode || auth.officePin;
										const parts = [];
										if (street) parts.push(street);
										if (stateStr) parts.push(stateStr);
										if (countryStr) parts.push(countryStr);
										const fullLoc = `${parts.join(", ")}${pinStr ? ` - ${pinStr}` : ""}`;
										let sizeCls = "text-[8px] leading-tight";
										if (fullLoc.length > 65) sizeCls = "text-[7px] leading-none line-clamp-2";
										else if (fullLoc.length > 40) sizeCls = "text-[7.5px] leading-tight line-clamp-2";
										return /* @__PURE__ */ jsx("p", {
											className: `mx-auto max-w-[215px] font-medium text-slate-700 ${sizeCls}`,
											children: fullLoc
										});
									})()]
								}),
								isSuspended && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-red-400" }), /* @__PURE__ */ jsx("div", {
									className: "pt-1 text-center",
									children: /* @__PURE__ */ jsxs("p", {
										className: "text-[11px] font-black uppercase tracking-wide leading-tight",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-900",
											children: "THIS JOURNALIST IS "
										}), /* @__PURE__ */ jsx("span", {
											className: "text-red-600",
											children: "SUSPENDED"
										})]
									})
								})] })
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute bottom-1.5 z-20 flex items-center justify-center gap-3",
					style: {
						left: 0,
						right: 50
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-right text-[8.5px] font-extrabold uppercase tracking-tight leading-tight",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-red-600",
							children: "Scan QR Code"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[8px] font-bold text-slate-700",
							children: "To Verify Journalist"
						})]
					}), /* @__PURE__ */ jsx("img", {
						src: qrUrl,
						alt: `QR Code for verifying journalist ${name}`,
						loading: "eager",
						decoding: "async",
						className: "h-[76px] w-[76px] shrink-0 rounded-lg bg-white p-1 shadow-md ring-1 ring-slate-200"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute bottom-0 left-0 z-10 bg-red-600",
					style: {
						width: 80,
						height: 50,
						clipPath: "polygon(0 45%, 65% 100%, 0 100%)"
					}
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute bottom-0 z-10 bg-[#1a2040]",
					style: {
						right: 50,
						width: 80,
						height: 50,
						clipPath: "polygon(35% 100%, 100% 45%, 100% 100%)"
					}
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative shrink-0 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200",
			style: {
				width: 326,
				height: 520
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "relative overflow-hidden",
					style: { height: 78 },
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 bg-[#1a2040]",
							style: { clipPath: "polygon(0 0, 58% 0, 38% 100%, 0 100%)" }
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 bg-red-600",
							style: { clipPath: "polygon(42% 0, 100% 0, 100% 100%, 62% 100%)" }
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 bg-[#252a45]/70",
							style: { clipPath: "polygon(46% 0, 58% 0, 42% 100%, 30% 100%)" }
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "px-4 pt-2.5 pb-0 flex items-center justify-start",
					children: /* @__PURE__ */ jsx("span", {
						className: "inline-block rounded-md bg-red-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs",
						children: "OFFICE DETAILS"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "px-4 pt-2 pb-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-[1fr_auto_1fr] items-center",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "Phone:"
									}), /* @__PURE__ */ jsx("p", {
										className: `mt-0.5 truncate text-slate-600 ${(auth.officePhone || data.phone || "").length > 15 ? "text-[8.5px]" : "text-[10px]"}`,
										children: auth.officePhone || data.phone || "—"
									})]
								}),
								/* @__PURE__ */ jsx("div", { className: "mx-1 self-stretch border-l border-dashed border-red-300" }),
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "Email:"
									}), /* @__PURE__ */ jsx("p", {
										className: `mt-0.5 truncate text-slate-600 ${(auth.officeEmail || data.email || "").length > 22 ? "text-[8.5px]" : "text-[10px]"}`,
										children: auth.officeEmail || data.email || "—"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-red-300" }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-[1fr_auto_1fr] items-center",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "Website:"
									}), /* @__PURE__ */ jsx("p", {
										className: `mt-0.5 truncate text-slate-600 ${(auth.officeWebsite || "northeasttimeline.com").length > 22 ? "text-[8.5px]" : "text-[10px]"}`,
										children: auth.officeWebsite || "northeasttimeline.com"
									})]
								}),
								/* @__PURE__ */ jsx("div", { className: "mx-1 self-stretch border-l border-dashed border-red-300" }),
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "Address:"
									}), (() => {
										const addr = auth.officeAddress || data.address || "College Road, Kailasahar";
										let fontCls = "text-[10px] leading-tight";
										if (addr.length > 50) fontCls = "text-[8px] leading-none line-clamp-2";
										else if (addr.length > 25) fontCls = "text-[8.5px] leading-tight line-clamp-2";
										return /* @__PURE__ */ jsx("p", {
											className: `mt-0.5 text-slate-600 ${fontCls}`,
											children: addr
										});
									})()]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", { className: "border-t border-dashed border-red-300" }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-[1fr_auto_1fr] items-center",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "State & Country:"
									}), (() => {
										const locationStr = `${auth.officeState || data.state || "Tripura"}, ${auth.officeCountry || data.country || "India"}`;
										return /* @__PURE__ */ jsx("p", {
											className: `mt-0.5 truncate text-slate-600 ${locationStr.length > 20 ? "text-[8.5px]" : "text-[10px]"}`,
											children: locationStr
										});
									})()]
								}),
								/* @__PURE__ */ jsx("div", { className: "mx-1 self-stretch border-l border-dashed border-red-300" }),
								/* @__PURE__ */ jsxs("div", {
									className: "py-1 text-center px-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-900",
										children: "PIN / ZIP Code:"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 font-mono text-[10px] text-slate-700 font-semibold",
										children: auth.officePin || data.pinCode || "799277"
									})]
								})
							]
						})
					]
				}),
				(() => {
					const noteText = auth.cardNote || "This card certifies that the bearer is an authorized journalist of News Theme. If found, please return to the above address.";
					const disclaimerText = auth.cardDisclaimer || "Tampering or misuse of this card is a punishable offense.";
					const totalLength = noteText.length + disclaimerText.length;
					const lineBreaks = (noteText.match(/\n/g) || []).length + (disclaimerText.match(/\n/g) || []).length;
					let sizeCls = "text-[10px] leading-snug";
					if (totalLength > 220 || lineBreaks >= 4) sizeCls = "text-[8px] leading-tight";
					else if (totalLength > 140 || lineBreaks >= 2) sizeCls = "text-[9px] leading-tight";
					return /* @__PURE__ */ jsxs("div", {
						className: `px-5 pb-3 text-slate-600 ${sizeCls}`,
						children: [/* @__PURE__ */ jsxs("p", {
							className: "whitespace-pre-line",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-bold text-red-600",
									children: "– Note:"
								}),
								/* @__PURE__ */ jsx("br", {}),
								noteText
							]
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-2 whitespace-pre-line",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-bold text-red-600",
									children: "– Disclaimer:"
								}),
								/* @__PURE__ */ jsx("br", {}),
								disclaimerText
							]
						})]
					});
				})(),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute bottom-[6px] left-0 right-0",
					children: [/* @__PURE__ */ jsx("div", { className: "mx-5 border-t-2 border-dashed border-red-500" }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-end justify-between px-5 pt-2 pb-2",
						children: [/* @__PURE__ */ jsx("img", {
							src: qrUrl,
							alt: `Official verification QR code for journalist ${name}`,
							loading: "lazy",
							decoding: "async",
							className: "h-[64px] w-[64px] rounded bg-white p-0.5 shadow-sm"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center",
							children: [
								auth.signatureImageUrl ? /* @__PURE__ */ jsx("img", {
									src: auth.signatureImageUrl,
									alt: `Official authorized signature of ${auth.signatureName || "Editor-in-Chief"}`,
									loading: "lazy",
									decoding: "async",
									className: "h-10 max-w-[150px] object-contain"
								}) : /* @__PURE__ */ jsx("p", {
									className: "text-slate-700",
									style: {
										fontFamily: "'Dancing Script', 'Brush Script MT', 'Segoe Script', cursive",
										fontSize: 20
									},
									children: auth.signatureName || "Editor-in-Chief"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-36 border-b border-slate-400" }),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[10px] font-black uppercase italic tracking-[0.16em] text-slate-900",
									children: auth.signatureLabel || "AUTHORIZED SIGNATURE"
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute bottom-0 left-0 right-0 flex h-[6px]",
					children: [/* @__PURE__ */ jsx("div", { className: "flex-1 bg-red-600" }), /* @__PURE__ */ jsx("div", { className: "flex-1 bg-[#1a2040]" })]
				})
			]
		})]
	});
}
//#endregion
export { VerifiedPage as component };
