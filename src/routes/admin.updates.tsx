import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GitBranch,
  GitCommit,
  RefreshCw,
  Download,
  Hammer,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Terminal,
  ChevronDown,
  ChevronUp,
  Rocket,
  AlertTriangle,
  Loader2,
  Globe,
  Layers,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  getGitStatus,
  gitPull,
  buildProject,
  getDeployHistory,
  getDeployLog,
} from "@/lib/deploy.functions";

export const Route = createFileRoute("/admin/updates")({
  component: UpdatesPage,
});

type GitStatus = {
  version?: string;
  branch: string;
  commitHash: string;
  commitFull: string;
  commitMessage: string;
  commitDate: string;
  remote: string;
  isConfigured: boolean;
  hasChanges: boolean;
  changedFiles: number;
  ahead: number;
  behind: number;
};

type Deployment = {
  id: number;
  commit_hash: string;
  commit_message: string;
  branch: string;
  status: string;
  triggered_by: string;
  started_at: string;
  finished_at: string | null;
  build_log?: string;
};

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Success: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
  Pulled: { bg: "bg-blue-100", text: "text-blue-700", icon: Download },
  "Up-to-date": { bg: "bg-slate-100", text: "text-slate-600", icon: CheckCircle2 },
  Building: { bg: "bg-amber-100", text: "text-amber-700", icon: Loader2 },
  Failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  Pending: { bg: "bg-slate-100", text: "text-slate-500", icon: Clock },
};

function UpdatesPage() {
  const navigate = useNavigate();
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [building, setBuilding] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [logContent, setLogContent] = useState<string>("");
  const [buildOutput, setBuildOutput] = useState<string>("");

  const refresh = async () => {
    setLoading(true);
    try {
      const [statusRes, historyRes] = await Promise.all([
        getGitStatus(),
        getDeployHistory(),
      ]);
      setGitStatus(statusRes);
      setDeployments(historyRes.deployments ?? []);
    } catch (err: any) {
      toast.error("Failed to load status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handlePullAndUpdate = async () => {
    setPulling(true);
    try {
      const res = await gitPull();
      if (res.updated) {
        toast.success(`Updated! ${res.beforeHash} → ${res.afterHash}`);
        // Trigger build automatically after successful pull
        await handleBuild();
      } else {
        toast.info("System core is already up to date");
      }
      await refresh();
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    } finally {
      setPulling(false);
    }
  };

  const handleBuild = async () => {
    setBuilding(true);
    setBuildOutput("");
    try {
      const res = await buildProject();
      setBuildOutput(res.buildLog || "");
      if (res.success) {
        toast.success("Build and deployment completed successfully!");
      } else {
        toast.error("Build failed — check log below");
      }
      await refresh();
    } catch (err: any) {
      toast.error("Build error: " + err.message);
    } finally {
      setBuilding(false);
    }
  };

  const viewLog = async (id: number) => {
    if (expandedLog === id) {
      setExpandedLog(null);
      return;
    }
    try {
      const res = await getDeployLog({ data: id });
      setLogContent(res?.build_log || "No log available");
      setExpandedLog(id);
    } catch {
      setLogContent("Failed to load log");
      setExpandedLog(id);
    }
  };

  const currentVersion = gitStatus?.version || "v1.7.7";
  const isGitConfigured = Boolean(gitStatus?.isConfigured);
  const updatesAvailable = (gitStatus?.behind ?? 0) > 0;
  const updatesCount = gitStatus?.behind ?? 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <Layers className="h-4 w-4 text-slate-600" />
          <span>System Core Update</span>
        </div>

        <div className="flex items-center gap-3">
          {updatesAvailable ? (
            <button
              onClick={handlePullAndUpdate}
              disabled={pulling || building}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {pulling || building ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 fill-white" />
              )}
              <span>
                {pulling || building 
                  ? "Updating System..." 
                  : `Update to Latest (${updatesCount} new)`}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Updated ({currentVersion})</span>
            </div>
          )}

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Build Terminal Output */}
      {buildOutput && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Terminal className="h-4 w-4 text-emerald-400" /> Live Build Output
            </span>
            <span className="text-[10px] font-mono text-slate-500">npm run build</span>
          </div>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-emerald-400">
            {buildOutput}
          </pre>
        </div>
      )}

      {/* Deployment & Update History */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Clock className="h-4 w-4 text-slate-500" />
            Deployment & Patch History
          </h3>
        </div>

        {deployments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Rocket className="mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm font-semibold">No deployments recorded</p>
            <p className="text-xs">Click "Update Now" or "Build Production Bundle" to create a record.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {deployments.slice(0, 1).map((d) => {
              const style = STATUS_STYLE[d.status] ?? STATUS_STYLE.Pending;
              const Icon = style.icon;
              const isExpanded = expandedLog === d.id;

              return (
                <li key={d.id}>
                  <div
                    className="flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-slate-50/80"
                    onClick={() => viewLog(d.id)}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                      <Icon className={`h-4 w-4 ${style.text} ${d.status === "Building" ? "animate-spin" : ""}`} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {d.commit_hash}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${style.bg} ${style.text}`}>
                          {d.status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {d.branch}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {d.commit_message || "System update / manual build"}
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right text-xs text-slate-400 sm:block">
                      <p className="font-medium text-slate-600">
                        {new Date(d.started_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-[10px] text-slate-400">by {d.triggered_by}</p>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950 px-6 py-4">
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs text-emerald-400 leading-relaxed">
                        {logContent}
                      </pre>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
