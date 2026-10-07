import React, { useRef, useState } from "react";
import { FONT_SIZES, escapeHtml } from "./editorConstants";

interface UseRichEditorSelectionProps {
  ref: React.RefObject<HTMLDivElement | null>;
  lastHtml: React.MutableRefObject<string>;
  onChange: (v: string) => void;
  setCurrentSize: (size: string) => void;
}

export function useRichEditorSelection({
  ref,
  lastHtml,
  onChange,
  setCurrentSize,
}: UseRichEditorSelectionProps) {
  const savedSelection = useRef<Range | null>(null);

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

  const setFontSize = (px: string) => {
    restoreSelection();
    setCurrentSize(px);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    const range = sel.getRangeAt(0);

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
        block.querySelectorAll<HTMLElement>("span, font").forEach((child) => {
          if (child.style.fontSize) child.style.fontSize = "";
        });
      });
      emit();
      saveSelection();
      return;
    }

    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}

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
      if (numeric && FONT_SIZES.includes(String(numeric))) {
        setCurrentSize(String(numeric));
      } else {
        setCurrentSize("14");
      }
    }
  };

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
          if (["p", "li", "div"].includes(tag)) {
            (el as HTMLElement).style.fontSize = "14px";
            (el as HTMLElement).style.lineHeight = "1.75";
          } else if (tag === "span" || tag === "font") {
            (el as HTMLElement).style.fontSize = "";
          }
          (el as HTMLElement).style.fontFamily = "";
        } else {
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

  return {
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
  };
}
