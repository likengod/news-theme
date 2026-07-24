import { useState } from "react";
import { toast } from "sonner";
import { generateSectionHtmlServer } from "@/lib/ai.functions";
import { Wand2, Save, X, Edit3, Image, Video, FileText, Sparkles, Loader2 } from "lucide-react";
function SectionEditorItem({ sec, idx, activeSections, update }: any) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");

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
          currentBody: sec.body
        }
      });
      setGeneratedHtml(res);
      toast.success("Content generated! Please review.");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    const newSections = [...activeSections];
    newSections[idx].body = generatedHtml;
    update("sections", newSections);
    setShowModal(false);
    setGeneratedHtml("");
    setPrompt("");
    toast.success("Content applied successfully!");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4 relative">
      <button
        onClick={() => {
          const newSections = [...activeSections];
          newSections.splice(idx, 1);
          update("sections", newSections);
        }}
        className="absolute right-4 top-4 text-xs font-bold text-red-500 hover:text-red-700"
      >
        Remove
      </button>
      
      <div className="pr-12">
        <label className="mb-1 block text-xs font-bold text-slate-600">Section {idx + 1} Heading</label>
        <input
          type="text"
          value={sec.heading}
          onChange={(e) => {
            const newSections = [...activeSections];
            newSections[idx].heading = e.target.value;
            update("sections", newSections);
          }}
          className="h-10 w-full md:w-2/3 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-600">Section {idx + 1} Content (HTML allowed)</label>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Assistant
          </button>
        </div>
        <textarea
          value={sec.body}
          onChange={(e) => {
            const newSections = [...activeSections];
            newSections[idx].body = e.target.value;
            update("sections", newSections);
          }}
          rows={6}
          className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-slate-900 focus:outline-none"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                <Sparkles className="h-5 w-5 text-indigo-600" /> AI Content Assistant
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2">
                &times;
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="mb-1 block text-sm font-bold text-slate-700">Instructions</label>
                <p className="mb-3 text-xs text-slate-500">Enter plain text instructions. The AI will generate raw HTML based on your prompt.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Write a strict policy about 30-day refunds..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    className="flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Generate"}
                  </button>
                </div>
              </div>

              {generatedHtml && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="mb-2 block text-sm font-bold text-slate-700">Generated Preview (HTML)</label>
                  <textarea
                    readOnly
                    value={generatedHtml}
                    onChange={(e) => setGeneratedHtml(e.target.value)}
                    className="w-full h-48 rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-slate-500">You can safely edit the generated HTML above before applying it.</p>
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
