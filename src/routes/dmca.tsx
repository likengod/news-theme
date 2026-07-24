import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA — News Theme" },
      { name: "description", content: "How to submit a DMCA copyright takedown notice to News Theme." },
      { property: "og:url", content: "https://gorillatechsolution.com/dmca" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/dmca" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "dmca");
  },
  component: DmcaPage,
});

function DmcaPage() {
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
