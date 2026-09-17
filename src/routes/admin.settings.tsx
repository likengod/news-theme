import { useEffect, useState, Suspense, lazy } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Save,
  ShieldCheck,
  BarChart3,
  DatabaseBackup,
  Lock,
  Zap,
  Link2,
  Sparkles,
  Type,
  Globe,
} from "lucide-react";
import {
  loadSettings,
  saveSettings,
  type SiteSettings,
} from "@/lib/site-content";

import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";

// Lazy-load other tabs so initial page visit is instant
const SeoSettingsTab = lazy(() => import("@/components/admin/settings/SeoSettingsTab"));
const ProtectionSettingsForm = lazy(() =>
  import("@/components/admin/settings/ProtectionSettingsForm").then((m) => ({
    default: m.ProtectionSettingsForm,
  })),
);
const FestiveSettingsForm = lazy(() =>
  import("@/components/admin/settings/FestiveSettingsForm").then((m) => ({
    default: m.FestiveSettingsForm,
  })),
);
const FontSettingsTab = lazy(() =>
  import("@/components/admin/settings/FontSettingsTab").then((m) => ({
    default: m.FontSettingsTab,
  })),
);
const RedirectsAndLinksTab = lazy(() => import("@/components/admin/settings/RedirectsAndLinksTab"));
const IntegrationsTab = lazy(() =>
  import("@/components/admin/settings/IntegrationsTab").then((m) => ({
    default: m.IntegrationsTab,
  })),
);
const ActivateWebsiteTab = lazy(() =>
  import("@/components/admin/settings/ActivateWebsiteTab").then((m) => ({
    default: m.ActivateWebsiteTab,
  })),
);
const BackupRestoreTab = lazy(() =>
  import("@/components/admin/settings/BackupRestoreTab").then((m) => ({
    default: m.BackupRestoreTab,
  })),
);
const SpeedOptimizationTab = lazy(() =>
  import("@/components/admin/settings/SpeedOptimizationTab").then((m) => ({
    default: m.SpeedOptimizationTab,
  })),
);

type SettingsSearch = {
  tab?:
    | "general"
    | "seo"
    | "festive"
    | "fonts"
    | "integrations"
    | "verification"
    | "auth"
    | "protection"
    | "speed"
    | "links"
    | "activate"
    | "backup";
};

export const Route = createFileRoute("/admin/settings")({
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      tab: (search.tab as SettingsSearch["tab"]) || "general",
    };
  },
  head: () => ({
    meta: [
      { title: "Site Settings - Admin Dashboard" },
      { name: "description", content: "Manage site branding, SEO, analytics, and integrations." },
    ],
  }),
  component: SettingsPage,
});

function SettingsTabSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-10 bg-slate-100 rounded" />
        <div className="h-24 sm:col-span-2 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(() => loadSettings());
  const [tab, setTab] = useState<
    | "general"
    | "seo"
    | "festive"
    | "fonts"
    | "integrations"
    | "verification"
    | "auth"
    | "protection"
    | "speed"
    | "links"
    | "activate"
    | "backup"
  >(search.tab || "general");

  const planType = (s.licenseType || "").toLowerCase();
  const isEnterprise = planType.includes("enterprise");
  const isPremium = isEnterprise || planType.includes("premium");

  useEffect(() => {
    if (search.tab && search.tab !== tab) {
      if (search.tab === "festive" && !isEnterprise) {
        setTab("general");
        navigate({ to: ".", search: { tab: "general" }, replace: true });
        return;
      }
      setTab(search.tab);
    }
  }, [search.tab, isEnterprise, tab, navigate]);

  useEffect(() => {
    if (tab === "festive" && !isEnterprise) {
      setTab("general");
      navigate({ to: ".", search: { tab: "general" }, replace: true });
    }
  }, [tab, isEnterprise, navigate]);

  const update = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    try {
      await saveSettings(s);
      toast.success("Saved successfully");
      router.invalidate();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save settings.");
    }
  };

  const tabs: Array<{
    id: NonNullable<SettingsSearch["tab"]>;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "general", label: "General", icon: Save },
    { id: "seo", label: "News SEO & Webmaster", icon: Globe },
    ...(isEnterprise
      ? [{ id: "festive" as const, label: "Festive", icon: Sparkles }]
      : []),
    { id: "fonts", label: "Fonts", icon: Type },
    { id: "integrations", label: "Integrations", icon: BarChart3 },
    { id: "protection", label: "Protection & Anti-Theft", icon: Lock },
    { id: "speed", label: "Speed Up", icon: Zap },
    { id: "links", label: "Redirects & Links", icon: Link2 },
    { id: "backup", label: "System Backup & Restore", icon: DatabaseBackup },
    { id: "activate", label: "Activate Website", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Site Settings</h1>
          <p className="text-sm text-slate-500">
            Brand, contact, analytics, verification and login providers.
          </p>
        </div>
        <button
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" /> Save
        </button>
      </div>

      <div role="tablist" aria-label="Settings categories" className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                navigate({ to: ".", search: { tab: t.id } });
              }}
              className={`whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" /> {t.label}
            </button>
          );
        })}
      </div>

      <Suspense fallback={<SettingsTabSkeleton />}>
        {tab === "general" && <GeneralSettingsForm />}

        {tab === "seo" && <SeoSettingsTab s={s} update={update} />}

        {tab === "festive" && isEnterprise && <FestiveSettingsForm />}

        {tab === "fonts" && <FontSettingsTab />}

        {tab === "integrations" && <IntegrationsTab s={s} update={update} />}

        {tab === "protection" && <ProtectionSettingsForm s={s} update={update} />}

        {tab === "links" && <RedirectsAndLinksTab />}

        {tab === "activate" && <ActivateWebsiteTab s={s} update={update} />}

        {tab === "backup" && <BackupRestoreTab />}

        {tab === "speed" && (
          <SpeedOptimizationTab
            s={s}
            update={update}
            isPremium={isPremium}
            onNavigateActivate={() => navigate({ to: ".", search: { tab: "activate" } })}
          />
        )}
      </Suspense>
    </div>
  );
}
