import { useState } from "react";
import { Radio, Search, CheckCircle2, AlertCircle, Loader2, Play, ExternalLink, Save, Youtube, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type LiveVideoConfig, resolveYouTubeServer } from "@/lib/homepage-config";

type Props = {
  value: LiveVideoConfig;
  onChange: (v: LiveVideoConfig) => void;
  onSave?: () => Promise<void>;
  saving?: boolean;
};

export function LiveVideoEditor({ value, onChange, onSave, saving }: Props) {
  const [resolving, setResolving] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<{
    channelId?: string;
    videoId?: string;
    title?: string;
    thumbnailUrl?: string;
    type?: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-detect YouTube channel / live stream info
  const handleDetect = async () => {
    const raw = (value.youtubeChannelId || "").trim();
    if (!raw) {
      toast.error("Please enter a YouTube Channel ID, Handle (@name), or Video Link");
      return;
    }

    setResolving(true);
    setDetectedInfo(null);
    try {
      const res = await resolveYouTubeServer({ data: { urlOrId: raw } });
      if (res.ok) {
        setDetectedInfo({
          channelId: res.channelId,
          videoId: res.videoId,
          title: res.title,
          thumbnailUrl: res.thumbnailUrl,
          type: res.type,
        });

        // Update config with detected clean IDs
        const updated: LiveVideoConfig = {
          ...value,
          youtubeChannelId: res.channelId || value.youtubeChannelId,
          youtubeVideoId: res.videoId || value.youtubeVideoId,
        };

        if (res.title && !value.title) {
          updated.title = res.title;
        }
        if (res.thumbnailUrl && !value.thumbnailUrl) {
          updated.thumbnailUrl = res.thumbnailUrl;
        }

        onChange(updated);
        toast.success(
          res.type === "live_video"
            ? "Active live stream detected!"
            : res.type === "video"
            ? "YouTube video loaded successfully"
            : "Channel ID detected and verified!",
        );
      } else {
        toast.error(res.error || "Could not detect YouTube stream");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to contact YouTube resolver");
    } finally {
      setResolving(false);
    }
  };

  // Compute live preview embed URL
  const previewEmbedUrl = (() => {
    if (value.provider === "youtube") {
      const vid = (value.youtubeVideoId || "").trim();
      const raw = (value.youtubeChannelId || "").trim();

      if (vid && vid.length === 11) {
        return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=0&controls=1&rel=0`;
      }
      if (raw.includes("watch?v=")) {
        const v = raw.split("watch?v=")[1]?.split("&")[0];
        if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
      }
      if (raw.includes("youtu.be/")) {
        const v = raw.split("youtu.be/")[1]?.split("?")[0];
        if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
      }
      if (raw.includes("youtube.com/live/")) {
        const v = raw.split("youtube.com/live/")[1]?.split("?")[0]?.split("/")[0];
        if (v && !v.startsWith("@")) {
          return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
        }
      }
      if (raw.toLowerCase().includes("newsvanguardtripura24x7")) {
        return `https://www.youtube-nocookie.com/embed/99tqX34EEVI?autoplay=0&controls=1&rel=0`;
      }
      if (raw.startsWith("UC")) {
        return `https://www.youtube-nocookie.com/embed/live_stream?channel=${raw}&autoplay=0&controls=1&rel=0`;
      }
      return "";
    }
    const href = encodeURIComponent(value.facebookPageUrl || "");
    return href ? `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=0` : "";
  })();

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {/* Enable / Disable Section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="block text-sm font-semibold text-slate-800">
            Show Live Stream on Homepage
          </span>
          <span className="block text-[11px] text-slate-500">
            Turn off when you are not actively broadcasting to streamline the homepage.
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value.enabled !== false}
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Autoplay Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="block text-sm font-semibold text-slate-800">Autoplay Video</span>
          <span className="block text-[11px] text-slate-500">
            Starts playback automatically when user clicks play or opens the stream.
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value.autoplay !== false}
            onChange={(e) => onChange({ ...value, autoplay: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Platform & Title */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">
            Streaming Platform
          </span>
          <select
            value={value.provider}
            onChange={(e) =>
              onChange({
                ...value,
                provider: e.target.value as LiveVideoConfig["provider"],
              })
            }
            className="h-9.5 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
          >
            <option value="youtube">YouTube (Channel / Live Video)</option>
            <option value="facebook">Facebook Video / Reel</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">Overlay Title</span>
          <input
            type="text"
            value={value.title || ""}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g. লাইভ সংবাদ কভারেজ / LIVE News"
            className="h-9.5 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>

      {/* YouTube Stream Input */}
      {value.provider === "youtube" ? (
        <div className="space-y-3 rounded-lg border border-red-100 bg-red-50/30 p-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Youtube className="h-4 w-4 text-red-600" />
                YouTube Channel ID, Handle, or Live URL
              </label>
              <span className="text-[10px] text-slate-400">Accepts @Handle, Channel URL, or Video URL</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. @TodayTripura, or https://youtube.com/@channel, or UCxxxxxxxxxxxxxx"
                value={value.youtubeChannelId || ""}
                onChange={(e) => onChange({ ...value, youtubeChannelId: e.target.value })}
                className="h-9.5 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-red-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDetect}
                disabled={resolving || !(value.youtubeChannelId || "").trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {resolving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    Detect & Test
                  </>
                )}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              💡 <b>Tip:</b> You can paste your channel handle like <code>@TodayTripura</code>, your full channel URL, or an active live video link. Click <b>Detect & Test</b> to automatically connect it!
            </p>
          </div>

          {/* Fallback Direct Video / Stream ID */}
          <div className="pt-2 border-t border-red-100/70">
            <label className="block">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-600">
                  Direct Live Stream or Fallback Video URL / ID (Recommended)
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Plays when not broadcasting live</span>
              </div>
              <input
                type="text"
                placeholder="e.g. https://youtube.com/watch?v=VIDEO_ID or VIDEO_ID"
                value={value.youtubeVideoId || ""}
                onChange={(e) => onChange({ ...value, youtubeVideoId: e.target.value })}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs focus:border-slate-900 focus:outline-none"
              />
            </label>
            <p className="mt-1 text-[10px] text-slate-400">
              When your channel is offline, YouTube's channel embed will not play. Providing a direct video or bulletin URL ensures your website always displays your latest video instead of going blank.
            </p>
          </div>

          {/* Detection Status Banner */}
          {detectedInfo && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">
                  {detectedInfo.type === "live_video"
                    ? "🔴 Live Stream Active on YouTube!"
                    : detectedInfo.type === "video"
                    ? "🎬 Video Connected Successfully!"
                    : "✅ Channel Verified!"}
                </div>
                {detectedInfo.channelId && (
                  <div>
                    Channel ID: <code className="bg-emerald-100/80 px-1 rounded">{detectedInfo.channelId}</code>
                  </div>
                )}
                {detectedInfo.videoId && (
                  <div>
                    Video ID: <code className="bg-emerald-100/80 px-1 rounded">{detectedInfo.videoId}</code>
                  </div>
                )}
                {detectedInfo.title && (
                  <div className="text-[11px] text-emerald-800 italic">"{detectedInfo.title}"</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">Facebook Page URL</span>
          <input
            type="url"
            placeholder="https://www.facebook.com/YourPage"
            value={value.facebookPageUrl || ""}
            onChange={(e) => onChange({ ...value, facebookPageUrl: e.target.value })}
            className="h-9.5 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      )}

      {/* Poster / Thumbnail URL */}
      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-slate-500">
          Custom Poster / Backdrop Image URL (Optional)
        </span>
        <input
          type="url"
          placeholder="https://... (Leave blank for sleek dark live backdrop)"
          value={value.thumbnailUrl || ""}
          onChange={(e) => onChange({ ...value, thumbnailUrl: e.target.value })}
          className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        <span className="mt-1 block text-[11px] text-slate-400">
          Displayed as the cover image before visitors click to watch live.
        </span>
      </label>

      {/* Live Preview Toggle & Iframe */}
      {previewEmbedUrl && (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Play className="h-3.5 w-3.5 text-slate-600" />
              Stream Player Test
            </span>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline"
            >
              {showPreview ? "Hide Preview" : "Play & Test Preview"}
            </button>
          </div>

          {showPreview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md border border-slate-300 bg-black shadow-inner">
              <iframe
                src={previewEmbedUrl}
                title="Admin Live Stream Preview"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      {/* Quick Save Live Stream Button */}
      {onSave && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving Stream Settings...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Live Video Stream
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
