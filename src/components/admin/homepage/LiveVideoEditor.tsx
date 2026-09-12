import type { LiveVideoConfig } from "@/lib/homepage-config";

type Props = {
  value: LiveVideoConfig;
  onChange: (v: LiveVideoConfig) => void;
};

export function LiveVideoEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Enable / Disable Section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="block text-sm font-semibold text-slate-800">
            Show Live Stream on Homepage
          </span>
          <span className="block text-[11px] text-slate-500">
            Turn off when you are not actively broadcasting live to streamline the homepage.
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

      <div className="rounded-md bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200 flex items-start gap-2">
        <span className="font-bold">⚡ High Performance:</span>
        <span>
          Uses a modular click-to-play Lite Facade. YouTube's ~900KB scripts will <b>never</b> slow
          down initial page loads or Google PageSpeed scores. The stream only loads when clicked.
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">
            Streaming platform
          </span>
          <select
            value={value.provider}
            onChange={(e) =>
              onChange({
                ...value,
                provider: e.target.value as LiveVideoConfig["provider"],
              })
            }
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm focus:border-slate-900 focus:outline-none"
          >
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">Overlay title</span>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="LIVE: News Coverage"
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>

      {value.provider === "youtube" ? (
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">
            YouTube Channel ID
          </span>
          <input
            type="text"
            placeholder="UCxxxxxxxxxxxxxxxxxxxx"
            value={value.youtubeChannelId}
            onChange={(e) => onChange({ ...value, youtubeChannelId: e.target.value })}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
          <span className="mt-1 block text-[11px] text-slate-500">
            From your YouTube Channel URL: youtube.com/channel/<b>UC…</b>
          </span>
        </label>
      ) : (
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">
            Facebook Page URL
          </span>
          <input
            type="url"
            placeholder="https://www.facebook.com/YourPage"
            value={value.facebookPageUrl}
            onChange={(e) => onChange({ ...value, facebookPageUrl: e.target.value })}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1 block text-[11px] font-medium text-slate-500">
          Custom Poster / Thumbnail Image URL (Optional)
        </span>
        <input
          type="url"
          placeholder="https://... (Leave blank for default sleek live backdrop)"
          value={value.thumbnailUrl || ""}
          onChange={(e) => onChange({ ...value, thumbnailUrl: e.target.value })}
          className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        <span className="mt-1 block text-[11px] text-slate-500">
          Displayed as the preview poster before the user clicks to start playing.
        </span>
      </label>
    </div>
  );
}
