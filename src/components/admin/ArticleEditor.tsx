import { useEffect, useRef, useState } from "react";
import {
  Pencil, Trash2, Plus, Search, Eye, X, Image as ImageIcon, Upload,
  Bold, Italic, Underline, List, ListOrdered, Link2, Quote, Heading2, Heading3,
  FileText, Settings as SettingsIcon, Share2, Pilcrow, Type, Palette,
  Youtube, Facebook, Video, AlignLeft, AlignCenter, AlignRight, Code2, Minus,
  MapPin, Link as LinkIcon, Sparkles, BadgeCheck, UserCheck, Loader2, Wallet, Coins,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { sections, slugify } from "@/lib/news-data";
import { searchJournalists, awardJournalistPoints, type JournalistSearchResult } from "@/lib/journalist.functions";
import { toast } from "sonner";
import { getTags } from "@/lib/taxonomy.functions";
import { generateArticleContentServer } from "@/lib/ai.functions";
import { MediaField } from "@/components/admin/MediaField";
import RichEditor from "@/components/admin/articles/RichEditor";
import { ImageInput, Field, JournalistPicker, AwardPointsBox } from "@/components/admin/articles/ArticleSubComponents";

export type Row = {
  id: number;
  title: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  country: string;
  author: string;
  views: number;
  status: "Published" | "Draft" | "Review";
  date: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  featured: boolean;
  newsType: "Standard" | "Breaking" | "Featured" | "Exclusive" | "Opinion" | "Video";
  journalistId: string;
  journalistName: string;
  access_level: "Free" | "Premium";
};

export const statusStyle: Record<Row["status"], string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
};

const getDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.host;
  }
  return "northeasttimeline.com";
};

const fullUrl = (r: Row) => {
  const domain = getDomain();
  const title = r.slug || slugify(r.title) || "news-title";
  return [domain, "news", title].filter(Boolean).join("/");
};

const formatDateTimeLocal = (dateVal: any): string => {
  if (!dateVal) return "";
  try {
    const d = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    if (d instanceof Date && !isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    if (typeof dateVal === "string") {
      return dateVal.slice(0, 16).replace(" ", "T");
    }
  } catch (e) {
    console.error("formatDateTimeLocal error:", e);
  }
  return "";
};

type Tab = "content" | "media" | "seo" | "settings";

export default function ArticleEditor({ initial, onClose, onSave }: { initial: Row; onClose: () => void; onSave: (r: Row) => void }) {
  // Normalize initial data to handle null database values
  const normalizedInitial = {
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
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiStyle, setAiStyle] = useState("Normal");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiData, setGeneratedAiData] = useState<any>(null);

  const handleGenerateAi = async () => {
    if (!aiInstructions.trim()) {
      toast.error("Please enter news instructions.");
      return;
    }
    setIsGeneratingAi(true);
    setGeneratedAiData(null);
    try {
      const tags = await getTags();
      const tagNames = tags.map(t => t.name);
      const res = await generateArticleContentServer({
        data: {
          instructions: aiInstructions,
          style: aiStyle,
          availableTags: tagNames
        }
      });
      setGeneratedAiData(res);
      toast.success("Content generated! Please review.");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI content.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAi = () => {
    if (!generatedAiData) return;
    setR(prev => ({
      ...prev,
      content: generatedAiData.body || prev.content,
      excerpt: generatedAiData.excerpt || prev.excerpt,
      city: generatedAiData.location?.city || prev.city,
      state: generatedAiData.location?.state || prev.state,
      country: generatedAiData.location?.country || prev.country,
      metaTitle: generatedAiData.metaTitle || prev.metaTitle,
      metaDescription: generatedAiData.metaDescription || prev.metaDescription,
      tags: Array.isArray(generatedAiData.tags) && generatedAiData.tags.length > 0 ? generatedAiData.tags.join(",") : prev.tags
    }));
    setShowAiModal(false);
    toast.success("AI Content applied successfully!");
  };
  const set = <K extends keyof Row>(k: K, v: Row[K]) => setR((p) => ({ ...p, [k]: v }));

  const handleSave = (status?: Row["status"]) => {
    if (!r.title.trim()) return toast.error("Title is required");
    if (!r.author.trim()) return toast.error("Author is required");
    onSave(status ? { ...r, status } : r);
  };

  const url = fullUrl(r);
  const getProtocol = () => typeof window !== "undefined" ? window.location.protocol : "http:";
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

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" /> {initial.title ? "Edit" : "New"}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyle[r.status]}`}>{r.status}</span>
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-slate-900">{r.title || "Untitled article"}</h2>
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
                <button onClick={copyUrl} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 hover:bg-slate-50">Copy</button>
              </div>
            </div>
                          <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI News Assistant
                </button>
                <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
              </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${active ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}>
                  <Icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 px-6 py-6">
          {tab === "content" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Field label="Title *">
                  <input value={r.title} onChange={(e) => { set("title", e.target.value); if (!initial.title) set("slug", slugify(e.target.value)); }}
                    placeholder="Enter article headline..." className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-slate-900 focus:outline-none" />
                </Field>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Category">
                    <select value={r.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none">
                      {sections.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Title slug (URL last segment)">
                    <input value={r.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="auto from title"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm focus:border-slate-900 focus:outline-none" />
                  </Field>
                </div>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <MapPin className="h-3.5 w-3.5" /> Location <span className="font-normal normal-case text-slate-400">— builds the URL's location segment</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <input value={r.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                    <input value={r.state} onChange={(e) => set("state", e.target.value)} placeholder="State" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                    <input value={r.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                  </div>
                </div>
                <div className="mt-4">
                  <Field label="Excerpt / Summary">
                    <textarea value={r.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2}
                      placeholder="Short summary shown in news grid (1-2 lines)..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                    <span className="mt-1 block text-xs text-slate-400">{r.excerpt.length} / 200</span>
                  </Field>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Article Body</span>
                  <span className="text-[11px] text-slate-400">Use the toolbar to format, embed and upload</span>
                </div>
                <RichEditor value={r.content} onChange={(v) => set("content", v)} />
              </div>
            </div>
          )}

          {tab === "media" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Field label="Featured Image">
                  <ImageInput value={r.featuredImage} onChange={(v) => set("featuredImage", v)} hint="Used as the hero image and default Open Graph image." />
                </Field>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Field label={`Open Graph Image ${r.ogImage ? "" : "(defaults to Featured Image)"}`}>
                  <ImageInput value={r.ogImage} onChange={(v) => set("ogImage", v)} hint="Override only if you want a different image when shared on social media. Recommended 1200×630." />
                </Field>
              </div>
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <Field label="Meta Title">
                  <input value={r.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder={r.title || "Defaults to article title"} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                  <span className="mt-1 block text-xs text-slate-400">{r.metaTitle.length} / 60 chars recommended</span>
                </Field>
                <Field label="Meta Description">
                  <textarea value={r.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} placeholder="Search engine description (~155 chars)..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                  <span className="mt-1 block text-xs text-slate-400">{r.metaDescription.length} / 160 chars recommended</span>
                </Field>
                <Field label="Tags (comma separated)">
                  <input value={r.tags} onChange={(e) => set("tags", e.target.value)} placeholder="markets, fed, inflation" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
                </Field>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search preview</p>
                <p className="mt-2 truncate text-base text-blue-700">{r.metaTitle || r.title || "Article title"}</p>
                <p className="truncate text-xs text-emerald-700">{url}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.metaDescription || r.excerpt || "Article description preview..."}</p>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="News Type">
                  <select value={r.newsType} onChange={(e) => set("newsType", e.target.value as Row["newsType"])} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>Standard</option><option>Breaking</option><option>Featured</option><option>Exclusive</option><option>Opinion</option><option>Video</option>
                  </select>
                </Field>
                <Field label="Author *">
                  <input value={r.author} onChange={(e) => set("author", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                </Field>
                <Field label="Status">
                  <select value={r.status} onChange={(e) => set("status", e.target.value as Row["status"])} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>Published</option><option>Draft</option><option>Review</option>
                  </select>
                </Field>
                <Field label="Access Level">
                  <select value={r.access_level} onChange={(e) => set("access_level", e.target.value as Row["access_level"])} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option value="Free">Free (All users)</option>
                    <option value="Premium">Premium (Admin / Editor / Author only)</option>
                  </select>
                </Field>
                <Field label="Publish Date">
                  <input type="datetime-local" value={formatDateTimeLocal(r.date)} onChange={(e) => set("date", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                </Field>
                <Field label="Post Views">
                  <input type="number" min={0} value={r.views} onChange={(e) => set("views", Number(e.target.value) || 0)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                </Field>
                <Field label="Featured on homepage">
                  <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm">
                    <input type="checkbox" checked={r.featured} onChange={(e) => set("featured", e.target.checked)} />
                    Pin to hero / featured slot
                  </label>
                </Field>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <JournalistPicker
                  journalistId={r.journalistId}
                  journalistName={r.journalistName}
                  onSelect={(j) => {
                    set("journalistId", j?.publicUserId ?? "");
                    set("journalistName", j?.displayName ?? "");
                    if (j?.displayName) set("author", j.displayName);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-6 py-3">
          {(() => {
            const order: Tab[] = ["content", "media", "seo", "settings"];
            const idx = order.indexOf(tab);
            const isLast = tab === "settings";
            const isFirst = idx === 0;
            const prevTab = order[idx - 1];
            const nextTab = order[idx + 1];
            return (
              <>
                <p className="text-xs text-slate-500">Step {idx + 1} of {order.length} · {isLast ? "Review & publish" : "Complete this step, then continue"}</p>
                <div className="flex gap-2">
                  <button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100">Cancel</button>
                  {!isFirst && <button onClick={() => setTab(prevTab)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100">Back</button>}
                  {!isLast && <button onClick={() => setTab(nextTab)} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Next: {nextTab === "media" ? "Media" : nextTab === "seo" ? "SEO & Social" : "Settings"}</button>}
                  {isLast && (
                    <>
                      <button onClick={() => handleSave("Draft")} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100">Save as Draft</button>
                      <button onClick={() => handleSave("Published")} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Publish</button>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                <Sparkles className="h-5 w-5 text-indigo-600" /> AI News Assistant
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2">
                &times;
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">News Info / Instructions</label>
                    <p className="mb-2 text-xs text-slate-500">Provide the facts. The AI will write the article using the 5 Ws and H rule.</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Writing Style</label>
                    <select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Business">Business</option>
                      <option value="Friendly">Friendly</option>
                    </select>
                  </div>
                </div>
                <textarea
                  placeholder="e.g. A new tech park opened in Agartala today. The IT minister inaugurated it. It will create 5000 jobs..."
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none mb-3"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGeneratingAi ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Article...</> : "Generate Article"}
                  </button>
                </div>
              </div>

              {generatedAiData && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-3">Generated Preview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500">Meta Title</label>
                      <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">{generatedAiData.metaTitle}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500">Location</label>
                      <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">
                        {[generatedAiData.location?.city, generatedAiData.location?.state, generatedAiData.location?.country].filter(Boolean).join(", ") || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500">Excerpt</label>
                    <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">{generatedAiData.excerpt}</div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500">Tags Selected</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedAiData.tags?.map((t: string) => <span key={t} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Body Preview (HTML)</label>
                    <div className="h-40 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono whitespace-pre-wrap">
                      {generatedAiData.body}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAi}
                disabled={!generatedAiData}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Apply to Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
