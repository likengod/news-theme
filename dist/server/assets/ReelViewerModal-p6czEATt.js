import { l as viewsFor, t as formatViews } from "./news-data-CFwG4BZ_.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronLeft, ChevronRight, Copy, Eye, Share2, X } from "lucide-react";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa6";
//#region src/components/site/ReelViewerModal.tsx
function ReelViewerModal({ initialIndex, items, onClose }) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [copied, setCopied] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const touchStartRef = useRef(null);
	const currentItem = items[currentIndex];
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				setCurrentIndex((i) => (i + 1) % items.length);
				setShowShareMenu(false);
			}
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				setCurrentIndex((i) => (i - 1 + items.length) % items.length);
				setShowShareMenu(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [items.length, onClose]);
	const handleTouchStart = (e) => {
		const t = e.touches[0];
		touchStartRef.current = {
			x: t.clientX,
			y: t.clientY
		};
	};
	const handleTouchEnd = (e) => {
		if (!touchStartRef.current) return;
		const t = e.changedTouches[0];
		const dx = t.clientX - touchStartRef.current.x;
		const dy = t.clientY - touchStartRef.current.y;
		touchStartRef.current = null;
		if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
			onClose();
			return;
		}
		if (Math.abs(dx) > 40) {
			setShowShareMenu(false);
			if (dx < 0) setCurrentIndex((i) => (i + 1) % items.length);
			else setCurrentIndex((i) => (i - 1 + items.length) % items.length);
		}
	};
	const handleCopyLink = (e) => {
		e.stopPropagation();
		const shareUrl = window.location.href;
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleNativeShare = async (e) => {
		e.stopPropagation();
		const shareUrl = window.location.href;
		if (typeof navigator !== "undefined" && navigator.share) try {
			await navigator.share({
				title: currentItem.title,
				text: `Watch "${currentItem.title}" on News Theme`,
				url: shareUrl
			});
			return;
		} catch {}
		setShowShareMenu((v) => !v);
	};
	const currentUrl = typeof window !== "undefined" ? window.location.href : "";
	const shareText = encodeURIComponent(`Watch "${currentItem.title}": ${currentUrl}`);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200",
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 flex items-center justify-between text-white max-w-lg mx-auto w-full pt-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
						children: [
							"Reel ",
							currentIndex + 1,
							" / ",
							items.length
						]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-white/70 hidden sm:inline",
						children: "Swipe left/right for next • Swipe up to close"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close Reel",
					className: "flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative my-auto flex h-[76vh] w-full max-w-md mx-auto items-center justify-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative aspect-[9/16] h-full w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl",
					children: [
						/* @__PURE__ */ jsx("iframe", {
							src: currentItem.embedSrc,
							title: currentItem.title,
							className: "h-full w-full object-cover",
							allow: "autoplay; encrypted-media; picture-in-picture",
							allowFullScreen: true,
							frameBorder: 0
						}, currentItem.title),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i - 1 + items.length) % items.length);
							},
							className: "absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Previous Reel",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i + 1) % items.length);
							},
							className: "absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Next Reel",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6" })
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute right-1 bottom-6 flex flex-col items-center gap-4 z-30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-1 text-white",
							title: "Views",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl",
								children: /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-white/90" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: formatViews(viewsFor(currentItem.title))
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleNativeShare,
							className: "flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform",
							title: "Share Reel",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20",
								children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: "Share"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCopyLink,
							className: "flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform",
							title: "Copy Reel Link",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20",
								children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: copied ? "Copied" : "Copy"
							})]
						})
					]
				})]
			}),
			showShareMenu && /* @__PURE__ */ jsxs("div", {
				className: "absolute inset-x-4 bottom-16 z-50 max-w-sm mx-auto rounded-2xl bg-zinc-900/95 p-4 text-white border border-white/20 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom duration-200",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-white/10",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-bold",
						children: "Share to"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowShareMenu(false),
						className: "text-white/60 hover:text-white",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-4 gap-3 py-4 text-center",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: `https://api.whatsapp.com/send?text=${shareText}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-[#25D366]",
								children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "WhatsApp"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-[#1877F2]",
								children: /* @__PURE__ */ jsx(FaFacebookF, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "Facebook"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `https://twitter.com/intent/tweet?text=${shareText}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-white",
								children: /* @__PURE__ */ jsx(FaTwitter, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "Twitter"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCopyLink,
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-white/80",
								children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-8 w-8 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: copied ? "Copied" : "Copy"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 max-w-sm mx-auto w-full pb-3 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-bold text-white leading-tight line-clamp-1",
					children: currentItem.title
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[11px] text-white/75 mt-1 flex items-center justify-center gap-1.5 font-medium",
					children: [
						/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-white/90" }),
						/* @__PURE__ */ jsxs("span", { children: [formatViews(viewsFor(currentItem.title)), " views"] }),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", { children: "Swipe left/right for next" })
					]
				})]
			})
		]
	});
}
//#endregion
export { ReelViewerModal, ReelViewerModal as default };
