//#region src/lib/reels-config.ts
var defaultReelsConfig = {
	enabled: true,
	provider: "youtube",
	mode: "manual",
	title: "Reels & Shorts",
	urls: [],
	youtube: {
		apiKey: "",
		channelId: "",
		maxResults: 8
	},
	facebook: {
		accessToken: "",
		pageId: "",
		maxResults: 8
	}
};
var KEY = "nt:reels-config:v2";
var EVENT = "nt:reels-updated";
function loadReelsConfig() {
	if (typeof window === "undefined") return defaultReelsConfig;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultReelsConfig;
		const parsed = JSON.parse(raw);
		return {
			...defaultReelsConfig,
			...parsed,
			urls: Array.isArray(parsed.urls) ? parsed.urls.filter((u) => typeof u === "string") : [],
			youtube: {
				...defaultReelsConfig.youtube,
				...parsed.youtube ?? {}
			},
			facebook: {
				...defaultReelsConfig.facebook,
				...parsed.facebook ?? {}
			}
		};
	} catch {
		return defaultReelsConfig;
	}
}
function saveReelsConfig(cfg) {
	localStorage.setItem(KEY, JSON.stringify(cfg));
	window.dispatchEvent(new Event(EVENT));
}
function onReelsConfigChange(cb) {
	if (typeof window === "undefined") return () => {};
	const handler = () => cb();
	window.addEventListener(EVENT, handler);
	window.addEventListener("storage", handler);
	return () => {
		window.removeEventListener(EVENT, handler);
		window.removeEventListener("storage", handler);
	};
}
function extractYouTubeId(url) {
	try {
		const u = new URL(url.trim());
		if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
		if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
		if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
		if (u.pathname === "/watch") return u.searchParams.get("v");
		return null;
	} catch {
		return null;
	}
}
function toEmbedSrc(provider, url) {
	if (provider === "youtube") {
		const id = extractYouTubeId(url);
		return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1` : null;
	}
	const trimmed = url.trim();
	if (!/^https?:\/\/(www\.)?facebook\.com\//i.test(trimmed)) return null;
	return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&autoplay=1`;
}
/** YouTube Data API v3 — latest short-form videos from a channel. */
async function fetchYouTubeShorts(cfg) {
	if (!cfg.apiKey || !cfg.channelId) return [];
	const params = new URLSearchParams({
		key: cfg.apiKey,
		channelId: cfg.channelId,
		part: "snippet",
		order: "date",
		type: "video",
		videoDuration: "short",
		maxResults: String(Math.max(1, Math.min(25, cfg.maxResults || 8)))
	});
	const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
	if (!res.ok) throw new Error(`YouTube API ${res.status}`);
	return ((await res.json()).items ?? []).filter((i) => i.id.videoId).map((i) => {
		const id = i.id.videoId;
		return {
			url: `https://www.youtube.com/shorts/${id}`,
			embedSrc: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`,
			thumbnail: i.snippet.thumbnails?.medium?.url,
			title: i.snippet.title,
			source: "auto"
		};
	});
}
/** Facebook Graph API — latest reels/videos from a page. */
async function fetchFacebookReels(cfg) {
	if (!cfg.accessToken || !cfg.pageId) return [];
	const params = new URLSearchParams({
		access_token: cfg.accessToken,
		fields: "id,title,description,permalink_url,picture",
		limit: String(Math.max(1, Math.min(25, cfg.maxResults || 8)))
	});
	const res = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(cfg.pageId)}/video_reels?${params}`);
	if (!res.ok) throw new Error(`Facebook Graph ${res.status}`);
	return ((await res.json()).data ?? []).map((v) => {
		const url = v.permalink_url?.startsWith("http") ? v.permalink_url : `https://www.facebook.com${v.permalink_url ?? `/reel/${v.id}`}`;
		return {
			url,
			embedSrc: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`,
			thumbnail: v.picture,
			title: v.title,
			source: "auto"
		};
	});
}
/** Build the merged list according to the current mode. */
async function loadReels(cfg) {
	const manual = cfg.urls.flatMap((u) => {
		const src = toEmbedSrc(cfg.provider, u);
		const ytId = cfg.provider === "youtube" ? extractYouTubeId(u) : null;
		const thumbnail = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : void 0;
		return src ? [{
			url: u,
			embedSrc: src,
			thumbnail,
			source: "manual"
		}] : [];
	});
	let auto = [];
	if (cfg.mode !== "manual") try {
		auto = cfg.provider === "youtube" ? await fetchYouTubeShorts(cfg.youtube) : await fetchFacebookReels(cfg.facebook);
	} catch (e) {
		console.warn("[reels] auto fetch failed:", e);
	}
	if (cfg.mode === "manual") return manual;
	if (cfg.mode === "auto") return auto;
	const seen = new Set(manual.map((m) => m.url));
	return [...manual, ...auto.filter((a) => !seen.has(a.url))];
}
//#endregion
export { loadReelsConfig as a, toEmbedSrc as c, loadReels as i, fetchFacebookReels as n, onReelsConfigChange as o, fetchYouTubeShorts as r, saveReelsConfig as s, defaultReelsConfig as t };

//# sourceMappingURL=reels-config-4dsZmhVB.js.map