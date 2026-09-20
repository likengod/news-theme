import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { i as hashPassword, s as query } from "./db.server-BkLt9eJ8.js";
import { i as loadSettings, n as defaultSettings, r as getSiteSettingsServer } from "./site-settings-D521lAA0.js";
import { t as defaultPages } from "./default-pages-DQPnt0Sy.js";
import { n as getRedirectRulesServer, r as incrementRedirectHitServer } from "./redirect-rules-DhMBm0C1.js";
import { a as defaultAdSlidesPopup, c as getAdConfigurationServer, i as defaultAdSlidesLeaderboard, n as defaultAdSlidesAd3, r as defaultAdSlidesHome2, t as defaultAdSlides } from "./ads-storage-Be0cvbCl.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { a as buildGoogleFontsUrl, i as buildFontFaceCss, o as buildSectionCssVars, s as defaultFontConfig, t as FONT_CONFIG_KEY, u as getFontConfigServer } from "./font-config-C9ULav4h.js";
import { t as AdSettingsProvider } from "./AdSettingsContext-v0YhHRkC.js";
import { a as sections, o as slugify } from "./news-data-CFwG4BZ_.js";
import { r as getCategories } from "./taxonomy.functions-DR6UOfxj.js";
import { n as verifyImage, t as protectCanvasAndExport } from "./image-protection-BvTFVLZp.js";
import { i as getHomepageConfigServer, r as defaultHomepageConfig } from "./homepage-config-D0SmVWLp.js";
import { n as themeInitScript, t as ThemeProvider } from "./theme-BVjjmeMv.js";
import { t as Footer } from "./Footer-rrHMPHZp.js";
import { a as executeGitPullCore, i as executeGetGitStatusCore } from "./deploy.server-xu27zk74.js";
import { t as Header } from "./Header-C8rpTLB2.js";
import { t as checkSetupStatus } from "./setup.functions-Xi9yoHio.js";
import { t as Route$38 } from "./work-with-us-CjKcBGnr.js";
import { t as Route$39 } from "./verified-journalist-CMICwbXY.js";
import { t as Route$40 } from "./terms-and-conditions-3NkZ1VqL.js";
import { t as Route$41 } from "./search-DqFvzy9O.js";
import { t as Route$42 } from "./refund-policy-BloJJJRK.js";
import { t as Route$43 } from "./reels-CYK0vN1w.js";
import { t as Route$44 } from "./privacy-policy-BEPP2KOp.js";
import { t as Route$45 } from "./fact-checking-policy-S-3mKAzo.js";
import { t as Route$46 } from "./editorial-policy-EvSMFomE.js";
import { t as Route$47 } from "./dmca-D9qYkE1x.js";
import { t as Route$48 } from "./disclaimer-CFJ8A9Si.js";
import { t as Route$49 } from "./data-deletion-policy-ByWwCVZC.js";
import { t as Route$50 } from "./cookie-policy-D-M8XU6r.js";
import { t as Route$51 } from "./archive-CFnDKDZ7.js";
import { t as Route$52 } from "./admin-CK6Xms6J.js";
import { t as Route$53 } from "./about-BK-6zgNm.js";
import { t as Route$54 } from "./_slug-eo8nstxc.js";
import { t as Route$55 } from "./routes-Clrs7SM6.js";
import { t as Route$56 } from "./admin.index-k0Yu9zpk.js";
import { t as Route$57 } from "./news._slug-BmfeCGLE.js";
import { t as Route$58 } from "./admin.settings-CgGgaJEe.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clipboard, Clock, Dna, ExternalLink, FileCheck, Globe, Home, Info, Layers, Newspaper, RotateCcw, Search, ShieldAlert, ShieldCheck, ShieldX, Sparkles, Upload, XCircle } from "lucide-react";
import { Toaster } from "sonner";
import crypto from "crypto";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
//#region src/styles.css?url
var styles_default = "/assets/styles-DzTu1DVU.css";
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
//#region src/lib/form-a11y.ts
/**
* Global Form Control Accessibility & Autofill Enhancement
* Resolves Chrome DevTools issues:
* 1. "A form field element should have an id or name attribute"
* 2. "No label associated with a form field"
*/
var initialized = false;
function initFormAccessibility() {
	if (typeof window === "undefined" || initialized) return () => {};
	initialized = true;
	let counter = 0;
	function patchElement(el) {
		const tag = el.tagName;
		if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return;
		const input = el;
		const currentId = input.getAttribute("id");
		const currentName = input.getAttribute("name");
		if (!currentId && !currentName) {
			const placeholder = input.getAttribute("placeholder") || "";
			const type = input.getAttribute("type") || tag.toLowerCase();
			const generated = `${(placeholder || type || "field").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "field"}-${++counter}`;
			input.setAttribute("id", generated);
			input.setAttribute("name", generated);
		} else if (!currentId && currentName) if (document.getElementById(currentName)) input.setAttribute("id", `${currentName}-${++counter}`);
		else input.setAttribute("id", currentName);
		else if (currentId && !currentName) input.setAttribute("name", currentId);
		const hasAriaLabel = input.getAttribute("aria-label") || input.getAttribute("aria-labelledby");
		const hasTitle = input.getAttribute("title");
		const isInsideLabel = Boolean(input.closest("label"));
		const assignedId = input.getAttribute("id");
		const hasExplicitLabel = assignedId ? Boolean(document.querySelector(`label[for="${assignedId}"]`)) : false;
		if (!hasAriaLabel && !hasTitle && !isInsideLabel && !hasExplicitLabel) {
			const parent = input.parentElement;
			const siblingLabel = parent ? parent.querySelector("label:not([for])") : null;
			if (siblingLabel && assignedId) siblingLabel.setAttribute("for", assignedId);
			else {
				const fallbackText = input.getAttribute("placeholder") || (input.getAttribute("name") || "").replace(/[-_]/g, " ") || input.getAttribute("type") || "Form field";
				input.setAttribute("aria-label", fallbackText);
			}
		}
		if (!input.hasAttribute("autocomplete")) {
			const nameOrId = (input.getAttribute("name") || input.getAttribute("id") || "").toLowerCase();
			if ([
				"country",
				"city",
				"state",
				"address",
				"zip",
				"postal",
				"phone",
				"tel",
				"mobile",
				"email",
				"author",
				"username",
				"password",
				"search",
				"q",
				"query",
				"title",
				"name",
				"first-name",
				"last-name"
			].some((kw) => nameOrId.includes(kw))) {
				const isSearch = input.getAttribute("type") === "search" || nameOrId.includes("search") || nameOrId === "q";
				const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
				if (isSearch || isAdmin) input.setAttribute("autocomplete", "off");
				else if (nameOrId.includes("email")) input.setAttribute("autocomplete", "email");
				else if (nameOrId.includes("tel") || nameOrId.includes("phone")) input.setAttribute("autocomplete", "tel");
				else if (nameOrId.includes("country")) input.setAttribute("autocomplete", "country-name");
				else if (nameOrId.includes("city")) input.setAttribute("autocomplete", "address-level2");
				else if (nameOrId.includes("state")) input.setAttribute("autocomplete", "address-level1");
				else input.setAttribute("autocomplete", "off");
			}
		}
	}
	function patchAll() {
		try {
			document.querySelectorAll("input, textarea, select").forEach(patchElement);
		} catch {}
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", patchAll);
	else patchAll();
	let observer = null;
	try {
		observer = new MutationObserver((mutations) => {
			for (const m of mutations) if (m.type === "childList") m.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const el = node;
					patchElement(el);
					el.querySelectorAll?.("input, textarea, select").forEach(patchElement);
				}
			});
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	} catch {}
	return () => {
		observer?.disconnect();
		initialized = false;
	};
}
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
var Route$37 = createRootRouteWithContext()({
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
				rel: "preload",
				href: "/fonts/solaimanlipi-normal.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous"
			},
			{
				rel: "preload",
				href: "/fonts/solaimanlipi-bold.woff2",
				as: "font",
				type: "font/woff2",
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
		if (googleFontsUrl) links.push({
			rel: "stylesheet",
			href: googleFontsUrl
		});
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
	const { queryClient } = Route$37.useRouteContext();
	const loaderData = Route$37.useLoaderData();
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
	useEffect(() => {
		return initFormAccessibility();
	}, []);
	useEffect(() => {
		const handleUnhandledRejection = (event) => {
			const reason = event?.reason;
			const msg = String(reason?.message || reason || "");
			if (msg.includes("Unexpected token '<'") || msg.includes("<!DOCTYPE") || msg.includes("is not valid JSON")) {
				console.warn("[App Auto-Recovery] Stale bundle / server response mismatch detected. Reloading page...");
				const lastReload = sessionStorage.getItem("app_cache_bust_reload");
				const now = Date.now();
				if (!lastReload || now - parseInt(lastReload, 10) > 8e3) {
					sessionStorage.setItem("app_cache_bust_reload", now.toString());
					window.location.reload();
				}
			}
		};
		window.addEventListener("unhandledrejection", handleUnhandledRejection);
		return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
	}, []);
	const defaultSlots = {
		home1: defaultAdSlides,
		home2: defaultAdSlidesHome2,
		ad3: defaultAdSlidesAd3,
		popup: defaultAdSlidesPopup,
		leaderboard: defaultAdSlidesLeaderboard,
		hero_showcase: defaultAdSlidesHome2,
		reel_ads: []
	};
	const adConfigData = loaderData?.adsConfig ? {
		...loaderData.adsConfig,
		slots: {
			...defaultSlots,
			...loaderData.adsConfig.slots || {}
		}
	} : {
		slots: defaultSlots,
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
	};
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs(AdSettingsProvider, {
			value: {
				settings: loaderData?.settings ?? defaultSettings,
				homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
				adConfig: adConfigData,
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
var $$splitComponentImporter$27 = () => import("./withdraw-points-BpdavFAT.js");
var Route$36 = createFileRoute("/withdraw-points")({
	head: () => ({ meta: [{ title: "Withdraw Points – News Theme Wallet" }, {
		name: "description",
		content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/watch.tsx
var Route$35 = createFileRoute("/watch")({ beforeLoad: () => {
	throw redirect({ to: "/reels" });
} });
//#endregion
//#region src/routes/verify-image.tsx
var Route$34 = createFileRoute("/verify-image")({
	head: () => ({ meta: [{ title: "Forensic Image Verification Scanner - Today Tripura" }, {
		name: "description",
		content: "Scan any image or screenshot to extract cryptographic EXIF signatures and forensic pixel steganography DNA."
	}] }),
	component: VerifyImagePage
});
function VerifyImagePage() {
	const [imageSrc, setImageSrc] = useState(null);
	const [fileName, setFileName] = useState("");
	const [fileSize, setFileSize] = useState(0);
	const [isScanning, setIsScanning] = useState(false);
	const [scanProgress, setScanProgress] = useState(0);
	const [scanStep, setScanStep] = useState("");
	const [result, setResult] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);
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
	}, []);
	const runVerification = useCallback(async (dataUrl, name, size) => {
		setIsScanning(true);
		setScanProgress(20);
		setScanStep("Reading binary headers & Layer 1 Cryptographic EXIF signatures...");
		await new Promise((r) => setTimeout(r, 250));
		setScanProgress(55);
		setScanStep("Decoding Layer 2 Forensic Pixel Steganography (Scanning pixel DNA matrix)...");
		await new Promise((r) => setTimeout(r, 300));
		setScanProgress(85);
		setScanStep("Cross-referencing Barker synchronization & domain checksums...");
		try {
			const verification = await verifyImage(dataUrl);
			setScanProgress(100);
			setScanStep("Analysis complete.");
			await new Promise((r) => setTimeout(r, 150));
			setResult(verification);
		} catch (err) {
			console.error("Verification failed:", err);
		} finally {
			setIsScanning(false);
		}
	}, []);
	const handleFileSelect = (file, customLabel) => {
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
			runVerification(dataUrl, customLabel || file.name, file.size);
		};
		reader.readAsDataURL(file);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
	};
	const generateDemoImage = (mode) => {
		setResult(null);
		setIsScanning(true);
		setScanStep("Synthesizing test image...");
		const canvas = document.createElement("canvas");
		canvas.width = 480;
		canvas.height = 320;
		const ctx = canvas.getContext("2d");
		const grad = ctx.createLinearGradient(0, 0, 480, 320);
		grad.addColorStop(0, "#0f172a");
		grad.addColorStop(.5, "#1e293b");
		grad.addColorStop(1, "#334155");
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, 480, 320);
		ctx.fillStyle = "#38bdf8";
		ctx.beginPath();
		ctx.arc(240, 140, 60, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 20px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("TODAY TRIPURA NEWS", 240, 230);
		ctx.font = "12px sans-serif";
		ctx.fillStyle = "#94a3b8";
		ctx.fillText("Official Editorial Press Asset", 240, 255);
		let finalDataUrl = "";
		const siteDomain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";
		if (mode === "original") {
			finalDataUrl = protectCanvasAndExport(canvas, {
				domain: siteDomain,
				siteName: "Today Tripura",
				socials: {
					facebook: "https://facebook.com/todaytripura",
					twitter: "https://x.com/todaytripura",
					instagram: "https://instagram.com/todaytripura",
					youtube: "https://youtube.com/@todaytripura",
					telegram: "https://t.me/todaytripura"
				}
			}, "image/webp", .9);
			setFileName("demo-protected-original.webp");
		} else if (mode === "screenshot") {
			protectCanvasAndExport(canvas, {
				domain: siteDomain,
				siteName: "Today Tripura"
			}, "image/png", 1);
			const cleanCanvas = document.createElement("canvas");
			cleanCanvas.width = 480;
			cleanCanvas.height = 320;
			cleanCanvas.getContext("2d").drawImage(canvas, 0, 0);
			finalDataUrl = cleanCanvas.toDataURL("image/png");
			setFileName("demo-screenshot-simulated.png");
		} else {
			finalDataUrl = canvas.toDataURL("image/jpeg", .8);
			setFileName("demo-unprotected-image.jpg");
		}
		setImageSrc(finalDataUrl);
		setFileSize(Math.round(finalDataUrl.length * .75));
		runVerification(finalDataUrl, fileName, fileSize);
	};
	const resetScanner = () => {
		setImageSrc(null);
		setFileName("");
		setFileSize(0);
		setResult(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 text-slate-900 pb-16",
		children: [/* @__PURE__ */ jsx("div", {
			className: "border-b border-slate-200 bg-white",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs",
						children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-base sm:text-lg font-bold text-slate-900",
							children: "Forensic Image Verification Scanner"
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800",
							children: "Dual-Layer Engine"
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Cryptographic EXIF Signature (Layer 1) & Forensic Pixel Steganography (Layer 2)"
					})] })]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/admin/files",
					className: "hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition",
					children: ["Media Manager ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-6xl px-4 pt-8 sm:px-6 space-y-8",
			children: [!imageSrc ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					onDragOver: (e) => {
						e.preventDefault();
						setIsDragging(true);
					},
					onDragLeave: () => setIsDragging(false),
					onDrop: handleDrop,
					onClick: () => fileInputRef.current?.click(),
					className: `relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${isDragging ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]" : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50"}`,
					children: [
						/* @__PURE__ */ jsx("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-2xs",
							children: /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold text-slate-900",
							children: "Drop an image here, browse files, or press Ctrl+V to paste"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed",
							children: "Accepts original uploads, re-compressed JPEGs, WebP, PNG, or even live mobile/desktop screenshots."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: "rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition",
								children: "Browse File"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 font-medium",
								children: [/* @__PURE__ */ jsx(Clipboard, { className: "h-3.5 w-3.5 text-slate-400" }), /* @__PURE__ */ jsxs("span", { children: ["Tip: Take a screenshot and hit ", /* @__PURE__ */ jsx("strong", { children: "Ctrl+V" })] })]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-indigo-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-700",
								children: "Test Live Interactive Demo Samples"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-400",
							children: "Click any mode to inspect behavior"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => generateDemoImage("original"),
								className: "flex flex-col items-start rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 text-left hover:bg-emerald-50 transition",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 mb-1",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), " Sample 1: Full Original"]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-slate-900",
										children: "Layer 1 + Layer 2 Intact"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1",
										children: "Both EXIF certificate and pixel DNA present."
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => generateDemoImage("screenshot"),
								className: "flex flex-col items-start rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 text-left hover:bg-amber-50 transition",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 mb-1",
										children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }), " Sample 2: Screenshot Simulation"]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-slate-900",
										children: "Metadata Stripped (Layer 2 Only)"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1",
										children: "Simulates screenshot capture where EXIF is destroyed."
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => generateDemoImage("unprotected"),
								className: "flex flex-col items-start rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-left hover:bg-slate-100 transition",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1",
										children: [/* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5" }), " Sample 3: External Image"]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-slate-900",
										children: "Unprotected Content"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1",
										children: "Clean image without any digital signatures."
									})
								]
							})
						]
					})]
				})]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: imageSrc,
								alt: "Scanned asset",
								className: "h-12 w-12 rounded-lg object-cover border border-slate-200"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md",
								children: fileName
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-slate-500",
								children: [fileSize ? `${Math.round(fileSize / 1024)} KB • ` : "", "Ready for forensic report"]
							})] })]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: resetScanner,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition",
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), "Scan Another Image"]
						})]
					}),
					isScanning && /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 space-y-3 animate-pulse",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs font-bold text-indigo-900",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-indigo-600 animate-spin" }), scanStep]
							}), /* @__PURE__ */ jsxs("span", { children: [scanProgress, "%"] })]
						}), /* @__PURE__ */ jsx("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-indigo-200",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full bg-indigo-600 transition-all duration-300",
								style: { width: `${scanProgress}%` }
							})
						})]
					}),
					result && !isScanning && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: `rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${result.verdict === "ORIGINAL_AUTHENTIC" ? "border-emerald-300 bg-emerald-50/40 text-emerald-950" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "border-amber-300 bg-amber-50/40 text-amber-950" : "border-slate-300 bg-slate-100/60 text-slate-900"}`,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: `flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${result.verdict === "ORIGINAL_AUTHENTIC" ? "bg-emerald-600 text-white" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "bg-amber-600 text-white" : "bg-slate-600 text-white"}`,
											children: result.verdict === "ORIGINAL_AUTHENTIC" ? /* @__PURE__ */ jsx(ShieldCheck, { className: "h-8 w-8" }) : result.verdict === "AUTHENTIC_DERIVATIVE" ? /* @__PURE__ */ jsx(ShieldAlert, { className: "h-8 w-8" }) : /* @__PURE__ */ jsx(ShieldX, { className: "h-8 w-8" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-1",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsxs("span", {
														className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${result.verdict === "ORIGINAL_AUTHENTIC" ? "bg-emerald-100 text-emerald-800" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"}`,
														children: ["Verdict: ", result.verdict.replace("_", " ")]
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-xs text-slate-500",
														children: [
															"Processed in ",
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
										className: "flex flex-col items-center justify-center rounded-xl bg-white/80 p-3.5 border border-black/5 shadow-2xs shrink-0 min-w-[120px]",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-slate-400",
												children: "DNA Confidence"
											}),
											/* @__PURE__ */ jsxs("span", {
												className: `text-2xl font-black ${result.confidenceScore >= 80 ? "text-emerald-600" : result.confidenceScore > 0 ? "text-amber-600" : "text-slate-400"}`,
												children: [result.confidenceScore, "%"]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-500",
												children: result.verdict === "ORIGINAL_AUTHENTIC" ? "Dual Verification" : result.verdict === "AUTHENTIC_DERIVATIVE" ? "Pixel Steganography" : "No Match"
											})
										]
									})]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between border-b border-slate-100 pb-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
												className: "text-xs font-bold uppercase tracking-wider text-slate-700",
												children: "Layer 1: Cryptographic EXIF Signature"
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${result.layer1.detected ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`,
											children: result.layer1.detected ? "Found in Metadata" : "Destroyed / Stripped"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-3 text-xs",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "EXIF Digital Certificate:"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-900",
													children: result.layer1.detected ? "Valid Signature Present" : "Missing / Not Found"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Integrity Check:"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-900",
													children: result.layer1.validSignature ? "Cryptographically Authenticated" : "Failed / Unsigned"
												})]
											}),
											result.layer1.payload?.signature && /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Digital Fingerprint:"
												}), /* @__PURE__ */ jsx("code", {
													className: "font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700",
													children: result.layer1.payload.signature
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Resistance Status:"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-slate-600 text-[11px]",
													children: "Vulnerable to deliberate metadata stripping or screenshots."
												})]
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between border-b border-slate-100 pb-3",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx(Dna, { className: "h-4 w-4 text-purple-600" }), /* @__PURE__ */ jsx("h3", {
												className: "text-xs font-bold uppercase tracking-wider text-slate-700",
												children: "Layer 2: Forensic Pixel Watermark (DNA)"
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: `rounded-full px-2 py-0.5 text-[10px] font-bold ${result.layer2.detected ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`,
											children: result.layer2.detected ? "DNA Extracted" : "Not Found"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-3 text-xs",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Steganographic Pixel Match:"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-semibold text-slate-900",
													children: result.layer2.detected ? "Proven Across Pixel Matrix" : "No Pattern"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Synchronized Macroblocks:"
												}), /* @__PURE__ */ jsxs("span", {
													className: "font-semibold text-slate-900",
													children: [result.layer2.blocksScanned, " cells analyzed"]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1 border-b border-slate-50",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Screenshot Resilience:"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-semibold text-emerald-700",
													children: "Immune to Screenshot & Metadata Stripping"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between py-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Verdict Fallback:"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-slate-600 text-[11px]",
													children: result.layer2.detected ? "Proves authentic ownership despite metadata loss." : "No pixel watermark found."
												})]
											})
										]
									})]
								})]
							}),
							result.extractedPayload && /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 border-b border-slate-100 pb-3",
										children: [/* @__PURE__ */ jsx(FileCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ jsx("h3", {
											className: "text-xs font-bold uppercase tracking-wider text-slate-700",
											children: "Authenticated Ownership & Provenance Record"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-medium text-slate-400 block mb-1",
												children: "Registered Publisher / Domain"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 text-sm font-bold text-slate-900",
												children: [/* @__PURE__ */ jsx(Globe, { className: "h-4 w-4 text-indigo-600" }), /* @__PURE__ */ jsx("span", { children: result.extractedPayload.domain || "Unknown Domain" })]
											}),
											result.extractedPayload.siteName && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 mt-0.5",
												children: result.extractedPayload.siteName
											})
										] }), result.extractedPayload.timestamp && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-medium text-slate-400 block mb-1",
											children: "Protection Timestamp"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-xs font-semibold text-slate-800",
											children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: new Date(result.extractedPayload.timestamp).toLocaleString() })]
										})] })]
									}),
									result.extractedPayload.ownership && /* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-slate-50 p-3.5 border border-slate-100",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1",
											children: "Certified Ownership Declaration"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-700 font-medium leading-relaxed",
											children: result.extractedPayload.ownership
										})]
									}),
									result.extractedPayload.socials && Object.keys(result.extractedPayload.socials).length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium text-slate-400 block mb-2",
										children: "Embedded Official Social Media Accounts"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: Object.entries(result.extractedPayload.socials).map(([net, url]) => {
											if (!url) return null;
											return /* @__PURE__ */ jsxs("a", {
												href: url,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 transition shadow-2xs",
												children: [
													/* @__PURE__ */ jsxs("span", {
														className: "capitalize font-bold text-indigo-600",
														children: [net, ":"]
													}),
													/* @__PURE__ */ jsx("span", {
														className: "truncate max-w-[140px] text-slate-500",
														children: url
													}),
													/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 text-slate-400" })
												]
											}, net);
										})
									})] })
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5 border-b border-slate-100 pb-4",
					children: [/* @__PURE__ */ jsx(Info, { className: "h-5 w-5 text-indigo-600" }), /* @__PURE__ */ jsx("h2", {
						className: "text-base font-bold text-slate-900",
						children: "How the Dual-Layer Image Protection Engine Works"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-blue-100 bg-blue-50/30 p-5 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800",
									children: "Layer 1"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-blue-600",
									children: "The Surface Protection"
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Cryptographic EXIF Signature"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-600 leading-relaxed",
								children: "This layer embeds hidden, encrypted text data directly into the image file's metadata (EXIF/XMP tags) behind the scenes."
							}),
							/* @__PURE__ */ jsxs("ul", {
								className: "text-xs text-slate-600 space-y-2",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Ownership Details:" }), " Securely holds custom text like \"This image belongs to [Domain Name]\"."] })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Social Media Linking:" }), " Embeds verified social accounts pulled from your admin panel directly into the file."] })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Timestamps:" }), " Records the exact date and time the image was protected."] })]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-lg bg-blue-100/60 p-3 text-[11px] text-blue-900",
								children: [
									/* @__PURE__ */ jsx("strong", { children: "Vulnerability:" }),
									" If a smart pirate deliberately uses a tool to \"strip metadata\" or takes a screenshot of the image, Layer 1 gets destroyed. ",
									/* @__PURE__ */ jsx("em", { children: "That is why we have Layer 2." })
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-purple-100 bg-purple-50/30 p-5 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800",
									children: "Layer 2"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-purple-600",
									children: "The Deep Protection"
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "Forensic Pixel Watermarking (Steganography)"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-600 leading-relaxed",
								children: "Advanced steganography. Instead of hiding data in the file's text, it invisibly weaves your watermark directly into the actual color pixels of the image."
							}),
							/* @__PURE__ */ jsxs("ul", {
								className: "text-xs text-slate-600 space-y-2",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Screenshot Proof:" }), " If a user takes a screenshot on phone or computer, the pixels are captured, which means the hidden watermark is captured too."] })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "Tamper Resistant:" }), " Survives cropping, resizing, JPEG compression, and complete metadata stripping."] })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [
											/* @__PURE__ */ jsx("strong", { children: "Automatic Fallback:" }),
											" Mathematically analyzes pixels to extract the payload and issues an ",
											/* @__PURE__ */ jsx("em", { children: "\"Authentic Derivative / Screenshot Match\"" }),
											" verdict."
										] })]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-lg bg-purple-100/60 p-3 text-[11px] text-purple-900",
								children: [/* @__PURE__ */ jsx("strong", { children: "Summary:" }), " Layer 1 acts like a physical ID card sitting inside the image file. Layer 2 acts like invisible DNA inside the image itself."]
							})
						]
					})]
				})]
			})]
		})]
	});
}
//#endregion
//#region src/routes/subscription.tsx
var $$splitComponentImporter$26 = () => import("./subscription-D8y4X9Fn.js");
var Route$33 = createFileRoute("/subscription")({
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
var $$splitComponentImporter$25 = () => import("./submit-news-CbFFRztP.js");
var Route$32 = createFileRoute("/submit-news")({
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
var Route$31 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
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
var $$splitComponentImporter$24 = () => import("./setup-BxlL_wnd.js");
var Route$30 = createFileRoute("/setup")({
	head: () => ({ meta: [{ title: "Setup Wizard – News Theme" }, {
		name: "description",
		content: "Configure your database and administrator account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
//#region src/routes/rss[.]xml.ts
var Route$29 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async () => {
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
var $$splitComponentImporter$23 = () => import("./reset-password-3R8yY-9S.js");
var Route$28 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — News Theme" }, {
		name: "description",
		content: "Choose a new password for your News Theme account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$22 = () => import("./profile-edI3JnF3.js");
var Route$27 = createFileRoute("/profile")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Profile – News Theme" }, {
		name: "description",
		content: "Manage your account, password, bank details and subscription on News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/news-sitemap[.]xml.ts
var Route$26 = createFileRoute("/news-sitemap.xml")({ server: { handlers: { GET: async () => {
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
var $$splitComponentImporter$21 = () => import("./forgot-password-DAwP52fH.js");
var Route$25 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot password — News Theme" }, {
		name: "description",
		content: "Reset your News Theme account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/event.tsx
var $$splitComponentImporter$20 = () => import("./event-CdgNHULF.js");
var Route$24 = createFileRoute("/event")({
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
var $$splitComponentImporter$19 = () => import("./earn-points-Bc6d4Z3u.js");
var Route$23 = createFileRoute("/earn-points")({
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
var $$splitComponentImporter$18 = () => import("./contact-DWUBXMoy.js");
var Route$22 = createFileRoute("/contact")({
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
var $$splitComponentImporter$17 = () => import("./auth-BOkSRwX2.js");
var Route$21 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in or create an account — News Theme" }, {
		name: "description",
		content: "Sign in to your News Theme account or create a new one."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/apply-journalist.tsx
var $$splitComponentImporter$16 = () => import("./apply-journalist-B0uS-Hvd.js");
var Route$20 = createFileRoute("/apply-journalist")({
	head: () => ({ meta: [{ title: "Apply as Journalist — News Theme" }, {
		name: "description",
		content: "Submit your official journalist verification application to join our press newsroom."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/apply.tsx
var $$splitComponentImporter$15 = () => import("./apply-BLHeaaB_.js");
var Route$19 = createFileRoute("/apply")({
	head: () => ({ meta: [{ title: "Application Form — News Theme" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/api/updates.ts
var Route$18 = createFileRoute("/api/updates")({ server: { handlers: {
	GET: async () => {
		try {
			const status = await executeGetGitStatusCore(true);
			return new Response(JSON.stringify(status), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to get git status",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	},
	POST: async () => {
		try {
			const pullResult = await executeGitPullCore();
			return new Response(JSON.stringify(pullResult), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to execute git pull and update",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	}
} } });
//#endregion
//#region src/routes/api/update.ts
var Route$17 = createFileRoute("/api/update")({ server: { handlers: {
	GET: async () => {
		try {
			const status = await executeGetGitStatusCore(true);
			return new Response(JSON.stringify(status), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to get git status",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	},
	POST: async () => {
		try {
			const pullResult = await executeGitPullCore();
			return new Response(JSON.stringify(pullResult), { headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			} });
		} catch (err) {
			const errPayload = {
				error: err?.message || "Failed to execute git pull and update",
				success: false,
				updated: false
			};
			return new Response(JSON.stringify({
				...errPayload,
				data: errPayload,
				result: errPayload
			}), {
				status: 500,
				headers: { "content-type": "application/json; charset=utf-8" }
			});
		}
	}
} } });
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
var $$splitComponentImporter$14 = () => import("./admin.users-DnryLUvA.js");
var Route$15 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/admin.updates.tsx
var $$splitComponentImporter$13 = () => import("./admin.updates-DeLKUwFu.js");
var Route$14 = createFileRoute("/admin/updates")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.tags.tsx
var $$splitComponentImporter$12 = () => import("./admin.tags-ByC-4GEf.js");
var Route$13 = createFileRoute("/admin/tags")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.roles.tsx
var $$splitComponentImporter$11 = () => import("./admin.roles-DkMyPC5H.js");
var Route$12 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.rewards.tsx
var $$splitComponentImporter$10 = () => import("./admin.rewards-BT-vgIpg.js");
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
var $$splitComponentImporter$8 = () => import("./admin.pages-Cd6W-nhz.js");
var Route$9 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.journalists.tsx
var $$splitComponentImporter$7 = () => import("./admin.journalists-DTQkeHDA.js");
var Route$8 = createFileRoute("/admin/journalists")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.inbox.tsx
var $$splitComponentImporter$6 = () => import("./admin.inbox-Cqj1jgS1.js");
var Route$7 = createFileRoute("/admin/inbox")({
	head: () => ({ meta: [{ title: "Admin Inbox - News Timeline" }, {
		name: "description",
		content: "Review contact messages, journalist applications, and user requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/admin.homepage.tsx
var $$splitComponentImporter$5 = () => import("./admin.homepage-CocGyiDx.js");
var Route$6 = createFileRoute("/admin/homepage")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/admin.files.tsx
var $$splitComponentImporter$4 = () => import("./admin.files-ClvYGSLt.js");
var Route$5 = createFileRoute("/admin/files")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin.comments.tsx
var $$splitComponentImporter$3 = () => import("./admin.comments-CMmLzizu.js");
var Route$4 = createFileRoute("/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.categories.tsx
var $$splitComponentImporter$2 = () => import("./admin.categories-lvB6UwXZ.js");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin.articles.tsx
var $$splitComponentImporter$1 = () => import("./admin.articles-Dakih5AO.js");
var Route$2 = createFileRoute("/admin/articles")({
	head: () => ({ meta: [{ title: "Manage Articles - Admin Dashboard" }, {
		name: "description",
		content: "Create, edit, filter, and manage published and drafted articles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/admin.advertisements.tsx
var $$splitComponentImporter = () => import("./admin.advertisements-DlEaiUlW.js");
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
var WorkWithUsRoute = Route$38.update({
	id: "/work-with-us",
	path: "/work-with-us",
	getParentRoute: () => Route$37
});
var WithdrawPointsRoute = Route$36.update({
	id: "/withdraw-points",
	path: "/withdraw-points",
	getParentRoute: () => Route$37
});
var WatchRoute = Route$35.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$37
});
var VerifyImageRoute = Route$34.update({
	id: "/verify-image",
	path: "/verify-image",
	getParentRoute: () => Route$37
});
var VerifiedJournalistRoute = Route$39.update({
	id: "/verified-journalist",
	path: "/verified-journalist",
	getParentRoute: () => Route$37
});
var TermsAndConditionsRoute = Route$40.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$37
});
var SubscriptionRoute = Route$33.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => Route$37
});
var SubmitNewsRoute = Route$32.update({
	id: "/submit-news",
	path: "/submit-news",
	getParentRoute: () => Route$37
});
var SitemapDotxmlRoute = Route$31.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$37
});
var SetupRoute = Route$30.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => Route$37
});
var SearchRoute = Route$41.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$37
});
var RssDotxmlRoute = Route$29.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$37
});
var ResetPasswordRoute = Route$28.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$37
});
var RefundPolicyRoute = Route$42.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$37
});
var ReelsRoute = Route$43.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => Route$37
});
var ProfileRoute = Route$27.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$37
});
var PrivacyPolicyRoute = Route$44.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$37
});
var NewsSitemapDotxmlRoute = Route$26.update({
	id: "/news-sitemap.xml",
	path: "/news-sitemap.xml",
	getParentRoute: () => Route$37
});
var ForgotPasswordRoute = Route$25.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$37
});
var FactCheckingPolicyRoute = Route$45.update({
	id: "/fact-checking-policy",
	path: "/fact-checking-policy",
	getParentRoute: () => Route$37
});
var EventRoute = Route$24.update({
	id: "/event",
	path: "/event",
	getParentRoute: () => Route$37
});
var EditorialPolicyRoute = Route$46.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$37
});
var EarnPointsRoute = Route$23.update({
	id: "/earn-points",
	path: "/earn-points",
	getParentRoute: () => Route$37
});
var DmcaRoute = Route$47.update({
	id: "/dmca",
	path: "/dmca",
	getParentRoute: () => Route$37
});
var DisclaimerRoute = Route$48.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$37
});
var DataDeletionPolicyRoute = Route$49.update({
	id: "/data-deletion-policy",
	path: "/data-deletion-policy",
	getParentRoute: () => Route$37
});
var CookiePolicyRoute = Route$50.update({
	id: "/cookie-policy",
	path: "/cookie-policy",
	getParentRoute: () => Route$37
});
var ContactRoute = Route$22.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$37
});
var AuthRoute = Route$21.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$37
});
var ArchiveRoute = Route$51.update({
	id: "/archive",
	path: "/archive",
	getParentRoute: () => Route$37
});
var ApplyJournalistRoute = Route$20.update({
	id: "/apply-journalist",
	path: "/apply-journalist",
	getParentRoute: () => Route$37
});
var ApplyRoute = Route$19.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$37
});
var AdminRoute = Route$52.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$37
});
var AboutRoute = Route$53.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$37
});
var SlugRoute = Route$54.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => Route$37
});
var IndexRoute = Route$55.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$37
});
var AdminIndexRoute = Route$56.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var NewsSlugRoute = Route$57.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$37
});
var ApiUpdatesRoute = Route$18.update({
	id: "/api/updates",
	path: "/api/updates",
	getParentRoute: () => Route$37
});
var ApiUpdateRoute = Route$17.update({
	id: "/api/update",
	path: "/api/update",
	getParentRoute: () => Route$37
});
var ApiRssRoute = Route$16.update({
	id: "/api/rss",
	path: "/api/rss",
	getParentRoute: () => Route$37
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
var AdminSettingsRoute = Route$58.update({
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
	getParentRoute: () => Route$37
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
	VerifyImageRoute,
	WatchRoute,
	WithdrawPointsRoute,
	WorkWithUsRoute,
	ApiRssRoute,
	ApiUpdateRoute,
	ApiUpdatesRoute,
	NewsSlugRoute,
	ApiPublicSeedDemoAdminRoute
};
var routeTree = Route$37._addFileChildren(rootRouteChildren)._addFileTypes();
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
		defaultPreload: false,
		defaultPreloadDelay: 200,
		defaultPreloadStaleTime: 60 * 1e3
	});
};
//#endregion
export { getRouter };

//# sourceMappingURL=router-AHnA_LGx.js.map