import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";
import {
  adminGetInboxRequests,
  adminGetInboxSummary,
  adminUpdateInboxStatus,
  adminApproveAccountDeletion,
  adminApproveJournalistApplication,
  adminDeleteInboxRequest,
} from "@/lib/inbox.functions";
import type { InboxRequest, SummaryRow } from "@/components/admin/inbox/types";
import { InboxSummaryCards } from "@/components/admin/inbox/InboxSummaryCards";
import { InboxFilterBar } from "@/components/admin/inbox/InboxFilterBar";
import { InboxRequestItem } from "@/components/admin/inbox/InboxRequestItem";
import { ConfirmDeleteModal } from "@/components/admin/inbox/ConfirmDeleteModal";

export const Route = createFileRoute("/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Admin Inbox - News Timeline" },
      { name: "description", content: "Review contact messages, journalist applications, and user requests." },
    ],
  }),
  component: AdminInboxPage,
});

function AdminInboxPage() {
  const s = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(s);

  const [requests, setRequests] = useState<InboxRequest[]>([]);
  const visibleRequests = requests.filter((req) => isEnterprisePlus || req.type !== "withdraw");
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    userId?: string;
    isDeletion: boolean;
  } | null>(null);

  useEffect(() => {
    setSelected(new Set());
  }, [requests]);

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

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selected.size} selected request(s)?`)) return;

    setLoading(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) => adminDeleteInboxRequest({ data: { id } })),
      );
      toast.success(`${selected.size} request(s) removed from inbox`);
      setSelected(new Set());
      await load();
    } catch (err: any) {
      toast.error("Bulk delete failed: " + err.message);
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
      .filter((r) => isEnterprisePlus || r.type !== "withdraw")
      .filter((r) => (type === "all" || r.type === type) && (!status || r.status === status))
      .reduce((acc, r) => acc + Number(r.count), 0);
  };

  const handleApprove = async (req: InboxRequest) => {
    if (req.type === "delete_account") {
      setConfirmDelete({ id: req.id, userId: req.user_id, isDeletion: true });
      return;
    }
    if (req.type === "journalist_application") {
      setActionLoading(req.id);
      try {
        await adminApproveJournalistApplication({ data: { requestId: req.id } });
        toast.success("Journalist application approved and profile updated!");
        await load();
      } catch (err: any) {
        toast.error(err.message || "Failed to approve journalist application");
      } finally {
        setActionLoading(null);
      }
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
      <InboxSummaryCards
        filterType={filterType}
        setFilterType={setFilterType}
        countFor={countFor}
        isEnterprisePlus={isEnterprisePlus}
      />

      {/* Filter Bar */}
      <InboxFilterBar
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        isEnterprisePlus={isEnterprisePlus}
      />

      {/* Request List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            Loading requests…
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Inbox className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No requests found</p>
            <p className="text-xs">Try changing the filter or check back later.</p>
          </div>
        ) : (
          <div>
            {/* Selection Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  checked={visibleRequests.length > 0 && selected.size === visibleRequests.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(new Set(visibleRequests.map((r) => r.id)));
                    } else {
                      setSelected(new Set());
                    }
                  }}
                />
                Select All
              </label>
              {selected.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Selected ({selected.size})
                </button>
              )}
            </div>
            <ul className="divide-y divide-slate-100">
              {visibleRequests.map((req) => (
                <InboxRequestItem
                  key={req.id}
                  req={req}
                  isExpanded={expandedId === req.id}
                  onToggleExpand={() => setExpandedId(expandedId === req.id ? null : req.id)}
                  isSelected={selected.has(req.id)}
                  onToggleSelect={() => {
                    const newSet = new Set(selected);
                    if (newSet.has(req.id)) newSet.delete(req.id);
                    else newSet.add(req.id);
                    setSelected(newSet);
                  }}
                  isLoading={actionLoading === req.id}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  handleDelete={handleDelete}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          confirmDelete={confirmDelete}
          actionLoading={actionLoading}
          confirmAction={confirmAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
