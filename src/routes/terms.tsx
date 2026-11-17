import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/terms")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return (
      pages.find((p) => p.slug === "terms" || p.slug === "terms-and-conditions") || {
        title: "Terms and Conditions",
        intro: "The terms and conditions governing your use of Today Tripura.",
        sections: [],
      }
    );
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "Terms & Conditions",
      defaultDescription: "The terms governing your use of Today Tripura website, apps and services.",
      slug: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  const page = Route.useLoaderData();

  return (
    <PolicyLayout
      title={page?.title || "Terms and Conditions"}
      intro={page?.intro || "The terms and conditions governing your use of Today Tripura."}
      sections={
        page?.sections && page.sections.length > 0
          ? page.sections.map((s: any) => ({
              heading: s.heading,
              body: <div dangerouslySetInnerHTML={{ __html: s.body }} />,
            }))
          : [
              {
                heading: page?.title || "Terms & Conditions",
                body: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        page?.body ||
                        "<p>Welcome to Today Tripura. By accessing or using our website, services, and mobile applications, you agree to comply with and be bound by these terms and conditions.</p>",
                    }}
                  />
                ),
              },
            ]
      }
    />
  );
}

export default TermsPage;
