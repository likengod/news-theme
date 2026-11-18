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
  Boxes,
  KeyRound,
  History,
  Tag,
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
  { name: "Tag", label: "Discount Coupon", icon: Tag },
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
  const [rawCodesInput, setRawCodesInput] = useState("");
  const [historyVoucher, setHistoryVoucher] = useState<Voucher | null>(null);

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
      stockType: "codes_pool",
      stock: 50,
      codesPool: [],
      claimedCodes: [],
      description: "",
      expiryDays: 30,
    });
    setRawCodesInput("");
    setIsNew(true);
  };

  const handleOpenEdit = (v: Voucher) => {
    setEditingVoucher({ ...v });
    setRawCodesInput((v.codesPool || []).join("\n"));
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

    // Process promo codes pool if chosen
    let updatedVoucher = { ...editingVoucher };
    if (editingVoucher.stockType === "codes_pool") {
      const parsedCodes = rawCodesInput
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean);
      updatedVoucher.codesPool = parsedCodes;
      updatedVoucher.stock = parsedCodes.length;
    }

    const next = isNew
      ? [...vouchers, updatedVoucher]
      : vouchers.map((v) => (v.id === updatedVoucher.id ? updatedVoucher : v));

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
            <h2 className="text-base font-bold text-slate-900">Available Vouchers, Gift Cards & Promo Inventory</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {vouchers.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage your store coupons, pre-loaded local discount promo codes (50%, 60%, 70%), wallet gift cards, and live withdrawal stock.
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
            Add New Voucher / Promo Pool
          </button>
        </div>
      </div>

      {/* Vouchers Grid Display */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((v) => {
          const Icon = getVoucherIconComponent(v.icon);
          const colors = getVoucherColorClasses(v.color);
          const isOff = v.enabled === false;
          const remainingStock =
            v.stockType === "codes_pool"
              ? (v.codesPool || []).length
              : v.stockType === "limited"
                ? (v.stock ?? 0)
                : null;
          const claimedCount = (v.claimedCodes || []).length;

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
                  {v.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <p className="text-slate-500">
                      Cost:{" "}
                      <span className="font-bold text-slate-900">
                        {v.cost === 0 ? "Free" : `₹${v.cost} (${v.cost} pts)`}
                      </span>
                    </p>

                    {/* Stock badge */}
                    {v.stockType === "unlimited" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                        <Boxes className="h-3 w-3" /> Unlimited
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                          (remainingStock ?? 0) > 5
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : (remainingStock ?? 0) > 0
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <Boxes className="h-3 w-3" />
                        {(remainingStock ?? 0) > 0 ? `${remainingStock} in stock` : "Out of stock"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Claimed counter */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(v.id)}
                    className={`text-[11px] font-semibold transition ${
                      isOff ? "text-emerald-600 hover:underline" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {isOff ? "Enable" : "Disable"}
                  </button>

                  {claimedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setHistoryVoucher(v)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <History className="h-3 w-3" />
                      {claimedCount} claimed
                    </button>
                  )}
                </div>

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

      {/* Claimed Codes History Modal */}
      {historyVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Claimed Redemption Codes: {historyVoucher.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryVoucher(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto space-y-2">
              {(historyVoucher.claimedCodes || []).length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No codes claimed yet.</p>
              ) : (
                historyVoucher.claimedCodes!.map((c, i) => {
                  const isUsedInStore = c.status === "used_in_store";
                  const isExpired = c.expiresAt && new Date() > new Date(c.expiresAt);
                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">
                            {c.code}
                          </span>
                          {c.userId && (
                            <span className="text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.2 rounded">
                              User: {c.userId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Issued: {new Date(c.claimedAt).toLocaleString()}
                        </p>
                        {c.expiresAt && (
                          <p className="text-[10px] text-slate-400">
                            Valid until: {new Date(c.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                        {isUsedInStore && c.usedAt && (
                          <p className="text-[11px] font-semibold text-blue-700 mt-0.5">
                            ✅ Used at store: {c.usedByStoreName || "Store"} ({new Date(c.usedAt).toLocaleString()})
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isUsedInStore ? (
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-800">
                            Used in Store
                          </span>
                        ) : isExpired ? (
                          <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                            Expired
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                            Active (Unclaimed in Store)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Voucher Modal */}
      {editingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {isNew ? "Add New Voucher / Promo Pool" : "Edit Voucher & Inventory"}
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
                  placeholder="e.g. Agartala Fashion 50% Off, Flipkart Wallet ₹500, Swiggy ₹200"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description / Store Offer Terms
                </label>
                <input
                  type="text"
                  value={editingVoucher.description || ""}
                  onChange={(e) => setEditingVoucher({ ...editingVoucher, description: e.target.value })}
                  placeholder="e.g. Valid at Agartala store on purchases above ₹1,000. Show code at counter."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <span className="text-[10px] text-slate-400">0 means Free for readers</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingVoucher.tag}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, tag: e.target.value })}
                    placeholder="e.g. Local Store, Shopping, Food"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Expiry Validity (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingVoucher.expiryDays ?? 30}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        expiryDays: Math.max(1, Number(e.target.value) || 30),
                      })
                    }
                    placeholder="e.g. 30"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">e.g. 30 days after claim</span>
                </div>
              </div>

              {/* Stock & Delivery Mode */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                  Inventory & Stock Delivery Mode
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingVoucher({ ...editingVoucher, stockType: "codes_pool" })}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      editingVoucher.stockType === "codes_pool"
                        ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <p className="font-bold text-xs flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-rose-500" /> Pre-loaded Codes
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Paste 50, 60 unique promo codes</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingVoucher({ ...editingVoucher, stockType: "limited" })}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      editingVoucher.stockType === "limited"
                        ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <p className="font-bold text-xs flex items-center gap-1.5">
                      <Boxes className="h-3.5 w-3.5 text-indigo-500" /> Limited Stock
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Set numeric limit (e.g. 50 items)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingVoucher({ ...editingVoucher, stockType: "unlimited" })}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      editingVoucher.stockType === "unlimited"
                        ? "border-rose-500 bg-white text-rose-700 shadow-xs ring-1 ring-rose-500"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <p className="font-bold text-xs flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-amber-500" /> Unlimited
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Always available to readers</p>
                  </button>
                </div>

                {editingVoucher.stockType === "codes_pool" && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Paste Unique Promo Codes (One code per line):
                      </label>
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                        {rawCodesInput.split("\n").filter((c) => c.trim()).length} Codes in Pool
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={rawCodesInput}
                      onChange={(e) => setRawCodesInput(e.target.value)}
                      placeholder={`AGARTALA50-A101\nAGARTALA50-B202\nAGARTALA50-C303\n...`}
                      className="w-full font-mono text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800 focus:border-rose-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500">
                      💡 Each reader who claims this voucher will instantly receive one unused code from this pool. Once all codes are claimed, it automatically shows "Out of Stock" on the withdrawal page.
                    </p>
                  </div>
                )}

                {editingVoucher.stockType === "limited" && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Available Stock Quantity:
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingVoucher.stock ?? 50}
                      onChange={(e) =>
                        setEditingVoucher({ ...editingVoucher, stock: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-48 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium bg-white"
                    />
                  </div>
                )}
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
