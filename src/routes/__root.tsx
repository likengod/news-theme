import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { ThemeProvider } from "../lib/theme";
import { Toaster } from "@/components/ui/sonner";

function LazyToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <Toaster />;
}

import { AnalyticsInjector } from "@/components/site/AnalyticsInjector";
import { AdSettingsProvider } from "@/components/site/AdSettingsContext";
import {
  getSiteSettingsServer,
  defaultSettings,
} from "@/lib/site-content/site-settings";
import {
  getAdConfigurationServer,
} from "@/lib/site-content/ads-storage";
import {
  getRedirectRulesServer,
  incrementRedirectHitServer,
} from "@/lib/site-content/redirect-rules";
import { getHomepageConfigServer, defaultHomepageConfig } from "@/lib/homepage-config";
import {
  getFontConfigServer,
  defaultFontConfig,
} from "@/lib/font-config";
import { getCategories } from "@/lib/taxonomy.functions";
import "@/lib/i18n";

import { NotFound } from "@/components/site/NotFound";
import { ErrorComponent } from "@/components/layout/ErrorComponent";
import { RootShell } from "@/components/layout/RootShell";
import { generateRootHead } from "@/components/layout/rootHead";
import { useRootEffects } from "@/components/layout/useRootEffects";
import { buildAdConfigData } from "@/components/layout/rootUtils";
import { checkSetupStatus } from "@/lib/setup.functions";

function NotFoundComponent() {
  return <NotFound />;
}

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
        return;
      }
      if (!status.required && isSetupPage) {
        throw redirect({ to: "/" });
      }
    } catch (err: any) {
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
  head: ({ loaderData }) => generateRootHead(loaderData),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loaderData = Route.useLoaderData();

  useRootEffects(loaderData);

  const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
  const adConfigData = buildAdConfigData(loaderData?.adsConfig);

  const contextValue = {
    settings: loaderData?.settings ?? defaultSettings,
    homepageConfig: loaderData?.homepageConfig ?? defaultHomepageConfig,
    adConfig: adConfigData as any,
    fontConfig: fontConfig,
    categories: loaderData?.categories ?? [],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdSettingsProvider value={contextValue}>
          <Outlet />
          <LazyToaster />
          <AnalyticsInjector />
        </AdSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootComponent;
