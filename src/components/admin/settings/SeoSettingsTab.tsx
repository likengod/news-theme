import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Globe,
  Search,
  Bot,
  ShieldCheck,
  Newspaper,
  ExternalLink,
  Code2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";
import { MediaField } from "@/components/admin/MediaField";
import { Card } from "./SettingsHelpers";

interface SeoSettingsTabProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function SeoSettingsTab({ s, update }: SeoSettingsTabProps) {
  const navigate = useNavigate();
  const currentTitle = s.siteName || "News Timeline";
  const currentDesc =
    s.metaDescription ||
    "Latest breaking news, politics, Northeast India coverage, current affairs, and ground reports.";

  const currentOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost:3099";

  const canonicalUrl = s.seoCanonicalBaseUrl || currentOrigin;

  useEffect(() => {
    if (
      !s.seoCanonicalBaseUrl ||
      s.seoCanonicalBaseUrl.includes("domainname.com") ||
      s.seoCanonicalBaseUrl.includes("todaytripura.com")
    ) {
      if (typeof window !== "undefined" && window.location?.origin) {
        update("seoCanonicalBaseUrl", window.location.origin);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Live Google Search Result Snippet Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Google Search Result Snippet Preview
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Live SERP Simulation</span>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
            <div className="h-4 w-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">
              G
            </div>
            <span className="truncate">{canonicalUrl.replace(/^https?:\/\//, "")}</span>
            <span className="text-slate-400">› news</span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer truncate">
            {currentTitle} {s.tagline ? `– ${s.tagline}` : "– Breaking News"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {currentDesc}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>
            Search title & snippet are dynamically generated from your <strong>Site Name</strong>, <strong>Tagline</strong>, and <strong>Meta Description</strong>.
          </span>
          <button
            type="button"
            onClick={() => navigate({ to: ".", search: { tab: "general" } })}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
          >
            Edit in General Settings <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 2. Canonical URL & News Search Keywords */}
      <Card
        title="1. Canonical Domain & Search Keywords"
        subtitle="Configure your primary production canonical URL and global publication search keywords."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Canonical Base URL
              </label>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.location?.origin) {
                    update("seoCanonicalBaseUrl", window.location.origin);
                  }
                }}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Use current domain ({currentOrigin})
              </button>
            </div>
            <input
              type="url"
              value={s.seoCanonicalBaseUrl || currentOrigin}
              onChange={(e) => update("seoCanonicalBaseUrl", e.target.value)}
              placeholder={currentOrigin}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Currently active domain: <strong className="text-slate-700">{currentOrigin}</strong>. Automatically updates when your website is live.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Global News Keywords (Comma Separated)
            </label>
            <input
              type="text"
              value={s.seoKeywords || ""}
              onChange={(e) => update("seoKeywords", e.target.value)}
              placeholder="Breaking News, Politics, Northeast India, Tripura News, Current Affairs"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Target keywords used for search engine indexing and news topic categorization.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. OpenGraph Fallback Banner */}
      <Card
        title="2. OpenGraph Fallback Social Banner"
        subtitle="Default banner shown when readers share pages that do not have their own article thumbnail."
      >
        <div className="space-y-3">
          <MediaField
            label="Default Social Share Banner (og:image)"
            value={s.seoOgImage || ""}
            onChange={(url) => update("seoOgImage", url)}
            hint="Recommended dimensions: 1200 × 630 px (WebP, JPG or PNG). Fallback for homepage and general pages."
          />

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <span>
              Official Twitter / X profile handle is automatically pulled from your connected profiles.
            </span>
            <button
              type="button"
              onClick={() => navigate({ to: ".", search: { tab: "integrations" } })}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline shrink-0"
            >
              Manage Social Profiles <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </Card>

      {/* 4. Robots & Indexing Controls */}
      <Card
        title="3. Search Engine Indexing & Robots Directives"
        subtitle="Manage search engine bot crawl instructions, snippet length limits, and image preview sizes."
      >
        <div className="space-y-4">
          {/* Master Indexing Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-slate-700" />
                <span className="text-sm font-bold text-slate-800">Search Engine Indexing</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    s.seoRobotsIndex !== false
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {s.seoRobotsIndex !== false ? "INDEX" : "NOINDEX"}
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                Allow search engines (Google, Bing, DuckDuckGo) to discover and index your news
                pages.
              </span>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs shrink-0">
              <button
                type="button"
                onClick={() => update("seoRobotsIndex", true)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                  s.seoRobotsIndex !== false
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Allow (Index)
              </button>
              <button
                type="button"
                onClick={() => update("seoRobotsIndex", false)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                  s.seoRobotsIndex === false
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Block (Noindex)
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={s.seoRobotsFollow !== false}
                onChange={(e) => update("seoRobotsFollow", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Follow Internal Links</span>
                <span className="text-[11px] text-slate-500 block">
                  Instruct crawlers to follow article and category hyperlinks (recommended: ON).
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={s.seoGooglebotNews !== false}
                onChange={(e) => update("seoGooglebotNews", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Googlebot-News High-Res Previews
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Enables <code>max-image-preview:large</code> for rich Google Discover & News carousel
                  cards.
                </span>
              </div>
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Active Output Meta Tag:</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                View /robots.txt <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <code className="text-xs font-mono text-emerald-800 bg-white border border-slate-200 px-2.5 py-1.5 rounded block">
              &lt;meta name="robots" content="
              {s.seoRobotsIndex === false
                ? "noindex, nofollow"
                : `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`}
              " /&gt;
            </code>
          </div>
        </div>
      </Card>

      {/* 5. Google News & XML Sitemaps */}
      <Card
        title="4. Google News & XML Sitemaps Hub"
        subtitle="Submit these XML feeds to Google Publisher Center and Search Console for rapid discovery of breaking stories."
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">XML Sitemap</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-mono">/sitemap.xml</span>
            </a>

            <a
              href="/news-sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Google News Sitemap</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-mono">/news-sitemap.xml</span>
            </a>

            <a
              href="/rss.xml"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">RSS News Feed</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-mono">/rss.xml</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://publishercenter.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Newspaper className="h-3.5 w-3.5 text-red-600" /> Google Publisher Center{" "}
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-blue-600" /> Google Search Console{" "}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Cross-link to Integrations for Webmaster Verification */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                Search Console, Bing, and Yandex verification tags are configured in{" "}
                <strong>Integrations &rarr; Verification</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: ".", search: { tab: "integrations" } })}
              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline shrink-0"
            >
              Go to Integrations <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* 6. Schema.org NewsMediaOrganization Markup */}
      <Card
        title="5. Schema.org NewsMediaOrganization Structured Data"
        subtitle="Trust signals and editorial accountability policies required by Google News algorithms."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Editorial Policy URL
              </label>
              <input
                type="text"
                value={s.seoEditorialPolicyUrl || "/editorial-policy"}
                onChange={(e) => update("seoEditorialPolicyUrl", e.target.value)}
                placeholder="/editorial-policy"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Link to editorial independence and guidelines page.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Corrections Policy URL
              </label>
              <input
                type="text"
                value={s.seoCorrectionsPolicyUrl || "/contact"}
                onChange={(e) => update("seoCorrectionsPolicyUrl", e.target.value)}
                placeholder="/contact"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Required for Google News transparency guidelines.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Fact-Checking Policy URL
              </label>
              <input
                type="text"
                value={s.seoFactCheckingPolicyUrl || "/fact-checking-policy"}
                onChange={(e) => update("seoFactCheckingPolicyUrl", e.target.value)}
                placeholder="/fact-checking-policy"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Required for Google News Trust Indicators.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-emerald-600" />
              <span>
                Organization Name (<strong>{currentTitle}</strong>), Logo, and Contact Email are automatically linked from your Brand Information.
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: ".", search: { tab: "general" } })}
              className="font-semibold text-blue-600 hover:underline shrink-0"
            >
              View General &rarr;
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SeoSettingsTab;
