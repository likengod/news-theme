import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
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
      title={page?.title || "DMCA Notice & Takedown"}
      intro={page?.intro || ""}
      headerAction={
        <Link
          to="/verify-image"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs group"
        >
          <ShieldCheck className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
          <span>Forensic Image</span>
        </Link>
      }
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
