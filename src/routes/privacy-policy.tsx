import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — News Theme" },
      { name: "description", content: "How News Theme collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — News Theme" },
      { property: "og:url", content: "https://gorillatechsolution.com/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/privacy-policy" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "privacy-policy");
  },
  component: PrivacyPage,
});

function PrivacyPage() {
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
