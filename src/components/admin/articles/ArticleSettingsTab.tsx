import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, JournalistPicker } from "@/components/admin/articles/ArticleSubComponents";
import { formatDateTimeLocal, type Row } from "./types";

interface ArticleSettingsTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  currentUserAuthor?: string;
  authorOptions?: { id: string; name: string; username?: string; email?: string; phone?: string; role: string }[];
  isEnterprisePlus?: boolean;
}

export default function ArticleSettingsTab({
  row,
  onChange,
  currentUserAuthor,
  authorOptions,
  isEnterprisePlus,
}: ArticleSettingsTabProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="News Type">
          <select
            id="article-news-type"
            name="newsType"
            aria-label="News Type"
            value={row.newsType}
            onChange={(e) => onChange("newsType", e.target.value as Row["newsType"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Standard</option>
            <option>Breaking</option>
            <option>Featured</option>
            <option>Exclusive</option>
            <option>Opinion</option>
            <option>Video</option>
          </select>
        </Field>

        <Field label="Author *">
          <div className="space-y-1.5">
            <Popover open={authorOpen} onOpenChange={setAuthorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={authorOpen}
                  className="w-full justify-between font-normal text-slate-700 bg-slate-50/80 hover:bg-slate-100 px-2.5 py-1.5 h-auto text-xs"
                >
                  ? Select author / admin profile...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command
                  filter={(value, search) => {
                    const option = authorOptions?.find((a) => a.id === value);
                    if (!option && currentUserAuthor?.toLowerCase() !== value) return 0;
                    
                    const searchTerms = search.toLowerCase().split(" ");
                    const targetString = option 
                      ? `${option.name} ${option.email || ""} ${option.phone || ""} ${option.username || ""} ${option.role}`.toLowerCase()
                      : `${currentUserAuthor} your profile`.toLowerCase();
                      
                    return searchTerms.every(t => targetString.includes(t)) ? 1 : 0;
                  }}
                >
                  <CommandInput placeholder="Search name, email, phone, or role..." />
                  <CommandList>
                    <CommandEmpty>No author found.</CommandEmpty>
                    <CommandGroup heading="Admin & Editorial Users">
                      {currentUserAuthor && (
                        <CommandItem
                          value={currentUserAuthor.toLowerCase()}
                          onSelect={() => {
                            onChange("author", currentUserAuthor);
                            setAuthorOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              row.author === currentUserAuthor ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          ?? {currentUserAuthor} (Your Profile)
                        </CommandItem>
                      )}
                      
                      {authorOptions?.map((a) => (
                        <CommandItem
                          key={a.id}
                          value={a.id}
                          onSelect={() => {
                            onChange("author", a.name);
                            setAuthorOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              row.author === a.name ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-col">
                            <span>{a.name} ({a.role}{a.username ? ` • @${a.username}` : ""})</span>
                            {(a.email || a.phone) && (
                              <span className="text-xs text-slate-500">
                                {a.email} {a.phone ? `• ${a.phone}` : ""}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <input
              id="article-author"
              name="author"
              aria-label="Author"
              autoComplete="off"
              value={row.author}
              placeholder="e.g. Admin User"
              onChange={(e) => onChange("author", e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        </Field>

        <Field label="Status">
          <select
            id="article-status"
            name="status"
            aria-label="Status"
            value={row.status}
            onChange={(e) => onChange("status", e.target.value as Row["status"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Published</option>
            <option>Draft</option>
            <option>Review</option>
          </select>
        </Field>

        <Field label="Access Level">
          <select
            id="article-access-level"
            name="access_level"
            aria-label="Access Level"
            value={row.access_level}
            onChange={(e) => onChange("access_level", e.target.value as Row["access_level"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="Free">Free (All users)</option>
            <option value="Premium">Premium (Admin / Editor / Author only)</option>
          </select>
        </Field>

        <Field label="Publish Date">
          <input
            id="article-publish-date"
            name="date"
            aria-label="Publish Date"
            type="datetime-local"
            value={formatDateTimeLocal(row.date)}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>

        {isEnterprisePlus && (
          <Field label="Post Views">
            <input
              id="article-views"
              name="views"
              aria-label="Post Views"
              type="number"
              min={0}
              value={row.views}
              onChange={(e) => onChange("views", Number(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </Field>
        )}

        <Field label="Featured on homepage">
          <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm">
            <input
              id="article-featured"
              name="featured"
              aria-label="Pin to hero / featured slot"
              type="checkbox"
              checked={row.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
            />
            Pin to hero / featured slot
          </label>
        </Field>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <JournalistPicker
          journalistId={row.journalistId}
          journalistName={row.journalistName}
          onSelect={(j) => {
            onChange("journalistId", j?.publicUserId ?? "");
            onChange("journalistName", j?.displayName ?? "");
            if (j?.displayName) onChange("author", j.displayName);
          }}
        />
      </div>
    </div>
  );
}



