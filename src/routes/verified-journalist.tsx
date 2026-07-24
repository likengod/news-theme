import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  BadgeCheck, ShieldCheck, Search, Loader2, XCircle, ShieldOff, Phone, Mail,
  MapPin, Droplet, Calendar, User, Globe,
} from "lucide-react";
import { lookupJournalist, type JournalistLookup } from "@/lib/journalist.functions";
import { loadAuthorized, type AuthorizedSettings } from "@/lib/authorized-settings";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/verified-journalist")({
  head: () => ({
    meta: [
      { title: "Verify a Journalist — News Theme" },
      { name: "description", content: "Enter a Journalist ID or 10-digit User ID to verify an accredited News Theme reporter." },
      { property: "og:title", content: "Verify a Journalist — News Theme" },
      { property: "og:description", content: "Instantly check if a byline belongs to a verified News Theme reporter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifiedPage,
});

const ROLE_LABEL: Record<string, string> = {
  admin: "Editor-in-Chief",
  editor: "Senior Editor",
  author: "Senior Journalist",
  journalist: "Journalist",
  premium: "Premium Reader",
  reader: "Reader",
};

function VerifiedPage() {
  const lookup = useServerFn(lookupJournalist);
  const [uid, setUid] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<JournalistLookup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const doLookup = async (searchId: string) => {
    const target = searchId.trim();
    if (!target) return;
    setError(null);
    setResult(null);
    setNotFound(false);
    setBusy(true);
    try {
      const r = await lookup({ data: { publicUserId: target } });
      if (r.found === false) setNotFound(true);
      else setResult(r);
    } catch (err: any) {
      setError(err?.message ?? "Lookup failed");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLookup(uid);
  };

  // Auto-fetch if someone scans a QR code with ?id= or ?uid= in the URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get("id") || params.get("uid");
    if (paramId) {
      const cleanId = paramId.trim();
      setUid(cleanId);
      doLookup(cleanId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5" /> Trust Center
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Verify a Journalist
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Enter a reporter's <strong>Journalist ID</strong> (e.g. <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">ABC1234Z</code>) or their 10-digit <strong>User ID</strong> to view their official press card.
        </p>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-8">
        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="uid" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Journalist ID or User ID
          </label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="uid"
                maxLength={16}
                placeholder="ABC1234Z or 1234567890"
                value={uid}
                onChange={(e) => setUid(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16))}
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 font-mono text-base tracking-widest focus:border-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={busy || uid.trim().length < 3}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Verify
            </button>
          </div>
        </form>

        <div className="mt-6">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notFound && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <XCircle className="mx-auto h-8 w-8 text-amber-600" />
              <p className="mt-2 font-semibold text-amber-900">Journalist data not found</p>
              <p className="mt-1 text-sm text-amber-800">
                This ID does not belong to us. Please double-check the number, or contact our office to confirm the reporter's credentials.
              </p>
              <a href="mailto:trust@northeasttimeline.com" className="mt-3 inline-block text-sm font-semibold text-amber-900 underline">
                trust@northeasttimeline.com
              </a>
            </div>
          )}

          {result && result.found && <PressCard data={result} />}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16">
        <p className="text-center text-xs text-slate-500">
          Spotted a fake byline? Email{" "}
          <a className="underline" href="mailto:trust@northeasttimeline.com">trust@northeasttimeline.com</a>{" "}
          — we investigate within 48 hours.
        </p>
      </section>
      <Footer />
    </div>
  );
}

function PressCard({ data }: { data: Extract<JournalistLookup, { found: true }> }) {
  const [auth, setAuth] = useState<AuthorizedSettings>(loadAuthorized());
  useEffect(() => { setAuth(loadAuthorized()); }, []);

  const inactive = !data.active;
  const roleLabel = ROLE_LABEL[data.role] ?? "Journalist";
  const name = (data.displayName ?? "News Theme Reporter").toUpperCase();
  const isSuspended = !data.active;
  const defaultValid = new Date(new Date(data.memberSince).getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const validStr = isSuspended ? "SUSPENDED" : (data.validTill || defaultValid);

  if (!data.verified) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <User className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
        <div>
          <p className="font-semibold text-slate-900">
            {data.displayName ?? "This account"} is not an accredited journalist
          </p>
          <p className="mt-1 text-sm text-slate-600">
            The account exists on News Theme (role:{" "}
            <span className="font-medium">{roleLabel}</span>) but is not authorised to publish under a verified byline.
          </p>
        </div>
      </div>
    );
  }

  // Press-card design — CR-80 standard (2.13″ × 3.39″ scaled ×1.6 → 326 × 520 px)
  const journalistId = data.journalistId ?? `NT-${data.publicUserId}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://northeasttimeline.com";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/verified-journalist?id=${journalistId}`)}`;

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
      {/* ═══════════════ FRONT CARD ═══════════════ */}
      <div
        className="relative shrink-0 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200"
        style={{ width: 326, height: 520 }}
      >
        {/* ── PRESS sidebar (right edge, full height) ── */}
        <div className="absolute inset-y-0 right-0 z-30 flex w-[50px] items-center justify-center bg-red-600">
          <span className="rotate-180 text-[32px] font-black leading-none tracking-[0.45em] text-white [writing-mode:vertical-rl]">
            PRESS
          </span>
        </div>

        {/* ── Geometric header shapes (25% height: 130px) ── */}
        <div className="absolute left-0 top-0 z-0 bg-red-600" style={{ width: 276, height: 130 }}>
          {/* Navy polygon — top-left to mid-right diagonal */}
          <div
            className="absolute inset-0 bg-[#1a2040]"
            style={{ clipPath: "polygon(0 0, 74% 0, 38% 100%, 0 76%)" }}
          />
          {/* Red triangle accent — bottom-left */}
          <div
            className="absolute inset-0 bg-red-600"
            style={{ clipPath: "polygon(0 58%, 0 100%, 32% 100%)" }}
          />
        </div>

        {/* ── Logo + Name (top-left inside navy area) ── */}
        <div className="relative z-10 flex items-center gap-2 px-3.5 pt-3.5" style={{ width: 220 }}>
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#34c759]/40 bg-[#34c759]/20 backdrop-blur-sm">
            <BadgeCheck className="h-4.5 w-4.5 text-[#34c759]" />
          </div>
          <p className="text-[10px] font-extrabold leading-tight tracking-wide text-white">
            <span className="text-red-300">NORTHEAST</span><br />TIMELINE
          </p>
        </div>

        {/* ── White house cutout behind photo ── */}
        <div
          className="absolute z-10 bg-white"
          style={{
            width: 132,
            height: 110,
            left: 138,
            top: 58,
            transform: "translateX(-50%)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)",
          }}
        />

        {/* ── Photo (LCP Image) ── */}
        <div className="absolute z-20" style={{ left: 138, top: 74, transform: "translateX(-50%)" }}>
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={`Official press photo of accredited journalist ${name}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-[80px] w-[80px] rounded-xl border-[3px] border-white object-cover shadow-md"
            />
          ) : (
            <div className="grid h-[80px] w-[80px] place-items-center rounded-xl border-[3px] border-white bg-slate-100 text-2xl font-bold text-slate-500 shadow-md">
              {name.slice(0, 2)}
            </div>
          )}
        </div>

        {/* ── Body content ── */}
        <div className="absolute left-0 right-[50px] z-10 text-center" style={{ top: 168 }}>
          <h2 className="px-4 text-[15px] font-black uppercase tracking-wide text-slate-900 leading-tight">
            {name}
          </h2>
          <div className="mt-1.5 flex items-center justify-center gap-1.5">
            <span className="rounded-md bg-red-600 px-2.5 py-[2px] text-[9px] font-bold uppercase tracking-widest text-white">
              {roleLabel}
            </span>
            {isSuspended ? (
              <span className="flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-2 py-[2px] text-[9px] font-extrabold text-red-700 shadow-xs">
                <ShieldOff className="h-3.5 w-3.5 text-red-600" /> Suspended
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md border border-[#34c759]/50 bg-[#34c759]/15 px-2 py-[2px] text-[9px] font-extrabold text-[#1f7032] shadow-xs">
                <BadgeCheck className="h-3.5 w-3.5 text-[#34c759]" /> Verified
              </span>
            )}
          </div>

          {/* ── Info grid with dashed separators ── */}
          <div className="mx-3.5 mt-3 space-y-1">
            {/* Row 1: Department | Press ID */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-start">
              <div className="py-1 text-center">
                <p className="text-[8.5px] font-bold text-slate-900">Department:</p>
                <p className="text-[8.5px] text-slate-600">News &amp; Reporting</p>
              </div>
              <div className="mx-1 self-stretch border-l border-dashed border-red-400" />
              <div className="py-1 text-center">
                <p className="text-[8.5px] font-bold text-slate-900">Press ID No.:</p>
                <p className="font-mono text-[8.5px] font-bold text-slate-800">{journalistId}</p>
              </div>
            </div>
            <div className="border-t border-dashed border-red-400" />

            {/* Row 2: Valid Till | Blood Group | DOB */}
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start">
              <div className="py-1 text-center">
                <p className="text-[8px] font-bold text-slate-900">Valid Till:</p>
                <p className={`text-[8px] font-bold ${isSuspended ? "text-red-600 font-black uppercase" : "text-slate-600"}`}>{validStr}</p>
              </div>
              <div className="mx-0.5 self-stretch border-l border-dashed border-red-400" />
              <div className="py-1 text-center">
                <p className="text-[8px] font-bold text-slate-900">Blood Group:</p>
                <p className="text-[8px] font-bold text-red-600">{data.bloodGroup || "—"}</p>
              </div>
              <div className="mx-0.5 self-stretch border-l border-dashed border-red-400" />
              <div className="py-1 text-center">
                <p className="text-[8px] font-bold text-slate-900">DOB:</p>
                <p className="text-[8px] text-slate-600">{data.dob || "—"}</p>
              </div>
            </div>
            <div className="border-t border-dashed border-red-400" />

            {/* Row 3: Address & Location Details (Address, State, Country, Pin Code) */}
            <div className="pt-0.5 text-center">
              <p className="text-[8.5px] font-bold text-slate-900">Address &amp; Location:</p>
              {(() => {
                const street = data.address || auth.officeAddress;
                const stateStr = data.state || auth.officeState || "Tripura";
                const countryStr = data.country || auth.officeCountry || "India";
                const pinStr = data.pinCode || auth.officePin;
                const parts = [];
                if (street) parts.push(street);
                if (stateStr) parts.push(stateStr);
                if (countryStr) parts.push(countryStr);
                const fullLoc = `${parts.join(", ")}${pinStr ? ` - ${pinStr}` : ""}`;

                let sizeCls = "text-[8px] leading-tight";
                if (fullLoc.length > 65) sizeCls = "text-[7px] leading-none line-clamp-2";
                else if (fullLoc.length > 40) sizeCls = "text-[7.5px] leading-tight line-clamp-2";

                return (
                  <p className={`mx-auto max-w-[215px] font-medium text-slate-700 ${sizeCls}`}>
                    {fullLoc}
                  </p>
                );
              })()}
            </div>

            {/* Row 4 (if suspended): THIS JOURNALIST IS SUSPENDED */}
            {isSuspended && (
              <>
                <div className="border-t border-dashed border-red-400" />
                <div className="pt-1 text-center">
                  <p className="text-[11px] font-black uppercase tracking-wide leading-tight">
                    <span className="text-slate-900">THIS JOURNALIST IS </span>
                    <span className="text-red-600">SUSPENDED</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Bottom Section: QR Code + Scan text (left of QR — enlarged size: 76px) ── */}
        <div className="absolute bottom-1.5 z-20 flex items-center justify-center gap-3" style={{ left: 0, right: 50 }}>
          <div className="text-right text-[8.5px] font-extrabold uppercase tracking-tight leading-tight">
            <p className="text-red-600">Scan QR Code</p>
            <p className="text-[8px] font-bold text-slate-700">To Verify Journalist</p>
          </div>
          <img
            src={qrUrl}
            alt={`QR Code for verifying journalist ${name}`}
            loading="eager"
            decoding="async"
            className="h-[76px] w-[76px] shrink-0 rounded-lg bg-white p-1 shadow-md ring-1 ring-slate-200"
          />
        </div>

        {/* ── Bottom-left red accent ── */}
        <div
          className="absolute bottom-0 left-0 z-10 bg-red-600"
          style={{ width: 80, height: 50, clipPath: "polygon(0 45%, 65% 100%, 0 100%)" }}
        />
        {/* ── Bottom-right navy accent (before PRESS bar) ── */}
        <div
          className="absolute bottom-0 z-10 bg-[#1a2040]"
          style={{ right: 50, width: 80, height: 50, clipPath: "polygon(35% 100%, 100% 45%, 100% 100%)" }}
        />
      </div>

      {/* ═══════════════ BACK CARD ═══════════════ */}
      <div
        className="relative shrink-0 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200"
        style={{ width: 326, height: 520 }}
      >
        {/* ── Geometric header (15% height: 78px) ── */}
        <div className="relative overflow-hidden" style={{ height: 78 }}>
          {/* Left navy */}
          <div
            className="absolute inset-0 bg-[#1a2040]"
            style={{ clipPath: "polygon(0 0, 58% 0, 38% 100%, 0 100%)" }}
          />
          {/* Right red */}
          <div
            className="absolute inset-0 bg-red-600"
            style={{ clipPath: "polygon(42% 0, 100% 0, 100% 100%, 62% 100%)" }}
          />
          {/* Center dark overlap */}
          <div
            className="absolute inset-0 bg-[#252a45]/70"
            style={{ clipPath: "polygon(46% 0, 58% 0, 42% 100%, 30% 100%)" }}
          />
        </div>

        {/* ── Office Details Badge (Below Header, Left Side) ── */}
        <div className="px-4 pt-2.5 pb-0 flex items-center justify-start">
          <span className="inline-block rounded-md bg-red-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            OFFICE DETAILS
          </span>
        </div>

        {/* ── Info grid ── */}
        <div className="px-4 pt-2 pb-1">
          {/* Row 1: Phone | Email */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">Phone:</p>
              <p className={`mt-0.5 truncate text-slate-600 ${
                (auth.officePhone || data.phone || "").length > 15 ? "text-[8.5px]" : "text-[10px]"
              }`}>
                {auth.officePhone || data.phone || "—"}
              </p>
            </div>
            <div className="mx-1 self-stretch border-l border-dashed border-red-300" />
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">Email:</p>
              <p className={`mt-0.5 truncate text-slate-600 ${
                (auth.officeEmail || data.email || "").length > 22 ? "text-[8.5px]" : "text-[10px]"
              }`}>
                {auth.officeEmail || data.email || "—"}
              </p>
            </div>
          </div>
          <div className="border-t border-dashed border-red-300" />

          {/* Row 2: Website | Address */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">Website:</p>
              <p className={`mt-0.5 truncate text-slate-600 ${
                (auth.officeWebsite || "northeasttimeline.com").length > 22 ? "text-[8.5px]" : "text-[10px]"
              }`}>
                {auth.officeWebsite || "northeasttimeline.com"}
              </p>
            </div>
            <div className="mx-1 self-stretch border-l border-dashed border-red-300" />
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">Address:</p>
              {(() => {
                const addr = auth.officeAddress || data.address || "College Road, Kailasahar";
                let fontCls = "text-[10px] leading-tight";
                if (addr.length > 50) fontCls = "text-[8px] leading-none line-clamp-2";
                else if (addr.length > 25) fontCls = "text-[8.5px] leading-tight line-clamp-2";
                return <p className={`mt-0.5 text-slate-600 ${fontCls}`}>{addr}</p>;
              })()}
            </div>
          </div>
          <div className="border-t border-dashed border-red-300" />

          {/* Row 3: State & Country | PIN / ZIP Code */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">State &amp; Country:</p>
              {(() => {
                const stateStr = auth.officeState || data.state || "Tripura";
                const countryStr = auth.officeCountry || data.country || "India";
                const locationStr = `${stateStr}, ${countryStr}`;
                const fontCls = locationStr.length > 20 ? "text-[8.5px]" : "text-[10px]";
                return <p className={`mt-0.5 truncate text-slate-600 ${fontCls}`}>{locationStr}</p>;
              })()}
            </div>
            <div className="mx-1 self-stretch border-l border-dashed border-red-300" />
            <div className="py-1 text-center px-1">
              <p className="text-[10px] font-bold text-slate-900">PIN / ZIP Code:</p>
              <p className="mt-0.5 font-mono text-[10px] text-slate-700 font-semibold">
                {auth.officePin || data.pinCode || "799277"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Note & Disclaimer ── */}
        {(() => {
          const noteText = auth.cardNote || "This card certifies that the bearer is an authorized journalist of News Theme. If found, please return to the above address.";
          const disclaimerText = auth.cardDisclaimer || "Tampering or misuse of this card is a punishable offense.";
          const totalLength = noteText.length + disclaimerText.length;
          const lineBreaks = (noteText.match(/\n/g) || []).length + (disclaimerText.match(/\n/g) || []).length;

          let sizeCls = "text-[10px] leading-snug";
          if (totalLength > 220 || lineBreaks >= 4) {
            sizeCls = "text-[8px] leading-tight";
          } else if (totalLength > 140 || lineBreaks >= 2) {
            sizeCls = "text-[9px] leading-tight";
          }

          return (
            <div className={`px-5 pb-3 text-slate-600 ${sizeCls}`}>
              <p className="whitespace-pre-line">
                <span className="font-bold text-red-600">– Note:</span><br />
                {noteText}
              </p>
              <p className="mt-2 whitespace-pre-line">
                <span className="font-bold text-red-600">– Disclaimer:</span><br />
                {disclaimerText}
              </p>
            </div>
          );
        })()}

        {/* ── Bottom fixed section ── */}
        <div className="absolute bottom-[6px] left-0 right-0">
          {/* Dashed red separator */}
          <div className="mx-5 border-t-2 border-dashed border-red-500" />

          {/* QR (left) + Authorized Signature (right) — single row */}
          <div className="flex items-end justify-between px-5 pt-2 pb-2">
            {/* QR code — left */}
            <img
              src={qrUrl}
              alt={`Official verification QR code for journalist ${name}`}
              loading="lazy"
              decoding="async"
              className="h-[64px] w-[64px] rounded bg-white p-0.5 shadow-sm"
            />
            {/* Signature — right */}
            <div className="flex flex-col items-center">
              {auth.signatureImageUrl ? (
                <img
                  src={auth.signatureImageUrl}
                  alt={`Official authorized signature of ${auth.signatureName || "Editor-in-Chief"}`}
                  loading="lazy"
                  decoding="async"
                  className="h-10 max-w-[150px] object-contain"
                />
              ) : (
                <p
                  className="text-slate-700"
                  style={{ fontFamily: "'Dancing Script', 'Brush Script MT', 'Segoe Script', cursive", fontSize: 20 }}
                >
                  {auth.signatureName || "Editor-in-Chief"}
                </p>
              )}
              <div className="w-36 border-b border-slate-400" />
              <p className="mt-1 text-[10px] font-black uppercase italic tracking-[0.16em] text-slate-900">
                {auth.signatureLabel || "AUTHORIZED SIGNATURE"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom accent bar ── */}
        <div className="absolute bottom-0 left-0 right-0 flex h-[6px]">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-[#1a2040]" />
        </div>
      </div>
    </div>
  );
}