import React, { useState } from "react";
import {
  Globe,
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Share2,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Monitor,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { MediaField } from "@/components/admin/MediaField";
import { generatePageSeoServer } from "@/lib/ai.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export interface PageSeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface PageSeoFormProps {
  pageTitle: string;
  pageIntro: string;
  pageContent?: string;
  pageSlug: string;
  seo: PageSeoData;
  onChange: <K extends keyof PageSeoData>(key: K, value: PageSeoData[K]) => void;
  siteName?: string;
}

export function PageSeoForm({
  pageTitle,
  pageIntro,
  pageContent,
  pageSlug,
  seo,
  onChange,
  siteName = "News Theme",
}: PageSeoFormProps) {
  const siteSettings = useSiteSettings();
  const isEnterprise = (siteSettings?.licenseType || "").toLowerCase().includes("enterprise");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiGenerateSeo = async () => {
    if (!isEnterprise) {
      toast.error("AI SEO Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await generatePageSeoServer({
        data: {
          pageTitle,
          pageIntro,
          pageContent: pageContent || "",
          pageSlug,
          siteName,
        },
      });

      if (res.metaTitle) onChange("metaTitle", res.metaTitle);
      if (res.metaDescription) onChange("metaDescription", res.metaDescription);
      if (res.metaKeywords) onChange("metaKeywords", res.metaKeywords);

      toast.success("AI generated SEO tags successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate SEO tags with AI.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const currentOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "http://localhost:3099";

  const cleanSlug = pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;
  const fullUrl = `${currentOrigin}${cleanSlug}`;

  const currentTitle =
    seo.metaTitle?.trim() || `${pageTitle || "Page"} — ${siteName}`;

  const currentDescription =
    seo.metaDescription?.trim() ||
    pageIntro?.trim() ||
    "Read comprehensive updates, verified reporting, and official documentation on this page.";

  const titleLength = (seo.metaTitle || "").length;
  const descLength = (seo.metaDescription || "").length;

  return (
    <div className="space-y-6">
      {/* 1. Live Google Search Result Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Google Search Result Snippet Preview
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                previewDevice === "desktop"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                previewDevice === "mobile"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>
        </div>

        <div
          className={`rounded-xl border border-slate-200 bg-[#f8fafc] p-4 transition-all ${
            previewDevice === "mobile" ? "max-w-md mx-auto" : "max-w-2xl"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
              {siteName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {siteName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{fullUrl}</div>
            </div>
          </div>
          <div className="mt-1">
            <div className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
              {currentTitle}
            </div>
            <p className="mt-1 text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
              {currentDescription}
            </p>
          </div>
        </div>
      </div>

      {/* 2. SEO Meta Fields */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Page Meta Tags & Search Indexing</h3>
            <p className="text-xs text-slate-500">
              Configure how search engines index and rank this specific page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isEnterprise) {
                toast.error("AI SEO Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
                return;
              }
              handleAiGenerateSeo();
            }}
            disabled={isGeneratingAi}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer disabled:cursor-not-allowed ${
              isEnterprise
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95 active:scale-95 disabled:opacity-50"
                : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            }`}
            title={
              !isEnterprise
                ? "Enterprise Feature Locked — Upgrade to Enterprise or Enterprise+ to use AI Assistant"
                : "Automatically analyze this page and generate optimal Title, Description, and Keywords using AI"
            }
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>AI Analyzing & Generating...</span>
              </>
            ) : isEnterprise ? (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>AI Assistant</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-600" />
                <span>AI Assistant</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded ml-0.5">
                  Enterprise
                </span>
              </>
            )}
          </button>
        </div>

        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              SEO Title Tag (<span className="text-slate-500 font-normal">&lt;title&gt;</span>)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange("metaTitle", `${pageTitle} — ${siteName}`)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Use page title
              </button>
              <span
                className={`text-xs font-semibold ${
                  titleLength > 60 ? "text-amber-600 font-bold" : "text-slate-400"
                }`}
              >
                {titleLength} / 60 chars
              </span>
            </div>
          </div>
          <input
            type="text"
            value={seo.metaTitle || ""}
            onChange={(e) => onChange("metaTitle", e.target.value)}
            placeholder={`${pageTitle || "Page Title"} — ${siteName}`}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Recommended length: 50–60 characters. Leave blank to automatically use the page title with site name.
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              SEO Meta Description
            </label>
            <div className="flex items-center gap-2">
              {pageIntro && (
                <button
                  type="button"
                  onClick={() => onChange("metaDescription", pageIntro.slice(0, 160))}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Use page intro
                </button>
              )}
              <span
                className={`text-xs font-semibold ${
                  descLength > 160 ? "text-amber-600 font-bold" : "text-slate-400"
                }`}
              >
                {descLength} / 160 chars
              </span>
            </div>
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription || ""}
            onChange={(e) => onChange("metaDescription", e.target.value)}
            placeholder="Write a clear, concise summary of this page for Google search results (~155 characters)..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Recommended length: 140–160 characters. Search engines use this to display the snippet under your headline.
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Meta Keywords / Search Tags
          </label>
          <input
            type="text"
            value={seo.metaKeywords || ""}
            onChange={(e) => onChange("metaKeywords", e.target.value)}
            placeholder="e.g. newsroom, editorial policy, standards, northeast india"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Comma-separated keywords helping search engines categorize this page topic.
          </p>
        </div>

        {/* Social Share / OG Image */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Social Share Image (Open Graph / Twitter Card)
          </label>
          <MediaField
            label="Social Share Image (1200x630 recommended)"
            value={seo.ogImage || ""}
            onChange={(v) => onChange("ogImage", v)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            This image appears when readers share the page URL on WhatsApp, Facebook, LinkedIn, or Twitter/X.
          </p>
        </div>

        {/* Canonical URL Override */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Canonical URL Override (Optional)
          </label>
          <input
            type="text"
            value={seo.canonicalUrl || ""}
            onChange={(e) => onChange("canonicalUrl", e.target.value)}
            placeholder={fullUrl}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Defaults automatically to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{fullUrl}</code>. Only override if this page content duplicates another URL.
          </p>
        </div>

        {/* Robots Indexing Directive */}
        <div className="pt-3 border-t border-slate-100">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Allow Search Engines to Index This Page
              </span>
              <span className="text-[11px] text-slate-500 block">
                {seo.noIndex
                  ? "Page is set to 'noindex, nofollow' (Search engines will ignore this page)."
                  : "Page is set to 'index, follow' (Recommended: Search engines will index this page in search results)."}
              </span>
            </div>
            <input
              type="checkbox"
              checked={!seo.noIndex}
              onChange={(e) => onChange("noIndex", !e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
