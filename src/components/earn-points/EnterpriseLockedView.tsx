import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function EnterpriseLockedView() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showTicker={false} showBreakingBar={false} />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-xl font-bold text-card-foreground">Enterprise Plus Feature Locked</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The Wallet and Rewards system is exclusively available on Enterprise Plus plans.
            Please ask the site administrator to upgrade their license to unlock this feature.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
