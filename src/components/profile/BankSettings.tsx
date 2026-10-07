import { useState } from "react";
import { AlertTriangle, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { updateCurrentUserProfile } from "@/lib/auth.functions";

interface BankSettingsProps {
  initialBankName: string;
  initialBankAccountName: string;
  initialBankAccountNo: string;
  initialBankIfsc: string;
}

export function BankSettings({
  initialBankName,
  initialBankAccountName,
  initialBankAccountNo,
  initialBankIfsc,
}: BankSettingsProps) {
  const doUpdateProfile = useServerFn(updateCurrentUserProfile);
  const [bankName, setBankName] = useState(initialBankName);
  const [bankAccountName, setBankAccountName] = useState(initialBankAccountName);
  const [bankAccountNo, setBankAccountNo] = useState(initialBankAccountNo);
  const [bankIfsc, setBankIfsc] = useState(initialBankIfsc);
  const [saving, setSaving] = useState(false);

  async function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await doUpdateProfile({
        data: {
          bank_name: bankName,
          bank_account_name: bankAccountName,
          bank_account_no: bankAccountNo,
          bank_ifsc: bankIfsc,
        },
      });
      toast.success("Bank account details saved!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save bank details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">Bank Account Details</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Used to process earnings withdrawals. Only visible to admins.
        </p>
      </div>
      <form onSubmit={handleSaveBank} className="p-6 space-y-5 max-w-md">
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          Your bank details are encrypted and only visible to authorised admins for payout purposes.
        </div>
        {[
          {
            label: "Bank Name",
            value: bankName,
            set: setBankName,
            placeholder: "e.g. State Bank of India",
          },
          {
            label: "Account Holder Name",
            value: bankAccountName,
            set: setBankAccountName,
            placeholder: "Full name as on bank account",
          },
          {
            label: "Account Number",
            value: bankAccountNo,
            set: setBankAccountNo,
            placeholder: "e.g. 1234567890",
          },
          {
            label: "IFSC Code",
            value: bankIfsc,
            set: setBankIfsc,
            placeholder: "e.g. SBIN0001234",
          },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Bank Details
        </button>
      </form>
    </div>
  );
}
