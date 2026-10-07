import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

interface WalletSummaryCardProps {
  balance: number;
  userEmail: string | null;
  totalAvailable: number;
  userId: string | null;
}

export function WalletSummaryCard({
  balance,
  userEmail,
  totalAvailable,
  userId,
}: WalletSummaryCardProps) {
  return (
    <section className="mb-10 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/40 dark:to-background">
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
              ₹{balance}
            </p>
            {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-xs text-muted-foreground">
          <div>
            <p>Total one-time rewards available</p>
            <p className="text-lg font-semibold text-foreground">₹{totalAvailable}</p>
          </div>
          <Link
            to="/withdraw-points"
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Withdraw Points →
          </Link>
        </div>
      </div>
      {!userId && (
        <div className="mt-4 rounded-lg border border-dashed border-emerald-300 bg-white/60 p-3 text-sm">
          <Link
            to="/auth"
            className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            Sign in
          </Link>{" "}
          to start earning.
        </div>
      )}
    </section>
  );
}
