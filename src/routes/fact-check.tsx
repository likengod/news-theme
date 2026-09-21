import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FactCheckScanner } from "@/components/site/FactCheckScanner";
import {
  ShieldCheck,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/fact-check")({
  head: () => ({
    meta: [
      { title: "Live News & Claim Fact-Check Scanner — News Theme" },
      {
        name: "description",
        content:
          "Scan any news article URL or viral headline to instantly verify authenticity against accredited global fact-checking registries and Google Fact Check.",
      },
      { property: "og:title", content: "Live News Fact-Check Scanner — News Theme" },
      {
        property: "og:description",
        content:
          "Instantly check any news URL or claim against accredited international fact-checkers.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FactCheckPage,
});

function FactCheckPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10 flex-1 w-full">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-background shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Verification Desk
                </p>
                <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl text-foreground">
                  Live Fact-Check Scanner
                </h1>
              </div>
            </div>

            <Link
              to="/fact-checking-policy"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read Our Fact-Checking Policy</span>
              <ArrowRight className="h-3 w-3 opacity-60" />
            </Link>
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Paste any news article link or viral social claim below. Our automated scanner
            cross-references international accredited fact-check registries (such as PIB Fact Check,
            Boom Live, AFP, PolitiFact, and Snopes) and analyzes source credibility in real time.
          </p>
        </header>

        {/* Fact Check Scanner Widget */}
        <FactCheckScanner />

        {/* How It Works & Transparency Cards */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Globe className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Multi-Registry Verification</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Every query is checked against certified fact-checking databases worldwide, ensuring
              investigations follow the International Fact-Checking Network (IFCN) code of
              principles.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Transparent Primary Sources</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              We provide direct links to the official debunk articles, government gazettes, and
              archived records so you can verify the evidence yourself.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">AI Credibility Signals</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              For emerging breaking news not yet cataloged in official registries, our AI model
              evaluates linguistic sensationalism, phishing indicators, and domain trust.
            </p>
          </div>
        </section>

        {/* Editorial Policy Link Callout */}
        <section className="mt-10 rounded-2xl border border-border bg-gradient-to-r from-muted/50 to-muted/20 p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Learn about our Newsroom Fact-Checking Standards
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Read how our journalists verify sources, review corrections, and maintain non-partisan
              accuracy.
            </p>
          </div>
          <Link
            to="/fact-checking-policy"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition"
          >
            <span>Fact-Checking Policy →</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
