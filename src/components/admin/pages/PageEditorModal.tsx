import { useState } from "react";
import { X, Save } from "lucide-react";
import type { PageContent } from "@/lib/site-content";

type Props = {
  page: PageContent;
  onClose: () => void;
  onSave: (page: PageContent) => void;
};

export function PageEditorModal({ page, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<PageContent>(page);

  const submit = () => {
    if (!draft.title.trim()) return alert("Page title is required");
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Edit System Page — {page.title}</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Page Title *</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Intro / Subtitle</label>
            <input
              type="text"
              value={draft.intro}
              onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Page Body Content (HTML or Markdown)</label>
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={10}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save className="h-4 w-4" /> Save Page to MySQL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
