import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-CWOAfGtf.js";
import { n as requireAuth } from "./auth-middleware-Cqd3GFjU.js";
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
var getReelsConfigServer = createServerFn({ method: "GET" }).handler(createSsrRpc("02dd087da9491aa68558b9de13a4861735f8ea28b497ce2394d9627b9f16bee4"));
var saveReelsConfigServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((cfg) => cfg).handler(createSsrRpc("702655ca1b3fca4307cb686a091790c96919c26dd8288220df2010c9f93b5cd8"));
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
	if (typeof window !== "undefined") {
		localStorage.setItem(KEY, JSON.stringify(cfg));
		window.dispatchEvent(new Event(EVENT));
	}
	saveReelsConfigServer({ data: cfg }).catch(() => {});
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
		let clean = (url || "").trim();
		if (!clean) return null;
		if (!/^https?:\/\//i.test(clean)) clean = "https://" + clean;
		const u = new URL(clean);
		if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
		if (u.pathname.includes("/shorts/")) {
			const parts = u.pathname.split("/shorts/");
			if (parts[1]) return parts[1].split("/")[0].split("?")[0] || null;
		}
		if (u.pathname.includes("/embed/")) {
			const parts = u.pathname.split("/embed/");
			if (parts[1]) return parts[1].split("/")[0].split("?")[0] || null;
		}
		if (u.searchParams.has("v")) return u.searchParams.get("v");
		const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
function toEmbedSrc(provider, url) {
	if (provider === "youtube") {
		const id = extractYouTubeId(url);
		return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1` : null;
	}
	let trimmed = url.trim();
	if (!/^https?:\/\//i.test(trimmed)) trimmed = "https://" + trimmed;
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
export { getReelsConfigServer as a, onReelsConfigChange as c, toEmbedSrc as d, fetchYouTubeShorts as i, saveReelsConfig as l, extractYouTubeId as n, loadReels as o, fetchFacebookReels as r, loadReelsConfig as s, defaultReelsConfig as t, saveReelsConfigServer as u };

//# sourceMappingURL=reels-config-BxquP2pH.js.map