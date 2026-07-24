import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User, Lock, Trash2, Crown, CreditCard, LogOut,
  ChevronRight, Award, Phone, Building2, Eye, EyeOff,
  Check, AlertTriangle, Loader2, Pencil, X, Save,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient as supabase } from "@/lib/auth-client";
import { useServerFn } from "@tanstack/react-start";
import {
  getCurrentUserProfile,
  changeMyPassword,
  updateCurrentUserProfile,
} from "@/lib/auth.functions";
import { submitDeleteAccountRequest } from "@/lib/inbox.functions";
import { loadRanks, rankForCount, nextRank } from "@/lib/journalist-ranks";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Profile – News Theme" },
      { name: "description", content: "Manage your account, password, bank details and subscription on News Theme." },
    ],
  }),
  component: ProfilePage,
});

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  author: "Senior Journalist",
  journalist: "Journalist",
  premium: "Premium Member",
  reader: "Reader",
};

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-red-100 text-red-700 ring-red-200",
  editor: "bg-purple-100 text-purple-700 ring-purple-200",
  author: "bg-sky-100 text-sky-700 ring-sky-200",
  journalist: "bg-blue-100 text-blue-700 ring-blue-200",
  premium: "bg-amber-100 text-amber-700 ring-amber-200",
  reader: "bg-slate-100 text-slate-600 ring-slate-200",
};

const RANK_COLOR: Record<string, string> = {
  bronze: "text-amber-700 bg-amber-50 ring-amber-200",
  silver: "text-slate-600 bg-slate-100 ring-slate-200",
  gold: "text-yellow-700 bg-yellow-50 ring-yellow-200",
  diamond: "text-sky-700 bg-sky-50 ring-sky-200",
};

type Tab = "overview" | "password" | "phone" | "bank" | "delete";

function ProfilePage() {
  const navigate = useNavigate();
  const getProfile = useServerFn(getCurrentUserProfile);
  const doChangePassword = useServerFn(changeMyPassword);
  const doUpdateProfile = useServerFn(updateCurrentUserProfile);
  const doDeleteRequest = useServerFn(submitDeleteAccountRequest);

  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone
  const [phone, setPhone] = useState("");

  // Bank
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteRequested, setDeleteRequested] = useState(false);

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
        setPhone(res.profile.phone ?? "");
        setBankName(res.profile.bank_name ?? "");
        setBankAccountName(res.profile.bank_account_name ?? "");
        setBankAccountNo(res.profile.bank_account_no ?? "");
        setBankIfsc(res.profile.bank_ifsc ?? "");
        setDeleteRequested(!!res.profile.delete_requested);
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const isJournalist = roles.some(r => ["journalist", "author", "editor", "admin"].includes(r));
  const isPremium = roles.includes("premium");
  const articlesPublished = Number(profile?.articles_published ?? 0);
  const currentRank = rankForCount(articlesPublished, ranks);
  const nextRankObj = nextRank(articlesPublished, ranks);
  const progressPct = nextRankObj
    ? Math.min(100, Math.round(((articlesPublished - (currentRank?.minNews ?? 0)) / (nextRankObj.minNews - (currentRank?.minNews ?? 0))) * 100))
    : 100;

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    try {
      await doChangePassword({ data: { password } });
      toast.success("Password changed! Other sessions have been signed out.");
      setPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await doUpdateProfile({ data: { phone } });
      toast.success("Phone number updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update phone");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await doUpdateProfile({ data: { bank_name: bankName, bank_account_name: bankAccountName, bank_account_no: bankAccountNo, bank_ifsc: bankIfsc } });
      toast.success("Bank account details saved!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save bank details");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRequest(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") { toast.error('Type "DELETE" to confirm'); return; }
    setSaving(true);
    try {
      await doDeleteRequest({ data: {} });
      setDeleteRequested(true);
      toast.success("Deletion request submitted. Our team will review it within 48 hours.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit deletion request");
    } finally {
      setSaving(false);
    }
  }

  const navItems: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: User },
    { key: "password", label: "Change Password", icon: Lock },
    ...(isJournalist ? [{ key: "phone" as Tab, label: "Phone Number", icon: Phone }, { key: "bank" as Tab, label: "Bank Account", icon: Building2 }] : []),
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
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p: string) => p[0]?.toUpperCase()).join("") || "U";
  const primaryRole = roles[0] ?? "reader";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your account settings and preferences</p>
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
                  <p className="text-xs text-slate-500 truncate max-w-[160px]">{profile?.email ?? ""}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${ROLE_COLOR[primaryRole] ?? ROLE_COLOR.reader}`}>
                  {isPremium && <Crown className="h-3 w-3" />}
                  {ROLE_LABEL[primaryRole] ?? primaryRole}
                </span>

                {/* Wallet */}
                <Link to="/earn-points" className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors">
                  <span>₹{points}</span>
                  <span className="text-xs font-normal text-emerald-600">Wallet</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                {/* Subscription */}
                {!isPremium && (
                  <Link to="/subscription" className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors">
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
                    tab === key
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-50"
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

            {/* === OVERVIEW === */}
            {tab === "overview" && (
              <div>
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">Account Overview</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Your membership summary and status</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Account type */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Type</span>
                      <div className="mt-2 flex items-center gap-2">
                        {isPremium ? <Crown className="h-5 w-5 text-amber-500" /> : <User className="h-5 w-5 text-slate-400" />}
                        <span className="text-lg font-bold text-slate-900">{isPremium ? "Premium" : "Free"}</span>
                      </div>
                      {!isPremium && (
                        <Link to="/subscription" className="mt-3 inline-flex items-center gap-1 text-xs text-amber-600 hover:underline font-medium">
                          <Crown className="h-3 w-3" /> Upgrade now
                        </Link>
                      )}
                    </div>
                    <div className="rounded-lg border border-slate-100 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Wallet Balance</span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-600">₹{points}</span>
                      </div>
                      <Link to="/withdraw-points" className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium">
                        Withdraw points →
                      </Link>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Roles</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {roles.map(r => (
                        <span key={r} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${ROLE_COLOR[r] ?? ROLE_COLOR.reader}`}>
                          {ROLE_LABEL[r] ?? r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Journalist rank (only if journalist) */}
                  {isJournalist && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">Journalist Rank</span>
                      </div>
                      {currentRank ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${RANK_COLOR[currentRank.id] ?? RANK_COLOR.bronze}`}>
                              {currentRank.name}
                            </span>
                            <span className="text-xs text-slate-500">{articlesPublished} articles published</span>
                          </div>
                          {nextRankObj && (
                            <>
                              <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                                <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${progressPct}%` }} />
                              </div>
                              <p className="mt-1.5 text-xs text-blue-700">
                                {nextRankObj.minNews - articlesPublished} more articles to reach <strong>{nextRankObj.name}</strong>
                              </p>
                            </>
                          )}
                          <p className="mt-2 text-xs text-slate-500">
                            Earning <strong>{currentRank.pointsPerNews} pts</strong> per published article at this rank
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Publish <strong>{ranks[0]?.minNews ?? 100}</strong> articles to earn your first rank badge.
                          <br />
                          <span className="text-xs text-slate-400">{articlesPublished} published so far</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Journalist ID */}
                  {isJournalist && profile?.journalist_id && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Journalist ID</span>
                      <code className="mt-1 block font-mono text-slate-800 text-sm font-semibold tracking-widest">{profile.journalist_id}</code>
                    </div>
                  )}

                  {/* Member since */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member Since</span>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* === CHANGE PASSWORD === */}
            {tab === "password" && (
              <div>
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Your other active sessions will be signed out automatically</p>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-5 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-4 pr-10 text-sm focus:border-slate-900 focus:outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600"><X className="h-3.5 w-3.5" /> Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 8 && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-600"><Check className="h-3.5 w-3.5" /> Passwords match</p>
                  )}
                  <button
                    type="submit"
                    disabled={saving || password.length < 8 || password !== confirmPassword}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Password
                  </button>
                </form>
              </div>
            )}

            {/* === PHONE (journalists only) === */}
            {tab === "phone" && isJournalist && (
              <div>
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">Phone Number</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Used on your press credential card</p>
                </div>
                <form onSubmit={handleSavePhone} className="p-6 space-y-5 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Phone
                  </button>
                </form>
              </div>
            )}

            {/* === BANK ACCOUNT (journalists only) === */}
            {tab === "bank" && isJournalist && (
              <div>
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">Bank Account Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Used to process earnings withdrawals. Only visible to admins.</p>
                </div>
                <form onSubmit={handleSaveBank} className="p-6 space-y-5 max-w-md">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    Your bank details are encrypted and only visible to authorised admins for payout purposes.
                  </div>
                  {[
                    { label: "Bank Name", value: bankName, set: setBankName, placeholder: "e.g. State Bank of India" },
                    { label: "Account Holder Name", value: bankAccountName, set: setBankAccountName, placeholder: "Full name as on bank account" },
                    { label: "Account Number", value: bankAccountNo, set: setBankAccountNo, placeholder: "e.g. 1234567890" },
                    { label: "IFSC Code", value: bankIfsc, set: setBankIfsc, placeholder: "e.g. SBIN0001234" },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => set(e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Bank Details
                  </button>
                </form>
              </div>
            )}

            {/* === DELETE ACCOUNT === */}
            {tab === "delete" && (
              <div>
                <div className="border-b border-red-100 bg-red-50 px-6 py-4">
                  <h2 className="text-base font-bold text-red-900">Delete Account</h2>
                  <p className="text-xs text-red-700 mt-0.5">This submits a deletion request to our team. It cannot be undone.</p>
                </div>
                <div className="p-6">
                  {deleteRequested ? (
                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900">Deletion request submitted</p>
                        <p className="mt-1 text-sm text-amber-800">Our team will review your request and delete your account within 48 hours. If you have any questions, email <a href="mailto:support@northeasttimeline.com" className="underline">support@northeasttimeline.com</a>.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleDeleteRequest} className="max-w-md space-y-5">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
                        <p className="text-sm font-semibold text-red-900">What happens when you delete your account:</p>
                        <ul className="space-y-1 text-sm text-red-800 list-disc pl-4">
                          <li>Your profile and personal data will be permanently removed</li>
                          <li>Your wallet balance will be forfeited</li>
                          <li>Your published articles will be retained under an anonymous byline</li>
                          <li>This action cannot be undone</li>
                        </ul>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Type <strong className="font-mono">DELETE</strong> to confirm
                        </label>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={e => setDeleteConfirm(e.target.value)}
                          placeholder="DELETE"
                          className="w-full rounded-lg border border-red-200 py-2.5 px-4 text-sm focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving || deleteConfirm !== "DELETE"}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Request Account Deletion
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
