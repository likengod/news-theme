import { Search, Loader2, ShieldCheck, XCircle } from "lucide-react";
import type { loadSettings } from "@/lib/site-content";

interface JournalistSearchBoxProps {
  uid: string;
  setUid: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  busy: boolean;
  error: string | null;
  notFound: boolean;
  settings: ReturnType<typeof loadSettings>;
}

export function JournalistSearchBox({ uid, setUid, onSubmit, busy, error, notFound, settings }: JournalistSearchBoxProps) {
  return (
    <section className="mx-auto max-w-xl px-2 sm:px-4 pb-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm text-center"
      >
        <label
          htmlFor="uid"
          className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3"
        >
          Journalist ID, User ID, or Phone Number
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-center">
          <div className="relative w-full flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="uid"
              maxLength={24}
              placeholder="TT-343AD0, 9629210685, or +91 94361 28945"
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/[^A-Za-z0-9\-\+\s\(\)]/g, "").slice(0, 24))}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-center font-mono text-base tracking-widest focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={busy || uid.trim().length < 3}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer shrink-0 transition-colors shadow-xs"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Verify
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 text-left">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notFound && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <XCircle className="mx-auto h-8 w-8 text-amber-600" />
          <p className="mt-2 font-bold text-amber-950 text-base">Not Verified — Journalist Not Found</p>
          <p className="mt-1 text-sm text-amber-800">
            The query <code className="font-mono font-bold">{uid}</code> does not match any accredited
            journalist in our system. Please check the ID or contact our editorial desk.
          </p>
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-3 inline-block text-sm font-semibold text-amber-900 underline"
            >
              {settings.contactEmail}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
