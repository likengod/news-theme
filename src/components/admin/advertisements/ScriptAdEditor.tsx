import React from "react";
import { Code, Plus, Info, Save } from "lucide-react";

interface ScriptAdEditorProps {
  slotScript: string;
  setSlotScript: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => void;
  sampleAdSense: string;
}

export function ScriptAdEditor({
  slotScript,
  setSlotScript,
  onSave,
  sampleAdSense,
}: ScriptAdEditorProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Code className="h-4.5 w-4.5 text-purple-600" />
            <span>
              Paste 3rd-Party Script HTML/JS Code (Google AdSense, Bing Ads, Custom Script)
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSlotScript((s) => (s ? s + "\n\n" : "") + sampleAdSense)
              }
              className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700 hover:bg-purple-100 transition"
            >
              <Plus className="h-3 w-3" /> Sample AdSense
            </button>
          </div>
        </div>

        <textarea
          value={slotScript}
          onChange={(e) => setSlotScript(e.target.value)}
          placeholder='<!-- Paste HTML, <script> tags, or iframe codes here -->\n<ins class="adsbygoogle" ...></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
          className="min-h-[250px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition shadow-inner"
          spellCheck="false"
        />

        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
          <p>
            <strong>Important:</strong> 3rd party scripts are executed exactly as provided.
            Ensure you only paste code from trusted ad networks like Google AdSense. In script
            mode, custom banner slides for this slot are ignored.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98"
        >
          <Save className="h-4 w-4 text-emerald-400" /> Save
        </button>
      </div>
    </div>
  );
}
