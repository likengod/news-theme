import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Upload,
  Clipboard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Globe,
  Sparkles,
  ExternalLink,
  Layers,
  Dna,
  FileCheck,
  RotateCcw,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  verifyImage,
  protectCanvasAndExport,
  type VerificationResult,
  type ProtectedImagePayload,
} from "@/lib/image-protection";

export const Route = createFileRoute("/verify-image")({
  head: () => ({
    meta: [
      { title: "Forensic Image Verification Scanner - Today Tripura" },
      {
        name: "description",
        content:
          "Scan any image or screenshot to extract cryptographic EXIF signatures and forensic pixel steganography DNA.",
      },
    ],
  }),
  component: VerifyImagePage,
});

export function VerifyImagePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState<string>("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  const runVerification = useCallback(async (dataUrl: string, name: string, size: number) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStep("Reading binary headers & Layer 1 Cryptographic EXIF signatures...");

    await new Promise((r) => setTimeout(r, 250));
    setScanProgress(55);
    setScanStep("Decoding Layer 2 Forensic Pixel Steganography (Scanning pixel DNA matrix)...");

    await new Promise((r) => setTimeout(r, 300));
    setScanProgress(85);
    setScanStep("Cross-referencing Barker synchronization & domain checksums...");

    try {
      const verification = await verifyImage(dataUrl);
      setScanProgress(100);
      setScanStep("Analysis complete.");
      await new Promise((r) => setTimeout(r, 150));
      setResult(verification);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleFileSelect = (file: File, customLabel?: string) => {
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
      runVerification(dataUrl, customLabel || file.name, file.size);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Helper to generate a live demonstration image
  const generateDemoImage = (mode: "original" | "screenshot" | "unprotected") => {
    setResult(null);
    setIsScanning(true);
    setScanStep("Synthesizing test image...");

    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;

    // Create a pleasing gradient background
    const grad = ctx.createLinearGradient(0, 0, 480, 320);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#334155");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 320);

    // Decorative graphical elements
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(240, 140, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TODAY TRIPURA NEWS", 240, 230);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Official Editorial Press Asset", 240, 255);

    let finalDataUrl = "";
    const siteDomain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";

    if (mode === "original") {
      // Both Layer 1 and Layer 2
      finalDataUrl = protectCanvasAndExport(
        canvas,
        {
          domain: siteDomain,
          siteName: "Today Tripura",
          socials: {
            facebook: "https://facebook.com/todaytripura",
            twitter: "https://x.com/todaytripura",
            instagram: "https://instagram.com/todaytripura",
            youtube: "https://youtube.com/@todaytripura",
            telegram: "https://t.me/todaytripura",
          },
        },
        "image/webp",
        0.9,
      );
      setFileName("demo-protected-original.webp");
    } else if (mode === "screenshot") {
      // Layer 2 ONLY (pixel DNA embedded into canvas, then exported as clean PNG without Layer 1 metadata to simulate screenshot)
      protectCanvasAndExport(
        canvas,
        {
          domain: siteDomain,
          siteName: "Today Tripura",
        },
        "image/png",
        1.0,
      );
      // Strip metadata by re-drawing pure pixels onto a secondary canvas
      const cleanCanvas = document.createElement("canvas");
      cleanCanvas.width = 480;
      cleanCanvas.height = 320;
      const cleanCtx = cleanCanvas.getContext("2d")!;
      cleanCtx.drawImage(canvas, 0, 0);
      finalDataUrl = cleanCanvas.toDataURL("image/png"); // Pure pixels, zero metadata!
      setFileName("demo-screenshot-simulated.png");
    } else {
      // Unprotected
      finalDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setFileName("demo-unprotected-image.jpg");
    }

    setImageSrc(finalDataUrl);
    setFileSize(Math.round(finalDataUrl.length * 0.75));
    runVerification(finalDataUrl, fileName, fileSize);
  };

  const resetScanner = () => {
    setImageSrc(null);
    setFileName("");
    setFileSize(0);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  Forensic Image Verification Scanner
                </h1>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                  Dual-Layer Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cryptographic EXIF Signature (Layer 1) &amp; Forensic Pixel Steganography (Layer 2)
              </p>
            </div>
          </div>
          <Link
            to="/admin/files"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Media Manager <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 space-y-8">
        {/* Upload & Drop Zone */}
        {!imageSrc ? (
          <div className="space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                  : "border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-2xs">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Drop an image here, browse files, or press Ctrl+V to paste
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
                Accepts original uploads, re-compressed JPEGs, WebP, PNG, or even live mobile/desktop screenshots.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  Browse File
                </button>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 font-medium">
                  <Clipboard className="h-3.5 w-3.5 text-slate-400" />
                  <span>Tip: Take a screenshot and hit <strong>Ctrl+V</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Test Cases */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Test Live Interactive Demo Samples
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Click any mode to inspect behavior</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => generateDemoImage("original")}
                  className="flex flex-col items-start rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 text-left hover:bg-emerald-50 transition"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Sample 1: Full Original
                  </span>
                  <span className="text-xs font-bold text-slate-900">Layer 1 + Layer 2 Intact</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Both EXIF certificate and pixel DNA present.
                  </span>
                </button>

                <button
                  onClick={() => generateDemoImage("screenshot")}
                  className="flex flex-col items-start rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 text-left hover:bg-amber-50 transition"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Sample 2: Screenshot Simulation
                  </span>
                  <span className="text-xs font-bold text-slate-900">Metadata Stripped (Layer 2 Only)</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Simulates screenshot capture where EXIF is destroyed.
                  </span>
                </button>

                <button
                  onClick={() => generateDemoImage("unprotected")}
                  className="flex flex-col items-start rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-left hover:bg-slate-100 transition"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                    <XCircle className="h-3.5 w-3.5" /> Sample 3: External Image
                  </span>
                  <span className="text-xs font-bold text-slate-900">Unprotected Content</span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Clean image without any digital signatures.
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={imageSrc}
                  alt="Scanned asset"
                  className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {fileName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {fileSize ? `${Math.round(fileSize / 1024)} KB • ` : ""}
                    Ready for forensic report
                  </p>
                </div>
              </div>
              <button
                onClick={resetScanner}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Scan Another Image
              </button>
            </div>

            {/* Scanning Progress Banner */}
            {isScanning && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 space-y-3 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600 animate-spin" />
                    {scanStep}
                  </span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
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
                      ? "border-emerald-300 bg-emerald-50/40 text-emerald-950"
                      : result.verdict === "AUTHENTIC_DERIVATIVE"
                      ? "border-amber-300 bg-amber-50/40 text-amber-950"
                      : "border-slate-300 bg-slate-100/60 text-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                          result.verdict === "ORIGINAL_AUTHENTIC"
                            ? "bg-emerald-600 text-white"
                            : result.verdict === "AUTHENTIC_DERIVATIVE"
                            ? "bg-amber-600 text-white"
                            : "bg-slate-600 text-white"
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
                                ? "bg-emerald-100 text-emerald-800"
                                : result.verdict === "AUTHENTIC_DERIVATIVE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            Verdict: {result.verdict.replace("_", " ")}
                          </span>
                          <span className="text-xs text-slate-500">
                            Processed in {result.analysisDurationMs}ms
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
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white/80 p-3.5 border border-black/5 shadow-2xs shrink-0 min-w-[120px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        DNA Confidence
                      </span>
                      <span
                        className={`text-2xl font-black ${
                          result.confidenceScore >= 80
                            ? "text-emerald-600"
                            : result.confidenceScore > 0
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {result.confidenceScore}%
                      </span>
                      <span className="text-[10px] text-slate-500">
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Layer 1: Cryptographic EXIF Signature
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          result.layer1.detected
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {result.layer1.detected ? "Found in Metadata" : "Destroyed / Stripped"}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">EXIF Digital Certificate:</span>
                        <span className="font-semibold text-slate-900">
                          {result.layer1.detected ? "Valid Signature Present" : "Missing / Not Found"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Integrity Check:</span>
                        <span className="font-semibold text-slate-900">
                          {result.layer1.validSignature ? "Cryptographically Authenticated" : "Failed / Unsigned"}
                        </span>
                      </div>
                      {result.layer1.payload?.signature && (
                        <div className="flex items-center justify-between py-1 border-b border-slate-50">
                          <span className="text-slate-500">Digital Fingerprint:</span>
                          <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">
                            {result.layer1.payload.signature}
                          </code>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">Resistance Status:</span>
                        <span className="text-slate-600 text-[11px]">
                          Vulnerable to deliberate metadata stripping or screenshots.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Layer 2 Status Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Dna className="h-4 w-4 text-purple-600" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Layer 2: Forensic Pixel Watermark (DNA)
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          result.layer2.detected
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {result.layer2.detected ? "DNA Extracted" : "Not Found"}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Steganographic Pixel Match:</span>
                        <span className="font-semibold text-slate-900">
                          {result.layer2.detected ? "Proven Across Pixel Matrix" : "No Pattern"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Synchronized Macroblocks:</span>
                        <span className="font-semibold text-slate-900">
                          {result.layer2.blocksScanned} cells analyzed
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Screenshot Resilience:</span>
                        <span className="font-semibold text-emerald-700">
                          Immune to Screenshot &amp; Metadata Stripping
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">Verdict Fallback:</span>
                        <span className="text-slate-600 text-[11px]">
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Authenticated Ownership &amp; Provenance Record
                      </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="text-[11px] font-medium text-slate-400 block mb-1">
                          Registered Publisher / Domain
                        </span>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Globe className="h-4 w-4 text-indigo-600" />
                          <span>{result.extractedPayload.domain || "Unknown Domain"}</span>
                        </div>
                        {result.extractedPayload.siteName && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {result.extractedPayload.siteName}
                          </p>
                        )}
                      </div>

                      {result.extractedPayload.timestamp && (
                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block mb-1">
                            Protection Timestamp
                          </span>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {new Date(result.extractedPayload.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {result.extractedPayload.ownership && (
                      <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Certified Ownership Declaration
                        </span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {result.extractedPayload.ownership}
                        </p>
                      </div>
                    )}

                    {/* Social Media Link Badges */}
                    {result.extractedPayload.socials &&
                      Object.keys(result.extractedPayload.socials).length > 0 && (
                        <div>
                          <span className="text-[11px] font-medium text-slate-400 block mb-2">
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
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 transition shadow-2xs"
                                >
                                  <span className="capitalize font-bold text-indigo-600">{net}:</span>
                                  <span className="truncate max-w-[140px] text-slate-500">{url}</span>
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
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

        {/* Educational Architecture Explanation Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Info className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              How the Dual-Layer Image Protection Engine Works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Layer 1 Explanation */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                  Layer 1
                </span>
                <span className="text-xs font-semibold text-blue-600">The Surface Protection</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cryptographic EXIF Signature</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This layer embeds hidden, encrypted text data directly into the image file&apos;s metadata
                (EXIF/XMP tags) behind the scenes.
              </p>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Ownership Details:</strong> Securely holds custom text like &quot;This image belongs to [Domain Name]&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Social Media Linking:</strong> Embeds verified social accounts pulled from your admin panel directly into the file.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Timestamps:</strong> Records the exact date and time the image was protected.</span>
                </li>
              </ul>
              <div className="rounded-lg bg-blue-100/60 p-3 text-[11px] text-blue-900">
                <strong>Vulnerability:</strong> If a smart pirate deliberately uses a tool to &quot;strip metadata&quot;
                or takes a screenshot of the image, Layer 1 gets destroyed. <em>That is why we have Layer 2.</em>
              </div>
            </div>

            {/* Layer 2 Explanation */}
            <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                  Layer 2
                </span>
                <span className="text-xs font-semibold text-purple-600">The Deep Protection</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Forensic Pixel Watermarking (Steganography)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Advanced steganography. Instead of hiding data in the file&apos;s text, it invisibly weaves your
                watermark directly into the actual color pixels of the image.
              </p>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Screenshot Proof:</strong> If a user takes a screenshot on phone or computer, the pixels are captured, which means the hidden watermark is captured too.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Tamper Resistant:</strong> Survives cropping, resizing, JPEG compression, and complete metadata stripping.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic Fallback:</strong> Mathematically analyzes pixels to extract the payload and issues an <em>&quot;Authentic Derivative / Screenshot Match&quot;</em> verdict.</span>
                </li>
              </ul>
              <div className="rounded-lg bg-purple-100/60 p-3 text-[11px] text-purple-900">
                <strong>Summary:</strong> Layer 1 acts like a physical ID card sitting inside the image file.
                Layer 2 acts like invisible DNA inside the image itself.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
