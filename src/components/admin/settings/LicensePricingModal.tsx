import React, { useState, useEffect } from "react";
import { Check, X, XCircle } from "lucide-react";

export function LicensePricingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isIndia, setIsIndia] = useState(false);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsIndia(tz === "Asia/Kolkata" || tz === "Asia/Calcutta");
    } catch (e) {
      // Fallback
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <XCircle className="h-6 w-6" />
        </button>

        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-extrabold text-slate-900">Choose Your Plan</h2>
          <p className="mx-auto max-w-2xl text-slate-600 leading-relaxed">
            We rely on your support to fund ongoing website development, deliver timely bug fixes, and keep our team running smoothly so we can provide you with the best features.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Premium Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-slate-900">Premium</h3>
            <div className="mt-4 space-y-3">
              {isIndia ? (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-slate-900">
                    ₹499 <span className="ml-1 text-base font-medium text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Drops to ₹189/mo after 7 months</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-slate-900">
                    $10 <span className="ml-1 text-base font-medium text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Drops to $5/mo after 6 months</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Everything you need to get started and keep your website running perfectly.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Auto update control</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Unlock all features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Bug fixes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Email support</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="text-slate-500 line-through">Installation support</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="text-slate-500 line-through">Monthly dedicated support</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="text-slate-500 line-through">Footer copyright removed</span>
              </li>
            </ul>
            <a
              href="https://gorillatechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Get Premium
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 p-8 shadow-md transition hover:shadow-lg">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
            <div className="mt-4 space-y-3">
              {isIndia ? (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-slate-900">
                    ₹7259 <span className="ml-1 text-base font-medium text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Drops to ₹4958/mo after 4 months</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-slate-900">
                    $98 <span className="ml-1 text-base font-medium text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Drops to $55/mo after 6 months</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              For serious publishers who need the entire Gorilla ecosystem and priority support.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-900 font-medium">Includes all Premium features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Gorilla Article Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Gorilla Live App Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Gorilla Tech Solution Some Premium App Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Email, WhatsApp & Call Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">All Ads Layout Features Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Includes Basic Shared Hosting</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">2 Free Business Emails</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Installation Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-slate-700">Free Domain (.com or .in if available)</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 shrink-0 text-slate-400" />
                <span className="text-slate-500 line-through">Footer copyright removed</span>
              </li>
            </ul>
            <a
              href="https://gorillatechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-lg bg-emerald-500 px-4 py-3 text-center font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg"
            >
              Contact Sales
            </a>
          </div>

          {/* Enterprise+ Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-900 p-8 shadow-sm transition hover:shadow-md">
            <h3 className="text-xl font-bold text-white">Enterprise+</h3>
            <div className="mt-4 space-y-3">
              {isIndia ? (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-white">
                    ₹3,00,000 <span className="ml-1 text-base font-medium text-slate-400">one time</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">Then ₹16,666/mo after 1 year</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline text-4xl font-extrabold text-white">
                    $3,599 <span className="ml-1 text-base font-medium text-slate-400">one time</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">Then $199/mo after 1 year</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              The ultimate custom tailored solution for massive scale operations.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300 font-medium">Includes all Premium features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Gorilla Article Access</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 shrink-0 text-slate-500" />
                <span className="text-slate-400 line-through">Gorilla Live App Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Gorilla Tech Solution Some Premium App Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Email, WhatsApp & Call Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">All Ads Layout Features Access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Includes Basic Shared Hosting</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">2 Free Business Emails</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Installation Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Free Domain (.com or .in if available)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Footer copyright removed</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Custom designed</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="text-slate-300">Custom source code update option available</span>
              </li>
            </ul>
            <a
              href="https://gorillatechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-lg bg-emerald-500 px-4 py-3 text-center font-bold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
