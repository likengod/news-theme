import React, { useState, useEffect } from "react";
import {
  Gift,
  Plus,
  Pencil,
  Trash2,
  Crown,
  Smartphone,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  Film,
  Landmark,
  Coffee,
  Zap,
  Ticket,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  type Voucher,
  DEFAULT_VOUCHERS,
  loadVouchers,
  saveVouchers,
  getVouchersServer,
} from "@/lib/vouchers";

export const ICON_OPTIONS: { name: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Gift", label: "Gift Box", icon: Gift },
  { name: "Crown", label: "Crown / VIP", icon: Crown },
  { name: "Smartphone", label: "Phone / Mobile", icon: Smartphone },
  { name: "ShoppingBag", label: "Shopping Bag", icon: ShoppingBag },
  { name: "UtensilsCrossed", label: "Food / Restaurant", icon: UtensilsCrossed },
  { name: "Sparkles", label: "Special / Fashion", icon: Sparkles },
  { name: "Film", label: "Movie / Cinema", icon: Film },
  { name: "Landmark", label: "Bank / Cash", icon: Landmark },
  { name: "Coffee", label: "Cafe / Drinks", icon: Coffee },
  { name: "Zap", label: "Recharge / Utility", icon: Zap },
  { name: "Ticket", label: "Ticket / Event", icon: Ticket },
];

export const COLOR_OPTIONS = [
  { name: "amber", label: "Gold / Amber", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  { name: "sky", label: "Sky Blue", bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-300" },
  { name: "indigo", label: "Indigo", bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
  { name: "orange", label: "Orange", bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  { name: "rose", label: "Rose Pink", bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
  { name: "red", label: "Red", bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  { name: "emerald", label: "Green", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  { name: "purple", label: "Purple", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
];

export function getVoucherIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  const match = ICON_OPTIONS.find((i) => i.name.toLowerCase() === (iconName || "").toLowerCase());
  return match ? match.icon : Gift;
}

export function getVoucherColorClasses(colorName: string) {
  const match = COLOR_OPTIONS.find((c) => c.name === colorName);
  return match || COLOR_OPTIONS[0];
}

export function VouchersManager() {
  const [vouchers, setVouchers] = useState<Voucher[]>(() => loadVouchers());
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    getVouchersServer()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVouchers(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingVoucher({
      id: "voucher_" + Math.random().toString(36).slice(2, 9),
      title: "",
      cost: 500,
      tag: "Shopping",
      icon: "ShoppingBag",
      color: "indigo",
      featured: false,
      freeUnlock: false,
      enabled: true,
    });
    setIsNew(true);
  };

  const handleOpenEdit = (v: Voucher) => {
    setEditingVoucher({ ...v });
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this voucher?")) {
      const next = vouchers.filter((v) => v.id !== id);
      setVouchers(next);
      saveVouchers(next);
      toast.success("Voucher deleted successfully");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all vouchers back to system defaults?")) {
      setVouchers(DEFAULT_VOUCHERS);
      saveVouchers(DEFAULT_VOUCHERS);
      toast.success("Vouchers reset to defaults");
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoucher) return;
    if (!editingVoucher.title.trim()) {
      return toast.error("Please provide a voucher title");
    }

    const next = isNew
      ? [...vouchers, editingVoucher]
      : vouchers.map((v) => (v.id === editingVoucher.id ? editingVoucher : v));

    setVouchers(next);
    saveVouchers(next);
    toast.success(isNew ? "Voucher created successfully" : "Voucher updated successfully");
    setEditingVoucher(null);
  };

  const handleToggleEnabled = (id: string) => {
    const next = vouchers.map((v) => (v.id === id ? { ...v, enabled: v.enabled === false } : v));
    setVouchers(next);
    saveVouchers(next);
    toast.success("Voucher status updated");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900">Available Vouchers & Gift Cards</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {vouchers.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Add, edit, or remove reward vouchers that users can claim on the withdrawal page (
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] font-mono text-slate-700">
              /withdraw-points
            </code>
            ).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to default vouchers"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Voucher
          </button>
        </div>
      </div>

      {/* Vouchers Grid Display */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((v) => {
          const Icon = getVoucherIconComponent(v.icon);
          const colors = getVoucherColorClasses(v.color);
          const isOff = v.enabled === false;

          return (
            <div
              key={v.id}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                isOff
                  ? "border-dashed border-slate-200 bg-slate-50/70 opacity-60"
                  : v.featured
                    ? "border-amber-300 bg-amber-50/40 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                {/* Header tags & badges */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${colors.bg} ${colors.text} shadow-xs shrink-0`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {v.featured && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs">
                        Featured
                      </span>
                    )}
                    {v.freeUnlock && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs">
                        Free Unlock
                      </span>
                    )}
                    {isOff && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {v.tag || "Reward"}
                  </p>
                  <h3 className="mt-0.5 text-sm font-bold text-slate-900 leading-snug">{v.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Cost:{" "}
                    <span className="font-bold text-slate-900">
                      {v.cost === 0 ? "Free" : `₹${v.cost} (${v.cost} pts)`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleToggleEnabled(v.id)}
                  className={`text-[11px] font-semibold transition ${
                    isOff ? "text-emerald-600 hover:underline" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {isOff ? "Enable" : "Disable"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Pencil className="h-3.5 w-3.5 text-slate-500" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="rounded-md border border-slate-200 bg-white p-1 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete Voucher"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Voucher Modal */}
      {editingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {isNew ? "Add New Voucher" : "Edit Voucher"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVoucher(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Voucher Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingVoucher.title}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, title: e.target.value })}
                  placeholder="e.g. Amazon Gift Card ₹500, Phone Recharge ₹299"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Points Cost *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingVoucher.cost}
                    onChange={(e) =>
                      setEditingVoucher({ ...editingVoucher, cost: Math.max(0, Number(e.target.value)) })
                    }
                    placeholder="e.g. 500 (0 for Free)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">0 means Free for users</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingVoucher.tag}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, tag: e.target.value })}
                    placeholder="e.g. Shopping, Mobile, Food, Cash"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const Ic = item.icon;
                    const selected = editingVoucher.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setEditingVoucher({ ...editingVoucher, icon: item.name })}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition ${
                          selected
                            ? "border-rose-500 bg-rose-50 text-rose-600 shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Ic className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-medium truncate w-full">{item.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Badge Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_OPTIONS.map((c) => {
                    const selected = editingVoucher.color === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setEditingVoucher({ ...editingVoucher, color: c.name })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                          selected ? `${c.border} ${c.bg} ${c.text} ring-2 ring-rose-500 ring-offset-1` : `${c.bg} ${c.text} opacity-70 hover:opacity-100`
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVoucher.featured || false}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, featured: e.target.checked })}
                    className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Mark as Featured Voucher (Gold highlight)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVoucher.freeUnlock || false}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, freeUnlock: e.target.checked })}
                    className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Free Unlock for First Withdrawal (Unlocks remaining vouchers)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVoucher(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                >
                  {isNew ? "Create Voucher" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
export default VouchersManager;
