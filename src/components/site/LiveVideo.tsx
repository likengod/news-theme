import { Radio, Play, Volume2, VolumeX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useHomepageConfig } from "@/hooks/use-homepage-config";

export function LiveVideo() {
  const { liveVideo } = useHomepageConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // If live stream is toggled off in admin settings, do not render
  if (liveVideo?.enabled === false) {
    return null;
  }

  const src = useMemo(() => {
    if (liveVideo.provider === "youtube") {
      return `https://www.youtube-nocookie.com/embed/live_stream?channel=${liveVideo.youtubeChannelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
    }
    const href = encodeURIComponent(liveVideo.facebookPageUrl);
    return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}`;
  }, [liveVideo, muted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liveVideo.provider === "youtube" && iframeRef.current?.contentWindow) {
      const cmd = muted ? "unMute" : "mute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: [] }),
        "*",
      );
    }
    setMuted((m) => !m);
  };

  return (
    <article className="text-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black rounded-lg border border-border/40 shadow-sm group">
        {isPlaying ? (
          <>
            <iframe
              ref={iframeRef}
              src={src}
              title={liveVideo.title || "Live Stream"}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              frameBorder={0}
            />
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white z-10 shadow-md">
              <Radio className="h-3 w-3 animate-pulse" />
              Live
            </span>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute bottom-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded bg-black/70 text-white backdrop-blur transition hover:bg-black"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </>
        ) : (
          /* Modular Lite Facade — Zero YouTube JS loaded until user clicks to watch */
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${liveVideo.title || "Live Stream"}`}
            className="group/btn relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white cursor-pointer transition hover:brightness-105 focus:outline-none"
          >
            {liveVideo.thumbnailUrl ? (
              <img
                src={liveVideo.thumbnailUrl}
                alt={liveVideo.title || "Live"}
                className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover/btn:opacity-75 transition-opacity"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-zinc-950/90 to-black" />
            )}

            {/* Glowing Live Badge */}
            <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm bg-[#dc2626] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md">
              <Radio className="h-3.5 w-3.5 animate-pulse text-white" />
              Live Stream
            </span>

            {/* Play Button Facade */}
            <div className="relative z-10 flex flex-col items-center gap-2.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-red-500">
                <Play className="h-7 w-7 fill-white ml-1" />
              </div>
              <span className="rounded bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white/90 backdrop-blur-sm shadow">
                Click to Watch Live
              </span>
            </div>

            {/* Bottom Stream Title */}
            {liveVideo.title && (
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 text-left">
                <p className="text-xs font-bold leading-snug text-white line-clamp-1 drop-shadow">
                  {liveVideo.title}
                </p>
              </div>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
