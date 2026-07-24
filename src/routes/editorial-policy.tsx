import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: "Editorial Policy — News Theme" },
      { name: "description", content: "Our standards for sourcing, verification, corrections and editorial independence." },
      { property: "og:url", content: "https://gorillatechsolution.com/editorial-policy" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/editorial-policy" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "editorial-policy");
  },
  component: EditorialPage,
});

function EditorialPage() {
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
