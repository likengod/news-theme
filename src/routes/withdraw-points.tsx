import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Wallet,
  Gift,
  Check,
  Lock,
  QrCode,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient as supabase } from "@/lib/auth-client";
import { submitWithdrawRequest } from "@/lib/inbox.functions";
import {
  type Voucher,
  loadVouchers,
  getVouchersServer,
  redeemVoucherServer,
} from "@/lib/vouchers";
import {
  getVoucherIconComponent,
  getVoucherColorClasses,
} from "@/components/admin/rewards/VouchersManager";
import { VoucherQrModal } from "@/components/vouchers/VoucherQrModal";

export const Route = createFileRoute("/withdraw-points")({
  head: () => ({
    meta: [
      { title: "Withdraw Points – News Theme Wallet" },
      {
        name: "description",
        content: "Redeem your wallet points for premium subscriptions, recharges, and gift cards.",
      },
    ],
  }),
  component: WithdrawPointsPage,
});

const MIN_WITHDRAW = 256;

const STORAGE = "nt:withdraw:v1";

type State = { balance: number; claimed: Record<string, string> };

function load(userId: string): State {
  if (typeof window === "undefined") return { balance: 0, claimed: {} };
  try {
    const raw = localStorage.getItem(`${STORAGE}:${userId}`);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return { balance: 0, claimed: {} };
}
function save(userId: string, s: State) {
  localStorage.setItem(`${STORAGE}:${userId}`, JSON.stringify(s));
  localStorage.setItem(`nt:points:${userId}`, String(s.balance));
}

function WithdrawPointsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [state, setState] = useState<State>({ balance: 0, claimed: {} });
  const [vouchers, setVouchers] = useState<Voucher[]>(() =>
    loadVouchers().filter((v) => v.enabled !== false),
  );

  const [selectedQrVoucher, setSelectedQrVoucher] = useState<{
    voucher: Voucher;
    code: string;
    expiresAt?: string;
  } | null>(null);

  // Responsive Pagination: Desktop default 16 (4x4), Tablet default 12 (4x3), Mobile default 6
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 16;
      if (window.innerWidth >= 768) return 12;
      return 6;
    }
    return 16;
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getVouchersServer()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVouchers(data.filter((v) => v.enabled !== false));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (!u) return;
      setUserId(u.id);
      setUserEmail(u.email);
      setUserName(u.user_metadata?.display_name || u.user_metadata?.full_name);
      const s = load(u.id);
      const wallet = Number(localStorage.getItem(`nt:points:${u.id}`) ?? "0");
      s.balance = wallet;
      save(u.id, s);
      setState({ ...s });
    });
  }, []);

  const canWithdraw = state.balance >= MIN_WITHDRAW;
  const hasClaimedFree = Object.keys(state.claimed).some(
    (id) => vouchers.find((v) => v.id === id)?.freeUnlock,
  );

  const claim = async (v: Voucher) => {
    if (!userId) return toast.error("Please sign in first");
    if (!canWithdraw) return toast.error(`You need at least ${MIN_WITHDRAW} points to withdraw`);
    if (state.claimed[v.id]) return toast.info("Already claimed");
    if (!v.freeUnlock && !hasClaimedFree) {
      return toast.error("Claim your free 6-month Premium first to unlock other vouchers");
    }
    if (state.balance < v.cost) return toast.error("Not enough points");

    const remainingStock =
      v.stockType === "codes_pool"
        ? (v.codesPool || []).length
        : v.stockType === "limited"
          ? (v.stock ?? 0)
          : null;
    if (remainingStock !== null && remainingStock <= 0) {
      return toast.error("Sorry, this voucher is currently out of stock!");
    }

    try {
      // 1. Redeem on server (pops from pre-loaded promo code pool if available)
      let finalCode = "";
      let expiresAt: string | undefined;
      try {
        const res = await redeemVoucherServer({
          data: {
            voucherId: v.id,
            userId: userId || undefined,
            userName,
            userEmail,
          },
        });
        finalCode = res.code;
        expiresAt = res.expiresAt;
        if (res.vouchers) {
          setVouchers(res.vouchers.filter((item) => item.enabled !== false));
        }
      } catch (srvErr: any) {
        finalCode = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const days = typeof v.expiryDays === "number" && v.expiryDays > 0 ? v.expiryDays : 30;
        expiresAt = new Date(Date.now() + days * 86400000).toISOString();
      }

      // 2. Submit withdrawal log to admin inbox
      submitWithdrawRequest({
        data: {
          voucherId: v.id,
          voucherTitle: v.title,
          amount: v.cost,
          paymentMethod: "voucher",
        },
      }).catch(() => {});

      const next: State = {
        balance: state.balance - v.cost,
        claimed: { ...state.claimed, [v.id]: finalCode },
      };
      save(userId, next);
      setState(next);
      toast.success(`Voucher claimed! Your Code: ${finalCode}`);

      // Open QR Pass Modal automatically
      setSelectedQrVoucher({
        voucher: v,
        code: finalCode,
        expiresAt,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to claim voucher");
    }
  };

  const progress = Math.min(100, (state.balance / MIN_WITHDRAW) * 100);

  const totalPages = Math.max(1, Math.ceil(vouchers.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, vouchers.length);
  const paginatedVouchers = vouchers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Wallet
            </p>
            <h1 className="mt-2 font-serif text-4xl font-bold">Withdraw Points</h1>
          </div>
          <Link
            to="/earn-points"
            className="text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            ← Back to Earn Points
          </Link>
        </header>

        {/* Balance */}
        <section className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/40 dark:to-background">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
                <Wallet className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Wallet balance
                </p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  ₹{state.balance}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={!canWithdraw}
              onClick={() =>
                canWithdraw
                  ? toast.success("Withdrawals unlocked — pick a voucher below")
                  : toast.error(`Reach ${MIN_WITHDRAW} points to unlock withdrawals`)
              }
              className={`rounded-md px-5 py-2 text-sm font-bold text-white transition ${
                canWithdraw
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "cursor-not-allowed bg-muted-foreground/40"
              }`}
            >
              {canWithdraw ? "Withdraw" : `Locked · ${MIN_WITHDRAW}+ needed`}
            </button>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {canWithdraw
                ? "You can withdraw now."
                : `${MIN_WITHDRAW - state.balance} more points to unlock withdrawals.`}
            </p>
          </div>
        </section>

        {/* Vouchers */}
        <section id="vouchers-catalog">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Gift className="h-5 w-5 text-rose-500" /> Available Vouchers
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {vouchers.length} Total
                </span>
              </h2>
              {vouchers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {startIndex + 1}–{endIndex} of {vouchers.length} vouchers
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Per-Page Selector Pills */}
              <div className="flex items-center gap-1 text-xs bg-muted/60 p-1 rounded-lg border border-border">
                <span className="text-[11px] font-medium text-muted-foreground px-1.5 hidden sm:inline">Per page:</span>
                {[6, 9, 12, 16].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      itemsPerPage === size
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Link
                to="/profile"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
              >
                <Sparkles className="h-3.5 w-3.5" /> My Claimed Passes
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {paginatedVouchers.map((v) => {
              const Icon = getVoucherIconComponent(v.icon);
              const colors = getVoucherColorClasses(v.color);
              const claimedCode = state.claimed[v.id];
              const remainingStock =
                v.stockType === "codes_pool"
                  ? (v.codesPool || []).length
                  : v.stockType === "limited"
                    ? (v.stock ?? 0)
                    : null;
              const isOutOfStock = remainingStock !== null && remainingStock <= 0;
              const locked = !canWithdraw || (!v.freeUnlock && !hasClaimedFree) || isOutOfStock;
              return (
                <div
                  key={v.id}
                  className={`relative overflow-hidden rounded-xl border p-5 transition flex flex-col justify-between ${
                    isOutOfStock
                      ? "border-dashed border-border bg-muted/30 opacity-75"
                      : v.featured
                        ? "border-amber-300 bg-amber-50/60 dark:bg-amber-950/20"
                        : "border-border bg-card"
                  }`}
                >
                  <div>
                    {v.featured && (
                      <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Free
                      </span>
                    )}
                    <span
                      className={`mb-3 grid h-10 w-10 place-items-center rounded-full ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {v.tag}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug">{v.title}</p>
                    {v.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {v.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <p className="text-muted-foreground">
                        Cost:{" "}
                        <span className="font-semibold text-foreground">
                          {v.cost === 0 ? "Free" : `₹${v.cost}`}
                        </span>
                      </p>

                      {remainingStock !== null && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            remainingStock > 5
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : remainingStock > 0
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {remainingStock > 0 ? `${remainingStock} in stock` : "Out of Stock"}
                        </span>
                      )}
                    </div>
                  </div>

                  {claimedCode ? (
                    <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-xs dark:bg-emerald-950/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                          Claimed Code:
                        </span>
                        <span className="font-mono font-bold text-emerald-950 dark:text-emerald-100 text-sm">
                          {claimedCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedQrVoucher({
                            voucher: v,
                            code: claimedCode,
                          })
                        }
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2 px-3 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        View QR Pass / Download
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => claim(v)}
                      disabled={locked}
                      className={`mt-4 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-bold transition ${
                        locked
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : v.featured
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {locked ? <Lock className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                      {isOutOfStock ? "Out of Stock" : locked ? "Locked" : v.featured ? "Claim Free" : "Redeem"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground order-2 sm:order-1">
                Page <span className="font-bold text-foreground">{safeCurrentPage}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    document.getElementById("vouchers-catalog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === safeCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById("vouchers-catalog")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition shadow-xs ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "border border-border bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    document.getElementById("vouchers-catalog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {!hasClaimedFree && canWithdraw && (
            <p className="mt-4 text-xs text-muted-foreground">
              Tip: Claim the free 6-month Premium first — other vouchers unlock right after.
            </p>
          )}
        </section>
      </main>

      {/* QR Code & Voucher Pass Modal */}
      {selectedQrVoucher && (
        <VoucherQrModal
          isOpen={true}
          onClose={() => setSelectedQrVoucher(null)}
          voucherTitle={selectedQrVoucher.voucher.title}
          code={selectedQrVoucher.code}
          expiresAt={selectedQrVoucher.expiresAt}
          description={selectedQrVoucher.voucher.description}
          tag={selectedQrVoucher.voucher.tag}
        />
      )}

      <Footer />
    </div>
  );
}
