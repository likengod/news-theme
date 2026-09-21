import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { FactCheckScanner } from "@/components/site/FactCheckScanner";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/fact-checking-policy")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "fact-checking-policy");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "Fact-Checking Policy & Live Claim Scanner",
      defaultDescription:
        "Our standards for fact-checking, multi-source verification, and our automated live news fact-check scanner.",
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
        "Our editorial commitment to accuracy, transparent sourcing, multi-point verification, and combating misinformation. Use our live scanner below to verify any news URL or claim against global fact-checking registries."
      }
      content={<FactCheckScanner />}
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
