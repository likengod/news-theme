import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer } from "@/lib/site-content";

export const Route = createFileRoute("/data-deletion-policy")({
  head: () => ({
    meta: [
      { title: "Data Deletion Policy | News Theme" },
      {
        name: "description",
        content: "How to request deletion of your personal data from News Theme systems.",
      },
      { property: "og:url", content: "https://gorillatechsolution.com/data-deletion-policy" },
    ],
    links: [{ rel: "canonical", href: "https://gorillatechsolution.com/data-deletion-policy" }],
  }),
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "data-deletion-policy");
  },
  component: DataDeletionPolicyPage,
});

function DataDeletionPolicyPage() {
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
          : [
              {
                heading: page?.title || "",
                body: <div dangerouslySetInnerHTML={{ __html: page?.body || "" }} />,
              },
            ]
      }
    />
  );
}
