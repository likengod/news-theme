import React from "react";
import { Award, ArrowRight } from "lucide-react";

interface BadgeBenefitsSectionProps {
  badgesText?: string;
}

const badgeConfig = [
  { letter: "B", bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-400" },
  { letter: "S", bg: "bg-slate-200", text: "text-slate-700", icon: "text-slate-400" },
  { letter: "G", bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-500" },
  { letter: "D", bg: "bg-cyan-100", text: "text-cyan-700", icon: "text-cyan-500" },
];

export function BadgeBenefitsSection({ badgesText }: BadgeBenefitsSectionProps) {
  const badgesList = (badgesText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (badgesList.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
      <div className="flex items-center gap-3 mb-6">
        <Award className="h-6 w-6 text-foreground" />
        <h2 className="text-2xl font-bold tracking-tight">Badge Rank Benefits</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        As you accumulate points and publish more verified stories, you will automatically unlock
        prestigious rank badges and exclusive perks:
      </p>
      <ul className="space-y-6">
        {badgesList.map((badge, idx) => {
          const config = badgeConfig[idx % badgeConfig.length];
          const colonIdx = badge.indexOf(":");
          const title = colonIdx > -1 ? badge.slice(0, colonIdx).trim() : badge;
          const benefits =
            colonIdx > -1
              ? badge
                  .slice(colonIdx + 1)
                  .split("|")
                  .map((b) => b.trim())
              : [];
          return (
            <li key={idx} className="flex items-start gap-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} font-bold text-lg`}
              >
                {config.letter}
              </span>
              <div>
                <h4 className="font-bold text-foreground">{title}</h4>
                <ul className="mt-2 space-y-1">
                  {benefits.map((benefit, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ArrowRight className={`h-4 w-4 shrink-0 ${config.icon}`} /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
