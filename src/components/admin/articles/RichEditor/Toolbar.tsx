import React from "react";
import {
  Undo, Redo, Heading2, Heading3, Heading4, Bold, Italic, Underline,
  Strikethrough, Subscript, Superscript, RemoveFormatting, Code2, Highlighter,
  ChevronDown, Pipette, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Link2, Table as TableIcon, Image as ImageIcon,
  Upload, Youtube, Facebook, Video, Maximize2, Minimize2, FileText,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface ToolbarProps {
  mode: "visual" | "plain";
  setMode: (mode: "visual" | "plain") => void;
  exec: (cmd: string, val?: string) => void;
  formatBlock: (tag: string) => void;
  setFontFamily: (f: string) => void;
  setFontSize: (px: string) => void;
  fontOptions: string[];
  currentSize: string;
  sizes: string[];
  applyTextColor: (color: string) => void;
  applyHighlightColor: (color: string) => void;
  insertHTML: (html: string) => void;
  insertImage: () => void;
  imgRef: React.RefObject<HTMLInputElement>;
  uploadImage: (f?: File | null) => void;
  insertYouTube: () => void;
  insertFacebook: () => void;
  insertVideoUrl: () => void;
  insertLink: () => void;
  insertDivider: () => void;
  insertQuote: () => void;
  insertTable: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  words: number;
  saveSelection: () => void;
  emit: () => void;
  textColorOpen: boolean;
  setTextColorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  highlightOpen: boolean;
  setHighlightOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeTextColor: string;
  activeHighlightColor: string;
  textColorRef: React.RefObject<HTMLDivElement>;
  highlightRef: React.RefObject<HTMLDivElement>;
  TEXT_PALETTE_ROWS: string[][];
  HIGHLIGHT_PALETTE_ROWS: string[][];
  Btn: React.FC<{
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }>;
  Sep: React.FC;
}

export function Toolbar({
  mode, setMode, exec, formatBlock, setFontFamily, setFontSize,
  fontOptions, currentSize, sizes, applyTextColor, applyHighlightColor,
  insertHTML, insertImage, imgRef, uploadImage, insertYouTube, insertFacebook,
  insertVideoUrl, insertLink, insertDivider, insertQuote, insertTable,
  isFullscreen, setIsFullscreen, words, saveSelection, emit,
  textColorOpen, setTextColorOpen, highlightOpen, setHighlightOpen,
  activeTextColor, activeHighlightColor, textColorRef, highlightRef,
  TEXT_PALETTE_ROWS, HIGHLIGHT_PALETTE_ROWS, Btn, Sep
}: ToolbarProps) {
  return (
    <>
      {/* TOOLBAR ROW 1: Typography, Headings, Fonts, Sizes, Inline Styles, Colors */}
            <div
              className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/90 px-2 py-1.5"
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).tagName !== "SELECT") {
                  e.preventDefault();
                }
                saveSelection();
              }}
            >
              <Btn onClick={() => exec("undo")} title="Undo (Ctrl+Z)" disabled={mode === "plain"}>
                <Undo className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("redo")} title="Redo (Ctrl+Y)" disabled={mode === "plain"}>
                <Redo className="h-4 w-4" />
              </Btn>
              <Sep />
      
              <Btn
                onClick={() => formatBlock("p")}
                title="Paragraph (P) - Normal body text (14px)"
                disabled={mode === "plain"}
              >
                <span className="font-bold text-sm leading-none text-slate-800">P</span>
              </Btn>
              <Btn
                onClick={() => formatBlock("h2")}
                title="Heading 2 (H2)"
                disabled={mode === "plain"}
              >
                <Heading2 className="h-4 w-4" />
              </Btn>
              <Btn
                onClick={() => formatBlock("h3")}
                title="Heading 3 (H3)"
                disabled={mode === "plain"}
              >
                <Heading3 className="h-4 w-4" />
              </Btn>
              <Btn
                onClick={() => formatBlock("h4")}
                title="Heading 4 (H4)"
                disabled={mode === "plain"}
              >
                <Heading4 className="h-4 w-4" />
              </Btn>
              <Sep />
      
              {/* Font Family Dropdown */}
              <select
                onFocus={saveSelection}
                onMouseDown={saveSelection}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  e.target.value = "Default";
                }}
                title="Font family"
                disabled={mode === "plain"}
                className="h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 disabled:opacity-35 cursor-pointer"
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
      
              {/* Font Size Dropdown (Default: 14px) */}
              <select
                value={currentSize}
                onFocus={saveSelection}
                onMouseDown={saveSelection}
                onChange={(e) => {
                  setFontSize(e.target.value);
                }}
                title="Font size (Default: 14px)"
                disabled={mode === "plain"}
                className="h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 disabled:opacity-35 cursor-pointer"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s === "14" ? "14px (Default)" : `${s}px`}
                  </option>
                ))}
              </select>
              <Sep />
      
              <Btn onClick={() => exec("bold")} title="Bold (Ctrl+B)" disabled={mode === "plain"}>
                <Bold className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("italic")} title="Italic (Ctrl+I)" disabled={mode === "plain"}>
                <Italic className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("underline")} title="Underline (Ctrl+U)" disabled={mode === "plain"}>
                <Underline className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("strikeThrough")} title="Strikethrough" disabled={mode === "plain"}>
                <Strikethrough className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("subscript")} title="Subscript" disabled={mode === "plain"}>
                <Subscript className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("superscript")} title="Superscript" disabled={mode === "plain"}>
                <Superscript className="h-4 w-4" />
              </Btn>
              <Btn
                onClick={() => {
                  restoreSelection();
                  exec("removeFormat");
                  if (ref.current) {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                      ref.current.querySelectorAll<HTMLElement>("span, font").forEach((s) => {
                        if (sel.containsNode(s, true)) {
                          s.style.fontSize = "";
                          s.style.fontFamily = "";
                        }
                      });
                    }
                  }
                  setCurrentSize("14");
                  emit();
                }}
                title="Clear formatting / Plain text"
                disabled={mode === "plain"}
              >
                <RemoveFormatting className="h-4 w-4 text-rose-600" />
              </Btn>
              <Btn
                onClick={() =>
                  insertHTML(
                    `<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace">code</code>`,
                  )
                }
                title="Inline code"
                disabled={mode === "plain"}
              >
                <Code2 className="h-4 w-4" />
              </Btn>
              <Sep />
      
              {/* COMPACT MULTI-COLOR DROPDOWN (TEXT COLOR) */}
              <div className="relative" ref={textColorRef}>
                <button
                  type="button"
                  disabled={mode === "plain"}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setTextColorOpen((prev) => !prev);
                    setHighlightOpen(false);
                  }}
                  title="Text Color"
                  className={`flex h-8 items-center gap-1 rounded px-1.5 text-slate-700 hover:bg-slate-200 disabled:opacity-35 transition-colors ${
                    textColorOpen ? "bg-slate-200 ring-1 ring-slate-400" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-serif font-black text-sm leading-none text-slate-900">A</span>
                    <span
                      className="mt-0.5 h-1 w-4 rounded-full"
                      style={{ backgroundColor: activeTextColor }}
                    />
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>
      
                {textColorOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-semibold text-slate-700">Text Color</span>
                      <button
                        type="button"
                        onClick={() => applyTextColor("#1A1110")}
                        className="rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        Reset default
                      </button>
                    </div>
      
                    {/* Palette Grid */}
                    <div className="space-y-1">
                      {TEXT_PALETTE_ROWS.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-1 justify-between">
                          {row.map((c) => (
                            <button
                              key={c}
                              type="button"
                              title={c}
                              onClick={() => applyTextColor(c)}
                              className="h-5 w-5 rounded border border-slate-300 transition-transform hover:scale-125 hover:z-10 shadow-xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
      
                    {/* Custom Color Input */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      <span className="font-medium text-slate-600">Custom color</span>
                      <label className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 transition-colors">
                        <Pipette className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-[11px] font-medium text-slate-600">Pick any</span>
                        <input
                          type="color"
                          className="sr-only"
                          onChange={(e) => applyTextColor(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
      
              {/* COMPACT MULTI-COLOR DROPDOWN (HIGHLIGHT COLOR) */}
              <div className="relative" ref={highlightRef}>
                <button
                  type="button"
                  disabled={mode === "plain"}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setHighlightOpen((prev) => !prev);
                    setTextColorOpen(false);
                  }}
                  title="Highlight / Background Color"
                  className={`flex h-8 items-center gap-1 rounded px-1.5 text-slate-700 hover:bg-slate-200 disabled:opacity-35 transition-colors ${
                    highlightOpen ? "bg-slate-200 ring-1 ring-slate-400" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Highlighter className="h-4 w-4 text-amber-600" />
                    <span
                      className="mt-0.5 h-1 w-4 rounded-full border border-slate-300"
                      style={{
                        backgroundColor:
                          activeHighlightColor === "transparent" ? "#ffffff" : activeHighlightColor,
                      }}
                    />
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>
      
                {highlightOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-1.5 w-60 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-semibold text-slate-700">Highlight Marker</span>
                      <button
                        type="button"
                        onClick={() => applyHighlightColor("transparent")}
                        className="rounded px-1.5 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
                      >
                        ✕ Clear highlight
                      </button>
                    </div>
      
                    {/* Highlight Palette Grid */}
                    <div className="space-y-1">
                      {HIGHLIGHT_PALETTE_ROWS.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-1 justify-between">
                          {row.map((c) => (
                            <button
                              key={c}
                              type="button"
                              title={c}
                              onClick={() => applyHighlightColor(c)}
                              className="h-5 flex-1 rounded border border-slate-300 transition-transform hover:scale-110 shadow-xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
      
                    {/* Custom Highlight Input */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      <span className="font-medium text-slate-600">Custom marker</span>
                      <label className="flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 transition-colors">
                        <Pipette className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-[11px] font-medium text-slate-600">Pick any</span>
                        <input
                          type="color"
                          className="sr-only"
                          onChange={(e) => applyHighlightColor(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
      
            {/* TOOLBAR ROW 2: Alignments, Lists, Quotes, Divider, Link, Tables, Media, View Toggle */}
            <div
              className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/60 px-2 py-1.5"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
            >
              <Btn onClick={() => exec("justifyLeft")} title="Align left" disabled={mode === "plain"}>
                <AlignLeft className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("justifyCenter")} title="Align center" disabled={mode === "plain"}>
                <AlignCenter className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("justifyRight")} title="Align right" disabled={mode === "plain"}>
                <AlignRight className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("justifyFull")} title="Justify full" disabled={mode === "plain"}>
                <AlignJustify className="h-4 w-4" />
              </Btn>
              <Sep />
      
              <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list" disabled={mode === "plain"}>
                <List className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => exec("insertOrderedList")} title="Numbered list" disabled={mode === "plain"}>
                <ListOrdered className="h-4 w-4" />
              </Btn>
              <Btn onClick={insertQuote} title="Blockquote" disabled={mode === "plain"}>
                <Quote className="h-4 w-4" />
              </Btn>
              <Btn onClick={insertDivider} title="Horizontal divider line" disabled={mode === "plain"}>
                <Minus className="h-4 w-4" />
              </Btn>
              <Btn onClick={insertLink} title="Insert / edit link" disabled={mode === "plain"}>
                <Link2 className="h-4 w-4" />
              </Btn>
              <Btn onClick={insertTable} title="Insert Table" disabled={mode === "plain"}>
                <TableIcon className="h-4 w-4" />
              </Btn>
              <Sep />
      
              <Btn onClick={insertImage} title="Insert image by URL" disabled={mode === "plain"}>
                <ImageIcon className="h-4 w-4" />
              </Btn>
              <Btn onClick={() => imgRef.current?.click()} title="Upload image from computer" disabled={mode === "plain"}>
                <Upload className="h-4 w-4" />
              </Btn>
              <ImageUpload imgRef={imgRef} uploadImage={uploadImage} />
              <Btn onClick={insertYouTube} title="Embed YouTube video" disabled={mode === "plain"}>
                <Youtube className="h-4 w-4 text-red-600" />
              </Btn>
              <Btn onClick={insertFacebook} title="Embed Facebook video" disabled={mode === "plain"}>
                <Facebook className="h-4 w-4 text-blue-600" />
              </Btn>
              <Btn onClick={insertVideoUrl} title="Embed video file (.mp4, .webm)" disabled={mode === "plain"}>
                <Video className="h-4 w-4" />
              </Btn>
      
              {/* Right Section: Fullscreen, Word Count, Visual/Plain toggle */}
              <div className="ml-auto flex items-center gap-2 pr-1">
                <Btn
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen editor"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4 text-blue-600" /> : <Maximize2 className="h-4 w-4" />}
                </Btn>
                <span className="text-xs font-medium text-slate-500">{words} words</span>
                <div className="inline-flex rounded-md border border-slate-300 bg-slate-100 p-0.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setMode("visual")}
                    className={`rounded px-2.5 py-1 transition-colors ${
                      mode === "visual"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      emit();
                      setMode("plain");
                    }}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${
                      mode === "plain"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText className="h-3 w-3" />
                    Plain Text
                  </button>
                </div>
              </div>
            </div>
    </>
  );
}
