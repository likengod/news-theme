import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, RotateCcw } from "lucide-react";
import { verifyImage, type VerificationResult } from "@/lib/image-protection";
import { fetchRemoteImageForVerification } from "@/lib/verify-image.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

import { ImageDropzone } from "@/components/verify-image/ImageDropzone";
import { VerificationResults } from "@/components/verify-image/VerificationResults";

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
          <ImageDropzone
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            handleDrop={handleDrop}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            handleUrlSubmit={handleUrlSubmit}
            inputUrl={inputUrl}
            setInputUrl={setInputUrl}
            isFetchingUrl={isFetchingUrl}
            urlError={urlError}
          />
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
              <VerificationResults result={result} siteName={s.siteName} />
            )}
          </div>
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
