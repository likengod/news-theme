import React from "react";
import { Link } from "@tanstack/react-router";
import { IdCard, ShieldAlert, ArrowRight } from "lucide-react";

interface PressRulesAndIdCardSectionProps {
  idCardReq?: string;
  rulesText?: string;
}

export function PressRulesAndIdCardSection({
  idCardReq,
  rulesText,
}: PressRulesAndIdCardSectionProps) {
  const rulesList = (rulesText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Press ID Cards */}
      <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <IdCard className="h-6 w-6 text-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Official Press ID Cards</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We issue physical and digital Press ID cards to verified members of our newsroom to assist
          them in on-the-ground reporting.
        </p>
        <div className="mt-4 rounded-lg bg-background border border-border p-4">
          <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
            {idCardReq || (
              <>
                <strong>Requirement:</strong> You must reach the{" "}
                <span className="underline decoration-dashed underline-offset-4">
                  Intern Journalist Rank
                </span>{" "}
                (150+ verified published news articles) to be eligible for an Official Press ID
                Card.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Journalist Rules */}
      <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="h-6 w-6 text-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Journalist Rules</h2>
        </div>
        <ul className="list-inside list-disc space-y-3 text-sm text-muted-foreground">
          {rulesList.length > 0 ? (
            rulesList.map((rule, idx) => {
              const colonIdx = rule.indexOf(":");
              if (colonIdx > -1) {
                const prefix = rule.slice(0, colonIdx + 1);
                const rest = rule.slice(colonIdx + 1);
                return (
                  <li key={idx}>
                    <strong className="text-foreground">{prefix}</strong>
                    {rest}
                  </li>
                );
              }
              return <li key={idx}>{rule}</li>;
            })
          ) : (
            <>
              <li>
                <strong className="text-foreground">Zero Plagiarism:</strong> All submissions are
                passed through advanced plagiarism checks. Copied content results in an instant
                ban.
              </li>
              <li>
                <strong className="text-foreground">Verify Sources:</strong> You must provide links
                or contact details for your primary sources when submitting breaking news.
              </li>
              <li>
                <strong className="text-foreground">Unbiased Reporting:</strong> Keep personal
                opinions strictly to the "Opinion" section. News reports must remain objective.
              </li>
              <li>
                <strong className="text-foreground">No Fake News:</strong> Repeatedly submitting
                factually incorrect information will result in point deductions and rank demotion.
              </li>
            </>
          )}
        </ul>
        <div className="mt-6 pt-4 border-t border-border/50">
          <Link
            to="/terms-and-conditions"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1 w-max"
          >
            Read full Terms &amp; Conditions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
