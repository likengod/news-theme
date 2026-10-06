import React, { useEffect, useRef, useState } from "react";
import {
  Undo,
  Redo,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  RemoveFormatting,
  Code2,
  Highlighter,
  ChevronDown,
  Pipette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Table as TableIcon,
  Image as ImageIcon,
  Upload,
  Youtube,
  Facebook,
  Video,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";
import { loadFontConfig } from "@/lib/font-config";

const TEXT_PALETTE_ROWS = [
  ["#000000", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#ffffff"],
  ["#450a0a", "#7f1d1d", "#991b1b", "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5"],
  ["#431407", "#7c2d12", "#9a3412", "#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74"],
  ["#422006", "#713f12", "#854d0e", "#a16207", "#ca8a04", "#eab308", "#facc15", "#fef08a"],
  ["#052e16", "#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac"],
  ["#042f2e", "#134e4a", "#115e59", "#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4"],
  ["#172554", "#1e3a8a", "#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
  ["#3b0764", "#581c87", "#6b21a8", "#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#e9d5ff"],
];

const HIGHLIGHT_PALETTE_ROWS = [
  ["#fef08a", "#fde047", "#facc15", "#eab308"],
  ["#bbf7d0", "#86efac", "#4ade80", "#22c55e"],
  ["#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"],
  ["#fbcfe8", "#f472b6", "#ec4899", "#db2777"],
  ["#fed7aa", "#fdba74", "#fb923c", "#f97316"],
  ["#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7"],
  ["#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"],
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const lastHtml = useRef<string>(value);
  const savedSelection = useRef<Range | null>(null);

  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const [fontOptions, setFontOptions] = useState<string[]>(["Default"]);
  const [mode, setMode] = useState<"visual" | "plain">("visual");
  // Default font size is 14px as requested
  const [currentSize, setCurrentSize] = useState<string>("14");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [activeTextColor, setActiveTextColor] = useState("#1A1110");
  const [activeHighlightColor, setActiveHighlightColor] = useState("transparent");

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

  const emit = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastHtml.current = html;
    onChange(html);
  };

  const focus = () => ref.current?.focus();

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current) {
      const range = sel.getRangeAt(0);
      if (ref.current.contains(range.commonAncestorContainer)) {
        savedSelection.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    focus();
    if (savedSelection.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection.current);
      }
    }
  };

  const exec = (cmd: string, val?: string) => {
    restoreSelection();
    document.execCommand(cmd, false, val);
    emit();
    saveSelection();
  };

  const formatBlock = (tag: string) => {
    restoreSelection();
    try {
      const ok = document.execCommand("formatBlock", false, `<${tag}>`);
      if (!ok) document.execCommand("formatBlock", false, tag);
    } catch {
      document.execCommand("formatBlock", false, tag);
    }

    // When converting to a heading (h2, h3, h4), strip any trapped paragraph inline font-size
    // so the heading renders at its true heading size without being squashed to 14px!
    const sel = window.getSelection();
    if (sel && sel.anchorNode && ref.current) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== ref.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          if (["h2", "h3", "h4"].includes(tagName)) {
            el.style.fontSize = "";
            el.querySelectorAll<HTMLElement>("span, font, [style*='font-size']").forEach((child) => {
              child.style.fontSize = "";
            });
            break;
          }
          if (tagName === "p") {
            el.style.fontSize = "14px";
            break;
          }
        }
        node = node.parentNode;
      }
    }

    emit();
    saveSelection();
  };

  const insertHTML = (html: string) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    emit();
    saveSelection();
  };

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

  const insertTable = () => {
    insertHTML(`
      <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #cbd5e1;font-size:14px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 1</th>
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 2</th>
            <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 1</td>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 2</td>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 3</td>
          </tr>
          <tr>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 1</td>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 2</td>
            <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 3</td>
          </tr>
        </tbody>
      </table>
      <p><br/></p>
    `);
  };

  const sizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36"];

  const setFontFamily = (f: string) => {
    if (f === "Default") return;
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    const fontValue = `'${f}', serif`;
    const range = sel.getRangeAt(0);

    if (range.collapsed) {
      let node: Node | null = range.startContainer;
      while (node && node !== ref.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          if (["p", "div", "li", "h1", "h2", "h3", "h4", "blockquote"].includes(tagName)) {
            el.style.fontFamily = fontValue;
            emit();
            saveSelection();
            return;
          }
        }
        node = node.parentNode;
      }
      return;
    }

    // Check multi-block selection (e.g. Ctrl+A or multiple paragraphs)
    const allBlocks = ref.current.querySelectorAll<HTMLElement>("p, h2, h3, h4, li, blockquote");
    const selectedBlocks: HTMLElement[] = [];
    allBlocks.forEach((b) => {
      if (sel.containsNode(b, true)) selectedBlocks.push(b);
    });

    if (selectedBlocks.length > 1) {
      selectedBlocks.forEach((b) => {
        b.style.fontFamily = fontValue;
      });
      emit();
      saveSelection();
      return;
    }

    // Inline selection
    document.execCommand("fontName", false, f);
    const fontTags = ref.current.querySelectorAll(`font[face='${f}']`);
    fontTags.forEach((font) => {
      const span = document.createElement("span");
      span.style.fontFamily = fontValue;
      while (font.firstChild) span.appendChild(font.firstChild);
      font.parentNode?.replaceChild(span, font);
    });
    emit();
    saveSelection();
  };

  /**
   * Robust Font Size Implementation:
   * Works on:
   * 1. Select All (Ctrl+A / multiple paragraphs)
   * 2. Separate selected words/phrases (partial selection)
   * 3. Cursor position (collapsed)
   */
  const setFontSize = (px: string) => {
    restoreSelection();
    setCurrentSize(px);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    const range = sel.getRangeAt(0);

    // CASE 1: Cursor is collapsed (no selection, typing at point)
    if (range.collapsed) {
      let node: Node | null = range.startContainer;
      let blockEl: HTMLElement | null = null;
      while (node && node !== ref.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const t = el.tagName.toLowerCase();
          if (["p", "div", "li", "h2", "h3", "h4", "blockquote"].includes(t)) {
            blockEl = el;
            break;
          }
        }
        node = node.parentNode;
      }

      if (blockEl) {
        blockEl.style.fontSize = `${px}px`;
        blockEl.querySelectorAll<HTMLElement>("span[style*='font-size'], font").forEach((s) => {
          s.style.fontSize = "";
        });
      } else {
        const span = document.createElement("span");
        span.style.fontSize = `${px}px`;
        span.innerHTML = "&#8203;";
        range.insertNode(span);
        const newRange = document.createRange();
        newRange.setStart(span, 1);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      emit();
      saveSelection();
      return;
    }

    // CASE 2: Multi-block or complete block selection (Select-All / multiple paragraphs)
    const allBlocks = ref.current.querySelectorAll<HTMLElement>("p, h2, h3, h4, li, blockquote");
    const selectedBlocks: HTMLElement[] = [];
    allBlocks.forEach((block) => {
      if (sel.containsNode(block, true)) {
        selectedBlocks.push(block);
      }
    });

    const isAllOrMultiBlock =
      selectedBlocks.length > 1 ||
      (selectedBlocks.length === 1 &&
        range.toString().trim().length > 0 &&
        range.toString().trim() === selectedBlocks[0].innerText.trim());

    if (isAllOrMultiBlock) {
      selectedBlocks.forEach((block) => {
        block.style.fontSize = `${px}px`;
        // Strip nested conflicting span font sizes so the new size is uniformly clean
        block.querySelectorAll<HTMLElement>("span, font").forEach((child) => {
          if (child.style.fontSize) child.style.fontSize = "";
        });
      });
      emit();
      saveSelection();
      return;
    }

    // CASE 3: Partial or separate inline selection within a paragraph or phrase
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}

    // Use browser execCommand fontSize '7' as reliable non-destructive marker
    document.execCommand("fontSize", false, "7");

    const fontTags = ref.current.querySelectorAll("font[size='7']");
    fontTags.forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = `${px}px`;
      while (f.firstChild) {
        span.appendChild(f.firstChild);
      }
      f.parentNode?.replaceChild(span, f);
    });

    const styledSpans = ref.current.querySelectorAll<HTMLElement>(
      "span[style*='-webkit-xxx-large'], span[style*='xxx-large'], span[style*='font-size: 7']",
    );
    styledSpans.forEach((s) => {
      s.style.fontSize = `${px}px`;
    });

    emit();
    saveSelection();
  };

  const updateSelectionState = () => {
    saveSelection();
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !ref.current) return;
    const el =
      sel.anchorNode.nodeType === Node.ELEMENT_NODE
        ? (sel.anchorNode as HTMLElement)
        : sel.anchorNode.parentElement;
    if (el) {
      const fs = window.getComputedStyle(el).fontSize;
      const numeric = parseInt(fs, 10);
      if (numeric && sizes.includes(String(numeric))) {
        setCurrentSize(String(numeric));
      } else {
        setCurrentSize("14");
      }
    }
  };

  /**
   * Smart Paste Handler:
   * When admin pastes text, paragraphs automatically default to 14px font size.
   * Headings (h2, h3, h4) are PRESERVED and not squashed into 14px!
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData("text/html");
    const textData = clipboardData.getData("text/plain");

    if (htmlData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, "text/html");

      doc.body.querySelectorAll("*").forEach((el) => {
        const tag = el.tagName.toLowerCase();
        if (tag !== "h2" && tag !== "h3" && tag !== "h4") {
          // Standard paragraphs and list items default to 14px
          if (["p", "li", "div"].includes(tag)) {
            (el as HTMLElement).style.fontSize = "14px";
            (el as HTMLElement).style.lineHeight = "1.75";
          } else if (tag === "span" || tag === "font") {
            (el as HTMLElement).style.fontSize = "";
          }
          (el as HTMLElement).style.fontFamily = "";
        } else {
          // Keep headings (H2, H3, H4) untouched with their full heading styles
          (el as HTMLElement).style.fontSize = "";
        }
      });

      const cleanHtml = doc.body.innerHTML;
      if (cleanHtml.trim()) {
        document.execCommand("insertHTML", false, cleanHtml);
        emit();
        saveSelection();
        return;
      }
    }

    // Plain text paste fallback
    if (textData) {
      const paragraphs = textData
        .split(/\r?\n\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (paragraphs.length > 1) {
        const html = paragraphs
          .map((p) => `<p style="font-size:14px;line-height:1.75;margin:0.5rem 0;">${escapeHtml(p)}</p>`)
          .join("");
        document.execCommand("insertHTML", false, html);
      } else {
        const html = `<p style="font-size:14px;line-height:1.75;margin:0.5rem 0;">${escapeHtml(textData)}</p>`;
        document.execCommand("insertHTML", false, html);
      }
      emit();
      saveSelection();
    }
  };

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
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            uploadImage(e.target.files?.[0]);
            if (imgRef.current) imgRef.current.value = "";
          }}
        />
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
