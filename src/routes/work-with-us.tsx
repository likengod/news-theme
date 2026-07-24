import { Link, createFileRoute } from "@tanstack/react-router";
import { 
  Newspaper, GraduationCap, BadgeCheck, ArrowRight, TrendingUp, DollarSign, Medal, 
  CheckSquare, Search, Award, ShieldAlert, IdCard, HelpCircle 
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSiteSettingsServer } from "@/lib/site-content";

export const Route = createFileRoute("/work-with-us")({
  loader: async () => {
    const settings = await getSiteSettingsServer();
    return { settings };
  },
  head: () => ({
    meta: [
      { title: "Work With Us — News Theme" },
      { name: "description", content: "Apply as a volunteer journalist and grow into an Intern and Permanent role at News Theme." },
    ],
  }),
  component: WorkWithUsPage,
});

const TIERS = [
  { id: "volunteer", name: "Volunteer Journalist", req: "Entry level", detail: "Contribute stories on your beat. Get bylines, mentorship and editorial feedback.", icon: Newspaper },
  { id: "intern", name: "Intern Journalist", req: "150+ verified news", detail: "Volunteer journalists who cross 150 published news auto-upgrade to a paid Intern role.", icon: GraduationCap },
  { id: "permanent", name: "Permanent Employee", req: "2,000+ verified news", detail: "Interns who publish 2,000 verified news items can apply for a permanent staff position.", icon: BadgeCheck },
];

function WorkWithUsPage() {
  const { settings } = Route.useLoaderData();

  const rulesList = (settings.workWithUsRules || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const gamificationList = (settings.workWithUsGamification || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const gamificationIcons = [TrendingUp, Search, CheckSquare, DollarSign];

  const badgesList = (settings.workWithUsBadges || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
  
  const badgeConfig = [
    { letter: "B", bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-400" },
    { letter: "S", bg: "bg-slate-200", text: "text-slate-700", icon: "text-slate-400" },
    { letter: "G", bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-500" },
    { letter: "D", bg: "bg-cyan-100", text: "text-cyan-700", icon: "text-cyan-500" },
  ];

  const tiersList = (settings.workWithUsTiers || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const tierIcons = [Newspaper, GraduationCap, BadgeCheck];

  const faqsList = (settings.workWithUsFaqs || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />
      
      <main className="mx-auto max-w-7xl px-4 py-10 space-y-16">
        
        {/* Hero Section */}
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-30"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground"></span>
            </span>
            Newsroom Careers
          </p>
          <h1 className="headline mt-4 text-5xl md:text-6xl tracking-tight whitespace-pre-wrap" style={{ WebkitLineClamp: "unset" as never }}>
            {settings.workWithUsHeroTitle || "Write the Truth.\\nShape the Timeline."}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {settings.workWithUsHeroIntro || "News Theme runs a dynamic journalist growth path. Start as a Volunteer, earn points by contributing, and climb the ranks to Intern and Permanent staff."}
          </p>
        </header>

        {/* Gamification Basics */}
        <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <Medal className="h-6 w-6 text-foreground" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Earn Points & Grow Your Rank</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {gamificationList.map((item, idx) => {
              const Icon = gamificationIcons[idx % gamificationIcons.length];
              const colonIdx = item.indexOf(':');
              const title = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item;
              const desc = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : "";
              return (
                <div key={idx} className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md">
                  <Icon className="h-6 w-6 mb-4 text-foreground/70" />
                  <h3 className="font-bold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badge Benefits & Rules (2 Columns) */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Badge Ranks */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl font-bold tracking-tight">Badge Rank Benefits</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              As you accumulate points and publish more verified stories, you will automatically unlock prestigious rank badges and exclusive perks:
            </p>
            <ul className="space-y-6">
              {badgesList.map((badge, idx) => {
                const config = badgeConfig[idx % badgeConfig.length];
                const colonIdx = badge.indexOf(':');
                const title = colonIdx > -1 ? badge.slice(0, colonIdx).trim() : badge;
                const benefits = colonIdx > -1 ? badge.slice(colonIdx + 1).split('|').map(b => b.trim()) : [];
                return (
                  <li key={idx} className="flex items-start gap-4">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} font-bold text-lg`}>
                      {config.letter}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground">{title}</h4>
                      <ul className="mt-2 space-y-1">
                        {benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ArrowRight className={`h-4 w-4 shrink-0 ${config.icon}`} /> {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Rules & ID Cards */}
          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <IdCard className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl font-bold tracking-tight">Official Press ID Cards</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We issue physical and digital Press ID cards to verified members of our newsroom to assist them in on-the-ground reporting.
              </p>
              <div className="mt-4 rounded-lg bg-background border border-border p-4">
                <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                  {settings.workWithUsIdCardReq || (
                    <>
                      <strong>Requirement:</strong> You must reach the <span className="underline decoration-dashed underline-offset-4">Intern Journalist Rank</span> (150+ verified published news articles) to be eligible for an Official Press ID Card.
                    </>
                  )}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl font-bold tracking-tight">Journalist Rules</h2>
              </div>
              <ul className="list-inside list-disc space-y-3 text-sm text-muted-foreground">
                {rulesList.length > 0 ? (
                  rulesList.map((rule, idx) => {
                    // split at the first colon to make the prefix bold
                    const colonIdx = rule.indexOf(':');
                    if (colonIdx > -1) {
                      const prefix = rule.slice(0, colonIdx + 1);
                      const rest = rule.slice(colonIdx + 1);
                      return (
                        <li key={idx}>
                          <strong className="text-foreground">{prefix}</strong>
                          {rest}
                        </li>
                      );
                    }
                    return <li key={idx}>{rule}</li>;
                  })
                ) : (
                  <>
                    <li><strong className="text-foreground">Zero Plagiarism:</strong> All submissions are passed through advanced plagiarism checks. Copied content results in an instant ban.</li>
                    <li><strong className="text-foreground">Verify Sources:</strong> You must provide links or contact details for your primary sources when submitting breaking news.</li>
                    <li><strong className="text-foreground">Unbiased Reporting:</strong> Keep personal opinions strictly to the "Opinion" section. News reports must remain objective.</li>
                    <li><strong className="text-foreground">No Fake News:</strong> Repeatedly submitting factually incorrect information will result in point deductions and rank demotion.</li>
                  </>
                )}
              </ul>
              <div className="mt-6 pt-4 border-t border-border/50">
                <Link to="/terms-and-conditions" className="text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1 w-max">
                  Read full Terms & Conditions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>

        </div>

        {/* Tier Details */}
        <section className="grid gap-6 md:grid-cols-3">
          {tiersList.map((tier, idx) => {
            const Icon = tierIcons[idx % tierIcons.length];
            const colonIdx = tier.indexOf(':');
            const fullTitle = colonIdx > -1 ? tier.slice(0, colonIdx).trim() : tier;
            const desc = colonIdx > -1 ? tier.slice(colonIdx + 1).trim() : "";
            
            // Extract requirement from parenthesis e.g. "Volunteer Journalist (Entry level)"
            const parenMatch = fullTitle.match(/(.*?)\((.*?)\)$/);
            const title = parenMatch ? parenMatch[1].trim() : fullTitle;
            const req = parenMatch ? parenMatch[2].trim() : "";

            return (
              <div key={idx} className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
                <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                {req && <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-background inline-block px-2 py-1 rounded border border-border">{req}</p>}
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">{desc}</p>
              </div>
            );
          })}
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-6 w-6 text-foreground" />
            <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {faqsList.map((faq, idx) => {
              const colonIdx = faq.indexOf('?:');
              const question = colonIdx > -1 ? faq.slice(0, colonIdx + 1).trim() : faq;
              const answer = colonIdx > -1 ? faq.slice(colonIdx + 2).trim() : "";
              
              // Handle alternative colon formats if user misses the space before ?:
              const altColonIdx = faq.indexOf('? :');
              const finalQuestion = altColonIdx > -1 ? faq.slice(0, altColonIdx + 1).trim() : question;
              const finalAnswer = altColonIdx > -1 ? faq.slice(altColonIdx + 3).trim() : answer;

              // Also fallback to just a plain colon if they don't use a question mark
              const plainColonIdx = faq.indexOf(':');
              const q = finalAnswer ? finalQuestion : (plainColonIdx > -1 ? faq.slice(0, plainColonIdx).trim() : faq);
              const a = finalAnswer ? finalAnswer : (plainColonIdx > -1 ? faq.slice(plainColonIdx + 1).trim() : "");

              return (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-foreground">{q}</h4>
                  <p className="text-sm text-muted-foreground">{a}</p>
                </div>
              );
            })}
          </div>
        </section>

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
