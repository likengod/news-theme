import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/dmca")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "dmca");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "DMCA Notice & Policy",
      defaultDescription: "How to submit a DMCA copyright takedown notice to News Theme.",
      slug: "/dmca",
    }),
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
