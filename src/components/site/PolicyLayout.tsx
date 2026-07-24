import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ShieldCheck, ChevronDown, FileText, MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export type PolicySection = {
  heading: string;
  body: ReactNode;
};

type Props = {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  notice?: ReactNode;
  sections: PolicySection[];
  lastUpdated?: string;
  contactEmail?: string;
};

const POLICIES = [
  { label: "Terms & Conditions", to: "/terms-and-conditions" as const },
  { label: "Privacy Policy", to: "/privacy-policy" as const },
  { label: "Cookie Policy", to: "/cookie-policy" as const },
  { label: "Refund Policy", to: "/refund-policy" as const },
  { label: "Disclaimer", to: "/disclaimer" as const },
  { label: "Editorial Policy", to: "/editorial-policy" as const },
  { label: "DMCA", to: "/dmca" as const },
  { label: "About", to: "/about" as const },
  { label: "Submit News", to: "/submit-news" as const },
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function PolicyLayout({
  eyebrow = "Policy",
  title,
  intro,
  notice,
  sections,
  lastUpdated = "January 10, 2026",
  contactEmail = "legal@northeasttimeline.com",
}: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = POLICIES.find((p) => p.to === pathname);
  const others = POLICIES.filter((p) => p.to !== pathname);
  const [othersOpen, setOthersOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* ───────── Left: Policy Centre ───────── */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="headline mb-5 text-3xl" style={{ WebkitLineClamp: "unset" as never }}>
              Policy Centre
            </h2>

            {/* Active policy card with anchors */}
            <div className="overflow-hidden rounded-xl border border-border bg-foreground text-background shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-background/10">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="flex-1 text-[15px] font-semibold">{active?.label ?? title}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </div>
            </div>
            <ul className="mt-1 space-y-0.5 rounded-xl bg-card/40 p-2">
              {sections.map((s) => (
                <li key={s.heading}>
                  <a
                    href={`#${slug(s.heading)}`}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>

            {/* Other policies (collapsible) */}
            <button
              type="button"
              onClick={() => setOthersOpen((o) => !o)}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 text-left transition hover:bg-card"
              aria-expanded={othersOpen}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
                <FileText className="h-4 w-4" />
              </span>
              <span className="flex-1 text-[15px] font-semibold">Other Policies</span>
              <ChevronDown className={`h-4 w-4 transition ${othersOpen ? "rotate-180" : ""}`} />
            </button>
            {othersOpen && (
              <ul className="mt-1 space-y-0.5 rounded-xl bg-card/40 p-2">
                {others.map((p) => (
                  <li key={p.to}>
                    <Link
                      to={p.to}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Connect Us */}
            <button
              type="button"
              onClick={() => setConnectOpen((o) => !o)}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 text-left transition hover:bg-card"
              aria-expanded={connectOpen}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="flex-1 text-[15px] font-semibold">Connect Us</span>
              <ChevronDown className={`h-4 w-4 transition ${connectOpen ? "rotate-180" : ""}`} />
            </button>
            {connectOpen && (
              <div className="mt-1 space-y-2 rounded-xl bg-card/40 p-3 text-sm">
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {contactEmail}
                </a>
                <a href="tel:+911234567890" className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" /> +91 12345 67890
                </a>
                <p className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-foreground/80">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" /> Guwahati, Assam, India
                </p>
                <Link to="/contact" className="block rounded-lg px-2 py-1.5 font-semibold underline">
                  Visit Contact Page →
                </Link>
              </div>
            )}
          </aside>

          {/* ───────── Right: Document Card ───────── */}
          <article className="rounded-2xl border border-border bg-card/30 p-6 shadow-sm md:p-10">
            <header>
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <h1 className="headline text-3xl md:text-4xl" style={{ WebkitLineClamp: "unset" as never }}>
                  {title}
                </h1>
              </div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow === "Policy" ? "Narrative Sync" : eyebrow} · {lastUpdated}
              </p>
              {intro && (
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{intro}</p>
              )}
              <div className="mt-6 h-px w-full bg-border" />
            </header>

            {notice && (
              <aside className="mt-8 rounded-xl border border-border bg-muted/40 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                  Important Notice
                </p>
                <div className="mt-2 text-sm leading-relaxed text-foreground/90">{notice}</div>
              </aside>
            )}

            <div className="mt-10 space-y-10">
              {sections.map((s) => (
                <section key={s.heading} id={slug(s.heading)} className="scroll-mt-24">
                  <h2 className="headline text-2xl md:text-[28px]" style={{ WebkitLineClamp: "unset" as never }}>
                    {s.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/90">
                    {s.body}
                  </div>
                </section>
              ))}

              <section id="contact" className="scroll-mt-24 border-t border-border pt-8">
                <h2 className="headline text-2xl md:text-[28px]" style={{ WebkitLineClamp: "unset" as never }}>
                  Contact Us
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed">
                  Questions about this policy? Email{" "}
                  <a href={`mailto:${contactEmail}`} className="font-semibold underline">
                    {contactEmail}
                  </a>{" "}
                  or use our{" "}
                  <Link to="/contact" className="font-semibold underline">
                    contact page
                  </Link>
                  .
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
