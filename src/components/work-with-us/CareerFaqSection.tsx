import React from "react";
import { HelpCircle } from "lucide-react";

interface CareerFaqSectionProps {
  faqsText?: string;
}

export function CareerFaqSection({ faqsText }: CareerFaqSectionProps) {
  const faqsList = (faqsText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (faqsList.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="h-6 w-6 text-foreground" />
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {faqsList.map((faq, idx) => {
          const colonIdx = faq.indexOf("?:");
          const question = colonIdx > -1 ? faq.slice(0, colonIdx + 1).trim() : faq;
          const answer = colonIdx > -1 ? faq.slice(colonIdx + 2).trim() : "";

          const altColonIdx = faq.indexOf("? :");
          const finalQuestion =
            altColonIdx > -1 ? faq.slice(0, altColonIdx + 1).trim() : question;
          const finalAnswer = altColonIdx > -1 ? faq.slice(altColonIdx + 3).trim() : answer;

          const plainColonIdx = faq.indexOf(":");
          const q = finalAnswer
            ? finalQuestion
            : plainColonIdx > -1
              ? faq.slice(0, plainColonIdx).trim()
              : faq;
          const a = finalAnswer
            ? finalAnswer
            : plainColonIdx > -1
              ? faq.slice(plainColonIdx + 1).trim()
              : "";

          return (
            <div key={idx} className="space-y-2">
              <h4 className="font-bold text-foreground">{q}</h4>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
