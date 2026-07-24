import { useState } from "react";
import { X, Save } from "lucide-react";
import type { JournalistRank } from "@/lib/journalist-ranks";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export function SaveBar({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <button onClick={onCancel} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
      <button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"><Save className="h-4 w-4" /> Save</button>
    </div>
  );
}

export const inputCls = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none";

type RankSelectProps = {
  value: string;
  onChange: (val: string) => void;
  ranks: JournalistRank[];
};

export function RankSelect({ value, onChange, ranks }: RankSelectProps) {
  return (
    <Field label="Rank (who can earn this)">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="all">All Ranks</option>
        {ranks.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
      </select>
    </Field>
  );
}
