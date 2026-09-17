import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/terms-and-conditions")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "terms-and-conditions");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "Terms & Conditions",
      defaultDescription: "The terms governing your use of News Theme's website, apps and services.",
      slug: "/terms-and-conditions",
    }),
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
