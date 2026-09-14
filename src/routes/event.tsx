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

/** Traditional Bengali / Durga Puja Trishul & Third-Eye (ত্রিনয়ন) Festive Motif */
function DurgaMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central Trishul Spear */}
      <path
        d="M32 6V58M32 6L28 14M32 6L36 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Outer Curved Trishul Prongs */}
      <path
        d="M18 16C18 28 32 34 32 34C32 34 46 28 46 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 16L14 20M46 16L50 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Trishul Base Ring */}
      <circle cx="32" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
      {/* Third Eye (ত্রিনয়ন) */}
      <ellipse cx="32" cy="45" rx="8" ry="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="45" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Traditional Alpana / Decorative Corner Ornament */
function FestiveCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 37V12C3 7.02944 7.02944 3 12 3H37"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 37V16C8 11.5817 11.5817 8 16 8H37"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
        opacity="0.8"
      />
      <circle cx="13" cy="13" r="3" fill="currentColor" />
      <circle cx="23" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="23" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Symmetrical Festive Alpana / Flourish Divider */
function FestiveDivider({ title = "॥ শুভ শারদীয়া ॥" }: { title?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8" aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" />
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-serif font-bold text-xs sm:text-sm tracking-wider">
        <span className="text-red-600 dark:text-red-400">✦</span>
        <span>{title}</span>
        <span className="text-red-600 dark:text-red-400">✦</span>
      </div>
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" />
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFFDF9] text-[#1a1a1a] dark:from-[#0d0c0a] dark:via-[#16120b] dark:to-[#0d0c0a] dark:text-[#f3f3f3]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-14">
        {/* ─── Seamless Festive Hero Section (No Card Box) ─── */}
        <section className="relative text-center py-6 md:py-10">
          {/* Ambient Festive Aura & Warm Golden Glow */}
          <div
            className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-amber-400/20 via-red-500/10 to-transparent blur-3xl -z-10 dark:from-amber-600/15 dark:via-red-900/10"
            aria-hidden="true"
          />

          {/* Trishul & Third-Eye Sacred Emblem */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-amber-100 to-amber-200 text-red-700 shadow-md border-2 border-amber-400/80 dark:from-[#2e1d09] dark:to-[#1a1005] dark:text-amber-400 dark:border-amber-600/60">
            <DurgaMotif className="h-11 w-11 drop-shadow-sm" />
          </div>

          {/* Festive Sacred Salutation */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-red-500/15 to-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-serif font-bold text-amber-900 dark:text-amber-200 mb-4 tracking-wide shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          </div>

          {/* Grand Festive Headline */}
          <h1 className="font-serif text-3xl font-black tracking-tight text-red-800 dark:text-red-400 sm:text-5xl md:text-6xl drop-shadow-xs">
            {eventTitle}
          </h1>

          {/* Festive Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200">
            {eventSubtitle}
          </p>

          {/* Event Narrative */}
          <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {eventDesc}
          </p>

          {/* Date & Location Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-300/80 px-4 py-2 text-amber-950 dark:bg-[#20180b] dark:border-amber-700/60 dark:text-amber-200 shadow-xs">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-red-50 border border-red-300/80 px-4 py-2 text-red-950 dark:bg-[#230f0f] dark:border-red-800/60 dark:text-red-200 shadow-xs">
              <MapPin className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{eventLocation}</span>
            </div>
          </div>

          {/* Festive CTA Button */}
          {isButtonEnabled && isFormEnabled && (
            <div className="mt-8">
              <a
                href="#register"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-red-700 via-crimson-600 to-amber-600 px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-700/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/30 border border-amber-300/40"
              >
                <Flame className="h-4 w-4 text-amber-200 transition-transform group-hover:rotate-12" />
                <span>{buttonText}</span>
              </a>
            </div>
          )}
        </section>

        {/* ─── Decorative Alpana Divider ─── */}
        <FestiveDivider title="॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥" />

        {/* ─── Highlights & Criteria Showcase (Seamless Columns, No Card Boxes) ─── */}
        <section className="py-4">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-300/40 dark:divide-amber-800/40">
            {/* Column 1: Prizes */}
            <div className="pt-6 md:pt-0 md:px-6 first:pl-0">
              <div className="flex items-center gap-2.5 text-red-800 dark:text-red-400 mb-3 font-serif font-bold text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-300/60 dark:border-red-800/60">
                  <Trophy className="h-4 w-4" />
                </div>
                <span>পুরস্কার ও সম্মাননা</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                {prizeList.map((prize, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                    <span>{prize}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Criteria */}
            <div className="pt-6 md:pt-0 md:px-6">
              <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 mb-3 font-serif font-bold text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                  <Award className="h-4 w-4" />
                </div>
                <span>মূল্যায়নের মূল ভিত্তি</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                  <span>ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                  <span>স্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                  <span>পরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                  <span>শৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Guidelines */}
            <div className="pt-6 md:pt-0 md:px-6 last:pr-0 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 mb-3 font-serif font-bold text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                  <Users className="h-4 w-4" />
                </div>
                <span>অংশগ্রহণকারী নির্দেশিকা</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায়
                অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-300/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>অংশগ্রহণ সম্পূর্ণ বিনামূল্যে</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Decorative Alpana Divider ─── */}
        <FestiveDivider title="॥ শারদ সম্মান আবেদন পত্র ॥" />

        {/* ─── Festive Registration Form (Scroll / Traditional Frame) ─── */}
        <section id="register" className="relative scroll-mt-10 my-6">
          <div className="relative rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 p-6 sm:p-10 md:p-12 shadow-sm dark:border-amber-700/50 dark:from-[#18130a] dark:via-[#100e0a] dark:to-[#18130a]">
            {/* Traditional Ornamental Alpona Corners */}
            <FestiveCorner className="absolute top-3 left-3 h-8 w-8 text-amber-500/80 dark:text-amber-400/60" />
            <FestiveCorner className="absolute top-3 right-3 h-8 w-8 -scale-x-100 text-amber-500/80 dark:text-amber-400/60" />
            <FestiveCorner className="absolute bottom-3 left-3 h-8 w-8 -scale-y-100 text-amber-500/80 dark:text-amber-400/60" />
            <FestiveCorner className="absolute bottom-3 right-3 h-8 w-8 -scale-x-100 -scale-y-100 text-amber-500/80 dark:text-amber-400/60" />

            {/* Inscription Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
                <Flame className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-800 dark:text-red-400">
                ইভেন্ট নিবন্ধন ফরম (Event Registration)
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন
              </p>
            </div>

            {/* Form Content */}
            {!isFormEnabled ? (
              /* When form is disabled by admin */
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-stone-900 dark:text-stone-100">
                  অনলাইন নিবন্ধন আপাতত বন্ধ রয়েছে
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  শারদ সম্মান প্রতিযোগিতার নিবন্ধন সাময়িকভাবে স্থগিত বা সম্পন্ন হয়েছে।
                </p>
              </div>
            ) : submitted ? (
              /* Success Message */
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
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
                  className="mt-6 rounded-full border border-amber-400 px-6 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 dark:border-amber-700 dark:text-amber-200 transition-colors"
                >
                  আরেকটি নিবন্ধন জমা দিন
                </button>
              </div>
            ) : !userId ? (
              /* When user is NOT logged in */
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  নিবন্ধন করতে লগইন করা আবশ্যক
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-stone-600 dark:text-stone-400">
                  শুধুমাত্র নিবন্ধিত ও লগইন করা ব্যবহারকারীগণ শারদ সম্মানে নিজেদের ক্লাবের নাম
                  অন্তর্ভুক্ত করতে পারবেন।
                </p>
                <div className="mt-5">
                  <Link
                    to="/auth"
                    search={{ redirect: "/event" }}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-amber-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:from-red-800 hover:to-amber-800 transition-all"
                  >
                    <span>লগইন / সাইন আপ করুন</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Authenticated User Registration Form */
              <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
                {/* Logged in badge */}
                <div className="flex items-center justify-between rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 px-4 py-2.5 text-xs text-amber-950 dark:text-amber-200">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      লগইন আছেন: <strong>{userDisplayName || "User"}</strong> ({userEmail})
                    </span>
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      আপনার নাম (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার পুরো নাম লিখুন"
                      className="w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                      ফোন নম্বর (Phone Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="যেমন: +91 98765 43210"
                      className="w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Custom Field (Club Name) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {customLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    placeholder="যেমন: ভারত রত্ন সংঘ / মিলন সংঘ / ইত্যাদি"
                    className="w-full rounded-xl border border-amber-300/70 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                    আপনার পূজা কমিটি বা ক্লাবের আনুষ্ঠানিক নাম উল্লেখ করুন।
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    পূজামণ্ডপ / ক্লাবের পূর্ণ ঠিকানা (Address) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="রাস্তা, এলাকা, পাড়া, পিনকোড ও জেলা উল্লেখ করুন..."
                    className="w-full rounded-xl border border-amber-300/70 bg-white/90 p-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none dark:bg-zinc-900/90 dark:border-amber-700/60 dark:text-stone-100"
                  />
                </div>

                {/* Submit Button */}
                {isButtonEnabled ? (
                  <div className="pt-3 text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 via-crimson-600 to-amber-600 px-10 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-700/25 hover:from-red-800 hover:to-amber-700 disabled:opacity-50 transition-all border border-amber-300/40"
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
                  <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 text-center">
                    নিবন্ধন বাটনটি বর্তমানে নিষ্ক্রিয় রাখা হয়েছে।
                  </div>
                )}
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
