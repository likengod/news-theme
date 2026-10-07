import { useState, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Newspaper, ShieldCheck as Shield } from "lucide-react";
import { toast } from "sonner";

import {
  loadRanks,
  saveRanks,
  type JournalistRank,
} from "@/lib/journalist-ranks";
import { slugify } from "@/lib/roles";
import {
  loadAuthorized,
  saveAuthorized,
  DEFAULT_AUTHORIZED,
  type AuthorizedSettings,
} from "@/lib/authorized-settings";
import {
  listJournalists,
  upsertJournalist,
  deleteJournalist,
  type JournalistListRow,
} from "@/lib/journalist.functions";
import { toggleAdminUserBan } from "@/lib/admin-users.functions";
import AuthorizedPanel from "@/components/admin/journalists/AuthorizedPanel";
import { JournalistsListTab } from "@/components/admin/journalists/JournalistsListTab";
import { RanksTab } from "@/components/admin/journalists/RanksTab";
import { JournalistsHeader } from "@/components/admin/journalists/JournalistsHeader";
import { useJournalistForm } from "@/components/admin/journalists/useJournalistForm";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterpriseLicense, isEnterprisePlusLicense } from "@/lib/site-content";

const JournalistFormModal = lazy(() =>
  import("@/components/admin/journalists/JournalistFormModal").then((m) => ({
    default: m.JournalistFormModal,
  })),
);
const JournalistProfileModal = lazy(() =>
  import("@/components/admin/journalists/JournalistProfileModal").then((m) => ({
    default: m.JournalistProfileModal,
  })),
);
const RankEditModal = lazy(() =>
  import("@/components/admin/journalists/RankEditModal").then((m) => ({
    default: m.RankEditModal,
  })),
);

export const Route = createFileRoute("/admin/journalists")({
  component: JournalistsPage,
});

function emptyRank(): JournalistRank {
  return { id: "", name: "", minNews: 0, pointsPerNews: 0, color: "slate" };
}

type TabKey = "journalists" | "ranks" | "authorized";

function JournalistsPage() {
  const qc = useQueryClient();
  const siteSettings = useSiteSettings();
  const isEnterprise = isEnterpriseLicense(siteSettings);
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings);

  const [tab, setTab] = useState<TabKey>("journalists");
  const effectiveTab =
    (!isEnterprisePlus && tab === "ranks") || (!isEnterprise && tab === "authorized")
      ? "journalists"
      : tab;

  const [ranks, setRanks] = useState<JournalistRank[]>(() => loadRanks());
  const [authorized, setAuthorized] = useState<AuthorizedSettings>(() => loadAuthorized());
  const [authSaving, setAuthSaving] = useState(false);

  // Fetch every user whose role is Journalist
  const list = useServerFn(listJournalists);
  const upsert = useServerFn(upsertJournalist);
  const remove = useServerFn(deleteJournalist);
  const toggleBan = useServerFn(toggleAdminUserBan);

  const query = useQuery({
    queryKey: ["admin-journalists"],
    queryFn: () => list(),
  });
  const journalists: JournalistListRow[] = query.data ?? [];

  const [viewTarget, setViewTarget] = useState<JournalistListRow | null>(null);
  const [editing, setEditing] = useState<JournalistRank | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { form, setForm, saving, openNew, openEdit, submitForm } = useJournalistForm({
    upsert,
    qc,
  });

  const handleToggleBan = async (j: JournalistListRow) => {
    const willSuspend = j.active;
    try {
      await toggleBan({ data: { userId: j.userId, suspend: willSuspend } });
      toast.success(willSuspend ? `Journalist account suspended` : `Journalist account activated`);
      if (viewTarget?.userId === j.userId) {
        setViewTarget({ ...viewTarget, active: !willSuspend });
      }
      qc.invalidateQueries({ queryKey: ["admin-journalists"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const persist = (next: JournalistRank[]) => {
    const sorted = [...next].sort((a, b) => a.minNews - b.minNews);
    setRanks(sorted);
    saveRanks(sorted);
  };

  const onSave = () => {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return toast.error("Rank name is required");
    const id = isNew ? slugify(name) : editing.id;
    if (isNew && ranks.some((r) => r.id === id)) return toast.error("Rank already exists");
    const next = isNew
      ? [...ranks, { ...editing, id }]
      : ranks.map((r) => (r.id === id ? { ...editing, id } : r));
    persist(next);
    toast.success(isNew ? "Rank created" : "Rank updated");
    setEditing(null);
  };

  const onDelete = (r: JournalistRank) => {
    if (r.builtin) return toast.error("Built-in ranks cannot be deleted");
    if (!confirm(`Delete rank "${r.name}"?`)) return;
    persist(ranks.filter((x) => x.id !== r.id));
    toast.success("Rank deleted");
  };

  const removeOne = async (j: JournalistListRow) => {
    if (
      !confirm(
        `Permanently delete "${j.displayName ?? j.publicUserId}"? This removes the account everywhere.`,
      )
    )
      return;
    try {
      await remove({ data: { userId: j.userId } });
      toast.success("Journalist deleted");
      qc.invalidateQueries({ queryKey: ["admin-journalists"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <JournalistsHeader isEnterprise={isEnterprise} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {(
          [
            { id: "journalists" as const, label: "Journalists", icon: Newspaper },
            ...(isEnterprisePlus
              ? [{ id: "ranks" as const, label: "Rank tiers & points", icon: Award }]
              : []),
            ...(isEnterprise
              ? [{ id: "authorized" as const, label: "Authorized", icon: Shield }]
              : []),
          ]
        ).map((t) => {
          const Icon = t.icon;
          const active = effectiveTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                active ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {effectiveTab === "journalists" && (
        <JournalistsListTab
          journalists={journalists}
          ranks={ranks}
          isLoading={query.isLoading}
          isError={query.isError}
          errorMessage={(query.error as Error)?.message}
          openNew={openNew}
          openEdit={openEdit}
          removeOne={removeOne}
          handleToggleBan={handleToggleBan}
          setViewTarget={setViewTarget}
        />
      )}

      {effectiveTab === "ranks" && isEnterprisePlus && (
        <RanksTab
          ranks={ranks}
          setEditing={setEditing}
          setIsNew={setIsNew}
          onDelete={onDelete}
          emptyRank={emptyRank}
        />
      )}

      {effectiveTab === "authorized" && isEnterprise && (
        <AuthorizedPanel
          value={authorized}
          onChange={setAuthorized}
          saving={authSaving}
          onSave={() => {
            setAuthSaving(true);
            try {
              saveAuthorized(authorized);
              toast.success("Authorized settings saved");
            } finally {
              setAuthSaving(false);
            }
          }}
          onReset={() => {
            setAuthorized(DEFAULT_AUTHORIZED);
            saveAuthorized(DEFAULT_AUTHORIZED);
            toast.success("Authorized settings reset");
          }}
        />
      )}

      {editing && (
        <Suspense fallback={null}>
          <RankEditModal editing={editing} isNew={isNew} setEditing={setEditing} onSave={onSave} />
        </Suspense>
      )}

      {form && (
        <Suspense fallback={null}>
          <JournalistFormModal
            form={form}
            setForm={setForm}
            saving={saving}
            submitForm={submitForm}
          />
        </Suspense>
      )}

      {viewTarget && (
        <Suspense fallback={null}>
          <JournalistProfileModal
            viewTarget={viewTarget}
            setViewTarget={setViewTarget}
            handleToggleBan={handleToggleBan}
          />
        </Suspense>
      )}
    </div>
  );
}
