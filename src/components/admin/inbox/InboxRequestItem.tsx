import React from "react";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { type InboxRequest, TYPE_META, STATUS_STYLES } from "./types";

interface InboxRequestItemProps {
  req: InboxRequest;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
  isLoading: boolean;
  handleApprove: (req: InboxRequest) => void;
  handleReject: (req: InboxRequest) => void;
  handleDelete: (id: number) => void;
}

const DETAIL_LABELS: Record<string, string> = {
  displayName: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  bloodGroup: "Blood Group",
  dob: "Date of Birth (DOB)",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  gender: "Gender",
  maritalStatus: "Marital Status",
  husbandName: "Husband's Name",
  documentType: "Verification Document Type",
  documentUrl: "ID Proof Document",
  address: "Address",
  state: "State",
  country: "Country",
  pinCode: "PIN / ZIP Code",
  bio: "Bio / Experience",
};

export function InboxRequestItem({
  req,
  isExpanded,
  onToggleExpand,
  isSelected,
  onToggleSelect,
  isLoading,
  handleApprove,
  handleReject,
  handleDelete,
}: InboxRequestItemProps) {
  const meta = TYPE_META[req.type] ?? TYPE_META.contact;
  const Icon = meta.icon;

  let parsedDetails: Record<string, any> | null = null;
  try {
    if (req.details && req.details.startsWith("{")) {
      parsedDetails = JSON.parse(req.details);
    }
  } catch {}

  return (
    <li className="group">
      <div
        className="flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-slate-50"
        onClick={onToggleExpand}
      >
        {/* Selection Checkbox */}
        <div
          className="flex h-9 items-center justify-center pt-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
            checked={isSelected}
            aria-label={`Select request from ${req.user_name || req.title}`}
            onChange={onToggleSelect}
          />
        </div>

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
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
                {Object.entries(parsedDetails).map(([k, v]) => {
                  if (!v) return null;
                  if (k === "avatarUrl" || k === "avatar") {
                    return (
                      <div key={k} className="col-span-2 sm:col-span-3">
                        <dt className="text-xs font-medium capitalize text-slate-400">
                          Applicant Photo / Avatar
                        </dt>
                        <dd className="mt-1.5 flex items-center gap-3">
                          <img
                            src={String(v)}
                            alt="Applicant"
                            className="h-20 w-20 rounded-xl object-cover border border-slate-200 shadow-xs bg-slate-100"
                          />
                          <span className="text-[11px] text-slate-400">
                            Saved in application and will be assigned to profile on approval
                          </span>
                        </dd>
                      </div>
                    );
                  }
                  if (k === "documentUrl" || k === "document") {
                    return (
                      <div key={k} className="col-span-2 sm:col-span-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                        <dt className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Identity Verification Document ({parsedDetails.documentType || "ID Proof"})</span>
                          <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                            {parsedDetails.documentType || "Valid ID"}
                          </span>
                        </dt>
                        <dd className="mt-2.5 flex flex-wrap items-start gap-4">
                          <a
                            href={String(v)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/doc relative block overflow-hidden rounded-lg border border-slate-300 shadow-sm bg-white"
                            title="Click to view full size"
                          >
                            <img
                              src={String(v)}
                              alt="Verification Document"
                              className="h-32 w-auto max-w-xs object-contain transition duration-200 group-hover/doc:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                              <span>Open Full Size ↗</span>
                            </div>
                          </a>
                          <div className="text-xs text-slate-600 space-y-1.5">
                            <p className="font-semibold text-slate-800">
                              Selected Document: <span className="text-blue-700 font-bold">{parsedDetails.documentType || "Official ID"}</span>
                            </p>
                            <p className="text-slate-500">Official government ID document uploaded by the applicant.</p>
                            <a
                              href={String(v)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline pt-1"
                            >
                              <span>Inspect Document in New Tab ↗</span>
                            </a>
                          </div>
                        </dd>
                      </div>
                    );
                  }
                  if (k === "documentType" && parsedDetails.documentUrl) {
                    // Handled above in document card
                    return null;
                  }
                  return (
                    <div key={k}>
                      <dt className="text-xs font-medium text-slate-400">
                        {DETAIL_LABELS[k] || k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                      </dt>
                      <dd className="mt-0.5 font-medium text-slate-800">{String(v)}</dd>
                    </div>
                  );
                })}
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
}
