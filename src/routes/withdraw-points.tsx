import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Wallet,
  Gift,
  Check,
  Lock,
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
  const [state, setState] = useState<State>({ balance: 0, claimed: {} });
  const [vouchers, setVouchers] = useState<Voucher[]>(() =>
    loadVouchers().filter((v) => v.enabled !== false),
  );

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
      try {
        const res = await redeemVoucherServer({
          data: {
            voucherId: v.id,
            userId: userId || undefined,
          },
        });
        finalCode = res.code;
        if (res.vouchers) {
          setVouchers(res.vouchers.filter((item) => item.enabled !== false));
        }
      } catch (srvErr: any) {
        finalCode = `NT-${v.id.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
    } catch (err: any) {
      toast.error(err?.message || "Failed to claim voucher");
    }
  };

  const progress = Math.min(100, (state.balance / MIN_WITHDRAW) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10 flex-1 w-full">
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
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Gift className="h-5 w-5 text-rose-500" /> Available Vouchers
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((v) => {
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
                  className={`relative overflow-hidden rounded-xl border p-5 transition ${
                    isOutOfStock
                      ? "border-dashed border-border bg-muted/30 opacity-75"
                      : v.featured
                        ? "border-amber-300 bg-amber-50/60 dark:bg-amber-950/20"
                        : "border-border bg-card"
                  }`}
                >
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

                  {claimedCode ? (
                    <div className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-2 text-xs dark:bg-emerald-950/40">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Claimed
                      </p>
                      <p className="font-mono text-[11px] text-emerald-900 dark:text-emerald-200">
                        {claimedCode}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => claim(v)}
                      disabled={locked}
                      className={`mt-3 flex w-full items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-bold transition ${
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
          {!hasClaimedFree && canWithdraw && (
            <p className="mt-4 text-xs text-muted-foreground">
              Tip: Claim the free 6-month Premium first — other vouchers unlock right after.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
