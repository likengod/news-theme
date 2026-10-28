import React, { useState } from "react";
import {
  Globe,
  Zap,
  RefreshCw,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
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
  const provider = s.cdnProvider || "none";

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
      name: "🖥️ Local Server Only (Direct Origin)",
      description: "Direct Node.js server delivery with built-in RFC cache-control headers and in-memory micro-cache.",
    },
    {
      id: "cloudflare",
      name: "☁️ Cloudflare (Reverse Proxy & Edge Purge)",
      description: "Global reverse-proxy edge with automatic DDoS mitigation, HTTP/3, and instant Zone cache invalidation.",
    },
    {
      id: "bunny",
      name: "🐰 BunnyCDN (Pull Zone & High-Speed Media)",
      description: "Ultra-fast global pull zone and storage CDN for heavy media, images, and video reels delivery.",
    },
    {
      id: "cloudfront",
      name: "🌐 AWS CloudFront (Amazon Global CDN)",
      description: "Amazon Web Services worldwide edge delivery network connected to your Hostinger origin.",
    },
    {
      id: "fastly",
      name: "⚡ Fastly (Sub-Second Real-Time Edge)",
      description: "Edge cloud network with instant cache purging API and real-time observability.",
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
      {/* 1. CDN Provider Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Choose CDN Provider
        </label>
        <div className="relative max-w-xl">
          <select
            value={provider}
            onChange={(e) => update("cdnProvider", e.target.value as any)}
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-800 shadow-sm transition hover:border-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          {currentProviderInfo.description}
        </p>
      </div>

      {/* 2. Provider-Specific Requirements & Inputs */}
      {provider === "cloudflare" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <span>☁️</span> Cloudflare Requirements & API Credentials
            </h4>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-800 hover:underline inline-flex items-center gap-1"
            >
              Cloudflare Dashboard <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Zone ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={s.cloudflareZoneId || ""}
                onChange={(e) => update("cloudflareZoneId", e.target.value)}
                placeholder="e.g. 023e105f4ecef8ad9ca31a8372d0c353"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Found in Cloudflare under your domain Overview (right sidebar).
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                API Bearer Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={s.cloudflareApiToken || ""}
                onChange={(e) => update("cloudflareApiToken", e.target.value)}
                placeholder="Cloudflare API Token"
                autoComplete="off"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Requires <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">Zone.Cache Purge</code> permission.
              </p>
            </div>
          </div>
        </div>
      )}

      {provider === "bunny" && (
        <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <span>🐰</span> BunnyCDN Requirements & API Credentials
            </h4>
            <a
              href="https://dash.bunny.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-800 hover:underline inline-flex items-center gap-1"
            >
              Bunny Dashboard <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Pull Zone ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={s.bunnyPullZoneId || ""}
                onChange={(e) => update("bunnyPullZoneId", e.target.value)}
                placeholder="e.g. 123456"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Found in BunnyCDN under Pull Zones &rarr; Details.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                API Access Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={s.bunnyAccessKey || ""}
                onChange={(e) => update("bunnyAccessKey", e.target.value)}
                placeholder="BunnyCDN API Key"
                autoComplete="off"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Found under Account Settings &rarr; API &rarr; Access Key.
              </p>
            </div>
          </div>
        </div>
      )}

      {provider === "cloudfront" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
              <span>🌐</span> AWS CloudFront Requirements
            </h4>
            <a
              href="https://console.aws.amazon.com/cloudfront"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              AWS Console <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              CloudFront Distribution ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={s.cloudfrontDistributionId || ""}
              onChange={(e) => update("cloudfrontDistributionId", e.target.value)}
              placeholder="e.g. E1234567890ABC"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              AWS CloudFront honors our server&apos;s 1-year immutable caching on assets and 60s micro-cache on news articles automatically.
            </p>
          </div>
        </div>
      )}

      {provider === "fastly" && (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-red-900 flex items-center gap-1.5">
              <span>⚡</span> Fastly Requirements & API Credentials
            </h4>
            <a
              href="https://manage.fastly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-red-800 hover:underline inline-flex items-center gap-1"
            >
              Fastly Console <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Service ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={s.fastlyServiceId || ""}
                onChange={(e) => update("fastlyServiceId", e.target.value)}
                placeholder="Fastly Service ID"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                API Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={s.fastlyApiKey || ""}
                onChange={(e) => update("fastlyApiKey", e.target.value)}
                placeholder="Fastly API Token"
                autoComplete="off"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {provider === "custom" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
          <h4 className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
            <span>🔗</span> Custom CDN Purge Webhook Requirements
          </h4>
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Purge Webhook Endpoint (POST) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={s.cdnPurgeWebhookUrl || ""}
              onChange={(e) => update("cdnPurgeWebhookUrl", e.target.value)}
              placeholder="https://api.yourcdn.com/purge-hook"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              When purging, an HTTP POST request with JSON event metadata is dispatched to this endpoint.
            </p>
          </div>
        </div>
      )}

      {provider === "none" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-800">Direct Origin Mode Active</p>
            <p className="text-[11px] text-slate-500">
              No external credentials required. Your website runs directly from your Hostinger Node.js server with built-in RAM micro-caching.
            </p>
          </div>
        </div>
      )}

      {/* 3. Universal CDN Media Delivery URL */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-slate-600" /> Universal CDN Media Delivery URL
          </label>
          <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            Works with ANY CDN
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          If you have a CDN pull zone or custom subdomain (e.g.{" "}
          <code className="bg-white px-1 py-0.5 rounded text-slate-800">https://cdn.todaytripura.com</code> or{" "}
          <code className="bg-white px-1 py-0.5 rounded text-slate-800">https://todaytripura.b-cdn.net</code>), enter it here.
          All article images and media files in <code className="bg-white px-1 py-0.5 rounded text-slate-800">/uploads/</code> will be delivered via this high-speed CDN endpoint.
        </p>

        <div className="space-y-2">
          <input
            type="url"
            value={s.cdnMediaBaseUrl || ""}
            onChange={(e) => update("cdnMediaBaseUrl", e.target.value)}
            placeholder="https://cdn.todaytripura.com"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-none"
          />

          <Toggle
            label="Enable CDN Media Delivery"
            checked={!!s.cdnEnabled}
            onChange={(v) => update("cdnEnabled", v)}
            hint="When enabled, frontend images in /uploads/ automatically resolve to the CDN media base URL."
          />

          {s.cdnEnabled && s.cdnMediaBaseUrl && (
            <div className="rounded bg-white p-2.5 border border-slate-200 text-[11px] space-y-1">
              <span className="font-semibold text-slate-700">Live CDN Media Routing Preview:</span>
              <div className="font-mono text-slate-600 break-all bg-slate-50 p-1.5 rounded">
                <span className="text-slate-400 line-through">/uploads/media/tripura-news.webp</span>
                <br />
                <span className="text-emerald-700 font-semibold">↳ {sampleUrl}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Instant Purge Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
        <div>
          <h5 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Instant Edge & Server Purge
          </h5>
          <p className="text-[11px] text-slate-500">
            Flushes server RAM micro-cache, internal query caches, and triggers edge invalidation for {currentProviderInfo.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePurge}
          disabled={purging}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${purging ? "animate-spin" : ""}`} />
          {purging ? "Purging Edge Cache..." : "Purge Edge CDN Cache Now"}
        </button>
      </div>

      {/* 5. Architectural Explainer Note */}
      <div className="rounded-md bg-slate-100 p-3 text-xs text-slate-700 space-y-1">
        <p className="font-semibold text-slate-800">💡 How Any CDN Accelerates Today Tripura:</p>
        <p className="text-[11px] text-slate-600">
          Our Node.js engine is pre-configured with RFC-compliant headers:{" "}
          <code className="bg-white px-1 py-0.5 rounded text-slate-800">public, max-age=31536000, immutable</code> for CSS/JS bundles and{" "}
          <code className="bg-white px-1 py-0.5 rounded text-slate-800">s-maxage=60, stale-while-revalidate=120</code> for news articles.
          Any reverse-proxy CDN (Cloudflare, Fastly, CloudFront, BunnyCDN) will automatically cache and serve your website globally without additional code changes!
        </p>
      </div>
    </Card>
  );
}
