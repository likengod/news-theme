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
  RotateCcw,
  Sparkles,
  Building2,
  QrCode,
  Copy,
  Check,
  BadgePercent,
  Clock,
  Info,
} from "lucide-react";
import { toast, Toaster } from "sonner";
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
  const [copied, setCopied] = useState(false);

  const verifyCode = async (codeToTest: string) => {
    const clean = codeToTest.trim();
    if (!clean) {
      toast.error("Please enter a promo code first", { position: "top-center" });
      return;
    }
    setLoading(true);
    setClaimedSuccess(false);
    try {
      const res = await verifyPromoCodeServer({ data: { code: clean } });
      setResult(res);
      if (res.status === "valid") {
        toast.success("Promo code verified! Ready to claim.", {
          position: "top-center",
          duration: 4000,
        });
      } else if (res.status === "already_used") {
        toast.error("Code was ALREADY USED! Duplicate redemption blocked.", {
          position: "top-center",
          duration: 5000,
        });
      } else if (res.status === "expired") {
        toast.warning("This promo code has expired.", {
          position: "top-center",
          duration: 5000,
        });
      } else {
        toast.error(res.message, {
          position: "top-center",
          duration: 4000,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify promo code", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.code) {
      const upper = search.code.toUpperCase();
      setCodeInput(upper);
      verifyCode(upper);
    }
  }, [search.code]);

  const handleClaim = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setSubmitting(true);
    try {
      const res = await claimPromoCodeInStoreServer({
        data: {
          code,
          storeName: storeName.trim() || "Local Partner Store",
        },
      });
      setClaimedSuccess(true);
      setClaimedRecord(res.record);
      setResult(null);
      toast.success(res.message, { position: "top-center", duration: 5000 });
    } catch (err: any) {
      toast.error(err?.message || "Failed to claim promo code", {
        position: "top-center",
        duration: 5000,
      });
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

  const copyCodeToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    toast.success("Code copied to clipboard!", { position: "top-center" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-background text-foreground flex flex-col justify-between">
      {/* Centered Sonner Toaster */}
      <Toaster position="top-center" richColors closeButton />

      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12 flex-1 w-full">
        {/* Header Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 shadow-2xs dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 mb-3">
            <Store className="h-4 w-4" /> Partner Merchant Verification Portal
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Verify & Claim Promo Code
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Scan customer QR codes or type promo codes to check real-time validity, discount terms, previous usage, and permanently claim discounts.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md dark:border-border dark:bg-card mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
            Enter Promo / Voucher Code
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && verifyCode(codeInput)}
                placeholder="e.g. STORE50-A101 or NT-VOUCHER-..."
                className="w-full font-mono text-sm uppercase rounded-xl border border-slate-200 pl-10 pr-4 py-3 bg-slate-50 font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-border dark:bg-muted/40 dark:text-white dark:focus:bg-muted transition"
              />
            </div>
            <button
              type="button"
              disabled={loading || !codeInput.trim()}
              onClick={() => verifyCode(codeInput)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-rose-700 active:scale-[0.99] disabled:opacity-50 transition shrink-0"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" /> Checking...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Check Offer
                </>
              )}
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            Both admin-generated pre-loaded promo codes and user-withdrawn voucher passes can be verified.
          </p>
        </div>

        {/* 1. SUCCESS: Just Claimed Screen */}
        {claimedSuccess && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-6 sm:p-7 text-center shadow-lg dark:bg-emerald-950/40 dark:border-emerald-600 animate-in fade-in duration-200 space-y-4 mb-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                Discount Successfully Applied
              </span>
              <h2 className="mt-2.5 text-2xl font-black text-emerald-950 dark:text-emerald-100">
                Promo Code Redeemed!
              </h2>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                This code is now permanently locked and marked as used in the database.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-4 text-left text-xs space-y-2.5 shadow-2xs dark:border-emerald-900/60 dark:bg-card">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Promo Code:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {claimedRecord?.code || codeInput}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Offer Title:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {claimedRecord?.voucherTitle || "Store Offer"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Store / Branch:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {claimedRecord?.usedByStoreName || storeName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Time of Redemption:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-800 shadow-xs transition"
            >
              <RotateCcw className="h-4 w-4" /> Verify Another Code
            </button>
          </div>
        )}

        {/* 2. ALREADY USED Screen (High Warning) */}
        {result?.status === "already_used" && (
          <div className="rounded-2xl border-2 border-red-400 bg-red-50/95 p-6 shadow-md dark:bg-red-950/40 dark:border-red-600 animate-in fade-in duration-200 space-y-4 mb-6">
            <div className="flex items-start gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-600 text-white shadow-xs shrink-0">
                <XCircle className="h-7 w-7" />
              </span>
              <div>
                <span className="rounded bg-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-900 dark:bg-red-900/60 dark:text-red-200">
                  Duplicate Redemption Blocked
                </span>
                <h2 className="text-xl font-black text-red-950 dark:text-red-100 mt-1">
                  ALREADY USED & REDEEMED
                </h2>
                <p className="text-xs text-red-800 dark:text-red-300 mt-0.5 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-white p-4 text-xs space-y-2 dark:border-red-900/50 dark:bg-card">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5">
                <span className="text-slate-500">Offer Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {result.record?.voucherTitle || result.voucher?.title}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5">
                <span className="text-slate-500">Code:</span>
                <span className="font-mono font-bold text-red-700 dark:text-red-400">
                  {result.record?.code}
                </span>
              </div>
              {result.record?.usedAt && (
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-border/60 pb-1.5">
                  <span className="text-slate-500">First Used On:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {new Date(result.record.usedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {result.record?.usedByStoreName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Redeemed At:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {result.record.usedByStoreName}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-red-100/90 dark:bg-red-900/30 p-2.5 text-center text-xs font-bold text-red-800 dark:text-red-200">
              ⚠️ DO NOT provide discounts for this code. It has already been redeemed once!
            </div>
          </div>
        )}

        {/* 3. EXPIRED Screen */}
        {result?.status === "expired" && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-6 shadow-sm dark:bg-amber-950/40 dark:border-amber-700 animate-in fade-in duration-200 space-y-4 mb-6">
            <div className="flex items-start gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-600 text-white shadow-xs shrink-0">
                <AlertTriangle className="h-7 w-7" />
              </span>
              <div>
                <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  Validity Expired
                </span>
                <h2 className="text-xl font-black text-amber-950 dark:text-amber-100 mt-1">
                  Coupon Expired
                </h2>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white p-4 text-xs space-y-2 dark:border-amber-900/50 dark:bg-card">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Expired Date:</span>
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  {result.record?.expiresAt
                    ? new Date(result.record.expiresAt).toLocaleDateString()
                    : "Expired"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. INVALID Screen */}
        {result?.status === "invalid" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 text-center shadow-sm dark:border-border dark:bg-card space-y-3 mb-6">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-muted dark:text-slate-400">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Code Not Recognized</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {result.message}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-rose-600 hover:underline pt-2"
            >
              Try Another Code
            </button>
          </div>
        )}

        {/* 5. VALID & READY TO CLAIM Screen */}
        {result?.status === "valid" && (
          <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6 sm:p-7 shadow-xl dark:border-emerald-600 dark:bg-card animate-in fade-in duration-200 space-y-5 mb-6">
            {/* Header Badge & Title */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-2xs dark:bg-emerald-950 dark:text-emerald-400 shrink-0">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      ✓ Code Verified & Valid
                    </span>
                    {result.voucher?.tag && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-muted dark:text-slate-300">
                        {result.voucher.tag}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {result.record?.voucherTitle || result.voucher?.title}
                  </h2>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right dark:bg-emerald-950/40 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Status</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Ready to Claim</span>
              </div>
            </div>

            {/* Description */}
            {(result.record?.discountDescription || result.voucher?.description) && (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-muted/40 p-3 rounded-xl border border-slate-100 dark:border-border leading-relaxed">
                {result.record?.discountDescription || result.voucher?.description}
              </p>
            )}

            {/* Offer Detail Card */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs space-y-2.5 dark:border-border dark:bg-muted/20">
              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-border/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Promo Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-rose-600 text-base sm:text-lg tracking-wide">
                    {result.record?.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCodeToClipboard(result.record?.code || "")}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                    title="Copy Code"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-border/60 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Valid Until:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {result.record?.expiresAt
                    ? new Date(result.record.expiresAt).toLocaleDateString()
                    : "Active"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Redemption Type:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Single-Use In-Store Discount
                </span>
              </div>
            </div>

            {/* Store Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Store Name / Branch Name (Saved for your audit log):
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Agartala City Store / Cashier Counter 1"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none dark:border-border dark:bg-muted/40 dark:text-white"
                />
              </div>
            </div>

            {/* Big Claim Action Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleClaim}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-5 text-sm sm:text-base font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.99] transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" /> Redeeming & Locking Code...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Claim Offer & Apply Discount (Mark as Used)
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              🔒 <strong>Single-Use Protection:</strong> Clicking "Claim Offer" permanently marks this code as used in the database. It cannot be used again by anyone.
            </p>
          </div>
        )}

        {/* 3 Step Merchant Guide Card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-border dark:bg-card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center">
            How Store Verification Works
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs mx-auto mb-2">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Scan or Enter</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Scan customer QR pass or type the promo code above.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs mx-auto mb-2">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant Check</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Verify discount title, active validity, and check for duplicate usage.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/60">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs mx-auto mb-2">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Claim & Lock</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Click claim to grant discount and permanently lock code against reuse.
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/withdraw-points"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          >
            ← Back to Withdraw Points
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
