import type { LiveVideoConfig } from "@/lib/homepage-config";

type Props = {
  value: LiveVideoConfig;
  onChange: (v: LiveVideoConfig) => void;
};

export function LiveVideoEditor({ value, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
          <span className="mb-1 block text-[11px] font-medium text-slate-500">
            Overlay title
          </span>
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
            onChange={(e) =>
              onChange({ ...value, youtubeChannelId: e.target.value })
            }
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
            onChange={(e) =>
              onChange({ ...value, facebookPageUrl: e.target.value })
            }
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      )}
    </div>
  );
}
