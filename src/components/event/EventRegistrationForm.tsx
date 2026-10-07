import { Link } from "@tanstack/react-router";
import {
  Flame,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Send,
} from "lucide-react";

interface EventRegistrationFormProps {
  isFormEnabled: boolean;
  submitted: boolean;
  onResetSubmitted: () => void;
  userId: string | null;
  userDisplayName: string | null;
  userEmail: string | null;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  customField: string;
  setCustomField: (v: string) => void;
  customLabel: string;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isButtonEnabled: boolean;
  buttonText: string;
  eventFormTitle: string;
  eventFormSubtitle: string;
}

export function EventRegistrationForm({
  isFormEnabled,
  submitted,
  onResetSubmitted,
  userId,
  userDisplayName,
  userEmail,
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  customField,
  setCustomField,
  customLabel,
  submitting,
  onSubmit,
  isButtonEnabled,
  buttonText,
  eventFormTitle,
  eventFormSubtitle,
}: EventRegistrationFormProps) {
  return (
    <section id="register" className="relative scroll-mt-10 my-10 max-w-2xl mx-auto px-2">
      {/* Inscription Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
          <Flame className="h-5 w-5" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-red-800 dark:text-red-400">
          {eventFormTitle}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          {eventFormSubtitle}
        </p>
      </div>

      {/* Form Content */}
      {!isFormEnabled ? (
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
            onClick={onResetSubmitted}
            className="mt-6 rounded-full border border-amber-400 px-6 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 dark:border-amber-700 dark:text-amber-200 transition-colors"
          >
            আরেকটি নিবন্ধন জমা দিন
          </button>
        </div>
      ) : !userId ? (
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
        <form onSubmit={onSubmit} className="space-y-5 max-w-2xl mx-auto">
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
    </section>
  );
}
