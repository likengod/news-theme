import { Sparkles, Flame } from "lucide-react";

interface AiPromptSettingsProps {
  aiLanguage: string;
  setAiLanguage: (v: string) => void;
  aiCustomPrompt: string;
  setAiCustomPrompt: (v: string) => void;
  aiPositivity: number;
  setAiPositivity: (v: number) => void;
  aiAllowSlang: boolean;
  setAiAllowSlang: (v: boolean) => void;
}

export function AiPromptSettings({
  aiLanguage,
  setAiLanguage,
  aiCustomPrompt,
  setAiCustomPrompt,
  aiPositivity,
  setAiPositivity,
  aiAllowSlang,
  setAiAllowSlang,
}: AiPromptSettingsProps) {
  return (
    <>
      {/* Language & Dialect Mode */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
          Language &amp; Dialect Mode
        </label>
        <select
          value={aiLanguage}
          onChange={(e) => setAiLanguage(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800"
        >
          <option value="random_mix">
            ✨ Natural Random Mix (Tripura Bengali + Banglish + Indian English) [Recommended]
          </option>
          <option value="Bengali">
            বাংলা - Tripura Spoken Bengali (বাংলা হরফে স্থানীয় কথ্য টান)
          </option>
          <option value="Banglish">
            Banglish - Bengali in Roman English letters (e.g. 'Khub bhalo udyog')
          </option>
          <option value="English">
            Indian English - Local news reader tone (e.g. 'Good step by authorities')
          </option>
          <option value="CodeMixed">
            Code-Mixed - Bangla + English blend ('Ei decision-ta accurate')
          </option>
        </select>
        <p className="mt-1 text-[11px] text-slate-500">
          {aiLanguage === "random_mix"
            ? "Randomly distributes comments: one in Bengali script, one in Banglish, one in Indian English, and one code-mixed for total realism."
            : "Generates comments in this specific linguistic style."}
        </p>
      </div>

      {/* Admin Custom Prompt / Focus Keywords */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Custom AI Focus / Keywords (Optional)
          </label>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
            Topic Guidance
          </span>
        </div>
        <textarea
          rows={2}
          value={aiCustomPrompt}
          onChange={(e) => setAiCustomPrompt(e.target.value)}
          placeholder="e.g. Focus on road conditions and mention AMC; or Praise the Chief Minister's decision; or Question when electricity issue will be resolved"
          className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="text-[11px] text-blue-800">
          Enter any specific words, issues, or viewpoints you want the simulated readers to talk about.
        </p>
      </div>

      {/* Sentiment Ratio */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Sentiment Ratio
          </label>
          <span className="text-xs font-semibold text-slate-600">
            <span className="text-emerald-600 font-bold">{aiPositivity}% Supportive</span> /{" "}
            <span className="text-amber-600 font-bold">{100 - aiPositivity}% Critical / Questioning</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={aiPositivity}
          onChange={(e) => setAiPositivity(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
          <span>0% (All Critical)</span>
          <span>50% (Balanced)</span>
          <span>100% (All Supportive)</span>
        </div>
      </div>

      {/* Authentic Tripura Street Slang & Dialect Toggle */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start justify-between gap-3">
        <div>
          <label
            onClick={() => setAiAllowSlang(!aiAllowSlang)}
            className="text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="h-4 w-4 text-amber-600 shrink-0" />
            Tripura Street Slang &amp; Sharp Dialect (আঞ্চলিক স্ল্যাং ও ক্ষোভপূর্ণ ভাষা)
          </label>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            Allows authentic local expressions in critical comments:{" "}
            <span className="font-medium">
              "বালের রাস্তা", "ফাইজলামি বন্ধ করুক", "কিতা অইতাছে", "আবাইল্লা", "ধুর ছাই", "খচ্চর", "তেঁড়ামি"
            </span>{" "}
            so critical reader reactions sound 100% natural, raw, and realistic.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAiAllowSlang(!aiAllowSlang)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition mt-0.5 ${
            aiAllowSlang ? "bg-amber-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
              aiAllowSlang ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </>
  );
}
