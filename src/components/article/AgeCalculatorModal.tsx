import { useState } from "react";
import { X, CalendarDays, Gift, Clock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AgeCalculatorModal({ isOpen, onClose }: Props) {
  const [dob, setDob] = useState<string>("2000-01-01");

  if (!isOpen) return null;

  const calculateAge = () => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) {
      return null;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Next Birthday calculation
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const diffTime = nextBday.getTime() - now.getTime();
    const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, daysUntilNext, totalDays };
  };

  const ageData = calculateAge();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age Calculator"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">বয়স ক্যালকুলেটর</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Exact Age &amp; Birthday Calculator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mt-5 space-y-2">
          <label htmlFor="user-dob-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            জন্ম তারিখ নির্বাচন করুন (Select Date of Birth):
          </label>
          <input
            id="user-dob-input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Results */}
        {ageData ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 p-4 text-center">
              <span className="text-xs uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider">
                আপনার বর্তমান বয়স (Your Current Age)
              </span>
              <div className="mt-2 flex items-baseline justify-center gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{ageData.years}</span>
                <span className="text-xs text-slate-500 font-semibold mr-1">বছর (Yrs)</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{ageData.months}</span>
                <span className="text-xs text-slate-500 font-semibold mr-1">মাস (Mos)</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{ageData.days}</span>
                <span className="text-xs text-slate-500 font-semibold">দিন (Days)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                <Gift className="h-4 w-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">পরবর্তী জন্মদিন</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ageData.daysUntilNext} দিন পর</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">মোট দিন অতিক্রান্ত</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ageData.totalDays.toLocaleString()} দিন</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-amber-600 text-center">দয়া করে একটি সঠিক তারিখ নির্বাচন করুন।</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
