import React, { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  Coins,
  Search,
  Loader2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Award,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { roleBadgeClass } from "@/lib/roles";
import { rankForCount, type JournalistRank } from "@/lib/journalist-ranks";
import type { JournalistListRow } from "@/lib/journalist.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

const PAGE_SIZE = 20;
type SortKey = "name" | "points_desc" | "points_asc" | "articles_desc" | "articles_asc" | "rank";

interface JournalistsListTabProps {
  journalists: JournalistListRow[];
  ranks: JournalistRank[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  openNew: () => void;
  openEdit: (j: JournalistListRow) => void;
  removeOne: (j: JournalistListRow) => void;
  handleToggleBan: (j: JournalistListRow) => void;
  setViewTarget: (j: JournalistListRow) => void;
}

export function JournalistsListTab({
  journalists,
  ranks,
  isLoading,
  isError,
  errorMessage,
  openNew,
  openEdit,
  removeOne,
  handleToggleBan,
  setViewTarget,
}: JournalistsListTabProps) {
  const siteSettings = useSiteSettings();
  const planType = (siteSettings?.licenseType || "").toLowerCase();
  const isEnterprisePlus =
    planType.includes("enterprise+") ||
    planType.includes("enterprise plus");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>(isEnterprisePlus ? "points_desc" : "articles_desc");
  const [rankFilter, setRankFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const publishedCount = (j: JournalistListRow) => j.articlesPublished ?? 0;

  const enriched = useMemo(
    () =>
      journalists.map((j) => {
        const published = publishedCount(j);
        const rank = rankForCount(published, ranks);
        return { j, published, rankId: rank?.id ?? "unranked", rankName: rank?.name ?? "Unranked" };
      }),
    [journalists, ranks],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let rows = enriched.filter(({ j, rankId }) => {
      if (
        term &&
        !`${j.displayName ?? ""}${j.journalistId ?? ""}${j.publicUserId}${j.email ?? ""}`
          .toLowerCase()
          .includes(term)
      )
        return false;
      if (rankFilter !== "all" && rankId !== rankFilter) return false;
      if (statusFilter === "active" && !j.active) return false;
      if (statusFilter === "inactive" && j.active) return false;
      return true;
    });
    rows.sort((a, b) => {
      switch (sort) {
        case "name":
          return (a.j.displayName ?? "").localeCompare(b.j.displayName ?? "");
        case "points_desc":
          return b.j.points - a.j.points;
        case "points_asc":
          return a.j.points - b.j.points;
        case "articles_desc":
          return b.published - a.published;
        case "articles_asc":
          return a.published - b.published;
        case "rank": {
          const ra = ranks.find((r) => r.id === a.rankId)?.minNews ?? -1;
          const rb = ranks.find((r) => r.id === b.rankId)?.minNews ?? -1;
          return rb - ra;
        }
      }
    });
    return rows;
  }, [enriched, q, sort, rankFilter, statusFilter, ranks]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const copy = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast.success(`Copied ${v}`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Journalists ({filtered.length})
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, ID, email..."
              className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <select
            value={rankFilter}
            onChange={(e) => {
              setRankFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm"
            title="Filter by rank"
          >
            <option value="all">All ranks</option>
            {ranks.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
            <option value="unranked">Unranked</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-slate-200 py-2 pl-3 pr-8 text-sm"
            title="Sort"
          >
            {isEnterprisePlus && (
              <>
                <option value="points_desc">Highest points</option>
                <option value="points_asc">Lowest points</option>
              </>
            )}
            <option value="articles_desc">Most articles</option>
            <option value="articles_asc">Fewest articles</option>
            <option value="rank">Top rank</option>
            <option value="name">Name (A-Z)</option>
          </select>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> New journalist
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading journalists...
        </div>
      ) : isError ? (
        <div className="px-5 py-16 text-center text-sm text-red-600">
          {errorMessage ?? "Failed to load"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Journalist</th>
                <th className="px-5 py-3">Journalist ID</th>
                <th className="px-5 py-3">
                  <span className="inline-flex items-center gap-1">
                    <Newspaper className="h-3 w-3" /> Published
                  </span>
                </th>
                <th className="px-5 py-3">
                  <span className="inline-flex items-center gap-1">
                    <Award className="h-3 w-3" /> Rank
                  </span>
                </th>
                {isEnterprisePlus && (
                  <th className="px-5 py-3">
                    <span className="inline-flex items-center gap-1">
                      <Coins className="h-3 w-3" /> Wallet
                    </span>
                  </th>
                )}
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map(({ j, published, rankId }) => {
                const rank = ranks.find((r) => r.id === rankId) ?? null;
                const name = j.displayName ?? `User ${j.publicUserId}`;
                return (
                  <tr
                    key={j.userId}
                    className={`hover:bg-slate-50/60 ${j.active ? "" : "opacity-70"}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {j.avatarUrl ? (
                          <img
                            src={j.avatarUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            {name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-slate-500">
                            {j.email ?? `Public ID ${j.publicUserId}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {j.journalistId ? (
                        <div className="inline-flex items-center gap-1.5">
                          <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs tracking-wider text-slate-800">
                            {j.journalistId}
                          </code>
                          <button
                            onClick={() => copy(j.journalistId!)}
                            className="grid h-6 w-6 place-items-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100"
                            title="Copy Journalist ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">&mdash;</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{published.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      {rank ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(rank.color)}`}
                        >
                          <Award className="h-3 w-3" /> {rank.name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Unranked</span>
                      )}
                    </td>
                    {isEnterprisePlus && (
                      <td className="px-5 py-3 font-semibold text-slate-800">
                        {j.points.toLocaleString()} pts
                      </td>
                    )}
                    <td className="px-5 py-3">
                      <select
                        value={j.active ? "active" : "suspended"}
                        onChange={(e) => {
                          const targetState = e.target.value;
                          if (
                            (targetState === "active" && !j.active) ||
                            (targetState === "suspended" && j.active)
                          ) {
                            handleToggleBan(j);
                          }
                        }}
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                          j.active
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        <option
                          value="active"
                          className="bg-white text-emerald-700 font-semibold"
                        >
                          &bull; Active
                        </option>
                        <option
                          value="suspended"
                          className="bg-white text-red-700 font-semibold"
                        >
                          &bull; Suspended
                        </option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewTarget(j)}
                          className="rounded-md border border-slate-200 p-1.5 text-xs text-slate-600 hover:bg-slate-100"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(j)}
                          className="rounded-md border border-slate-200 p-1.5 text-xs text-slate-700 hover:bg-slate-100"
                          title="Edit Journalist"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeOne(j)}
                          className="rounded-md border border-slate-200 p-1.5 text-xs text-red-600 hover:bg-red-50"
                          title="Delete Journalist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    {journalists.length === 0
                      ? "No journalists yet. Assign the Journalist role to a user under Admin → Users."
                      : "No results match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm">
          <p className="text-slate-500">
            Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong>-
            <strong>{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of{" "}
            {filtered.length}
          </p>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
              .map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded-md border px-2 text-xs ${n === currentPage ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  {n}
                </button>
              ))}
            <button
              onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage === pageCount}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
