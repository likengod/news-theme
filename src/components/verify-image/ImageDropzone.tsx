import React from "react";
import { Upload, Globe, Link as LinkIcon, Sparkles, ShieldCheck, AlertCircle, Layers, Dna, Clipboard } from "lucide-react";

interface ImageDropzoneProps {
  activeTab: "upload" | "url";
  setActiveTab: (tab: "upload" | "url") => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (file: File) => void;
  handleUrlSubmit: (e: React.FormEvent) => void;
  inputUrl: string;
  setInputUrl: (url: string) => void;
  isFetchingUrl: boolean;
  urlError: string | null;
}

export function ImageDropzone({
  activeTab,
  setActiveTab,
  isDragging,
  setIsDragging,
  handleDrop,
  fileInputRef,
  handleFileSelect,
  handleUrlSubmit,
  inputUrl,
  setInputUrl,
  isFetchingUrl,
  urlError,
}: ImageDropzoneProps) {
  return (
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
              id="verify-image-file-input"
              name="verify-image-file-input"
              aria-label="Upload image file for forensic verification"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              suppressHydrationWarning
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
                  id="verify-image-url-input"
                  name="verify-image-url-input"
                  aria-label="Paste image web URL for forensic verification"
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg or /uploads/..."
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-left"
                  disabled={isFetchingUrl}
                  autoComplete="off"
                  suppressHydrationWarning
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
  );
}
