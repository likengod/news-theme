import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Crown } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { loadRoles, setCurrentRoleId, getCurrentRoleId, upgradeToPremiumServer } from "@/lib/roles";
import { loadSettings } from "@/lib/site-content";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription — News Theme" },
      { name: "description", content: "Upgrade to Premium for ad-free reading, exclusive stories and early access. Monthly or yearly plans." },
    ],
  }),
  component: SubscriptionPage,
});

const PERKS = [
  "Ad-free reading across the entire site",
  "Exclusive premium stories & long-reads",
  "Early access to breaking news alerts",
  "Downloadable PDF weekly digest",
  "Support independent Northeast journalism",
];

function SubscriptionPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const upgradeFn = useServerFn(upgradeToPremiumServer);
  const [settings, setSettings] = useState(() => {
    // Need to dynamically import or just import loadSettings at top
    return loadSettings();
  });
  
  // Dynamic Location check
  const isIndia = Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Kolkata") || 
                  Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Calcutta");

  const currencySymbol = isIndia ? "₹" : "$";
  
  const price = cycle === "monthly" 
    ? (isIndia ? settings.subscriptionPriceINRMonthly : settings.subscriptionPriceUSDMonthly) || (isIndia ? "149" : "4.99")
    : (isIndia ? settings.subscriptionPriceINRYearly : settings.subscriptionPriceUSDYearly) || (isIndia ? "1499" : "49.99");

  const suffix = cycle === "monthly" ? "/month" : "/year";
  const saving = cycle === "yearly" ? (isIndia ? "Save vs monthly" : "Save vs monthly") : "Cancel anytime";

  const upgrade = async (plan: "monthly" | "yearly") => {
    const roles = loadRoles();
    const premium = roles.find((r) => r.id === "premium");
    if (!premium) return toast.error("Premium role not configured");
    
    const current = getCurrentRoleId();
    if (!["admin", "editor", "journalist", "author", "premium"].includes(current)) {
      setCurrentRoleId("premium"); // Update client side immediately only if they were a reader
    }

    try {
      await upgradeFn({ data: {} as any }); // Update server side
    } catch (e) {
      // Ignore errors (e.g. not logged in) - the client side will still work for guest demo
    }

    toast.success(`Welcome to Premium (${plan})! Your account is upgraded.`);
  };

  const featuresList = settings.subscriptionFeatures 
    ? settings.subscriptionFeatures.split("\n").filter(Boolean)
    : [
        "Ad-free reading across the entire site",
        "Exclusive premium stories & long-reads",
        "Early access to breaking news alerts",
        "Downloadable PDF weekly digest",
        "Support independent Northeast journalism",
      ];

  // Markdown-like bold replacement for intro text
  const introHtml = (settings.subscriptionIntro || "Upgrade to a Premium account for ad-free reading and exclusive stories.").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Membership</p>
          <h1 className="headline mt-2 text-4xl md:text-5xl" style={{ WebkitLineClamp: "unset" as never }}>{settings.subscriptionTitle || "Go Premium"}</h1>
          <p 
            className="mx-auto mt-3 max-w-2xl text-[15px] text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />

          <div className="mx-auto mt-6 inline-flex rounded-full border border-border bg-card/40 p-1">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition ${cycle === c ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        <section className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-card/40 p-8 shadow-sm">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <h2 className="text-xl font-bold">{settings.subscriptionTitle || "Premium"}</h2>
          </div>
          <p className="mt-4 text-5xl font-black tracking-tight">
            {currencySymbol}{price}<span className="text-base font-medium text-muted-foreground">{suffix}</span>
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{saving}</p>

          <ul className="mt-6 space-y-2.5">
            {featuresList.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0" /> {p}
              </li>
            ))}
          </ul>

          {["admin", "editor", "journalist", "author", "premium"].includes(getCurrentRoleId()) ? (
            <div className="mt-8 rounded-md bg-green-900/20 py-4 text-center text-sm font-semibold text-green-400">
              You already have Premium access included with your role.
            </div>
          ) : (
            <>
              <button
                onClick={() => upgrade(cycle)}
                className="mt-8 w-full rounded-md bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90"
              >
                Upgrade to Premium — {currencySymbol}{price}{suffix}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo checkout. Your viewer role switches to Premium user immediately.
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
