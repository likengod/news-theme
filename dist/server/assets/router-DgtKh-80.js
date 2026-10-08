import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { i as hashPassword, s as query } from "./db.server-txgvnrPd.js";
import { n as defaultSettings, o as loadSettings, r as getSiteSettingsServer } from "./site-settings-bvTXHSO2.js";
import { t as defaultPages } from "./default-pages-DQPnt0Sy.js";
import { n as getRedirectRulesServer, r as incrementRedirectHitServer } from "./redirect-rules-C_dnq6kW.js";
import { a as defaultAdSlidesPopup, i as defaultAdSlidesLeaderboard, l as getAdConfigurationServer, n as defaultAdSlidesAd3, r as defaultAdSlidesHome2, t as defaultAdSlides } from "./ads-storage-C6PBHgZJ.js";
import { t as buildPageHead } from "./page-seo-DqfajxWt.js";
import { a as buildGoogleFontsUrl, i as buildFontFaceCss, o as buildSectionCssVars, s as defaultFontConfig, t as FONT_CONFIG_KEY, u as getFontConfigServer } from "./font-config-BUDiOtx0.js";
import { t as AdSettingsProvider } from "./AdSettingsContext-BhoyJhj9.js";
import { a as sections, o as slugify } from "./news-data-CiXcY3JG.js";
import { r as getCategories } from "./taxonomy.functions-CaYZRxtu.js";
import { n as defaultHomepageConfig, r as getHomepageConfigServer } from "./homepage-config-DDcX-WR-.js";
import "./i18n-D_0jYhls.js";
import { n as themeInitScript, t as ThemeProvider } from "./theme-3HUYOunA.js";
import { t as Footer } from "./Footer-DcfNVxOO.js";
import { a as executeGitPullCore, i as executeGetGitStatusCore } from "./deploy.server-Jy1NnQU6.js";
import { t as Header } from "./Header-CGh13e7s.js";
import { t as checkSetupStatus } from "./setup.functions-BuTHkZ0K.js";
import { t as Route$40 } from "./work-with-us-CKXhUcJX.js";
import { t as Route$41 } from "./verified-journalist-Dy-BmCJ3.js";
import { t as Route$42 } from "./terms-and-conditions-YdySR56P.js";
import { t as Route$43 } from "./search-C40nLb9d.js";
import { t as Route$44 } from "./refund-policy-B-BS_3YH.js";
import { t as Route$45 } from "./reels-CcE0V3Gv.js";
import { t as Route$46 } from "./privacy-policy-1zL4RxeF.js";
import { t as Route$47 } from "./fact-checking-policy-CcS5sBhi.js";
import { t as Route$48 } from "./editorial-policy-zTooQ7Gs.js";
import { t as Route$49 } from "./dmca-CtKEsBYj.js";
import { t as Route$50 } from "./disclaimer-BugVWLvv.js";
import { t as Route$51 } from "./data-deletion-policy-CmI2ziNH.js";
import { t as Route$52 } from "./cookie-policy-B1dFHOFf.js";
import { t as Route$53 } from "./archive-D5qLQAP-.js";
import { t as Route$54 } from "./admin-e497DzGW.js";
import { t as Route$55 } from "./about-C5jXaRLC.js";
import { t as Route$56 } from "./_slug-C-M8Ql01.js";
import { t as Route$57 } from "./routes-wxc5VpXA.js";
import { t as Route$58 } from "./admin.index-DlvpVXa4.js";
import { t as Route$59 } from "./news._slug-BrhmACCv.js";
import { t as Route$60 } from "./admin.settings-B2qbIqB-.js";
import { Suspense, lazy, useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Home, Newspaper, Search } from "lucide-react";
import crypto from "crypto";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
//#region src/components/layout/ErrorComponent.tsx
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
//#endregion
//#region src/components/layout/RootShell.tsx
var chunkRecoveryScript = `
(function() {
  function handleChunkError(err) {
    try {
      var msg = (err && (err.message || (err.reason && err.reason.message) || String(err.reason || err))) || '';
      if (/failed to fetch dynamically imported module/i.test(msg) || 
          /importing a module script failed/i.test(msg) || 
          /loading chunk/i.test(msg) || 
          /does not provide an export named/i.test(msg) ||
          /The requested module/i.test(msg) ||
          /ChunkLoadError/i.test(msg) ||
          /SyntaxError.*(?:export|module|import)/i.test(msg) ||
          /error #418/i.test(msg) ||
          /error #423/i.test(msg) ||
          /error #425/i.test(msg)) {
        var key = 'chunk_reload_ts';
        var last = Number(sessionStorage.getItem(key) || 0);
        var now = Date.now();
        if (now - last > 5000) {
          sessionStorage.setItem(key, String(now));
          if ('caches' in window) {
            caches.keys().then(function(keys) {
              for (var i = 0; i < keys.length; i++) caches.delete(keys[i]);
            }).catch(function() {});
          }
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
      if (now - last > 5000) {
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
		className: "overflow-x-clip max-w-full",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeInitScript } }),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: chunkRecoveryScript } }),
			/* @__PURE__ */ jsx(HeadContent, {})
		] }), /* @__PURE__ */ jsxs("body", {
			className: "overflow-x-clip max-w-full min-h-screen",
			children: [children, /* @__PURE__ */ jsx(Scripts, {})]
		})]
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-jdF09EnK.css";
//#endregion
//#region src/components/layout/rootHead.ts
function generateRootHead(loaderData) {
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
	metaTags.push({
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
	const scripts = [{
		type: "application/ld+json",
		children: JSON.stringify(orgSchema)
	}];
	const asyncFonts = s?.asyncFontsEnabled ?? true;
	if (googleFontsUrl && typeof googleFontsUrl === "string" && googleFontsUrl.trim()) if (asyncFonts) {
		links.push({
			rel: "preload",
			as: "style",
			href: googleFontsUrl
		});
		scripts.push({ children: `(function(){var append=function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(googleFontsUrl)};document.head.appendChild(l);};if(typeof requestAnimationFrame==='function'){requestAnimationFrame(append);}else{setTimeout(append,0);}})();` });
	} else links.push({
		rel: "stylesheet",
		href: googleFontsUrl
	});
	return {
		meta: metaTags,
		links,
		scripts
	};
}
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
	let timer = null;
	let observer = null;
	const startPatching = () => {
		patchAll();
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
	};
	if (typeof window !== "undefined") if ("requestIdleCallback" in window) window.requestIdleCallback(startPatching, { timeout: 1500 });
	else timer = setTimeout(startPatching, 800);
	return () => {
		if (timer) clearTimeout(timer);
		observer?.disconnect();
		initialized = false;
	};
}
//#endregion
//#region src/components/layout/useRootEffects.ts
function useRootEffects(loaderData) {
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
}
//#endregion
//#region src/components/layout/rootUtils.ts
function buildAdConfigData(loaderAdsConfig) {
	const defaultSlots = {
		home1: defaultAdSlides,
		home2: defaultAdSlidesHome2,
		ad3: defaultAdSlidesAd3,
		popup: defaultAdSlidesPopup,
		leaderboard: defaultAdSlidesLeaderboard,
		hero_showcase: [],
		reel_ads: []
	};
	if (loaderAdsConfig) return {
		...loaderAdsConfig,
		slots: {
			...defaultSlots,
			...loaderAdsConfig.slots || {}
		}
	};
	return {
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
}
//#endregion
//#region src/routes/__root.tsx
var Toaster = lazy(() => import("./sonner-DeCwZNYX.js").then((m) => ({ default: m.Toaster })));
function LazyToaster() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		if (typeof window === "undefined") return;
		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(() => setMounted(true));
			return () => window.cancelIdleCallback(id);
		} else {
			const t = setTimeout(() => setMounted(true), 2e3);
			return () => clearTimeout(t);
		}
	}, []);
	if (!mounted) return null;
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: null,
		children: /* @__PURE__ */ jsx(Toaster, {})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ jsx(NotFound, {});
}
var Route$39 = createRootRouteWithContext()({
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
	head: ({ loaderData }) => generateRootHead(loaderData),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootComponent() {
	const { queryClient } = Route$39.useRouteContext();
	const loaderData = Route$39.useLoaderData();
	useRootEffects(loaderData);
	const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
	const adConfigData = buildAdConfigData(loaderData?.adsConfig);
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
				/* @__PURE__ */ jsx(LazyToaster, {}),
				/* @__PURE__ */ jsx(AnalyticsInjector, {})
			]
		}) })
	});
}
//#endregion
//#region src/routes/withdraw-points.tsx
var $$splitComponentImporter$30 = () => import("./withdraw-points-CNJl4k-b.js");
var Route$38 = createFileRoute("/withdraw-points")({
	head: () => ({ meta: [{ title: "Withdraw Points – News Theme Wallet" }, {
		name: "description",
		content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
//#endregion
//#region src/routes/watch.tsx
var Route$37 = createFileRoute("/watch")({ beforeLoad: () => {
	throw redirect({ to: "/reels" });
} });
//#endregion
//#region src/routes/verify-image.tsx
var $$splitComponentImporter$29 = () => import("./verify-image-CwZvqMPG.js");
var Route$36 = createFileRoute("/verify-image")({
	head: () => ({ meta: [{ title: "Forensic Image Verification Scanner - News Theme" }, {
		name: "description",
		content: "Scan any image or screenshot to extract cryptographic EXIF signatures and forensic pixel steganography DNA."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
//#endregion
//#region src/routes/subscription.tsx
var $$splitComponentImporter$28 = () => import("./subscription-CuzgvRe6.js");
var Route$35 = createFileRoute("/subscription")({
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
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
//#endregion
//#region src/routes/submit-news.tsx
var $$splitComponentImporter$27 = () => import("./submit-news-B-H-iM6J.js");
var Route$34 = createFileRoute("/submit-news")({
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
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/sitemap[.]xml.ts
var Route$33 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
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
			articles = await query("SELECT slug, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 1000");
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
var $$splitComponentImporter$26 = () => import("./setup-TuDFTokJ.js");
var Route$32 = createFileRoute("/setup")({
	head: () => ({ meta: [{ title: "Setup Wizard – News Theme" }, {
		name: "description",
		content: "Configure your database and administrator account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
//#region src/routes/rss[.]xml.ts
var Route$31 = createFileRoute("/rss.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		let siteName = "News Vanguard 24x7";
		let siteDesc = "Breaking news, local updates, and market intelligence from News Vanguard 24x7.";
		let language = "en-US";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoNewsPublicationName) siteName = parsed.seoNewsPublicationName;
				else if (parsed?.siteName) siteName = parsed.siteName;
				if (parsed?.metaDescription) siteDesc = parsed.metaDescription;
				if (parsed?.defaultLanguage) language = parsed.defaultLanguage.toLowerCase() === "bn" ? "bn-IN" : "en-US";
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT * FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
		} catch {}
		const lastBuildDate = (/* @__PURE__ */ new Date()).toUTCString();
		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml$2(siteName)}</title>
    <description>${escapeXml$2(siteDesc)}</description>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${escapeXml$2(language)}</language>
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
//#region src/routes/results.tsx
var $$splitComponentImporter$25 = () => import("./results-mC4MBlFk.js");
var Route$30 = createFileRoute("/results")({
	head: () => ({ meta: [{ title: "ত্রিপুরা পরীক্ষা ফলাফল, মার্কশিট ও সার্টিফিকেট পোর্টাল — Today Tripura" }, {
		name: "description",
		content: "Tripura Board TBSE Madhyamik, Higher Secondary, Tripura University Degree Marksheet & Certificate Verification Portal."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$24 = () => import("./reset-password-B_tvt15g.js");
var Route$29 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — News Theme" }, {
		name: "description",
		content: "Choose a new password for your News Theme account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$23 = () => import("./profile-BwjVC8di.js");
var Route$28 = createFileRoute("/profile")({
	ssr: false,
	head: () => ({ meta: [{ title: "My Profile – News Theme" }, {
		name: "description",
		content: "Manage your account, password, bank details and subscription on News Theme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/news-sitemap[.]xml.ts
var Route$27 = createFileRoute("/news-sitemap.xml")({ server: { handlers: { GET: async () => {
	try {
		let origin = "https://vanguardtripura.com";
		let publicationName = "News Vanguard 24x7";
		let publicationLang = "en";
		try {
			const req = getRequest();
			origin = `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "vanguardtripura.com"}`;
		} catch {
			origin = "https://vanguardtripura.com";
		}
		try {
			const settingRows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
			if (settingRows.length > 0 && settingRows[0].value) {
				const parsed = JSON.parse(settingRows[0].value);
				if (parsed?.seoNewsPublicationName) publicationName = parsed.seoNewsPublicationName;
				else if (parsed?.siteName) publicationName = parsed.siteName;
				if (parsed?.defaultLanguage) publicationLang = parsed.defaultLanguage.toLowerCase().slice(0, 2);
				if (parsed?.seoCanonicalBaseUrl && !parsed.seoCanonicalBaseUrl.includes("domainname.com")) origin = parsed.seoCanonicalBaseUrl.replace(/\/$/, "");
			}
		} catch {}
		let articles = [];
		try {
			articles = await query("SELECT slug, title, category, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() AND date >= NOW() - INTERVAL 48 HOUR ORDER BY date DESC, id DESC LIMIT 100");
		} catch {}
		if (!articles || articles.length === 0) try {
			articles = await query("SELECT slug, title, category, date, updated_at FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 25");
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
        <news:language>${escapeXml$1(publicationLang)}</news:language>
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
var $$splitComponentImporter$22 = () => import("./forgot-password-L4rtzZO4.js");
var Route$26 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot password — News Theme" }, {
		name: "description",
		content: "Reset your News Theme account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/fact-check.tsx
var $$splitComponentImporter$21 = () => import("./fact-check-Bkzmt3aT.js");
var Route$25 = createFileRoute("/fact-check")({
	head: () => ({ meta: [
		{ title: "Live News & Claim Fact-Check Scanner — News Theme" },
		{
			name: "description",
			content: "Scan any news article URL or viral headline to instantly verify authenticity against accredited global fact-checking registries and Google Fact Check."
		},
		{
			property: "og:title",
			content: "Live News Fact-Check Scanner — News Theme"
		},
		{
			property: "og:description",
			content: "Instantly check any news URL or claim against accredited international fact-checkers."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/event.tsx
var $$splitComponentImporter$20 = () => import("./event-DEJzPTs6.js");
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
//#endregion
//#region src/routes/earn-points.tsx
var $$splitComponentImporter$19 = () => import("./earn-points-Q-nQ141F.js");
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
var $$splitComponentImporter$18 = () => import("./contact-AMhDyrjh.js");
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
var $$splitComponentImporter$17 = () => import("./auth-BsMUmnp9.js");
var Route$21 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in or create an account — News Theme" }, {
		name: "description",
		content: "Sign in to your News Theme account or create a new one."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/apply-journalist.tsx
var $$splitComponentImporter$16 = () => import("./apply-journalist-rcGnh3Ir.js");
var Route$20 = createFileRoute("/apply-journalist")({
	head: () => ({ meta: [{ title: "Apply as Journalist — News Theme" }, {
		name: "description",
		content: "Submit your official journalist verification application to join our press newsroom."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/apply.tsx
var $$splitComponentImporter$15 = () => import("./apply-DluSO2pC.js");
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
		const articles = await query("SELECT * FROM articles WHERE (status = 'Published' OR status = 'Scheduled') AND date <= NOW() ORDER BY date DESC, id DESC LIMIT 50");
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
var $$splitComponentImporter$14 = () => import("./admin.users-B6wT3U-_.js");
var Route$15 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/admin.updates.tsx
var $$splitComponentImporter$13 = () => import("./admin.updates-WBOhr2jg.js");
var Route$14 = createFileRoute("/admin/updates")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.tags.tsx
var $$splitComponentImporter$12 = () => import("./admin.tags-DIKv6G0x.js");
var Route$13 = createFileRoute("/admin/tags")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.roles.tsx
var $$splitComponentImporter$11 = () => import("./admin.roles-BWF9CXd1.js");
var Route$12 = createFileRoute("/admin/roles")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.rewards.tsx
var $$splitComponentImporter$10 = () => import("./admin.rewards-79yNeYCx.js");
var Route$11 = createFileRoute("/admin/rewards")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.reels.tsx
var $$splitComponentImporter$9 = () => import("./admin.reels-ujBgyUM-.js");
var Route$10 = createFileRoute("/admin/reels")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/admin.pages.tsx
var $$splitComponentImporter$8 = () => import("./admin.pages-D6cvJ_IE.js");
var Route$9 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.journalists.tsx
var $$splitComponentImporter$7 = () => import("./admin.journalists-Co2oMqG0.js");
var Route$8 = createFileRoute("/admin/journalists")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.inbox.tsx
var $$splitComponentImporter$6 = () => import("./admin.inbox-B3tGf7yI.js");
var Route$7 = createFileRoute("/admin/inbox")({
	head: () => ({ meta: [{ title: "Admin Inbox - News Timeline" }, {
		name: "description",
		content: "Review contact messages, journalist applications, and user requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/admin.homepage.tsx
var $$splitComponentImporter$5 = () => import("./admin.homepage-Hzm5_m9J.js");
var Route$6 = createFileRoute("/admin/homepage")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/admin.files.tsx
var $$splitComponentImporter$4 = () => import("./admin.files-RZuTyUXW.js");
var Route$5 = createFileRoute("/admin/files")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/admin.comments.tsx
var $$splitComponentImporter$3 = () => import("./admin.comments-hogZ8CEj.js");
var Route$4 = createFileRoute("/admin/comments")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.categories.tsx
var $$splitComponentImporter$2 = () => import("./admin.categories-CkgGE1Yu.js");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin.articles.tsx
var $$splitComponentImporter$1 = () => import("./admin.articles-CHRHG9zb.js");
var Route$2 = createFileRoute("/admin/articles")({
	head: () => ({ meta: [{ title: "Manage Articles - Admin Dashboard" }, {
		name: "description",
		content: "Create, edit, filter, and manage published and drafted articles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/admin.advertisements.tsx
var $$splitComponentImporter = () => import("./admin.advertisements-XaDyNldg.js");
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
var WorkWithUsRoute = Route$40.update({
	id: "/work-with-us",
	path: "/work-with-us",
	getParentRoute: () => Route$39
});
var WithdrawPointsRoute = Route$38.update({
	id: "/withdraw-points",
	path: "/withdraw-points",
	getParentRoute: () => Route$39
});
var WatchRoute = Route$37.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$39
});
var VerifyImageRoute = Route$36.update({
	id: "/verify-image",
	path: "/verify-image",
	getParentRoute: () => Route$39
});
var VerifiedJournalistRoute = Route$41.update({
	id: "/verified-journalist",
	path: "/verified-journalist",
	getParentRoute: () => Route$39
});
var TermsAndConditionsRoute = Route$42.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$39
});
var SubscriptionRoute = Route$35.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => Route$39
});
var SubmitNewsRoute = Route$34.update({
	id: "/submit-news",
	path: "/submit-news",
	getParentRoute: () => Route$39
});
var SitemapDotxmlRoute = Route$33.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$39
});
var SetupRoute = Route$32.update({
	id: "/setup",
	path: "/setup",
	getParentRoute: () => Route$39
});
var SearchRoute = Route$43.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$39
});
var RssDotxmlRoute = Route$31.update({
	id: "/rss.xml",
	path: "/rss.xml",
	getParentRoute: () => Route$39
});
var ResultsRoute = Route$30.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => Route$39
});
var ResetPasswordRoute = Route$29.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$39
});
var RefundPolicyRoute = Route$44.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$39
});
var ReelsRoute = Route$45.update({
	id: "/reels",
	path: "/reels",
	getParentRoute: () => Route$39
});
var ProfileRoute = Route$28.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$39
});
var PrivacyPolicyRoute = Route$46.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$39
});
var NewsSitemapDotxmlRoute = Route$27.update({
	id: "/news-sitemap.xml",
	path: "/news-sitemap.xml",
	getParentRoute: () => Route$39
});
var ForgotPasswordRoute = Route$26.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$39
});
var FactCheckingPolicyRoute = Route$47.update({
	id: "/fact-checking-policy",
	path: "/fact-checking-policy",
	getParentRoute: () => Route$39
});
var FactCheckRoute = Route$25.update({
	id: "/fact-check",
	path: "/fact-check",
	getParentRoute: () => Route$39
});
var EventRoute = Route$24.update({
	id: "/event",
	path: "/event",
	getParentRoute: () => Route$39
});
var EditorialPolicyRoute = Route$48.update({
	id: "/editorial-policy",
	path: "/editorial-policy",
	getParentRoute: () => Route$39
});
var EarnPointsRoute = Route$23.update({
	id: "/earn-points",
	path: "/earn-points",
	getParentRoute: () => Route$39
});
var DmcaRoute = Route$49.update({
	id: "/dmca",
	path: "/dmca",
	getParentRoute: () => Route$39
});
var DisclaimerRoute = Route$50.update({
	id: "/disclaimer",
	path: "/disclaimer",
	getParentRoute: () => Route$39
});
var DataDeletionPolicyRoute = Route$51.update({
	id: "/data-deletion-policy",
	path: "/data-deletion-policy",
	getParentRoute: () => Route$39
});
var CookiePolicyRoute = Route$52.update({
	id: "/cookie-policy",
	path: "/cookie-policy",
	getParentRoute: () => Route$39
});
var ContactRoute = Route$22.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$39
});
var AuthRoute = Route$21.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$39
});
var ArchiveRoute = Route$53.update({
	id: "/archive",
	path: "/archive",
	getParentRoute: () => Route$39
});
var ApplyJournalistRoute = Route$20.update({
	id: "/apply-journalist",
	path: "/apply-journalist",
	getParentRoute: () => Route$39
});
var ApplyRoute = Route$19.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$39
});
var AdminRoute = Route$54.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$39
});
var AboutRoute = Route$55.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$39
});
var SlugRoute = Route$56.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => Route$39
});
var IndexRoute = Route$57.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$39
});
var AdminIndexRoute = Route$58.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var NewsSlugRoute = Route$59.update({
	id: "/news/$slug",
	path: "/news/$slug",
	getParentRoute: () => Route$39
});
var ApiUpdatesRoute = Route$18.update({
	id: "/api/updates",
	path: "/api/updates",
	getParentRoute: () => Route$39
});
var ApiUpdateRoute = Route$17.update({
	id: "/api/update",
	path: "/api/update",
	getParentRoute: () => Route$39
});
var ApiRssRoute = Route$16.update({
	id: "/api/rss",
	path: "/api/rss",
	getParentRoute: () => Route$39
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
var AdminSettingsRoute = Route$60.update({
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
	getParentRoute: () => Route$39
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
	FactCheckRoute,
	FactCheckingPolicyRoute,
	ForgotPasswordRoute,
	NewsSitemapDotxmlRoute,
	PrivacyPolicyRoute,
	ProfileRoute,
	ReelsRoute,
	RefundPolicyRoute,
	ResetPasswordRoute,
	ResultsRoute,
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
var routeTree = Route$39._addFileChildren(rootRouteChildren)._addFileTypes();
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

//# sourceMappingURL=router-DgtKh-80.js.map