import { Radio, Volume2, VolumeX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useHomepageConfig } from "@/hooks/use-homepage-config";

export function LiveVideo() {
  const { liveVideo } = useHomepageConfig();
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const src = useMemo(() => {
    if (liveVideo.provider === "youtube") {
      return `https://www.youtube-nocookie.com/embed/live_stream?channel=${liveVideo.youtubeChannelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1`;
    }
    const href = encodeURIComponent(liveVideo.facebookPageUrl);
    return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}`;
  }, [liveVideo, muted]);

  const toggleMute = () => {
    if (liveVideo.provider === "youtube" && iframeRef.current?.contentWindow) {
      const cmd = muted ? "unMute" : "mute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: [] }),
        "*"
      );
    }
    setMuted((m) => !m);
  };

  return (
    <article className="text-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        <iframe
          ref={iframeRef}
          src={src}
          title={liveVideo.title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          frameBorder={0}
        />
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          <Radio className="h-3 w-3 animate-pulse" />
          Live
        </span>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center bg-black/70 text-white backdrop-blur transition hover:bg-black"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
}
