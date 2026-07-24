import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Inbox,
  Mail,
  Briefcase,
  Wallet,
  UserX,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
  Clock,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminGetInboxRequests,
  adminGetInboxSummary,
  adminUpdateInboxStatus,
  adminApproveAccountDeletion,
  adminDeleteInboxRequest,
} from "@/lib/inbox.functions";

export const Route = createFileRoute("/admin/inbox")({
  component: AdminInboxPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type InboxRequest = {
  id: number;
  type: "contact" | "work_with_us" | "withdraw" | "delete_account";
  user_id?: string;
  user_email?: string;
  user_name?: string;
  title: string;
  details?: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
};

type SummaryRow = {
  type: string;
  status: string;
  count: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  contact: { label: "Contact Message", icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  work_with_us: { label: "Work Application", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
  withdraw: { label: "Withdrawal Request", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
  delete_account: { label: "Account Deletion", icon: UserX, color: "text-red-600", bg: "bg-red-50" },
};

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

// ─── Page Component ───────────────────────────────────────────────────────────

function AdminInboxPage() {
  const [requests, setRequests] = useState<InboxRequest[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    userId?: string;
    isDeletion: boolean;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [reqRes, sumRes] = await Promise.all([
        adminGetInboxRequests({ data: { type: filterType, status: filterStatus } }),
        adminGetInboxSummary(),
      ]);
      setRequests(reqRes.requests || []);
      setSummary(sumRes.summary || []);
    } catch (err: any) {
      toast.error("Failed to load inbox: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus]);

  const countFor = (type: string, status?: string) => {
    return summary
      .filter((r) => (type === "all" || r.type === type) && (!status || r.status === status))
      .reduce((acc, r) => acc + Number(r.count), 0);
  };

  const handleApprove = async (req: InboxRequest) => {
    if (req.type === "delete_account") {
      setConfirmDelete({ id: req.id, userId: req.user_id, isDeletion: true });
      return;
    }
    setActionLoading(req.id);
    try {
      await adminUpdateInboxStatus({ data: { id: req.id, status: "Approved" } });
      toast.success("Request approved");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (req: InboxRequest) => {
    setActionLoading(req.id);
    try {
      await adminUpdateInboxStatus({ data: { id: req.id, status: "Rejected" } });
      toast.success("Request rejected");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDelete({ id, isDeletion: false });
  };

  const confirmAction = async () => {
    if (!confirmDelete) return;
    setActionLoading(confirmDelete.id);
    try {
      if (confirmDelete.isDeletion && confirmDelete.userId) {
        await adminApproveAccountDeletion({
          data: { requestId: confirmDelete.id, userId: confirmDelete.userId },
        });
        toast.success("User account permanently deleted");
      } else {
        await adminDeleteInboxRequest({ data: { id: confirmDelete.id } });
        toast.success("Request removed from inbox");
      }
      setConfirmDelete(null);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingTotal = countFor("all", "Pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Inbox className="h-6 w-6 text-slate-600" />
            Admin Inbox
            {pendingTotal > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                {pendingTotal} pending
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review contact messages, work applications, withdrawals and account deletion requests.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(TYPE_META).map(([type, meta]) => {
          const Icon = meta.icon;
          const pending = countFor(type, "Pending");
          const total = countFor(type);
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              className={`rounded-xl border p-4 text-left transition ${
                filterType === type
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                  filterType === type ? "bg-white/10" : meta.bg
                }`}
              >
                <Icon className={`h-5 w-5 ${filterType === type ? "text-white" : meta.color}`} />
              </div>
              <p className={`text-xs font-semibold ${filterType === type ? "text-white/70" : "text-slate-500"}`}>
                {meta.label}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-2xl font-bold">{total}</span>
                {pending > 0 && (
                  <span
                    className={`mb-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      filterType === type ? "bg-amber-400 text-slate-900" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {pending} new
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <Filter className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Filters</span>

        <div className="flex gap-1">
          {["all", "contact", "work_with_us", "withdraw", "delete_account"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filterType === t
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t === "all" ? "All Types" : TYPE_META[t]?.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-1">
          {["all", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filterStatus === s
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            Loading requests…
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Inbox className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No requests found</p>
            <p className="text-xs">Try changing the filter or check back later.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {requests.map((req) => {
              const meta = TYPE_META[req.type] ?? TYPE_META.contact;
              const Icon = meta.icon;
              const isExpanded = expandedId === req.id;
              const isLoading = actionLoading === req.id;
              let parsedDetails: Record<string, any> | null = null;
              try {
                if (req.details && req.details.startsWith("{")) {
                  parsedDetails = JSON.parse(req.details);
                }
              } catch {}

              return (
                <li key={req.id} className="group">
                  <div
                    className="flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-slate-50"
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>

                    {/* Main info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{req.title}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[req.status]}`}
                        >
                          {req.status}
                        </span>
                        {req.type === "delete_account" && req.status === "Pending" && (
                          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            Destructive
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {req.user_name && <span className="font-medium text-slate-700">{req.user_name}</span>}
                        {req.user_email && <span>{req.user_email}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(req.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {!isExpanded && req.details && !parsedDetails && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{req.details}</p>
                      )}
                    </div>

                    {/* Expand toggle */}
                    <div className="flex shrink-0 items-center gap-2 pl-2">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 pb-5 pt-4">
                      {/* Details */}
                      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                          Request Details
                        </p>
                        {parsedDetails ? (
                          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                            {Object.entries(parsedDetails).map(([k, v]) =>
                              v ? (
                                <div key={k}>
                                  <dt className="text-xs font-medium capitalize text-slate-400">
                                    {k.replace(/_/g, " ")}
                                  </dt>
                                  <dd className="mt-0.5 font-medium text-slate-800">{String(v)}</dd>
                                </div>
                              ) : null
                            )}
                          </dl>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm text-slate-700">{req.details || "—"}</p>
                        )}
                      </div>

                      {/* User info */}
                      {(req.user_id || req.user_email) && (
                        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                            User Info
                          </p>
                          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            {req.user_name && (
                              <div>
                                <dt className="text-xs font-medium text-slate-400">Name</dt>
                                <dd className="mt-0.5 font-medium text-slate-800">{req.user_name}</dd>
                              </div>
                            )}
                            {req.user_email && (
                              <div>
                                <dt className="text-xs font-medium text-slate-400">Email</dt>
                                <dd className="mt-0.5 font-medium text-slate-800">{req.user_email}</dd>
                              </div>
                            )}
                            {req.user_id && (
                              <div className="col-span-2">
                                <dt className="text-xs font-medium text-slate-400">User ID</dt>
                                <dd className="mt-0.5 font-mono text-xs text-slate-600">{req.user_id}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {req.status === "Pending" && (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            disabled={isLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(req);
                            }}
                            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
                              req.type === "delete_account"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {req.type === "delete_account" ? "Approve & Delete User" : "Approve"}
                          </button>
                          <button
                            disabled={isLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(req);
                            }}
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                          <button
                            disabled={isLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(req.id);
                            }}
                            className="ml-auto flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      )}

                      {req.status !== "Pending" && (
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${STATUS_STYLES[req.status]}`}
                          >
                            {req.status === "Approved" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {req.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(req.id);
                            }}
                            className="ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {confirmDelete.isDeletion ? (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Permanently Delete User?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This will <strong>permanently delete</strong> the user account and all associated data including
                  profiles, articles, sessions, and roles. <strong>This action cannot be undone.</strong>
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={confirmAction}
                    disabled={!!actionLoading}
                    className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Yes, Delete Permanently
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-800">Remove Request?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This will permanently remove this inbox entry. The action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={confirmAction}
                    disabled={!!actionLoading}
                    className="flex-1 rounded-md bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
