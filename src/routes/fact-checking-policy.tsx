import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Search } from "lucide-react";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/fact-checking-policy")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "fact-checking-policy");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "Fact-Checking Policy — News Theme",
      defaultDescription:
        "Our editorial standards for fact-checking, multi-source verification, digital media analysis, and factual accuracy.",
      slug: "/fact-checking-policy",
    }),
  component: FactCheckingPage,
});

function FactCheckingPage() {
  const page = Route.useLoaderData();

  return (
    <PolicyLayout
      title={page?.title || "Fact-Checking Policy"}
      intro={
        page?.intro ||
        "Our editorial commitment to accuracy, transparent sourcing, multi-point verification, and combating misinformation across all reporting."
      }
      headerAction={
        <Link
          to="/fact-check"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs group"
        >
          <Search className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
          <span>Live Fact-Check Scanner →</span>
        </Link>
      }
      notice={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Want to verify a suspicious news article, WhatsApp forward, or viral claim right now?
          </span>
          <Link
            to="/fact-check"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-2 hover:opacity-80"
          >
            <span>Open Fact-Check Scanner</span>
            <span>→</span>
          </Link>
        </div>
      }
      sections={
        page?.sections && page.sections.length > 0
          ? page.sections.map((s) => ({
              heading: s.heading,
              body: <div dangerouslySetInnerHTML={{ __html: s.body }} />,
            }))
          : [
              {
                heading: page?.title || "Fact-Checking Standards",
                body: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        page?.body ||
                        "<p>We adhere to strict non-partisanship, transparent sourcing, verifiable evidence, and transparent corrections. Every claim published is corroborated with primary documents and official records.</p>",
                    }}
                  />
                ),
              },
            ]
      }
    />
  );
}
