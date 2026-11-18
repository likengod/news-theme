import { useEffect, useState } from "react";
import {
  Gift,
  QrCode,
  Copy,
  Check,
  Calendar,
  Store,
  ShieldCheck,
  ExternalLink,
  Tag,
  ArrowRight,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import {
  getUserClaimedVouchersServer,
  type ClaimedCodeRecord,
} from "@/lib/vouchers";
import { VoucherQrModal } from "@/components/vouchers/VoucherQrModal";

interface UserWalletVouchersProps {
  userId: string;
}

export function UserWalletVouchers({ userId }: UserWalletVouchersProps) {
  const [loading, setLoading] = useState(true);
  const [claimedList, setClaimedList] = useState<ClaimedCodeRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeModalRecord, setActiveModalRecord] = useState<ClaimedCodeRecord | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserClaimedVouchersServer({ data: { userId } })
      .then((records) => {
        if (Array.isArray(records) && records.length > 0) {
          setClaimedList(records);
        } else {
          // Check local fallback
          try {
            const raw = localStorage.getItem(`nt:withdraw:v1:${userId}`);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed?.claimed) {
                const localList: ClaimedCodeRecord[] = Object.entries(parsed.claimed).map(
                  ([vId, code]) => ({
                    code: String(code),
                    userId,
                    claimedAt: new Date().toISOString(),
                    voucherId: vId,
                    voucherTitle: vId.toUpperCase(),
                    status: "active",
                    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
                  }),
                );
                setClaimedList(localList);
              }
            }
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Promo code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Loading your vouchers & promo passes...
      </div>
    );
  }

  if (claimedList.length === 0) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
          <Gift className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Vouchers Claimed Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Earn points by reading news or completing tasks, then redeem your points for local store
          discount promo codes and wallet gift cards!
        </p>
        <Link
          to="/withdraw-points"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs mt-2"
        >
          Browse Available Vouchers <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Gift className="h-5 w-5 text-rose-500" /> My Claimed Vouchers & Promo Passes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Present your QR code or promo code at partner stores to redeem your discounts.
          </p>
        </div>
        <Link
          to="/withdraw-points"
          className="text-xs font-bold text-emerald-700 hover:underline"
        >
          + Claim More
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {claimedList.map((item, idx) => {
          const isUsed = item.status === "used_in_store";
          const isExpired = item.status === "expired" || (item.expiresAt && new Date() > new Date(item.expiresAt));
          const isCopied = copiedCode === item.code;

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4.5 transition flex flex-col justify-between ${
                isUsed
                  ? "border-blue-200 bg-blue-50/30"
                  : isExpired
                    ? "border-slate-200 bg-slate-50 opacity-70"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Coupon Pass
                  </span>
                  {isUsed ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                      Redeemed in Store
                    </span>
                  ) : isExpired ? (
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      Expired
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Ready to Use
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                  {item.voucherTitle}
                </h3>
                {item.discountDescription && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {item.discountDescription}
                  </p>
                )}

                {/* Promo Code Box */}
                <div className="mt-3 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/60 p-2.5">
                  <span className="font-mono text-sm font-black text-rose-900 tracking-wider">
                    {item.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.code)}
                    className="rounded-lg bg-white p-1.5 text-slate-600 hover:text-slate-900 border border-rose-200 shadow-2xs transition"
                    title="Copy Promo Code"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Dates */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>
                      Valid until:{" "}
                      <strong className="text-slate-800">
                        {item.expiresAt
                          ? new Date(item.expiresAt).toLocaleDateString()
                          : "No expiry"}
                      </strong>
                    </span>
                  </div>

                  {isUsed && item.usedAt && (
                    <div className="flex items-center gap-1 text-blue-700 font-semibold">
                      <Store className="h-3 w-3 text-blue-500" />
                      <span>
                        Redeemed at: {item.usedByStoreName || "Store"} ({new Date(item.usedAt).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalRecord(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 px-3 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  View QR & Download
                </button>
                <Link
                  to="/claim-offer"
                  search={{ code: item.code }}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition"
                  title="Store Verification Link"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Modal */}
      {activeModalRecord && (
        <VoucherQrModal
          isOpen={true}
          onClose={() => setActiveModalRecord(null)}
          voucherTitle={activeModalRecord.voucherTitle}
          code={activeModalRecord.code}
          expiresAt={activeModalRecord.expiresAt}
          claimedAt={activeModalRecord.claimedAt}
          description={activeModalRecord.discountDescription}
          status={activeModalRecord.status}
          usedAt={activeModalRecord.usedAt}
          usedByStoreName={activeModalRecord.usedByStoreName}
        />
      )}
    </div>
  );
}
export default UserWalletVouchers;
