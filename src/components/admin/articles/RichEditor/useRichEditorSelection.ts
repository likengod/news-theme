import React, { useRef } from "react";
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

  const isEditorNode = (node: Node | null): boolean => {
    if (!node || !ref.current) return false;
    return ref.current === node || ref.current.contains(node);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;
    try {
      const range = sel.getRangeAt(0);
      // Handles both normal selection and Ctrl+A / Select All
      if (
        isEditorNode(range.commonAncestorContainer) ||
        isEditorNode(range.startContainer) ||
        isEditorNode(range.endContainer) ||
        (range.commonAncestorContainer && range.commonAncestorContainer.contains(ref.current))
      ) {
        // If range spans outside the editor (e.g. Ctrl+A caught outer wrapper), clamp to editor
        if (!isEditorNode(range.commonAncestorContainer)) {
          const clamped = document.createRange();
          clamped.selectNodeContents(ref.current);
          savedSelection.current = clamped;
        } else {
          savedSelection.current = range.cloneRange();
        }
      }
    } catch {}
  };

  const restoreSelection = () => {
    focus();
    const sel = window.getSelection();
    if (!sel || !ref.current) return;

    if (savedSelection.current) {
      try {
        sel.removeAllRanges();
        sel.addRange(savedSelection.current);
        return;
      } catch {}
    }

    // Fallback: if no saved selection, default to selecting all content if editor has children
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    sel.removeAllRanges();
    sel.addRange(range);
    savedSelection.current = range.cloneRange();
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
            el.querySelectorAll<HTMLElement>("*").forEach((child) => {
              if (child.style && child.style.fontSize) child.style.fontSize = "";
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
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    const fontValue = f === "Default" ? "" : `'${f}', system-ui, sans-serif`;
    const range = sel.getRangeAt(0);

    const blockSelector = "p, div, h1, h2, h3, h4, li, blockquote, pre, td, th";
    const allBlocks = ref.current.querySelectorAll<HTMLElement>(blockSelector);
    const selectedBlocks: HTMLElement[] = [];
    allBlocks.forEach((b) => {
      if (sel.containsNode(b, true)) selectedBlocks.push(b);
    });

    if (selectedBlocks.length > 0) {
      selectedBlocks.forEach((b) => {
        b.style.fontFamily = fontValue;
        b.querySelectorAll<HTMLElement>("*").forEach((child) => {
          if (child.style && child.style.fontFamily) child.style.fontFamily = "";
        });
      });
      emit();
      saveSelection();
      return;
    }

    if (!range.collapsed) {
      const fragment = range.extractContents();
      fragment.querySelectorAll<HTMLElement>("*").forEach((child) => {
        if (child.style && child.style.fontFamily) child.style.fontFamily = "";
      });
      const span = document.createElement("span");
      if (fontValue) span.style.fontFamily = fontValue;
      span.appendChild(fragment);
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedSelection.current = newRange.cloneRange();
    }
    emit();
    saveSelection();
  };

  const setFontSize = (px: string) => {
    restoreSelection();
    setCurrentSize(px);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    const range = sel.getRangeAt(0);
    const targetSize = `${px}px`;

    // Helper: strip all conflicting font-size / font tags inside an element
    const cleanInnerFontSizes = (el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>("*").forEach((child) => {
        if (child.style && child.style.fontSize) {
          child.style.fontSize = "";
        }
        if (child.tagName.toLowerCase() === "font") {
          child.removeAttribute("size");
        }
      });
    };

    // Case 1: Range is collapsed (cursor with no selection)
    if (range.collapsed) {
      let node: Node | null = range.startContainer;
      let blockEl: HTMLElement | null = null;
      while (node && node !== ref.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const t = el.tagName.toLowerCase();
          if (["p", "div", "li", "h2", "h3", "h4", "blockquote", "td", "th"].includes(t)) {
            blockEl = el;
            break;
          }
        }
        node = node.parentNode;
      }

      if (blockEl) {
        blockEl.style.fontSize = targetSize;
        cleanInnerFontSizes(blockEl);
      } else {
        const span = document.createElement("span");
        span.style.fontSize = targetSize;
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

    // Case 2: Multi-block or Select All (Ctrl+A)
    const blockSelector = "p, div, h1, h2, h3, h4, li, blockquote, pre, td, th";
    const allBlocks = ref.current.querySelectorAll<HTMLElement>(blockSelector);
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
        block.style.fontSize = targetSize;
        cleanInnerFontSizes(block);
      });
      emit();
      saveSelection();
      return;
    }

    // Case 3: Partial text selection within a block or single node
    try {
      const fragment = range.extractContents();
      // Clean any nested font-size on elements inside the extracted fragment
      fragment.querySelectorAll<HTMLElement>("*").forEach((child) => {
        if (child.style && child.style.fontSize) {
          child.style.fontSize = "";
        }
        if (child.tagName.toLowerCase() === "font") {
          child.removeAttribute("size");
        }
      });

      const span = document.createElement("span");
      span.style.fontSize = targetSize;
      span.appendChild(fragment);
      range.insertNode(span);

      // Smoothly re-select the newly styled span so user maintains their selection
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedSelection.current = newRange.cloneRange();
    } catch {
      // Fallback if range.extractContents() fails on cross-boundary edge cases
      try {
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("fontSize", false, "7");
        ref.current.querySelectorAll("font[size='7']").forEach((f) => {
          const span = document.createElement("span");
          span.style.fontSize = targetSize;
          while (f.firstChild) span.appendChild(f.firstChild);
          f.parentNode?.replaceChild(span, f);
        });
        ref.current
          .querySelectorAll<HTMLElement>(
            "span[style*='-webkit-xxx-large'], span[style*='xxx-large'], span[style*='font-size: 7']",
          )
          .forEach((s) => {
            s.style.fontSize = targetSize;
          });
      } catch {}
    }

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

  // Remove links from selected text or cursor position
  const unlink = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    try {
      document.execCommand("unlink", false);
    } catch {}

    const range = sel.getRangeAt(0);
    const editorText = (ref.current.innerText || "").trim();
    const selText = range.toString().trim();
    const isAllSelected =
      range.commonAncestorContainer === ref.current ||
      range.commonAncestorContainer.contains(ref.current) ||
      (editorText.length > 0 && selText.length > 0 && selText === editorText);

    const unwrap = (node: Element) => {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
    };

    ref.current.querySelectorAll("a").forEach((a) => {
      if (
        isAllSelected ||
        sel.containsNode(a, true) ||
        a.contains(range.startContainer) ||
        a.contains(range.endContainer)
      ) {
        unwrap(a);
      }
    });

    emit();
    saveSelection();
  };

  // Complete clean formatting: removes all links, styles, bold/italic, resets to clean 14px text
  const clearFormatting = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !ref.current) return;

    // 1. Browser native commands
    try {
      document.execCommand("unlink", false);
    } catch {}
    try {
      document.execCommand("removeFormat", false);
    } catch {}

    const range = sel.getRangeAt(0);
    const editorText = (ref.current.innerText || "").trim();
    const selText = range.toString().trim();
    const isAllSelected =
      range.commonAncestorContainer === ref.current ||
      range.commonAncestorContainer.contains(ref.current) ||
      (editorText.length > 0 && selText.length > 0 && selText === editorText);

    const unwrap = (node: Element) => {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
    };

    // 2. Remove all <a> hyperlinks within the selection or cursor
    ref.current.querySelectorAll("a").forEach((a) => {
      if (
        isAllSelected ||
        sel.containsNode(a, true) ||
        a.contains(range.startContainer) ||
        a.contains(range.endContainer)
      ) {
        unwrap(a);
      }
    });

    // 3. Remove inline formatting tags (b, strong, i, em, u, s, strike, del, mark, font, small, sub, sup, code)
    const inlineFormatting = "b, strong, i, em, u, s, strike, del, mark, font, small, sub, sup, code";
    ref.current.querySelectorAll(inlineFormatting).forEach((el) => {
      if (
        isAllSelected ||
        sel.containsNode(el, true) ||
        el.contains(range.startContainer) ||
        el.contains(range.endContainer)
      ) {
        unwrap(el);
      }
    });

    // 4. Strip all inline styles, classes, and obsolete attributes
    ref.current.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (["img", "iframe", "video"].includes(tag)) return;

      if (
        isAllSelected ||
        sel.containsNode(el, true) ||
        el.contains(range.startContainer) ||
        el.contains(range.endContainer)
      ) {
        el.removeAttribute("style");
        el.removeAttribute("class");
        el.removeAttribute("color");
        el.removeAttribute("face");
        el.removeAttribute("size");
        el.removeAttribute("dir");
        el.removeAttribute("lang");
      }
    });

    // 5. Unwrap useless or empty spans
    ref.current.querySelectorAll("span").forEach((span) => {
      if (!span.getAttribute("style") && !span.getAttribute("class") && !span.getAttribute("id")) {
        unwrap(span);
      }
    });

    // 6. Reset headings (h1-h6) and div text blocks to clean standard <p>
    ref.current.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6, blockquote, div").forEach((block) => {
      if (
        isAllSelected ||
        sel.containsNode(block, true) ||
        block.contains(range.startContainer) ||
        block.contains(range.endContainer)
      ) {
        if (!block.querySelector("p, ul, ol, table, blockquote")) {
          const p = document.createElement("p");
          p.style.fontSize = "14px";
          p.style.lineHeight = "1.75";
          p.style.margin = "0.5rem 0";
          while (block.firstChild) {
            p.appendChild(block.firstChild);
          }
          block.parentNode?.replaceChild(p, block);
        }
      }
    });

    // 7. Ensure all selected paragraphs have default 14px size and clean line height
    ref.current.querySelectorAll<HTMLElement>("p").forEach((p) => {
      if (
        isAllSelected ||
        sel.containsNode(p, true) ||
        p.contains(range.startContainer) ||
        p.contains(range.endContainer)
      ) {
        p.style.fontSize = "14px";
        p.style.lineHeight = "1.75";
        p.style.margin = "0.5rem 0";
      }
    });

    setCurrentSize("14");
    emit();
    saveSelection();
  };

  // Clean pasted content from Word, Google Docs, external websites
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData("text/html");
    const textData = clipboardData.getData("text/plain");

    if (htmlData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, "text/html");

      // 1. Remove scripts, styles, metadata, tracking comments
      doc
        .querySelectorAll("script, style, meta, link, noscript, title, xml, [class*='Mso']")
        .forEach((el) => {
          if (el.tagName.toLowerCase() === "style" || el.tagName.toLowerCase() === "script") {
            el.remove();
          }
        });

      // 2. Unwrap font tags to standard spans
      doc.querySelectorAll("font").forEach((font) => {
        const span = doc.createElement("span");
        while (font.firstChild) span.appendChild(font.firstChild);
        font.parentNode?.replaceChild(span, font);
      });

      // 3. Clean all elements: strip hardcoded font sizes, font families, colors, and Word junk
      doc.body.querySelectorAll("*").forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const htmlEl = el as HTMLElement;

        // Clean Microsoft Word and web attributes
        htmlEl.removeAttribute("class");
        htmlEl.removeAttribute("lang");
        htmlEl.removeAttribute("dir");

        if (htmlEl.style) {
          // Remove restrictive inline typography that blocks editor toolbar
          htmlEl.style.fontSize = "";
          htmlEl.style.fontFamily = "";
          htmlEl.style.color = "";
          htmlEl.style.backgroundColor = "";
          htmlEl.style.textDecoration = "";
          htmlEl.style.lineHeight = "";
          htmlEl.style.margin = "";
          htmlEl.style.padding = "";
        }

        // Convert divs without sub-blocks into standard paragraphs
        if (tag === "div" && !htmlEl.querySelector("p, h1, h2, h3, h4, ul, ol, table")) {
          const p = doc.createElement("p");
          p.innerHTML = htmlEl.innerHTML;
          htmlEl.parentNode?.replaceChild(p, htmlEl);
        }
      });

      // 4. Normalize paragraphs to clean 14px default styling
      doc.querySelectorAll("p").forEach((p) => {
        p.style.fontSize = "14px";
        p.style.lineHeight = "1.75";
        p.style.margin = "0.5rem 0";
      });

      const cleanHtml = doc.body.innerHTML.trim();
      if (cleanHtml) {
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
    clearFormatting,
    unlink,
  };
}
