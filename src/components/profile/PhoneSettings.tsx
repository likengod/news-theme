import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { updateCurrentUserProfile } from "@/lib/auth.functions";

interface PhoneSettingsProps {
  initialPhone: string;
}

export function PhoneSettings({ initialPhone }: PhoneSettingsProps) {
  const doUpdateProfile = useServerFn(updateCurrentUserProfile);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await doUpdateProfile({ data: { phone } });
      toast.success("Phone number updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update phone");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">Phone Number</h2>
        <p className="text-xs text-slate-500 mt-0.5">Used on your press credential card</p>
      </div>
      <form onSubmit={handleSavePhone} className="p-6 space-y-5 max-w-md">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Phone
        </button>
      </form>
    </div>
  );
}
