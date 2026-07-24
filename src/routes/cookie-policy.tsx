import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — News Theme" },
      { name: "description", content: "How News Theme uses cookies and similar technologies, and how to manage them." },
      { property: "og:url", content: "https://gorillatechsolution.com/cookie-policy" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/cookie-policy" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "cookie-policy");
  },
  component: CookiePage,
});

function CookiePage() {
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
