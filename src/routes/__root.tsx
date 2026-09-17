import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider, themeInitScript } from "../lib/theme";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsInjector } from "@/components/site/AnalyticsInjector";
import { AdSettingsProvider } from "@/components/site/AdSettingsContext";
import {
  getSiteSettingsServer,
  getAdConfigurationServer,
  getRedirectRulesServer,
  incrementRedirectHitServer,
  defaultSettings,
} from "@/lib/site-content";
import { getHomepageConfigServer, defaultHomepageConfig } from "@/lib/homepage-config";
import {
  getFontConfigServer,
  defaultFontConfig,
  buildGoogleFontsUrl,
  buildFontFaceCss,
  buildSectionCssVars,
  FONT_CONFIG_KEY,
} from "@/lib/font-config";
import type { FontConfiguration } from "@/lib/font-config";
import { getCategories } from "@/lib/taxonomy.functions";
import "@/lib/i18n";

import { NotFound } from "@/components/site/NotFound";

function NotFoundComponent() {
  return <NotFound />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        {error?.message && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md text-xs font-mono text-left break-all">
            {error.message}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

import { checkSetupStatus } from "@/lib/setup.functions";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    // Don't intercept server-only API endpoints, XML sitemaps or RSS feeds
    if (
      location.pathname.startsWith("/api/") ||
      location.pathname === "/api/rss" ||
      location.pathname === "/rss.xml" ||
      location.pathname === "/sitemap.xml" ||
      location.pathname === "/news-sitemap.xml"
    ) return;

    // 1. Check setup status first before executing any DB queries
    try {
      const status = await checkSetupStatus();
      const isSetupPage = location.pathname === "/setup";

      if (status.required) {
        if (!isSetupPage) {
          throw redirect({ to: "/setup" });
        }
        // If setup is required and already on /setup, skip redirects/DB rules
        return;
      }
      if (!status.required && isSetupPage) {
        throw redirect({ to: "/" });
      }
    } catch (err: any) {
      // Re-throw TanStack Router redirects
      if (
        err.isRedirect ||
        err.status === 301 ||
        err.status === 302 ||
        err.status === 307 ||
        err.headers
      ) {
        throw err;
      }
      console.error("[__root beforeLoad] Setup check error:", err);
    }

    // 2. Check custom redirect rules only if setup is completed
    try {
      const rules = await getRedirectRulesServer();
      const currentPath = location.pathname;
      const matched = rules.find(
        (r) => r.source.toLowerCase().trim() === currentPath.toLowerCase().trim(),
      );
      if (matched && matched.destination) {
        incrementRedirectHitServer({ data: matched.id }).catch(() => {});
        throw redirect({
          href: matched.destination,
          code: 301,
        });
      }
    } catch (err: any) {
      if (err.isRedirect || err.status === 301 || err.status === 302 || err.headers) {
        throw err;
      }
    }
  },
  loader: async ({ location }) => {
    // If on setup page, return blank defaults without making DB queries
    if (location.pathname === "/setup") {
      return {
        settings: null,
        homepageConfig: null,
        adsConfig: null,
        fontConfig: null,
        categories: [],
      };
    }
    try {
      const [settings, homepageConfig, adsConfig, fontConfig, categories] =
        await Promise.all([
          getSiteSettingsServer(),
          getHomepageConfigServer(),
          getAdConfigurationServer(),
          getFontConfigServer(),
          getCategories(),
        ]);
      return { settings, homepageConfig, adsConfig, fontConfig, categories };
    } catch (err) {
      console.error("[Root Loader] Failed to prefetch config:", err);
      return {
        settings: null,
        homepageConfig: null,
        adsConfig: null,
        fontConfig: null,
        categories: [],
      };
    }
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    const siteTitle = s?.siteName || "News Timeline";
    const tagline = s?.tagline || "Breaking News";
    const title = s?.siteName
      ? `${s.siteName} – ${tagline}`
      : "News Timeline – Breaking News | Finance | Business | Market";

    const desc =
      s?.metaDescription ||
      "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";

    const robotsIndex = s?.seoRobotsIndex === false ? "noindex" : "index";
    const robotsFollow = s?.seoRobotsFollow === false ? "nofollow" : "follow";
    const robotsContent = `${robotsIndex}, ${robotsFollow}`;

    const canonicalBase = s?.seoCanonicalBaseUrl ? s.seoCanonicalBaseUrl.replace(/\/$/, "") : "";
    const ogImage = s?.seoOgImage || (canonicalBase ? `${canonicalBase}/og-image.jpg` : "/og-image.jpg");
    const rawTwitter = s?.twitter || "";
    let twitterHandle = "@NewsTimeline";
    if (rawTwitter) {
      const cleaned = rawTwitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, "").replace(/^@/, "").trim();
      if (cleaned) twitterHandle = `@${cleaned}`;
    }

    const metaTags: Array<Record<string, any>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: title },
      { name: "description", content: desc },
      { name: "robots", content: robotsContent },
      { name: "author", content: siteTitle },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: twitterHandle },
      { name: "twitter:creator", content: twitterHandle },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: ogImage },
    ];

    if (s?.seoKeywords) {
      metaTags.push({ name: "keywords", content: s.seoKeywords });
    }

    if (s?.seoGooglebotNews ?? true) {
      metaTags.push({
        name: "googlebot-news",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      });
      metaTags.push({
        name: "googlebot",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      });
    }

    if (s?.forceHttps) {
      metaTags.push({ httpEquiv: "Content-Security-Policy", content: "upgrade-insecure-requests" });
    }

    if (s?.googleSiteVerification) {
      metaTags.push({ name: "google-site-verification", content: s.googleSiteVerification });
    }
    if (s?.bingSiteVerification) {
      metaTags.push({ name: "msvalidate.01", content: s.bingSiteVerification });
    }
    if (s?.facebookDomainVerification) {
      metaTags.push({
        name: "facebook-domain-verification",
        content: s.facebookDomainVerification,
      });
    }
    if (s?.pinterestSiteVerification) {
      metaTags.push({ name: "p:domain_verify", content: s.pinterestSiteVerification });
    }
    if (s?.yandexVerification) {
      metaTags.push({ name: "yandex-verification", content: s.yandexVerification });
    }

    // Build Google Fonts URL dynamically from font config
    const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
    const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
    const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);

    const links: Array<Record<string, any>> = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${siteTitle} RSS Feed`,
        href: "/rss.xml",
      },
    ];

    if (googleFontsUrl) {
      links.push({
        rel: "preload",
        as: "style",
        href: googleFontsUrl,
      });
      links.push({
        rel: "stylesheet",
        href: googleFontsUrl,
        media: "print",
        onLoad: "this.media='all'",
      });
    }

    if (canonicalBase) {
      links.push({ rel: "canonical", href: canonicalBase });
    }

    const orgSchema: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": s?.seoOrganizationType || "NewsMediaOrganization",
      name: s?.seoNewsPublicationName || siteTitle,
      url: canonicalBase || "http://localhost:3099",
      description: desc,
    };
    if (s?.logoLight || canonicalBase) {
      orgSchema.logo = s?.logoLight || `${canonicalBase}/logo.png`;
    }
    if (s?.seoEditorialContactEmail || s?.contactEmail) {
      orgSchema.contactPoint = {
        "@type": "ContactPoint",
        email: s?.seoEditorialContactEmail || s?.contactEmail,
        contactType: "editorial",
      };
    }
    orgSchema.publishingPrinciples = s?.seoEditorialPolicyUrl || "/editorial-policy";
    orgSchema.correctionsPolicy = s?.seoCorrectionsPolicyUrl || "/contact";
    orgSchema.diversityPolicy = s?.seoFactCheckingPolicyUrl || "/fact-checking-policy";

    const scripts: Array<Record<string, any>> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgSchema),
      },
    ];

    return {
      meta: metaTags,
      links: links,
      scripts: scripts,
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const chunkRecoveryScript = `
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

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: chunkRecoveryScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loaderData = Route.useLoaderData();

  useEffect(() => {
    if (
      loaderData?.settings?.forceHttps &&
      window.location.protocol === "http:" &&
      window.location.hostname !== "localhost"
    ) {
      window.location.protocol = "https:";
    }
    if (typeof window === "undefined" || !loaderData) return;
    const { settings, homepageConfig, adsConfig, fontConfig } = loaderData;
    if (settings) {
      localStorage.setItem("nt:site-settings", JSON.stringify(settings));
    }
    if (fontConfig) {
      localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(fontConfig));
    }
    if (homepageConfig) {
      localStorage.setItem("nt:homepage-config:v1", JSON.stringify(homepageConfig));
    }
    if (adsConfig) {
      if (adsConfig.slots) {
        Object.keys(adsConfig.slots).forEach((slot) => {
          const key = slot === "home1" ? "nt:site-ads" : `nt:site-ads-${slot}`;
          localStorage.setItem(key, JSON.stringify((adsConfig.slots as any)[slot]));
        });
      }
      if (adsConfig.modes) {
        localStorage.setItem("nt:ad-slot-mode", JSON.stringify(adsConfig.modes));
      }
      if (adsConfig.scripts) {
        localStorage.setItem("nt:ad-slot-script", JSON.stringify(adsConfig.scripts));
      }
      if (adsConfig.rotations) {
        localStorage.setItem("nt:site-ads-rotation", JSON.stringify(adsConfig.rotations));
      }
      if (adsConfig.popupConfig) {
        localStorage.setItem("nt:popup-ad-config", JSON.stringify(adsConfig.popupConfig));
      }

      window.dispatchEvent(new Event("nt:ads-updated"));
      window.dispatchEvent(new Event("nt:homepage-updated"));
    }
  }, [loaderData]);

  // Inject dynamic font styles (uploaded @font-face + section CSS variable overrides)
  const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
  useEffect(() => {
    // @font-face for uploaded fonts
    const faceCss = buildFontFaceCss(fontConfig.fonts);
    let faceStyle = document.getElementById("nt-font-face") as HTMLStyleElement | null;
    if (!faceStyle) {
      faceStyle = document.createElement("style");
      faceStyle.id = "nt-font-face";
      document.head.appendChild(faceStyle);
    }
    faceStyle.textContent = faceCss;

    // Section CSS variable overrides
    const varsCss = buildSectionCssVars(fontConfig);
    let varsStyle = document.getElementById("nt-font-vars") as HTMLStyleElement | null;
    if (!varsStyle) {
      varsStyle = document.createElement("style");
      varsStyle.id = "nt-font-vars";
      document.head.appendChild(varsStyle);
    }
    varsStyle.textContent = varsCss;

    // Google Fonts asynchronous non-blocking stylesheet attachment
    const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
    const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
    let fontLink = document.getElementById("nt-google-fonts") as HTMLLinkElement | null;
    if (googleFontsUrl) {
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = "nt-google-fonts";
        fontLink.rel = "stylesheet";
        fontLink.href = googleFontsUrl;
        document.head.appendChild(fontLink);
      } else if (fontLink.href !== googleFontsUrl) {
        fontLink.href = googleFontsUrl;
      }
    }

    return () => {
      faceStyle?.remove();
      varsStyle?.remove();
    };
  }, [fontConfig]);

  // Re-apply font vars on settings update from admin
  useEffect(() => {
    const handleFontUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (detail) {
          const fc = typeof detail === "string" ? JSON.parse(detail) : detail;
          const varsCss = buildSectionCssVars(fc);
          const varsStyle = document.getElementById("nt-font-vars");
          if (varsStyle) varsStyle.textContent = varsCss;
        }
      } catch {}
    };
    window.addEventListener("nt:fonts-updated", handleFontUpdate);
    return () => window.removeEventListener("nt:fonts-updated", handleFontUpdate);
  }, []);

  const contextValue = {
    settings: loaderData?.settings ?? defaultSettings,
    homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
    adConfig: (loaderData?.adsConfig ?? {
      slots: {
        home1: [],
        home2: [],
        ad3: [],
        popup: [],
        leaderboard: [],
        hero_showcase: [],
        reel_ads: [],
      },
      modes: {
        home1: "image",
        home2: "image",
        ad3: "image",
        popup: "image",
        leaderboard: "image",
        hero_showcase: "image",
        reel_ads: "image",
      },
      scripts: { home1: "", home2: "", ad3: "", popup: "", leaderboard: "", hero_showcase: "", reel_ads: "" },
      rotations: {
        home1: 5,
        home2: 5,
        ad3: 5,
        popup: 6,
        leaderboard: 5,
        hero_showcase: 5,
        reel_ads: 5,
      },
    }) as any,
    fontConfig: fontConfig,
    categories: loaderData?.categories ?? [],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdSettingsProvider value={contextValue}>
          <Outlet />
          <Toaster />
          <AnalyticsInjector />
        </AdSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootComponent;
