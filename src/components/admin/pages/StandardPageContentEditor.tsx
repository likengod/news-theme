import React from "react";
import SectionEditorItem from "./SectionEditorItem";
import type { PageContent } from "@/lib/site-content";

interface StandardPageContentEditorProps {
  active: PageContent;
  activeSlug: string;
  update: <K extends keyof PageContent>(k: K, v: PageContent[K]) => void;
}

export function StandardPageContentEditor({
  active,
  activeSlug,
  update,
}: StandardPageContentEditorProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-600">
          Page Subtitle / Intro
        </label>
        <input
          type="text"
          value={active.intro || ""}
          onChange={(e) => update("intro", e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>

      {activeSlug === "contact" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Note:</strong> The Contact Us page relies on a hardcoded layout with a
          contact form. Only the subtitle/intro above can be updated here.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <label className="block text-sm font-bold text-slate-800">Page Sections</label>
            <button
              onClick={() => {
                const newSections = [
                  ...(active.sections || []),
                  { heading: "New Section", body: "" },
                ];
                update("sections", newSections);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              + Add Section
            </button>
          </div>

          {(active.sections || []).length === 0 && (
            <div className="text-sm text-slate-500 italic">
              No sections added. Click "+ Add Section" to add content.
            </div>
          )}

          {(active.sections || []).map((sec, idx) => (
            <SectionEditorItem
              key={idx}
              sec={sec}
              idx={idx}
              activeSections={active.sections || []}
              update={update}
            />
          ))}
        </div>
      )}
    </div>
  );
}
