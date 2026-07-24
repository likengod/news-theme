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
import { getSiteSettingsServer, getAdConfigurationServer, getRedirectRulesServer, incrementRedirectHitServer, defaultSettings } from "@/lib/site-content";
import { getHomepageConfigServer, defaultHomepageConfig } from "@/lib/homepage-config";
import { getFontConfigServer, defaultFontConfig, buildGoogleFontsUrl, buildFontFaceCss, buildSectionCssVars, FONT_CONFIG_KEY } from "@/lib/font-config";
import type { FontConfiguration } from "@/lib/font-config";

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
    // Don't intercept server-only API endpoints or RSS feeds
    if (location.pathname.startsWith("/api/") || location.pathname === "/api/rss") return;
    
    // Check custom redirect rules
    try {
      const rules = await getRedirectRulesServer();
      const currentPath = location.pathname;
      const matched = rules.find(
        (r) => r.source.toLowerCase().trim() === currentPath.toLowerCase().trim()
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

    try {
      const status = await checkSetupStatus();
      const isSetupPage = location.pathname === "/setup";
      
      if (status.required && !isSetupPage) {
        throw redirect({ to: "/setup" });
      }
      if (!status.required && isSetupPage) {
        throw redirect({ to: "/" });
      }
    } catch (err: any) {
      // Re-throw TanStack Router redirects
      if (err.isRedirect || err.status === 302 || err.status === 307 || err.headers) {
        throw err;
      }
      console.error("[__root beforeLoad] Setup check error:", err);
    }
  },
  loader: async () => {
    try {
      const [settings, homepageConfig, adsConfig, redirectRules, fontConfig] = await Promise.all([
        getSiteSettingsServer(),
        getHomepageConfigServer(),
        getAdConfigurationServer(),
        getRedirectRulesServer(),
        getFontConfigServer(),
      ]);
      return { settings, homepageConfig, adsConfig, redirectRules, fontConfig };
    } catch (err) {
      console.error("[Root Loader] Failed to prefetch config:", err);
      return { settings: null, homepageConfig: null, adsConfig: null, redirectRules: [], fontConfig: null };
    }
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    const title = s?.siteName
      ? `${s.siteName} – ${s.tagline || "Breaking News"}`
      : "News Timeline – Breaking News | Finance | Business | Market";
    const desc = s?.metaDescription || "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";

    const metaTags = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: title },
      { name: "description", content: desc },
      { name: "author", content: s?.siteName || "News Timeline" },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@NewsTimeline" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];

    if (s?.googleSiteVerification) {
      metaTags.push({ name: "google-site-verification", content: s.googleSiteVerification });
    }
    if (s?.bingSiteVerification) {
      metaTags.push({ name: "msvalidate.01", content: s.bingSiteVerification });
    }
    if (s?.facebookDomainVerification) {
      metaTags.push({ name: "facebook-domain-verification", content: s.facebookDomainVerification });
    }
    if (s?.pinterestSiteVerification) {
      metaTags.push({ name: "p:domain_verify", content: s.pinterestSiteVerification });
    }
    if (s?.yandexVerification) {
      metaTags.push({ name: "yandex-verification", content: s.yandexVerification });
    }

    // Build Google Fonts URL dynamically from font config
    const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
    const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts);

    return {
      meta: metaTags,
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        ...(googleFontsUrl ? [{ rel: "stylesheet", href: googleFontsUrl }] : []),
        { rel: "stylesheet", href: appCss },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
          localStorage.setItem(key, JSON.stringify(adsConfig.slots[slot as any]));
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

    return () => {
      faceStyle?.remove();
      varsStyle?.remove();
    };
  }, [fontConfig]);

  // Re-apply font vars on settings update from admin
  useEffect(() => {
    const handleFontUpdate = () => {
      try {
        const raw = localStorage.getItem(FONT_CONFIG_KEY);
        if (raw) {
          const fc = JSON.parse(raw) as FontConfiguration;
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

  const contextValue = {
    settings: loaderData?.settings ?? defaultSettings,
    homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
    adConfig: loaderData?.adsConfig ?? {
      slots: {
        home1: [],
        home2: [],
        ad3: [],
        popup: [],
      },
      modes: {
        home1: "image",
        home2: "image",
        ad3: "image",
        popup: "image",
      },
      scripts: { home1: "", home2: "", ad3: "", popup: "" },
      rotations: {
        home1: 5,
        home2: 5,
        ad3: 5,
        popup: 6,
      },
    },
    fontConfig: fontConfig,
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
