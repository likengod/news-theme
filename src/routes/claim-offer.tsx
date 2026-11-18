import { useEffect, useState } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Store,
  Tag,
  Search,
  Calendar,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  verifyPromoCodeServer,
  claimPromoCodeInStoreServer,
  type VerificationResult,
} from "@/lib/vouchers";

type SearchParams = {
  code?: string;
};

export const Route = createFileRoute("/claim-offer")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      code: typeof search.code === "string" ? search.code : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Verify & Claim Promo Code – Partner Merchant Portal" },
      {
        name: "description",
        content: "Store portal to verify and redeem customer discount vouchers and QR promo codes.",
      },
    ],
  }),
  component: ClaimOfferPage,
});

function ClaimOfferPage() {
  const search = useSearch({ from: "/claim-offer" });
  const [codeInput, setCodeInput] = useState<string>(search.code || "");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [storeName, setStoreName] = useState<string>("Local Partner Store");
  const [claimedSuccess, setClaimedSuccess] = useState<boolean>(false);
  const [claimedRecord, setClaimedRecord] = useState<any>(null);

  const verifyCode = async (codeToTest: string) => {
    const clean = codeToTest.trim();
    if (!clean) {
      toast.error("Please enter a promo code");
      return;
    }
    setLoading(true);
    setClaimedSuccess(false);
    try {
      const res = await verifyPromoCodeServer({ data: { code: clean } });
      setResult(res);
      if (res.status === "valid") {
        toast.success("Promo code is valid and ready to claim!");
      } else if (res.status === "already_used") {
        toast.error("This promo code has ALREADY been used!");
      } else if (res.status === "expired") {
        toast.warning("This promo code has expired.");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify promo code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.code) {
      setCodeInput(search.code);
      verifyCode(search.code);
    }
  }, [search.code]);

  const handleClaim = async () => {
    if (!codeInput.trim()) return;
    setSubmitting(true);
    try {
      const res = await claimPromoCodeInStoreServer({
        data: {
          code: codeInput.trim(),
          storeName: storeName.trim() || "Local Partner Store",
        },
      });
      setClaimedSuccess(true);
      setClaimedRecord(res.record);
      setResult(null);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err?.message || "Failed to claim promo code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCodeInput("");
    setResult(null);
    setClaimedSuccess(false);
    setClaimedRecord(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12 flex-1 w-full">
        {/* Banner / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-3">
            <Store className="h-4 w-4" /> Partner Merchant Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Verify & Claim Store Offer
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Scan customer QR code or input the promo code below to verify validity, check previous
            usage, and grant the store discount.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Enter Promo / Voucher Code
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && verifyCode(codeInput)}
                placeholder="e.g. STORE50-AB12 or NT-FLIPKART500-..."
                className="w-full font-mono text-sm uppercase rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
              />
            </div>
            <button
              type="button"
              disabled={loading || !codeInput.trim()}
              onClick={() => verifyCode(codeInput)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {loading ? (
                "Checking..."
              ) : (
                <>
                  <Search className="h-4 w-4" /> Check Offer
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. SUCCESS: Just Claimed Screen */}
        {claimedSuccess && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-6 text-center shadow-md animate-in fade-in duration-200 space-y-4">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Discount Successfully Applied
              </span>
              <h2 className="mt-2 text-xl font-black text-emerald-950">
                Promo Code Redeemed!
              </h2>
              <p className="mt-1 text-xs text-emerald-700">
                This coupon code has now been permanently locked and marked as used.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-left text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Promo Code:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {claimedRecord?.code || codeInput}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Store / Merchant:</span>
                <span className="font-semibold text-slate-900">
                  {claimedRecord?.usedByStoreName || storeName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Time of Redemption:</span>
                <span className="font-semibold text-slate-900">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
            >
              <RotateCcw className="h-4 w-4" /> Check Another Code
            </button>
          </div>
        )}

        {/* 2. ALREADY USED Screen */}
        {result?.status === "already_used" && (
          <div className="rounded-2xl border-2 border-red-300 bg-red-50/90 p-6 shadow-sm animate-in fade-in duration-200 space-y-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-white shrink-0">
                <XCircle className="h-6 w-6" />
              </span>
              <div>
                <span className="rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-900">
                  Action Blocked
                </span>
                <h2 className="text-lg font-black text-red-950 mt-1">
                  ALREADY USED & REDEEMED
                </h2>
                <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-white/90 p-4 text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Offer Title:</span>
                <span className="font-bold text-slate-900">
                  {result.record?.voucherTitle || result.voucher?.title}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Code:</span>
                <span className="font-mono font-bold text-red-700">
                  {result.record?.code}
                </span>
              </div>
              {result.record?.usedAt && (
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">First Used At:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(result.record.usedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {result.record?.usedByStoreName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Redeemed At:</span>
                  <span className="font-semibold text-slate-900">
                    {result.record.usedByStoreName}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-red-700 text-center font-medium">
              ⚠️ Do NOT provide discounts for this coupon. It has already been redeemed once.
            </p>
          </div>
        )}

        {/* 3. EXPIRED Screen */}
        {result?.status === "expired" && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-6 shadow-sm animate-in fade-in duration-200 space-y-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-600 text-white shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div>
                <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Validity Expired
                </span>
                <h2 className="text-lg font-black text-amber-950 mt-1">
                  Coupon Expired
                </h2>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/90 p-4 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Expired Date:</span>
                <span className="font-bold text-amber-900">
                  {result.record?.expiresAt
                    ? new Date(result.record.expiresAt).toLocaleDateString()
                    : "Expired"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. INVALID / UNCLAIMED Screen */}
        {(result?.status === "invalid" || result?.status === "unclaimed_by_user") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Code Not Recognized</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {result.message}
            </p>
          </div>
        )}

        {/* 5. VALID & READY TO CLAIM Screen */}
        {result?.status === "valid" && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-white p-6 shadow-lg animate-in fade-in duration-200 space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Verified & Ready
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  {result.record?.voucherTitle || result.voucher?.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {result.record?.discountDescription || result.voucher?.description}
                </p>
              </div>
            </div>

            {/* Offer detail card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Promo Code:</span>
                <span className="font-mono font-black text-rose-600 text-base">
                  {result.record?.code}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Customer Claim Date:</span>
                <span className="font-semibold text-slate-800">
                  {result.record?.claimedAt
                    ? new Date(result.record.claimedAt).toLocaleDateString()
                    : "Active"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valid Until:</span>
                <span className="font-bold text-emerald-700">
                  {result.record?.expiresAt
                    ? new Date(result.record.expiresAt).toLocaleDateString()
                    : "No expiration"}
                </span>
              </div>
            </div>

            {/* Store Name input */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                Store Name / Cashier Name (for record):
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Agartala Branch / Cashier 1"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Big Action Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleClaim}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50"
            >
              {submitting ? (
                "Redeeming..."
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Mark as Claimed / Grant Discount
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              ⚠️ Once you click "Mark as Claimed", this code will be permanently used and cannot be claimed again.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/withdraw-points"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            ← Back to Withdraw Points
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
