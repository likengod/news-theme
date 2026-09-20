import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BP1dEv6O.js";
import { a as useSiteSettings } from "./AdSettingsContext-DnVOjDQ9.js";
import { n as verifyImage } from "./image-protection-BvTFVLZp.js";
import { t as Footer } from "./Footer-C3OJdOBJ.js";
import { t as Header } from "./Header-DLpB_bPS.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Clipboard, Clock, Dna, ExternalLink, FileCheck, Globe, Layers, Link, RotateCcw, ShieldAlert, ShieldCheck, ShieldX, Sparkles, Upload } from "lucide-react";
//#region src/lib/verify-image.functions.ts
var fetchRemoteImageForVerification = createServerFn({ method: "POST" }).validator((d) => {
	if (!d || typeof d !== "object" || !("imageUrl" in d)) throw new Error("Missing imageUrl");
	const { imageUrl } = d;
	if (typeof imageUrl !== "string" || !imageUrl.trim()) throw new Error("Invalid imageUrl string");
	return { imageUrl: imageUrl.trim() };
}).handler(createSsrRpc("2c151724b9e12bfe1f5632766d7139f5833bcb85e798dee1a9c1a6e64280f110"));
//#endregion
//#region src/routes/verify-image.tsx?tsr-split=component
function VerifyImagePage() {
	const s = useSiteSettings();
	const [imageSrc, setImageSrc] = useState(null);
	const [fileName, setFileName] = useState("");
	const [fileSize, setFileSize] = useState(0);
	const [isScanning, setIsScanning] = useState(false);
	const [scanProgress, setScanProgress] = useState(0);
	const [scanStep, setScanStep] = useState("");
	const [result, setResult] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [inputUrl, setInputUrl] = useState("");
	const [isFetchingUrl, setIsFetchingUrl] = useState(false);
	const [urlError, setUrlError] = useState(null);
	const fileInputRef = useRef(null);
	const runVerification = useCallback(async (dataUrl) => {
		setIsScanning(true);
		setScanProgress(20);
		setScanStep("Reading file headers & Layer 1 Cryptographic EXIF signatures...");
		await new Promise((r) => setTimeout(r, 220));
		setScanProgress(55);
		setScanStep("Decoding Layer 2 Forensic Pixel Steganography (Scanning pixel DNA matrix)...");
		await new Promise((r) => setTimeout(r, 260));
		setScanProgress(85);
		setScanStep("Analyzing synchronization codes & domain checksums...");
		try {
			const verification = await verifyImage(dataUrl);
			setScanProgress(100);
			setScanStep("Analysis complete.");
			await new Promise((r) => setTimeout(r, 120));
			setResult(verification);
		} catch (err) {
			console.error("Verification failed:", err);
		} finally {
			setIsScanning(false);
		}
	}, []);
	const handleFileSelect = useCallback((file, customLabel) => {
		if (!file.type.startsWith("image/")) {
			alert("Please select a valid image file (JPEG, PNG, WebP, etc.)");
			return;
		}
		setFileName(customLabel || file.name);
		setFileSize(file.size);
		setResult(null);
		const reader = new FileReader();
		reader.onload = (e) => {
			const dataUrl = String(e.target?.result || "");
			setImageSrc(dataUrl);
			runVerification(dataUrl);
		};
		reader.readAsDataURL(file);
	}, [runVerification]);
	const handleUrlSubmit = async (e) => {
		e.preventDefault();
		const url = inputUrl.trim();
		if (!url) return;
		setUrlError(null);
		setIsFetchingUrl(true);
		try {
			const res = await fetchRemoteImageForVerification({ data: { imageUrl: url } });
			if (res && res.dataUrl) {
				setFileName(res.fileName || url);
				setFileSize(res.fileSize || 0);
				setImageSrc(res.dataUrl);
				setResult(null);
				runVerification(res.dataUrl);
			} else setUrlError("Could not retrieve image data from this URL.");
		} catch (err) {
			console.error("URL fetch error:", err);
			setUrlError(err.message || "Failed to load image from URL. Please check the link.");
		} finally {
			setIsFetchingUrl(false);
		}
	};
	useEffect(() => {
		const handlePaste = (e) => {
			const items = e.clipboardData?.items;
			if (!items) return;
			for (let i = 0; i < items.length; i++) if (items[i].type.startsWith("image/")) {
				const file = items[i].getAsFile();
				if (file) {
					handleFileSelect(file, "Pasted Screenshot (Clipboard)");
					break;
				}
			}
		};
		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [handleFileSelect]);
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
	};
	const resetScanner = () => {
		setImageSrc(null);
		setFileName("");
		setFileSize(0);
		setResult(null);
		setInputUrl("");
		setUrlError(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-between border-b border-border pb-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif",
							children: "Forensic Image Authentication"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "Dual-Layer Protection: Cryptographic EXIF & Pixel DNA Steganography"
						})] })]
					})
				}), !imageSrc ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							onDragOver: (e) => {
								e.preventDefault();
								setIsDragging(true);
							},
							onDragLeave: () => setIsDragging(false),
							onDrop: handleDrop,
							onClick: () => fileInputRef.current?.click(),
							className: `relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all bg-card ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/60 hover:bg-muted/30"}`,
							children: [
								/* @__PURE__ */ jsx("input", {
									ref: fileInputRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs",
									children: /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" })
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-xl font-bold text-foreground",
									children: "Drop an image here, click to browse, or paste from clipboard"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mx-auto mt-2 max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: "Supports original files (JPEG, PNG, WebP, AVIF) as well as cropped or full-screen captures."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-6 flex flex-wrap items-center justify-center gap-3",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										className: "rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition",
										children: "Browse Image File"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3.5 py-2 text-xs text-muted-foreground font-medium",
										children: [/* @__PURE__ */ jsx(Clipboard, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ jsxs("span", { children: ["Take a screenshot and press ", /* @__PURE__ */ jsx("kbd", {
											className: "font-mono font-bold text-foreground bg-background px-1.5 py-0.5 rounded border border-border",
											children: "Ctrl+V"
										})] })]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex items-center justify-center my-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 flex items-center",
								children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-border" })
							}), /* @__PURE__ */ jsx("span", {
								className: "relative bg-background px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Or Verify With Image URL"
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleUrlSubmit,
							className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground",
											children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" })
										}), /* @__PURE__ */ jsx("input", {
											type: "url",
											value: inputUrl,
											onChange: (e) => setInputUrl(e.target.value),
											placeholder: "Paste image link (e.g. https://... or /uploads/...)",
											className: "w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition",
											disabled: isFetchingUrl
										})]
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: !inputUrl.trim() || isFetchingUrl,
										className: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition shrink-0",
										children: isFetchingUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Fetching Image..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Verify Image URL" })] })
									})]
								}),
								urlError && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: urlError })]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Enter any public image URL from our site, news sources, or web articles to analyze its cryptographic EXIF and forensic pixel DNA."
								})
							]
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("img", {
									src: imageSrc,
									alt: "Scanned asset",
									className: "h-14 w-14 rounded-lg object-cover border border-border"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md",
									children: fileName
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [fileSize ? `${Math.round(fileSize / 1024)} KB • ` : "", "Image loaded in forensic inspector"]
								})] })]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: resetScanner,
								className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition",
								children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), "Scan Another Image"]
							})]
						}),
						isScanning && /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-3 animate-pulse",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-bold text-foreground",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary animate-spin" }), scanStep]
								}), /* @__PURE__ */ jsxs("span", { children: [scanProgress, "%"] })]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full bg-primary transition-all duration-300",
									style: { width: `${scanProgress}%` }
								})
							})]
						}),
						result && !isScanning && /* @__PURE__ */ jsxs("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: `rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${result.verdict === "ORIGINAL_AUTHENTIC" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100" : "border-border bg-muted/40 text-foreground"}`,
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: `flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xs ${result.verdict === "ORIGINAL_AUTHENTIC" ? "bg-emerald-600 text-white" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "bg-amber-600 text-white" : "bg-slate-500 text-white"}`,
												children: result.verdict === "ORIGINAL_AUTHENTIC" ? /* @__PURE__ */ jsx(ShieldCheck, { className: "h-8 w-8" }) : result.verdict === "AUTHENTIC_DERIVATIVE" ? /* @__PURE__ */ jsx(ShieldAlert, { className: "h-8 w-8" }) : /* @__PURE__ */ jsx(ShieldX, { className: "h-8 w-8" })
											}), /* @__PURE__ */ jsxs("div", {
												className: "space-y-1",
												children: [
													/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ jsxs("span", {
															className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${result.verdict === "ORIGINAL_AUTHENTIC" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`,
															children: ["Verdict: ", result.verdict.replace("_", " ")]
														}), /* @__PURE__ */ jsxs("span", {
															className: "text-xs text-muted-foreground",
															children: [
																"Analyzed in ",
																result.analysisDurationMs,
																"ms"
															]
														})]
													}),
													/* @__PURE__ */ jsx("h2", {
														className: "text-xl sm:text-2xl font-black tracking-tight",
														children: result.headline
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-xs sm:text-sm opacity-90 max-w-2xl leading-relaxed",
														children: result.details
													})
												]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-center justify-center rounded-xl bg-card p-3.5 border border-border shadow-2xs shrink-0 min-w-[120px]",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
													children: "DNA Confidence"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: `text-2xl font-black ${result.confidenceScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : result.confidenceScore > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`,
													children: [result.confidenceScore, "%"]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] text-muted-foreground",
													children: result.verdict === "ORIGINAL_AUTHENTIC" ? "Dual Verification" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "Pixel Steganography" : "No Match"
												})
											]
										})]
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-6 md:grid-cols-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between border-b border-border pb-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-blue-500" }), /* @__PURE__ */ jsx("h3", {
													className: "text-xs font-bold uppercase tracking-wider text-foreground",
													children: "Layer 1: Cryptographic EXIF Signature"
												})]
											}), /* @__PURE__ */ jsx("span", {
												className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${result.layer1.detected ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/15 text-rose-700 dark:text-rose-300"}`,
												children: result.layer1.detected ? "Found in Metadata" : "Destroyed / Stripped"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-3 text-xs",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "EXIF Digital Certificate:"
													}), /* @__PURE__ */ jsx("span", {
														className: "font-semibold text-foreground",
														children: result.layer1.detected ? "Valid Signature Present" : "Missing / Not Found"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Integrity Check:"
													}), /* @__PURE__ */ jsx("span", {
														className: "font-semibold text-foreground",
														children: result.layer1.validSignature ? "Cryptographically Authenticated" : "Failed / Unsigned"
													})]
												}),
												result.layer1.payload?.signature && /* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Digital Fingerprint:"
													}), /* @__PURE__ */ jsx("code", {
														className: "font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-primary",
														children: result.layer1.payload.signature
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Resistance Status:"
													}), /* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground text-[11px]",
														children: "Vulnerable to deliberate metadata stripping or screenshots."
													})]
												})
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "rounded-xl border border-border bg-card p-5 shadow-xs space-y-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between border-b border-border pb-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(Dna, { className: "h-4 w-4 text-purple-500" }), /* @__PURE__ */ jsx("h3", {
													className: "text-xs font-bold uppercase tracking-wider text-foreground",
													children: "Layer 2: Forensic Pixel Watermark (DNA)"
												})]
											}), /* @__PURE__ */ jsx("span", {
												className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${result.layer2.detected ? "bg-purple-500/15 text-purple-700 dark:text-purple-300" : "bg-muted text-muted-foreground"}`,
												children: result.layer2.detected ? "DNA Extracted" : "Not Found"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-3 text-xs",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Steganographic Pixel Match:"
													}), /* @__PURE__ */ jsx("span", {
														className: "font-semibold text-foreground",
														children: result.layer2.detected ? "Proven Across Pixel Matrix" : "No Pattern"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Synchronized Macroblocks:"
													}), /* @__PURE__ */ jsxs("span", {
														className: "font-semibold text-foreground",
														children: [result.layer2.blocksScanned, " cells analyzed"]
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1 border-b border-border/50",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Screenshot Resilience:"
													}), /* @__PURE__ */ jsx("span", {
														className: "font-semibold text-emerald-600 dark:text-emerald-400",
														children: "Immune to Screenshot & Metadata Stripping"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between py-1",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground",
														children: "Verdict Fallback:"
													}), /* @__PURE__ */ jsx("span", {
														className: "text-muted-foreground text-[11px]",
														children: result.layer2.detected ? "Proves authentic ownership despite metadata loss." : "No pixel watermark found."
													})]
												})
											]
										})]
									})]
								}),
								result.extractedPayload && /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 border-b border-border pb-3",
											children: [/* @__PURE__ */ jsx(FileCheck, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ jsx("h3", {
												className: "text-xs font-bold uppercase tracking-wider text-foreground",
												children: "Authenticated Ownership & Provenance Record"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-medium text-muted-foreground block mb-1",
													children: "Registered Publisher / Domain"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 text-sm font-bold text-foreground",
													children: [/* @__PURE__ */ jsx(Globe, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", { children: result.extractedPayload.domain || s.siteName || "Unknown Domain" })]
												}),
												result.extractedPayload.siteName && /* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: result.extractedPayload.siteName
												})
											] }), result.extractedPayload.timestamp && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-medium text-muted-foreground block mb-1",
												children: "Protection Timestamp"
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 text-xs font-semibold text-foreground",
												children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ jsx("span", { children: new Date(result.extractedPayload.timestamp).toLocaleString() })]
											})] })]
										}),
										result.extractedPayload.ownership && /* @__PURE__ */ jsxs("div", {
											className: "rounded-lg bg-muted/40 p-3.5 border border-border/50",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1",
												children: "Certified Ownership Declaration"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-foreground font-medium leading-relaxed",
												children: result.extractedPayload.ownership
											})]
										}),
										result.extractedPayload.socials && Object.keys(result.extractedPayload.socials).length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-medium text-muted-foreground block mb-2",
											children: "Embedded Official Social Media Accounts"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: Object.entries(result.extractedPayload.socials).map(([net, url]) => {
												if (!url) return null;
												return /* @__PURE__ */ jsxs("a", {
													href: url,
													target: "_blank",
													rel: "noreferrer",
													className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 transition shadow-2xs",
													children: [
														/* @__PURE__ */ jsxs("span", {
															className: "capitalize font-bold text-primary",
															children: [net, ":"]
														}),
														/* @__PURE__ */ jsx("span", {
															className: "truncate max-w-[140px] text-muted-foreground",
															children: url
														}),
														/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 text-muted-foreground" })
													]
												}, net);
											})
										})] })
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { VerifyImagePage as component };

//# sourceMappingURL=verify-image-BdCxDbpV.js.map