import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  Star,
  Search,
  Plus,
  X,
  Eye,
  Globe,
  HardDrive,
  ChevronDown,
  Check,
  Type,
  AlertTriangle,
} from "lucide-react";
import {
  type FontConfiguration,
  type FontEntry,
  type FontSectionKey,
  FONT_SECTIONS,
  GOOGLE_FONTS_CATALOG,
  defaultFontConfig,
  loadFontConfig,
  saveFontConfig,
  getFontById,
  generateFontId,
  buildGoogleFontsUrl,
  buildFontFaceCss,
  buildSectionCssVars,
} from "@/lib/font-config";

/* ─── Max upload size (500 KB) ───────────────────────────────────── */
const MAX_UPLOAD_BYTES = 500 * 1024;

/* ─── Main Tab Component ─────────────────────────────────────────── */
export function FontSettingsTab() {
  const [config, setConfig] = useState<FontConfiguration>(() => loadFontConfig());
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog. 0123456789");
  const [dirty, setDirty] = useState(false);

  /* Sync from external updates */
  useEffect(() => {
    const sync = () => setConfig(loadFontConfig());
    window.addEventListener("nt:fonts-updated", sync);
    return () => window.removeEventListener("nt:fonts-updated", sync);
  }, []);

  /* Persist changes */
  const save = useCallback(
    (next: FontConfiguration) => {
      setConfig(next);
      saveFontConfig(next);
      setDirty(false);
      toast.success("Font settings saved");
    },
    []
  );

  /* Helpers */
  const updateConfig = (next: FontConfiguration) => {
    setConfig(next);
    setDirty(true);
  };

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

  const handleAddGoogleFont = (catalogEntry: { name: string; family: string; weights: string[]; category: string }) => {
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
      toast.error(`Font file too large (max ${MAX_UPLOAD_BYTES / 1024}KB). Got ${Math.round(file.size / 1024)}KB.`);
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
    const existing = document.querySelector('link[data-font-preview]');
    if (existing) existing.remove();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-font-preview", "true");
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, [config.fonts]);

  useEffect(() => {
    const uploadedFonts = config.fonts.filter((f) => f.source === "upload" && f.fileDataUrl);
    if (uploadedFonts.length === 0) return;
    const css = buildFontFaceCss(uploadedFonts);
    const existing = document.querySelector('style[data-font-face-preview]');
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.setAttribute("data-font-face-preview", "true");
    style.textContent = css;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, [config.fonts]);

  const filteredFonts = config.fonts.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.family.toLowerCase().includes(search.toLowerCase())
  );

  const defaultFontEntry = config.fonts.find((f) => f.isDefault);

  return (
    <div className="space-y-6">
      {/* ─── Font Library ─── */}
      <Card title="Font Library" subtitle="Manage all fonts available on your website. System fonts cannot be deleted.">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <button
            onClick={() => setShowCatalog(true)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            <Globe className="h-4 w-4" /> Add Google Font
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Plus className="h-4 w-4" /> Custom Font Name
          </button>
          <UploadButton onUpload={handleUploadFont} />
        </div>

        {/* Font count */}
        <p className="text-xs text-slate-500 mb-3">
          {config.fonts.length} font{config.fonts.length !== 1 ? "s" : ""} registered
          {defaultFontEntry && (
            <> · Default: <strong className="text-slate-900">{defaultFontEntry.name}</strong></>
          )}
        </p>

        {/* Font list */}
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-4 py-2.5">Font Name</th>
                <th className="px-4 py-2.5">Preview</th>
                <th className="px-4 py-2.5 text-center">Source</th>
                <th className="px-4 py-2.5 text-center">Weights</th>
                <th className="px-4 py-2.5 text-center">Default</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFonts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    {search ? "No fonts match your search" : "No fonts registered"}
                  </td>
                </tr>
              ) : (
                filteredFonts.map((font) => (
                  <FontRow
                    key={font.id}
                    font={font}
                    previewText={previewText}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDeleteFont}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Section Font Mapping ─── */}
      <Card title="Section Font Mapping" subtitle="Assign different fonts to different sections of your website.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FONT_SECTIONS.map((section) => {
            const currentFontId = config.sectionMapping[section.key];
            const currentFont = getFontById(currentFontId, config.fonts);
            return (
              <div
                key={section.key}
                className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Type className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-900">{section.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{section.description}</p>
                <FontSelect
                  fonts={config.fonts}
                  value={currentFontId}
                  onChange={(id) => handleSectionChange(section.key, id)}
                />
                {currentFont && (
                  <p
                    className="mt-2 text-sm text-slate-600 truncate"
                    style={{ fontFamily: `"${currentFont.family}", sans-serif` }}
                  >
                    {previewText.slice(0, 40)}...
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─── Live Preview ─── */}
      <Card title="Live Font Preview" subtitle="See how your font selections look across different sections.">
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Preview Text</label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {FONT_SECTIONS.map((section) => {
            const fontId = config.sectionMapping[section.key];
            const font = getFontById(fontId, config.fonts);
            const family = font ? `"${font.family}", sans-serif` : "sans-serif";
            const isHeadline = section.key === "headlines";
            return (
              <div
                key={section.key}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                  {section.label}
                </span>
                <p className="text-xs text-slate-400 mb-1 font-mono">
                  {font?.name ?? "—"} · {font?.source === "upload" ? "Uploaded" : "Google Fonts"}
                </p>
                <p
                  className="text-slate-900"
                  style={{
                    fontFamily: family,
                    fontSize: isHeadline ? "1.5rem" : "1rem",
                    fontWeight: isHeadline ? 800 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {previewText}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─── Frontend/Backend Usage Reference ─── */}
      <Card title="Font Usage Map" subtitle="Where each font section applies across frontend and backend.">
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="px-4 py-2.5">Section</th>
                <th className="px-4 py-2.5">Current Font</th>
                <th className="px-4 py-2.5">Frontend Usage</th>
                <th className="px-4 py-2.5">CSS Variable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {FONT_SECTIONS.map((section) => {
                const fontId = config.sectionMapping[section.key];
                const font = getFontById(fontId, config.fonts);
                return (
                  <tr key={section.key} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{section.label}</td>
                    <td className="px-4 py-2.5">
                      <span
                        style={{ fontFamily: font ? `"${font.family}", sans-serif` : "sans-serif" }}
                      >
                        {font?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{section.description}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{section.cssVar}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Modals ─── */}
      {showCatalog && (
        <GoogleFontsCatalog
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

/* ─── Font Table Row ──────────────────────────────────────────────── */
function FontRow({
  font,
  previewText,
  onSetDefault,
  onDelete,
}: {
  font: FontEntry;
  previewText: string;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">{font.name}</span>
          {font.isSystem && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
              System
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">"{font.family}"</p>
      </td>
      <td className="px-4 py-3 max-w-[200px]">
        <p
          className="text-sm text-slate-800 truncate"
          style={{ fontFamily: `"${font.family}", sans-serif` }}
        >
          {previewText.slice(0, 30)}
        </p>
      </td>
      <td className="px-4 py-3 text-center">
        {font.source === "google" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
            <Globe className="h-3 w-3" /> Google
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <HardDrive className="h-3 w-3" /> Upload
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-[11px] text-slate-500">{font.weights.join(", ")}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onSetDefault(font.id)}
          className={`rounded-full p-1.5 transition ${
            font.isDefault
              ? "bg-amber-100 text-amber-600"
              : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"
          }`}
          title={font.isDefault ? "Default font" : "Set as default"}
        >
          <Star className={`h-4 w-4 ${font.isDefault ? "fill-current" : ""}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        {font.isSystem ? (
          <span className="text-[10px] text-slate-400 italic">Protected</span>
        ) : (
          <button
            onClick={() => onDelete(font.id)}
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
            title="Delete font"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

/* ─── Font Select Dropdown ────────────────────────────────────────── */
function FontSelect({
  fonts,
  value,
  onChange,
}: {
  fonts: FontEntry[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = fonts.find((f) => f.id === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 transition"
      >
        <span className="truncate" style={selected ? { fontFamily: `"${selected.family}", sans-serif` } : undefined}>
          {selected?.name ?? "Select a font..."}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                onChange(f.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition ${
                f.id === value ? "bg-slate-100 text-slate-900" : "text-slate-600"
              }`}
            >
              <span className="flex-1 truncate text-left" style={{ fontFamily: `"${f.family}", sans-serif` }}>
                {f.name}
              </span>
              {f.id === value && <Check className="h-4 w-4 text-slate-900" />}
              {f.isDefault && <Star className="h-3 w-3 text-amber-500 fill-current" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Upload Button ───────────────────────────────────────────────── */
function UploadButton({ onUpload }: { onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".woff2,.woff,.ttf,.otf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition"
      >
        <Upload className="h-4 w-4" /> Upload Font File
      </button>
    </>
  );
}

/* ─── Google Fonts Catalog Modal ──────────────────────────────────── */
function GoogleFontsCatalog({
  fonts,
  onAdd,
  onClose,
}: {
  fonts: FontEntry[];
  onAdd: (entry: { name: string; family: string; weights: string[]; category: string }) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(GOOGLE_FONTS_CATALOG.map((f) => f.category))];
  const filtered = GOOGLE_FONTS_CATALOG.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const alreadyAdded = new Set(fonts.map((f) => f.family.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Google Fonts Catalog</h3>
            <p className="text-xs text-slate-500">Select from popular Google Fonts to add to your library</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100 transition">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-3 space-y-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[340px] overflow-y-auto px-6 py-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No fonts match your search</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((f) => {
                const exists = alreadyAdded.has(f.family.toLowerCase());
                return (
                  <div
                    key={f.family}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                      exists ? "border-slate-100 bg-slate-50 opacity-60" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{f.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {f.category} · Weights: {f.weights.join(", ")}
                      </p>
                    </div>
                    {exists ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <Check className="h-3 w-3" /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => onAdd(f)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Custom Google Font Modal ────────────────────────────────────── */
function CustomFontModal({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, weights: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [weights, setWeights] = useState("400, 500, 600, 700");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Custom Google Font</h3>
            <p className="text-xs text-slate-500">Type the exact name from fonts.google.com</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100 transition">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Font Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Roboto Slab"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              autoFocus
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Must match exactly as shown on fonts.google.com
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Weights (comma-separated)</label>
            <input
              type="text"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              placeholder="400, 500, 600, 700"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              If the font name is incorrect, it won't load. Verify the exact name at{" "}
              <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                fonts.google.com
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(name, weights)}
            disabled={!name.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <Plus className="h-4 w-4" /> Add Font
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Card ───────────────────────────────────────────────── */
function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
