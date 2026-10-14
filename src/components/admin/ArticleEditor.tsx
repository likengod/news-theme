import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Share2,
  Sparkles,
  CalendarClock,
  Send,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import {
  type Row,
  type Tab,
  statusStyle,
  fullUrl,
} from "./articles/types";
import AiArticleModal, { type GeneratedAiContent } from "./articles/AiArticleModal";
import ArticleContentTab from "./articles/ArticleContentTab";
import ArticleMediaTab from "./articles/ArticleMediaTab";
import ArticleSeoTab from "./articles/ArticleSeoTab";
import ArticleSettingsTab from "./articles/ArticleSettingsTab";

export type { Row };
export { statusStyle };

export default function ArticleEditor({
  initial,
  currentUserAuthor,
  authorOptions,
  onClose,
  onSave,
}: {
  initial: Row;
  currentUserAuthor?: string;
  authorOptions?: { id: string; name: string; username?: string; email?: string; phone?: string; role: string }[];
  onClose: () => void;
  onSave: (r: Row) => void;
}) {
  const s = useSiteSettings();
  const planType = (s.licenseType || "").toLowerCase();
  const isEnterprise = planType.includes("enterprise");
  const isEnterprisePlus =
    planType.includes("enterprise+") ||
    planType.includes("enterprise plus");

  // Normalize initial data to handle null database values
  const normalizeRow = (raw: Row): Row => ({
    ...raw,
    title: raw.title || "",
    slug: raw.slug || "",
    category: raw.category || "Uncategorized",
    city: raw.city || "",
    state: raw.state || "",
    country: raw.country || "",
    author: raw.author || currentUserAuthor || "Admin User",
    excerpt: raw.excerpt || "",
    content: raw.content || "",
    featuredImage: raw.featuredImage || "",
    ogImage: raw.ogImage || raw.featuredImage || "",
    imageCaption: raw.imageCaption || "",
    imageCredit: raw.imageCredit || "",
    metaTitle: raw.metaTitle || "",
    metaDescription: raw.metaDescription || "",
    tags: raw.tags || "",
    date: raw.date || new Date().toISOString(),
    views: raw.views || 0,
    featured: !!raw.featured,
    newsType: raw.newsType || "Standard",
    journalistId: raw.journalistId || "",
    journalistName: raw.journalistName || "",
    access_level: raw.access_level || "Free",
  });

  const [r, setR] = useState<Row>(() => normalizeRow(initial));
  const [tab, setTab] = useState<Tab>("content");
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (initial) {
      setR(normalizeRow(initial));
    }
  }, [initial, currentUserAuthor]);

  const set = <K extends keyof Row>(k: K, v: Row[K]) => setR((p) => ({ ...p, [k]: v }));

  const handleApplyAi = (generatedAiData: GeneratedAiContent) => {
    setR((prev) => ({
      ...prev,
      content: generatedAiData.body || prev.content,
      excerpt: generatedAiData.excerpt || prev.excerpt,
      city: generatedAiData.location?.city || prev.city,
      state: generatedAiData.location?.state || prev.state,
      country: generatedAiData.location?.country || prev.country,
      metaTitle: generatedAiData.metaTitle || prev.metaTitle,
      metaDescription: generatedAiData.metaDescription || prev.metaDescription,
      tags:
        Array.isArray(generatedAiData.tags) && generatedAiData.tags.length > 0
          ? generatedAiData.tags.join(",")
          : prev.tags,
    }));
    setShowAiModal(false);
    toast.success("AI Content applied successfully!");
  };

  const isScheduled =
    r.status === "Scheduled" ||
    Boolean(
      r.date &&
        !isNaN(new Date(r.date).getTime()) &&
        new Date(r.date).getTime() > Date.now() + 60 * 1000,
    );

  const handleSave = (status?: Row["status"], explicitDate?: string) => {
    if (!r.title.trim()) return toast.error("Title is required");
    if (!r.author.trim()) return toast.error("Author is required");
    onSave({
      ...r,
      ...(status ? { status } : {}),
      ...(explicitDate ? { date: explicitDate } : {}),
    });
  };

  const handlePublish = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const isExistingPastDate =
      r.status === "Published" &&
      r.date &&
      !isNaN(new Date(r.date).getTime()) &&
      new Date(r.date).getTime() <= Date.now();
    handleSave("Published", isExistingPastDate ? undefined : localNow);
  };

  const handlePublishNow = () => {
    handlePublish();
  };

  const url = fullUrl(r);
  const getProtocol = () => (typeof window !== "undefined" ? window.location.protocol : "http:");
  const copyUrl = async () => {
    try {
      const protocol = getProtocol();
      await navigator.clipboard.writeText(`${protocol}//${url}`);
      toast.success("URL copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: "content", label: "Content", icon: FileText },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "seo", label: "SEO & Social", icon: Share2 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const order: Tab[] = ["content", "media", "seo", "settings"];
  const idx = order.indexOf(tab);
  const isLast = tab === "settings";
  const isFirst = idx === 0;
  const prevTab = order[idx - 1];
  const nextTab = order[idx + 1];

  return (
    <div className="fixed inset-0 z-50 flex sm:grid sm:place-items-center bg-slate-950/60 p-0 sm:p-4 backdrop-blur-sm overflow-hidden">
      <div className="flex h-full sm:h-auto max-h-full sm:max-h-[94vh] w-full max-w-6xl flex-col rounded-none sm:rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" /> {initial.title ? "Edit" : "New"}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyle[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-slate-900">
                {r.title || "Untitled article"}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                <a
                  href={`${getProtocol()}//${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-mono text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {url}
                </a>
                <button
                  onClick={copyUrl}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave("Draft")}
                className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                title="Save current progress as draft"
              >
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span>Save Draft</span>
              </button>

              {isScheduled ? (
                <>
                  <button
                    type="button"
                    onClick={handlePublishNow}
                    className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-xs cursor-pointer"
                    title="Override schedule and publish immediately"
                  >
                    <span>Publish Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("Scheduled")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm cursor-pointer"
                    title="Save as scheduled post"
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>Schedule Post</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publish</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 shadow-xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">AI News Assistant</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-3 flex overflow-x-auto gap-1.5 pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50 px-3.5 sm:px-6 py-4 sm:py-6">
          {tab === "content" && (
            <ArticleContentTab
              row={r}
              onChange={set}
              autoSlug={!initial.title}
            />
          )}

          {tab === "media" && (
            <ArticleMediaTab
              row={r}
              onChange={set}
            />
          )}

          {tab === "seo" && (
            <ArticleSeoTab
              row={r}
              onChange={set}
              fullUrl={url}
            />
          )}

          {tab === "settings" && (
            <ArticleSettingsTab
              row={r}
              onChange={set}
              currentUserAuthor={currentUserAuthor}
              authorOptions={authorOptions}
              isEnterprisePlus={isEnterprisePlus}
            />
          )}
        </div>

        {/* Step Progression Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-3 sm:px-6 py-2.5 sm:py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-20 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-200 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition whitespace-nowrap cursor-pointer shrink-0"
              >
                Cancel
              </button>
              {!isFirst && (
                <button
                  type="button"
                  onClick={() => setTab(prevTab)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  Back
                </button>
              )}
              <p className="text-[11px] sm:text-xs text-slate-500 truncate ml-1 sm:ml-2">
                <span className="font-bold text-slate-800">{idx + 1}/{order.length}</span>
                <span className="hidden md:inline"> · {isLast ? "Review & publish" : "Complete step & continue"}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setTab(nextTab)}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs cursor-pointer shrink-0"
                >
                  <span className="sm:hidden">Next</span>
                  <span className="hidden sm:inline">
                    Next:{" "}
                    {nextTab === "media"
                      ? "Media"
                      : nextTab === "seo"
                        ? "SEO & Social"
                        : "Settings"}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSave("Draft")}
                    className="rounded-md border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 transition whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Draft
                  </button>
                  {isScheduled ? (
                    <>
                      <button
                        type="button"
                        onClick={handlePublishNow}
                        className="hidden xs:inline-flex rounded-md border border-slate-300 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-100 transition shadow-2xs whitespace-nowrap cursor-pointer shrink-0"
                        title="Override schedule and publish immediately"
                      >
                        Publish Now
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave("Scheduled")}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                      >
                        <CalendarClock className="h-3.5 w-3.5" />
                        <span>Schedule</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePublish}
                      className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiArticleModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApply={handleApplyAi}
        isEnterprise={isEnterprise}
      />
    </div>
  );
}
