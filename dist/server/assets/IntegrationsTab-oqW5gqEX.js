import { i as IntegrationField, o as Toggle, r as GuideList, t as Card } from "./SettingsHelpers-RID2cSLu.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { GitBranch } from "lucide-react";
//#region src/components/admin/settings/IntegrationsTab.tsx
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
				/* @__PURE__ */ jsxs(Card, {
					title: "Git Connect / CI-CD",
					subtitle: "Connect your Git repository for continuous deployment. Manage deployments from Admin → Website Update.",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10",
									children: /* @__PURE__ */ jsx(GitBranch, { className: "h-5 w-5 text-white" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold text-white",
									children: "CI/CD Pipeline (Auto-Connected)"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-slate-300",
									children: [
										"Permanent Upstream:",
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "font-mono text-emerald-400 font-semibold",
											children: "likengod/news-theme"
										})
									]
								})] })]
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300",
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }), "Active & Ready"]
							})]
						}),
						/* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-slate-700",
										children: "Git Remote URL"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded",
										children: "Built-in Permanent Default"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									value: s.gitRemoteUrl || "https://github.com/likengod/news-theme.git",
									placeholder: "https://github.com/likengod/news-theme.git",
									onChange: (e) => update("gitRemoteUrl", e.target.value),
									className: "w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "HTTPS URL of your upstream update repository."
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-medium text-slate-700",
									children: "Branch"
								}),
								/* @__PURE__ */ jsx("input", {
									value: s.gitBranch || "main",
									placeholder: "main",
									onChange: (e) => update("gitBranch", e.target.value),
									className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "Branch to pull from and deploy (default: main)."
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-slate-700",
										children: "Personal Access Token (PAT)"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded",
										children: "Optional"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: s.gitAccessToken || "",
									placeholder: "ghp_...",
									onChange: (e) => update("gitAccessToken", e.target.value),
									className: "w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none",
									autoComplete: "off"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "Required only for private repositories. For public repos, leave empty."
								})
							] })
						] }),
						/* @__PURE__ */ jsx(Toggle, {
							label: "Auto-deploy on pull",
							checked: s.gitAutoDeploy,
							onChange: (v) => update("gitAutoDeploy", v),
							hint: "When enabled, pulling latest code will automatically trigger a production build."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-md bg-amber-50 p-3 text-xs text-amber-800",
							children: [
								/* @__PURE__ */ jsx("strong", { children: "Security note:" }),
								" Build and deploy commands run on the server. Only admin users can trigger deployments from ",
								/* @__PURE__ */ jsx("strong", { children: "Admin → Website Update" }),
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs(Card, {
					title: "CI/CD Setup Guide",
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
					] }), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 rounded-md border border-slate-200 bg-slate-50 p-3",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2",
							children: "How it works"
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal space-y-1.5 pl-4 text-xs text-slate-700",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									"Paste your Git remote URL and branch above, then ",
									/* @__PURE__ */ jsx("strong", { children: "Save changes" }),
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
									" to fetch new commits from your remote."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									"Click ",
									/* @__PURE__ */ jsx("strong", { children: "Build & Deploy" }),
									" to compile and deploy the production build."
								] }),
								/* @__PURE__ */ jsx("li", { children: "View deployment history and build logs right from the admin panel." }),
								/* @__PURE__ */ jsx("li", { children: "View deployment history and build logs right from the admin panel." })
							]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { IntegrationsTab };

//# sourceMappingURL=IntegrationsTab-oqW5gqEX.js.map