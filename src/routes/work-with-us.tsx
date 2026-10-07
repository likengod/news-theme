import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteSettingsServer, buildPageHead, defaultSettings, type SiteSettings } from "@/lib/site-content";
import { CareerGamificationSection } from "@/components/work-with-us/CareerGamificationSection";
import { BadgeBenefitsSection } from "@/components/work-with-us/BadgeBenefitsSection";
import { PressRulesAndIdCardSection } from "@/components/work-with-us/PressRulesAndIdCardSection";
import { CareerTiersSection } from "@/components/work-with-us/CareerTiersSection";
import { CareerFaqSection } from "@/components/work-with-us/CareerFaqSection";

export const Route = createFileRoute("/work-with-us")({
  loader: async (): Promise<{ settings: SiteSettings }> => {
    const settings = (await getSiteSettingsServer().catch(() => null)) || defaultSettings;
    return { settings };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    return buildPageHead({
      page: {
        title: s?.workWithUsHeroTitle || "Work With Us",
        metaTitle: s?.workWithUsMetaTitle,
        metaDescription: s?.workWithUsMetaDescription,
        ogImage: s?.workWithUsOgImage,
        metaKeywords: s?.workWithUsKeywords,
        canonicalUrl: s?.workWithUsCanonicalUrl,
        noIndex: s?.workWithUsNoIndex,
      },
      defaultTitle: "Work With Us",
      defaultDescription:
        "Apply as a volunteer journalist and grow into an Intern and Permanent role at News Theme.",
      slug: "/work-with-us",
    });
  },
  component: WorkWithUsPage,
});

function WorkWithUsPage() {
  const { settings } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-7xl px-4 py-10 space-y-16 flex-1 w-full">
        {/* Hero Section */}
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-30"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground"></span>
            </span>
            Newsroom Careers
          </p>
          <h1
            className="headline mt-4 text-5xl md:text-6xl tracking-tight whitespace-pre-wrap"
            style={{ WebkitLineClamp: "unset" as never }}
          >
            {settings.workWithUsHeroTitle || "Write the Truth.\\nShape the Timeline."}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {settings.workWithUsHeroIntro ||
              "News Theme runs a dynamic journalist growth path. Start as a Volunteer, earn points by contributing, and climb the ranks to Intern and Permanent staff."}
          </p>
        </header>

        {/* Gamification Basics */}
        <CareerGamificationSection gamificationText={settings.workWithUsGamification} />

        {/* Badge Benefits & Rules (2 Columns) */}
        <div className="grid gap-8 lg:grid-cols-2">
          <BadgeBenefitsSection badgesText={settings.workWithUsBadges} />
          <PressRulesAndIdCardSection
            idCardReq={settings.workWithUsIdCardReq}
            rulesText={settings.workWithUsRules}
          />
        </div>

        {/* Tier Details */}
        <CareerTiersSection tiersText={settings.workWithUsTiers} />

        {/* FAQ */}
        <CareerFaqSection faqsText={settings.workWithUsFaqs} />

        {/* Bottom Call To Action */}
        <div className="flex justify-center pb-12">
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-105 active:scale-95"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
