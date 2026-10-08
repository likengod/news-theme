import React from "react";
import { User, Clock, Check, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Field, JournalistPicker } from "@/components/admin/articles/ArticleSubComponents";
import { formatDateTimeLocal, type Row } from "./types";

interface ArticleSettingsTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  currentUserAuthor?: string;
  authorOptions?: { id: string; name: string; username?: string; email?: string; phone?: string; role: string }[];
  isEnterprisePlus?: boolean;
}

export default function ArticleSettingsTab({
  row,
  onChange,
  currentUserAuthor = "Admin User",
  authorOptions = [],
  isEnterprisePlus,
}: ArticleSettingsTabProps) {
  // Built-in editorial desk defaults
  const editorialDefaults = [
    currentUserAuthor,
    "Newsroom Desk",
    "Staff Reporter",
    "Editorial Desk",
    "Special Correspondent",
  ].filter(Boolean);

  const allAuthorNames = Array.from(
    new Set([
      currentUserAuthor,
      ...editorialDefaults,
      ...(authorOptions || []).map((a) => a.name),
    ])
  ).filter(Boolean);

  const handleSetNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    onChange("date", localNow);
    onChange("status", "Published");
    toast.success("Publish date set to Now · Status set to Published");
  };

  const handleSchedulePlus1Hr = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    onChange("date", local);
    onChange("status", "Scheduled");
    toast.info("Scheduled for +1 hour");
  };

  const handleScheduleTomorrowMorning = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
    onChange("date", local);
    onChange("status", "Scheduled");
    toast.info("Scheduled for tomorrow 9:00 AM");
  };

  const handleScheduleTomorrowEvening = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T18:00`;
    onChange("date", local);
    onChange("status", "Scheduled");
    toast.info("Scheduled for tomorrow 6:00 PM");
  };

  const isFutureDate = Boolean(
    row.date && !isNaN(new Date(row.date).getTime()) && new Date(row.date).getTime() > Date.now() + 60 * 1000,
  );
  const isScheduled = row.status === "Scheduled" || isFutureDate;

  const [isCustomAuthor, setIsCustomAuthor] = React.useState<boolean>(() => {
    if (!row.author) return false;
    return !allAuthorNames.some(
      (n) => n.trim().toLowerCase() === row.author.trim().toLowerCase(),
    );
  });

  React.useEffect(() => {
    if (!row.author) {
      setIsCustomAuthor(false);
    } else {
      const isKnown = allAuthorNames.some(
        (n) => n.trim().toLowerCase() === row.author.trim().toLowerCase(),
      );
      setIsCustomAuthor(!isKnown);
    }
  }, [row.id, row.author]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="News Type">
          <select
            id="article-news-type"
            name="newsType"
            aria-label="News Type"
            value={row.newsType}
            onChange={(e) => onChange("newsType", e.target.value as Row["newsType"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Standard</option>
            <option>Breaking</option>
            <option>Featured</option>
            <option>Exclusive</option>
            <option>Opinion</option>
            <option>Video</option>
          </select>
        </Field>

        <Field label="Author *">
          <div className="space-y-2">
            {/* Quick Author Pills + Toggle Switch */}
            <div className="flex items-center justify-between gap-2 pb-0.5">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-0.5">Quick:</span>
                {editorialDefaults.slice(0, 3).map((name) => {
                  const isSelected = row.author?.trim().toLowerCase() === name.trim().toLowerCase();
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        onChange("author", name);
                        setIsCustomAuthor(false);
                      }}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer border ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{name === currentUserAuthor ? `🟢 ${name}` : name}</span>
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsCustomAuthor((prev) => !prev)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition cursor-pointer shrink-0 underline"
              >
                {isCustomAuthor ? "Choose from list" : "Type custom"}
              </button>
            </div>

            {/* Author Selector: Clean Dropdown or Clean Input */}
            {!isCustomAuthor ? (
              <select
                id="article-author-select"
                name="author"
                aria-label="Author Profile"
                value={
                  allAuthorNames.some((n) => n.trim().toLowerCase() === row.author?.trim().toLowerCase())
                    ? allAuthorNames.find((n) => n.trim().toLowerCase() === row.author?.trim().toLowerCase()) || ""
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setIsCustomAuthor(true);
                  } else if (e.target.value) {
                    onChange("author", e.target.value);
                  }
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-900 focus:outline-none"
              >
                <option value="">⚡ Select profile or editorial desk...</option>
                {currentUserAuthor && (
                  <option value={currentUserAuthor}>🟢 {currentUserAuthor} (Your Profile)</option>
                )}
                {authorOptions && authorOptions.length > 0 && (
                  <optgroup label="Registered Authors">
                    {authorOptions.map((a) => (
                      <option key={a.id} value={a.name}>
                        👤 {a.name} ({a.role}{a.username ? ` • @${a.username}` : ""})
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Editorial Desks">
                  <option value="Newsroom Desk">Newsroom Desk</option>
                  <option value="Staff Reporter">Staff Reporter</option>
                  <option value="Editorial Desk">Editorial Desk</option>
                  <option value="Special Correspondent">Special Correspondent</option>
                </optgroup>
                <option value="__custom__">✏️ Custom Author Name (Type custom)...</option>
              </select>
            ) : (
              <div className="relative">
                <input
                  id="article-custom-author"
                  name="article_custom_byline"
                  aria-label="Author"
                  type="text"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  spellCheck={false}
                  value={row.author}
                  placeholder="Enter author or agency name (e.g. PTI, Staff Reporter)..."
                  onChange={(e) => onChange("author", e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                  autoFocus
                />
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              {isCustomAuthor
                ? "Type any reporter or agency name. Click 'Choose from list' to select a profile."
                : `Selected author: ${row.author || "None"} — Click 'Type custom' to type any custom byline.`}
            </p>
          </div>
        </Field>

        <Field label="Status">
          <select
            id="article-status"
            name="status"
            aria-label="Status"
            value={row.status}
            onChange={(e) => {
              const nextStatus = e.target.value as Row["status"];
              onChange("status", nextStatus);
              const now = new Date();
              const pad = (n: number) => String(n).padStart(2, "0");
              const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

              if (nextStatus === "Scheduled") {
                const currentTime = row.date ? new Date(row.date).getTime() : 0;
                if (!currentTime || currentTime <= Date.now() + 60 * 1000) {
                  const plus1Hr = new Date(Date.now() + 60 * 60 * 1000);
                  const scheduledTime = `${plus1Hr.getFullYear()}-${pad(plus1Hr.getMonth() + 1)}-${pad(plus1Hr.getDate())}T${pad(plus1Hr.getHours())}:${pad(plus1Hr.getMinutes())}`;
                  onChange("date", scheduledTime);
                  toast.info("Status set to Scheduled · Date set to +1 hour");
                }
              } else if (nextStatus === "Published") {
                const currentTime = row.date ? new Date(row.date).getTime() : 0;
                if (currentTime > Date.now() + 60 * 1000) {
                  onChange("date", localNow);
                  toast.info("Status set to Published · Date set to Now");
                }
              }
            }}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          >
            <option>Published</option>
            <option>Scheduled</option>
            <option>Draft</option>
            <option>Review</option>
            {row.status === "Trash" && <option>Trash</option>}
          </select>
        </Field>

        <Field label="Access Level">
          <select
            id="article-access-level"
            name="access_level"
            aria-label="Access Level"
            value={row.access_level}
            onChange={(e) => onChange("access_level", e.target.value as Row["access_level"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="Free">Free (All users)</option>
            <option value="Premium">Premium (Admin / Editor / Author only)</option>
          </select>
        </Field>

        <Field label="Publish Date">
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                id="article-publish-date"
                name="date"
                aria-label="Publish Date"
                type="datetime-local"
                value={formatDateTimeLocal(row.date)}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange("date", val);
                  if (val) {
                    const selectedTime = new Date(val).getTime();
                    const nowTime = Date.now();
                    if (selectedTime > nowTime + 60 * 1000) {
                      onChange("status", "Scheduled");
                    } else if (row.status === "Scheduled") {
                      onChange("status", "Published");
                    }
                  }
                }}
                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSetNow}
                className="shrink-0 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs active:scale-95"
                title="Set publish date to current local date and time and status to Published"
              >
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Now</span>
              </button>
            </div>

            {/* Quick Schedule Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-0.5">
                Schedule:
              </span>
              <button
                type="button"
                onClick={handleSchedulePlus1Hr}
                className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95"
              >
                <CalendarClock className="h-3 w-3" />
                <span>+1 Hr</span>
              </button>
              <button
                type="button"
                onClick={handleScheduleTomorrowMorning}
                className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95"
              >
                <span>Tomorrow 9 AM</span>
              </button>
              <button
                type="button"
                onClick={handleScheduleTomorrowEvening}
                className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95"
              >
                <span>Tomorrow 6 PM</span>
              </button>
            </div>

            {/* Scheduled preview info */}
            {isScheduled && (
              <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5 min-w-0">
                  <CalendarClock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-blue-900">
                      Scheduled for auto-publishing:
                    </div>
                    <div className="text-slate-700 font-medium truncate">
                      {new Date(row.date).toLocaleString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSetNow}
                  className="shrink-0 rounded-md border border-blue-300 bg-white hover:bg-blue-100/70 px-2.5 py-1 text-[11px] font-semibold text-blue-800 transition cursor-pointer shadow-xs active:scale-95"
                  title="Override schedule and publish immediately"
                >
                  Publish Now Instead
                </button>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Articles set to Now or in the past appear immediately. Future dates schedule the article to go live automatically at the selected time.
            </p>
          </div>
        </Field>

        {isEnterprisePlus && (
          <Field label="Post Views">
            <input
              id="article-views"
              name="views"
              aria-label="Post Views"
              type="number"
              min={0}
              value={row.views}
              onChange={(e) => onChange("views", Number(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </Field>
        )}

        <Field label="Featured on homepage">
          <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm">
            <input
              id="article-featured"
              name="featured"
              aria-label="Pin to hero / featured slot"
              type="checkbox"
              checked={row.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
            />
            Pin to hero / featured slot
          </label>
        </Field>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <JournalistPicker
          journalistId={row.journalistId}
          journalistName={row.journalistName}
          onSelect={(j) => {
            onChange("journalistId", j?.publicUserId ?? "");
            onChange("journalistName", j?.displayName ?? "");
            if (j?.displayName) onChange("author", j.displayName);
          }}
        />
      </div>
    </div>
  );
}
