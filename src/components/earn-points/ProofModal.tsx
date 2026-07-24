import { useState } from "react";
import { Check, ExternalLink, X, Info } from "lucide-react";
import { toast } from "sonner";
import { loadSocialLinks } from "@/lib/social-links";

export type SocialTaskDef = {
  id: string;
  title: string;
  points: number;
  platform: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  actionLabel: string;
  hrefKey: "facebook" | "youtube" | "instagram" | "whatsapp";
  handleLabel: string;
  handlePlaceholder: string;
};

type Props = {
  task: SocialTaskDef;
  onSubmit: (handle: string) => void;
  onClose: () => void;
};

export function ProofModal({ task, onSubmit, onClose }: Props) {
  const [visited, setVisited] = useState(false);
  const [handle, setHandle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const socialLinks = loadSocialLinks();

  const submit = () => {
    if (!visited) { toast.error(`Please visit and ${task.actionLabel.toLowerCase()} our ${task.platform} page first`); return; }
    if (handle.trim().length < 2) { toast.error("Please enter your handle/username"); return; }
    if (!agreed) { toast.error("Please confirm the declaration"); return; }
    onSubmit(handle.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <task.icon className="h-5 w-5" style={{ color: task.iconColor }} />
            <h2 className="text-base font-bold text-slate-900">Submit proof for {task.platform}</h2>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1 — Visit */}
          <div className={`rounded-xl border p-4 transition-all ${visited ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
            <div className="flex items-center gap-3">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${visited ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {visited ? <Check className="h-4 w-4" /> : "1"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Visit {task.platform} & {task.actionLabel}</p>
                <p className="text-xs text-slate-500">Open the page and actually {task.actionLabel.toLowerCase()} us</p>
              </div>
              <a
                href={socialLinks[task.hrefKey] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setVisited(true)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  visited ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {visited && <Check className="h-3 w-3" />}
                {task.actionLabel}
                {!visited && <ExternalLink className="h-3 w-3" />}
              </a>
            </div>
          </div>

          {/* Step 2 — Enter handle */}
          <div className={`rounded-xl border p-4 transition-all ${!visited ? "opacity-50 pointer-events-none" : "border-slate-200"}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${handle.length > 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {handle.length > 2 ? <Check className="h-4 w-4" /> : "2"}
              </span>
              <p className="text-sm font-semibold text-slate-800">Enter your {task.platform} handle</p>
            </div>
            <label className="mb-1.5 block text-xs text-slate-500">{task.handleLabel}</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={task.handlePlaceholder}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Our team will verify this handle actually follows us within 24–48 hours.
            </p>
          </div>

          {/* Step 3 — Declaration */}
          <div className={`rounded-xl border p-4 transition-all ${!visited || handle.length < 2 ? "opacity-50 pointer-events-none" : "border-slate-200"}`}>
            <div className="flex items-start gap-3">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold mt-0.5 ${agreed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                {agreed ? <Check className="h-4 w-4" /> : "3"}
              </span>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />
                <span className="text-xs text-slate-700">
                  I confirm I have <strong>{task.actionLabel.toLowerCase()}ed</strong> the News Theme {task.platform} page using the account <strong>{handle || "provided above"}</strong>. I understand that false claims will result in points being revoked and account suspension.
                </span>
              </label>
            </div>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>Points are credited after admin verification (24–48 hrs). Fake submissions will be permanently banned from the rewards program.</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={submit} className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Submit for Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
