import { createFileRoute } from "@tanstack/react-router";
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
      defaultTitle: "Fact-Checking Policy",
      defaultDescription:
        "Our standards for fact-checking, multi-source verification, digital media analysis, and factual accuracy.",
      slug: "/fact-checking-policy",
    }),
  component: FactCheckingPage,
});

function FactCheckingPage() {
  const page = Route.useLoaderData();

  return (
    <PolicyLayout
      title={page?.title || "Fact-Checking Policy"}
      intro={page?.intro || ""}
      sections={
        page?.sections && page.sections.length > 0
          ? page.sections.map((s) => ({
              heading: s.heading,
              body: <div dangerouslySetInnerHTML={{ __html: s.body }} />,
            }))
          : [
              {
                heading: page?.title || "Fact-Checking Policy",
                body: <div dangerouslySetInnerHTML={{ __html: page?.body || "" }} />,
              },
            ]
      }
    />
  );
}
