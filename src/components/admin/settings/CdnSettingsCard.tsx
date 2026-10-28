import React, { useState } from "react";
import {
  Globe,
  Zap,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Edit2,
  Eye,
  EyeOff,
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
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Local state for editing provider
  const [localProvider, setLocalProvider] = useState<string>(s.cdnProvider || "none");
  const [localCfZone, setLocalCfZone] = useState<string>(s.cloudflareZoneId || "");
  const [localCfToken, setLocalCfToken] = useState<string>(s.cloudflareApiToken || "");
  const [localBunnyZone, setLocalBunnyZone] = useState<string>(s.bunnyPullZoneId || "");
  const [localBunnyKey, setLocalBunnyKey] = useState<string>(s.bunnyAccessKey || "");
  const [localCfDist, setLocalCfDist] = useState<string>(s.cloudfrontDistributionId || "");
  const [localFastlyService, setLocalFastlyService] = useState<string>(s.fastlyServiceId || "");
  const [localFastlyKey, setLocalFastlyKey] = useState<string>(s.fastlyApiKey || "");
  const [localWebhook, setLocalWebhook] = useState<string>(s.cdnPurgeWebhookUrl || "");

  // Local state for editing media URL
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

  // Check if media delivery is configured
  const isMediaConfigured = Boolean(s.cdnEnabled && s.cdnMediaBaseUrl?.trim());

  const handleSaveProvider = async () => {
    update("cdnProvider", localProvider as any);
    update("cloudflareZoneId", localCfZone);
    update("cloudflareApiToken", localCfToken);
    update("bunnyPullZoneId", localBunnyZone);
    update("bunnyAccessKey", localBunnyKey);
    update("cloudfrontDistributionId", localCfDist);
    update("fastlyServiceId", localFastlyService);
    update("fastlyApiKey", localFastlyKey);
    update("cdnPurgeWebhookUrl", localWebhook);

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
    };

    try {
      await saveSettings(newSettings);
      toast.success("CDN Provider settings saved successfully");
      setIsEditingProvider(false);
    } catch {
      toast.error("Failed to save CDN settings");
    }
  };

  const handleCancelProvider = () => {
    setLocalProvider(s.cdnProvider || "none");
    setLocalCfZone(s.cloudflareZoneId || "");
    setLocalCfToken(s.cloudflareApiToken || "");
    setLocalBunnyZone(s.bunnyPullZoneId || "");
    setLocalBunnyKey(s.bunnyAccessKey || "");
    setLocalCfDist(s.cloudfrontDistributionId || "");
    setLocalFastlyService(s.fastlyServiceId || "");
    setLocalFastlyKey(s.fastlyApiKey || "");
    setLocalWebhook(s.cdnPurgeWebhookUrl || "");
    setIsEditingProvider(false);
  };

  const handleSaveMedia = async () => {
    update("cdnMediaBaseUrl", localMediaBase);
    update("cdnEnabled", localCdnEnabled);

    const newSettings: SiteSettings = {
      ...s,
      cdnMediaBaseUrl: localMediaBase,
      cdnEnabled: localCdnEnabled,
    };

    try {
      await saveSettings(newSettings);
      toast.success("CDN Media Delivery settings saved successfully");
      setIsEditingMedia(false);
    } catch {
      toast.error("Failed to save CDN Media settings");
    }
  };

  const handleCancelMedia = () => {
    setLocalMediaBase(s.cdnMediaBaseUrl || "");
    setLocalCdnEnabled(!!s.cdnEnabled);
    setIsEditingMedia(false);
  };

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
    { id: "none", name: "None (Disabled)", guideUrl: "" },
    { id: "cloudflare", name: "Cloudflare (Reverse Proxy & Edge Purge)", guideUrl: "https://dash.cloudflare.com" },
    { id: "bunny", name: "BunnyCDN (Pull Zone & Media CDN)", guideUrl: "https://dash.bunny.net" },
    { id: "cloudfront", name: "AWS CloudFront (Amazon Global CDN)", guideUrl: "https://console.aws.amazon.com/cloudfront" },
    { id: "fastly", name: "Fastly (Real-time Edge Purge)", guideUrl: "https://manage.fastly.com" },
    { id: "custom", name: "Custom / Webhook (Any CDN)", guideUrl: "" },
  ];

  const currentProviderObj = providers.find((p) => p.id === (isEditingProvider ? localProvider : provider)) || providers[0];

  const sampleUrl = s.cdnMediaBaseUrl
    ? `${s.cdnMediaBaseUrl.replace(/\/+$/, "")}/uploads/media/tripura-news.webp`
    : "/uploads/media/tripura-news.webp";

  return (
    <Card
      title="CDN & Edge Cache Acceleration"
      subtitle="Connect Cloudflare, BunnyCDN, AWS CloudFront, Fastly, or any custom CDN to accelerate media delivery, cut server bandwidth, and purge edge caches with 1 click."
    >
      <div className="space-y-3">
        {/* ROW 1: Edge CDN Provider (Exact IntegrationField format) */}
        <div className="rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[13px] font-medium text-slate-800">
                Edge CDN Provider {provider !== "none" ? `(${currentProviderObj.name.split(" ")[0]})` : ""}
              </p>
              <div className="flex items-center gap-2">
                {isProviderConfigured ? (
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
              {!isEditingProvider && (
                <button
                  type="button"
                  onClick={() => setIsEditingProvider(true)}
                  className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  <Edit2 className="h-3 w-3" />
                  {isProviderConfigured ? "Update" : "Setup"}
                </button>
              )}
            </div>
          </div>

          {/* Expanded Inline Editor for Provider */}
          {isEditingProvider && (
            <div className="mt-2.5 border-t border-slate-100 pt-2.5 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Select Provider
                </label>
                <div className="relative">
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {localProvider === "cloudflare" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      Cloudflare Zone ID
                    </label>
                    <input
                      type="text"
                      value={localCfZone}
                      onChange={(e) => setLocalCfZone(e.target.value)}
                      placeholder="e.g. 023e105f4ecef8ad..."
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      API Bearer Token
                    </label>
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        value={localCfToken}
                        onChange={(e) => setLocalCfToken(e.target.value)}
                        placeholder="Cloudflare API Bearer Token"
                        className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {localProvider === "bunny" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      Pull Zone ID
                    </label>
                    <input
                      type="text"
                      value={localBunnyZone}
                      onChange={(e) => setLocalBunnyZone(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      API Access Key
                    </label>
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        value={localBunnyKey}
                        onChange={(e) => setLocalBunnyKey(e.target.value)}
                        placeholder="BunnyCDN API Key"
                        className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {localProvider === "cloudfront" && (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    CloudFront Distribution ID
                  </label>
                  <input
                    type="text"
                    value={localCfDist}
                    onChange={(e) => setLocalCfDist(e.target.value)}
                    placeholder="e.g. E1234567890ABC"
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                  />
                </div>
              )}

              {localProvider === "fastly" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      Service ID
                    </label>
                    <input
                      type="text"
                      value={localFastlyService}
                      onChange={(e) => setLocalFastlyService(e.target.value)}
                      placeholder="Fastly Service ID"
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      API Token
                    </label>
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        value={localFastlyKey}
                        onChange={(e) => setLocalFastlyKey(e.target.value)}
                        placeholder="Fastly API Token"
                        className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 font-mono text-xs focus:border-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {localProvider === "custom" && (
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Purge Webhook URL (POST)
                  </label>
                  <input
                    type="url"
                    value={localWebhook}
                    onChange={(e) => setLocalWebhook(e.target.value)}
                    placeholder="https://api.yourcdn.com/purge-hook"
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelProvider}
                  className="flex h-[30px] items-center justify-center rounded-md bg-slate-100 px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProvider}
                  className="flex h-[30px] items-center justify-center rounded-md bg-slate-900 px-3.5 text-[11px] font-medium text-white hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ROW 2: CDN Media Delivery URL (Exact IntegrationField format) */}
        <div className="rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[13px] font-medium text-slate-800">
                CDN Media Delivery URL
              </p>
              <div className="flex items-center gap-2">
                {isMediaConfigured ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <XCircle className="h-3 w-3" /> Not Configured
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isEditingMedia && (
                <button
                  type="button"
                  onClick={() => setIsEditingMedia(true)}
                  className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  <Edit2 className="h-3 w-3" />
                  {isMediaConfigured ? "Update" : "Setup"}
                </button>
              )}
            </div>
          </div>

          {/* Expanded Inline Editor for Media URL */}
          {isEditingMedia && (
            <div className="mt-2.5 border-t border-slate-100 pt-2.5 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  CDN Media Host URL
                </label>
                <input
                  type="url"
                  value={localMediaBase}
                  onChange={(e) => setLocalMediaBase(e.target.value)}
                  placeholder="https://cdn.todaytripura.com"
                  className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Prepend this URL to all article images and /uploads/ media.
                </p>
              </div>

              <Toggle
                label="Enable CDN Media Delivery"
                checked={localCdnEnabled}
                onChange={(v) => setLocalCdnEnabled(v)}
                hint="When enabled, frontend images resolve to the CDN media base URL."
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelMedia}
                  className="flex h-[30px] items-center justify-center rounded-md bg-slate-100 px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMedia}
                  className="flex h-[30px] items-center justify-center rounded-md bg-slate-900 px-3.5 text-[11px] font-medium text-white hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar: Purge Cache Button & Notice */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
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
