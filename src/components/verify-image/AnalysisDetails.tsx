import React from "react";
import { Layers, Dna, FileCheck, Globe, Clock, ExternalLink } from "lucide-react";
import { type VerificationResult } from "@/lib/image-protection";

interface AnalysisDetailsProps {
  result: VerificationResult;
  siteName?: string;
}

export function AnalysisDetails({ result, siteName }: AnalysisDetailsProps) {
  return (
    <>
      {/* Dual-Layer Diagnostic Breakdown Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Layer 1 Status Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Layer 1: Cryptographic EXIF Signature
              </h3>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                result.layer1.detected
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
              }`}
            >
              {result.layer1.detected ? "Found in Metadata" : "Destroyed / Stripped"}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">EXIF Digital Certificate:</span>
              <span className="font-semibold text-foreground">
                {result.layer1.detected ? "Valid Signature Present" : "Missing / Not Found"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Integrity Check:</span>
              <span className="font-semibold text-foreground">
                {result.layer1.validSignature ? "Cryptographically Authenticated" : "Failed / Unsigned"}
              </span>
            </div>
            {result.layer1.payload?.signature && (
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Digital Fingerprint:</span>
                <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-primary">
                  {result.layer1.payload.signature}
                </code>
              </div>
            )}
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Resistance Status:</span>
              <span className="text-muted-foreground text-[11px]">
                Vulnerable to deliberate metadata stripping or screenshots.
              </span>
            </div>
          </div>
        </div>

        {/* Layer 2 Status Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Dna className="h-4 w-4 text-purple-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Layer 2: Forensic Pixel Watermark (DNA)
              </h3>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                result.layer2.detected
                  ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {result.layer2.detected ? "DNA Extracted" : "Not Found"}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Steganographic Pixel Match:</span>
              <span className="font-semibold text-foreground">
                {result.layer2.detected ? "Proven Across Pixel Matrix" : "No Pattern"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Synchronized Macroblocks:</span>
              <span className="font-semibold text-foreground">
                {result.layer2.blocksScanned} cells analyzed
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Screenshot Resilience:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Immune to Screenshot &amp; Metadata Stripping
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Verdict Fallback:</span>
              <span className="text-muted-foreground text-[11px]">
                {result.layer2.detected
                  ? "Proves authentic ownership despite metadata loss."
                  : "No pixel watermark found."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Provenance & Ownership Credential Card */}
      {result.extractedPayload && (
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Authenticated Ownership &amp; Provenance Record
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                Registered Publisher / Domain
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>{result.extractedPayload.domain || siteName || "Unknown Domain"}</span>
              </div>
              {result.extractedPayload.siteName && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.extractedPayload.siteName}
                </p>
              )}
            </div>

            {result.extractedPayload.timestamp && (
              <div>
                <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Protection Timestamp
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {new Date(result.extractedPayload.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {result.extractedPayload.ownership && (
            <div className="rounded-lg bg-muted/40 p-3.5 border border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Certified Ownership Declaration
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {result.extractedPayload.ownership}
              </p>
            </div>
          )}

          {/* Social Media Link Badges */}
          {result.extractedPayload.socials &&
            Object.keys(result.extractedPayload.socials).length > 0 && (
              <div>
                <span className="text-[11px] font-medium text-muted-foreground block mb-2">
                  Embedded Official Social Media Accounts
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.extractedPayload.socials).map(([net, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={net}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 transition shadow-2xs"
                      >
                        <span className="capitalize font-bold text-primary">{net}:</span>
                        <span className="truncate max-w-[140px] text-muted-foreground">{url}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
}
