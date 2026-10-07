import { useState } from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitDeleteAccountRequest } from "@/lib/inbox.functions";

interface DeleteAccountProps {
  initialDeleteRequested: boolean;
}

export function DeleteAccount({ initialDeleteRequested }: DeleteAccountProps) {
  const doDeleteRequest = useServerFn(submitDeleteAccountRequest);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteRequested, setDeleteRequested] = useState(initialDeleteRequested);
  const [saving, setSaving] = useState(false);

  async function handleDeleteRequest(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    setSaving(true);
    try {
      await doDeleteRequest();
      setDeleteRequested(true);
      toast.success("Deletion request submitted. Our team will review it within 48 hours.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit deletion request");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="border-b border-red-100 bg-red-50 px-6 py-4">
        <h2 className="text-base font-bold text-red-900">Delete Account</h2>
        <p className="text-xs text-red-700 mt-0.5">
          This submits a deletion request to our team. It cannot be undone.
        </p>
      </div>
      <div className="p-6">
        {deleteRequested ? (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Deletion request submitted</p>
              <p className="mt-1 text-sm text-amber-800">
                Our team will review your request and delete your account within 48 hours. If you
                have any questions, email{" "}
                <a href="mailto:support@northeasttimeline.com" className="underline">
                  support@northeasttimeline.com
                </a>
                .
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDeleteRequest} className="max-w-md space-y-5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
              <p className="text-sm font-semibold text-red-900">
                What happens when you delete your account:
              </p>
              <ul className="space-y-1 text-sm text-red-800 list-disc pl-4">
                <li>Your profile and personal data will be permanently removed</li>
                <li>Your wallet balance will be forfeited</li>
                <li>Your published articles will be retained under an anonymous byline</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Type <strong className="font-mono">DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-red-200 py-2.5 px-4 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving || deleteConfirm !== "DELETE"}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Request Account Deletion
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
