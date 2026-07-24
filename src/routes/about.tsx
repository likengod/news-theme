import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — News Theme" },
      { name: "description", content: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond." },
      { property: "og:url", content: "https://gorillatechsolution.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/about" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "about");
  },
  component: AboutPage,
});

function AboutPage() {
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
