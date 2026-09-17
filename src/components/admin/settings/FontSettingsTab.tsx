import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  type FontConfiguration,
  type FontEntry,
  type FontSectionKey,
  generateFontId,
  loadFontConfig,
  saveFontConfig,
  buildGoogleFontsUrl,
  buildFontFaceCss,
} from "@/lib/font-config";
import { FontLibraryTable } from "./fonts/FontLibraryTable";
import { FontSectionMapping } from "./fonts/FontSectionMapping";
import { FontLivePreview } from "./fonts/FontLivePreview";
import { GoogleFontsCatalogModal } from "./fonts/GoogleFontsCatalogModal";
import { CustomFontModal } from "./fonts/CustomFontModal";

/* ─── Max upload size (500 KB) ───────────────────────────────────── */
const MAX_UPLOAD_BYTES = 500 * 1024;

export function FontSettingsTab() {
  const [config, setConfig] = useState<FontConfiguration>(() => loadFontConfig());
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog. 0123456789",
  );

  /* Sync from external updates */
  useEffect(() => {
    const sync = () => setConfig(loadFontConfig());
    window.addEventListener("nt:fonts-updated", sync);
    return () => window.removeEventListener("nt:fonts-updated", sync);
  }, []);

  /* Persist changes */
  const save = useCallback((next: FontConfiguration) => {
    setConfig(next);
    saveFontConfig(next);
    toast.success("Font settings saved");
  }, []);

  const handleSetDefault = (fontId: string) => {
    const next: FontConfiguration = {
      ...config,
      fonts: config.fonts.map((f) => ({ ...f, isDefault: f.id === fontId })),
    };
    save(next);
  };

  const handleDeleteFont = (fontId: string) => {
    const font = config.fonts.find((f) => f.id === fontId);
    if (!font) return;
    if (font.isSystem) {
      toast.error("System fonts cannot be deleted");
      return;
    }
    if (font.isDefault) {
      toast.error("Cannot delete the default font. Set another font as default first.");
      return;
    }
    // Reset any section mappings using this font to the default font
    const defaultFont = config.fonts.find((f) => f.isDefault) ?? config.fonts[0];
    const newMapping = { ...config.sectionMapping };
    for (const key of Object.keys(newMapping) as FontSectionKey[]) {
      if (newMapping[key] === fontId) {
        newMapping[key] = defaultFont?.id ?? "sys-inter";
      }
    }
    const next: FontConfiguration = {
      fonts: config.fonts.filter((f) => f.id !== fontId),
      sectionMapping: newMapping,
    };
    save(next);
    toast.success(`"${font.name}" removed`);
  };

  const handleAddGoogleFont = (catalogEntry: {
    name: string;
    family: string;
    weights: string[];
    category: string;
  }) => {
    if (config.fonts.some((f) => f.family === catalogEntry.family)) {
      toast.error(`"${catalogEntry.name}" is already in your font library`);
      return;
    }
    const entry: FontEntry = {
      id: generateFontId(),
      name: catalogEntry.name,
      family: catalogEntry.family,
      source: "google",
      weights: catalogEntry.weights,
      isDefault: false,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    const next: FontConfiguration = {
      ...config,
      fonts: [...config.fonts, entry],
    };
    save(next);
    setShowCatalog(false);
    toast.success(`"${catalogEntry.name}" added to font library`);
  };

  const handleCustomGoogleFont = (name: string, weights: string) => {
    if (!name.trim()) {
      toast.error("Please enter a font name");
      return;
    }
    if (config.fonts.some((f) => f.family.toLowerCase() === name.trim().toLowerCase())) {
      toast.error(`"${name}" is already in your font library`);
      return;
    }
    const parsedWeights = weights
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    if (parsedWeights.length === 0) parsedWeights.push("400");

    const entry: FontEntry = {
      id: generateFontId(),
      name: name.trim(),
      family: name.trim(),
      source: "google",
      weights: parsedWeights,
      isDefault: false,
      isSystem: false,
      createdAt: new Date().toISOString(),
    };
    const next: FontConfiguration = {
      ...config,
      fonts: [...config.fonts, entry],
    };
    save(next);
    setShowAddModal(false);
    toast.success(`"${name}" added to font library`);
  };

  const handleUploadFont = (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(
        `Font file too large (max ${MAX_UPLOAD_BYTES / 1024}KB). Got ${Math.round(file.size / 1024)}KB.`,
      );
      return;
    }
    const validExts = [".woff2", ".woff", ".ttf", ".otf"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      toast.error("Invalid file type. Accepted: .woff2, .woff, .ttf, .otf");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fontName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      if (config.fonts.some((f) => f.family.toLowerCase() === fontName.toLowerCase())) {
        toast.error(`A font named "${fontName}" already exists`);
        return;
      }
      const entry: FontEntry = {
        id: generateFontId(),
        name: fontName,
        family: fontName,
        source: "upload",
        fileDataUrl: dataUrl,
        weights: ["400"],
        isDefault: false,
        isSystem: false,
        createdAt: new Date().toISOString(),
      };
      const next: FontConfiguration = {
        ...config,
        fonts: [...config.fonts, entry],
      };
      save(next);
      toast.success(`"${fontName}" uploaded successfully`);
    };
    reader.onerror = () => toast.error("Failed to read font file");
    reader.readAsDataURL(file);
  };

  const handleSectionChange = (section: FontSectionKey, fontId: string) => {
    const next: FontConfiguration = {
      ...config,
      sectionMapping: { ...config.sectionMapping, [section]: fontId },
    };
    save(next);
  };

  /* Inject preview font styles */
  useEffect(() => {
    const googleFonts = config.fonts.filter((f) => f.source === "google" && !f.isSystem);
    if (googleFonts.length === 0) return;
    const url = buildGoogleFontsUrl(googleFonts);
    const existing = document.querySelector("link[data-font-preview]");
    if (existing) existing.remove();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-font-preview", "true");
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [config.fonts]);

  useEffect(() => {
    const uploadedFonts = config.fonts.filter((f) => f.source === "upload" && f.fileDataUrl);
    if (uploadedFonts.length === 0) return;
    const css = buildFontFaceCss(uploadedFonts);
    const existing = document.querySelector("style[data-font-face-preview]");
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.setAttribute("data-font-face-preview", "true");
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [config.fonts]);

  return (
    <div className="space-y-6">
      {/* ─── Font Library ─── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Font Library</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all fonts available on your website. System fonts cannot be deleted.
          </p>
        </div>
        <div className="px-6 py-5">
          <FontLibraryTable
            fonts={config.fonts}
            search={search}
            onSearchChange={setSearch}
            previewText={previewText}
            onOpenCatalog={() => setShowCatalog(true)}
            onOpenCustomModal={() => setShowAddModal(true)}
            onUploadFont={handleUploadFont}
            onSetDefault={handleSetDefault}
            onDeleteFont={handleDeleteFont}
          />
        </div>
      </div>

      {/* ─── Section Font Mapping ─── */}
      <FontSectionMapping
        config={config}
        previewText={previewText}
        onSectionChange={handleSectionChange}
      />

      {/* ─── Live Preview ─── */}
      <FontLivePreview
        config={config}
        previewText={previewText}
        onPreviewTextChange={setPreviewText}
      />

      {/* ─── Modals ─── */}
      {showCatalog && (
        <GoogleFontsCatalogModal
          fonts={config.fonts}
          onAdd={handleAddGoogleFont}
          onClose={() => setShowCatalog(false)}
        />
      )}
      {showAddModal && (
        <CustomFontModal
          onAdd={handleCustomGoogleFont}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default FontSettingsTab;
