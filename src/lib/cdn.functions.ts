import { createServerFn } from "@tanstack/react-start";
import { attachAuth } from "./auth-attacher";
import { requireAdmin } from "./auth-middleware";
import { query } from "./db.server";
import { clearAllCachesServer } from "./site-content/server-cache";
import { defaultSettings, type SiteSettings } from "./site-content/site-settings";

export interface CdnPurgeResult {
  success: boolean;
  provider: string;
  message: string;
  purgedLocal: boolean;
  edgePurged?: boolean;
  details?: any;
}

export const purgeEdgeCdnServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((opts?: { urls?: string[] }) => opts)
  .handler(async ({ data }): Promise<CdnPurgeResult> => {
    // 1. Purge local server and in-memory caches first
    let localPurged = false;
    try {
      await clearAllCachesServer();
      localPurged = true;
    } catch (e: any) {
      console.warn("[CDN Purge] Local cache clear warning:", e.message);
    }

    // 2. Load active site settings from MySQL
    let settings: SiteSettings = defaultSettings;
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        settings = { ...defaultSettings, ...JSON.parse(rows[0].value) };
      }
    } catch (err: any) {
      console.error("[CDN Purge] Failed to load site settings:", err);
    }

    const provider = settings.cdnProvider || "none";

    // 3. Provider-specific Edge Purge
    try {
      if (provider === "cloudflare") {
        const zoneId = settings.cloudflareZoneId?.trim();
        const apiToken = settings.cloudflareApiToken?.trim();

        if (!zoneId || !apiToken) {
          return {
            success: true,
            provider: "Cloudflare",
            purgedLocal: localPurged,
            edgePurged: false,
            message:
              "Local server caches cleared. Cloudflare Zone ID or API Token is empty, so edge cache was not purged.",
          };
        }

        const cfRes = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              data?.urls && data.urls.length > 0
                ? { files: data.urls }
                : { purge_everything: true },
            ),
          },
        );

        const cfData = await cfRes.json();
        if (cfData.success) {
          return {
            success: true,
            provider: "Cloudflare",
            purgedLocal: true,
            edgePurged: true,
            message: "Successfully purged Cloudflare Edge CDN cache for the entire zone!",
            details: cfData,
          };
        } else {
          const errMsg =
            cfData.errors?.[0]?.message || cfData.messages?.[0] || "Unknown Cloudflare error";
          return {
            success: false,
            provider: "Cloudflare",
            purgedLocal: true,
            edgePurged: false,
            message: `Cloudflare API error: ${errMsg}`,
            details: cfData,
          };
        }
      }

      if (provider === "bunny") {
        const pullZoneId = settings.bunnyPullZoneId?.trim();
        const accessKey = settings.bunnyAccessKey?.trim();

        if (!pullZoneId || !accessKey) {
          return {
            success: true,
            provider: "BunnyCDN",
            purgedLocal: localPurged,
            edgePurged: false,
            message:
              "Local server caches cleared. BunnyCDN Pull Zone ID or Access Key is empty, so edge cache was not purged.",
          };
        }

        const bunnyRes = await fetch(`https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`, {
          method: "POST",
          headers: {
            AccessKey: accessKey,
            "Content-Type": "application/json",
          },
        });

        if (bunnyRes.ok) {
          return {
            success: true,
            provider: "BunnyCDN",
            purgedLocal: true,
            edgePurged: true,
            message: `Successfully purged BunnyCDN Pull Zone (${pullZoneId}) Edge Cache!`,
          };
        } else {
          return {
            success: false,
            provider: "BunnyCDN",
            purgedLocal: true,
            edgePurged: false,
            message: `BunnyCDN API returned HTTP ${bunnyRes.status}: ${bunnyRes.statusText}`,
          };
        }
      }

      if (provider === "fastly") {
        const serviceId = settings.fastlyServiceId?.trim();
        const apiKey = settings.fastlyApiKey?.trim();

        if (!serviceId || !apiKey) {
          return {
            success: true,
            provider: "Fastly",
            purgedLocal: localPurged,
            edgePurged: false,
            message:
              "Local server caches cleared. Fastly Service ID or API Key is empty, so edge cache was not purged.",
          };
        }

        const fastlyRes = await fetch(
          `https://api.fastly.com/service/${serviceId}/purge_all`,
          {
            method: "POST",
            headers: {
              "Fastly-Key": apiKey,
              Accept: "application/json",
            },
          },
        );

        if (fastlyRes.ok) {
          return {
            success: true,
            provider: "Fastly",
            purgedLocal: true,
            edgePurged: true,
            message: "Successfully purged Fastly Edge CDN cache!",
          };
        } else {
          return {
            success: false,
            provider: "Fastly",
            purgedLocal: true,
            edgePurged: false,
            message: `Fastly API returned HTTP ${fastlyRes.status}`,
          };
        }
      }

      if (provider === "custom") {
        const webhookUrl = settings.cdnPurgeWebhookUrl?.trim();

        if (!webhookUrl) {
          return {
            success: true,
            provider: "Custom Webhook",
            purgedLocal: localPurged,
            edgePurged: false,
            message:
              "Local server caches cleared. Custom CDN Purge Webhook URL is empty, so webhook was not invoked.",
          };
        }

        const hookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "purge_cache",
            site: settings.siteName,
            urls: data?.urls || ["*"],
            timestamp: Date.now(),
          }),
        });

        return {
          success: hookRes.ok,
          provider: "Custom Webhook",
          purgedLocal: true,
          edgePurged: hookRes.ok,
          message: hookRes.ok
            ? "Successfully dispatched CDN Purge Webhook request!"
            : `Webhook returned HTTP ${hookRes.status}`,
        };
      }

      // Default or "none" / "cloudfront"
      return {
        success: true,
        provider: provider === "cloudfront" ? "AWS CloudFront" : "Local Origin",
        purgedLocal: true,
        edgePurged: false,
        message:
          provider === "cloudfront"
            ? "Local server caches cleared. For CloudFront, edge TTL relies on standard Cache-Control headers (or trigger via AWS CLI)."
            : "Local server memory and SSR micro-caches successfully purged! (No external CDN provider selected).",
      };
    } catch (err: any) {
      return {
        success: false,
        provider,
        purgedLocal: localPurged,
        edgePurged: false,
        message: `Edge CDN Purge failed: ${err.message}`,
      };
    }
  });
