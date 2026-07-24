import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Save,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  KeyRound,
  Image as ImageIcon,
  GitBranch,
  Lock,
  Zap,
  Link2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Plus,
  Search,
  Sparkles,
  Type,
} from "lucide-react";
import {
  loadSettings,
  saveSettings,
  getRedirectRulesServer,
  saveRedirectRulesServer,
  scanBrokenLinksServer,
  fixBrokenLinkServer,
  type SiteSettings,
  type RedirectRule,
  type BrokenLinkItem
} from "@/lib/site-content";
import { type MediaUsage } from "@/lib/media-library";
import { MediaField } from "@/components/admin/MediaField";
import React, { Suspense, lazy } from "react";
import {
  Card,
  Field,
  IntegrationField,
  type FieldDef,
  Toggle,
  GuideList,
  A,
  LogoUploader,
} from "@/components/admin/settings/SettingsHelpers";

const GeneralSettingsForm = lazy(() => import("@/components/admin/settings/GeneralSettingsForm").then(m => ({ default: m.GeneralSettingsForm })));
const ProtectionSettingsForm = lazy(() => import("@/components/admin/settings/ProtectionSettingsForm").then(m => ({ default: m.ProtectionSettingsForm })));
const FestiveSettingsForm = lazy(() => import("@/components/admin/settings/FestiveSettingsForm").then(m => ({ default: m.FestiveSettingsForm })));
const FontSettingsTab = lazy(() => import("@/components/admin/settings/FontSettingsTab").then(m => ({ default: m.FontSettingsTab })));
const RedirectsAndLinksTab = lazy(() => import("@/components/admin/settings/RedirectsAndLinksTab"));
const IntegrationsTab = lazy(() => import("@/components/admin/settings/IntegrationsTab").then(m => ({ default: m.IntegrationsTab })));

type SettingsSearch = {
  tab?: "general" | "festive" | "fonts" | "integrations" | "verification" | "auth" | "protection" | "speed" | "links";
};

export const Route = createFileRoute("/admin/settings")({
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      tab: (search.tab as SettingsSearch["tab"]) || "general",
    };
  },
  component: SettingsPage,
});

type FieldDef = {
  key: keyof SiteSettings;
  label: string;
  hint?: string;
  textarea?: boolean;
  placeholder?: string;
};

function SettingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [s, setS] = useState<SiteSettings>(() => loadSettings());
  const [tab, setTab] = useState<"general" | "festive" | "fonts" | "integrations" | "verification" | "auth" | "protection" | "speed" | "links">(
    search.tab || "general"
  );

  useEffect(() => {
    if (search.tab && search.tab !== tab) {
      setTab(search.tab);
    }
  }, [search.tab]);

  const update = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    try {
      await saveSettings(s);
      toast.success("Site settings saved");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save settings.");
    }
  };

  const generalGroups: { title: string; fields: FieldDef[] }[] = [
    {
      title: "Brand",
      fields: [
        { key: "siteName", label: "Site name" },
        { key: "logoText", label: "Logo text" },
        { key: "tagline", label: "Tagline" },
        { key: "metaDescription", label: "Meta description", textarea: true },
      ],
    },
    {
      title: "Contact",
      fields: [
        { key: "contactEmail", label: "Contact email" },
        { key: "contactPhone", label: "Contact phone" },
        { key: "address", label: "Address", textarea: true },
      ],
    },
    {
      title: "Social Links",
      fields: [
        { key: "facebook", label: "Facebook URL" },
        { key: "instagram", label: "Instagram URL" },
        { key: "twitter", label: "Twitter / X URL" },
        { key: "pinterest", label: "Pinterest URL" },
        { key: "tiktok", label: "TikTok URL" },
        { key: "linkedin", label: "LinkedIn URL" },
        { key: "youtube", label: "YouTube URL" },
        { key: "whatsapp", label: "WhatsApp URL" },
        { key: "telegram", label: "Telegram URL" },
      ],
    },
    {
      title: "Footer",
      fields: [
        { key: "footerNote", label: "Footer note", textarea: true },
        { key: "copyright", label: "Copyright line", placeholder: "© 2026 Your Company. All rights reserved." },
        { key: "builtByText", label: "Built-by / Digital partner text", placeholder: "Website built and digital partner: Gorilla Tech Solution" },
        { key: "builtByUrl", label: "Built-by / Digital partner URL", placeholder: "https://GorillaTechsolution.com" },
      ],
    },
  ];

  const tabs = [
    { id: "general", label: "General", icon: Save },
    { id: "festive", label: "Festive", icon: Sparkles },

    { id: "fonts", label: "Fonts", icon: Type },
    { id: "integrations", label: "Integrations", icon: BarChart3 },
    { id: "protection", label: "Protection & Anti-Theft", icon: Lock },
    { id: "speed", label: "Speed Up", icon: Zap },
    { id: "links", label: "Redirects & Links", icon: Link2 },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-sm text-slate-500">
            Brand, contact, analytics, verification and login providers.
          </p>
        </div>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>

      <div className="flex flex-wrap gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      <Suspense fallback={<div className="p-8 text-center text-slate-500 animate-pulse">Loading settings...</div>}>
        {tab === "general" && <GeneralSettingsForm />}
        {tab === "festive" && <FestiveSettingsForm />}


        {tab === "fonts" && <FontSettingsTab />}

        {tab === "integrations" && <IntegrationsTab s={s} update={update} />}

        {tab === "protection" && <ProtectionSettingsForm s={s} update={update} />}
        {tab === "links" && <RedirectsAndLinksTab />}

      {tab === "speed" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Website Speed Up Options"
            subtitle="Enable advanced optimization options to boost your website loading time and improve Google PageSpeed scores."
          >
            <Toggle
              label="Clean Unused CSS (PurgeCSS)"
              checked={s.cleanUnusedCss}
              onChange={(v) => update("cleanUnusedCss", v)}
              hint="Extract and remove unused CSS selectors from the loaded stylesheets. Helps reduce stylesheet weight by up to 70%."
            />

            <Toggle
              label="Minify JavaScript Files"
              checked={s.minifyJs}
              onChange={(v) => update("minifyJs", v)}
              hint="Compress, mangle, and bundle scripts automatically before outputting. Reduces JS bundle sizes by up to 60%."
            />

            <Toggle
              label="Server-Side Cache (HTML / MySQL Caching)"
              checked={s.serverCacheEnabled}
              onChange={(v) => update("serverCacheEnabled", v)}
              hint="Cache static page outputs and MySQL query results in server memory. Bypasses database queries for consecutive visits."
            />

            <Toggle
              label="Pre-render Pages (Static Site Generation)"
              checked={s.preRenderEnabled}
              onChange={(v) => update("preRenderEnabled", v)}
              hint="Pre-generate static HTML files for top articles and category pages. Delivers instant load times under high traffic spikes."
            />
          </Card>

          <Card
            title="Daily Optimization Schedule"
            subtitle="Automate background speed optimizations. The website will run compilation, CSS purging, and cache pre-heating daily."
          >
            <Toggle
              label="Enable Daily Scheduled Optimization"
              checked={s.optimizationScheduleEnabled}
              onChange={(v) => update("optimizationScheduleEnabled", v)}
              hint="Execute optimization routines automatically at the configured time every day."
            />

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Daily Execution Time (24h format)</label>
              <input
                type="time"
                value={s.optimizationScheduleTime || "02:00"}
                onChange={(e) => update("optimizationScheduleTime", e.target.value)}
                disabled={!s.optimizationScheduleEnabled}
                className="w-full max-w-[200px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Choose a time of low website traffic (e.g., 2:00 AM) to prevent transient performance impacts.
              </p>
            </div>
            
            <div className="rounded-md border border-slate-100 bg-slate-50/50 p-3">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Scheduled Operations</h3>
              <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                <li>Purge unused CSS templates</li>
                <li>Clear expired cache entries and index database entries</li>
                <li>Pre-generate HTML templates for the top 50 articles</li>
                <li>Verify file system health and clear temporary media chunks</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
      </Suspense>
    </div>
  );
}
