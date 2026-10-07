import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User,
  Lock,
  Trash2,
  Crown,
  Building2,
  ChevronRight,
  Phone,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient as supabase } from "@/lib/auth-client";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentUserProfile } from "@/lib/auth.functions";
import { loadRanks, rankForCount, nextRank } from "@/lib/journalist-ranks";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";

// Components
import { AccountOverview } from "@/components/profile/AccountOverview";
import { PasswordSettings } from "@/components/profile/PasswordSettings";
import { PhoneSettings } from "@/components/profile/PhoneSettings";
import { BankSettings } from "@/components/profile/BankSettings";
import { DeleteAccount } from "@/components/profile/DeleteAccount";
import { ROLE_COLOR, ROLE_LABEL } from "@/components/profile/constants";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Profile – News Theme" },
      {
        name: "description",
        content: "Manage your account, password, bank details and subscription on News Theme.",
      },
    ],
  }),
  component: ProfilePage,
});

type Tab = "overview" | "password" | "phone" | "bank" | "delete";

function ProfilePage() {
  const navigate = useNavigate();
  const getProfile = useServerFn(getCurrentUserProfile);

  const siteSettings = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings);

  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  // Ranks (client-side localStorage)
  const [ranks] = useState(() => loadRanks());

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) {
        navigate({ to: "/auth" });
        return;
      }
      setToken(data.session.access_token);
      const uid = data.session.user.id;
      // Load points from localStorage
      const stored = localStorage.getItem(`nt:points:${uid}`);
      setPoints(stored !== null ? Number(stored) : 0);

      try {
        const res = await getProfile({ data: data.session.access_token });
        setProfile(res.profile);
        setRoles(res.roles);
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const isJournalist = roles.some((r) => ["journalist", "author", "editor", "admin"].includes(r));
  const isPremium = roles.includes("premium");
  const articlesPublished = Number(profile?.articles_published ?? 0);
  const currentRank = rankForCount(articlesPublished, ranks);
  const nextRankObj = nextRank(articlesPublished, ranks);
  const progressPct = nextRankObj
    ? Math.min(
        100,
        Math.round(
          ((articlesPublished - (currentRank?.minNews ?? 0)) /
            (nextRankObj.minNews - (currentRank?.minNews ?? 0))) *
            100,
        ),
      )
    : 100;

  const navItems: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: User },
    { key: "password", label: "Change Password", icon: Lock },
    ...(isJournalist
      ? [
          { key: "phone" as Tab, label: "Phone Number", icon: Phone },
          { key: "bank" as Tab, label: "Bank Account", icon: Building2 },
        ]
      : []),
    { key: "delete", label: "Delete Account", icon: Trash2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const name = profile?.display_name ?? "Account";
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p: string) => p[0]?.toUpperCase())
      .join("") || "U";
  const primaryRole = roles[0] ?? "reader";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-3">
            {/* Identity card */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-2xl font-bold text-white shadow">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[160px]">
                    {profile?.email ?? ""}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${ROLE_COLOR[primaryRole] ?? ROLE_COLOR.reader}`}
                >
                  {isPremium && <Crown className="h-3 w-3" />}
                  {ROLE_LABEL[primaryRole] ?? primaryRole}
                </span>

                {/* Wallet */}
                {isEnterprisePlus && (
                  <Link
                    to="/earn-points"
                    className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <span>₹{points}</span>
                    <span className="text-xs font-normal text-emerald-600">Wallet</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                {/* Subscription */}
                {!isPremium && (
                  <Link
                    to="/subscription"
                    className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
                  >
                    <Crown className="h-3 w-3" />
                    Upgrade to Premium
                  </Link>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-medium transition-colors last:border-b-0 ${
                    tab === key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                  } ${key === "delete" && tab !== "delete" ? "text-red-600 hover:bg-red-50" : ""}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                  {tab === key && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main panel */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {tab === "overview" && (
              <AccountOverview
                isPremium={isPremium}
                points={points}
                roles={roles}
                isJournalist={isJournalist}
                currentRank={currentRank}
                articlesPublished={articlesPublished}
                nextRankObj={nextRankObj}
                progressPct={progressPct}
                ranks={ranks}
                profile={profile}
              />
            )}

            {tab === "password" && <PasswordSettings />}

            {tab === "phone" && isJournalist && (
              <PhoneSettings initialPhone={profile?.phone ?? ""} />
            )}

            {tab === "bank" && isJournalist && (
              <BankSettings
                initialBankName={profile?.bank_name ?? ""}
                initialBankAccountName={profile?.bank_account_name ?? ""}
                initialBankAccountNo={profile?.bank_account_no ?? ""}
                initialBankIfsc={profile?.bank_ifsc ?? ""}
              />
            )}

            {tab === "delete" && (
              <DeleteAccount initialDeleteRequested={!!profile?.delete_requested} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
