import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Share2,
  Sparkles,
  X,
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
  onClose,
  onSave,
}: {
  initial: Row;
  onClose: () => void;
  onSave: (r: Row) => void;
}) {
  const s = useSiteSettings();
  const planType = (s.licenseType || "").toLowerCase();
  const isEnterprisePlus =
    planType.includes("enterprise+") ||
    planType.includes("enterprise plus");

  // Normalize initial data to handle null database values
  const normalizedInitial: Row = {
    ...initial,
    title: initial.title || "",
    slug: initial.slug || "",
    category: initial.category || "Northeast",
    city: initial.city || "",
    state: initial.state || "",
    country: initial.country || "",
    author: initial.author || "",
    excerpt: initial.excerpt || "",
    content: initial.content || "",
    featuredImage: initial.featuredImage || "",
    ogImage: initial.ogImage || "",
    metaTitle: initial.metaTitle || "",
    metaDescription: initial.metaDescription || "",
    tags: initial.tags || "",
    views: initial.views || 0,
    featured: !!initial.featured,
    newsType: initial.newsType || "Standard",
    journalistId: initial.journalistId || "",
    journalistName: initial.journalistName || "",
    access_level: initial.access_level || "Free",
  };

  const [r, setR] = useState<Row>(normalizedInitial);
  const [tab, setTab] = useState<Tab>("content");
  const [showAiModal, setShowAiModal] = useState(false);

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

  const handleSave = (status?: Row["status"]) => {
    if (!r.title.trim()) return toast.error("Title is required");
    if (!r.author.trim()) return toast.error("Author is required");
    onSave(status ? { ...r, status } : r);
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Modal Header */}
        <div className="relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
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
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 hover:bg-slate-50"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" /> AI News Assistant
              </button>
              <button
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 px-6 py-6">
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
              isEnterprisePlus={isEnterprisePlus}
            />
          )}
        </div>

        {/* Step Progression Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-500">
            Step {idx + 1} of {order.length} ·{" "}
            {isLast ? "Review & publish" : "Complete this step, then continue"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100"
            >
              Cancel
            </button>
            {!isFirst && (
              <button
                onClick={() => setTab(prevTab)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100"
              >
                Back
              </button>
            )}
            {!isLast && (
              <button
                onClick={() => setTab(nextTab)}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Next:{" "}
                {nextTab === "media"
                  ? "Media"
                  : nextTab === "seo"
                    ? "SEO & Social"
                    : "Settings"}
              </button>
            )}
            {isLast && (
              <>
                <button
                  onClick={() => handleSave("Draft")}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave("Published")}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Publish
                </button>
              </>
            )}
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
