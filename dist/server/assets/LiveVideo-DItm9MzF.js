import { t as useHomepageConfig } from "./use-homepage-config-C7HpMxmD.js";
import { useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Play, Radio, Volume2, VolumeX } from "lucide-react";
//#region src/components/site/LiveVideo.tsx
function LiveVideo() {
	const { liveVideo } = useHomepageConfig();
	const [isPlaying, setIsPlaying] = useState(false);
	const [muted, setMuted] = useState(true);
	const iframeRef = useRef(null);
	const src = useMemo(() => {
		if (liveVideo.provider === "youtube") {
			const vid = (liveVideo.youtubeVideoId || "").trim();
			const raw = (liveVideo.youtubeChannelId || "").trim();
			if (vid && vid.length === 11) return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			let videoId = "";
			let channelId = raw;
			if (raw.includes("watch?v=")) videoId = raw.split("watch?v=")[1]?.split("&")[0] || "";
			else if (raw.includes("youtu.be/")) videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
			else if (raw.includes("youtube.com/live/")) {
				const after = raw.split("youtube.com/live/")[1]?.split("?")[0]?.split("/")[0] || "";
				if (after && !after.startsWith("@")) videoId = after;
			} else if (raw.includes("channel/")) channelId = raw.split("channel/")[1]?.split("/")[0]?.split("?")[0] || channelId;
			else if (raw.length === 11 && !raw.startsWith("UC")) videoId = raw;
			if (raw.toLowerCase().includes("newsvanguardtripura24x7")) {
				channelId = "UC2EhA8EnLxOCbgn3nW2-OjA";
				if (!videoId) videoId = "99tqX34EEVI";
			}
			if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			if (channelId && channelId.startsWith("UC")) return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			return "";
		}
		const href = encodeURIComponent(liveVideo.facebookPageUrl || "");
		return href ? `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}` : "";
	}, [liveVideo, muted]);
	if (liveVideo?.enabled === false || !src) return null;
	const toggleMute = (e) => {
		e.stopPropagation();
		if (liveVideo.provider === "youtube" && iframeRef.current?.contentWindow) {
			const cmd = muted ? "unMute" : "mute";
			iframeRef.current.contentWindow.postMessage(JSON.stringify({
				event: "command",
				func: cmd,
				args: []
			}), "*");
		}
		setMuted((m) => !m);
	};
	return /* @__PURE__ */ jsx("article", {
		className: "text-center",
		children: /* @__PURE__ */ jsx("div", {
			className: "relative aspect-[16/9] w-full overflow-hidden bg-black rounded-lg border border-border/40 shadow-sm group",
			children: isPlaying ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("iframe", {
					ref: iframeRef,
					src,
					title: liveVideo.title || "Live Stream",
					className: "absolute inset-0 h-full w-full",
					allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
					allowFullScreen: true,
					referrerPolicy: "strict-origin-when-cross-origin",
					frameBorder: 0
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white z-10 shadow-md",
					children: [/* @__PURE__ */ jsx(Radio, { className: "h-3 w-3 animate-pulse" }), "Live"]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: toggleMute,
					"aria-label": muted ? "Unmute sound" : "Mute sound",
					className: "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-xs text-white backdrop-blur transition hover:bg-black cursor-pointer shadow-lg border border-white/10 hover:scale-105",
					children: muted ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(VolumeX, { className: "h-3.5 w-3.5 text-red-400 animate-pulse" }), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-medium tracking-wide",
						children: "Tap for sound"
					})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Volume2, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-medium tracking-wide",
						children: "Sound On"
					})] })
				})
			] }) : /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setIsPlaying(true),
				"aria-label": `Play ${liveVideo.title || "Live Stream"}`,
				className: "group/btn relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white cursor-pointer transition hover:brightness-105 focus:outline-none",
				children: [
					liveVideo.thumbnailUrl ? /* @__PURE__ */ jsx("img", {
						src: liveVideo.thumbnailUrl,
						alt: liveVideo.title || "Live",
						className: "absolute inset-0 h-full w-full object-cover opacity-60 group-hover/btn:opacity-75 transition-opacity",
						loading: "lazy",
						decoding: "async"
					}) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-zinc-950/90 to-black" }),
					/* @__PURE__ */ jsxs("span", {
						className: "pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm bg-[#dc2626] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md",
						children: [/* @__PURE__ */ jsx(Radio, { className: "h-3.5 w-3.5 animate-pulse text-white" }), "Live Stream"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 flex flex-col items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-red-500",
							children: /* @__PURE__ */ jsx(Play, { className: "h-7 w-7 fill-white ml-1" })
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white/90 backdrop-blur-sm shadow",
							children: "Click to Watch Live"
						})]
					}),
					liveVideo.title && /* @__PURE__ */ jsx("div", {
						className: "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 text-left",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold leading-snug text-white line-clamp-1 drop-shadow",
							children: liveVideo.title
						})
					})
				]
			})
		})
	});
}
//#endregion
export { LiveVideo };

//# sourceMappingURL=LiveVideo-DItm9MzF.js.map