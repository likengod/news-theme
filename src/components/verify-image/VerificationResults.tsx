import React from "react";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { type VerificationResult } from "@/lib/image-protection";
import { AnalysisDetails } from "./AnalysisDetails";

interface VerificationResultsProps {
  result: VerificationResult;
  siteName?: string;
}

export function VerificationResults({ result, siteName }: VerificationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Master Verdict Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
          result.verdict === "ORIGINAL_AUTHENTIC"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
            : result.verdict === "AUTHENTIC_DERIVATIVE"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
            : "border-border bg-muted/40 text-foreground"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                result.verdict === "ORIGINAL_AUTHENTIC"
                  ? "bg-emerald-600 text-white"
                  : result.verdict === "AUTHENTIC_DERIVATIVE"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {result.verdict === "ORIGINAL_AUTHENTIC" ? (
                <ShieldCheck className="h-8 w-8" />
              ) : result.verdict === "AUTHENTIC_DERIVATIVE" ? (
                <ShieldAlert className="h-8 w-8" />
              ) : (
                <ShieldX className="h-8 w-8" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    result.verdict === "ORIGINAL_AUTHENTIC"
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : result.verdict === "AUTHENTIC_DERIVATIVE"
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Verdict: {result.verdict.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground">
                  Analyzed in {result.analysisDurationMs}ms
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {result.headline}
              </h2>
              <p className="text-xs sm:text-sm opacity-90 max-w-2xl leading-relaxed">
                {result.details}
              </p>
            </div>
          </div>

          {/* Confidence Score Badge */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-card p-3.5 border border-border shadow-2xs shrink-0 min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              DNA Confidence
            </span>
            <span
              className={`text-2xl font-black ${
                result.confidenceScore >= 80
                  ? "text-emerald-600 dark:text-emerald-400"
                  : result.confidenceScore > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {result.confidenceScore}%
            </span>
            <span className="text-[10px] text-muted-foreground">
              {result.verdict === "ORIGINAL_AUTHENTIC"
                ? "Dual Verification"
                : result.verdict === "AUTHENTIC_DERIVATIVE"
                ? "Pixel Steganography"
                : "No Match"}
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Analysis Details */}
      <AnalysisDetails result={result} siteName={siteName} />
    </div>
  );
}
