import React, { useState } from "react";
import {
  Search,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Sparkles,
  Clipboard,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Globe,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import {
  checkNewsFactServer,
  type FactCheckResponse,
  type FactCheckClaimItem,
} from "@/lib/fact-check.functions";

const SAMPLE_QUERIES = [
  "Government announces free laptops to all college students",
  "NASA confirms 3 days of total darkness across Earth",
  "Viral scheme claims ₹5000 credited under new national allowance",
];

export function FactCheckScanner() {
  const [query, setQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (searchQuery?: string) => {
    const textToSearch = (searchQuery ?? query).trim();
    if (!textToSearch) {
      setError("Please paste a news article URL or type a headline/claim to verify.");
      return;
    }

    setError(null);
    setIsScanning(true);
    setResult(null);

    const isUrl = /^https?:\/\//i.test(textToSearch);

    try {
      if (isUrl) {
        setScanStep("Extracting article title, OpenGraph metadata & key claims...");
        await new Promise((r) => setTimeout(r, 600));
      }

      setScanStep("Querying Google Fact Check Tools API & international debunk registries...");
      await new Promise((r) => setTimeout(r, 600));

      setScanStep("Analyzing accredited ratings & credibility signals...");

      const res = await checkNewsFactServer({ data: { query: textToSearch } });
      setResult(res);
    } catch (err: any) {
      console.error("[FactCheckScanner] Error:", err);
      setError(
        err?.message || "Failed to scan news. Please check your connection and try again.",
      );
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text.trim());
        handleScan(text.trim());
      }
    } catch {
      setError("Could not read clipboard. Please paste directly into the box.");
    }
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setError(null);
  };

  const getVerdictBadge = (rating: string, type: "false" | "misleading" | "true" | "unverified") => {
    switch (type) {
      case "false":
        return {
          bg: "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
          icon: XCircle,
          label: rating || "False / Debunked",
        };
      case "misleading":
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
          icon: AlertTriangle,
          label: rating || "Misleading / Missing Context",
        };
      case "true":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
          icon: CheckCircle2,
          label: rating || "Verified True",
        };
      default:
        return {
          bg: "bg-slate-500/10 text-slate-700 border-slate-500/30 dark:bg-slate-800 dark:text-slate-300",
          icon: HelpCircle,
          label: rating || "Unverified / Varied",
        };
    }
  };

  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card via-background to-card shadow-sm">
      {/* Header Banner */}
      <div className="border-b border-border bg-muted/40 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                Live News & Claim Fact-Check Scanner
              </h2>
              <p className="text-xs text-muted-foreground">
                Powered by Google Fact Check Tools API & Accredited Global Fact-Checkers
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
            <Globe className="h-3 w-3 text-primary" />
            <span>Multi-Source Registry</span>
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Search Input Box */}
        <div className="relative">
          <div className="relative flex flex-col gap-2 rounded-xl border border-border bg-background p-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-2xs">
            <div className="flex items-start gap-2 px-2 pt-1">
              <Search className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <textarea
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleScan();
                  }
                }}
                rows={2}
                placeholder="Paste news article URL (e.g. https://...) or type a headline/viral claim to scan..."
                className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <Clipboard className="h-3.5 w-3.5" />
                <span>Paste from Clipboard</span>
              </button>

              <div className="flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleScan()}
                  disabled={isScanning || !query.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90 disabled:opacity-50 shadow-2xs"
                >
                  {isScanning ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-3.5 w-3.5" />
                      <span>Verify News</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick test sample queries */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">Try sample:</span>
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  handleScan(sample);
                }}
                className="rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground transition text-left"
              >
                "{sample.slice(0, 38)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Scanning step progress */}
        {isScanning && (
          <div className="mt-6 rounded-xl border border-border/80 bg-card p-5 text-center shadow-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Search className="h-5 w-5 animate-pulse" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Cross-referencing Global Fact-Checking Registries...
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{scanStep}</p>
            <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
          </div>
        )}

        {/* Result Container */}
        {result && !isScanning && (
          <div className="mt-6 space-y-4">
            {/* Extracted URL Card if user pasted a URL */}
            {result.isUrl && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <LinkIcon className="h-3.5 w-3.5 text-primary" />
                  <span>Scanned Web Page:</span>
                  {result.sourceDomain && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {result.sourceDomain}
                    </span>
                  )}
                </div>
                {result.extractedTitle && (
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {result.extractedTitle}
                  </p>
                )}
                {result.extractedDescription && (
                  <p className="mt-1 text-muted-foreground line-clamp-2">
                    {result.extractedDescription}
                  </p>
                )}
              </div>
            )}

            {/* Google Fact Check Claims Results */}
            {result.claims && result.claims.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Accredited Fact-Check Findings ({result.claims.length})
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Official Fact Check Registry
                  </span>
                </div>

                {result.claims.map((item, idx) => {
                  const badge = getVerdictBadge(
                    item.review.rating,
                    item.review.verdictType,
                  );
                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:border-primary/40"
                    >
                      {/* Verdict Badge & Publisher */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/60 pb-3.5">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.bg}`}
                        >
                          <BadgeIcon className="h-3.5 w-3.5" />
                          <span>Rating: {badge.label}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {item.review.publisherName}
                          </span>
                          {item.review.reviewDate && (
                            <span>
                              ·{" "}
                              {new Date(item.review.reviewDate).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Claim Body */}
                      <div className="mt-3.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Claim Checked
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">
                          "{item.text}"
                        </p>
                        {item.claimant && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Claimant:{" "}
                            <span className="font-medium text-foreground">{item.claimant}</span>
                          </p>
                        )}
                      </div>

                      {/* Review Article Details */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 p-3">
                        <div className="text-xs">
                          <p className="font-semibold text-foreground">{item.review.title}</p>
                          <p className="text-muted-foreground">
                            Investigated by accredited fact-checker
                          </p>
                        </div>
                        <a
                          href={item.review.reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
                        >
                          <span>Read Full Debunk Report</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* AI Fallback / Supplementary Credibility Analysis */}
            {result.aiAnalysis && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">
                      AI Credibility & Hoax Analysis
                    </h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Verdict: {result.aiAnalysis.verdict} ({result.aiAnalysis.confidence}%
                    confidence)
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-foreground/90">
                  {result.aiAnalysis.explanation}
                </p>

                {result.aiAnalysis.riskFactors && result.aiAnalysis.riskFactors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Risk / Credibility Indicators
                    </p>
                    <ul className="mt-1 space-y-1 text-xs text-foreground/80">
                      {result.aiAnalysis.riskFactors.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.aiAnalysis.recommendation && (
                  <p className="mt-3 rounded-lg bg-background/80 p-2.5 text-xs text-muted-foreground border border-border/60">
                    <span className="font-semibold text-foreground">Recommendation: </span>
                    {result.aiAnalysis.recommendation}
                  </p>
                )}
              </div>
            )}

            {/* No match in Google database and no AI */}
            {result.claims.length === 0 && !result.aiAnalysis && (
              <div className="rounded-2xl border border-border bg-muted/20 p-6 text-center">
                <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <h4 className="mt-2 text-sm font-bold text-foreground">
                  No Direct Debunk Match in Google Fact Check Registry
                </h4>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  This specific headline or link has not yet been logged by accredited global
                  fact-checkers. Please practice digital media literacy: verify with official
                  press releases, government gazettes, and cross-reference multiple credible news
                  outlets.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
