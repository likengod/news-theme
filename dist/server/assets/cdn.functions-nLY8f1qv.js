import { r as createServerFn } from "./server-tRd-_-rL.js";
import { c as query } from "./db.server-C6BR1yx2.js";
import { t as requireAdmin } from "./auth-middleware-CU8g4DTz.js";
import { t as attachAuth } from "./auth-attacher-CDNgXTi6.js";
import { n as defaultSettings } from "./site-settings-BIKHIMUk.js";
import { t as clearAllCachesServer } from "./server-cache-vnAOoZ9t.js";
import { t as createServerRpc } from "./createServerRpc-Buj7DiYE.js";
// src/lib/cdn.functions.ts?tss-serverfn-split
var purgeEdgeCdnServer_createServerFn_handler = createServerRpc({
	id: "509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870",
	name: "purgeEdgeCdnServer",
	filename: "src/lib/cdn.functions.ts"
}, (opts) => purgeEdgeCdnServer.__executeServer(opts));
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(purgeEdgeCdnServer_createServerFn_handler, async ({ data }) => {
	let localPurged = false;
	try {
		await clearAllCachesServer();
		localPurged = true;
	} catch (e) {
		console.warn("[CDN Purge] Local cache clear warning:", e.message);
	}
	let settings = defaultSettings;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
		if (rows.length > 0 && rows[0].value) settings = {
			...defaultSettings,
			...JSON.parse(rows[0].value)
		};
	} catch (err) {
		console.error("[CDN Purge] Failed to load site settings:", err);
	}
	const provider = settings.cdnProvider || "none";
	try {
		if (provider === "cloudflare") {
			const zoneId = settings.cloudflareZoneId?.trim();
			const apiToken = settings.cloudflareApiToken?.trim();
			if (!zoneId || !apiToken) return {
				success: true,
				provider: "Cloudflare",
				purgedLocal: localPurged,
				edgePurged: false,
				message: "Local server caches cleared. Cloudflare Zone ID or API Token is empty, so edge cache was not purged."
			};
			const cfData = await (await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiToken}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data?.urls && data.urls.length > 0 ? { files: data.urls } : { purge_everything: true })
			})).json();
			if (cfData.success) return {
				success: true,
				provider: "Cloudflare",
				purgedLocal: true,
				edgePurged: true,
				message: "Successfully purged Cloudflare Edge CDN cache for the entire zone!",
				details: cfData
			};
			else return {
				success: false,
				provider: "Cloudflare",
				purgedLocal: true,
				edgePurged: false,
				message: `Cloudflare API error: ${cfData.errors?.[0]?.message || cfData.messages?.[0] || "Unknown Cloudflare error"}`,
				details: cfData
			};
		}
		if (provider === "bunny") {
			const pullZoneId = settings.bunnyPullZoneId?.trim();
			const accessKey = settings.bunnyAccessKey?.trim();
			if (!pullZoneId || !accessKey) return {
				success: true,
				provider: "BunnyCDN",
				purgedLocal: localPurged,
				edgePurged: false,
				message: "Local server caches cleared. BunnyCDN Pull Zone ID or Access Key is empty, so edge cache was not purged."
			};
			const bunnyRes = await fetch(`https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`, {
				method: "POST",
				headers: {
					AccessKey: accessKey,
					"Content-Type": "application/json"
				}
			});
			if (bunnyRes.ok) return {
				success: true,
				provider: "BunnyCDN",
				purgedLocal: true,
				edgePurged: true,
				message: `Successfully purged BunnyCDN Pull Zone (${pullZoneId}) Edge Cache!`
			};
			else return {
				success: false,
				provider: "BunnyCDN",
				purgedLocal: true,
				edgePurged: false,
				message: `BunnyCDN API returned HTTP ${bunnyRes.status}: ${bunnyRes.statusText}`
			};
		}
		if (provider === "fastly") {
			const serviceId = settings.fastlyServiceId?.trim();
			const apiKey = settings.fastlyApiKey?.trim();
			if (!serviceId || !apiKey) return {
				success: true,
				provider: "Fastly",
				purgedLocal: localPurged,
				edgePurged: false,
				message: "Local server caches cleared. Fastly Service ID or API Key is empty, so edge cache was not purged."
			};
			const fastlyRes = await fetch(`https://api.fastly.com/service/${serviceId}/purge_all`, {
				method: "POST",
				headers: {
					"Fastly-Key": apiKey,
					Accept: "application/json"
				}
			});
			if (fastlyRes.ok) return {
				success: true,
				provider: "Fastly",
				purgedLocal: true,
				edgePurged: true,
				message: "Successfully purged Fastly Edge CDN cache!"
			};
			else return {
				success: false,
				provider: "Fastly",
				purgedLocal: true,
				edgePurged: false,
				message: `Fastly API returned HTTP ${fastlyRes.status}`
			};
		}
		if (provider === "custom") {
			const webhookUrl = settings.cdnPurgeWebhookUrl?.trim();
			if (!webhookUrl) return {
				success: true,
				provider: "Custom Webhook",
				purgedLocal: localPurged,
				edgePurged: false,
				message: "Local server caches cleared. Custom CDN Purge Webhook URL is empty, so webhook was not invoked."
			};
			const hookRes = await fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					event: "purge_cache",
					site: settings.siteName,
					urls: data?.urls || ["*"],
					timestamp: Date.now()
				})
			});
			return {
				success: hookRes.ok,
				provider: "Custom Webhook",
				purgedLocal: true,
				edgePurged: hookRes.ok,
				message: hookRes.ok ? "Successfully dispatched CDN Purge Webhook request!" : `Webhook returned HTTP ${hookRes.status}`
			};
		}
		return {
			success: true,
			provider: provider === "cloudfront" ? "AWS CloudFront" : "Local Origin",
			purgedLocal: true,
			edgePurged: false,
			message: provider === "cloudfront" ? "Local server caches cleared. For CloudFront, edge TTL relies on standard Cache-Control headers (or trigger via AWS CLI)." : "Local server memory and SSR micro-caches successfully purged! (No external CDN provider selected)."
		};
	} catch (err) {
		return {
			success: false,
			provider,
			purgedLocal: localPurged,
			edgePurged: false,
			message: `Edge CDN Purge failed: ${err.message}`
		};
	}
});
export { purgeEdgeCdnServer_createServerFn_handler };

//# sourceMappingURL=cdn.functions-nLY8f1qv.js.map