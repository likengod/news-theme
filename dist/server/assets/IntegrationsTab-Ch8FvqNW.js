import { s as saveSettings } from "./site-settings-8Vgif4GX.js";
import { i as IntegrationField, o as Toggle, r as GuideList, t as Card } from "./SettingsHelpers-DQ-5Mx6f.js";
import { t as purgeEdgeCdnServer } from "./cdn.functions-4dAXrJ7-.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronDown, Edit2, ExternalLink, Eye, EyeOff, GitBranch, Globe, RefreshCw, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
// src/components/admin/settings/CdnSettingsCard.tsx
function CdnSettingsCard({ s, update }) {
	const [purging, setPurging] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [showToken, setShowToken] = useState(false);
	const [localProvider, setLocalProvider] = useState(s.cdnProvider || "none");
	const [localCfZone, setLocalCfZone] = useState(s.cloudflareZoneId || "");
	const [localCfToken, setLocalCfToken] = useState(s.cloudflareApiToken || "");
	const [localBunnyZone, setLocalBunnyZone] = useState(s.bunnyPullZoneId || "");
	const [localBunnyKey, setLocalBunnyKey] = useState(s.bunnyAccessKey || "");
	const [localCfDist, setLocalCfDist] = useState(s.cloudfrontDistributionId || "");
	const [localFastlyService, setLocalFastlyService] = useState(s.fastlyServiceId || "");
	const [localFastlyKey, setLocalFastlyKey] = useState(s.fastlyApiKey || "");
	const [localWebhook, setLocalWebhook] = useState(s.cdnPurgeWebhookUrl || "");
	const [localMediaBase, setLocalMediaBase] = useState(s.cdnMediaBaseUrl || "");
	const [localCdnEnabled, setLocalCdnEnabled] = useState(!!s.cdnEnabled);
	const provider = s.cdnProvider || "none";
	let isProviderConfigured = false;
	if (provider === "cloudflare") isProviderConfigured = Boolean(s.cloudflareZoneId?.trim() && s.cloudflareApiToken?.trim());
	else if (provider === "bunny") isProviderConfigured = Boolean(s.bunnyPullZoneId?.trim() && s.bunnyAccessKey?.trim());
	else if (provider === "cloudfront") isProviderConfigured = Boolean(s.cloudfrontDistributionId?.trim());
	else if (provider === "fastly") isProviderConfigured = Boolean(s.fastlyServiceId?.trim() && s.fastlyApiKey?.trim());
	else if (provider === "custom") isProviderConfigured = Boolean(s.cdnPurgeWebhookUrl?.trim());
	const isMediaConfigured = Boolean(s.cdnEnabled && s.cdnMediaBaseUrl?.trim());
	const isOverallConfigured = isProviderConfigured || isMediaConfigured;
	const handleSave = async () => {
		update("cdnProvider", localProvider);
		update("cloudflareZoneId", localCfZone);
		update("cloudflareApiToken", localCfToken);
		update("bunnyPullZoneId", localBunnyZone);
		update("bunnyAccessKey", localBunnyKey);
		update("cloudfrontDistributionId", localCfDist);
		update("fastlyServiceId", localFastlyService);
		update("fastlyApiKey", localFastlyKey);
		update("cdnPurgeWebhookUrl", localWebhook);
		update("cdnMediaBaseUrl", localMediaBase);
		update("cdnEnabled", localCdnEnabled);
		const newSettings = {
			...s,
			cdnProvider: localProvider,
			cloudflareZoneId: localCfZone,
			cloudflareApiToken: localCfToken,
			bunnyPullZoneId: localBunnyZone,
			bunnyAccessKey: localBunnyKey,
			cloudfrontDistributionId: localCfDist,
			fastlyServiceId: localFastlyService,
			fastlyApiKey: localFastlyKey,
			cdnPurgeWebhookUrl: localWebhook,
			cdnMediaBaseUrl: localMediaBase,
			cdnEnabled: localCdnEnabled
		};
		try {
			await saveSettings(newSettings);
			toast.success("CDN & Edge settings saved successfully");
			setIsEditing(false);
		} catch {
			toast.error("Failed to save CDN settings");
		}
	};
	const handleCancel = () => {
		setLocalProvider(s.cdnProvider || "none");
		setLocalCfZone(s.cloudflareZoneId || "");
		setLocalCfToken(s.cloudflareApiToken || "");
		setLocalBunnyZone(s.bunnyPullZoneId || "");
		setLocalBunnyKey(s.bunnyAccessKey || "");
		setLocalCfDist(s.cloudfrontDistributionId || "");
		setLocalFastlyService(s.fastlyServiceId || "");
		setLocalFastlyKey(s.fastlyApiKey || "");
		setLocalWebhook(s.cdnPurgeWebhookUrl || "");
		setLocalMediaBase(s.cdnMediaBaseUrl || "");
		setLocalCdnEnabled(!!s.cdnEnabled);
		setIsEditing(false);
	};
	const handlePurge = async () => {
		setPurging(true);
		try {
			const res = await purgeEdgeCdnServer();
			if (res.success) toast.success(res.message || "Edge CDN cache successfully purged!");
			else toast.error(res.message || "Cache purge failed. Check your CDN credentials.");
		} catch (err) {
			toast.error(err?.message || "Failed to trigger edge cache purge.");
		} finally {
			setPurging(false);
		}
	};
	const providers = [
		{
			id: "none",
			name: "None (Disabled - Origin Direct)",
			guideUrl: ""
		},
		{
			id: "cloudflare",
			name: "Cloudflare (Reverse Proxy & Edge Purge)",
			guideUrl: "https://dash.cloudflare.com"
		},
		{
			id: "bunny",
			name: "BunnyCDN (Pull Zone & Media CDN)",
			guideUrl: "https://dash.bunny.net"
		},
		{
			id: "cloudfront",
			name: "AWS CloudFront (Amazon Global CDN)",
			guideUrl: "https://console.aws.amazon.com/cloudfront"
		},
		{
			id: "fastly",
			name: "Fastly (Real-time Edge Purge)",
			guideUrl: "https://manage.fastly.com"
		},
		{
			id: "custom",
			name: "Custom / Webhook (Any CDN)",
			guideUrl: ""
		}
	];
	const currentProviderObj = providers.find((p) => p.id === (isEditing ? localProvider : provider)) || providers[0];
	const sampleUrl = (isEditing ? localMediaBase : s.cdnMediaBaseUrl) ? `${(isEditing ? localMediaBase : s.cdnMediaBaseUrl || "").replace(/\/+$/, "")}/uploads/media/tripura-news.webp` : "/uploads/media/tripura-news.webp";
	return /* @__PURE__ */ jsxs(Card, {
		title: "CDN & Edge Cache Acceleration",
		subtitle: "Connect Cloudflare, BunnyCDN, AWS CloudFront, Fastly, or any custom CDN to accelerate media delivery, cut server bandwidth, and purge edge caches with 1 click.",
		children: [/* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-x-3 gap-y-1",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-[13px] font-medium text-slate-800 flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx(Globe, { className: "h-3.5 w-3.5 text-slate-600" }),
									"Edge CDN & Media Acceleration ",
									provider !== "none" ? `(${currentProviderObj.name.split(" ")[0]})` : ""
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [isOverallConfigured ? /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-[11px] font-medium text-emerald-600",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Configured"]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-[11px] font-medium text-rose-500",
									children: [/* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3" }), " Not Configured"]
								}), currentProviderObj.guideUrl && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
									className: "text-slate-300",
									children: "•"
								}), /* @__PURE__ */ jsxs("a", {
									href: currentProviderObj.guideUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center gap-1 text-[11px] text-blue-600 hover:underline",
									children: ["Setup Guide ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
								})] })]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 shrink-0",
							children: !isEditing && /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setIsEditing(true),
								className: "flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors",
								children: [/* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }), isOverallConfigured ? "Update" : "Setup"]
							})
						})]
					}),
					!isEditing && /* @__PURE__ */ jsx("div", {
						className: "mt-1.5 text-[11px] text-slate-500",
						children: isOverallConfigured ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-x-2 gap-y-1",
							children: [
								/* @__PURE__ */ jsxs("span", { children: ["Provider: ", /* @__PURE__ */ jsx("strong", {
									className: "text-slate-700",
									children: currentProviderObj.name.split(" ")[0]
								})] }),
								/* @__PURE__ */ jsx("span", { children: "•" }),
								/* @__PURE__ */ jsxs("span", { children: [
									"Media Delivery:",
									" ",
									s.cdnEnabled && s.cdnMediaBaseUrl ? /* @__PURE__ */ jsx("code", {
										className: "rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700",
										children: s.cdnMediaBaseUrl
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Origin direct"
									})
								] }),
								/* @__PURE__ */ jsx("span", { children: "•" }),
								/* @__PURE__ */ jsxs("span", { children: [
									"Edge Purge:",
									" ",
									/* @__PURE__ */ jsx("strong", {
										className: isProviderConfigured ? "text-emerald-600" : "text-slate-500",
										children: isProviderConfigured ? "Ready" : "Credentials needed"
									})
								] })
							]
						}) : /* @__PURE__ */ jsx("p", { children: "No CDN connected. Media and pages are served directly from the origin server. Click Setup to configure Cloudflare, BunnyCDN, or AWS." })
					}),
					isEditing && /* @__PURE__ */ jsxs("div", {
						className: "mt-3 space-y-4 rounded-md bg-slate-50/80 p-3 border border-slate-200/80",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-xs font-semibold text-slate-700",
									children: ["Select CDN Provider ", /* @__PURE__ */ jsx("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ jsx("select", {
										value: localProvider,
										onChange: (e) => setLocalProvider(e.target.value),
										className: "w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-none",
										children: providers.map((p) => /* @__PURE__ */ jsx("option", {
											value: p.id,
											children: p.name
										}, p.id))
									}), /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" })]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "Select your content delivery network to enable automated edge purge and fast global caching."
								})
							] }),
							localProvider === "cloudflare" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-md border border-blue-100 bg-blue-50/50 p-2.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-blue-900",
											children: "Cloudflare API Credentials"
										}), /* @__PURE__ */ jsxs("a", {
											href: "https://dash.cloudflare.com/profile/api-tokens",
											target: "_blank",
											rel: "noreferrer",
											className: "flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline",
											children: ["Get API Token ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-[11px] font-medium text-slate-700",
											children: "Zone ID"
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: localCfZone,
											onChange: (e) => setLocalCfZone(e.target.value),
											placeholder: "e.g. 023e105f4ecef8ad9ca31a8372d0c353",
											className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-0.5 text-[10px] text-slate-500",
											children: "Found on your Cloudflare domain overview page on the bottom right."
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-[11px] font-medium text-slate-700",
											children: "API Token (Zone:Cache Purge)"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative mt-1",
											children: [/* @__PURE__ */ jsx("input", {
												type: showToken ? "text" : "password",
												value: localCfToken,
												onChange: (e) => setLocalCfToken(e.target.value),
												placeholder: "••••••••••••••••••••••••••••••••••••••••",
												className: "w-full rounded border border-slate-200 bg-white px-2.5 py-1 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowToken(!showToken),
												className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
												children: showToken ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" })
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-0.5 text-[10px] text-slate-500",
											children: "API Token with permissions: Zone - Cache Purge - Purge."
										})
									] })
								]
							}),
							localProvider === "bunny" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-md border border-amber-100 bg-amber-50/50 p-2.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-amber-900",
											children: "BunnyCDN Pull Zone Credentials"
										}), /* @__PURE__ */ jsxs("a", {
											href: "https://dash.bunny.net/cdn",
											target: "_blank",
											rel: "noreferrer",
											className: "flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:underline",
											children: ["Bunny Dashboard ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-medium text-slate-700",
										children: "Pull Zone ID"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: localBunnyZone,
										onChange: (e) => setLocalBunnyZone(e.target.value),
										placeholder: "e.g. 123456",
										className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-medium text-slate-700",
										children: "Account API Access Key"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative mt-1",
										children: [/* @__PURE__ */ jsx("input", {
											type: showToken ? "text" : "password",
											value: localBunnyKey,
											onChange: (e) => setLocalBunnyKey(e.target.value),
											placeholder: "••••••••••••••••••••••••••••••••••••••••",
											className: "w-full rounded border border-slate-200 bg-white px-2.5 py-1 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setShowToken(!showToken),
											className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
											children: showToken ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" })
										})]
									})] })
								]
							}),
							localProvider === "cloudfront" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-md border border-emerald-100 bg-emerald-50/50 p-2.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-emerald-900",
										children: "AWS CloudFront Distribution"
									}), /* @__PURE__ */ jsxs("a", {
										href: "https://console.aws.amazon.com/cloudfront",
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline",
										children: ["AWS Console ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
									})]
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-[11px] font-medium text-slate-700",
									children: "Distribution ID"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: localCfDist,
									onChange: (e) => setLocalCfDist(e.target.value),
									placeholder: "e.g. E1A2B3C4D5E6F7",
									className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
								})] })]
							}),
							localProvider === "fastly" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-md border border-red-100 bg-red-50/50 p-2.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-red-900",
											children: "Fastly Service Credentials"
										}), /* @__PURE__ */ jsxs("a", {
											href: "https://manage.fastly.com",
											target: "_blank",
											rel: "noreferrer",
											className: "flex items-center gap-1 text-[11px] font-medium text-red-700 hover:underline",
											children: ["Fastly Portal ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-medium text-slate-700",
										children: "Service ID"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: localFastlyService,
										onChange: (e) => setLocalFastlyService(e.target.value),
										placeholder: "e.g. SU1z6GM9SGxkqUQwoQ3Wx1",
										className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-medium text-slate-700",
										children: "API Key"
									}), /* @__PURE__ */ jsx("input", {
										type: showToken ? "text" : "password",
										value: localFastlyKey,
										onChange: (e) => setLocalFastlyKey(e.target.value),
										placeholder: "••••••••••••••••••••••••••••••••••••••••",
										className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
									})] })
								]
							}),
							localProvider === "custom" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 rounded-md border border-purple-100 bg-purple-50/50 p-2.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-purple-900",
									children: "Custom Webhook Integration"
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-medium text-slate-700",
										children: "Purge Webhook URL (POST)"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "url",
										value: localWebhook,
										onChange: (e) => setLocalWebhook(e.target.value),
										placeholder: "https://api.my-custom-cdn.com/purge-all",
										className: "mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-[10px] text-slate-500",
										children: "When cache purge is triggered, the server will send an authenticated HTTP POST request to this webhook."
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-3 border-t border-slate-200 space-y-3",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700",
											children: "CDN Media Delivery Host URL (Optional)"
										}),
										/* @__PURE__ */ jsx("input", {
											type: "url",
											value: localMediaBase,
											onChange: (e) => setLocalMediaBase(e.target.value),
											placeholder: "https://cdn.todaytripura.com",
											className: "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[11px] text-slate-500",
											children: "Prepend this URL to all article images and media files to offload server traffic."
										})
									] }),
									/* @__PURE__ */ jsx(Toggle, {
										label: "Enable CDN Media URL Rewriting",
										checked: localCdnEnabled,
										onChange: (v) => setLocalCdnEnabled(v),
										hint: "When enabled, frontend images resolve to the CDN media host URL."
									}),
									localMediaBase && /* @__PURE__ */ jsxs("div", {
										className: "rounded border border-slate-200 bg-white p-2 text-[11px] text-slate-600",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-semibold text-slate-700",
												children: "Live Preview:"
											}),
											" ",
											/* @__PURE__ */ jsx("code", {
												className: "rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800",
												children: sampleUrl
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-200",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleCancel,
									className: "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleSave,
									className: "rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors",
									children: "Save CDN Settings"
								})]
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-4 pt-3 border-t border-slate-100 space-y-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-semibold text-slate-800 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5 text-amber-500" }), " Instant Edge & Server Purge"]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[11px] text-slate-500",
					children: [
						"Flushes server RAM and invalidates edge CDN cache for ",
						currentProviderObj.name,
						"."
					]
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: handlePurge,
					disabled: purging,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: `h-3 w-3 ${purging ? "animate-spin" : ""}` }), purging ? "Purging..." : "Purge Edge CDN Cache"]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-md bg-amber-50 p-2.5 text-xs text-amber-800",
				children: [/* @__PURE__ */ jsx("strong", { children: "Edge Cache Note:" }), " Static assets are cached for 1 year immutable, and news articles for 60s micro-cache."]
			})]
		})]
	});
}
// src/components/admin/settings/GitSettingsCard.tsx
function GitSettingsCard({ s, update }) {
	const [isEditing, setIsEditing] = useState(false);
	const [showToken, setShowToken] = useState(false);
	const [localRemoteUrl, setLocalRemoteUrl] = useState(s.gitRemoteUrl || "");
	const [localBranch, setLocalBranch] = useState(s.gitBranch || "main");
	const [localAccessToken, setLocalAccessToken] = useState(s.gitAccessToken || "");
	const [localAutoDeploy, setLocalAutoDeploy] = useState(!!s.gitAutoDeploy);
	const isConfigured = Boolean(s.gitRemoteUrl && s.gitRemoteUrl.trim());
	const handleSave = async () => {
		update("gitRemoteUrl", localRemoteUrl);
		update("gitBranch", localBranch);
		update("gitAccessToken", localAccessToken);
		update("gitAutoDeploy", localAutoDeploy);
		const newSettings = {
			...s,
			gitRemoteUrl: localRemoteUrl,
			gitBranch: localBranch,
			gitAccessToken: localAccessToken,
			gitAutoDeploy: localAutoDeploy
		};
		try {
			await saveSettings(newSettings);
			toast.success("Git CI/CD settings saved successfully");
			setIsEditing(false);
		} catch {
			toast.error("Failed to save Git settings");
		}
	};
	const handleCancel = () => {
		setLocalRemoteUrl(s.gitRemoteUrl || "");
		setLocalBranch(s.gitBranch || "main");
		setLocalAccessToken(s.gitAccessToken || "");
		setLocalAutoDeploy(!!s.gitAutoDeploy);
		setIsEditing(false);
	};
	return /* @__PURE__ */ jsx(Card, {
		title: "Git Connect / CI-CD",
		subtitle: "Connect your Git repository for continuous deployment. Manage deployments from Admin → Website Update.",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-x-3 gap-y-1",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "text-[13px] font-medium text-slate-800 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(GitBranch, { className: "h-3.5 w-3.5 text-slate-600" }), "Git Repository (GitHub / GitLab / Bitbucket)"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										isConfigured ? /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 text-[11px] font-medium text-emerald-600",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Configured"]
										}) : /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 text-[11px] font-medium text-rose-500",
											children: [/* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3" }), " Not Configured"]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-slate-300",
											children: "•"
										}),
										/* @__PURE__ */ jsxs("a", {
											href: "https://github.com/settings/tokens",
											target: "_blank",
											rel: "noreferrer",
											className: "flex items-center gap-1 text-[11px] text-blue-600 hover:underline",
											children: ["Setup Guide ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
										})
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 shrink-0",
								children: !isEditing && /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setIsEditing(true),
									className: "flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors",
									children: [/* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }), isConfigured ? "Update" : "Setup"]
								})
							})]
						}),
						!isEditing && /* @__PURE__ */ jsx("div", {
							className: "mt-1.5 text-[11px] text-slate-500",
							children: isConfigured ? /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-x-2 gap-y-1",
								children: [
									/* @__PURE__ */ jsxs("span", { children: ["Repo: ", /* @__PURE__ */ jsx("code", {
										className: "rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700",
										children: s.gitRemoteUrl
									})] }),
									/* @__PURE__ */ jsx("span", { children: "•" }),
									/* @__PURE__ */ jsxs("span", { children: ["Branch: ", /* @__PURE__ */ jsx("strong", {
										className: "text-slate-700",
										children: s.gitBranch || "main"
									})] }),
									/* @__PURE__ */ jsx("span", { children: "•" }),
									/* @__PURE__ */ jsxs("span", { children: ["Token: ", /* @__PURE__ */ jsx("span", {
										className: "text-slate-600",
										children: s.gitAccessToken ? "••••••••" : "Public repo"
									})] }),
									/* @__PURE__ */ jsx("span", { children: "•" }),
									/* @__PURE__ */ jsxs("span", { children: [
										"Auto-deploy:",
										" ",
										/* @__PURE__ */ jsx("strong", {
											className: s.gitAutoDeploy ? "text-emerald-600" : "text-slate-500",
											children: s.gitAutoDeploy ? "On" : "Off"
										})
									] })
								]
							}) : /* @__PURE__ */ jsx("p", { children: "No repository connected yet. Click Setup to connect GitHub, GitLab, or any Git remote." })
						}),
						isEditing && /* @__PURE__ */ jsxs("div", {
							className: "mt-3 space-y-3 rounded-md bg-slate-50/80 p-3 border border-slate-200/80",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700",
										children: ["Git Remote URL ", /* @__PURE__ */ jsx("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: localRemoteUrl,
										placeholder: "https://github.com/username/repository.git",
										onChange: (e) => setLocalRemoteUrl(e.target.value),
										className: "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-500",
										children: "HTTPS clone URL of your Git repository (GitHub, GitLab, Bitbucket, self-hosted)."
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700",
										children: "Deployment Branch"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: localBranch,
										placeholder: "main",
										onChange: (e) => setLocalBranch(e.target.value),
										className: "mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-1 text-[11px] text-slate-500",
										children: [
											"Branch to pull from and deploy (default: ",
											/* @__PURE__ */ jsx("code", {
												className: "font-mono",
												children: "main"
											}),
											")."
										]
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700",
											children: "Personal Access Token (PAT)"
										}), /* @__PURE__ */ jsxs("a", {
											href: "https://github.com/settings/tokens",
											target: "_blank",
											rel: "noreferrer",
											className: "text-[11px] text-blue-600 hover:underline flex items-center gap-1",
											children: ["Generate GitHub Token ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative mt-1",
										children: [/* @__PURE__ */ jsx("input", {
											type: showToken ? "text" : "password",
											value: localAccessToken,
											placeholder: "ghp_xxxxxxxxxxxxxxxxxxxx (optional for public repos)",
											onChange: (e) => setLocalAccessToken(e.target.value),
											className: "w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs focus:border-slate-900 focus:outline-none"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setShowToken(!showToken),
											className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
											title: showToken ? "Hide token" : "Show token",
											children: showToken ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-500",
										children: "Required only for private repositories. For public repositories, leave this blank."
									})
								] }),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 border-t border-slate-200",
									children: /* @__PURE__ */ jsx(Toggle, {
										label: "Auto-deploy on pull",
										checked: localAutoDeploy,
										onChange: (v) => setLocalAutoDeploy(v),
										hint: "When enabled, pulling latest code will automatically trigger a production build."
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-200",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleCancel,
										className: "rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors",
										children: "Cancel"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleSave,
										className: "rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors",
										children: "Save Git Settings"
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-md bg-amber-50 p-2.5 text-xs text-amber-800",
					children: [
						/* @__PURE__ */ jsx("strong", { children: "Security note:" }),
						" Build and deploy commands run on the server. Only admin users can trigger deployments from ",
						/* @__PURE__ */ jsx("strong", { children: "Admin → Website Update" }),
						"."
					]
				}),
				/* @__PURE__ */ jsxs("details", {
					className: "rounded-md border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-700",
					children: [/* @__PURE__ */ jsx("summary", {
						className: "font-semibold text-slate-700 cursor-pointer select-none",
						children: "View CI/CD Guides & Documentation"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-2.5 space-y-2.5",
						children: [/* @__PURE__ */ jsx(GuideList, { items: [
							{
								label: "GitHub - Generate Personal Access Token",
								url: "https://github.com/settings/tokens"
							},
							{
								label: "GitLab - Generate Access Token",
								url: "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html"
							},
							{
								label: "Bitbucket - App Passwords",
								url: "https://bitbucket.org/account/settings/app-passwords/"
							},
							{
								label: "GitHub - Creating a Repository",
								url: "https://docs.github.com/en/get-started/quickstart/create-a-repo"
							},
							{
								label: "GitHub Actions - CI/CD",
								url: "https://docs.github.com/en/actions"
							},
							{
								label: "Vercel - Git Integration",
								url: "https://vercel.com/docs/git"
							},
							{
								label: "Netlify - Build & Deploy",
								url: "https://docs.netlify.com/configure-builds/overview/"
							},
							{
								label: "Cloudflare Pages - Git Integration",
								url: "https://developers.cloudflare.com/pages/get-started/git-integration/"
							}
						] }), /* @__PURE__ */ jsx("div", {
							className: "rounded border border-slate-200 bg-white p-2.5 text-[11px] text-slate-600",
							children: /* @__PURE__ */ jsxs("ol", {
								className: "list-decimal space-y-1 pl-4",
								children: [
									/* @__PURE__ */ jsxs("li", { children: [
										"Paste Git remote URL and branch above, then ",
										/* @__PURE__ */ jsx("strong", { children: "Save" }),
										"."
									] }),
									/* @__PURE__ */ jsxs("li", { children: [
										"Go to ",
										/* @__PURE__ */ jsx("strong", { children: "Admin → Website Update" }),
										" to view repo status."
									] }),
									/* @__PURE__ */ jsxs("li", { children: [
										"Click ",
										/* @__PURE__ */ jsx("strong", { children: "Pull Latest" }),
										" to fetch new commits from remote."
									] }),
									/* @__PURE__ */ jsxs("li", { children: [
										"Click ",
										/* @__PURE__ */ jsx("strong", { children: "Build & Deploy" }),
										" to compile and deploy production build."
									] })
								]
							})
						})]
					})]
				})
			]
		})
	});
}
// src/components/admin/settings/IntegrationsTab.tsx
var integrationFields = [
	{
		key: "googleAnalyticsId",
		label: "Google Analytics (GA4) Measurement ID",
		hint: "Format: G-XXXXXXXXXX - from analytics.google.com — Admin — Data Streams.",
		placeholder: "G-XXXXXXXXXX",
		guideUrl: "https://analytics.google.com/"
	},
	{
		key: "googleTagManagerId",
		label: "Google Tag Manager Container ID",
		hint: "Format: GTM-XXXXXX - from tagmanager.google.com.",
		placeholder: "GTM-XXXXXX",
		guideUrl: "https://tagmanager.google.com/"
	},
	{
		key: "googleAdsenseId",
		label: "Google AdSense Publisher ID",
		hint: "Format: ca-pub-XXXXXXXXXXXXXXXX - from your AdSense account.",
		placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
		guideUrl: "https://www.google.com/adsense/"
	},
	{
		key: "facebookPixelId",
		label: "Facebook Pixel ID",
		hint: "Numeric Pixel ID from Meta Events Manager.",
		placeholder: "1234567890",
		guideUrl: "https://business.facebook.com/events_manager"
	},
	{
		key: "firebaseConfigJson",
		label: "Firebase config JSON",
		hint: "Paste the firebaseConfig object from Firebase Console - Project settings.",
		textarea: true,
		placeholder: "{\"apiKey\":\"...\",\"projectId\":\"...\",\"appId\":\"...\"}",
		guideUrl: "https://console.firebase.google.com/"
	}
];
var paymentFields = [
	{
		key: "razorpayKeyId",
		label: "Razorpay Key ID",
		hint: "From Razorpay Dashboard"
	},
	{
		key: "razorpayKeySecret",
		label: "Razorpay Key Secret",
		hint: "Keep this secure"
	},
	{
		key: "stripePublicKey",
		label: "Stripe Publishable Key",
		hint: "Starts with pk_"
	},
	{
		key: "stripeSecretKey",
		label: "Stripe Secret Key",
		hint: "Starts with sk_"
	}
];
var aiFields = [
	{
		key: "geminiApiKey",
		label: "Google Gemini API Key",
		hint: "Required for AI Assistant. Get from Google AI Studio.",
		guideUrl: "https://aistudio.google.com/"
	},
	{
		key: "googleFactCheckApiKey",
		label: "Google Fact Check Tools API Key",
		hint: "For /fact-checking-policy Live News Scanner. (Defaults to Gemini API Key if left blank).",
		guideUrl: "https://console.cloud.google.com/apis/library/factchecktools.googleapis.com"
	},
	{
		key: "openAiApiKey",
		label: "OpenAI API Key (Optional fallback)",
		hint: "Get from platform.openai.com.",
		guideUrl: "https://platform.openai.com/"
	},
	{
		key: "deepseekApiKey",
		label: "DeepSeek API Key (Optional fallback)",
		hint: "Get from platform.deepseek.com.",
		guideUrl: "https://platform.deepseek.com/"
	},
	{
		key: "kimiApiKey",
		label: "Kimi API Key (Optional fallback)",
		hint: "Get from Moonshot AI platform.",
		guideUrl: "https://platform.moonshot.cn/"
	}
];
var authFields = [
	{
		key: "googleClientId",
		label: "Google Sign-In",
		hint: "Create OAuth 2.0 Web application Client ID.",
		guideUrl: "https://console.cloud.google.com/apis/credentials",
		placeholder: "1234567890-abcdefg.apps.googleusercontent.com",
		toggleKey: "authGoogleEnabled",
		toggleLabel: "Enable Google on auth page"
	},
	{
		key: "facebookAppId",
		label: "Facebook Sign-In",
		hint: "Create app (Consumer) with Facebook Login product.",
		guideUrl: "https://developers.facebook.com/apps",
		placeholder: "1234567890123456",
		toggleKey: "authFacebookEnabled",
		toggleLabel: "Enable Facebook on auth page"
	},
	{
		key: "linkedinClientId",
		label: "LinkedIn Sign-In",
		hint: "Create app with Sign In with LinkedIn product.",
		guideUrl: "https://www.linkedin.com/developers/apps",
		placeholder: "86abcde1234567",
		toggleKey: "authLinkedinEnabled",
		toggleLabel: "Enable LinkedIn on auth page"
	}
];
var verificationFields = [
	{
		key: "googleSiteVerification",
		label: "Google Search Console",
		hint: "Paste the content value from the HTML tag method in Search Console.",
		placeholder: "abcDEF123...",
		guideUrl: "https://search.google.com/search-console"
	},
	{
		key: "bingSiteVerification",
		label: "Bing Webmaster (msvalidate.01)",
		hint: "Content value from Bing Webmaster Tools - Add Site - Meta tag.",
		guideUrl: "https://www.bing.com/webmasters"
	},
	{
		key: "facebookDomainVerification",
		label: "Facebook Domain Verification",
		hint: "From Meta Business Suite - Brand Safety - Domains.",
		guideUrl: "https://business.facebook.com/settings/owned-domains"
	},
	{
		key: "pinterestSiteVerification",
		label: "Pinterest (p:domain_verify)",
		hint: "From Pinterest Business - Claim website.",
		guideUrl: "https://www.pinterest.com/settings/claim/"
	},
	{
		key: "yandexVerification",
		label: "Yandex Webmaster",
		hint: "From Yandex Webmaster - Site rights.",
		guideUrl: "https://webmaster.yandex.com/"
	}
];
var socialMediaFields = [
	{
		key: "facebook",
		label: "Facebook Page URL",
		placeholder: "https://facebook.com/..."
	},
	{
		key: "twitter",
		label: "Twitter / X Profile",
		placeholder: "https://twitter.com/..."
	},
	{
		key: "instagram",
		label: "Instagram Profile",
		placeholder: "https://instagram.com/..."
	},
	{
		key: "pinterest",
		label: "Pinterest Profile",
		placeholder: "https://pinterest.com/..."
	},
	{
		key: "tiktok",
		label: "TikTok Profile",
		placeholder: "https://tiktok.com/..."
	},
	{
		key: "linkedin",
		label: "LinkedIn Page",
		placeholder: "https://linkedin.com/..."
	},
	{
		key: "youtube",
		label: "YouTube Channel",
		placeholder: "https://youtube.com/..."
	},
	{
		key: "whatsapp",
		label: "WhatsApp Channel",
		placeholder: "https://whatsapp.com/..."
	},
	{
		key: "telegram",
		label: "Telegram Channel",
		placeholder: "https://t.me/..."
	},
	{
		key: "googleNews",
		label: "Google News Publication URL",
		placeholder: "https://news.google.com/..."
	}
];
function IntegrationsTab({ s, update }) {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ jsx(Card, {
					title: "Analytics & Marketing",
					subtitle: "Paste IDs only - scripts load automatically on every page.",
					children: /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: integrationFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})
				}),
				/* @__PURE__ */ jsx(Card, {
					title: "AI Providers",
					subtitle: "Configure your API keys for the AI Content Assistant.",
					children: /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: aiFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})
				}),
				/* @__PURE__ */ jsx(Card, {
					title: "Social Media Profiles",
					subtitle: "Link your official social media pages to display on the site footer.",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 lg:grid-cols-2",
						children: socialMediaFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})
				}),
				/* @__PURE__ */ jsxs(Card, {
					title: "Search Engine & Social Verification",
					subtitle: "Paste the meta tag content value - we inject the <meta> tag for you.",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800",
						children: [
							"Tip: choose the ",
							/* @__PURE__ */ jsx("strong", { children: "HTML tag" }),
							" verification method and paste only the",
							/* @__PURE__ */ jsx("code", {
								className: "mx-1 rounded bg-white px-1",
								children: "content=\"...\""
							}),
							" value here."
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid gap-3 lg:grid-cols-2",
						children: verificationFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})]
				}),
				/* @__PURE__ */ jsx(Card, {
					title: "Payment Gateways",
					subtitle: "Configure your API keys for accepting payments.",
					children: /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: paymentFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})
				}),
				/* @__PURE__ */ jsx(Card, {
					title: "Login Providers",
					subtitle: "Configure OAuth Client IDs. Secrets must be set in the backend environment.",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: authFields.map((f) => /* @__PURE__ */ jsx(IntegrationField, {
							f,
							s,
							update
						}, f.key))
					})
				}),
				/* @__PURE__ */ jsx(GitSettingsCard, {
					s,
					update
				}),
				/* @__PURE__ */ jsx(CdnSettingsCard, {
					s,
					update
				})
			]
		})
	});
}
export { IntegrationsTab };

//# sourceMappingURL=IntegrationsTab-Ch8FvqNW.js.map