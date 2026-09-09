import { O as trashAds, _ as restoreFromTrash, b as saveAdSlotScript, c as loadAdRotation, d as loadAds, g as purgeFromTrash, h as processExpiredAds, l as loadAdSlotMode, m as loadTrash, u as loadAdSlotScript, v as saveAdRotation, x as saveAds, y as saveAdSlotMode } from "./site-content-D1ESx2fQ.js";
import { a as useSiteSettings } from "./AdSettingsContext-C4yKFIXW.js";
import { r as trackUpload } from "./media-library-CDA86zOP.js";
import { t as LibraryPicker } from "./MediaField-CAywNcmk.js";
import { t as Switch } from "./switch-C_mzcXif.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Clock, Code, ExternalLink, FolderOpen, Image, Info, Lock, Plus, RotateCcw, Save, Sparkles, Trash, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/advertisements/DualImageCell.tsx
function SingleSlotImagePicker({ label, badgeColor, value, aspectClass, emptyText, recSize, onChange }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [pickerOpen, setPickerOpen] = useState(false);
	const fileRef = useRef(null);
	const containerRef = useRef(null);
	useEffect(() => {
		if (!menuOpen) return;
		const onDoc = (e) => {
			if (!containerRef.current?.contains(e.target)) setMenuOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [menuOpen]);
	const handleDeviceUpload = async (f) => {
		if (!f) return;
		try {
			onChange((await trackUpload(f, "advertisement")).dataUrl);
			toast.success(`${label} image uploaded`);
		} catch {
			toast.error("Upload failed");
		}
		if (fileRef.current) fileRef.current.value = "";
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "relative flex flex-col items-center",
		children: [
			/* @__PURE__ */ jsx("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				hidden: true,
				onChange: (e) => handleDeviceUpload(e.target.files?.[0])
			}),
			/* @__PURE__ */ jsx("div", {
				onClick: () => setMenuOpen((o) => !o),
				title: `Click to add/change ${label} image (${recSize})`,
				className: `group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all duration-200 ${aspectClass} ${value ? "border-slate-300 bg-white shadow-xs hover:border-slate-500 hover:shadow-md" : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/80"}`,
				children: value ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("img", {
						src: value,
						alt: label,
						className: "h-full w-full object-cover"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[1px]",
						children: /* @__PURE__ */ jsx("span", {
							className: "rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-xs",
							children: "Change"
						})
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							onChange("");
						},
						title: "Remove image",
						className: "absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-white shadow-sm opacity-0 transition-opacity duration-200 hover:bg-red-700 group-hover:opacity-100",
						children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
					})
				] }) : /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center p-1 text-slate-400 group-hover:text-slate-600",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
						className: "mt-0.5 text-[9px] font-semibold",
						children: emptyText
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-1 flex items-center gap-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: `rounded px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-wider text-white ${badgeColor}`,
					children: label
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[9px] text-slate-400 whitespace-nowrap",
					children: recSize
				})]
			}),
			menuOpen && /* @__PURE__ */ jsxs("div", {
				className: "absolute left-1/2 top-full z-50 mt-1.5 w-52 -translate-x-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "border-b border-slate-100 bg-slate-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600",
						children: [
							label,
							" (",
							recSize,
							")"
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setMenuOpen(false);
							fileRef.current?.click();
						},
						className: "flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4 shrink-0 text-slate-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium text-slate-900",
							children: "Upload image"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-slate-400",
							children: "From your device"
						})] })]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setMenuOpen(false);
							setPickerOpen(true);
						},
						className: "flex w-full items-center gap-2.5 border-t border-slate-100 px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(FolderOpen, { className: "h-4 w-4 shrink-0 text-slate-500" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium text-slate-900",
							children: "Media Library"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-slate-400",
							children: "Select existing image"
						})] })]
					})
				]
			}),
			pickerOpen && /* @__PURE__ */ jsx(LibraryPicker, {
				accept: "image/*",
				onClose: () => setPickerOpen(false),
				onPick: (item) => {
					onChange(item.dataUrl);
					setPickerOpen(false);
					toast.success(`${label} image selected`);
				}
			})
		]
	});
}
function DualImageCell({ ad, slot, onUpdate }) {
	const slotDefaultOrient = slot === "home2" ? "landscape" : "portrait";
	const effectiveOrient = ad.orientation || slotDefaultOrient;
	const portraitVal = ad.imagePortrait || (ad.image && (effectiveOrient === "portrait" || !ad.imageLandscape) ? ad.image : "");
	const landscapeVal = ad.imageLandscape || (ad.image && (effectiveOrient === "landscape" || !ad.imagePortrait) ? ad.image : "");
	const landscapeSize = slot === "home2" ? "406 × 196 px" : slot === "leaderboard" ? "728 × 90 px, etc." : "1200 × 675 px";
	if (slot === "leaderboard") return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 py-1",
		children: [/* @__PURE__ */ jsx(SingleSlotImagePicker, {
			label: "Mobile View",
			badgeColor: "bg-blue-600",
			value: portraitVal,
			aspectClass: "w-20 h-10",
			emptyText: "+ Mobile",
			recSize: "320 × 50 px, etc.",
			onChange: (url) => {
				onUpdate(ad.id, {
					imagePortrait: url,
					image: url || ad.imageLandscape || ad.image
				});
			}
		}), /* @__PURE__ */ jsx(SingleSlotImagePicker, {
			label: "Desktop View",
			badgeColor: "bg-emerald-600",
			value: landscapeVal,
			aspectClass: "w-24 h-10",
			emptyText: "+ Desktop",
			recSize: "728 × 90 px, etc.",
			onChange: (url) => {
				onUpdate(ad.id, {
					imageLandscape: url,
					image: url || ad.imagePortrait || ad.image
				});
			}
		})]
	});
	if (slot === "featured_slide") return /* @__PURE__ */ jsx("div", {
		className: "flex items-center gap-3 py-1",
		children: /* @__PURE__ */ jsx(SingleSlotImagePicker, {
			label: "Featured Slider Ad",
			badgeColor: "bg-emerald-600",
			value: landscapeVal,
			aspectClass: "w-24 aspect-[16/10]",
			emptyText: "+ Image",
			recSize: "800 × 500 px",
			onChange: (url) => {
				onUpdate(ad.id, {
					imageLandscape: url,
					image: url,
					orientation: "landscape"
				});
			}
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 py-1",
		children: [/* @__PURE__ */ jsx(SingleSlotImagePicker, {
			label: "Portrait",
			badgeColor: "bg-indigo-600",
			value: portraitVal,
			aspectClass: "w-14 h-18",
			emptyText: "+ Portrait",
			recSize: "600 × 800 px",
			onChange: (url) => {
				onUpdate(ad.id, {
					imagePortrait: url,
					image: url || ad.imageLandscape || ad.image,
					orientation: "portrait"
				});
			}
		}), /* @__PURE__ */ jsx(SingleSlotImagePicker, {
			label: "Landscape",
			badgeColor: "bg-emerald-600",
			value: landscapeVal,
			aspectClass: "w-22 h-14",
			emptyText: "+ Landscape",
			recSize: landscapeSize,
			onChange: (url) => {
				onUpdate(ad.id, {
					imageLandscape: url,
					image: url || ad.imagePortrait || ad.image,
					orientation: "landscape"
				});
			}
		})]
	});
}
//#endregion
//#region src/routes/admin.advertisements.tsx?tsr-split=component
var formatExpiresAt = (expiresVal) => {
	if (!expiresVal) return "";
	try {
		const d = expiresVal instanceof Date ? expiresVal : new Date(expiresVal);
		if (!isNaN(d.getTime())) {
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		}
		if (typeof expiresVal === "string") return expiresVal.slice(0, 10);
	} catch (e) {
		console.error("formatExpiresAt error:", e);
	}
	return "";
};
function uid() {
	return `ad-${Math.random().toString(36).slice(2, 9)}`;
}
var SLOTS = [
	{
		key: "home1",
		label: "Home 1",
		orientation: "Portrait",
		ratio: "3:4",
		size: "600 Ã— 800 px",
		shownOn: "Home page â€” sidebar next to hero board"
	},
	{
		key: "home2",
		label: "Home 2",
		orientation: "Landscape",
		ratio: "~2:1",
		size: "406 Ã— 196 px",
		shownOn: "Home page â€” Markets Magazine sidebar slideshow"
	},
	{
		key: "ad3",
		label: "Ad 3",
		orientation: "Portrait",
		ratio: "3:4",
		size: "600 Ã— 800 px",
		shownOn: "Article & Category pages â€” sidebar ('Your Ad Here')"
	},
	{
		key: "popup",
		label: "Popup",
		orientation: "Portrait + Landscape",
		ratio: "3:4 (mobile) Â· 16:9 (desktop)",
		size: "600 Ã— 800 px (mobile) Â· 1200 Ã— 675 px (desktop)",
		shownOn: "Article pages â€” popup modal 7 seconds after open"
	},
	{
		key: "leaderboard",
		label: "Leaderboard",
		orientation: "Landscape",
		ratio: "~8:1",
		size: "728 Ã— 90 px, 970 Ã— 250 px, etc.",
		shownOn: "Header or top of pages"
	},
	{
		key: "featured_slide",
		label: "Featured Ads",
		orientation: "Landscape",
		ratio: "16:9",
		size: "800 Ã— 500 px",
		shownOn: "Inside the homepage featured stories slider"
	}
];
var SAMPLE_GOOGLE_ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"><\/script>
<!-- Responsive Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
<\/script>`;
function AdvertisementsPage() {
	const navigate = useNavigate();
	const s = useSiteSettings();
	const isPremium = [
		"Enterprise",
		"Enterprise+",
		"Premium"
	].includes(s.licenseType || "") || s.licenseRole === "VIP";
	const isEnterprise = ["Enterprise", "Enterprise+"].includes(s.licenseType || "") || s.licenseRole === "VIP";
	const [tab, setTab] = useState("home1");
	const [ads, setAds] = useState([]);
	const [trash, setTrash] = useState([]);
	const [rotation, setRotation] = useState(5);
	const [slotMode, setSlotMode] = useState("image");
	const [slotScript, setSlotScript] = useState("");
	const [previewSlotScript, setPreviewSlotScript] = useState(false);
	const [showDemoGuide, setShowDemoGuide] = useState(false);
	const [previewScriptId, setPreviewScriptId] = useState(null);
	const [newlyAddedId, setNewlyAddedId] = useState(null);
	const tableRef = useRef(null);
	useEffect(() => {
		processExpiredAds();
		setAds(loadAds("home1"));
		setTrash(loadTrash());
		setSlotMode(loadAdSlotMode("home1"));
		setSlotScript(loadAdSlotScript("home1"));
	}, []);
	useEffect(() => {
		if (tab === "trash") setTrash(loadTrash());
		else {
			setAds(loadAds(tab));
			setRotation(loadAdRotation(tab));
			setSlotMode(loadAdSlotMode(tab));
			setSlotScript(loadAdSlotScript(tab));
			setPreviewSlotScript(false);
		}
	}, [tab]);
	const isTrash = tab === "trash";
	const slot = isTrash ? "home1" : tab;
	const activeSlot = SLOTS.find((s) => s.key === slot);
	const slotCounts = useMemo(() => {
		const counts = {};
		SLOTS.forEach((s) => {
			counts[s.key] = loadAds(s.key).length;
		});
		return counts;
	}, [ads, tab]);
	useMemo(() => loadTrash().length, [tab, trash]);
	const update = (id, patch) => setAds((prev) => prev.map((a) => a.id === id ? {
		...a,
		...patch
	} : a));
	const remove = (id) => {
		trashAds([id], slot);
		setAds(loadAds(slot));
		setTrash(loadTrash());
		toast.success("Moved to Trash (recoverable for 30 days)");
	};
	const handleAddAd = () => {
		const newId = uid();
		setAds((prev) => [...prev, {
			id: newId,
			type: "image",
			scriptCode: "",
			image: "",
			href: "#",
			label: "Sponsored",
			expiresAt: null
		}]);
		setNewlyAddedId(newId);
		toast.success(`New ad slide added to ${activeSlot?.label ?? slot}!`);
		setTimeout(() => {
			if (tableRef.current) tableRef.current.scrollTop = tableRef.current.scrollHeight;
		}, 100);
	};
	const onSave = () => {
		saveAdSlotMode(slot, slotMode);
		if (slotMode === "script") {
			saveAdSlotScript(slot, slotScript);
			toast.success(`Saved 3rd Party Script Ad integration for ${activeSlot?.label ?? slot}`);
		} else {
			const cleaned = ads.filter((a) => (a.image || a.imagePortrait || a.imageLandscape || "").trim().length > 0);
			saveAds(cleaned, slot);
			saveAdRotation(slot, rotation);
			setAds(cleaned);
			const slotLabel = activeSlot?.label ?? slot;
			toast.success(`Saved ${cleaned.length} custom banner slide${cleaned.length === 1 ? "" : "s"} to ${slotLabel} (rotates every ${rotation}s)`);
		}
	};
	const onRestore = (id) => {
		restoreFromTrash(id);
		setTrash(loadTrash());
		toast.success("Restored ad slide");
	};
	const onPurge = (id) => {
		purgeFromTrash(id);
		setTrash(loadTrash());
		toast.success("Permanently deleted");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5 pb-12",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight text-slate-900",
					children: "Advertisements"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-slate-500",
					children: "Manage rotating ad slides for your site. Support custom images, videos, and 3rd party script ads (Google AdSense, Bing Ads)."
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-px",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: SLOTS.map((s) => {
						const isActive = tab === s.key;
						const isLocked = (s.key === "popup" || s.key === "leaderboard") && !isPremium || s.key === "featured_slide" && !isEnterprise;
						const count = slotCounts[s.key] || 0;
						return /* @__PURE__ */ jsxs("button", {
							onClick: () => setTab(s.key),
							className: `group flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${isActive ? "border-slate-900 bg-slate-900 text-white shadow-xs" : isLocked ? "border-transparent text-slate-400 hover:bg-slate-50" : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { children: s.label }), isLocked && /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-slate-300" })]
							}), !isLocked && /* @__PURE__ */ jsx("span", {
								className: `rounded-full px-2 py-0.5 text-[10.5px] font-bold ${isActive ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"}`,
								children: count
							})]
						}, s.key);
					})
				}), !isTrash && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center space-x-2 border-r border-slate-200 pr-6",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "mode-switch",
								className: "text-xs font-semibold text-slate-600 cursor-pointer",
								children: "Google Ads"
							}),
							/* @__PURE__ */ jsx(Switch, {
								id: "mode-switch",
								checked: slotMode === "image",
								onCheckedChange: (c) => {
									const mode = c ? "image" : "script";
									setSlotMode(mode);
									saveAdSlotMode(slot, mode);
								}
							}),
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "mode-switch",
								className: "text-xs font-semibold text-slate-900 cursor-pointer",
								children: "Custom Ads"
							})
						]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setIsTrash(true),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-red-600",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
							" Trash (",
							trash.length,
							")"
						]
					})]
				})]
			}),
			(tab === "popup" || tab === "leaderboard") && !isPremium || tab === "featured_slide" && !isEnterprise ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100",
						children: /* @__PURE__ */ jsx(Lock, { className: "h-8 w-8 text-slate-400" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-4 text-base font-semibold text-slate-800",
						children: "Premium Feature Locked"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 max-w-sm text-sm text-slate-500",
						children: [
							"The ",
							tab === "popup" ? "Popup" : tab === "leaderboard" ? "Leaderboard" : "Featured Ads",
							" advertisement slot is exclusively available on Enterprise and Enterprise+ licenses. Please upgrade your license to unlock this slot."
						]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => navigate({
							to: "/admin/settings",
							search: { tab: "activate" }
						}),
						className: "mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
						children: "Activate Website"
					})
				]
			}) : isTrash ? trash.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ jsx(Trash, { className: "mb-3 h-8 w-8 text-slate-400" }),
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-semibold text-slate-800",
						children: "Trash is empty"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-slate-500",
						children: "Deleted ad slides will appear here and can be restored within 30 days."
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800 border border-amber-200",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 font-medium",
						children: [/* @__PURE__ */ jsx(Info, { className: "h-4 w-4 shrink-0 text-amber-600" }), "Items in trash are automatically purged 30 days after deletion."]
					})
				}), trash.map((ad) => /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs hover:border-slate-300 transition",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center",
							children: ad.type === "script" ? /* @__PURE__ */ jsx(Code, { className: "h-6 w-6 text-purple-600" }) : ad.image ? /* @__PURE__ */ jsx("img", {
								src: ad.image,
								alt: "",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid h-full w-full place-items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold",
								children: "No img"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-slate-900 max-w-md truncate",
								children: ad.type === "script" ? "3rd Party Script Ad" : ad.image || "(no image set)"
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1 flex flex-wrap items-center gap-2 text-slate-500",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5",
										children: [/* @__PURE__ */ jsx(FolderOpen, { className: "h-3 w-3" }), SLOTS.find((s) => s.key === ad.slot)?.label || ad.slot]
									}),
									/* @__PURE__ */ jsx("span", { children: "ï¿½" }),
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-red-500",
										children: [/* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }), "Deleted"]
									})
								]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => onRestore(ad.id),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition",
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), " Restore"]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => onPurge(ad.id),
							className: "inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), " Delete forever"]
						})]
					})]
				}, ad.id))]
			}) : slotMode === "script" ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-xs font-bold text-slate-800",
								children: [/* @__PURE__ */ jsx(Code, { className: "h-4.5 w-4.5 text-purple-600" }), /* @__PURE__ */ jsx("span", { children: "Paste 3rd-Party Script HTML/JS Code (Google AdSense, Bing Ads, Custom Script)" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-3",
								children: /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setSlotScript((s) => (s ? s + "\n\n" : "") + SAMPLE_GOOGLE_ADSENSE),
									className: "inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700 hover:bg-purple-100 transition",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }), " Sample AdSense"]
								})
							})]
						}),
						/* @__PURE__ */ jsx("textarea", {
							value: slotScript,
							onChange: (e) => setSlotScript(e.target.value),
							placeholder: "<!-- Paste HTML, <script> tags, or iframe codes here -->\\n<ins class=\\\"adsbygoogle\\\" ...></ins>\\n<script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>",
							className: "min-h-[250px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition shadow-inner",
							spellCheck: "false"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100 flex items-start gap-2",
							children: [/* @__PURE__ */ jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5 text-blue-600" }), /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("strong", { children: "Important:" }), " 3rd party scripts are executed exactly as provided. Ensure you only paste code from trusted ad networks like Google AdSense. In script mode, custom banner slides for this slot are ignored."] })]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4",
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => onSave(),
						className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98",
						children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4 text-emerald-400" }), " Save Script Integration"]
					})
				})]
			}) : ads.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-600 mb-3",
						children: /* @__PURE__ */ jsx(Image, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ jsxs("h3", {
						className: "text-base font-semibold text-slate-900",
						children: [
							"No ads added to ",
							activeSlot?.label,
							" yet"
						]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 max-w-sm text-xs text-slate-500",
						children: [
							"Add rotating custom banner images or video advertisements for ",
							activeSlot?.shownOn || "this slot",
							"."
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: handleAddAd,
						className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700",
						children: [
							/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
							" Add your first ad to ",
							activeSlot?.label
						]
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-medium",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-400" }), /* @__PURE__ */ jsxs("span", { children: [
								/* @__PURE__ */ jsx("strong", { children: ads.length }),
								" active ad slide",
								ads.length === 1 ? "" : "s",
								" in ",
								/* @__PURE__ */ jsx("strong", { children: activeSlot?.label })
							] })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleAddAd,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 active:scale-98",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " Add ad"]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						ref: tableRef,
						className: "space-y-4",
						children: ads.map((ad, i) => {
							return /* @__PURE__ */ jsxs("div", {
								className: `rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors ${ad.id === newlyAddedId ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300" : "hover:border-slate-300"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white shadow-2xs",
											children: ["#", i + 1]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-800",
											children: "Banner Ad Slide"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("label", {
												className: "text-xs font-semibold text-slate-500 whitespace-nowrap",
												children: "Expires:"
											}), /* @__PURE__ */ jsx("input", {
												type: "date",
												value: formatExpiresAt(ad.expiresAt),
												onChange: (e) => update(ad.id, { expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null }),
												className: "rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-slate-900 focus:outline-none transition"
											})]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => remove(ad.id),
											title: "Delete ad slide",
											"aria-label": "Delete ad slide",
											className: "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white shadow-2xs",
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
										})]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1",
											children: "Upload Banner Images"
										}), /* @__PURE__ */ jsx(DualImageCell, {
											ad,
											slot,
											onUpdate: update
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 max-w-md",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-1",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-[11px] font-bold uppercase tracking-wider text-slate-500",
													children: "Click-Through URL"
												}), ad.href && ad.href !== "#" && /* @__PURE__ */ jsxs("a", {
													href: ad.href,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline",
													children: ["Test link ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
												})]
											}), /* @__PURE__ */ jsx("input", {
												value: ad.href,
												onChange: (e) => update(ad.id, { href: e.target.value }),
												placeholder: "https://advertiser.com",
												className: "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
											})]
										})]
									})
								})]
							}, ad.id);
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4",
						children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onSave(),
							className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98",
							children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4 text-emerald-400" }), " Save changes"]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AdvertisementsPage as component };
