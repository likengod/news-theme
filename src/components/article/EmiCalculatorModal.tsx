import { useState, useId } from "react";
import { X, Calculator, IndianRupee, PieChart } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function EmiCalculatorModal({ isOpen, onClose }: Props) {
  const loanId = useId();
  const rateId = useId();
  const tenureId = useId();

  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  if (!isOpen) return null;

  // Monthly EMI Calculation: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEmi =
    monthlyRate > 0 && factor > 1
      ? Math.round((loanAmount * monthlyRate * factor) / (factor - 1))
      : 0;
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  const formatInr = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Home Loan EMI Calculator"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">EMI ক্যালকুলেটর</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Loan EMI Calculator</p>
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

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <label htmlFor={loanId}>ঋণের পরিমাণ (Loan Amount):</label>
              <span className="text-red-600 font-bold">{formatInr(loanAmount)}</span>
            </div>
            <input
              id={loanId}
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
              <span>₹1 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <label htmlFor={rateId}>বার্ষিক সুদের হার (Interest Rate):</label>
              <span className="text-red-600 font-bold">{interestRate}% p.a.</span>
            </div>
            <input
              id={rateId}
              type="range"
              min={6}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
              <span>6%</span>
              <span>15%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <label htmlFor={tenureId}>ঋণের মেয়াদ (Loan Tenure):</label>
              <span className="text-red-600 font-bold">{tenureYears} Years ({totalMonths} Months)</span>
            </div>
            <input
              id={tenureId}
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4">
          <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">মাসিক কিস্তি (Monthly EMI)</span>
            <div className="text-2xl font-black text-red-600 mt-0.5">{formatInr(monthlyEmi)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">মোট সুদ (Total Interest)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{formatInr(totalInterest)}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">মোট পরিশোধ (Total Payment)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{formatInr(totalPayment)}</span>
            </div>
          </div>
        </div>

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
