import React, { useEffect, useRef, useState } from "react";
import { Toolbar } from "./RichEditor/Toolbar";
import { BubbleMenu, FloatingMenu } from "./RichEditor/BubbleMenu";
import { loadFontConfig } from "@/lib/font-config";
import {
  TEXT_PALETTE_ROWS,
  HIGHLIGHT_PALETTE_ROWS,
  FONT_SIZES,
  createTableHtml,
} from "./RichEditor/editorConstants";
import { useRichEditorSelection } from "./RichEditor/useRichEditorSelection";

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const lastHtml = useRef<string>(value);

  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const [fontOptions, setFontOptions] = useState<string[]>(["Default"]);
  const [mode, setMode] = useState<"visual" | "plain">("visual");
  const [currentSize, setCurrentSize] = useState<string>("14");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [activeTextColor, setActiveTextColor] = useState("#1A1110");
  const [activeHighlightColor, setActiveHighlightColor] = useState("transparent");

  const {
    emit,
    saveSelection,
    restoreSelection,
    exec,
    formatBlock,
    insertHTML,
    setFontFamily,
    setFontSize,
    updateSelectionState,
    handlePaste,
    clearFormatting,
    unlink,
  } = useRichEditorSelection({
    ref,
    lastHtml,
    onChange,
    setCurrentSize,
  });

  useEffect(() => {
    if (ref.current && value !== lastHtml.current) {
      ref.current.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, [value]);

  useEffect(() => {
    if (mode === "visual" && ref.current) {
      ref.current.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, [mode]);

  useEffect(() => {
    if (ref.current && !ref.current.innerHTML && value) ref.current.innerHTML = value;
  }, []);

  useEffect(() => {
    const config = loadFontConfig();
    if (config && config.fonts) {
      const families = config.fonts.map((f) => f.name || f.family);
      setFontOptions(["Default", ...new Set(families)]);
    }
    const handleUpdate = () => {
      const updated = loadFontConfig();
      if (updated && updated.fonts) {
        const families = updated.fonts.map((f) => f.name || f.family);
        setFontOptions(["Default", ...new Set(families)]);
      }
    };
    window.addEventListener("nt:fonts-updated", handleUpdate);
    return () => window.removeEventListener("nt:fonts-updated", handleUpdate);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setTextColorOpen(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setHighlightOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const insertImage = () => {
    const url = prompt("Image URL (or use Upload)");
    if (!url) return;
    const alt = prompt("Alt text (optional)") || "image";
    insertHTML(
      `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`,
    );
  };

  const uploadImage = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () =>
      insertHTML(
        `<img src="${reader.result}" alt="image" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`,
      );
    reader.readAsDataURL(f);
  };

  const insertYouTube = () => {
    const url = prompt("YouTube URL (e.g. https://youtu.be/abc123)");
    if (!url) return;
    const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    const id = m ? m[1] : url;
    insertHTML(
      `<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px"></iframe></div><p><br/></p>`,
    );
  };

  const insertFacebook = () => {
    const url = prompt("Facebook video URL");
    if (!url) return;
    insertHTML(
      `<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px" scrolling="no" allowfullscreen></iframe></div><p><br/></p>`,
    );
  };

  const insertVideoUrl = () => {
    const url = prompt("Direct video URL (.mp4, .webm)");
    if (!url) return;
    insertHTML(
      `<video src="${url}" controls style="max-width:100%;border-radius:8px;margin:12px 0"></video><p><br/></p>`,
    );
  };

  const insertLink = () => {
    const url = prompt("URL (e.g. https://example.com)");
    if (!url) return;
    exec("createLink", url);
  };

  const insertDivider = () =>
    insertHTML(`<hr style="border:0;border-top:1px solid #cbd5e1;margin:16px 0" />`);

  const insertQuote = () => exec("formatBlock", "blockquote");

  const insertTable = () => insertHTML(createTableHtml());

  const applyTextColor = (color: string) => {
    restoreSelection();
    exec("foreColor", color);
    setActiveTextColor(color);
    setTextColorOpen(false);
  };

  const applyHighlightColor = (color: string) => {
    restoreSelection();
    if (color === "transparent") {
      document.execCommand("removeFormat", false);
    } else {
      document.execCommand("hiliteColor", false, color) ||
        document.execCommand("backColor", false, color);
    }
    setActiveHighlightColor(color);
    setHighlightOpen(false);
    emit();
  };

  const Btn = ({
    onClick,
    title,
    children,
    disabled = false,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        saveSelection();
      }}
      onClick={onClick}
      title={title}
      className="grid h-8 w-8 place-items-center rounded text-slate-700 hover:bg-slate-200 disabled:opacity-35 disabled:pointer-events-none transition-colors"
    >
      {children}
    </button>
  );

  const Sep = () => <span className="mx-1 h-5 w-px bg-slate-200" />;
  const words = (ref.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className={`overflow-hidden rounded-md border border-slate-200 bg-white transition-all ${
        isFullscreen ? "fixed inset-0 z-50 flex flex-col m-0 rounded-none h-screen" : "relative"
      }`}
    >
      <Toolbar
        mode={mode}
        setMode={setMode}
        exec={exec}
        formatBlock={formatBlock}
        setFontFamily={setFontFamily}
        setFontSize={setFontSize}
        fontOptions={fontOptions}
        currentSize={currentSize}
        sizes={FONT_SIZES}
        applyTextColor={applyTextColor}
        applyHighlightColor={applyHighlightColor}
        insertHTML={insertHTML}
        insertImage={insertImage}
        imgRef={imgRef}
        uploadImage={uploadImage}
        insertYouTube={insertYouTube}
        insertFacebook={insertFacebook}
        insertVideoUrl={insertVideoUrl}
        insertLink={insertLink}
        unlink={unlink}
        clearFormatting={clearFormatting}
        insertDivider={insertDivider}
        insertQuote={insertQuote}
        insertTable={insertTable}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        words={words}
        saveSelection={saveSelection}
        emit={emit}
        textColorOpen={textColorOpen}
        setTextColorOpen={setTextColorOpen}
        highlightOpen={highlightOpen}
        setHighlightOpen={setHighlightOpen}
        activeTextColor={activeTextColor}
        activeHighlightColor={activeHighlightColor}
        textColorRef={textColorRef}
        highlightRef={highlightRef}
        TEXT_PALETTE_ROWS={TEXT_PALETTE_ROWS}
        HIGHLIGHT_PALETTE_ROWS={HIGHLIGHT_PALETTE_ROWS}
        Btn={Btn}
        Sep={Sep}
      />
      <BubbleMenu />
      <FloatingMenu />

      {/* EDITOR AREA */}
      {mode === "visual" ? (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          onPaste={handlePaste}
          onSelect={saveSelection}
          onKeyUp={updateSelectionState}
          onMouseUp={updateSelectionState}
          data-placeholder="Write your article here. Use the toolbar to format text, change color, insert images, and embed YouTube/Facebook videos - everything renders live as you type."
          className={`rich-editor block w-full px-5 py-4 text-[14px] leading-relaxed text-slate-900 focus:outline-none ${
            isFullscreen ? "flex-1 overflow-y-auto min-h-0" : "min-h-[380px]"
          }`}
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(e) => {
            lastHtml.current = e.target.value;
            onChange(e.target.value);
          }}
          placeholder="Write or paste plain text / HTML here..."
          className={`block w-full px-5 py-4 font-mono text-[14px] leading-relaxed text-slate-900 focus:outline-none bg-slate-50/50 resize-y ${
            isFullscreen ? "flex-1 overflow-y-auto min-h-0" : "min-h-[380px]"
          }`}
          rows={16}
        />
      )}

      <style>{`
        .rich-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        .rich-editor, .rich-editor p, .rich-editor li, .rich-editor td { font-size: 14px; line-height: 1.75; margin: .5rem 0; }
        .rich-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; line-height: 1.3; }
        .rich-editor h3 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; line-height: 1.35; }
        .rich-editor h4 { font-size: 1.1rem; font-weight: 600; margin: .75rem 0 .25rem; line-height: 1.4; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor blockquote { border-left: 3px solid #1A1110; padding: .5rem 1rem; margin: .75rem 0; color: #475569; font-style: italic; background:#f8fafc; font-size: 14px; }
        .rich-editor a { color: #2563eb; text-decoration: underline; }
        .rich-editor img { max-width: 100%; height: auto; }
        .rich-editor table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 14px; }
        .rich-editor th, .rich-editor td { border: 1px solid #cbd5e1; padding: 8px 12px; }
        .rich-editor th { background-color: #f8fafc; font-weight: 600; }
      `}</style>
    </div>
  );
}

export default RichEditor;
