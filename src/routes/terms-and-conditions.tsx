import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — News Theme" },
      { name: "description", content: "The terms governing your use of News Theme's website, apps and services." },
      { property: "og:title", content: "Terms & Conditions — News Theme" },
      { property: "og:url", content: "https://gorillatechsolution.com/terms-and-conditions" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/terms-and-conditions" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "terms-and-conditions");
  },
  component: TermsPage,
});

function TermsPage() {
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
