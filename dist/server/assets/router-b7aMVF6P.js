import { f as sections, o as query, p as slugify, r as hashPassword } from "./db.server-CLva-TlE.js";
import { a as getRedirectRulesServer, o as getSiteSettingsServer, p as loadSettings, r as getAdConfigurationServer, s as incrementRedirectHitServer, t as defaultSettings } from "./site-content-CVkCGhTi.js";
import { r as getCategories } from "./taxonomy.functions-Pe7WDm8S.js";
import { a as buildGoogleFontsUrl, i as buildFontFaceCss, o as buildSectionCssVars, s as defaultFontConfig, t as FONT_CONFIG_KEY, u as getFontConfigServer } from "./font-config-GitSseLt.js";
import { t as AdSettingsProvider } from "./AdSettingsContext-Dy81m2Pl.js";
import { i as getHomepageConfigServer, r as defaultHomepageConfig } from "./homepage-config-CrSI2vlk.js";
import { t as Footer } from "./Footer-pKaQMZDG.js";
import { n as ThemeProvider, r as themeInitScript, t as Header } from "./Header-CXCHHlAu.js";
import { t as checkSetupStatus } from "./setup.functions-Biv41J0D.js";
import { t as Route$31 } from "./work-with-us-fVjGeNHJ.js";
import { t as Route$32 } from "./terms-and-conditions-B5qgTb-L.js";
import { t as Route$33 } from "./search-BeMzBIhO.js";
import { t as Route$34 } from "./refund-policy-CNoNn_8y.js";
import { t as Route$35 } from "./reels-jWlnkTME.js";
import { t as Route$36 } from "./privacy-policy-BG_MIyDE.js";
import { t as Route$37 } from "./editorial-policy-Co59S0gn.js";
import { t as Route$38 } from "./dmca-DlrwfKMM.js";
import { t as Route$39 } from "./disclaimer-ZiWO7_al.js";
import { t as Route$40 } from "./data-deletion-policy-6dXlb4aV.js";
import { t as Route$41 } from "./cookie-policy-GUcBfCHK.js";
import { t as Route$42 } from "./archive-qamyKFJS.js";
import { t as Route$43 } from "./admin-CoOfzpIm.js";
import { t as Route$44 } from "./about-CGdz_86Q.js";
import { t as Route$45 } from "./_slug-Dnuv5Zo3.js";
import { t as Route$46 } from "./routes-CMix0lXC.js";
import { t as Route$47 } from "./admin.index-DHy9G0qP.js";
import { t as Route$48 } from "./news._slug-CkNdChFN.js";
import { t as Route$49 } from "./admin.settings-CIfMgTB9.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Home, Newspaper, Search } from "lucide-react";
import { Toaster } from "sonner";
import crypto from "crypto";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
//#region src/styles.css?url
var styles_default = "/assets/styles-Brvu4ZME.css";
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
				toast: "group toast group-[.toaster]:shadow-lg",
				description: "group-[.toast]:text-white/80",
				actionButton: "group-[.toast]:bg-white group-[.toast]:text-[#1A1110]",
				cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
				title: "group-[.toast]:text-white",
				error: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
				success: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white"
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
				"builtBy": "Website built and digital partner"
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
				"builtBy": "वेबसाइट निर्माण और डिजिटल पार्टनर"
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
				"builtBy": "ওয়েবসাইট নির্মাণ এবং ডিজিটাল পার্টনার"
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
var Route$30 = createRootRouteWithContext()({
	beforeLoad: async ({ location }) => {
		if (location.pathname.startsWith("/api/") || location.pathname === "/api/rss") return;
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
			redirectRules: [],
			fontConfig: null,
			categories: []
		};
		try {
			const [settings, homepageConfig, adsConfig, redirectRules, fontConfig, categories] = await Promise.all([
				getSiteSettingsServer(),
				getHomepageConfigServer(),
				getAdConfigurationServer(),
				getRedirectRulesServer(),
				getFontConfigServer(),
				getCategories()
			]);
			return {
				settings,
				homepageConfig,
				adsConfig,
				redirectRules,
				fontConfig,
				categories
			};
		} catch (err) {
			console.error("[Root Loader] Failed to prefetch config:", err);
			return {
				settings: null,
				homepageConfig: null,
				adsConfig: null,
				redirectRules: [],
				fontConfig: null,
				categories: []
			};
		}
	},
	head: ({ loaderData }) => {
		const s = loaderData?.settings;
		const title = s?.siteName ? `${s.siteName} – ${s.tagline || "Breaking News"}` : "News Timeline – Breaking News | Finance | Business | Market";
		const desc = s?.metaDescription || "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";
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
				name: "author",
				content: s?.siteName || "News Timeline"
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
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@NewsTimeline"
			},
			{
				name: "twitter:title",
				content: title
			},
			{
				name: "twitter:description",
				content: desc
			}
		];
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
		const googleFontsUrl = buildGoogleFontsUrl((loaderData?.fontConfig ?? defaultFontConfig).fonts);
		return {
			meta: metaTags,
			links: [
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous"
				},
				...googleFontsUrl ? [{
					rel: "stylesheet",
					href: googleFontsUrl
				}] : [],
				{
					rel: "stylesheet",
					href: styles_default
				}
			]
		};
	},
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeInitScript } }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$30.useRouteContext();
	const loaderData = Route$30.useLoaderData();
	useEffect(() => {
		if (typeof window === "undefined" || !loaderData) return;
		const { settings, homepageConfig, adsConfig, fontConfig } = loaderData;
		if (settings) localStorage.setItem("nt:site-settings", JSON.stringify(settings));
		if (fontConfig) localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(fontConfig));
		if (homepageConfig) localStorage.setItem("nt:homepage-config:v1", JSON.stringify(homepageConfig));
		if (adsConfig) {
			if (adsConfig.slots) Object.keys(adsConfig.slots).forEach((slot) => {
				const key = slot === "home1" ? "nt:site-ads" : `nt:site-ads-${slot}`;
				localStorage.setItem(key, JSON.stringify(adsConfig.slots[slot]));
			});
			if (adsConfig.modes) localStorage.setItem("nt:ad-slot-mode", JSON.stringify(adsConfig.modes));
			if (adsConfig.scripts) localStorage.setItem("nt:ad-slot-script", JSON.stringify(adsConfig.scripts));
			if (adsConfig.rotations) localStorage.setItem("nt:site-ads-rotation", JSON.stringify(adsConfig.rotations));
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
		return () => {
			faceStyle?.remove();
			varsStyle?.remove();
		};
	}, [fontConfig]);
	useEffect(() => {
		const handleFontUpdate = () => {
			try {
				const raw = localStorage.getItem(FONT_CONFIG_KEY);
				if (raw) {
					const fc = JSON.parse(raw);
					const faceCss = buildFontFaceCss(fc.fonts);
					const faceStyle = document.getElementById("nt-font-face");
					if (faceStyle) faceStyle.textContent = faceCss;
					const varsCss = buildSectionCssVars(fc);
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
						popup: []
					},
					modes: {
						home1: "image",
						home2: "image",
						ad3: "image",
						popup: "image"
					},
					scripts: {
						home1: "",
						home2: "",
						ad3: "",
						popup: ""
					},
					rotations: {
						home1: 5,
						home2: 5,
						ad3: 5,
						popup: 6
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
var $$splitComponentImporter$26 = () => import("./withdraw-points-DTUg0aHk.js");
var Route$29 = createFileRoute("/withdraw-points")({
	head: () => ({ meta: [{ title: "Withdraw Points – News Theme Wallet" }, {
		name: "description",
		content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/watch.tsx
var Route$28 = createFileRoute("/watch")({ beforeLoad: () => {
	throw redirect({ to: "/reels" });
} });
//#endregion
//#region src/routes/verified-journalist.tsx
var $$splitComponentImporter$25 = () => import("./verified-journalist-SNvj0XbD.js");
var Route$27 = createFileRoute("/verified-journalist")({
	head: () => ({ meta: [
		{ title: "Verify a Journalist — News Theme" },
		{
			name: "description",
			content: "Enter a Journalist ID or 10-digit User ID to verify an accredited News Theme reporter."
		},
		{
			property: "og:title",
			content: "Verify a Journalist — News Theme"
		},
		{
			property: "og:description",
			content: "Instantly check if a byline belongs to a verified News Theme reporter."
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
//#region src/routes/subscription.tsx
var $$splitComponentImporter$24 = () => import("./subscription-M7zTWq6m.js");
var Route$26 = createFileRoute("/subscription")({
	head: () => ({ meta: [{ title: "Subscription — News Theme" }, {
		name: "description",
		content: "Upgrade to Premium for ad-free reading, exclusive stories and early access. Monthly or yearly plans."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/submit-news.tsx
var $$splitComponentImporter$23 = () => import("./submit-news-vsFEj2Vr.js");
var Route$25 = createFileRoute("/submit-news")({
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
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/setup.tsx
var $$splitComponentImporter$22 = () => import("./setup-CyveI5Bm.js");
var Route$24 = createFileRoute("/setup")({
	head: () => ({ meta: [{ title: "Setup Wizard – News Theme" }, {
		name: "description",
		content: "Configure your database and administrator account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$21 = () => import("./reset-password-BFMt0btB.js");
var Route$23 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — News Theme" }, {
		name: "description",
		content: "Choose a new password for your News Theme account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$20 = () => import("./profile-CiPJP6JG.js");
var Route$22 = createFileRoute("/profile")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Profile – News Theme" }, {
		name: "description",
		content: "Manage your account, password, bank details and subscription on News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/forgot-password.tsx
var $$splitComponentImporter$19 = () => import("./forgot-password-Cfd5DlRf.js");
var Route$21 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot password — News Theme" }, {
		name: "description",
		content: "Reset your News Theme account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/earn-points.tsx
var $$splitComponentImporter$18 = () => import("./earn-points-DeS6wJzw.js");
var Route$20 = createFileRoute("/earn-points")({
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
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$17 = () => import("./contact-DcWf3hPp.js");
var Route$19 = createFileRoute("/contact")({
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
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$16 = () => import("./auth-DPWRx6b4.js");
var Route$18 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in or create an account — News Theme" }, {
		name: "description",
		content: "Sign in to your News Theme account or create a new one."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/apply.tsx
var $$splitComponentImporter$15 = () => import("./apply-DgoXtLkf.js");
var Route$17 = createFileRoute("/apply")({
	head: () => ({ meta: [{ title: "Application Form — News Theme" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
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
var $$splitComponentImporter$14 = () => import("./admin.users-BcvUlUeX.js");
var Route$15 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/admin.updates.tsx
var $$splitComponentImporter$13 = () => import("./admin.updates-8bHoGpYn.js");
var Route$14 = createFileRoute("/admin/updates")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.tags.tsx
var $$splitComponentImporter$12 = () => import("./admin.tags-2yiYLDbx.js");
var Route$13 = createFileRoute("/admin/tags")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.roles.tsx
var $$splitComponentImporter$11 = () => import("./admin.roles-CQNv6S_5.js");
var Route$12 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.rewards.tsx
var $$splitComponentImporter$10 = () => import("./admin.rewards-BUyRJ8mb.js");
var Route$11 = createFileRoute("/admin/rewards")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.reels.tsx
var $$splitComponentImporter$9 = () => import("./admin.reels-DAGMmsUV.js");
var Route$10 = createFileRoute("/admin/reels")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/admin.pages.tsx
var $$splitComponentImporter$8 = () => import("./admin.pages-Y_5xY-wv.js");
var Route$9 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.journalists.tsx
var $$splitComponentImporter$7 = () => import("./admin.journalists-CeRNB_UN.js");
var Route$8 = createFileRoute("/admin/journalists")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.inbox.tsx
var $$splitComponentImporter$6 = () => import("./admin.inbox-CzJFEqry.js");
var Route$7 = createFileRoute("/admin/inbox")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/admin.homepage.tsx
var $$splitComponentImporter$5 = () => import("./admin.homepage-CyY40iPs.js");
var Route$6 = createFileRoute("/admin/homepage")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/admin.files.tsx
var $$splitComponentImporter$4 = () => import("./admin.files-yMs7LYMF.js");
var Route$5 = createFileRoute("/admin/files")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin.comments.tsx
var $$splitComponentImporter$3 = () => import("./admin.comments-DmCK-G2R.js");
var Route$4 = createFileRoute("/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.categories.tsx
var $$splitComponentImporter$2 = () => import("./admin.categories-aQ1OGlX0.js");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin.articles.tsx
var $$splitComponentImporter$1 = () => import("./admin.articles-Bu9_JZFa.js");
var Route$2 = createFileRoute("/admin/articles")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/admin.advertisements.tsx
var $$splitComponentImporter = () => import("./admin.advertisements-V5LMxcOB.js");
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
var WorkWithUsRoute = Route$31.update({
	id: "/work-with-us",
	path: "/work-with-us",
	getParentRoute: () => Route$30
});
var WithdrawPointsRoute = Route$29.update({
	id: "/withdraw-points",
	path: "/withdraw-points",
	getParentRoute: () => Route$30
});
var WatchRoute = Route$28.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$30
});
var VerifiedJournalistRoute = Route$27.update({
	id: "/verified-journalist",
	path: "/verified-journalist",
	getParentRoute: () => Route$30
});
var TermsAndConditionsRoute = Route$32.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$30
});
var SubscriptionRoute = Route$26.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => Route$30
});
var SubmitNewsRoute = Route$25.update({
	id: "/submit-news",
	path: "/submit-news",
	getParentRoute: () => Route$30
});
var SetupRoute = Route$24.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => Route$30
});
var SearchRoute = Route$33.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$30
});
var ResetPasswordRoute = Route$23.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$30
});
var RefundPolicyRoute = Route$34.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$30
});
var ReelsRoute = Route$35.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => Route$30
});
var ProfileRoute = Route$22.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$30
});
var PrivacyPolicyRoute = Route$36.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$30
});
var ForgotPasswordRoute = Route$21.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$30
});
var EditorialPolicyRoute = Route$37.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$30
});
var EarnPointsRoute = Route$20.update({
	id: "/earn-points",
	path: "/earn-points",
	getParentRoute: () => Route$30
});
var DmcaRoute = Route$38.update({
	id: "/dmca",
	path: "/dmca",
	getParentRoute: () => Route$30
});
var DisclaimerRoute = Route$39.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$30
});
var DataDeletionPolicyRoute = Route$40.update({
	id: "/data-deletion-policy",
	path: "/data-deletion-policy",
	getParentRoute: () => Route$30
});
var CookiePolicyRoute = Route$41.update({
	id: "/cookie-policy",
	path: "/cookie-policy",
	getParentRoute: () => Route$30
});
var ContactRoute = Route$19.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$30
});
var AuthRoute = Route$18.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$30
});
var ArchiveRoute = Route$42.update({
	id: "/archive",
	path: "/archive",
	getParentRoute: () => Route$30
});
var ApplyRoute = Route$17.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$30
});
var AdminRoute = Route$43.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$30
});
var AboutRoute = Route$44.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$30
});
var SlugRoute = Route$45.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => Route$30
});
var IndexRoute = Route$46.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$30
});
var AdminIndexRoute = Route$47.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var NewsSlugRoute = Route$48.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$30
});
var ApiRssRoute = Route$16.update({
	id: "/api/rss",
	path: "/api/rss",
	getParentRoute: () => Route$30
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
var AdminSettingsRoute = Route$49.update({
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
	getParentRoute: () => Route$30
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
	ArchiveRoute,
	AuthRoute,
	ContactRoute,
	CookiePolicyRoute,
	DataDeletionPolicyRoute,
	DisclaimerRoute,
	DmcaRoute,
	EarnPointsRoute,
	EditorialPolicyRoute,
	ForgotPasswordRoute,
	PrivacyPolicyRoute,
	ProfileRoute,
	ReelsRoute,
	RefundPolicyRoute,
	ResetPasswordRoute,
	SearchRoute,
	SetupRoute,
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
var routeTree = Route$30._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
