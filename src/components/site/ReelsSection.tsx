import { useEffect, useMemo, useState } from "react";
import { Youtube, Facebook, Loader2, Play } from "lucide-react";
import { useReelsConfig } from "@/hooks/use-reels-config";
import { loadReels, type ReelItem } from "@/lib/reels-config";

export function ReelsSection() {
  const cfg = useReelsConfig();
  const [items, setItems] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  // Refetch when config changes (provider / mode / creds / manual list).
  const depKey = useMemo(() => JSON.stringify(cfg), [cfg]);

  useEffect(() => {
    if (!cfg.enabled) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadReels(cfg)
      .then((r) => !cancelled && setItems(r))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);

  if (!cfg.enabled) return null;
  if (!loading && items.length === 0) return null;

  const Icon = cfg.provider === "youtube" ? Youtube : Facebook;
  const brandColor = cfg.provider === "youtube" ? "#FF0000" : "#1877F2";

  return (
    <section className="mt-10 border-t border-border pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
          <Icon className="h-5 w-5" style={{ color: brandColor }} />
          {cfg.title}
        </h2>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {cfg.provider === "youtube" ? "YouTube Shorts" : "Facebook Reels"}
          {cfg.mode !== "manual" && " · Auto"}
        </span>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading latest reels…
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-2 pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-4 md:pb-0">
          {items.map((it) => {
            const isPlaying = playingUrl === it.url;
            const thumb =
              it.thumbnail ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={it.url}
                onClick={() => setPlayingUrl(it.url)}
                style={{
                  width: "23%",
                  minWidth: "23%",
                }}
                className="group relative aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-2xl bg-black border border-border/40 shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer md:!w-auto md:!min-w-0 md:shrink"
              >
                {/* Top Avatar badge with blue/red ring (matching user screenshot) */}
                <div className="absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#1877F2] bg-black/80 shadow-md overflow-hidden">
                  <Icon className="h-4 w-4 text-white" style={{ color: brandColor }} />
                </div>

                {isPlaying ? (
                  <iframe
                    src={it.embedSrc}
                    title={it.title ?? "Reel"}
                    className="absolute inset-0 h-full w-full z-10"
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    frameBorder={0}
                  />
                ) : (
                  <>
                    {/* Thumbnail Image */}
                    <img
                      src={thumb}
                      alt={it.title ?? "Reel"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay at bottom for clean text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Center Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Title / Label overlay at bottom */}
                    <div className="absolute bottom-3 left-2.5 right-2.5 z-10">
                      <p className="text-xs font-bold leading-snug text-white line-clamp-2 drop-shadow-md">
                        {it.title || "Watch Reel"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
