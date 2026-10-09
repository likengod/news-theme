import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-txgvnrPd.js";
import { n as requireAuth } from "./auth-middleware-Cqd3GFjU.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/homepage-config.ts?tss-serverfn-split
var defaultHomepageConfig = {
	heroTopStories: {
		title: "Top Stories",
		fontSize: 12,
		color: "#1A1110"
	},
	heroCultureMusic: {
		title: "Culture & Music",
		fontSize: 12,
		color: "#1A1110"
	},
	heroOpinion: {
		title: "Opinion",
		fontSize: 12,
		color: "#1A1110"
	},
	heroPopular: {
		title: "Popular",
		fontSize: 12,
		color: "#1A1110"
	},
	heroFeatured: {
		title: "Featured",
		fontSize: 12,
		color: "#1A1110",
		category: "Auto (Latest)",
		autoSlide: true,
		slideInterval: 5,
		showMultiple: true,
		slideCount: 3
	},
	watch: {
		title: "Watch",
		fontSize: 16,
		color: "#1A1110"
	},
	marketsMagazine: {
		title: "Markets Magazine",
		fontSize: 16,
		color: "#1A1110"
	},
	showTicker: false,
	showBreakingBar: true,
	liveVideo: {
		enabled: true,
		autoplay: true,
		provider: "youtube",
		youtubeChannelId: "UC2EhA8EnLxOCbgn3nW2-OjA",
		youtubeVideoId: "99tqX34EEVI",
		facebookPageUrl: "https://www.facebook.com/facebook",
		title: "News Vanguard | ত্রিপুরা লাইভ ২৪*৭"
	},
	newsGridColumns: [
		{
			title: "World",
			fontSize: 12,
			color: "#1A1110",
			category: "Global"
		},
		{
			title: "Politics",
			fontSize: 12,
			color: "#1A1110",
			category: "Politics"
		},
		{
			title: "Opinion",
			fontSize: 12,
			color: "#1A1110",
			category: "Opinion"
		},
		{
			title: "Culture",
			fontSize: 12,
			color: "#1A1110",
			category: "Auto (Latest)"
		},
		{
			title: "Arts",
			fontSize: 12,
			color: "#1A1110",
			category: "Auto (Latest)"
		}
	]
};
var homepageConfigCache = null;
var CACHE_TTL_MS = 300 * 1e3;
var getHomepageConfigServer_createServerFn_handler = createServerRpc({
	id: "bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2",
	name: "getHomepageConfigServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => getHomepageConfigServer.__executeServer(opts));
var getHomepageConfigServer = createServerFn({ method: "GET" }).handler(getHomepageConfigServer_createServerFn_handler, async () => {
	if (homepageConfigCache && homepageConfigCache.expiry > Date.now()) return homepageConfigCache.data;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'homepage_config'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			const res = {
				...defaultHomepageConfig,
				...parsed,
				newsGridColumns: Array.isArray(parsed.newsGridColumns) && parsed.newsGridColumns.length === 5 ? parsed.newsGridColumns : defaultHomepageConfig.newsGridColumns
			};
			homepageConfigCache = {
				data: res,
				expiry: Date.now() + CACHE_TTL_MS
			};
			return res;
		}
	} catch {}
	homepageConfigCache = {
		data: defaultHomepageConfig,
		expiry: Date.now() + CACHE_TTL_MS
	};
	return defaultHomepageConfig;
});
async function resolveYouTubeInternal(rawInput) {
	const raw = (rawInput || "").trim();
	if (!raw) return {
		ok: false,
		error: "Please enter a YouTube Channel ID, Handle (@name), or Video Link."
	};
	const videoMatch = raw.match(/(?:watch\?v=|youtu\.be\/|youtube\.com\/(?:live|embed|shorts|v)\/|^)([a-zA-Z0-9_-]{11})(?:[?&/].*)?$/);
	if (videoMatch && !raw.startsWith("UC") && !raw.includes("channel/") && !raw.includes("@")) {
		const videoId = videoMatch[1];
		return {
			ok: true,
			type: "video",
			videoId,
			channelId: "",
			embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`,
			thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
			title: ""
		};
	}
	const channelMatch = raw.match(/(?:channel\/|^)(UC[a-zA-Z0-9_-]{22})(?:[/?].*)?$/);
	if (channelMatch) {
		const channelId = channelMatch[1];
		return {
			ok: true,
			type: "channel",
			channelId,
			videoId: "",
			embedUrl: `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&rel=0`,
			thumbnailUrl: "",
			title: ""
		};
	}
	const handleMatch = raw.match(/@([a-zA-Z0-9_.-]+)/);
	if (handleMatch) {
		const handle = `@${handleMatch[1]}`;
		try {
			const html = await (await fetch(`https://www.youtube.com/${handle}/live`, {
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
					"Accept-Language": "en-US,en;q=0.9"
				},
				redirect: "follow"
			})).text();
			const mChannel = html.match(/"channelId":"([a-zA-Z0-9_-]+)"/) || html.match(/channel_id=([a-zA-Z0-9_-]+)/);
			const mVideo = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})"/) || html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
			const mTitle = html.match(/<title>([^<]+)<\/title>/);
			const channelId = mChannel?.[1] || "";
			const videoId = mVideo?.[1] || "";
			const title = mTitle?.[1]?.replace(" - YouTube", "").trim() || "";
			return {
				ok: true,
				type: videoId ? "live_video" : channelId ? "channel" : "unknown",
				handle,
				channelId,
				videoId,
				title,
				thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "",
				embedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0` : channelId ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&rel=0` : ""
			};
		} catch (e) {
			return {
				ok: false,
				error: e?.message || "Failed to contact YouTube to detect channel"
			};
		}
	}
	return {
		ok: false,
		error: "Unrecognized format. Please paste a channel handle (@name), full channel link, or video link."
	};
}
var saveHomepageConfigServer_createServerFn_handler = createServerRpc({
	id: "8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893",
	name: "saveHomepageConfigServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => saveHomepageConfigServer.__executeServer(opts));
var saveHomepageConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(saveHomepageConfigServer_createServerFn_handler, async ({ data }) => {
	if (data?.liveVideo?.provider === "youtube" && data.liveVideo.youtubeChannelId) {
		const raw = data.liveVideo.youtubeChannelId.trim();
		if (raw.includes("@") || raw.includes("youtube.com/") || raw.includes("youtu.be/")) try {
			const res = await resolveYouTubeInternal(raw);
			if (res.ok) {
				if (res.channelId) data.liveVideo.youtubeChannelId = res.channelId;
				if (res.videoId && !data.liveVideo.youtubeVideoId) data.liveVideo.youtubeVideoId = res.videoId;
				if (res.title && !data.liveVideo.title) data.liveVideo.title = res.title;
			}
		} catch {}
	}
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('homepage_config', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	homepageConfigCache = null;
	return { success: true };
});
var resolveYouTubeServer_createServerFn_handler = createServerRpc({
	id: "75c16329e4ea959e4c4bf240a428d8dffbff669bab981b5ad419e945345cddfb",
	name: "resolveYouTubeServer",
	filename: "src/lib/homepage-config.ts"
}, (opts) => resolveYouTubeServer.__executeServer(opts));
var resolveYouTubeServer = createServerFn({ method: "POST" }).validator((input) => input).handler(resolveYouTubeServer_createServerFn_handler, async ({ data }) => {
	return await resolveYouTubeInternal(data.urlOrId);
});
//#endregion
export { getHomepageConfigServer_createServerFn_handler, resolveYouTubeServer_createServerFn_handler, saveHomepageConfigServer_createServerFn_handler };

//# sourceMappingURL=homepage-config-B7y04_Rb.js.map