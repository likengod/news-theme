import { CheckCircle2 } from "lucide-react";
import React from "react";

export function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <span className="grid h-7 w-7 place-items-center bg-foreground text-xs font-bold text-background">
          {number}
        </span>
        <h2 className="font-serif text-xl font-black tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  required,
  hint,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        {hint && <span className="text-[11px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-foreground" : "text-muted-foreground"}`}>
      <span
        className={`grid h-4 w-4 place-items-center border ${
          ok ? "border-foreground bg-foreground text-background" : "border-border"
        }`}
      >
        {ok && <CheckCircle2 className="h-3 w-3" />}
      </span>
      {children}
    </li>
  );
}
