import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/privacy-policy")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "privacy-policy");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "Privacy Policy",
      defaultDescription: "How News Theme collects, uses and protects your personal information.",
      slug: "/privacy-policy",
    }),
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
