import React, { useEffect, useRef } from "react";
import {
  Image as ImageIcon, Upload,
  Bold, Italic, Underline, List, ListOrdered, Link2, Quote, Heading2, Heading3,
  Pilcrow, Type, Palette,
  Youtube, Facebook, Video, AlignLeft, AlignCenter, AlignRight, Code2, Minus
} from "lucide-react";
import { loadFontConfig } from "@/lib/font-config";

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const lastHtml = useRef<string>(value);

  const [fontOptions, setFontOptions] = React.useState<string[]>(["Default"]);

  useEffect(() => {
    if (ref.current && value !== lastHtml.current) {
      ref.current.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, [value]);
  useEffect(() => {
    if (ref.current && !ref.current.innerHTML && value) ref.current.innerHTML = value;
  }, []);

  useEffect(() => {
    const config = loadFontConfig();
    if (config && config.fonts) {
      const families = config.fonts.map(f => f.name || f.family);
      setFontOptions(["Default", ...new Set(families)]);
    }
    const handleUpdate = () => {
      const updated = loadFontConfig();
      if (updated && updated.fonts) {
        const families = updated.fonts.map(f => f.name || f.family);
        setFontOptions(["Default", ...new Set(families)]);
      }
    };
    window.addEventListener("nt:fonts-updated", handleUpdate);
    return () => window.removeEventListener("nt:fonts-updated", handleUpdate);
  }, []);

  const emit = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    lastHtml.current = html;
    onChange(html);
  };
  const focus = () => ref.current?.focus();
  const exec = (cmd: string, val?: string) => { focus(); document.execCommand(cmd, false, val); emit(); };
  const insertHTML = (html: string) => { focus(); document.execCommand("insertHTML", false, html); emit(); };

  const insertImage = () => {
    const url = prompt("Image URL (or use Upload)"); if (!url) return;
    const alt = prompt("Alt text (optional)") || "image";
    insertHTML(`<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`);
  };
  const uploadImage = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => insertHTML(`<img src="${reader.result}" alt="image" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`);
    reader.readAsDataURL(f);
  };
  const insertYouTube = () => {
    const url = prompt("YouTube URL (e.g. https://youtu.be/abc123)"); if (!url) return;
    const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
    const id = m ? m[1] : url;
    insertHTML(`<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px"></iframe></div><p><br/></p>`);
  };
  const insertFacebook = () => {
    const url = prompt("Facebook video URL"); if (!url) return;
    insertHTML(`<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px" scrolling="no" allowfullscreen></iframe></div><p><br/></p>`);
  };
  const insertVideoUrl = () => {
    const url = prompt("Direct video URL (.mp4, .webm)"); if (!url) return;
    insertHTML(`<video src="${url}" controls style="max-width:100%;border-radius:8px;margin:12px 0"></video><p><br/></p>`);
  };
  const insertLink = () => { const url = prompt("URL"); if (!url) return; exec("createLink", url); };
  const insertDivider = () => insertHTML(`<hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0" />`);
  const insertQuote = () => exec("formatBlock", "blockquote");

  const sizes = ["12", "14", "16", "18", "20", "24", "28", "32"];
  const colors = ["#1A1110", "#E11D48", "#16A34A", "#2563EB", "#D97706", "#7C3AED", "#64748B", "#FFFFFF"];

  const setFontFamily = (f: string) => {
    if (f === "Default") return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { insertHTML(`<span style="font-family:'${f}',serif">text</span>`); return; }
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontFamily = `'${f}', serif`;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    sel.removeAllRanges();
    emit();
  };
  const setFontSize = (px: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { insertHTML(`<span style="font-size:${px}px">text</span>`); return; }
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${px}px`;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    sel.removeAllRanges();
    emit();
  };

  const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title} className="grid h-8 w-8 place-items-center rounded text-slate-700 hover:bg-slate-200">{children}</button>
  );
  const Sep = () => <span className="mx-1 h-5 w-px bg-slate-300" />;
  const words = (ref.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5" onMouseDown={(e) => e.preventDefault()}>
        <Btn onClick={() => exec("formatBlock", "p")} title="Paragraph"><Pilcrow className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("formatBlock", "h2")} title="Heading 2"><Heading2 className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("formatBlock", "h3")} title="Heading 3"><Heading3 className="h-4 w-4" /></Btn>
        <Sep />
        <select onChange={(e) => { setFontFamily(e.target.value); e.target.value = "Default"; }} onMouseDown={(e) => e.stopPropagation()} title="Font family" className="h-8 rounded border border-slate-200 bg-white px-1.5 text-xs">
          {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={(e) => { if (e.target.value !== "Size") setFontSize(e.target.value); e.target.value = "Size"; }} onMouseDown={(e) => e.stopPropagation()} title="Font size" className="h-8 rounded border border-slate-200 bg-white px-1.5 text-xs">
          <option>Size</option>{sizes.map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="relative inline-flex items-center gap-0.5">
          <Type className="ml-1 h-3.5 w-3.5 text-slate-500" />
          {colors.map((c) => (
            <button key={c} type="button" title={`Text ${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("foreColor", c)} className="h-5 w-5 rounded border border-slate-300" style={{ background: c }} />
          ))}
          <button type="button" title="Custom color" onMouseDown={(e) => e.preventDefault()} onClick={() => { const c = prompt("Hex color, e.g. #ff0000"); if (c) exec("foreColor", c); }} className="grid h-5 w-5 place-items-center rounded border border-slate-300 bg-white"><Palette className="h-3 w-3" /></button>
        </div>
        <Sep />
        <Btn onClick={() => exec("bold")} title="Bold"><Bold className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("italic")} title="Italic"><Italic className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("underline")} title="Underline"><Underline className="h-4 w-4" /></Btn>
        <Btn onClick={() => insertHTML(`<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace">code</code>`)} title="Inline code"><Code2 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn onClick={() => exec("justifyLeft")} title="Align left"><AlignLeft className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Align center"><AlignCenter className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("justifyRight")} title="Align right"><AlignRight className="h-4 w-4" /></Btn>
        <Sep />
        <Btn onClick={insertQuote} title="Quote"><Quote className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List className="h-4 w-4" /></Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered className="h-4 w-4" /></Btn>
        <Btn onClick={insertDivider} title="Divider"><Minus className="h-4 w-4" /></Btn>
        <Btn onClick={insertLink} title="Link"><Link2 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn onClick={insertImage} title="Insert image by URL"><ImageIcon className="h-4 w-4" /></Btn>
        <Btn onClick={() => imgRef.current?.click()} title="Upload image"><Upload className="h-4 w-4" /></Btn>
        <input ref={imgRef} type="file" accept="image/*" hidden onChange={(e) => { uploadImage(e.target.files?.[0]); if (imgRef.current) imgRef.current.value = ""; }} />
        <Btn onClick={insertYouTube} title="Embed YouTube"><Youtube className="h-4 w-4 text-red-600" /></Btn>
        <Btn onClick={insertFacebook} title="Embed Facebook video"><Facebook className="h-4 w-4 text-blue-600" /></Btn>
        <Btn onClick={insertVideoUrl} title="Embed video file"><Video className="h-4 w-4" /></Btn>
        <span className="ml-auto pr-2 text-xs text-slate-500">{words} words</span>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning onInput={emit} onBlur={emit}
        data-placeholder="Write your article here. Use the toolbar to format text, change color, insert images, and embed YouTube/Facebook videos â€” everything renders live as you type."
        className="rich-editor block min-h-[360px] w-full px-5 py-4 text-[15px] leading-relaxed text-slate-900 focus:outline-none"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }} />
      <style>{`
        .rich-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        .rich-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; }
        .rich-editor h3 { font-size: 1.25rem; font-weight: 700; margin: .75rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; }
        .rich-editor p { margin: .5rem 0; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor blockquote { border-left: 3px solid #1A1110; padding: .25rem 1rem; margin: .75rem 0; color: #475569; font-style: italic; background:#f8fafc; }
        .rich-editor a { color: #2563eb; text-decoration: underline; }
        .rich-editor img { max-width: 100%; height: auto; }
      `}</style>
    </div>
  );
}

export default RichEditor;
