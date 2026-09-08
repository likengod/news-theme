import { a as loadReelsConfig, c as toEmbedSrc, n as fetchFacebookReels, r as fetchYouTubeShorts, s as saveReelsConfig, t as defaultReelsConfig } from "./reels-config-4dsZmhVB.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Facebook, KeyRound, Layers, Link, Plus, RotateCcw, Save, Trash2, Youtube } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/admin.reels.tsx?tsr-split=component
function ReelsEditor() {
	const [cfg, setCfg] = useState(defaultReelsConfig);
	const [dirty, setDirty] = useState(false);
	const [newUrl, setNewUrl] = useState("");
	const [testing, setTesting] = useState(false);
	useEffect(() => setCfg(loadReelsConfig()), []);
	const update = (key, value) => {
		setCfg((p) => ({
			...p,
			[key]: value
		}));
		setDirty(true);
	};
	const addUrl = () => {
		const trimmed = newUrl.trim();
		if (!trimmed) return;
		if (!toEmbedSrc(cfg.provider, trimmed)) {
			toast.error(cfg.provider === "youtube" ? "Not a valid YouTube URL (paste a Shorts or watch link)" : "Not a valid Facebook video/reel URL");
			return;
		}
		if (cfg.urls.includes(trimmed)) return toast.error("Already added");
		update("urls", [...cfg.urls, trimmed]);
		setNewUrl("");
	};
	const removeUrl = (u) => update("urls", cfg.urls.filter((x) => x !== u));
	const onSave = () => {
		saveReelsConfig(cfg);
		setDirty(false);
		toast.success("Reels updated");
	};
	const onReset = () => {
		setCfg(defaultReelsConfig);
		saveReelsConfig(defaultReelsConfig);
		setDirty(false);
		toast.success("Reset to defaults");
	};
	const testApi = async () => {
		setTesting(true);
		try {
			const items = cfg.provider === "youtube" ? await fetchYouTubeShorts(cfg.youtube) : await fetchFacebookReels(cfg.facebook);
			toast.success(`API OK — fetched ${items.length} item${items.length === 1 ? "" : "s"}`);
		} catch (e) {
			toast.error(`API failed: ${e.message}`);
		} finally {
			setTesting(false);
		}
	};
	const providerBtn = (p, Icon, label, color) => /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: () => update("provider", p),
		className: `flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition ${cfg.provider === p ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`,
		children: [/* @__PURE__ */ jsx(Icon, {
			className: "h-4 w-4",
			style: { color: cfg.provider === p ? "#fff" : color }
		}), label]
	});
	const modeBtn = (m, Icon, label, hint) => /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: () => update("mode", m),
		className: `flex flex-1 flex-col items-start gap-1 rounded-md border px-4 py-3 text-left transition ${cfg.mode === m ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 bg-white hover:bg-slate-50"}`,
		children: [/* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-2 text-sm font-semibold text-slate-900",
			children: [
				/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
				" ",
				label
			]
		}), /* @__PURE__ */ jsx("span", {
			className: "text-[11px] text-slate-500",
			children: hint
		})]
	});
	const showManual = cfg.mode === "manual" || cfg.mode === "both";
	const showAuto = cfg.mode === "auto" || cfg.mode === "both";
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Reels & Shorts"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Pick a source (YouTube or Facebook), then choose how to fill the section: paste URLs manually, auto-fetch the latest via API, or both."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: onReset,
						className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), " Reset"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: onSave,
						disabled: !dirty,
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50",
						children: [
							/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
							" ",
							dirty ? "Save changes" : "Saved"
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold text-slate-900",
						children: "Show section on homepage"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500",
						children: "Toggle off to hide the reels row site-wide."
					})] }), /* @__PURE__ */ jsxs("label", {
						className: "inline-flex cursor-pointer items-center gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: cfg.enabled,
							onChange: (e) => update("enabled", e.target.checked),
							className: "h-4 w-4 accent-slate-900"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: cfg.enabled ? "Enabled" : "Disabled"
						})]
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "mt-4 block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mb-1 block text-[11px] font-medium text-slate-500",
						children: "Section heading"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: cfg.title,
						onChange: (e) => update("title", e.target.value),
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "mb-3 text-sm font-semibold text-slate-900",
					children: "1. Choose a source"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [providerBtn("youtube", Youtube, "YouTube Shorts", "#FF0000"), providerBtn("facebook", Facebook, "Facebook Reels", "#1877F2")]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "mb-3 text-sm font-semibold text-slate-900",
					children: "2. How should reels load?"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [
						modeBtn("manual", Link, "Manual URLs", "Paste each reel link — no API needed."),
						modeBtn("auto", KeyRound, "Auto from API", "Latest reels pulled from your channel/page."),
						modeBtn("both", Layers, "Both", "Pinned manual reels first, then latest from API.")
					]
				})]
			}),
			showAuto && /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold text-slate-900",
						children: cfg.provider === "youtube" ? "YouTube Data API" : "Facebook Graph API"
					}), /* @__PURE__ */ jsx("button", {
						onClick: testApi,
						disabled: testing,
						className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50",
						children: testing ? "Testing…" : "Test connection"
					})]
				}), cfg.provider === "youtube" ? /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "sm:col-span-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-[11px] font-medium text-slate-500",
									children: "YouTube API Key"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: cfg.youtube.apiKey,
									onChange: (e) => update("youtube", {
										...cfg.youtube,
										apiKey: e.target.value
									}),
									placeholder: "AIza…",
									className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "mt-1 block text-[11px] text-slate-500",
									children: "Create at console.cloud.google.com → APIs & Services → Credentials. Enable \"YouTube Data API v3\" and restrict the key to your site's domain."
								})
							]
						}),
						/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block text-[11px] font-medium text-slate-500",
							children: "Channel ID"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: cfg.youtube.channelId,
							onChange: (e) => update("youtube", {
								...cfg.youtube,
								channelId: e.target.value
							}),
							placeholder: "UCxxxxxxxxxxxxxxxxxxxx",
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block text-[11px] font-medium text-slate-500",
							children: "How many to show (1–25)"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 1,
							max: 25,
							value: cfg.youtube.maxResults,
							onChange: (e) => update("youtube", {
								...cfg.youtube,
								maxResults: Math.max(1, Math.min(25, Number(e.target.value) || 8))
							}),
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] })
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "sm:col-span-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-[11px] font-medium text-slate-500",
									children: "Facebook Page Access Token"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: cfg.facebook.accessToken,
									onChange: (e) => update("facebook", {
										...cfg.facebook,
										accessToken: e.target.value
									}),
									placeholder: "EAAG…",
									className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "mt-1 block text-[11px] text-slate-500",
									children: [
										"Generate a long-lived Page access token in Meta Business Suite / Graph API Explorer. Needs the ",
										/* @__PURE__ */ jsx("code", { children: "pages_read_engagement" }),
										" permission."
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block text-[11px] font-medium text-slate-500",
							children: "Page ID"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: cfg.facebook.pageId,
							onChange: (e) => update("facebook", {
								...cfg.facebook,
								pageId: e.target.value
							}),
							placeholder: "123456789012345",
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("label", { children: [/* @__PURE__ */ jsx("span", {
							className: "mb-1 block text-[11px] font-medium text-slate-500",
							children: "How many to show (1–25)"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 1,
							max: 25,
							value: cfg.facebook.maxResults,
							onChange: (e) => update("facebook", {
								...cfg.facebook,
								maxResults: Math.max(1, Math.min(25, Number(e.target.value) || 8))
							}),
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] })
					]
				})]
			}),
			showManual && /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-white p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "mb-3 text-sm font-semibold text-slate-900",
						children: cfg.provider === "youtube" ? "Manual YouTube Shorts URLs" : "Manual Facebook Reel URLs"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "url",
							value: newUrl,
							onChange: (e) => setNewUrl(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addUrl()),
							placeholder: cfg.provider === "youtube" ? "https://www.youtube.com/shorts/VIDEO_ID" : "https://www.facebook.com/reel/REEL_ID",
							className: "h-9 flex-1 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: addUrl,
							className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add"]
						})]
					}),
					cfg.urls.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "mt-4 text-sm text-slate-400",
						children: "No URLs yet. Add one above."
					}) : /* @__PURE__ */ jsx("ul", {
						className: "mt-4 space-y-2",
						children: cfg.urls.map((u) => {
							const invalid = !toEmbedSrc(cfg.provider, u);
							return /* @__PURE__ */ jsxs("li", {
								className: "flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: `truncate text-xs ${invalid ? "text-red-600" : "text-slate-700"}`,
									title: u,
									children: [invalid && "⚠ Invalid for current source · ", u]
								}), /* @__PURE__ */ jsxs("button", {
									onClick: () => removeUrl(u),
									className: "inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Remove"]
								})]
							}, u);
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ReelsEditor as component };
