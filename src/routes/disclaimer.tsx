import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — News Theme" },
      { name: "description", content: "Editorial, financial and general disclaimers for content published by News Theme." },
      { property: "og:url", content: "https://gorillatechsolution.com/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/disclaimer" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "disclaimer");
  },
  component: DisclaimerPage,
});

function DisclaimerPage() {
  const page = Route.useLoaderData();
  
  return (
    <PolicyLayout
      title={page?.title || ""}
      intro={page?.intro || ""}
      sections={
        page?.sections && page.sections.length > 0
          ? page.sections.map((s) => ({
              heading: s.heading,
              body: <div dangerouslySetInnerHTML={{ __html: s.body }} />,
            }))
          : [{ heading: page?.title || "", body: <div dangerouslySetInnerHTML={{ __html: page?.body || "" }} /> }]
      }
    />
  );
}
