import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save, FileText, ExternalLink, ShieldCheck, Crown, Sparkles, Loader2 } from "lucide-react";
import {
  loadPages,
  savePages,
  getCustomPagesServer,
  saveCustomPageServer,
  type PageContent,
  loadSettings,
  saveSiteSettingsServer,
  type SiteSettings,
} from "@/lib/site-content";
import { Card, Field, type FieldDef } from "@/components/admin/settings/SettingsHelpers";
import SectionEditorItem from "@/components/admin/pages/SectionEditorItem";

export const Route = createFileRoute("/admin/pages")({
  component: PagesPage,
});

const subscriptionFields: FieldDef[] = [
  { key: "subscriptionTitle", label: "Subscription Page Title" },
  { key: "subscriptionIntro", label: "Subscription Intro Text", textarea: true },
  { key: "subscriptionPriceINRMonthly", label: "INR Monthly Price (₹)" },
  { key: "subscriptionPriceINRYearly", label: "INR Yearly Price (₹)" },
  { key: "subscriptionPriceUSDMonthly", label: "USD Monthly Price ($)" },
  { key: "subscriptionPriceUSDYearly", label: "USD Yearly Price ($)" },
  {
    key: "subscriptionFeatures",
    label: "Subscription Features",
    textarea: true,
    hint: "One feature per line",
  },
];

const workWithUsFields: FieldDef[] = [
  {
    key: "workWithUsHeroTitle",
    label: "Hero Title",
    textarea: true,
    hint: "Use newlines for breaks",
  },
  { key: "workWithUsHeroIntro", label: "Hero Intro text", textarea: true },
  { key: "workWithUsIdCardReq", label: "ID Card Requirement Text", textarea: true },
  {
    key: "workWithUsRules",
    label: "Journalist Rules",
    textarea: true,
    hint: "Format: 'Bold Prefix: Description'",
  },
  {
    key: "workWithUsGamification",
    label: "Gamification Cards",
    textarea: true,
    hint: "Format: 'Title: Description' per line",
  },
  {
    key: "workWithUsBadges",
    label: "Badge Benefits",
    textarea: true,
    hint: "Format: 'Rank: Benefit 1 | Benefit 2 | Benefit 3' per line",
  },
  {
    key: "workWithUsTiers",
    label: "Career Tiers",
    textarea: true,
    hint: "Format: 'Tier Name (Requirement): Description' per line",
  },
  {
    key: "workWithUsFaqs",
    label: "FAQs",
    textarea: true,
    hint: "Format: 'Question: Answer' per line",
  },
];

const eventFields: FieldDef[] = [
  {
    key: "eventGreeting",
    label: "Top Greeting Badge (শীর্ষ সম্ভাষণ)",
    hint: "যেমন: ॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥",
  },
  { key: "eventTitle", label: "Event Title (ইভেন্টের মূল শিরোনাম)" },
  { key: "eventSubtitle", label: "Event Subtitle (উপশিরোনাম)" },
  { key: "eventDescription", label: "Event Description (বিস্তারিত বিবরণ)", textarea: true },
  { key: "eventDate", label: "Event Schedule / Date (তারিখ ও সময়কাল)" },
  { key: "eventLocation", label: "Event Location (স্থান / অঞ্চল)" },
  {
    key: "eventImageUrl",
    label: "Event Banner / Artwork Image URL (ইভেন্ট ছবি বা ব্যানারের লিঙ্ক)",
    hint: "ইভেন্টের ব্যানার বা ছবির URL প্রদান করুন (যেমন: /durga-face.png)। এটি পেজের শীর্ষে সুন্দরভাবে প্রদর্শিত হবে।",
  },
  {
    key: "eventSection1Divider",
    label: "Highlights Section Divider Text (প্রথম ডিভাইডার লেখা)",
    hint: "যেমন: ॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥",
  },
  {
    key: "eventPrizesTitle",
    label: "Column 1: Prizes Title (পুরস্কার সেকশন শিরোনাম)",
    hint: "যেমন: পুরস্কার ও সম্মাননা",
  },
  {
    key: "eventPrizes",
    label: "Column 1: Prizes List (পুরস্কার ও সম্মাননা তালিকা)",
    textarea: true,
    hint: "Format: One prize or category per line (প্রতি লাইনে একটি করে পুরস্কার)",
  },
  {
    key: "eventCriteriaTitle",
    label: "Column 2: Criteria Title (মূল্যায়ন সেকশন শিরোনাম)",
    hint: "যেমন: মূল্যায়নের মূল ভিত্তি",
  },
  {
    key: "eventCriteria",
    label: "Column 2: Criteria List (মূল্যায়নের ভিত্তি তালিকা)",
    textarea: true,
    hint: "Format: One criterion per line (প্রতি লাইনে একটি করে মূল্যায়নের পয়েন্ট)",
  },
  {
    key: "eventGuidelinesTitle",
    label: "Column 3: Guidelines Title (নির্দেশিকা শিরোনাম)",
    hint: "যেমন: অংশগ্রহণকারী নির্দেশিকা",
  },
  {
    key: "eventGuidelinesText",
    label: "Column 3: Guidelines Text (নির্দেশিকা বিস্তারিত বিবরণ)",
    textarea: true,
    hint: "অংশগ্রহণকারী ক্লাব বা পূজা কমিটির জন্য নিয়মাবলী বা বার্তা",
  },
  {
    key: "eventGuidelinesBadge",
    label: "Column 3: Highlight Badge (বিশেষ নোট বা ব্যাজ)",
    hint: "যেমন: অংশগ্রহণ সম্পূর্ণ বিনামূল্যে",
  },
  {
    key: "eventSection2Divider",
    label: "Registration Section Divider Text (দ্বিতীয় ডিভাইডার লেখা)",
    hint: "যেমন: ॥ শারদ সম্মান আবেদন পত্র ॥",
  },
  {
    key: "eventFormTitle",
    label: "Registration Form Title (নিবন্ধন ফর্মের শিরোনাম)",
    hint: "যেমন: ইভেন্ট নিবন্ধন ফরম (Event Registration)",
  },
  {
    key: "eventFormSubtitle",
    label: "Registration Form Subtitle (ফর্মের উপশিরোনাম)",
    hint: "যেমন: শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন",
  },
  {
    key: "eventCustomInputLabel",
    label: "Custom Registration Field Label (কাস্টম ইনপুট লেবেল)",
    hint: "ফর্মের অতিরিক্ত ইনপুট ফিল্ডের নাম (যেমন: ক্লাবের নাম / Club Name)",
  },
  {
    key: "eventButtonText",
    label: "Registration Button Text (নিবন্ধন বাটনের নাম)",
    hint: "যেমন: নিবন্ধন করুন / Join Event / Register",
  },
];

function PagesPage() {
  const [pages, setPages] = useState<PageContent[]>(() => loadPages());
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings());
  const [activeSlug, setActiveSlug] = useState<string>("about");

  useEffect(() => {
    getCustomPagesServer()
      .then((p) => setPages(p))
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
      await saveSiteSettingsServer({ data: settings }).catch(() => {});
      toast.success(
        `${activeSlug === "subscription" ? "Subscription" : activeSlug === "work-with-us" ? "Work With Us" : "Event"} settings saved!`,
      );
    } else {
      savePages(pages);
      await saveCustomPageServer({ data: active }).catch(() => {});
      toast.success(`"${active?.title || activeSlug}" saved to MySQL!`);
    }
  };

  const isSubscription = activeSlug === "subscription";
  const isWorkWithUs = activeSlug === "work-with-us";
  const isEvent = activeSlug === "event";
  const isSettingsPage = isSubscription || isWorkWithUs || isEvent;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System & Policy Pages</h1>
          <p className="text-sm text-slate-500">
            Edit the About, Contact, Terms, and footer policy pages saved centrally in MySQL.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> MySQL Page Storage Active
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar list */}
        <aside className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <ul className="space-y-1">
            {pages.map((p) => {
              const isActive = p.slug === activeSlug;
              return (
                <li key={p.slug}>
                  <button
                    onClick={() => setActiveSlug(p.slug)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{p.title}</span>
                  </button>
                </li>
              );
            })}

            <li className="my-2 border-t border-slate-100"></li>

            <li>
              <button
                onClick={() => setActiveSlug("subscription")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  isSubscription
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Crown className="h-4 w-4 shrink-0" />
                <span className="truncate">Subscription Settings</span>
              </button>
            </li>
            <li className="mt-1">
              <button
                onClick={() => setActiveSlug("work-with-us")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  isWorkWithUs
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Crown className="h-4 w-4 shrink-0" />
                <span className="truncate">Work With Us Settings</span>
              </button>
            </li>
            <li className="mt-1">
              <button
                onClick={() => setActiveSlug("event")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  isEvent
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="truncate">Event Page Settings</span>
              </button>
            </li>
          </ul>
        </aside>

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
                <Save className="h-4 w-4" /> Save Page
              </button>
            </div>
          </div>

          {isEvent ? (
            <Card
              title="Event Page Setup (শারদ সম্মান)"
              subtitle="Configure the event details, custom registration form, button names, and Durga Puja theme options."
            >
              {eventFields.map((f) => (
                <Field key={f.key} f={f} s={settings} update={updateSetting} />
              ))}

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.eventButtonEnabled !== false}
                    onChange={(e) => updateSetting("eventButtonEnabled", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Show Join / Register Button</span>
                    <span className="text-[11px] text-slate-500 block">When checked, the Join/Register button is visible on the event page</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.eventFormEnabled !== false}
                    onChange={(e) => updateSetting("eventFormEnabled", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Enable Registration Form</span>
                    <span className="text-[11px] text-slate-500 block">When unchecked, the form is closed and users will see that registration is closed</span>
                  </div>
                </label>
              </div>
            </Card>
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
        </main>
      </div>
    </div>
  );
}
