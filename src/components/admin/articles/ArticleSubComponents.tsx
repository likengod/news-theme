import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Search, UserCheck, X, Loader2, Coins, Wallet, Image as ImageIcon } from "lucide-react";
import { searchJournalists, awardJournalistPoints, type JournalistSearchResult } from "@/lib/journalist.functions";
import { MediaField } from "@/components/admin/MediaField";
function ImageInput({ value, onChange, hint }: { value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-32 w-48 shrink-0 place-items-center overflow-hidden rounded-md border-2 border-dashed border-slate-200 bg-slate-50">
        {value ? <img src={value} alt="preview" className="h-full w-full object-cover" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto h-6 w-6" /><span className="mt-1 block text-xs">No image</span></div>}
      </div>
      <div className="flex-1 space-y-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
        <MediaField value={value} onChange={onChange} usage="article" hint={hint} previewClassName="hidden" recommendedSize="1600Ã—900 px (16:9)" />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function JournalistPicker({
  journalistId,
  journalistName,
  onSelect,
}: {
  journalistId: string;
  journalistName: string;
  onSelect: (j: JournalistSearchResult | null) => void;
}) {
  const runSearch = useServerFn(searchJournalists);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<JournalistSearchResult[] | null>(null);

  const search = async () => {
    const query = q.trim();
    if (query.length < 2) return toast.error("Enter a name or User ID (min 2 chars)");
    setBusy(true);
    try {
      const rows = await runSearch({ data: { query } });
      setResults(rows);
      if (rows.length === 0) toast.info("No matching journalist found");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
        <UserCheck className="h-3.5 w-3.5" /> Journalist
        <span className="font-normal normal-case text-slate-400">â€” assign a journalist from your users by name or User ID</span>
      </div>

      {journalistId ? (
        <div className="mb-3 space-y-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium text-emerald-900">
                <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                {journalistName || "Journalist"}
              </p>
              <p className="font-mono text-xs text-emerald-700">ID: {journalistId}</p>
            </div>
            <button
              type="button"
              onClick={() => { onSelect(null); setResults(null); setQ(""); }}
              className="shrink-0 rounded-md border border-emerald-300 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Change
            </button>
          </div>
          <AwardPointsBox publicUserId={journalistId} displayName={journalistName} />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); search(); } }}
              placeholder="Journalist name or 10-digit User ID..."
              className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={search}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Search
          </button>
        </div>
      )}
       {!journalistId && results && results.length > 0 && (
        <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-md border border-slate-200">
          {results.map((j) => (
            <li key={j.userId}>
              <button
                type="button"
                onClick={() => { onSelect(j); setResults(null); setQ(""); }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-900">
                    {j.displayName || "Unnamed user"}
                    {j.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                  </p>
                  <p className="font-mono text-xs text-slate-500">ID: {j.publicUserId} â€¢ {j.role}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${j.verified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
                  {j.verified ? "Verified" : j.role}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AwardPointsBox({ publicUserId, displayName }: { publicUserId: string; displayName: string }) {
  const runAward = useServerFn(awardJournalistPoints);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const submit = async () => {
    const points = Math.floor(Number(amount));
    if (!Number.isFinite(points) || points === 0) {
      return toast.error("Enter a non-zero point amount");
    }
    setBusy(true);
    try {
      const res = await runAward({ data: { publicUserId, points, reason: reason || undefined } });
      setBalance(res.newBalance);
      setAmount("");
      setReason("");
      toast.success(`${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} pts Â· new balance ${res.newBalance}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to award points");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-md border border-emerald-200 bg-white px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
          <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Award points to {displayName || "journalist"}
        </span>
        {balance !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <Coins className="h-3 w-3" /> Wallet: {balance}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Points (e.g. 20)"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none sm:w-40"
        />
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Coins className="h-3.5 w-3.5" />}
          Add to wallet
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-500">Credits the journalist's wallet instantly. Use a negative amount to deduct.</p>
    </div>
  );

}
export { ImageInput, Field, JournalistPicker, AwardPointsBox };
