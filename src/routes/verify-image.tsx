import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Upload,
  Clipboard,
  CheckCircle2,
  Clock,
  Globe,
  Sparkles,
  ExternalLink,
  Layers,
  Dna,
  FileCheck,
  RotateCcw,
  Info,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import {
  verifyImage,
  type VerificationResult,
} from "@/lib/image-protection";
import { fetchRemoteImageForVerification } from "@/lib/verify-image.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export const Route = createFileRoute("/verify-image")({
  head: () => ({
    meta: [
      { title: "Forensic Image Verification Scanner - News Theme" },
      {
        name: "description",
        content:
          "Scan any image or screenshot to extract cryptographic EXIF signatures and forensic pixel steganography DNA.",
      },
    ],
  }),
  component: VerifyImagePage,
});

function VerifyImagePage() {
  const s = useSiteSettings();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState<string>("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runVerification = useCallback(async (dataUrl: string) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStep("Reading file headers & Layer 1 Cryptographic EXIF signatures...");

    await new Promise((r) => setTimeout(r, 220));
    setScanProgress(55);
    setScanStep("Decoding Layer 2 Forensic Pixel Steganography (Scanning pixel DNA matrix)...");

    await new Promise((r) => setTimeout(r, 260));
    setScanProgress(85);
    setScanStep("Analyzing synchronization codes & domain checksums...");

    try {
      const verification = await verifyImage(dataUrl);
      setScanProgress(100);
      setScanStep("Analysis complete.");
      await new Promise((r) => setTimeout(r, 120));
      setResult(verification);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: File, customLabel?: string) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP, etc.)");
      return;
    }

    setFileName(customLabel || file.name);
    setFileSize(file.size);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = String(e.target?.result || "");
      setImageSrc(dataUrl);
      runVerification(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [runVerification]);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = inputUrl.trim();
    if (!url) return;

    setUrlError(null);
    setIsFetchingUrl(true);

    try {
      const res = await fetchRemoteImageForVerification({ data: { imageUrl: url } });
      if (res && res.dataUrl) {
        setFileName(res.fileName || url);
        setFileSize(res.fileSize || 0);
        setImageSrc(res.dataUrl);
        setResult(null);
        runVerification(res.dataUrl);
      } else {
        setUrlError("Could not retrieve image data from this URL.");
      }
    } catch (err: any) {
      console.error("URL fetch error:", err);
      setUrlError(err.message || "Failed to load image from URL. Please check the link.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Global paste handler to support pasting screenshots directly
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelect(file, "Pasted Screenshot (Clipboard)");
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const resetScanner = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setResult(null);
    setInputUrl("");
    setUrlError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Site Header */}
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Redesigned Centered Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Digital Provenance &amp; Copyright Guard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-serif">
            Forensic Image Authentication
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Scan any photograph, article image, or screenshot to authenticate its cryptographic EXIF signature and forensic pixel steganography DNA.
          </p>
        </div>

        {/* Unified Modern Forensic Scanner Card */}
        {!imageSrc ? (
          <div className="space-y-5">
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm p-4 sm:p-6 space-y-5">
              {/* Sleek Segmented Switcher */}
              <div className="flex items-center justify-center p-1 bg-muted/60 rounded-xl max-w-sm mx-auto border border-border/40">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "upload"
                      ? "bg-background text-foreground shadow-xs ring-1 ring-border/40 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "url"
                      ? "bg-background text-foreground shadow-xs ring-1 ring-border/40 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Image Web Link</span>
                </button>
              </div>

              {/* Tab 1: Upload / Drag & Drop */}
              {activeTab === "upload" && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.005]"
                      : "border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/35"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3.5 group-hover:scale-105 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Drop an image here, or{" "}
                    <span className="text-primary underline underline-offset-4 decoration-primary/40 group-hover:decoration-primary">
                      browse files
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can also copy an image or take a screenshot and press{" "}
                    <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-bold bg-background border border-border rounded text-foreground">
                      Ctrl+V
                    </kbd>{" "}
                    anywhere
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <span className="px-2.5 py-1 rounded-md bg-background border border-border/60">JPEG</span>
                    <span className="px-2.5 py-1 rounded-md bg-background border border-border/60">PNG</span>
                    <span className="px-2.5 py-1 rounded-md bg-background border border-border/60">WEBP</span>
                    <span className="px-2.5 py-1 rounded-md bg-background border border-border/60">AVIF</span>
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 font-semibold">
                      <Clipboard className="h-3 w-3" /> Clipboard Ready
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Image Web Link */}
              {activeTab === "url" && (
                <form
                  onSubmit={handleUrlSubmit}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-10 space-y-4 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Verify Remote Image by Web Link
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                      Paste any direct image URL from news articles, social media posts, or CDNs to inspect its forensic provenance.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto pt-2">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg or /uploads/..."
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-left"
                        disabled={isFetchingUrl}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputUrl.trim() || isFetchingUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition shrink-0"
                    >
                      {isFetchingUrl ? (
                        <>
                          <Sparkles className="h-4 w-4 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Verify Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {urlError && (
                    <div className="max-w-xl mx-auto flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium text-left">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{urlError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* 3 Pillar Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Layer 1: EXIF Metadata</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Cryptographic signature linking digital certificate, domain ownership, and timestamp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Dna className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Layer 2: Pixel Stego DNA</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Deep pixel steganography that survives metadata wiping, crops, and screenshot re-compression.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-2xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">In-Memory Privacy</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Decoded in-memory on demand without storing or logging your media on external servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Asset Info & Reset Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={imageSrc}
                  alt="Scanned asset"
                  className="h-14 w-14 rounded-lg object-cover border border-border"
                />
                <div>
                  <h3 className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                    {fileName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {fileSize ? `${Math.round(fileSize / 1024)} KB • ` : ""}
                    Image loaded in forensic inspector
                  </p>
                </div>
              </div>
              <button
                onClick={resetScanner}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Scan Another Image
              </button>
            </div>

            {/* Scanning Progress Banner */}
            {isScanning && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-3 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-spin" />
                    {scanStep}
                  </span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Verification Verdict Display */}
            {result && !isScanning && (
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
                          <span>{result.extractedPayload.domain || s.siteName || "Unknown Domain"}</span>
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
              </div>
            )}
          </div>
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
