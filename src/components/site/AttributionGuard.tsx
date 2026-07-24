import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function AttributionGuard() {
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    const checkIntegrity = () => {
      const el = document.getElementById("gorilla-tech-partner-tag");
      if (!el) {
        setTampered(true);
        return;
      }

      const style = window.getComputedStyle(el);
      const isHidden =
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity || "1") < 0.1 ||
        parseFloat(style.fontSize || "12px") < 8;

      const hasText = el.textContent?.toUpperCase().includes("GORILLA TECH SOLUTION");

      if (isHidden || !hasText) {
        setTampered(true);
      }
    };

    // Initial check
    checkIntegrity();

    // Observe DOM mutations & CSS changes
    const interval = setInterval(checkIntegrity, 2500);
    const observer = new MutationObserver(checkIntegrity);

    const target = document.getElementById("gorilla-tech-partner-tag");
    if (target?.parentElement) {
      observer.observe(target.parentElement, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  if (!tampered) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-6 text-center text-white shadow-2xl space-y-4">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-red-400">Software License Integrity Notice</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Required developer attribution (<strong>GORILLA TECH SOLUTION</strong>) has been removed, hidden, or altered.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 font-mono">
          License Verification Required · Contact Gorilla Tech Solution
        </div>
        <a
          href="https://gorillatechsolution.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
        >
          Visit Gorilla Tech Solution
        </a>
      </div>
    </div>
  );
}
