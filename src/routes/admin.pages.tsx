import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save, ExternalLink, FileText, Search } from "lucide-react";
import {
  loadPages,
  savePages,
  getCustomPagesServer,
  saveCustomPageServer,
  type PageContent,
  loadSettings,
  saveSettings,
  getSiteSettingsServer,
  type SiteSettings,
} from "@/lib/site-content";
import { Card, Field } from "@/components/admin/settings/SettingsHelpers";
import SectionEditorItem, { htmlToNormalText } from "@/components/admin/pages/SectionEditorItem";
import { PagesSidebar } from "@/components/admin/pages/PagesSidebar";
import { EventPageSettingsCard } from "@/components/admin/pages/EventPageSettingsCard";
import { subscriptionFields, workWithUsFields } from "@/components/admin/pages/pageFields";
import { PageSeoForm } from "@/components/admin/pages/PageSeoForm";

export const Route = createFileRoute("/admin/pages")({
  component: PagesPage,
});

function PagesPage() {
  const [pages, setPages] = useState<PageContent[]>(() => loadPages());
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings());
  const [activeSlug, setActiveSlug] = useState<string>("about");
  const [editorTab, setEditorTab] = useState<"content" | "seo">("content");

  useEffect(() => {
    getCustomPagesServer()
      .then((p) => setPages(p))
      .catch(() => {});
    getSiteSettingsServer()
      .then((s) => {
        if (s) setSettings(s);
      })
      .catch(() => {});
  }, []);

  const active = useMemo(
    () => pages.find((p) => p.slug === activeSlug) ?? pages[0],
    [pages, activeSlug],
  );

  const update = <K extends keyof PageContent>(k: K, v: PageContent[K]) =>
    setPages((prev) => prev.map((p) => (p.slug === activeSlug ? { ...p, [k]: v } : p)));

  const updateSetting = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setSettings((prev) => ({ ...prev, [k]: v }));

  const onSave = async () => {
    if (activeSlug === "subscription" || activeSlug === "work-with-us" || activeSlug === "event") {
      await saveSettings(settings).catch(() => {});
      toast.success("Saved successfully");
    } else {
      savePages(pages);
      await saveCustomPageServer({ data: active }).catch(() => {});
      toast.success("Saved successfully");
    }
  };

  const isSubscription = activeSlug === "subscription";
  const isWorkWithUs = activeSlug === "work-with-us";
  const isEvent = activeSlug === "event";
  const isSettingsPage = isSubscription || isWorkWithUs || isEvent;

  const hasSeo = isSubscription
    ? Boolean(settings.subscriptionMetaTitle || settings.subscriptionMetaDescription || settings.subscriptionOgImage)
    : isWorkWithUs
      ? Boolean(settings.workWithUsMetaTitle || settings.workWithUsMetaDescription || settings.workWithUsOgImage)
      : isEvent
        ? Boolean(settings.eventMetaTitle || settings.eventMetaDescription || settings.eventOgImage)
        : Boolean(active?.metaTitle || active?.metaDescription || active?.ogImage);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System & Policy Pages</h1>
          <p className="text-sm text-slate-500">
            Edit the About, Contact, Terms, and footer policy pages.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar list */}
        <PagesSidebar
          pages={pages}
          activeSlug={activeSlug}
          onSelectSlug={(slug) => {
            setActiveSlug(slug);
          }}
        />

        {/* Editor Form */}
        <main className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isSubscription
                  ? "Subscription Settings"
                  : isWorkWithUs
                    ? "Work With Us Settings"
                    : isEvent
                      ? "Event Page Settings (শারদ সম্মান)"
                      : active?.title}
              </h2>
              <p className="text-xs text-slate-400">
                Slug: /{isSettingsPage ? activeSlug : active?.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`/${isSettingsPage ? activeSlug : active?.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Live Page <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={onSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Sub-tabs: Page Content vs SEO & Social */}
          <div className="flex border-b border-slate-200 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setEditorTab("content")}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                editorTab === "content"
                  ? "border-slate-900 text-slate-900 bg-slate-50/50 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              <FileText className="h-4 w-4" /> Page Content
            </button>
            <button
              type="button"
              onClick={() => setEditorTab("seo")}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
                editorTab === "seo"
                  ? "border-slate-900 text-slate-900 bg-slate-50/50 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              <Search className="h-4 w-4" /> SEO & Social Share
              {hasSeo ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Custom SEO Active
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  Default SEO
                </span>
              )}
            </button>
          </div>

          {editorTab === "seo" ? (
            isSubscription ? (
              <PageSeoForm
                pageTitle={settings.subscriptionTitle || "Subscription"}
                pageIntro={settings.subscriptionIntro || ""}
                pageContent={settings.subscriptionFeatures || settings.subscriptionIntro || ""}
                pageSlug="subscription"
                seo={{
                  metaTitle: settings.subscriptionMetaTitle,
                  metaDescription: settings.subscriptionMetaDescription,
                  ogImage: settings.subscriptionOgImage,
                  metaKeywords: settings.subscriptionKeywords,
                  canonicalUrl: settings.subscriptionCanonicalUrl,
                  noIndex: settings.subscriptionNoIndex,
                }}
                onChange={(k, v) => {
                  const map = {
                    metaTitle: "subscriptionMetaTitle",
                    metaDescription: "subscriptionMetaDescription",
                    ogImage: "subscriptionOgImage",
                    metaKeywords: "subscriptionKeywords",
                    canonicalUrl: "subscriptionCanonicalUrl",
                    noIndex: "subscriptionNoIndex",
                  } as const;
                  updateSetting(map[k] as any, v);
                }}
                siteName={settings.siteName || "News Theme"}
              />
            ) : isWorkWithUs ? (
              <PageSeoForm
                pageTitle={settings.workWithUsHeroTitle || "Work With Us"}
                pageIntro={settings.workWithUsHeroIntro || ""}
                pageContent={[
                  settings.workWithUsHeroIntro,
                  settings.workWithUsRules,
                  settings.workWithUsTiers,
                  settings.workWithUsFaqs,
                ]
                  .filter(Boolean)
                  .join("\n\n")}
                pageSlug="work-with-us"
                seo={{
                  metaTitle: settings.workWithUsMetaTitle,
                  metaDescription: settings.workWithUsMetaDescription,
                  ogImage: settings.workWithUsOgImage,
                  metaKeywords: settings.workWithUsKeywords,
                  canonicalUrl: settings.workWithUsCanonicalUrl,
                  noIndex: settings.workWithUsNoIndex,
                }}
                onChange={(k, v) => {
                  const map = {
                    metaTitle: "workWithUsMetaTitle",
                    metaDescription: "workWithUsMetaDescription",
                    ogImage: "workWithUsOgImage",
                    metaKeywords: "workWithUsKeywords",
                    canonicalUrl: "workWithUsCanonicalUrl",
                    noIndex: "workWithUsNoIndex",
                  } as const;
                  updateSetting(map[k] as any, v);
                }}
                siteName={settings.siteName || "News Theme"}
              />
            ) : isEvent ? (
              <PageSeoForm
                pageTitle={settings.eventTitle || "Sharad Samman Event"}
                pageIntro={settings.eventSubtitle || settings.eventDescription || ""}
                pageContent={[
                  settings.eventSubtitle,
                  settings.eventDescription,
                  settings.eventPrizes,
                  settings.eventCriteria,
                  settings.eventGuidelinesText,
                ]
                  .filter(Boolean)
                  .join("\n\n")}
                pageSlug="event"
                seo={{
                  metaTitle: settings.eventMetaTitle,
                  metaDescription: settings.eventMetaDescription,
                  ogImage: settings.eventOgImage || settings.eventImageUrl,
                  metaKeywords: settings.eventKeywords,
                  canonicalUrl: settings.eventCanonicalUrl,
                  noIndex: settings.eventNoIndex,
                }}
                onChange={(k, v) => {
                  const map = {
                    metaTitle: "eventMetaTitle",
                    metaDescription: "eventMetaDescription",
                    ogImage: "eventOgImage",
                    metaKeywords: "eventKeywords",
                    canonicalUrl: "eventCanonicalUrl",
                    noIndex: "eventNoIndex",
                  } as const;
                  updateSetting(map[k] as any, v);
                }}
                siteName={settings.siteName || "News Theme"}
              />
            ) : (
              <PageSeoForm
                pageTitle={active?.title || "Page"}
                pageIntro={active?.intro || ""}
                pageContent={
                  active?.sections && active.sections.length > 0
                    ? active.sections
                        .map((s) => `${s.heading}:\n${htmlToNormalText(s.body)}`)
                        .join("\n\n")
                    : htmlToNormalText(active?.body || "")
                }
                pageSlug={activeSlug}
                seo={{
                  metaTitle: active?.metaTitle,
                  metaDescription: active?.metaDescription,
                  ogImage: active?.ogImage,
                  metaKeywords: active?.metaKeywords,
                  canonicalUrl: active?.canonicalUrl,
                  noIndex: active?.noIndex,
                }}
                onChange={(k, v) => update(k as any, v as any)}
                siteName={settings.siteName || "News Theme"}
              />
            )
          ) : (
            <>

          {isEvent ? (
            <EventPageSettingsCard
              settings={settings}
              updateSetting={updateSetting}
            />
          ) : isSubscription ? (
            <Card
              title="Subscription Setup"
              subtitle="Configure the /subscription page content and pricing."
            >
              {subscriptionFields.map((f) => (
                <Field key={f.key} f={f} s={settings} update={updateSetting} />
              ))}
            </Card>
          ) : isWorkWithUs ? (
            <Card
              title="Work With Us Setup"
              subtitle="Configure the content on the /work-with-us page."
            >
              {workWithUsFields.map((f) => (
                <Field key={f.key} f={f} s={settings} update={updateSetting} />
              ))}
            </Card>
          ) : active ? (
            <div className="space-y-8">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Page Subtitle / Intro
                </label>
                <input
                  type="text"
                  value={active.intro || ""}
                  onChange={(e) => update("intro", e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>

              {activeSlug === "contact" ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <strong>Note:</strong> The Contact Us page relies on a hardcoded layout with a
                  contact form. Only the subtitle/intro above can be updated here.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="block text-sm font-bold text-slate-800">Page Sections</label>
                    <button
                      onClick={() => {
                        const newSections = [
                          ...(active.sections || []),
                          { heading: "New Section", body: "" },
                        ];
                        update("sections", newSections);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      + Add Section
                    </button>
                  </div>

                  {(active.sections || []).length === 0 && (
                    <div className="text-sm text-slate-500 italic">
                      No sections added. Click "+ Add Section" to add content.
                    </div>
                  )}

                  {(active.sections || []).map((sec, idx) => (
                    <SectionEditorItem
                      key={idx}
                      sec={sec}
                      idx={idx}
                      activeSections={active.sections || []}
                      update={update}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
