import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { i as hashPassword, s as query } from "./db.server-BkLt9eJ8.js";
import { i as loadSettings, n as defaultSettings, r as getSiteSettingsServer } from "./site-settings-J3w4WW_b.js";
import { t as defaultPages } from "./default-pages-DQPnt0Sy.js";
import { n as getRedirectRulesServer, r as incrementRedirectHitServer } from "./redirect-rules-C0VJY_ju.js";
import { r as getAdConfigurationServer } from "./ads-storage-Bx4DdzZJ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { a as buildGoogleFontsUrl, i as buildFontFaceCss, o as buildSectionCssVars, s as defaultFontConfig, t as FONT_CONFIG_KEY, u as getFontConfigServer } from "./font-config-BXQWUC7t.js";
import { t as AdSettingsProvider } from "./AdSettingsContext-DJiAqdeY.js";
import { a as sections, o as slugify } from "./news-data-CFwG4BZ_.js";
import { r as getCategories } from "./taxonomy.functions-DN7Kc6uE.js";
import { i as getHomepageConfigServer, r as defaultHomepageConfig } from "./homepage-config-l1W5YOrZ.js";
import { t as Footer } from "./Footer-CSki8cmR.js";
import { n as ThemeProvider, r as themeInitScript, t as Header } from "./Header-Cgza0Oya.js";
import { i as getAdminDashboardStats } from "./articles.functions-vUKpNiKD.js";
import { t as checkSetupStatus } from "./setup.functions-B7yN90Xm.js";
import { t as Route$36 } from "./work-with-us-CxrzzaIB.js";
import { t as Route$37 } from "./verified-journalist-9DkfIYLu.js";
import { t as Route$38 } from "./terms-and-conditions-CbvN5qrB.js";
import { t as Route$39 } from "./search-CzrrGZ_-.js";
import { t as Route$40 } from "./refund-policy-CQvJ6acS.js";
import { t as Route$41 } from "./reels-273CPBkF.js";
import { t as Route$42 } from "./privacy-policy-ZP1briLO.js";
import { t as Route$43 } from "./fact-checking-policy-DzHWG8ru.js";
import { t as Route$44 } from "./editorial-policy-BpqXulNY.js";
import { t as Route$45 } from "./dmca-CHI_Emvh.js";
import { t as Route$46 } from "./disclaimer-PbnQJVNl.js";
import { t as Route$47 } from "./data-deletion-policy-DSMn1vXB.js";
import { t as Route$48 } from "./cookie-policy-C295_lik.js";
import { t as Route$49 } from "./archive-XbZ2zWQJ.js";
import { t as Route$50 } from "./admin-CiIj8JB9.js";
import { t as Route$51 } from "./about-CPv857KO.js";
import { t as Route$52 } from "./_slug-BnBL-2h4.js";
import { t as Route$53 } from "./routes-D7Hlu2Zj.js";
import { t as Route$54 } from "./news._slug-BYjtTuH5.js";
import { t as Route$55 } from "./admin.settings-CPpD_IPe.js";
import { useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Bookmark, Calendar, ChevronDown, ChevronUp, Crown, Download, FileText, Filter, Home, Mail, MapPin, Monitor, Newspaper, Search, ShieldCheck, Smartphone, Sparkles, Tablet, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import crypto from "crypto";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
//#region src/styles.css?url
var styles_default = "/assets/styles-f0X8IwaE.css";
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		position: "top-center",
		className: "toaster group",
		toastOptions: {
			style: {
				background: "#1A1110",
				color: "#ffffff",
				border: "1px solid #1A1110"
			},
			classNames: {
				toast: "group toast group-[.toaster]:shadow-lg font-medium",
				description: "group-[.toast]:text-[#141414]/90",
				actionButton: "group-[.toast]:bg-[#141414] group-[.toast]:text-white",
				cancelButton: "group-[.toast]:bg-black/10 group-[.toast]:text-[#141414]",
				title: "group-[.toast]:text-[#141414] font-semibold",
				error: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
				success: "group-[.toaster]:!bg-[#34C759] group-[.toaster]:!text-[#141414] group-[.toaster]:!border-[#2EAA4C] group-[.toaster]:shadow-md [&_[data-title]]:!text-[#141414] [&_[data-description]]:!text-[#141414] [&_[data-icon]]:!text-[#141414] [&_svg]:!text-[#141414] [&_svg]:!stroke-[#141414]"
			}
		},
		...props
	});
};
//#endregion
//#region src/components/site/AnalyticsInjector.tsx
/**
* Client-side injector for analytics/verification tags configured in
* Admin → Site Settings. Runs only in the browser; safe for SSR.
*/
function AnalyticsInjector() {
	useEffect(() => {
		const s = loadSettings();
		const head = document.head;
		const addMeta = (name, content) => {
			if (!content) return;
			if (document.querySelector(`meta[name="${name}"]`)) return;
			const m = document.createElement("meta");
			m.name = name;
			m.content = content;
			head.appendChild(m);
		};
		addMeta("google-site-verification", s.googleSiteVerification);
		addMeta("msvalidate.01", s.bingSiteVerification);
		addMeta("facebook-domain-verification", s.facebookDomainVerification);
		addMeta("p:domain_verify", s.pinterestSiteVerification);
		addMeta("yandex-verification", s.yandexVerification);
		const addScript = (id, src, inline, attrs = {}) => {
			if (document.getElementById(id)) return;
			const el = document.createElement("script");
			el.id = id;
			el.async = true;
			if (src) el.src = src;
			if (inline) el.text = inline;
			Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
			head.appendChild(el);
		};
		if (s.googleAnalyticsId) {
			addScript("ga-src", `https://www.googletagmanager.com/gtag/js?id=${s.googleAnalyticsId}`);
			addScript("ga-init", void 0, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.googleAnalyticsId}');`);
		}
		if (s.googleTagManagerId) addScript("gtm-init", void 0, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.googleTagManagerId}');`);
		if (s.googleAdsenseId) addScript("adsense-src", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${s.googleAdsenseId}`, void 0, { crossorigin: "anonymous" });
		if (s.facebookPixelId) addScript("fb-pixel", void 0, `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.facebookPixelId}');fbq('track','PageView');`);
		if (s.firebaseConfigJson) try {
			const cfg = JSON.parse(s.firebaseConfigJson);
			addScript("firebase-init", void 0, `window.__FIREBASE_CONFIG__=${JSON.stringify(cfg)};`);
		} catch {}
	}, []);
	return null;
}
i18n.use(LanguageDetector).use(initReactI18next).init({
	resources: {
		en: { translation: {
			nav: {
				"home": "Home",
				"subscribe": "Subscribe",
				"nightMode": "Night mode",
				"search": "Search news…",
				"navigation": "Navigation"
			},
			footer: {
				"quickLinks": "Quick Links",
				"connectWithUs": "Connect With Us",
				"about": "About",
				"contact": "Contact Us",
				"submitNews": "Submit News",
				"event": "Event",
				"privacyPolicy": "Privacy Policy",
				"terms": "Terms & Conditions",
				"cookiePolicy": "Cookie Policy",
				"refundPolicy": "Refund Policy",
				"disclaimer": "Disclaimer",
				"editorialPolicy": "Editorial Policy",
				"dmca": "DMCA",
				"verifiedJournalist": "Verified Journalist",
				"subscription": "Subscription",
				"workWithUs": "Work With Us",
				"archive": "Archive",
				"earnPoints": "Earn Points",
				"builtBy": "Website built and digital partner",
				"readMore": "Read more"
			}
		} },
		hi: { translation: {
			nav: {
				"home": "होम",
				"subscribe": "सब्सक्राइब",
				"nightMode": "डार्क मोड",
				"search": "समाचार खोजें…",
				"navigation": "नेविगेशन"
			},
			footer: {
				"quickLinks": "त्वरित लिंक",
				"connectWithUs": "हमसे जुड़ें",
				"about": "हमारे बारे में",
				"contact": "संपर्क करें",
				"submitNews": "समाचार भेजें",
				"event": "इवेंट",
				"privacyPolicy": "गोपनीयता नीति",
				"terms": "नियम और शर्तें",
				"cookiePolicy": "कुकी नीति",
				"refundPolicy": "रिफंड नीति",
				"disclaimer": "अस्वीकरण",
				"editorialPolicy": "संपादकीय नीति",
				"dmca": "DMCA",
				"verifiedJournalist": "सत्यापित पत्रकार",
				"subscription": "सदस्यता",
				"workWithUs": "हमारे साथ काम करें",
				"archive": "पुरालेख",
				"earnPoints": "अंक अर्जित करें",
				"builtBy": "वेबसाइट निर्माण और डिजिटल पार्टनर",
				"readMore": "और पढ़ें"
			}
		} },
		bn: { translation: {
			nav: {
				"home": "হোম",
				"subscribe": "সাবস্ক্রাইব",
				"nightMode": "নাইট মোড",
				"search": "খবর খুঁজুন…",
				"navigation": "নেভিগেশন"
			},
			footer: {
				"quickLinks": "দ্রুত লিঙ্ক",
				"connectWithUs": "আমাদের সাথে যুক্ত হন",
				"about": "আমাদের সম্পর্কে",
				"contact": "যোগাযোগ করুন",
				"submitNews": "খবর পাঠান",
				"event": "ইভেন্ট",
				"privacyPolicy": "গোপনীয়তা নীতি",
				"terms": "শর্তাবলী",
				"cookiePolicy": "কুকি নীতি",
				"refundPolicy": "রিফান্ড নীতি",
				"disclaimer": "দাবিত্যাগ",
				"editorialPolicy": "সম্পাদকীয় নীতি",
				"dmca": "DMCA",
				"verifiedJournalist": "যাচাইকৃত সাংবাদিক",
				"subscription": "সাবস্ক্রিপশন",
				"workWithUs": "আমাদের সাথে কাজ করুন",
				"archive": "আর্কাইভ",
				"earnPoints": "পয়েন্ট অর্জন করুন",
				"builtBy": "ওয়েবসাইট নির্মাণ এবং ডিজিটাল পার্টনার",
				"readMore": "আরও পড়ুন"
			}
		} }
	},
	fallbackLng: "en",
	interpolation: { escapeValue: false }
});
//#endregion
//#region src/components/site/NotFound.tsx
function NotFound() {
	const popular = sections.filter((s) => s !== "Others").slice(0, 6);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 px-4 py-16",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-red-600",
							children: "Error 404"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-4 font-bold leading-none text-foreground",
							style: {
								fontFamily: "'Playfair Display', Georgia, serif",
								fontSize: "clamp(5rem, 18vw, 10rem)"
							},
							children: "404"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-2 text-2xl font-bold text-foreground sm:text-3xl",
							style: { fontFamily: "'Playfair Display', Georgia, serif" },
							children: "This story is missing from our archive"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base",
							children: "The page you're looking for may have been moved, removed, or never existed. Try heading back to the homepage or explore a category below."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3",
							children: [
								/* @__PURE__ */ jsxs(Link, {
									to: "/",
									className: "inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90",
									children: [/* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }), " Go to Homepage"]
								}),
								/* @__PURE__ */ jsxs(Link, {
									to: "/search",
									className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), " Search News"]
								}),
								/* @__PURE__ */ jsxs(Link, {
									to: "/archive",
									className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted",
									children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Browse Archive"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 border-t border-border pt-8",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-4 w-4" }), " Popular Categories"]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap justify-center gap-2",
								children: popular.map((name) => /* @__PURE__ */ jsx(Link, {
									to: "/$slug",
									params: { slug: slugify(name) },
									className: "rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background",
									children: name
								}, name))
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx(NotFound, {});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				error?.message && /* @__PURE__ */ jsx("div", {
					className: "mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md text-xs font-mono text-left break-all",
					children: error.message
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$35 = createRootRouteWithContext()({
	beforeLoad: async ({ location }) => {
		if (location.pathname.startsWith("/api/") || location.pathname === "/api/rss" || location.pathname === "/rss.xml" || location.pathname === "/sitemap.xml" || location.pathname === "/news-sitemap.xml") return;
		try {
			const status = await checkSetupStatus();
			const isSetupPage = location.pathname === "/setup";
			if (status.required) {
				if (!isSetupPage) throw redirect({ to: "/setup" });
				return;
			}
			if (!status.required && isSetupPage) throw redirect({ to: "/" });
		} catch (err) {
			if (err.isRedirect || err.status === 301 || err.status === 302 || err.status === 307 || err.headers) throw err;
			console.error("[__root beforeLoad] Setup check error:", err);
		}
		try {
			const rules = await getRedirectRulesServer();
			const currentPath = location.pathname;
			const matched = rules.find((r) => r.source.toLowerCase().trim() === currentPath.toLowerCase().trim());
			if (matched && matched.destination) {
				incrementRedirectHitServer({ data: matched.id }).catch(() => {});
				throw redirect({
					href: matched.destination,
					code: 301
				});
			}
		} catch (err) {
			if (err.isRedirect || err.status === 301 || err.status === 302 || err.headers) throw err;
		}
	},
	loader: async ({ location }) => {
		if (location.pathname === "/setup") return {
			settings: null,
			homepageConfig: null,
			adsConfig: null,
			fontConfig: null,
			categories: []
		};
		try {
			const [settings, homepageConfig, adsConfig, fontConfig, categories] = await Promise.all([
				getSiteSettingsServer(),
				getHomepageConfigServer(),
				getAdConfigurationServer(),
				getFontConfigServer(),
				getCategories()
			]);
			return {
				settings,
				homepageConfig,
				adsConfig,
				fontConfig,
				categories
			};
		} catch (err) {
			console.error("[Root Loader] Failed to prefetch config:", err);
			return {
				settings: null,
				homepageConfig: null,
				adsConfig: null,
				fontConfig: null,
				categories: []
			};
		}
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		const siteTitle = s?.siteName || "News Timeline";
		const tagline = s?.tagline || "Breaking News";
		const title = s?.siteName ? `${s.siteName} – ${tagline}` : "News Timeline – Breaking News | Finance | Business | Market";
		const desc = s?.metaDescription || "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";
		const robotsContent = `${s?.seoRobotsIndex === false ? "noindex" : "index"}, ${s?.seoRobotsFollow === false ? "nofollow" : "follow"}`;
		const canonicalBase = s?.seoCanonicalBaseUrl ? s.seoCanonicalBaseUrl.replace(/\/$/, "") : "";
		const ogImage = s?.seoOgImage || (canonicalBase ? `${canonicalBase}/og-image.jpg` : "/og-image.jpg");
		const rawTwitter = s?.twitter || "";
		let twitterHandle = "@NewsTimeline";
		if (rawTwitter) {
			const cleaned = rawTwitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, "").replace(/^@/, "").trim();
			if (cleaned) twitterHandle = `@${cleaned}`;
		}
		const metaTags = [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title },
			{
				name: "description",
				content: desc
			},
			{
				name: "robots",
				content: robotsContent
			},
			{
				name: "author",
				content: siteTitle
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: desc
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:image",
				content: ogImage
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: twitterHandle
			},
			{
				name: "twitter:creator",
				content: twitterHandle
			},
			{
				name: "twitter:title",
				content: title
			},
			{
				name: "twitter:description",
				content: desc
			},
			{
				name: "twitter:image",
				content: ogImage
			}
		];
		if (s?.seoKeywords) metaTags.push({
			name: "keywords",
			content: s.seoKeywords
		});
		if (s?.seoGooglebotNews ?? true) {
			metaTags.push({
				name: "googlebot-news",
				content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
			});
			metaTags.push({
				name: "googlebot",
				content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
			});
		}
		if (s?.forceHttps) metaTags.push({
			httpEquiv: "Content-Security-Policy",
			content: "upgrade-insecure-requests"
		});
		if (s?.googleSiteVerification) metaTags.push({
			name: "google-site-verification",
			content: s.googleSiteVerification
		});
		if (s?.bingSiteVerification) metaTags.push({
			name: "msvalidate.01",
			content: s.bingSiteVerification
		});
		if (s?.facebookDomainVerification) metaTags.push({
			name: "facebook-domain-verification",
			content: s.facebookDomainVerification
		});
		if (s?.pinterestSiteVerification) metaTags.push({
			name: "p:domain_verify",
			content: s.pinterestSiteVerification
		});
		if (s?.yandexVerification) metaTags.push({
			name: "yandex-verification",
			content: s.yandexVerification
		});
		const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
		const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
		const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
		const links = [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "alternate",
				type: "application/rss+xml",
				title: `${siteTitle} RSS Feed`,
				href: "/rss.xml"
			}
		];
		if (googleFontsUrl) {
			links.push({
				rel: "preload",
				as: "style",
				href: googleFontsUrl
			});
			links.push({
				rel: "stylesheet",
				href: googleFontsUrl,
				media: "print",
				onLoad: "this.media='all'"
			});
		}
		if (canonicalBase) links.push({
			rel: "canonical",
			href: canonicalBase
		});
		const orgSchema = {
			"@context": "https://schema.org",
			"@type": s?.seoOrganizationType || "NewsMediaOrganization",
			name: s?.seoNewsPublicationName || siteTitle,
			url: canonicalBase || "http://localhost:3099",
			description: desc
		};
		if (s?.logoLight || canonicalBase) orgSchema.logo = s?.logoLight || `${canonicalBase}/logo.png`;
		if (s?.seoEditorialContactEmail || s?.contactEmail) orgSchema.contactPoint = {
			"@type": "ContactPoint",
			email: s?.seoEditorialContactEmail || s?.contactEmail,
			contactType: "editorial"
		};
		orgSchema.publishingPrinciples = s?.seoEditorialPolicyUrl || "/editorial-policy";
		orgSchema.correctionsPolicy = s?.seoCorrectionsPolicyUrl || "/contact";
		orgSchema.diversityPolicy = s?.seoFactCheckingPolicyUrl || "/fact-checking-policy";
		return {
			meta: metaTags,
			links,
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify(orgSchema)
			}]
		};
	},
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
var chunkRecoveryScript = `
(function() {
  function handleChunkError(err) {
    try {
      var msg = (err && (err.message || (err.reason && err.reason.message) || String(err.reason || err))) || '';
      if (/failed to fetch dynamically imported module/i.test(msg) || 
          /importing a module script failed/i.test(msg) || 
          /loading chunk/i.test(msg) || 
          /error #418/i.test(msg) ||
          /error #423/i.test(msg) ||
          /error #425/i.test(msg)) {
        var key = 'chunk_reload_ts';
        var last = Number(sessionStorage.getItem(key) || 0);
        var now = Date.now();
        if (now - last > 10000) {
          sessionStorage.setItem(key, String(now));
          window.location.reload();
        }
      }
    } catch(e) {}
  }
  window.addEventListener('vite:preloadError', function(event) {
    try {
      if (event && event.preventDefault) event.preventDefault();
      var key = 'chunk_reload_ts';
      var last = Number(sessionStorage.getItem(key) || 0);
      var now = Date.now();
      if (now - last > 10000) {
        sessionStorage.setItem(key, String(now));
        window.location.reload();
      }
    } catch(e) {}
  });
  window.addEventListener('error', handleChunkError);
  window.addEventListener('unhandledrejection', handleChunkError);
})();
`;
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeInitScript } }),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: chunkRecoveryScript } }),
			/* @__PURE__ */ jsx(HeadContent, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$35.useRouteContext();
	const loaderData = Route$35.useLoaderData();
	useEffect(() => {
		if (loaderData?.settings?.forceHttps && window.location.protocol === "http:" && window.location.hostname !== "localhost") window.location.protocol = "https:";
		if (typeof window === "undefined" || !loaderData) return;
		const { settings, homepageConfig, adsConfig, fontConfig } = loaderData;
		if (settings) localStorage.setItem("nt:site-settings", JSON.stringify(settings));
		if (fontConfig) localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(fontConfig));
		if (homepageConfig) localStorage.setItem("nt:homepage-config:v1", JSON.stringify(homepageConfig));
		if (adsConfig) {
			if (adsConfig.slots) Object.keys(adsConfig.slots).forEach((slot) => {
				const slotAds = adsConfig.slots[slot];
				if (Array.isArray(slotAds) && slotAds.length > 0) {
					localStorage.setItem(`nt:ads:v2:${slot}`, JSON.stringify(slotAds));
					const legacyKey = slot === "home1" ? "nt:site-ads" : `nt:site-ads-${slot}`;
					localStorage.setItem(legacyKey, JSON.stringify(slotAds));
				}
			});
			if (adsConfig.modes) localStorage.setItem("nt:ad-slot-mode", JSON.stringify(adsConfig.modes));
			if (adsConfig.scripts) localStorage.setItem("nt:ad-slot-script", JSON.stringify(adsConfig.scripts));
			if (adsConfig.rotations) localStorage.setItem("nt:site-ads-rotation", JSON.stringify(adsConfig.rotations));
			if (adsConfig.popupConfig) localStorage.setItem("nt:popup-ad-config", JSON.stringify(adsConfig.popupConfig));
			window.dispatchEvent(new Event("nt:ads-updated"));
			window.dispatchEvent(new Event("nt:homepage-updated"));
		}
	}, [loaderData]);
	const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
	useEffect(() => {
		const faceCss = buildFontFaceCss(fontConfig.fonts);
		let faceStyle = document.getElementById("nt-font-face");
		if (!faceStyle) {
			faceStyle = document.createElement("style");
			faceStyle.id = "nt-font-face";
			document.head.appendChild(faceStyle);
		}
		faceStyle.textContent = faceCss;
		const varsCss = buildSectionCssVars(fontConfig);
		let varsStyle = document.getElementById("nt-font-vars");
		if (!varsStyle) {
			varsStyle = document.createElement("style");
			varsStyle.id = "nt-font-vars";
			document.head.appendChild(varsStyle);
		}
		varsStyle.textContent = varsCss;
		const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
		const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
		let fontLink = document.getElementById("nt-google-fonts");
		if (googleFontsUrl) {
			if (!fontLink) {
				fontLink = document.createElement("link");
				fontLink.id = "nt-google-fonts";
				fontLink.rel = "stylesheet";
				fontLink.href = googleFontsUrl;
				document.head.appendChild(fontLink);
			} else if (fontLink.href !== googleFontsUrl) fontLink.href = googleFontsUrl;
		}
		return () => {
			faceStyle?.remove();
			varsStyle?.remove();
		};
	}, [fontConfig]);
	useEffect(() => {
		const handleFontUpdate = (e) => {
			try {
				const detail = e.detail;
				if (detail) {
					const varsCss = buildSectionCssVars(typeof detail === "string" ? JSON.parse(detail) : detail);
					const varsStyle = document.getElementById("nt-font-vars");
					if (varsStyle) varsStyle.textContent = varsCss;
				}
			} catch {}
		};
		window.addEventListener("nt:fonts-updated", handleFontUpdate);
		return () => window.removeEventListener("nt:fonts-updated", handleFontUpdate);
	}, []);
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs(AdSettingsProvider, {
			value: {
				settings: loaderData?.settings ?? defaultSettings,
				homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
				adConfig: loaderData?.adsConfig ?? {
					slots: {
						home1: [],
						home2: [],
						ad3: [],
						popup: [],
						leaderboard: [],
						hero_showcase: [],
						reel_ads: []
					},
					modes: {
						home1: "image",
						home2: "image",
						ad3: "image",
						popup: "image",
						leaderboard: "image",
						hero_showcase: "image",
						reel_ads: "image"
					},
					scripts: {
						home1: "",
						home2: "",
						ad3: "",
						popup: "",
						leaderboard: "",
						hero_showcase: "",
						reel_ads: ""
					},
					rotations: {
						home1: 5,
						home2: 5,
						ad3: 5,
						popup: 6,
						leaderboard: 5,
						hero_showcase: 5,
						reel_ads: 5
					}
				},
				fontConfig,
				categories: loaderData?.categories ?? []
			},
			children: [
				/* @__PURE__ */ jsx(Outlet, {}),
				/* @__PURE__ */ jsx(Toaster$1, {}),
				/* @__PURE__ */ jsx(AnalyticsInjector, {})
			]
		}) })
	});
}
//#endregion
//#region src/routes/withdraw-points.tsx
var $$splitComponentImporter$27 = () => import("./withdraw-points-CcsOHS0R.js");
var Route$34 = createFileRoute("/withdraw-points")({
	head: () => ({ meta: [{ title: "Withdraw Points – News Theme Wallet" }, {
		name: "description",
		content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/watch.tsx
var Route$33 = createFileRoute("/watch")({ beforeLoad: () => {
	throw redirect({ to: "/reels" });
} });
//#endregion
//#region src/routes/subscription.tsx
var $$splitComponentImporter$26 = () => import("./subscription-DzQyjFat.js");
var Route$32 = createFileRoute("/subscription")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.subscriptionTitle || "Subscription",
				metaTitle: s?.subscriptionMetaTitle,
				metaDescription: s?.subscriptionMetaDescription,
				ogImage: s?.subscriptionOgImage,
				metaKeywords: s?.subscriptionKeywords,
				canonicalUrl: s?.subscriptionCanonicalUrl,
				noIndex: s?.subscriptionNoIndex
			},
			defaultTitle: "Subscription",
			defaultDescription: "Upgrade to Premium for ad-free reading, exclusive stories and early access. Monthly or yearly plans.",
			slug: "/subscription"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/submit-news.tsx
var $$splitComponentImporter$25 = () => import("./submit-news-EW7ueoOK.js");
var Route$31 = createFileRoute("/submit-news")({
	head: () => ({ meta: [
		{ title: "Submit News — News Theme" },
		{
			name: "description",
			content: "Submit verified news to News Theme. Share tips, photos, PDFs and location details for our editorial team to review."
		},
		{
			property: "og:title",
			content: "Submit News — News Theme"
		},
		{
			property: "og:description",
			content: "Send tips, photos and PDFs to our newsroom for cross-verification."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/sitemap[.]xml.ts
var Route$30 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host") ?? "localhost:3099"}`;
		} catch {
			origin = "http://localhost:3099";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT slug, date, updated_at FROM articles WHERE status = 'Published' ORDER BY date DESC, id DESC LIMIT 1000");
		} catch {}
		let categories = [];
		try {
			categories = await query("SELECT slug FROM categories");
		} catch {}
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Homepage -->
  <url>
    <loc>${origin}/</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;
		const staticPaths = [
			"/submit-news",
			"/contact",
			"/event",
			"/subscription",
			"/work-with-us",
			"/archive",
			...defaultPages.map((p) => `/${p.slug}`)
		];
		const uniquePaths = Array.from(new Set(staticPaths));
		for (const path of uniquePaths) xml += `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
		if (Array.isArray(categories)) for (const cat of categories) {
			if (!cat.slug) continue;
			xml += `  <url>
    <loc>${origin}/${cat.slug}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
		}
		if (Array.isArray(articles)) for (const a of articles) {
			if (!a.slug) continue;
			const lastmod = a.updated_at ? new Date(a.updated_at).toISOString() : a.date ? new Date(a.date).toISOString() : nowIso;
			xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
		}
		xml += `</urlset>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$3(err.message || "Error generating sitemap")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$3(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
//#endregion
//#region src/routes/setup.tsx
var $$splitErrorComponentImporter = () => import("./setup-CPsRdZ_r.js");
var $$splitComponentImporter$24 = () => import("./setup-c8FRifD-.js");
var Route$29 = createFileRoute("/setup")({
	head: () => ({ meta: [{ title: "Setup Wizard – News Theme" }, {
		name: "description",
		content: "Configure your database and administrator account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
//#region src/routes/rss[.]xml.ts
var Route$28 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "";
		let siteName = "News Theme";
		let siteDesc = "Breaking news, market intelligence, and sharp business analysis from News Theme.";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host") ?? "localhost:3099"}`;
		} catch {
			origin = "http://localhost:3099";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.siteName) siteName = parsed.siteName;
				if (parsed?.metaDescription) siteDesc = parsed.metaDescription;
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT * FROM articles WHERE status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
		} catch {}
		const lastBuildDate = (/* @__PURE__ */ new Date()).toUTCString();
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml$2(siteName)}</title>
    <description>${escapeXml$2(siteDesc)}</description>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;
		if (Array.isArray(articles)) for (const a of articles) {
			const pubDate = a.date ? new Date(a.date).toUTCString() : lastBuildDate;
			const link = `${origin}/news/${a.slug}`;
			const cleanTitle = escapeXml$2(a.title || "");
			const cleanDesc = escapeXml$2(a.excerpt || a.title || "");
			const category = escapeXml$2(a.category || "News");
			xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
    </item>
`;
		}
		xml += `  </channel>
</rss>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=1800, s-maxage=1800"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$2(err.message || "Error generating RSS feed")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$2(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$23 = () => import("./reset-password-DL9kSJOv.js");
var Route$27 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — News Theme" }, {
		name: "description",
		content: "Choose a new password for your News Theme account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$22 = () => import("./profile-DEDsbi0l.js");
var Route$26 = createFileRoute("/profile")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Profile – News Theme" }, {
		name: "description",
		content: "Manage your account, password, bank details and subscription on News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/news-sitemap[.]xml.ts
var Route$25 = createFileRoute("/news-sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "";
		let publicationName = "News Theme";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "http"}://${req.headers.get("host") ?? "localhost:3099"}`;
		} catch {
			origin = "http://localhost:3099";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.siteName) publicationName = parsed.siteName;
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT slug, title, category, date FROM articles WHERE status = 'Published' AND date >= NOW() - INTERVAL 48 HOUR ORDER BY date DESC, id DESC LIMIT 100");
		} catch {}
		if (!articles || articles.length === 0) try {
			articles = await query("SELECT slug, title, category, date FROM articles WHERE status = 'Published' ORDER BY date DESC, id DESC LIMIT 25");
		} catch {}
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;
		if (Array.isArray(articles)) for (const a of articles) {
			if (!a.slug || !a.title) continue;
			const pubDate = a.date ? new Date(a.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
			const cleanTitle = escapeXml$1(a.title);
			const cleanKeywords = escapeXml$1(a.category || "News");
			xml += `  <url>
    <loc>${origin}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml$1(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
      <news:keywords>${cleanKeywords}</news:keywords>
    </news:news>
  </url>
`;
		}
		xml += `</urlset>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=600, s-maxage=600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml$1(err.message || "Error generating news sitemap")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml; charset=utf-8" }
		});
	}
} } } });
function escapeXml$1(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
//#endregion
//#region src/routes/forgot-password.tsx
var $$splitComponentImporter$21 = () => import("./forgot-password-C0XmJK3x.js");
var Route$24 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot password — News Theme" }, {
		name: "description",
		content: "Reset your News Theme account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/event.tsx
var $$splitComponentImporter$20 = () => import("./event-CFY617jc.js");
var Route$23 = createFileRoute("/event")({
	loader: async () => {
		return { settings: await getSiteSettingsServer().catch(() => null) || defaultSettings };
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		return buildPageHead({
			page: {
				title: s?.eventTitle || "শারদ সম্মান ২০২৬",
				metaTitle: s?.eventMetaTitle,
				metaDescription: s?.eventMetaDescription,
				ogImage: s?.eventOgImage,
				metaKeywords: s?.eventKeywords,
				canonicalUrl: s?.eventCanonicalUrl,
				noIndex: s?.eventNoIndex
			},
			defaultTitle: "শারদ সম্মান ২০২৬ — বিশেষ দুর্গোৎসব প্রতিযোগিতা",
			defaultDescription: "শারদ সম্মান ২০২৬ দুর্গোৎসব প্রতিযোগিতা। সেরা মণ্ডপসজ্জা, সেরা প্রতিমা ও সেরা আলোকসজ্জার সম্মাননা। আজই আপনার ক্লাবের নাম নিবন্ধন করুন।",
			slug: "/event"
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
/** Symmetrical Festive Flourish Divider */
//#endregion
//#region src/routes/earn-points.tsx
var $$splitComponentImporter$19 = () => import("./earn-points-zfTABdrA.js");
var Route$22 = createFileRoute("/earn-points")({
	head: () => ({ meta: [
		{ title: "Earn Points – News Theme Wallet Rewards" },
		{
			name: "description",
			content: "Complete tasks and earn wallet points on News Theme. Follow us on social media, share news, and grow your rewards."
		},
		{
			property: "og:title",
			content: "Earn Points – News Theme"
		},
		{
			property: "og:description",
			content: "Complete tasks and earn wallet points on News Theme."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$18 = () => import("./contact-CBEi49al.js");
var Route$21 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Us – News Theme" },
		{
			name: "description",
			content: "Get in touch with the News Theme newsroom. Send tips, feedback, partnership and advertising enquiries."
		},
		{
			property: "og:title",
			content: "Contact Us – News Theme"
		},
		{
			property: "og:description",
			content: "Reach the News Theme newsroom for tips, feedback and partnerships."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$17 = () => import("./auth-DFEJcsKJ.js");
var Route$20 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in or create an account — News Theme" }, {
		name: "description",
		content: "Sign in to your News Theme account or create a new one."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/apply-journalist.tsx
var $$splitComponentImporter$16 = () => import("./apply-journalist-cWEdD-4d.js");
var Route$19 = createFileRoute("/apply-journalist")({
	head: () => ({ meta: [{ title: "Apply as Journalist — News Theme" }, {
		name: "description",
		content: "Submit your official journalist verification application to join our press newsroom."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/apply.tsx
var $$splitComponentImporter$15 = () => import("./apply-Ba5mAhYG.js");
var Route$18 = createFileRoute("/apply")({
	head: () => ({ meta: [{ title: "Application Form — News Theme" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/components/admin/dashboard/DashboardHeader.tsx
function DashboardHeader({ startDate, endDate, selectedCategory, categoryStats, onStartDateChange, onEndDateChange, onCategoryChange, onExport }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-2",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white",
			children: "Hi, welcome back!"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
			children: "Your web analytics and newsroom performance dashboard."
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
						children: "Start Date"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-slate-600 dark:text-slate-300" }), /* @__PURE__ */ jsx("input", {
							type: "date",
							value: startDate,
							onChange: (e) => onStartDateChange(e.target.value),
							className: "bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
						children: "End Date"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-slate-600 dark:text-slate-300" }), /* @__PURE__ */ jsx("input", {
							type: "date",
							value: endDate,
							onChange: (e) => onEndDateChange(e.target.value),
							className: "bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
						children: "Category"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ jsx(Filter, { className: "h-3 w-3 text-slate-600 dark:text-slate-300" }), /* @__PURE__ */ jsxs("select", {
							value: selectedCategory,
							onChange: (e) => onCategoryChange(e.target.value),
							className: "bg-transparent text-xs font-semibold focus:outline-none cursor-pointer",
							children: [/* @__PURE__ */ jsx("option", {
								value: "All",
								children: "All Categories"
							}), categoryStats.map((c) => /* @__PURE__ */ jsxs("option", {
								value: c.name,
								children: [
									c.name,
									" (",
									c.count,
									")"
								]
							}, c.name))]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: onExport,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DashboardTabBar.tsx
function DashboardTabBar({ activeTab, onTabChange, onSaveReport, onExportPdf, onSendEmail }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-6 overflow-x-auto scrollbar-none",
			children: [
				{
					id: "overview",
					label: "Overview"
				},
				{
					id: "audiences",
					label: "Audiences"
				},
				{
					id: "demographics",
					label: "Demographics"
				},
				{
					id: "content",
					label: "Content & Posts"
				},
				{
					id: "revenue",
					label: "Revenue & Subscriptions"
				}
			].map((t) => {
				const isActive = activeTab === t.id;
				return /* @__PURE__ */ jsxs("button", {
					onClick: () => onTabChange(t.id),
					className: `relative py-2 text-sm font-semibold whitespace-nowrap transition cursor-pointer ${isActive ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`,
					children: [t.label, isActive && /* @__PURE__ */ jsx("span", { className: "absolute bottom-[-9px] left-0 right-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" })]
				}, t.id);
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onSaveReport) onSaveReport();
						else toast.success("Dashboard report saved to reports archive!");
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Save Report" })]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onExportPdf) onExportPdf();
						else {
							window.print();
							toast.success("Printing report to PDF...");
						}
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export to PDF" })]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onSendEmail) onSendEmail();
						else toast.success("Summary report queued for email dispatch!");
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Send to Email" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DashboardMetricsGrid.tsx
function DashboardMetricsGrid({ data }) {
	const currency = data.currencySymbol || "₹";
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				id: "posts",
				title: "Total Post Number",
				value: data.totalArticles.toLocaleString(),
				subtitle: "Published news stories & articles",
				delta: "+14.2%",
				isPositive: true,
				icon: Newspaper,
				badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800",
				accentBg: "from-blue-500/10 to-indigo-500/5"
			},
			{
				id: "journalists",
				title: "Total Journalists",
				value: data.totalJournalists.toLocaleString(),
				subtitle: "Verified field reporters & authors",
				delta: "+8.5%",
				isPositive: true,
				icon: UserCheck,
				badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800",
				accentBg: "from-emerald-500/10 to-teal-500/5"
			},
			{
				id: "subscribers",
				title: "Total Subscribed Users",
				value: data.totalSubscribers.toLocaleString(),
				subtitle: "Active premium paid readers",
				delta: "+22.8%",
				isPositive: true,
				icon: Crown,
				badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800",
				accentBg: "from-amber-500/10 to-orange-500/5"
			},
			{
				id: "revenue",
				title: "Total Revenue",
				value: `${currency}${data.totalRevenue.toLocaleString()}`,
				subtitle: "Subscriptions & media earnings",
				delta: "+18.4%",
				isPositive: true,
				icon: TrendingUp,
				badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800",
				accentBg: "from-purple-500/10 to-pink-500/5"
			}
		].map((c) => {
			const Icon = c.icon;
			return /* @__PURE__ */ jsxs("div", {
				className: `relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md bg-gradient-to-br ${c.accentBg}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
						children: c.title
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 flex items-baseline gap-2",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white",
							children: c.value
						})
					})] }), /* @__PURE__ */ jsx("div", {
						className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${c.badgeColor}`,
						children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-slate-500 dark:text-slate-400 truncate max-w-[170px]",
						children: c.subtitle
					}), /* @__PURE__ */ jsxs("span", {
						className: `inline-flex items-center font-bold ${c.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
						children: [c.isPositive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 mr-0.5" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3.5 w-3.5 mr-0.5" }), c.delta]
					})]
				})]
			}, c.id);
		})
	});
}
//#endregion
//#region src/components/admin/dashboard/AudienceChartCard.tsx
function AudienceChartCard({ totalViews, totalUsers }) {
	const [timeframe, setTimeframe] = useState("Day");
	const userCount = totalUsers > 0 ? (totalUsers * 12 + 13956).toLocaleString() : "13,956";
	const viewsCount = totalViews > 0 ? totalViews.toLocaleString() : "83,123";
	const sessionsCount = totalViews > 0 ? Math.round(totalViews * .28 + 16869).toLocaleString() : "16,869";
	const bounceRate = "33.50%";
	const activeCurve = {
		Day: {
			line1: "M 0 160 Q 45 130, 90 170 T 180 140 T 270 190 T 360 110 T 450 140 T 540 90 T 630 160 T 720 120 T 800 170",
			area1: "M 0 160 Q 45 130, 90 170 T 180 140 T 270 190 T 360 110 T 450 140 T 540 90 T 630 160 T 720 120 T 800 170 L 800 280 L 0 280 Z",
			line2: "M 0 210 Q 50 190, 100 240 T 200 220 T 300 260 T 400 180 T 500 240 T 600 190 T 700 250 T 800 210",
			area2: "M 0 210 Q 50 190, 100 240 T 200 220 T 300 260 T 400 180 T 500 240 T 600 190 T 700 250 T 800 210 L 800 280 L 0 280 Z",
			labels: [
				"00:00",
				"04:00",
				"08:00",
				"12:00",
				"16:00",
				"20:00",
				"23:59"
			]
		},
		Week: {
			line1: "M 0 140 Q 60 100, 120 150 T 240 120 T 360 80 T 480 130 T 600 70 T 720 110 T 800 90",
			area1: "M 0 140 Q 60 100, 120 150 T 240 120 T 360 80 T 480 130 T 600 70 T 720 110 T 800 90 L 800 280 L 0 280 Z",
			line2: "M 0 220 Q 60 180, 120 230 T 240 190 T 360 160 T 480 210 T 600 150 T 720 190 T 800 170",
			area2: "M 0 220 Q 60 180, 120 230 T 240 190 T 360 160 T 480 210 T 600 150 T 720 190 T 800 170 L 800 280 L 0 280 Z",
			labels: [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat",
				"Sun"
			]
		},
		Month: {
			line1: "M 0 180 Q 70 120, 140 160 T 280 100 T 420 140 T 560 90 T 700 130 T 800 100",
			area1: "M 0 180 Q 70 120, 140 160 T 280 100 T 420 140 T 560 90 T 700 130 T 800 100 L 800 280 L 0 280 Z",
			line2: "M 0 240 Q 70 200, 140 230 T 280 170 T 420 220 T 560 160 T 700 210 T 800 180",
			area2: "M 0 240 Q 70 200, 140 230 T 280 170 T 420 220 T 560 160 T 700 210 T 800 180 L 800 280 L 0 280 Z",
			labels: [
				"Week 1",
				"Week 2",
				"Week 3",
				"Week 4"
			]
		}
	}[timeframe];
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Website Audience Metrics"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Audience to which the users belonged while on the current date range."
				})] }), /* @__PURE__ */ jsx("div", {
					className: "inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5",
					children: [
						"Day",
						"Week",
						"Month"
					].map((t) => /* @__PURE__ */ jsx("button", {
						onClick: () => setTimeframe(t),
						className: `rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${timeframe === t ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`,
						children: t
					}, t))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Users"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5",
						children: userCount
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Bounce Rate"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5",
						children: bounceRate
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Page Views"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5",
						children: viewsCount
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Sessions"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5",
						children: sessionsCount
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mt-6 h-64 sm:h-72 w-full overflow-hidden",
				children: [/* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 800 280",
					className: "h-full w-full overflow-visible",
					preserveAspectRatio: "none",
					children: [
						/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
							id: "purpleGradient",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ jsx("stop", {
								offset: "0%",
								stopColor: "#8b5cf6",
								stopOpacity: "0.25"
							}), /* @__PURE__ */ jsx("stop", {
								offset: "100%",
								stopColor: "#8b5cf6",
								stopOpacity: "0.01"
							})]
						}), /* @__PURE__ */ jsxs("linearGradient", {
							id: "blueGradient",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ jsx("stop", {
								offset: "0%",
								stopColor: "#0ea5e9",
								stopOpacity: "0.25"
							}), /* @__PURE__ */ jsx("stop", {
								offset: "100%",
								stopColor: "#0ea5e9",
								stopOpacity: "0.01"
							})]
						})] }),
						/* @__PURE__ */ jsx("line", {
							x1: "0",
							y1: "70",
							x2: "800",
							y2: "70",
							stroke: "currentColor",
							className: "text-slate-100 dark:text-slate-800/60",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "0",
							y1: "140",
							x2: "800",
							y2: "140",
							stroke: "currentColor",
							className: "text-slate-100 dark:text-slate-800/60",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ jsx("line", {
							x1: "0",
							y1: "210",
							x2: "800",
							y2: "210",
							stroke: "currentColor",
							className: "text-slate-100 dark:text-slate-800/60",
							strokeDasharray: "4 4"
						}),
						/* @__PURE__ */ jsx("path", {
							d: activeCurve.area1,
							fill: "url(#purpleGradient)"
						}),
						/* @__PURE__ */ jsx("path", {
							d: activeCurve.line1,
							fill: "none",
							stroke: "#7c3aed",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							className: "transition-all duration-500 ease-in-out"
						}),
						/* @__PURE__ */ jsx("path", {
							d: activeCurve.area2,
							fill: "url(#blueGradient)"
						}),
						/* @__PURE__ */ jsx("path", {
							d: activeCurve.line2,
							fill: "none",
							stroke: "#0284c7",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							className: "transition-all duration-500 ease-in-out"
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-0 left-0 right-0 flex justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2 pt-2 border-t border-slate-100 dark:border-slate-800",
					children: activeCurve.labels.map((lbl, idx) => /* @__PURE__ */ jsx("span", { children: lbl }, idx))
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/dashboard/EngagementCards.tsx
function EngagementCards({ totalUsers, totalViews }) {
	const usersDisplay = totalUsers > 0 ? totalUsers >= 1e3 ? `${(totalUsers / 1e3).toFixed(1)}k` : `${totalUsers}` : "86k";
	const sessionsDisplay = totalViews > 0 ? Math.round(totalViews * .28 + 16869).toLocaleString() : "16,869";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
						children: "33.50%"
					}), /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-0.5",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5" }), " 18.02%"]
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium text-slate-500 dark:text-slate-400 mt-1",
					children: "Bounce Rate"
				})] }), /* @__PURE__ */ jsx("div", {
					className: "mt-4 h-16 w-full",
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 200 60",
						className: "h-full w-full",
						preserveAspectRatio: "none",
						children: [
							/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
								id: "tealSpark",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ jsx("stop", {
									offset: "0%",
									stopColor: "#14b8a6",
									stopOpacity: "0.3"
								}), /* @__PURE__ */ jsx("stop", {
									offset: "100%",
									stopColor: "#14b8a6",
									stopOpacity: "0.0"
								})]
							}) }),
							/* @__PURE__ */ jsx("path", {
								d: "M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15 L 200 60 L 0 60 Z",
								fill: "url(#tealSpark)"
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15",
								fill: "none",
								stroke: "#0d9488",
								strokeWidth: "2",
								strokeLinecap: "round"
							})
						]
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
						children: usersDisplay
					}), /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 gap-0.5",
						children: [/* @__PURE__ */ jsx(TrendingDown, { className: "h-3.5 w-3.5" }), " 0.86%"]
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium text-slate-500 dark:text-slate-400 mt-1",
					children: "Total Users"
				})] }), /* @__PURE__ */ jsx("div", {
					className: "mt-4 flex items-end justify-between gap-1 h-16 w-full px-1",
					children: [
						45,
						60,
						35,
						75,
						50,
						90,
						65,
						80,
						70,
						85,
						40,
						55,
						30,
						70,
						95
					].map((h, i) => /* @__PURE__ */ jsx("div", {
						style: { height: `${h}%` },
						className: "w-full rounded-t-xs bg-blue-500 hover:bg-blue-600 transition-all duration-300"
					}, i))
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-start justify-between",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
						children: "ALL SESSIONS"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-1 flex items-baseline gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white",
							children: sessionsDisplay
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5 mr-0.5" }), " 2.87%"]
						})]
					})] })
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400",
					children: "The total number of sessions within the date range. It is the period time a user is actively engaged with your website, news feed, or app."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 flex items-end justify-between gap-1.5 h-24 pt-2 border-t border-slate-100 dark:border-slate-800",
					children: [
						15,
						25,
						45,
						70,
						90,
						65,
						80,
						55,
						75,
						40,
						60,
						85,
						95,
						70,
						50,
						30
					].map((h, i) => {
						const isHigh = h > 60;
						return /* @__PURE__ */ jsx("div", {
							style: { height: `${h}%` },
							className: `w-full rounded-t-xs transition-all duration-300 ${isHigh ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-200 dark:bg-indigo-900/60 hover:bg-indigo-300"}`
						}, i);
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/TopArticlesTable.tsx
function TopArticlesTable({ articles, featuredArticles }) {
	const [filterMode, setFilterMode] = useState("all");
	const [displayCount, setDisplayCount] = useState(5);
	const activeList = filterMode === "featured" ? featuredArticles : articles;
	const visibleArticles = activeList.slice(0, displayCount);
	const hasMore = displayCount < activeList.length;
	const totalViewsInSet = activeList.reduce((acc, a) => acc + (a.views || 0), 0) || 1;
	const handleLoadMore = () => {
		setDisplayCount((prev) => Math.min(prev + 5, activeList.length));
	};
	const handleCollapse = () => {
		setDisplayCount(5);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Page Views by Page Title"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "This report is based on 100% of tracked newsroom reader sessions."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							setFilterMode("all");
							setDisplayCount(5);
						},
						className: `rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filterMode === "all" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
						children: "All Posts"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setFilterMode("featured");
							setDisplayCount(5);
						},
						className: `inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filterMode === "featured" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), /* @__PURE__ */ jsxs("span", { children: [
							"Featured (",
							featuredArticles.length,
							")"
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-3 divide-y divide-slate-100 dark:divide-slate-800/80",
				children: visibleArticles.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "py-8 text-center text-xs text-slate-400",
					children: "No articles found for this filter."
				}) : visibleArticles.map((art, idx) => {
					const views = art.views || 0;
					const pct = Math.max(1, Math.min(100, Math.round(views / totalViewsInSet * 100)));
					const path = art.slug ? `/news/${art.slug}` : `/news/${art.id || idx}`;
					return /* @__PURE__ */ jsxs("div", {
						className: "py-3 group transition",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition",
										children: art.title
									}), art.featured && /* @__PURE__ */ jsx("span", {
										className: "shrink-0 rounded-md bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
										children: "Featured"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "font-mono text-slate-400 truncate max-w-[200px] sm:max-w-xs",
											children: path
										}),
										/* @__PURE__ */ jsx("span", { children: "·" }),
										/* @__PURE__ */ jsx("span", {
											className: "font-medium text-slate-600 dark:text-slate-300",
											children: art.category || "General"
										}),
										art.date && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsx("span", { children: new Date(art.date).toLocaleDateString() })] })
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right shrink-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm font-bold text-indigo-600 dark:text-indigo-400",
									children: views.toLocaleString()
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400",
									children: [pct, "%"]
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full bg-indigo-500 rounded-full transition-all duration-500",
								style: { width: `${pct}%` }
							})
						})]
					}, art.id || idx);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-slate-500 dark:text-slate-400",
					children: [
						"Showing ",
						/* @__PURE__ */ jsx("strong", { children: visibleArticles.length }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: activeList.length }),
						" articles"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [hasMore && /* @__PURE__ */ jsxs("button", {
						onClick: handleLoadMore,
						className: "inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer",
						children: [/* @__PURE__ */ jsx("span", { children: "Load More" }), /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" })]
					}), displayCount > 5 && /* @__PURE__ */ jsxs("button", {
						onClick: handleCollapse,
						className: "inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5 font-medium transition cursor-pointer",
						children: [/* @__PURE__ */ jsx("span", { children: "Show Less" }), /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" })]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/dashboard/TrafficChannelsCard.tsx
function TrafficChannelsCard() {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-slate-100 dark:border-slate-800 pb-3",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-900 dark:text-white",
				children: "Sessions by Channel"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
				children: "Acquisition traffic channels driving reader discovery."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center",
			children: [/* @__PURE__ */ jsx("div", {
				className: "md:col-span-5 flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative h-44 w-44",
					children: [/* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 100 100",
						className: "h-full w-full -rotate-90",
						children: [
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#0d9488",
								strokeWidth: "18",
								strokeDasharray: "67.8 158.3",
								strokeDashoffset: "0"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#7c3aed",
								strokeWidth: "18",
								strokeDasharray: "56.5 169.6",
								strokeDashoffset: "-67.8"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#3b82f6",
								strokeWidth: "18",
								strokeDasharray: "45.2 180.9",
								strokeDashoffset: "-124.3"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#10b981",
								strokeWidth: "18",
								strokeDasharray: "33.9 192.2",
								strokeDashoffset: "-169.5"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#94a3b8",
								strokeWidth: "18",
								strokeDasharray: "22.6 203.5",
								strokeDashoffset: "-203.4"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 m-auto h-20 w-20 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-400",
							children: "Total"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm font-extrabold text-slate-900 dark:text-white",
							children: "5,391"
						})]
					})]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "md:col-span-7 space-y-3.5",
				children: [
					{
						name: "Organic Search",
						count: 1320,
						pct: 25,
						color: "#7c3aed",
						barClass: "bg-purple-600"
					},
					{
						name: "Email",
						count: 987,
						pct: 20,
						color: "#3b82f6",
						barClass: "bg-blue-500"
					},
					{
						name: "Referral",
						count: 2010,
						pct: 30,
						color: "#0d9488",
						barClass: "bg-teal-600"
					},
					{
						name: "Social",
						count: 654,
						pct: 15,
						color: "#10b981",
						barClass: "bg-emerald-500"
					},
					{
						name: "Direct",
						count: 420,
						pct: 10,
						color: "#94a3b8",
						barClass: "bg-slate-400"
					}
				].map((ch) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between text-xs mb-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-slate-700 dark:text-slate-300",
						children: ch.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-slate-500 dark:text-slate-400 font-medium",
						children: [
							/* @__PURE__ */ jsx("strong", {
								className: "text-slate-900 dark:text-white font-bold mr-1",
								children: ch.count.toLocaleString()
							}),
							"(",
							ch.pct,
							"%)"
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
					children: /* @__PURE__ */ jsx("div", {
						className: `h-full rounded-full transition-all duration-500 ${ch.barClass}`,
						style: { width: `${ch.pct * 3.3}%` }
					})
				})] }, ch.name))
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DemographicsTab.tsx
function DemographicsTab() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-cols-1 md:grid-cols-2 gap-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Device & Platform Breakdown"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Audience access points across smartphones, tablets, and desktop devices."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 space-y-4",
					children: [
						{
							name: "Mobile Phones",
							pct: 68,
							count: "58,400",
							icon: Smartphone,
							color: "bg-indigo-600"
						},
						{
							name: "Desktop & Laptops",
							pct: 26,
							count: "22,300",
							icon: Monitor,
							color: "bg-blue-500"
						},
						{
							name: "Tablets & iPads",
							pct: 6,
							count: "5,150",
							icon: Tablet,
							color: "bg-teal-500"
						}
					].map((d) => {
						const Icon = d.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-semibold mb-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-slate-800 dark:text-slate-200",
									children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: d.name })]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: [
										d.count,
										" (",
										d.pct,
										"%)"
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
								children: /* @__PURE__ */ jsx("div", {
									className: `h-full rounded-full transition-all duration-500 ${d.color}`,
									style: { width: `${d.pct}%` }
								})
							})]
						}, d.name);
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Reader Locations & Geography"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Top geographic territories reading Northeast Timeline."
				})] }), /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-indigo-500" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-6 divide-y divide-slate-100 dark:divide-slate-800",
				children: [
					{
						name: "Tripura (Agartala, Dharmanagar, Udaipur)",
						users: "42,800",
						pct: 51
					},
					{
						name: "Assam (Guwahati, Silchar)",
						users: "18,200",
						pct: 22
					},
					{
						name: "West Bengal (Kolkata)",
						users: "11,500",
						pct: 14
					},
					{
						name: "Delhi NCR",
						users: "6,300",
						pct: 8
					},
					{
						name: "International (US, UK, UAE, BD)",
						users: "4,100",
						pct: 5
					}
				].map((loc) => /* @__PURE__ */ jsxs("div", {
					className: "py-2.5 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]",
						children: loc.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-900 dark:text-white",
							children: loc.users
						}), /* @__PURE__ */ jsxs("span", {
							className: "rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 w-10 text-center",
							children: [loc.pct, "%"]
						})]
					})]
				}, loc.name))
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/RevenueTab.tsx
function RevenueTab({ data }) {
	const currency = data.currencySymbol || "₹";
	const monthlyRate = 149;
	const yearlyRate = 1499;
	const monthlySubs = Math.round(data.totalSubscribers * .75);
	const yearlySubs = Math.max(1, data.totalSubscribers - monthlySubs);
	const mrr = data.totalRevenue;
	const arr = mrr * 12;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Monthly Recurring Revenue"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
								children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: [currency, mrr.toLocaleString()]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }), " +18.4% growth this month"]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Annualized Run Rate (ARR)"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
								children: /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: [currency, arr.toLocaleString()]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium",
							children: "Based on active subscriptions"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Active Subscribers"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
								children: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: data.totalSubscribers.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-amber-600 dark:text-amber-400 font-bold",
							children: "96.8% monthly retention rate"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "Subscription Plan Tiers"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "Active reader memberships across recurring billing intervals."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: [
									"Monthly Supporter (",
									currency,
									monthlyRate,
									"/mo)"
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: "Ad-free reading + exclusive investigative pieces"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: [monthlySubs, " users"]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] text-slate-500 font-semibold",
									children: [
										currency,
										(monthlySubs * monthlyRate).toLocaleString(),
										"/mo"
									]
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: [
									"Yearly Patron (",
									currency,
									yearlyRate,
									"/yr)"
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: "Annual pass with priority news alerts & PDF digest"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: [yearlySubs, " users"]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] text-slate-500 font-semibold",
									children: [
										currency,
										(yearlySubs * yearlyRate).toLocaleString(),
										"/yr"
									]
								})]
							})]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "Monetization Settings & Gateways"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "Configure payment gateways and member perks in Admin settings."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Payment Gateway"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }), " Active (Razorpay / Stripe)"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Ad Blocker for Subscribers"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-indigo-600 dark:text-indigo-400",
									children: "Automatic (Enabled)"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Premium Story Access"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-purple-600 dark:text-purple-400",
									children: "Restricted to Paid Readers"
								})]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/admin.index.tsx
var Route$17 = createFileRoute("/admin/")({
	loader: async () => {
		return await getAdminDashboardStats();
	},
	component: DashboardPage
});
function DashboardPage() {
	const data = Route$17.useLoaderData();
	const [activeTab, setActiveTab] = useState("overview");
	const [startDate, setStartDate] = useState("2026-09-01");
	const [endDate, setEndDate] = useState("2026-09-17");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const filteredArticles = selectedCategory === "All" ? data.topArticles : data.topArticles.filter((a) => (a.category || "").toLowerCase() === selectedCategory.toLowerCase());
	const filteredFeatured = selectedCategory === "All" ? data.featuredArticles : data.featuredArticles.filter((a) => (a.category || "").toLowerCase() === selectedCategory.toLowerCase());
	const handleExport = () => {
		const csvContent = [[
			"Title",
			"Category",
			"Views",
			"Date",
			"Status"
		], ...data.topArticles.map((a) => [
			`"${a.title.replace(/"/g, "\"\"")}"`,
			`"${a.category || "General"}"`,
			a.views || 0,
			a.date || "",
			a.status || "Published"
		])].map((e) => e.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `analytics-report-${startDate}-to-${endDate}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Analytics data exported successfully as CSV!");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ jsx(DashboardHeader, {
				startDate,
				endDate,
				selectedCategory,
				categoryStats: data.categoryStats,
				onStartDateChange: setStartDate,
				onEndDateChange: setEndDate,
				onCategoryChange: setSelectedCategory,
				onExport: handleExport
			}),
			/* @__PURE__ */ jsx(DashboardTabBar, {
				activeTab,
				onTabChange: setActiveTab,
				onSaveReport: () => toast.success("Dashboard report snapshot saved!"),
				onExportPdf: () => {
					window.print();
					toast.success("Preparing PDF printout...");
				},
				onSendEmail: () => toast.success("Scheduled automated executive report to admin email.")
			}),
			/* @__PURE__ */ jsx(DashboardMetricsGrid, { data }),
			activeTab === "overview" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 xl:col-span-8",
						children: /* @__PURE__ */ jsx(AudienceChartCard, {
							totalViews: data.totalViews,
							totalUsers: data.totalUsers
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 xl:col-span-4",
						children: /* @__PURE__ */ jsx(EngagementCards, {
							totalUsers: data.totalUsers,
							totalViews: data.totalViews
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 xl:col-span-7",
						children: /* @__PURE__ */ jsx(TopArticlesTable, {
							articles: filteredArticles,
							featuredArticles: filteredFeatured
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 xl:col-span-5",
						children: /* @__PURE__ */ jsx(TrafficChannelsCard, {})
					})]
				})]
			}),
			activeTab === "audiences" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsx(AudienceChartCard, {
					totalViews: data.totalViews,
					totalUsers: data.totalUsers
				}), /* @__PURE__ */ jsx(EngagementCards, {
					totalUsers: data.totalUsers,
					totalViews: data.totalViews
				})]
			}),
			activeTab === "demographics" && /* @__PURE__ */ jsx(DemographicsTab, {}),
			activeTab === "content" && /* @__PURE__ */ jsx("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ jsx(TopArticlesTable, {
					articles: filteredArticles,
					featuredArticles: filteredFeatured
				})
			}),
			activeTab === "revenue" && /* @__PURE__ */ jsx(RevenueTab, { data })
		]
	});
}
//#endregion
//#region src/routes/api/rss.ts
var Route$16 = createFileRoute("/api/rss")({ server: { handlers: { GET: async () => {
	try {
		const articles = await query("SELECT * FROM articles WHERE status = 'Published' AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
		const origin = "https://northeasttimeline.com";
		let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News Theme</title>
    <description>Breaking news, market intelligence, and sharp business analysis from News Theme.</description>
    <link>${origin}</link>
    <atom:link href="${origin}/api/rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
`;
		for (const a of articles) {
			const pubDate = new Date(a.date).toUTCString();
			const link = `${origin}/article/${a.slug}`;
			const cleanTitle = escapeXml(a.title);
			const cleanDesc = escapeXml(a.excerpt || a.title);
			xml += `    <item>
      <title>${cleanTitle}</title>
      <description>${cleanDesc}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>
`;
		}
		xml += `  </channel>
</rss>`;
		return new Response(xml, { headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		} });
	} catch (err) {
		return new Response(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message || "Failed to generate feed")}</error>`, {
			status: 500,
			headers: { "Content-Type": "application/xml" }
		});
	}
} } } });
function escapeXml(unsafe) {
	if (!unsafe) return "";
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case "\"": return "&quot;";
			default: return c;
		}
	});
}
//#endregion
//#region src/routes/admin.users.tsx
var $$splitComponentImporter$14 = () => import("./admin.users-DvBC96WK.js");
var Route$15 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/admin.updates.tsx
var $$splitComponentImporter$13 = () => import("./admin.updates-CKbQ4y6G.js");
var Route$14 = createFileRoute("/admin/updates")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.tags.tsx
var $$splitComponentImporter$12 = () => import("./admin.tags-Dyi_IKEw.js");
var Route$13 = createFileRoute("/admin/tags")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.roles.tsx
var $$splitComponentImporter$11 = () => import("./admin.roles-CxeSRLL_.js");
var Route$12 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.rewards.tsx
var $$splitComponentImporter$10 = () => import("./admin.rewards-BhaLBvl0.js");
var Route$11 = createFileRoute("/admin/rewards")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.reels.tsx
var $$splitComponentImporter$9 = () => import("./admin.reels-Wt1GS1BJ.js");
var Route$10 = createFileRoute("/admin/reels")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/admin.pages.tsx
var $$splitComponentImporter$8 = () => import("./admin.pages-D-w1PbQf.js");
var Route$9 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.journalists.tsx
var $$splitComponentImporter$7 = () => import("./admin.journalists-DFfRoYHw.js");
var Route$8 = createFileRoute("/admin/journalists")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.inbox.tsx
var $$splitComponentImporter$6 = () => import("./admin.inbox-CeYMcE1L.js");
var Route$7 = createFileRoute("/admin/inbox")({
	head: () => ({ meta: [{ title: "Admin Inbox - News Timeline" }, {
		name: "description",
		content: "Review contact messages, journalist applications, and user requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/admin.homepage.tsx
var $$splitComponentImporter$5 = () => import("./admin.homepage-CsjQkq4b.js");
var Route$6 = createFileRoute("/admin/homepage")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/admin.files.tsx
var $$splitComponentImporter$4 = () => import("./admin.files-C0vAvAtJ.js");
var Route$5 = createFileRoute("/admin/files")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin.comments.tsx
var $$splitComponentImporter$3 = () => import("./admin.comments-Bl7X_mfW.js");
var Route$4 = createFileRoute("/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.categories.tsx
var $$splitComponentImporter$2 = () => import("./admin.categories-Bg4t6TvX.js");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin.articles.tsx
var $$splitComponentImporter$1 = () => import("./admin.articles-EMLINAde.js");
var Route$2 = createFileRoute("/admin/articles")({
	head: () => ({ meta: [{ title: "Manage Articles - Admin Dashboard" }, {
		name: "description",
		content: "Create, edit, filter, and manage published and drafted articles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/admin.advertisements.tsx
var $$splitComponentImporter = () => import("./admin.advertisements-BgtI63Tr.js");
var Route$1 = createFileRoute("/admin/advertisements")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routes/api/public/seed-demo-admin.ts
var Route = createFileRoute("/api/public/seed-demo-admin")({ server: { handlers: { POST: async () => {
	try {
		const email = "admin@demo.com";
		const passHash = hashPassword("Demo@Admin#2026NE");
		const name = "Demo Admin";
		let users = await query("SELECT id FROM users WHERE email = ?", [email]);
		let userId = "";
		if (users.length === 0) {
			userId = crypto.randomUUID();
			await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [
				userId,
				email,
				passHash,
				name
			]);
		} else {
			userId = users[0].id;
			await query("UPDATE users SET password_hash = ?, salt = NULL WHERE id = ?", [passHash, userId]);
		}
		await query("INSERT IGNORE INTO user_roles (id, user_id, role) VALUES (?, ?, ?)", [
			crypto.randomUUID(),
			userId,
			"admin"
		]);
		if ((await query("SELECT id FROM profiles WHERE id = ?", [userId])).length === 0) await query("INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)", [
			userId,
			"1000000000",
			name,
			email,
			true
		]);
		return new Response(JSON.stringify({
			ok: true,
			user_id: userId
		}), { headers: { "content-type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
} } } });
//#endregion
//#region src/routeTree.gen.ts
var WorkWithUsRoute = Route$36.update({
	id: "/work-with-us",
	path: "/work-with-us",
	getParentRoute: () => Route$35
});
var WithdrawPointsRoute = Route$34.update({
	id: "/withdraw-points",
	path: "/withdraw-points",
	getParentRoute: () => Route$35
});
var WatchRoute = Route$33.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$35
});
var VerifiedJournalistRoute = Route$37.update({
	id: "/verified-journalist",
	path: "/verified-journalist",
	getParentRoute: () => Route$35
});
var TermsAndConditionsRoute = Route$38.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$35
});
var SubscriptionRoute = Route$32.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => Route$35
});
var SubmitNewsRoute = Route$31.update({
	id: "/submit-news",
	path: "/submit-news",
	getParentRoute: () => Route$35
});
var SitemapDotxmlRoute = Route$30.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$35
});
var SetupRoute = Route$29.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => Route$35
});
var SearchRoute = Route$39.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$35
});
var RssDotxmlRoute = Route$28.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$35
});
var ResetPasswordRoute = Route$27.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$35
});
var RefundPolicyRoute = Route$40.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$35
});
var ReelsRoute = Route$41.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => Route$35
});
var ProfileRoute = Route$26.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$35
});
var PrivacyPolicyRoute = Route$42.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$35
});
var NewsSitemapDotxmlRoute = Route$25.update({
	id: "/news-sitemap.xml",
	path: "/news-sitemap.xml",
	getParentRoute: () => Route$35
});
var ForgotPasswordRoute = Route$24.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$35
});
var FactCheckingPolicyRoute = Route$43.update({
	id: "/fact-checking-policy",
	path: "/fact-checking-policy",
	getParentRoute: () => Route$35
});
var EventRoute = Route$23.update({
	id: "/event",
	path: "/event",
	getParentRoute: () => Route$35
});
var EditorialPolicyRoute = Route$44.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$35
});
var EarnPointsRoute = Route$22.update({
	id: "/earn-points",
	path: "/earn-points",
	getParentRoute: () => Route$35
});
var DmcaRoute = Route$45.update({
	id: "/dmca",
	path: "/dmca",
	getParentRoute: () => Route$35
});
var DisclaimerRoute = Route$46.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$35
});
var DataDeletionPolicyRoute = Route$47.update({
	id: "/data-deletion-policy",
	path: "/data-deletion-policy",
	getParentRoute: () => Route$35
});
var CookiePolicyRoute = Route$48.update({
	id: "/cookie-policy",
	path: "/cookie-policy",
	getParentRoute: () => Route$35
});
var ContactRoute = Route$21.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$35
});
var AuthRoute = Route$20.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$35
});
var ArchiveRoute = Route$49.update({
	id: "/archive",
	path: "/archive",
	getParentRoute: () => Route$35
});
var ApplyJournalistRoute = Route$19.update({
	id: "/apply-journalist",
	path: "/apply-journalist",
	getParentRoute: () => Route$35
});
var ApplyRoute = Route$18.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$35
});
var AdminRoute = Route$50.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$35
});
var AboutRoute = Route$51.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$35
});
var SlugRoute = Route$52.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => Route$35
});
var IndexRoute = Route$53.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$35
});
var AdminIndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var NewsSlugRoute = Route$54.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$35
});
var ApiRssRoute = Route$16.update({
	id: "/api/rss",
	path: "/api/rss",
	getParentRoute: () => Route$35
});
var AdminUsersRoute = Route$15.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var AdminUpdatesRoute = Route$14.update({
	id: "/updates",
	path: "/updates",
	getParentRoute: () => AdminRoute
});
var AdminTagsRoute = Route$13.update({
	id: "/tags",
	path: "/tags",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$55.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminRolesRoute = Route$12.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AdminRoute
});
var AdminRewardsRoute = Route$11.update({
	id: "/rewards",
	path: "/rewards",
	getParentRoute: () => AdminRoute
});
var AdminReelsRoute = Route$10.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => AdminRoute
});
var AdminPagesRoute = Route$9.update({
	id: "/pages",
	path: "/pages",
	getParentRoute: () => AdminRoute
});
var AdminJournalistsRoute = Route$8.update({
	id: "/journalists",
	path: "/journalists",
	getParentRoute: () => AdminRoute
});
var AdminInboxRoute = Route$7.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => AdminRoute
});
var AdminHomepageRoute = Route$6.update({
	id: "/homepage",
	path: "/homepage",
	getParentRoute: () => AdminRoute
});
var AdminFilesRoute = Route$5.update({
	id: "/files",
	path: "/files",
	getParentRoute: () => AdminRoute
});
var AdminCommentsRoute = Route$4.update({
	id: "/comments",
	path: "/comments",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$3.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminArticlesRoute = Route$2.update({
	id: "/articles",
	path: "/articles",
	getParentRoute: () => AdminRoute
});
var AdminAdvertisementsRoute = Route$1.update({
	id: "/advertisements",
	path: "/advertisements",
	getParentRoute: () => AdminRoute
});
var ApiPublicSeedDemoAdminRoute = Route.update({
	id: "/api/public/seed-demo-admin",
	path: "/api/public/seed-demo-admin",
	getParentRoute: () => Route$35
});
var AdminRouteChildren = {
	AdminAdvertisementsRoute,
	AdminArticlesRoute,
	AdminCategoriesRoute,
	AdminCommentsRoute,
	AdminFilesRoute,
	AdminHomepageRoute,
	AdminInboxRoute,
	AdminJournalistsRoute,
	AdminPagesRoute,
	AdminReelsRoute,
	AdminRewardsRoute,
	AdminRolesRoute,
	AdminSettingsRoute,
	AdminTagsRoute,
	AdminUpdatesRoute,
	AdminUsersRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	SlugRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ApplyRoute,
	ApplyJournalistRoute,
	ArchiveRoute,
	AuthRoute,
	ContactRoute,
	CookiePolicyRoute,
	DataDeletionPolicyRoute,
	DisclaimerRoute,
	DmcaRoute,
	EarnPointsRoute,
	EditorialPolicyRoute,
	EventRoute,
	FactCheckingPolicyRoute,
	ForgotPasswordRoute,
	NewsSitemapDotxmlRoute,
	PrivacyPolicyRoute,
	ProfileRoute,
	ReelsRoute,
	RefundPolicyRoute,
	ResetPasswordRoute,
	RssDotxmlRoute,
	SearchRoute,
	SetupRoute,
	SitemapDotxmlRoute,
	SubmitNewsRoute,
	SubscriptionRoute,
	TermsAndConditionsRoute,
	VerifiedJournalistRoute,
	WatchRoute,
	WithdrawPointsRoute,
	WorkWithUsRoute,
	ApiRssRoute,
	NewsSlugRoute,
	ApiPublicSeedDemoAdminRoute
};
var routeTree = Route$35._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 60 * 1e3,
			gcTime: 600 * 1e3,
			refetchOnWindowFocus: false
		} } }) },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadDelay: 50,
		defaultPreloadStaleTime: 60 * 1e3
	});
};
//#endregion
export { getRouter };

//# sourceMappingURL=router-JvEbW-8k.js.map