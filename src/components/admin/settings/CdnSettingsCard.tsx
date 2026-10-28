import React, { useState } from "react";
import {
  Globe,
  Zap,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { type SiteSettings } from "@/lib/site-content";
import { Card, Toggle } from "@/components/admin/settings/SettingsHelpers";
import { purgeEdgeCdnServer } from "@/lib/cdn.functions";

interface CdnSettingsCardProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function CdnSettingsCard({ s, update }: CdnSettingsCardProps) {
  const [purging, setPurging] = useState(false);
  const provider = s.cdnProvider && s.cdnProvider !== "none" ? s.cdnProvider : "none";
  const isSelected = provider !== "none";

  // Check if active provider requirements are filled
  let isConfigured = false;
  if (provider === "cloudflare") {
    isConfigured = Boolean(s.cloudflareZoneId?.trim() && s.cloudflareApiToken?.trim());
  } else if (provider === "bunny") {
    isConfigured = Boolean(s.bunnyPullZoneId?.trim() && s.bunnyAccessKey?.trim());
  } else if (provider === "cloudfront") {
    isConfigured = Boolean(s.cloudfrontDistributionId?.trim());
  } else if (provider === "fastly") {
    isConfigured = Boolean(s.fastlyServiceId?.trim() && s.fastlyApiKey?.trim());
  } else if (provider === "custom") {
    isConfigured = Boolean(s.cdnPurgeWebhookUrl?.trim());
  }

  const handlePurge = async () => {
    setPurging(true);
    try {
      const res = await purgeEdgeCdnServer();
      if (res.success) {
        toast.success(res.message || "Edge CDN cache successfully purged!");
      } else {
        toast.error(res.message || "Failed to purge Edge CDN cache.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to trigger edge cache purge.");
    } finally {
      setPurging(false);
    }
  };

  const providers = [
    {
      id: "none",
      name: "-- Select CDN Provider (Disabled) --",
      description: "No external CDN active. Serving directly from the Node.js server origin.",
    },
    {
      id: "cloudflare",
      name: "☁️ Cloudflare (Reverse Proxy & Edge Purge)",
      description: "Global reverse-proxy edge with automatic DDoS mitigation, HTTP/3, and instant Zone cache invalidation.",
      guideUrl: "https://dash.cloudflare.com",
    },
    {
      id: "bunny",
      name: "🐰 BunnyCDN (Pull Zone & High-Speed Media)",
      description: "Ultra-fast global pull zone and storage CDN for heavy media, images, and video reels delivery.",
      guideUrl: "https://dash.bunny.net",
    },
    {
      id: "cloudfront",
      name: "🌐 AWS CloudFront (Amazon Global CDN)",
      description: "Amazon Web Services worldwide edge delivery network connected to your Hostinger origin.",
      guideUrl: "https://console.aws.amazon.com/cloudfront",
    },
    {
      id: "fastly",
      name: "⚡ Fastly (Sub-Second Real-Time Edge)",
      description: "Edge cloud network with instant cache purging API and real-time observability.",
      guideUrl: "https://manage.fastly.com",
    },
    {
      id: "custom",
      name: "🔗 Custom / Webhook (Any CDN)",
      description: "Connect KeyCDN, Akamai, Google Cloud CDN, or any CDN supporting HTTP POST purge webhooks.",
    },
  ];

  const currentProviderInfo = providers.find((p) => p.id === provider) || providers[0];

  const sampleUrl = s.cdnMediaBaseUrl
    ? `${s.cdnMediaBaseUrl.replace(/\/+$/, "")}/uploads/media/tripura-news.webp`
    : "/uploads/media/tripura-news.webp";

  return (
    <Card
      title="CDN & Edge Cache Acceleration"
      subtitle="Connect Cloudflare, BunnyCDN, AWS CloudFront, Fastly, or any custom CDN to accelerate media delivery, cut server bandwidth, and purge edge caches with 1 click."
    >
      {/* 1. CDN Provider Dropdown Header with Configured / Not Configured Badge */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-semibold text-slate-700">
            Choose CDN Provider
          </label>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                <XCircle className="h-3.5 w-3.5" /> Not Configured
              </span>
            )}
            {currentProviderInfo?.guideUrl && isSelected && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={currentProviderInfo.guideUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                >
                  Setup Guide <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <select
            value={provider}
            onChange={(e) => update("cdnProvider", e.target.value as any)}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-slate-900 focus:outline-none"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          {currentProviderInfo.description}
        </p>
      </div>

      {/* 2. ONLY SHOW REQUIREMENTS & OPTIONS IF A CDN PROVIDER IS SELECTED (FLAT DESIGN - NO NESTED CARDS) */}
      {isSelected && (
        <div className="space-y-4 pt-3 border-t border-slate-100">
          {/* Cloudflare Flat Fields */}
          {provider === "cloudflare" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Zone ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={s.cloudflareZoneId || ""}
                  onChange={(e) => update("cloudflareZoneId", e.target.value)}
                  placeholder="e.g. 023e105f4ecef8ad9ca31a8372d0c353"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Found on Cloudflare domain Overview page (right sidebar).
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  API Bearer Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={s.cloudflareApiToken || ""}
                  onChange={(e) => update("cloudflareApiToken", e.target.value)}
                  placeholder="Cloudflare API Token"
                  autoComplete="off"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  API Token requires <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Zone.Cache Purge</code> permission.
                </p>
              </div>
            </>
          )}

          {/* BunnyCDN Flat Fields */}
          {provider === "bunny" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Pull Zone ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={s.bunnyPullZoneId || ""}
                  onChange={(e) => update("bunnyPullZoneId", e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Found in BunnyCDN under Pull Zones &rarr; Details.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  API Access Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={s.bunnyAccessKey || ""}
                  onChange={(e) => update("bunnyAccessKey", e.target.value)}
                  placeholder="BunnyCDN API Key"
                  autoComplete="off"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Found under Account Settings &rarr; API &rarr; Access Key.
                </p>
              </div>
            </>
          )}

          {/* AWS CloudFront Flat Fields */}
          {provider === "cloudfront" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                CloudFront Distribution ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={s.cloudfrontDistributionId || ""}
                onChange={(e) => update("cloudfrontDistributionId", e.target.value)}
                placeholder="e.g. E1234567890ABC"
                className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                CloudFront caches static files according to HTTP Cache-Control headers sent by the server.
              </p>
            </div>
          )}

          {/* Fastly Flat Fields */}
          {provider === "fastly" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Service ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={s.fastlyServiceId || ""}
                  onChange={(e) => update("fastlyServiceId", e.target.value)}
                  placeholder="Fastly Service ID"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  API Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={s.fastlyApiKey || ""}
                  onChange={(e) => update("fastlyApiKey", e.target.value)}
                  placeholder="Fastly API Token"
                  autoComplete="off"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Custom Webhook Flat Fields */}
          {provider === "custom" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Purge Webhook Endpoint (POST) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={s.cdnPurgeWebhookUrl || ""}
                onChange={(e) => update("cdnPurgeWebhookUrl", e.target.value)}
                placeholder="https://api.yourcdn.com/purge-hook"
                className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Dispatches an HTTP POST request with cache invalidation metadata.
              </p>
            </div>
          )}

          {/* Universal CDN Media Delivery URL (Flat) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">
                CDN Media Delivery URL
              </label>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Works with ANY CDN
              </span>
            </div>
            <input
              type="url"
              value={s.cdnMediaBaseUrl || ""}
              onChange={(e) => update("cdnMediaBaseUrl", e.target.value)}
              placeholder="https://cdn.todaytripura.com"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Optional CDN pull zone or custom subdomain (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">https://cdn.todaytripura.com</code>).
            </p>

            <Toggle
              label="Enable CDN Media Delivery"
              checked={!!s.cdnEnabled}
              onChange={(v) => update("cdnEnabled", v)}
              hint="When enabled, frontend images in /uploads/ automatically resolve to the CDN media URL."
            />

            {s.cdnEnabled && s.cdnMediaBaseUrl && (
              <div className="rounded bg-slate-50 p-2 border border-slate-100 text-[11px] space-y-0.5">
                <span className="font-medium text-slate-600">Routing Preview:</span>
                <div className="font-mono text-emerald-700 text-xs break-all">
                  ↳ {sampleUrl}
                </div>
              </div>
            )}
          </div>

          {/* Instant Purge Action Bar (Flat) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" /> Instant Edge & Server Purge
              </p>
              <p className="text-[11px] text-slate-500">
                Flushes server RAM and invalidates edge CDN cache.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePurge}
              disabled={purging}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${purging ? "animate-spin" : ""}`} />
              {purging ? "Purging..." : "Purge Edge CDN Cache"}
            </button>
          </div>

          <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Edge Cache Note:</strong> Static assets are cached for 1 year immutable, and news articles for 60s micro-cache. Edge CDNs respect these RFC headers automatically.
          </div>
        </div>
      )}
    </Card>
  );
}
