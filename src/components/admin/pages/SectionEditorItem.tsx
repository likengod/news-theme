import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { generateSectionHtmlServer } from "@/lib/ai.functions";
import { 
  Sparkles, 
  Loader2, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Code, 
  Eye, 
  Type, 
  Trash2,
  HelpCircle
} from "lucide-react";

export function htmlToNormalText(html?: string): string {
  if (!html) return "";
  let t = html;
  // Replace list items
  t = t.replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n");
  t = t.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");
  // Replace paragraphs and line breaks
  t = t.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  t = t.replace(/<\/?p[^>]*>/gi, "");
  t = t.replace(/<br\s*\/?>/gi, "\n");
  // Replace bold & italic
  t = t.replace(/<(b|strong)[^>]*>(.*?)<\/(b|strong)>/gi, "**$2**");
  t = t.replace(/<(i|em)[^>]*>(.*?)<\/(i|em)>/gi, "*$2*");
  // Replace links
  t = t.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  // Clean multiple newlines and trim
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

export function normalTextToHtml(text?: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  // If already full HTML with tags and no normal markdown, preserve as is
  if (/^<[a-z][\s\S]*>$/i.test(trimmed) && trimmed.includes("</")) {
    return trimmed;
  }
  
  const blocks = trimmed.split(/\n\s*\n/);
  const htmlBlocks = blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return "";
    
    // Check if it is a bullet list
    const isList = lines.every((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("* "));
    if (isList) {
      const items = lines
        .map((l) => {
          let itemText = l.replace(/^[•\-\*]\s*/, "");
          itemText = itemText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
          itemText = itemText.replace(/\*(.*?)\*/g, "<i>$1</i>");
          itemText = itemText.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="underline text-blue-600" href="$2">$1</a>');
          return `<li>${itemText}</li>`;
        })
        .join("");
      return `<ul class="list-disc space-y-1.5 pl-5">${items}</ul>`;
    }
    
    // Regular paragraph
    let para = lines.join(" ");
    para = para.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    para = para.replace(/\*(.*?)\*/g, "<i>$1</i>");
    para = para.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="underline text-blue-600" href="$2">$1</a>');
    return `<p>${para}</p>`;
  });
  
  return htmlBlocks.filter(Boolean).join("\n");
}

export function SectionEditorItem({ sec, idx, activeSections, update }: any) {
  const [mode, setMode] = useState<"normal" | "html" | "preview">("normal");
  const [normalText, setNormalText] = useState<string>(() => htmlToNormalText(sec.body || ""));
  const [rawHtml, setRawHtml] = useState<string>(sec.body || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");

  // Sync state if sec.body changes from outside (e.g. switching pages)
  useEffect(() => {
    setRawHtml(sec.body || "");
    setNormalText(htmlToNormalText(sec.body || ""));
  }, [sec.body]);

  const updateBody = (newHtml: string) => {
    const newSections = [...activeSections];
    newSections[idx].body = newHtml;
    update("sections", newSections);
  };

  const handleNormalTextChange = (val: string) => {
    setNormalText(val);
    const converted = normalTextToHtml(val);
    setRawHtml(converted);
    updateBody(converted);
  };

  const handleRawHtmlChange = (val: string) => {
    setRawHtml(val);
    setNormalText(htmlToNormalText(val));
    updateBody(val);
  };

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = normalText;
    const selected = current.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;
    const next = current.substring(0, start) + replacement + current.substring(end);

    handleNormalTextChange(next);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter instructions for the AI.");
      return;
    }
    setIsGenerating(true);
    setGeneratedHtml("");
    try {
      const res = await generateSectionHtmlServer({
        data: {
          instructions: prompt,
          currentHeading: sec.heading,
          currentBody: rawHtml,
        },
      });
      setGeneratedHtml(res);
      toast.success("Content generated! Review below.");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (mode === "normal") {
      const normal = htmlToNormalText(generatedHtml);
      setNormalText(normal);
      setRawHtml(generatedHtml);
      updateBody(generatedHtml);
    } else {
      setRawHtml(generatedHtml);
      setNormalText(htmlToNormalText(generatedHtml));
      updateBody(generatedHtml);
    }
    setShowModal(false);
    setGeneratedHtml("");
    setPrompt("");
    toast.success("Content applied successfully!");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm relative transition hover:border-slate-300">
      {/* Remove Button */}
      <button
        onClick={() => {
          const newSections = [...activeSections];
          newSections.splice(idx, 1);
          update("sections", newSections);
        }}
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        title="Delete this section"
      >
        <Trash2 className="h-3.5 w-3.5" /> Remove
      </button>

      {/* Heading Field */}
      <div className="pr-24">
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Section {idx + 1} Heading
        </label>
        <input
          type="text"
          value={sec.heading}
          onChange={(e) => {
            const newSections = [...activeSections];
            newSections[idx].heading = e.target.value;
            update("sections", newSections);
          }}
          placeholder="e.g. Our Mission, Privacy Notice, Refund Timeline..."
          className="h-10 w-full md:w-3/4 rounded-lg border border-slate-300 px-3.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        {/* Editor Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("normal")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
                mode === "normal"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="h-3.5 w-3.5 text-indigo-600" />
              <span>Normal Text</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("html")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
                mode === "html"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code className="h-3.5 w-3.5 text-slate-500" />
              <span>HTML Code</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${
                mode === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> AI Assistant
            </button>
          </div>
        </div>

        {/* Formatting Toolbar (Only visible in Normal Text mode) */}
        {mode === "normal" && (
          <div className="flex flex-wrap items-center gap-1 rounded-md bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1.5">Quick Format:</span>
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="inline-flex items-center gap-1 rounded px-2 py-1 font-bold text-slate-700 hover:bg-slate-200"
              title="Bold (**text**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              className="inline-flex items-center gap-1 rounded px-2 py-1 italic text-slate-700 hover:bg-slate-200"
              title="Italic (*text*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n• ")}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-700 hover:bg-slate-200"
              title="Add Bullet Point (• item)"
            >
              <List className="h-3.5 w-3.5" /> Bullet
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("[Link Text](https://example.com)")}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-700 hover:bg-slate-200"
              title="Insert Link [Text](URL)"
            >
              <LinkIcon className="h-3.5 w-3.5" /> Link
            </button>
            <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Press Enter twice for new paragraphs
            </span>
          </div>
        )}

        {/* Content Area according to active Mode */}
        {mode === "normal" ? (
          <div>
            <textarea
              ref={textareaRef}
              value={normalText}
              onChange={(e) => handleNormalTextChange(e.target.value)}
              rows={7}
              placeholder="Write your section content here in plain, natural text. You don't need any HTML tags!"
              className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-800 leading-relaxed focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              💡 <strong>Normal Text Mode:</strong> Write naturally. Paragraphs and bullet points are automatically formatted for the website.
            </p>
          </div>
        ) : mode === "html" ? (
          <div>
            <textarea
              value={rawHtml}
              onChange={(e) => handleRawHtmlChange(e.target.value)}
              rows={7}
              placeholder="<p>Raw HTML code...</p>"
              className="w-full rounded-lg border border-slate-300 p-3.5 text-sm font-mono text-slate-800 bg-slate-50 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              ⚡ <strong>HTML Mode:</strong> Direct raw HTML editing for advanced styling.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 min-h-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Live Page Preview:</span>
            <div 
              className="prose prose-sm max-w-none text-slate-700 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: rawHtml || "<p class='text-slate-400 italic'>No content to preview.</p>" }} 
            />
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                <Sparkles className="h-5 w-5 text-indigo-600" /> AI Content Assistant
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1">
                &times;
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="mb-1 block text-sm font-bold text-slate-700">Instructions</label>
                <p className="mb-3 text-xs text-slate-500">Describe what you want to say in simple words. AI will write clear, professional content.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Explain our 7-day refund policy clearly with bullet points..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    className="flex-1 h-10 rounded-lg border border-slate-300 px-3.5 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                  >
                    {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Generate"}
                  </button>
                </div>
              </div>

              {generatedHtml && (
                <div className="mt-4 pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700">Generated Preview:</label>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      Ready to apply
                    </span>
                  </div>
                  <div 
                    className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 bg-slate-50 max-h-52 overflow-y-auto [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: generatedHtml }}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!generatedHtml}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Apply to Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionEditorItem;
