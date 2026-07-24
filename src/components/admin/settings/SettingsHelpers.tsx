import React, { useState } from "react";
import { ExternalLink, Eye, EyeOff, Edit2, CheckCircle2, XCircle, Save, X } from "lucide-react";
import { type SiteSettings } from "@/lib/site-content";
import { type MediaUsage } from "@/lib/media-library";
import { MediaField } from "@/components/admin/MediaField";

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export type FieldDef = {
  key: keyof SiteSettings;
  label: string;
  hint?: string;
  textarea?: boolean;
  placeholder?: string;
  guideUrl?: string;
  toggleKey?: keyof SiteSettings;
  toggleLabel?: string;
};

export function Field({
  f,
  s,
  update,
}: {
  f: FieldDef;
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}) {
  const value = s[f.key] as string;
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-700">{f.label}</label>
      {f.textarea ? (
        <textarea
          value={value || ""}
          placeholder={f.placeholder}
          onChange={(e) => update(f.key, e.target.value as never)}
          rows={4}
          className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
        />
      ) : (
        <input
          value={value || ""}
          placeholder={f.placeholder}
          onChange={(e) => update(f.key, e.target.value as never)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      )}
      {f.hint && <p className="mt-1 text-[11px] text-slate-500">{f.hint}</p>}
    </div>
  );
}

export function IntegrationField({
  f,
  s,
  update,
}: {
  f: FieldDef;
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showValue, setShowValue] = useState(false);
  
  const savedValue = s[f.key] as string;
  const isConfigured = !!savedValue && savedValue.trim().length > 0 && savedValue !== "#";
  
  const [localValue, setLocalValue] = useState(savedValue === "#" ? "" : (savedValue || ""));

  const handleSave = () => {
    update(f.key, localValue as never);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(savedValue || "");
    setIsEditing(false);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[13px] font-medium text-slate-800">{f.label}</p>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                <XCircle className="h-3 w-3" /> Not Configured
              </span>
            )}
            
            {f.guideUrl && (
              <>
                <span className="text-slate-300">•</span>
                <a href={f.guideUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline">
                  Setup Guide <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              <Edit2 className="h-3 w-3" />
              {isConfigured ? "Update" : "Setup"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-2.5 border-t border-slate-100 pt-2.5">
          {f.hint && <p className="mb-2 text-[11px] text-slate-500">{f.hint}</p>}
          <div className="flex items-start gap-2">
            <div className="relative flex-1">
              {f.textarea ? (
                <textarea
                  value={localValue}
                  placeholder={f.placeholder}
                  onChange={(e) => setLocalValue(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
              ) : (
                <div className="relative">
                  <input
                    type={showValue ? "text" : "password"}
                    value={localValue}
                    placeholder={f.placeholder}
                    onChange={(e) => setLocalValue(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-xs focus:border-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowValue(!showValue)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showValue ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCancel}
                className="flex h-[30px] items-center justify-center rounded-md bg-slate-100 px-2.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex h-[30px] items-center justify-center rounded-md bg-slate-900 px-3 text-[11px] font-medium text-white hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
          {f.toggleKey && (
            <div className="mt-3 mb-1 border-t border-slate-100 pt-3">
              <Toggle
                label={f.toggleLabel || `Enable ${f.label}`}
                checked={!!s[f.toggleKey]}
                onChange={(v) => update(f.toggleKey!, v as never)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-2">
      <div>
        <p className="text-[13px] font-medium text-slate-800">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition ${
          checked ? "bg-slate-900" : "bg-slate-300"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function GuideList({ items }: { items: { label: string; url: string }[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((i) => (
        <li key={i.url}>
          <A href={i.url}>
            {i.label} <ExternalLink className="ml-1 inline h-3 w-3" />
          </A>
        </li>
      ))}
    </ul>
  );
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
    >
      {children}
    </a>
  );
}

export function LogoUploader({
  label,
  value,
  onChange,
  usage,
  dark,
  hint,
  recommendedSize,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  usage: any; // Using any for MediaUsage to avoid import issues if it's not exported
  dark?: boolean;
  hint?: string;
  recommendedSize?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-md border border-slate-200 p-2">
      <MediaField
        label={label}
        value={value}
        onChange={onChange}
        usage={usage}
        dark={dark}
        hint={hint}
        recommendedSize={recommendedSize}
        compact={compact}
      />
    </div>
  );
}
