import { useState } from "react";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { getTags } from "@/lib/taxonomy.functions";
import { generateArticleContentServer } from "@/lib/ai.functions";

export interface GeneratedAiContent {
  body?: string;
  excerpt?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

interface AiArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: GeneratedAiContent) => void;
  isEnterprise?: boolean;
}

export default function AiArticleModal({
  isOpen,
  onClose,
  onApply,
  isEnterprise,
}: AiArticleModalProps) {
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiStyle, setAiStyle] = useState("Normal");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiData, setGeneratedAiData] = useState<GeneratedAiContent | null>(null);

  if (!isOpen) return null;

  const handleGenerateAi = async () => {
    if (!aiInstructions.trim()) {
      toast.error("Please enter news instructions.");
      return;
    }
    setIsGeneratingAi(true);
    setGeneratedAiData(null);
    try {
      const tags = await getTags();
      const tagNames = tags.map((t) => t.name);
      const res = await generateArticleContentServer({
        data: {
          instructions: aiInstructions,
          style: isEnterprise ? aiStyle : "Normal",
          availableTags: tagNames,
        },
      });
      setGeneratedAiData(res);
      toast.success("Content generated! Please review.");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI content.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApply = () => {
    if (!generatedAiData) return;
    onApply(generatedAiData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
            <Sparkles className="h-5 w-5 text-indigo-600" /> AI News Assistant
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-2"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">
                  News Info / Instructions
                </label>
                <p className="mb-2 text-xs text-slate-500">
                  Provide the facts. The AI will write the article using the 5 Ws and H rule.
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Writing Style</label>
                  {!isEnterprise && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Lock className="h-2.5 w-2.5" /> Enterprise
                    </span>
                  )}
                </div>
                <select
                  value={isEnterprise ? aiStyle : "Normal"}
                  onChange={(e) => isEnterprise && setAiStyle(e.target.value)}
                  disabled={!isEnterprise}
                  className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors ${
                    !isEnterprise
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed opacity-80"
                      : "bg-white text-slate-800"
                  }`}
                  title={!isEnterprise ? "Enterprise or Enterprise+ license required to customize writing style" : undefined}
                >
                  <option value="Normal">Normal</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Business">Business</option>
                  <option value="Friendly">Friendly</option>
                  <option value="5 ws">5 ws</option>
                </select>
                {!isEnterprise && (
                  <p className="mt-1 text-[11px] text-amber-600">
                    Enterprise or Enterprise+ license required to customize writing styles.
                  </p>
                )}
              </div>
            </div>
            <textarea
              placeholder="e.g. A new tech park opened in Agartala today. The IT minister inaugurated it. It will create 5000 jobs..."
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={handleGenerateAi}
                disabled={isGeneratingAi}
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating Article...
                  </>
                ) : (
                  "Generate Article"
                )}
              </button>
            </div>
          </div>

          {generatedAiData && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3">Generated Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500">Meta Title</label>
                  <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">
                    {generatedAiData.metaTitle}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500">Location</label>
                  <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">
                    {[
                      generatedAiData.location?.city,
                      generatedAiData.location?.state,
                      generatedAiData.location?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500">Excerpt</label>
                <div className="text-sm bg-slate-50 p-2 rounded border border-slate-200">
                  {generatedAiData.excerpt}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500">Tags Selected</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedAiData.tags?.map((t: string) => (
                    <span
                      key={t}
                      className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Body Preview (HTML)
                </label>
                <div className="h-40 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono whitespace-pre-wrap">
                  {generatedAiData.body}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!generatedAiData}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Apply to Article
          </button>
        </div>
      </div>
    </div>
  );
}
