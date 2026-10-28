import React, { useState } from "react";
import {
  Zap,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Edit2,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { type SiteSettings, saveSettings } from "@/lib/site-content";
import { Card, Toggle } from "@/components/admin/settings/SettingsHelpers";
import { purgeEdgeCdnServer } from "@/lib/cdn.functions";

interface CdnSettingsCardProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function CdnSettingsCard({ s, update }: CdnSettingsCardProps) {
  const [purging, setPurging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Local state for all CDN settings
  const [localProvider, setLocalProvider] = useState<string>(s.cdnProvider || "none");
  const [localCfZone, setLocalCfZone] = useState<string>(s.cloudflareZoneId || "");
  const [localCfToken, setLocalCfToken] = useState<string>(s.cloudflareApiToken || "");
  const [localBunnyZone, setLocalBunnyZone] = useState<string>(s.bunnyPullZoneId || "");
  const [localBunnyKey, setLocalBunnyKey] = useState<string>(s.bunnyAccessKey || "");
  const [localCfDist, setLocalCfDist] = useState<string>(s.cloudfrontDistributionId || "");
  const [localFastlyService, setLocalFastlyService] = useState<string>(s.fastlyServiceId || "");
  const [localFastlyKey, setLocalFastlyKey] = useState<string>(s.fastlyApiKey || "");
  const [localWebhook, setLocalWebhook] = useState<string>(s.cdnPurgeWebhookUrl || "");

  const [localMediaBase, setLocalMediaBase] = useState<string>(s.cdnMediaBaseUrl || "");
  const [localCdnEnabled, setLocalCdnEnabled] = useState<boolean>(!!s.cdnEnabled);

  const provider = s.cdnProvider || "none";

  // Check if provider is configured
  let isProviderConfigured = false;
  if (provider === "cloudflare") {
    isProviderConfigured = Boolean(s.cloudflareZoneId?.trim() && s.cloudflareApiToken?.trim());
  } else if (provider === "bunny") {
    isProviderConfigured = Boolean(s.bunnyPullZoneId?.trim() && s.bunnyAccessKey?.trim());
  } else if (provider === "cloudfront") {
    isProviderConfigured = Boolean(s.cloudfrontDistributionId?.trim());
  } else if (provider === "fastly") {
    isProviderConfigured = Boolean(s.fastlyServiceId?.trim() && s.fastlyApiKey?.trim());
  } else if (provider === "custom") {
    isProviderConfigured = Boolean(s.cdnPurgeWebhookUrl?.trim());
  }

  const isMediaConfigured = Boolean(s.cdnEnabled && s.cdnMediaBaseUrl?.trim());
  const isOverallConfigured = isProviderConfigured || isMediaConfigured;

  const handleSave = async () => {
    update("cdnProvider", localProvider as any);
    update("cloudflareZoneId", localCfZone);
    update("cloudflareApiToken", localCfToken);
    update("bunnyPullZoneId", localBunnyZone);
    update("bunnyAccessKey", localBunnyKey);
    update("cloudfrontDistributionId", localCfDist);
    update("fastlyServiceId", localFastlyService);
    update("fastlyApiKey", localFastlyKey);
    update("cdnPurgeWebhookUrl", localWebhook);
    update("cdnMediaBaseUrl", localMediaBase);
    update("cdnEnabled", localCdnEnabled);

    const newSettings: SiteSettings = {
      ...s,
      cdnProvider: localProvider as any,
      cloudflareZoneId: localCfZone,
      cloudflareApiToken: localCfToken,
      bunnyPullZoneId: localBunnyZone,
      bunnyAccessKey: localBunnyKey,
      cloudfrontDistributionId: localCfDist,
      fastlyServiceId: localFastlyService,
      fastlyApiKey: localFastlyKey,
      cdnPurgeWebhookUrl: localWebhook,
      cdnMediaBaseUrl: localMediaBase,
      cdnEnabled: localCdnEnabled,
    };

    try {
      await saveSettings(newSettings);
      toast.success("CDN & Edge settings saved successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save CDN settings");
    }
  };

  const handleCancel = () => {
    setLocalProvider(s.cdnProvider || "none");
    setLocalCfZone(s.cloudflareZoneId || "");
    setLocalCfToken(s.cloudflareApiToken || "");
    setLocalBunnyZone(s.bunnyPullZoneId || "");
    setLocalBunnyKey(s.bunnyAccessKey || "");
    setLocalCfDist(s.cloudfrontDistributionId || "");
    setLocalFastlyService(s.fastlyServiceId || "");
    setLocalFastlyKey(s.fastlyApiKey || "");
    setLocalWebhook(s.cdnPurgeWebhookUrl || "");
    setLocalMediaBase(s.cdnMediaBaseUrl || "");
    setLocalCdnEnabled(!!s.cdnEnabled);
    setIsEditing(false);
  };

  const handlePurge = async () => {
    setPurging(true);
    try {
      const res = await purgeEdgeCdnServer();
      if (res.success) {
        toast.success(res.message || "Edge CDN cache successfully purged!");
      } else {
        toast.error(res.message || "Cache purge failed. Check your CDN credentials.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to trigger edge cache purge.");
    } finally {
      setPurging(false);
    }
  };

  const providers = [
    { id: "none", name: "None (Disabled - Origin Direct)", guideUrl: "" },
    { id: "cloudflare", name: "Cloudflare (Reverse Proxy & Edge Purge)", guideUrl: "https://dash.cloudflare.com" },
    { id: "bunny", name: "BunnyCDN (Pull Zone & Media CDN)", guideUrl: "https://dash.bunny.net" },
    { id: "cloudfront", name: "AWS CloudFront (Amazon Global CDN)", guideUrl: "https://console.aws.amazon.com/cloudfront" },
    { id: "fastly", name: "Fastly (Real-time Edge Purge)", guideUrl: "https://manage.fastly.com" },
    { id: "custom", name: "Custom / Webhook (Any CDN)", guideUrl: "" },
  ];

  const currentProviderObj = providers.find((p) => p.id === (isEditing ? localProvider : provider)) || providers[0];

  const sampleUrl = (isEditing ? localMediaBase : s.cdnMediaBaseUrl)
    ? `${(isEditing ? localMediaBase : s.cdnMediaBaseUrl || "").replace(/\/+$/, "")}/uploads/media/tripura-news.webp`
    : "/uploads/media/tripura-news.webp";

  return (
    <Card
      title="CDN & Edge Cache Acceleration"
      subtitle="Connect Cloudflare, BunnyCDN, AWS CloudFront, Fastly, or any custom CDN to accelerate media delivery, cut server bandwidth, and purge edge caches with 1 click."
    >
      <div className="space-y-3">
        {/* Single unified CDN Integration Row */}
        <div className="rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-600" />
                Edge CDN & Media Acceleration {provider !== "none" ? `(${currentProviderObj.name.split(" ")[0]})` : ""}
              </p>
              <div className="flex items-center gap-2">
                {isOverallConfigured ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <XCircle className="h-3 w-3" /> Not Configured
                  </span>
                )}

                {currentProviderObj.guideUrl && (
                  <>
                    <span className="text-slate-300">•</span>
                    <a
                      href={currentProviderObj.guideUrl}
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

            <div className="flex items-center gap-2 shrink-0">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  {isOverallConfigured ? "Update" : "Setup"}
                </button>
              )}
            </div>
          </div>

          {/* Collapsed summary when not editing */}
          {!isEditing && (
            <div className="mt-1.5 text-[11px] text-slate-500">
              {isOverallConfigured ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    Provider: <strong className="text-slate-700">{currentProviderObj.name.split(" ")[0]}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Media Delivery:{" "}
                    {s.cdnEnabled && s.cdnMediaBaseUrl ? (
                      <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">{s.cdnMediaBaseUrl}</code>
                    ) : (
                      <span className="text-slate-500">Origin direct</span>
                    )}
                  </span>
                  <span>•</span>
                  <span>
                    Edge Purge:{" "}
                    <strong className={isProviderConfigured ? "text-emerald-600" : "text-slate-500"}>
                      {isProviderConfigured ? "Ready" : "Credentials needed"}
                    </strong>
                  </span>
                </div>
              ) : (
                <p>No CDN connected. Media and pages are served directly from the origin server. Click Setup to configure Cloudflare, BunnyCDN, or AWS.</p>
              )}
            </div>
          )}

          {/* Expanded unified editor */}
          {isEditing && (
            <div className="mt-3 space-y-4 rounded-md bg-slate-50/80 p-3 border border-slate-200/80">
              {/* Provider Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Select CDN Provider <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1">
                  <select
                    value={localProvider}
                    onChange={(e) => setLocalProvider(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select your content delivery network to enable automated edge purge and fast global caching.
                </p>
              </div>

              {/* Dynamic Provider Requirements */}
              {localProvider === "cloudflare" && (
                <div className="space-y-3 rounded-md border border-blue-100 bg-blue-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900">Cloudflare API Credentials</span>
                    <a
                      href="https://dash.cloudflare.com/profile/api-tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
                    >
                      Get API Token <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Zone ID</label>
                    <input
                      type="text"
                      value={localCfZone}
                      onChange={(e) => setLocalCfZone(e.target.value)}
                      placeholder="e.g. 023e105f4ecef8ad9ca31a8372d0c353"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                    <p className="mt-0.5 text-[10px] text-slate-500">Found on your Cloudflare domain overview page on the bottom right.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">API Token (Zone:Cache Purge)</label>
                    <div className="relative mt-1">
                      <input
                        type={showToken ? "text" : "password"}
                        value={localCfToken}
                        onChange={(e) => setLocalCfToken(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••••••••••"
                        className="w-full rounded border border-slate-200 bg-white px-2.5 py-1 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-500">API Token with permissions: Zone - Cache Purge - Purge.</p>
                  </div>
                </div>
              )}

              {localProvider === "bunny" && (
                <div className="space-y-3 rounded-md border border-amber-100 bg-amber-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-900">BunnyCDN Pull Zone Credentials</span>
                    <a
                      href="https://dash.bunny.net/cdn"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:underline"
                    >
                      Bunny Dashboard <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Pull Zone ID</label>
                    <input
                      type="text"
                      value={localBunnyZone}
                      onChange={(e) => setLocalBunnyZone(e.target.value)}
                      placeholder="e.g. 123456"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Account API Access Key</label>
                    <div className="relative mt-1">
                      <input
                        type={showToken ? "text" : "password"}
                        value={localBunnyKey}
                        onChange={(e) => setLocalBunnyKey(e.target.value)}
                        placeholder="••••••••••••••••••••••••••••••••••••••••"
                        className="w-full rounded border border-slate-200 bg-white px-2.5 py-1 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {localProvider === "cloudfront" && (
                <div className="space-y-3 rounded-md border border-emerald-100 bg-emerald-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-900">AWS CloudFront Distribution</span>
                    <a
                      href="https://console.aws.amazon.com/cloudfront"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline"
                    >
                      AWS Console <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Distribution ID</label>
                    <input
                      type="text"
                      value={localCfDist}
                      onChange={(e) => setLocalCfDist(e.target.value)}
                      placeholder="e.g. E1A2B3C4D5E6F7"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {localProvider === "fastly" && (
                <div className="space-y-3 rounded-md border border-red-100 bg-red-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-900">Fastly Service Credentials</span>
                    <a
                      href="https://manage.fastly.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-medium text-red-700 hover:underline"
                    >
                      Fastly Portal <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Service ID</label>
                    <input
                      type="text"
                      value={localFastlyService}
                      onChange={(e) => setLocalFastlyService(e.target.value)}
                      placeholder="e.g. SU1z6GM9SGxkqUQwoQ3Wx1"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">API Key</label>
                    <input
                      type={showToken ? "text" : "password"}
                      value={localFastlyKey}
                      onChange={(e) => setLocalFastlyKey(e.target.value)}
                      placeholder="••••••••••••••••••••••••••••••••••••••••"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {localProvider === "custom" && (
                <div className="space-y-3 rounded-md border border-purple-100 bg-purple-50/50 p-2.5">
                  <span className="text-xs font-semibold text-purple-900">Custom Webhook Integration</span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700">Purge Webhook URL (POST)</label>
                    <input
                      type="url"
                      value={localWebhook}
                      onChange={(e) => setLocalWebhook(e.target.value)}
                      placeholder="https://api.my-custom-cdn.com/purge-all"
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      When cache purge is triggered, the server will send an authenticated HTTP POST request to this webhook.
                    </p>
                  </div>
                </div>
              )}

              {/* Media URL rewrite section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    CDN Media Delivery Host URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={localMediaBase}
                    onChange={(e) => setLocalMediaBase(e.target.value)}
                    placeholder="https://cdn.todaytripura.com"
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Prepend this URL to all article images and media files to offload server traffic.
                  </p>
                </div>

                <Toggle
                  label="Enable CDN Media URL Rewriting"
                  checked={localCdnEnabled}
                  onChange={(v) => setLocalCdnEnabled(v)}
                  hint="When enabled, frontend images resolve to the CDN media host URL."
                />

                {localMediaBase && (
                  <div className="rounded border border-slate-200 bg-white p-2 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Live Preview:</span>{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800">{sampleUrl}</code>
                  </div>
                )}
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Save CDN Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar: Purge Cache Button & Notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Instant Edge & Server Purge
            </p>
            <p className="text-[11px] text-slate-500">
              Flushes server RAM and invalidates edge CDN cache for {currentProviderObj.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePurge}
            disabled={purging}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-3 w-3 ${purging ? "animate-spin" : ""}`} />
            {purging ? "Purging..." : "Purge Edge CDN Cache"}
          </button>
        </div>

        <div className="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
          <strong>Edge Cache Note:</strong> Static assets are cached for 1 year immutable, and news articles for 60s micro-cache.
        </div>
      </div>
    </Card>
  );
}
