import React from "react";
import { Newspaper, GraduationCap, BadgeCheck } from "lucide-react";

interface CareerTiersSectionProps {
  tiersText?: string;
}

const tierIcons = [Newspaper, GraduationCap, BadgeCheck];

export function CareerTiersSection({ tiersText }: CareerTiersSectionProps) {
  const tiersList = (tiersText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (tiersList.length === 0) return null;

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {tiersList.map((tier, idx) => {
        const Icon = tierIcons[idx % tierIcons.length];
        const colonIdx = tier.indexOf(":");
        const fullTitle = colonIdx > -1 ? tier.slice(0, colonIdx).trim() : tier;
        const desc = colonIdx > -1 ? tier.slice(colonIdx + 1).trim() : "";

        // Extract requirement from parenthesis e.g. "Volunteer Journalist (Entry level)"
        const parenMatch = fullTitle.match(/(.*?)\((.*?)\)$/);
        const title = parenMatch ? parenMatch[1].trim() : fullTitle;
        const req = parenMatch ? parenMatch[2].trim() : "";

        return (
          <div key={idx} className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
            <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-6 text-xl font-bold">{title}</h3>
            {req && (
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-background inline-block px-2 py-1 rounded border border-border">
                {req}
              </p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{desc}</p>
          </div>
        );
      })}
    </section>
  );
}
