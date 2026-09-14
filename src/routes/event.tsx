import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Trophy,
  Award,
  Send,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Flame,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { getSiteSettingsServer } from "@/lib/site-content";
import { authClient } from "@/lib/auth-client";
import { submitEventRegistration } from "@/lib/inbox.functions";

export const Route = createFileRoute("/event")({
  loader: async () => {
    const settings = await getSiteSettingsServer();
    return { settings };
  },
  head: () => ({
    meta: [
      { title: "শারদ সম্মান ২০২৬ — বিশেষ দুর্গোৎসব প্রতিযোগিতা | News Theme" },
      {
        name: "description",
        content:
          "শারদ সম্মান ২০২৬ দুর্গোৎসব প্রতিযোগিতা। সেরা মণ্ডপসজ্জা, সেরা প্রতিমা ও সেরা আলোকসজ্জার সম্মাননা। আজই আপনার ক্লাবের নাম নিবন্ধন করুন।",
      },
      { property: "og:title", content: "শারদ সম্মান ২০২৬ — বিশেষ দুর্গোৎসব প্রতিযোগিতা" },
      {
        property: "og:description",
        content: "সেরা দুর্গোৎসব মূল্যায়ন ও শারদ সম্মাননা প্রতিযোগিতা। আজই নিবন্ধন করুন।",
      },
    ],
  }),
  component: EventPage,
});

function EventPage() {
  const s = useSiteSettings();

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customField, setCustomField] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    authClient.auth
      .getSession()
      .then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          setUserId(u.id);
          setUserEmail(u.email ?? null);
          const dName =
            u.user_metadata?.display_name ||
            u.user_metadata?.full_name ||
            u.email?.split("@")[0] ||
            "User";
          setUserDisplayName(dName);
          setName(dName);
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const eventTitle = s.eventTitle || "শারদ সম্মান ২০২৬";
  const eventSubtitle = s.eventSubtitle || "সেরা দুর্গোৎসব মূল্যায়ন ও শারদ সম্মাননা প্রতিযোগিতা";
  const eventDesc =
    s.eventDescription ||
    "আসন্ন শারদোৎসবে ত্রিপুরার ঐতিহ্যবাহী ও সর্বজনীন দুর্গাপূজা কমিটি এবং ক্লাবগুলোর জন্য বিশেষ শারদ সম্মান প্রতিযোগিতা। শ্রেষ্ঠ মণ্ডপসজ্জা, প্রতিমা নির্মাণ, আলোকসজ্জা ও পরিবেশবান্ধব ভাবনার ওপর ভিত্তি করে প্রদান করা হবে বিশেষ পুরস্কার ও স্মারক সম্মাননা।";
  const eventDate = s.eventDate || "শারদীয়া দুর্গাপূজা ২০২৬ (মহা পঞ্চমী থেকে বিজয়া দশমী)";
  const eventLocation = s.eventLocation || "ত্রিপুরা ও সংলগ্ন অঞ্চল";
  const customLabel = s.eventCustomInputLabel || "ক্লাবের নাম / Club Name";
  const buttonText = s.eventButtonText || "নিবন্ধন করুন";
  const isButtonEnabled = s.eventButtonEnabled !== false;
  const isFormEnabled = s.eventFormEnabled !== false;

  const rawPrizes =
    s.eventPrizes ||
    "১ম স্থান: ৫০,০০০ টাকা ও বিশেষ শারদ স্মারক\n২য় স্থান: ৩০,০০০ টাকা ও রৌপ্য স্মারক\n৩য় স্থান: ২০,০০০ টাকা ও সম্মাননা পত্র\nবিশেষ বিভাগ: সেরা আলোকসজ্জা, সেরা প্রতিমা ও সেরা শৃঙ্খলা পুরস্কার";

  const prizeList = rawPrizes
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("ইভেন্টে যোগ দিতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    try {
      setSubmitting(true);
      await submitEventRegistration({
        data: {
          name: name.trim(),
          email: userEmail || "",
          phone: phone.trim(),
          address: address.trim(),
          customField: customField.trim(),
          customFieldLabel: customLabel,
          eventName: eventTitle,
        },
      });
      setSubmitted(true);
      toast.success("আপনার নিবন্ধন সফলভাবে জমা হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "নিবন্ধন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#141414] dark:bg-[#0c0c0e] dark:text-[#ededed]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* ─── Festive Durga Puja Hero Section ─── */}
        <section className="relative overflow-hidden rounded-2xl border-2 border-[#E5A93C]/40 bg-gradient-to-b from-[#FFF5E6] via-[#FFF9F0] to-[#FFFDF9] p-6 text-center shadow-lg dark:from-[#241708] dark:via-[#1a1208] dark:to-[#0c0c0e] dark:border-[#92400e]/50 md:p-12">
          {/* Festive corner decorations */}
          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-600/10" />
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-red-500/20 blur-2xl dark:bg-red-700/10" />

          {/* Festive Top Badges */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 dark:border-amber-500/30 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>শুভ শারদীয়া দুর্গোৎসব প্রতিযোগিতা</span>
          </div>

          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-[#991b1b] dark:text-[#f87171] sm:text-4xl md:text-5xl">
            {eventTitle}
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-amber-900/90 dark:text-amber-200/90 sm:text-base">
            {eventSubtitle}
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#44403c] dark:text-[#d6d3d1]">
            {eventDesc}
          </p>

          {/* Key Event Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#78350f] dark:text-[#fde68a]">
            <div className="flex items-center gap-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/50 px-3 py-1.5 border border-amber-300/60 dark:border-amber-800/60">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-red-100/70 dark:bg-red-950/50 px-3 py-1.5 border border-red-300/60 dark:border-red-800/60">
              <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span>{eventLocation}</span>
            </div>
          </div>

          {/* Quick CTA to Form if button enabled */}
          {isButtonEnabled && isFormEnabled && (
            <div className="mt-6">
              <a
                href="#register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b91c1c] to-[#c2410c] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:from-[#991b1b] hover:to-[#9a3412] hover:shadow-lg transition-all"
              >
                <Flame className="h-4 w-4" />
                <span>{buttonText}</span>
              </a>
            </div>
          )}
        </section>

        {/* ─── Highlights & Award Categories Grid ─── */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {/* Card 1: Prizes */}
          <div className="rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#991b1b] dark:text-[#f87171] mb-2 font-bold text-sm">
              <Trophy className="h-4 w-4" />
              <span>পুরস্কার ও সম্মাননা</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#57534e] dark:text-[#a8a29e]">
              {prizeList.map((prize, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{prize}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Evaluation Criteria */}
          <div className="rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2 font-bold text-sm">
              <Award className="h-4 w-4" />
              <span>মূল্যায়নের মূল ভিত্তি</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#57534e] dark:text-[#a8a29e]">
              <li className="flex items-start gap-1.5 leading-snug">
                <span className="text-amber-500 font-bold">•</span>
                <span>ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা</span>
              </li>
              <li className="flex items-start gap-1.5 leading-snug">
                <span className="text-amber-500 font-bold">•</span>
                <span>স্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব</span>
              </li>
              <li className="flex items-start gap-1.5 leading-snug">
                <span className="text-amber-500 font-bold">•</span>
                <span>পরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা</span>
              </li>
              <li className="flex items-start gap-1.5 leading-snug">
                <span className="text-amber-500 font-bold">•</span>
                <span>শৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Club Participation */}
          <div className="rounded-xl border border-amber-200/80 bg-white dark:bg-[#141417] dark:border-zinc-800 p-5 shadow-xs sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2 font-bold text-sm">
              <Users className="h-4 w-4" />
              <span>অংশগ্রহণকারী নির্দেশিকা</span>
            </div>
            <p className="text-xs text-[#57534e] dark:text-[#a8a29e] leading-relaxed">
              ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায়
              অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>অংশগ্রহণ সম্পূর্ণ বিনামূল্যে</span>
            </div>
          </div>
        </section>

        {/* ─── Event Registration Form Section ─── */}
        <section id="register" className="mt-10 scroll-mt-10">
          <div className="overflow-hidden rounded-2xl border border-amber-300/80 bg-white dark:bg-[#141417] dark:border-zinc-800 shadow-md">
            {/* Header of Form */}
            <div className="bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold sm:text-lg flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-300" />
                    <span>ইভেন্ট নিবন্ধন ফরম (Event Registration)</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-amber-100">
                    শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য জমা দিন
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {!isFormEnabled ? (
                /* When form is disabled by admin */
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                    অনলাইন নিবন্ধন আপাতত বন্ধ রয়েছে
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    শারদ সম্মান প্রতিযোগিতার নিবন্ধন সাময়িকভাবে স্থগিত বা সম্পন্ন হয়েছে।
                  </p>
                </div>
              ) : submitted ? (
                /* Success Message */
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                    ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    আপনার ক্লাবের নাম ও আবেদনপত্র অ্যাডমিন ইনবক্সে জমা হয়েছে। আমাদের শারদ সম্মান টিম
                    শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setPhone("");
                      setAddress("");
                      setCustomField("");
                    }}
                    className="mt-4 rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    আরেকটি নিবন্ধন করুন
                  </button>
                </div>
              ) : !userId ? (
                /* When user is NOT logged in */
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                    নিবন্ধন করতে লগইন করা আবশ্যক
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
                    শুধুমাত্র নিবন্ধিত ও লগইন করা ব্যবহারকারীগণ শারদ সম্মানে নিজেদের ক্লাবের নাম
                    অন্তর্ভুক্ত করতে পারবেন।
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/auth"
                      search={{ redirect: "/event" }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-5 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition-opacity"
                    >
                      <span>লগইন / সাইন আপ করুন</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Authenticated User Registration Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Logged in badge */}
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-200">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        লগইন করা আছেন: <strong>{userDisplayName || "User"}</strong> ({userEmail})
                      </span>
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                      Verified User
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার নাম (Full Name) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        ফোন নম্বর (Phone Number) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="যেমন: +91 98765 43210"
                        className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Custom Field (Club Name) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {customLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                      placeholder="যেমন: ভারত রত্ন সংঘ / মিলন সংঘ / ইত্যাদি"
                      className="w-full rounded-lg border border-slate-300 bg-background px-3 py-2 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      আপনার পূজা কমিটি বা ক্লাবের আনুষ্ঠানিক নাম উল্লেখ করুন।
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      পূজামণ্ডপ / ক্লাবের পূর্ণ ঠিকানা (Address) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="রাস্তা, এলাকা, পাড়া, পিনকোড ও জেলা উল্লেখ করুন..."
                      className="w-full rounded-lg border border-slate-300 bg-background p-3 text-xs text-foreground focus:border-[#991b1b] focus:outline-none dark:border-zinc-700"
                    />
                  </div>

                  {/* Submit Button */}
                  {isButtonEnabled ? (
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#991b1b] to-[#c2410c] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow hover:from-[#7f1d1d] hover:to-[#9a3412] disabled:opacity-50 transition-all sm:w-auto"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>জমা দেওয়া হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>{buttonText}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                      নিবন্ধন বাটনটি বর্তমানে নিষ্ক্রিয় রাখা হয়েছে।
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
