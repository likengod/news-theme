import { t as Footer } from "./Footer-Dyempwfz.js";
import { t as Header } from "./Header-DL1LsXH_.js";
import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Eye, EyeOff, FileText, Image, MapPin, Phone, ShieldCheck, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/submit-news.tsx?tsr-split=component
var MIN_WORDS = 60;
var IMAGE_MAX_MB = 8;
var PDF_MAX_MB = 15;
function countWords(text) {
	return text.trim().split(/\s+/).filter(Boolean).length;
}
function SubmitPage() {
	const [details, setDetails] = useState("");
	const [title, setTitle] = useState("");
	const [newsLocation, setNewsLocation] = useState("");
	const [hideIdentity, setHideIdentity] = useState(false);
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [reporterLocation, setReporterLocation] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [pdf, setPdf] = useState(null);
	const [agreed, setAgreed] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const imageInputRef = useRef(null);
	const pdfInputRef = useRef(null);
	const words = useMemo(() => countWords(details), [details]);
	const wordProgress = Math.min(100, Math.round(words / MIN_WORDS * 100));
	function handleImage(file) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file (JPG, PNG, WEBP).");
			return;
		}
		if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
			toast.error(`Image is too large. Max ${IMAGE_MAX_MB} MB.`);
			return;
		}
		setImage(file);
		setImagePreview(URL.createObjectURL(file));
	}
	function handlePdf(file) {
		if (!file) return;
		if (file.type !== "application/pdf") {
			toast.error("Only PDF files are accepted here.");
			return;
		}
		if (file.size > PDF_MAX_MB * 1024 * 1024) {
			toast.error(`PDF is too large. Max ${PDF_MAX_MB} MB.`);
			return;
		}
		setPdf(file);
	}
	function clearImage() {
		setImage(null);
		if (imagePreview) URL.revokeObjectURL(imagePreview);
		setImagePreview(null);
		if (imageInputRef.current) imageInputRef.current.value = "";
	}
	function clearPdf() {
		setPdf(null);
		if (pdfInputRef.current) pdfInputRef.current.value = "";
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (title.trim().length < 6) {
			toast.error("Give your news a headline (at least 6 characters).");
			return;
		}
		if (words < MIN_WORDS) {
			toast.error(`Your news is too short. Add at least ${MIN_WORDS - words} more word${MIN_WORDS - words === 1 ? "" : "s"}.`);
			return;
		}
		if (!image) {
			toast.error("Please attach at least one image.");
			return;
		}
		if (!newsLocation.trim()) {
			toast.error("Add the news location.");
			return;
		}
		if (!fullName.trim() || !phone.trim() || !reporterLocation.trim()) {
			toast.error("Your name, phone and location are required for cross-verification.");
			return;
		}
		if (!/^[+\d][\d\s\-()]{6,}$/.test(phone.trim())) {
			toast.error("Enter a valid phone number.");
			return;
		}
		if (!agreed) {
			toast.error("Please confirm the submission terms.");
			return;
		}
		setSubmitting(true);
		setTimeout(() => {
			setSubmitting(false);
			setSubmitted(true);
			toast.success("Thank you! Your submission is with our editors.");
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}, 800);
	}
	if (submitted) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-2xl px-4 py-20 text-center",
				children: [
					/* @__PURE__ */ jsx(CheckCircle2, {
						className: "mx-auto h-14 w-14",
						strokeWidth: 1.5
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-6 text-3xl font-black tracking-tight",
						children: "Submission received"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-3 text-muted-foreground",
						children: [
							"Thanks ",
							hideIdentity ? "anonymous contributor" : fullName.split(" ")[0],
							" — our editors will cross-verify your report and get back on ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: phone
							}),
							" within 48 hours. Your identity will ",
							hideIdentity ? "not" : "",
							" be shown on the published story."
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex justify-center gap-3",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background",
							children: "Back to home"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setSubmitted(false);
								setDetails("");
								setTitle("");
								setNewsLocation("");
								clearImage();
								clearPdf();
							},
							className: "border border-foreground px-5 py-2.5 text-sm font-semibold",
							children: "Submit another"
						})]
					})
				]
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
				children: [/* @__PURE__ */ jsxs("header", {
					className: "border-y-2 border-foreground py-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "kicker",
							children: "Newsroom · Citizen Desk"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl",
							children: "Submit your news"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base",
							children: "Share verified reports, ground photos and press releases with our editorial team. Every submission is cross-verified before publication."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-8 grid gap-8 lg:grid-cols-[1fr_280px]",
					children: [/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-8",
						children: [
							/* @__PURE__ */ jsxs(Section, {
								number: "1",
								title: "Your news",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "Headline",
										required: true,
										children: /* @__PURE__ */ jsx("input", {
											value: title,
											onChange: (e) => setTitle(e.target.value),
											maxLength: 140,
											placeholder: "A short, factual headline",
											className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
										})
									}),
									/* @__PURE__ */ jsxs(Field, {
										label: "News details",
										required: true,
										hint: /* @__PURE__ */ jsxs("span", {
											className: words < MIN_WORDS ? "text-muted-foreground" : "text-foreground",
											children: [
												words,
												" / ",
												MIN_WORDS,
												" words minimum"
											]
										}),
										children: [/* @__PURE__ */ jsx("textarea", {
											value: details,
											onChange: (e) => setDetails(e.target.value),
											rows: 8,
											placeholder: "What happened? When and where? Who is involved? Add facts, not opinions.",
											className: "w-full resize-y border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:border-foreground focus:outline-none"
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-1.5 h-1 w-full bg-muted",
											children: /* @__PURE__ */ jsx("div", {
												className: "h-1 bg-foreground transition-all",
												style: { width: `${wordProgress}%` }
											})
										})]
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "News location",
										required: true,
										icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
										children: /* @__PURE__ */ jsx("input", {
											value: newsLocation,
											onChange: (e) => setNewsLocation(e.target.value),
											placeholder: "City, district, state",
											className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
										})
									})
								]
							}),
							/* @__PURE__ */ jsx(Section, {
								number: "2",
								title: "Attachments",
								children: /* @__PURE__ */ jsxs("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
										className: "mb-2 text-xs font-semibold uppercase tracking-wider",
										children: ["Photo ", /* @__PURE__ */ jsx("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), imagePreview ? /* @__PURE__ */ jsxs("div", {
										className: "relative overflow-hidden border border-border",
										children: [/* @__PURE__ */ jsx("img", {
											src: imagePreview,
											alt: "Preview",
											className: "h-44 w-full object-cover"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: clearImage,
											className: "absolute right-2 top-2 grid h-7 w-7 place-items-center bg-background/90 text-foreground",
											"aria-label": "Remove image",
											children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
										})]
									}) : /* @__PURE__ */ jsxs("label", {
										className: "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-center text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground",
										children: [
											/* @__PURE__ */ jsx(Image, { className: "h-6 w-6" }),
											/* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: "Click to upload photo"
											}),
											/* @__PURE__ */ jsxs("span", { children: [
												"JPG, PNG · max ",
												IMAGE_MAX_MB,
												" MB"
											] }),
											/* @__PURE__ */ jsx("input", {
												ref: imageInputRef,
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => handleImage(e.target.files?.[0])
											})
										]
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
										className: "mb-2 text-xs font-semibold uppercase tracking-wider",
										children: ["PDF ", /* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "(optional)"
										})]
									}), pdf ? /* @__PURE__ */ jsxs("div", {
										className: "flex h-44 flex-col items-center justify-center gap-2 border border-border p-4 text-center",
										children: [
											/* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }),
											/* @__PURE__ */ jsx("p", {
												className: "line-clamp-2 text-sm font-semibold",
												children: pdf.name
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-xs text-muted-foreground",
												children: [(pdf.size / (1024 * 1024)).toFixed(2), " MB"]
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: clearPdf,
												className: "text-xs font-semibold underline underline-offset-2",
												children: "Remove"
											})
										]
									}) : /* @__PURE__ */ jsxs("label", {
										className: "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-center text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground",
										children: [
											/* @__PURE__ */ jsx(Upload, { className: "h-6 w-6" }),
											/* @__PURE__ */ jsx("span", {
												className: "font-semibold",
												children: "Attach press release / document"
											}),
											/* @__PURE__ */ jsxs("span", { children: [
												"PDF only · max ",
												PDF_MAX_MB,
												" MB"
											] }),
											/* @__PURE__ */ jsx("input", {
												ref: pdfInputRef,
												type: "file",
												accept: "application/pdf",
												className: "hidden",
												onChange: (e) => handlePdf(e.target.files?.[0])
											})
										]
									})] })]
								})
							}),
							/* @__PURE__ */ jsxs(Section, {
								number: "3",
								title: "Your identity",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3 border border-border p-3",
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setHideIdentity((v) => !v),
											className: `mt-0.5 grid h-9 w-9 shrink-0 place-items-center border ${hideIdentity ? "border-foreground bg-foreground text-background" : "border-border"}`,
											"aria-pressed": hideIdentity,
											"aria-label": "Toggle hide identity",
											children: hideIdentity ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-sm",
											children: [/* @__PURE__ */ jsx("p", {
												className: "font-semibold",
												children: hideIdentity ? "Hide my name on the published story" : "Show my name as the source"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted-foreground",
												children: "Either way, your contact details below stay confidential and are only used by our editors for cross-verification."
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsx(Field, {
											label: "Full name",
											required: true,
											icon: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
											children: /* @__PURE__ */ jsx("input", {
												value: fullName,
												onChange: (e) => setFullName(e.target.value),
												placeholder: "As on your ID",
												className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
											})
										}), /* @__PURE__ */ jsx(Field, {
											label: "Phone number",
											required: true,
											icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }),
											children: /* @__PURE__ */ jsx("input", {
												value: phone,
												onChange: (e) => setPhone(e.target.value),
												inputMode: "tel",
												placeholder: "+91 98xxxxxx",
												className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
											})
										})]
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Your location",
										required: true,
										icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
										children: /* @__PURE__ */ jsx("input", {
											value: reporterLocation,
											onChange: (e) => setReporterLocation(e.target.value),
											placeholder: "Where are you writing from?",
											className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "border-t-2 border-foreground pt-6",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "flex cursor-pointer items-start gap-3 text-sm",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: agreed,
										onChange: (e) => setAgreed(e.target.checked),
										className: "mt-1 h-4 w-4 accent-black"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground",
										children: [
											"I confirm the information above is accurate to my knowledge and I own or have permission to share every image and document attached. I have read the",
											" ",
											/* @__PURE__ */ jsx(Link, {
												to: "/editorial-policy",
												className: "underline",
												children: "Editorial Policy"
											}),
											"."
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-5 flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: submitting,
										className: "border border-foreground bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition disabled:opacity-60",
										children: submitting ? "Submitting…" : "Submit news"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Editors respond within 48 hours to verified submissions."
									})]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("aside", {
						className: "space-y-4 lg:sticky lg:top-6 lg:self-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "border border-border p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold uppercase tracking-wider",
									children: "How we verify"
								})]
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("li", { children: "· Editors call the number you provide." }),
									/* @__PURE__ */ jsx("li", { children: "· We cross-check location, photos and PDFs." }),
									/* @__PURE__ */ jsx("li", { children: "· Nothing is published until at least two sources confirm." }),
									/* @__PURE__ */ jsx("li", { children: "· Your identity is never disclosed without consent." })
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "border border-border p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-bold uppercase tracking-wider",
								children: "Checklist"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "mt-2 space-y-1.5 text-xs",
								children: [
									/* @__PURE__ */ jsx(Check$1, {
										ok: title.trim().length >= 6,
										children: "Headline"
									}),
									/* @__PURE__ */ jsxs(Check$1, {
										ok: words >= MIN_WORDS,
										children: [
											"≥ ",
											MIN_WORDS,
											" words of detail"
										]
									}),
									/* @__PURE__ */ jsx(Check$1, {
										ok: !!image,
										children: "1 photo attached"
									}),
									/* @__PURE__ */ jsx(Check$1, {
										ok: !!newsLocation.trim(),
										children: "News location"
									}),
									/* @__PURE__ */ jsx(Check$1, {
										ok: !!fullName.trim() && !!phone.trim() && !!reporterLocation.trim(),
										children: "Contact details"
									})
								]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function Section({ number, title, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 border-b border-border pb-2",
			children: [/* @__PURE__ */ jsx("span", {
				className: "grid h-7 w-7 place-items-center bg-foreground text-xs font-bold text-background",
				children: number
			}), /* @__PURE__ */ jsx("h2", {
				className: "font-serif text-xl font-black tracking-tight",
				children: title
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children
		})]
	});
}
function Field({ label, required, hint, icon, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-1.5 flex items-center justify-between gap-2",
		children: [/* @__PURE__ */ jsxs("label", {
			className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider",
			children: [
				icon,
				label,
				required && /* @__PURE__ */ jsx("span", {
					className: "text-destructive",
					children: "*"
				})
			]
		}), hint && /* @__PURE__ */ jsx("span", {
			className: "text-[11px]",
			children: hint
		})]
	}), children] });
}
function Check$1({ ok, children }) {
	return /* @__PURE__ */ jsxs("li", {
		className: `flex items-center gap-2 ${ok ? "text-foreground" : "text-muted-foreground"}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: `grid h-4 w-4 place-items-center border ${ok ? "border-foreground bg-foreground text-background" : "border-border"}`,
			children: ok && /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" })
		}), children]
	});
}
//#endregion
export { SubmitPage as component };
