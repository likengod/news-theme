import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";
import { getCustomPagesServer, buildPageHead } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const pages = await getCustomPagesServer().catch(() => []);
    return pages.find((p) => p.slug === "about");
  },
  head: ({ loaderData: page }) =>
    buildPageHead({
      page,
      defaultTitle: "About",
      defaultDescription:
        "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
      slug: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  const page = Route.useLoaderData();
  const rawTitle = page?.title || "About Us";
  const displayTitle =
    rawTitle.trim() === "About News Theme" || !rawTitle.trim() ? "About Us" : rawTitle;

  // Filter out any redundant "About Us" / "About" section headings or empty sections
  const validSections = (page?.sections || [])
    .filter(
      (s) =>
        s.heading &&
        s.heading.trim().toLowerCase() !== "about us" &&
        s.heading.trim().toLowerCase() !== "about news theme" &&
        s.heading.trim().toLowerCase() !== "about" &&
        (s.body || "").replace(/<[^>]*>/g, "").trim().length > 0,
    )
    .map((s) => ({
      heading: s.heading,
      body: <div dangerouslySetInnerHTML={{ __html: s.body }} />,
    }));

  const hasBody = Boolean((page?.body || "").replace(/<[^>]*>/g, "").trim());

  return (
    <PolicyLayout
      eyebrow=""
      lastUpdated=""
      hideDivider={true}
      dropCapIntro={true}
      title={displayTitle}
      intro={page?.intro || ""}
      content={
        hasBody ? (
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page?.body || "" }}
          />
        ) : null
      }
      sections={validSections}
    />
  );
}
