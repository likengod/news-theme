import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck } from "lucide-react";
import {
  lookupJournalist,
  getJournalistPrivateStats,
  type JournalistLookup,
  type JournalistPrivateStats,
} from "@/lib/journalist.functions";
import { authClient } from "@/lib/auth-client";
import { loadSettings, isEnterpriseLicense, isEnterprisePlusLicense } from "@/lib/site-content";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { Footer } from "@/components/site/Footer";
import { PressCard } from "@/components/journalist/PressCard";
import { JournalistSearchBox } from "@/components/journalist/JournalistSearchBox";
import { JournalistStats } from "@/components/journalist/JournalistStats";

export const Route = createFileRoute("/verified-journalist")({
  validateSearch: (search: Record<string, unknown>) => ({
    id:
      (typeof search.id === "string"
        ? search.id
        : typeof search.uid === "string"
          ? search.uid
          : "") || "",
  }),
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: async ({ deps }) => {
    const queryId = deps.id?.trim();
    if (!queryId || queryId.length < 3) {
      return { queryId: "", initialResult: null as JournalistLookup | null };
    }
    try {
      const res = await lookupJournalist({ data: { publicUserId: queryId } });
      return { queryId, initialResult: res };
    } catch {
      return { queryId, initialResult: { found: false } as JournalistLookup };
    }
  },
  head: ({ loaderData }) => {
    const res = loaderData?.initialResult;
    const name = res && res.found ? res.displayName : "";
    return {
      meta: [
        {
          title: name
            ? `Verified Press: ${name} — News Theme`
            : "Verify a Journalist — News Theme",
        },
        {
          name: "description",
          content: name
            ? `Official press credential verification for accredited reporter ${name}.`
            : "Enter a Journalist ID or 10-digit User ID to verify an accredited News Theme reporter.",
        },
        { property: "og:title", content: name ? `Verified Journalist: ${name}` : "Verify a Journalist — News Theme" },
        {
          property: "og:description",
          content: name
            ? `View official verified credentials and press ID card for ${name}.`
            : "Instantly check if a byline belongs to a verified News Theme reporter.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: VerifiedPage,
});

function VerifiedPage() {
  const { queryId, initialResult } = Route.useLoaderData();
  const search = Route.useSearch();
  const lookup = useServerFn(lookupJournalist);
  const fetchPrivateStats = useServerFn(getJournalistPrivateStats);

  const [uid, setUid] = useState(queryId || search.id || "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<JournalistLookup | null>(initialResult ?? null);
  const [privateStats, setPrivateStats] = useState<JournalistPrivateStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(initialResult?.found === false);
  const [settings, setSettings] = useState(() => loadSettings());
  const siteSettings = useSiteSettings();
  const isEnterprise = isEnterpriseLicense(siteSettings || settings);
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings || settings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const doLookup = async (searchId: string) => {
    const target = searchId.trim();
    if (!target) return;
    setError(null);
    setResult(null);
    setPrivateStats(null);
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

  // Sync if search param in URL changes
  useEffect(() => {
    const currentId = (search.id || "").trim();
    if (currentId && currentId !== uid) {
      setUid(currentId);
      doLookup(currentId);
    }
  }, [search.id]);

  // Client fallback for direct window search query string
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get("id") || params.get("uid");
    if (paramId && !uid) {
      const cleanId = paramId.trim();
      setUid(cleanId);
      doLookup(cleanId);
    }
  }, []);

  // Fetch confidential metrics if viewer is authenticated as this journalist or as admin/editor
  useEffect(() => {
    let active = true;
    if (!result || !result.found || !result.userId) {
      setPrivateStats(null);
      return;
    }

    (async () => {
      try {
        const { data: sessionData } = await authClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        const stats = await fetchPrivateStats({
          data: {
            targetUserId: result.userId,
            sessionToken: token,
          },
        });
        if (active) setPrivateStats(stats);
      } catch {
        if (active) setPrivateStats({ authorized: false });
      }
    })();

    return () => {
      active = false;
    };
  }, [result]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLookup(uid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between">
      <main className="flex-1 flex flex-col justify-center py-10 sm:py-16 px-4 w-full">
        <div className="w-full max-w-4xl mx-auto my-auto">
          <section className="mx-auto max-w-3xl px-4 pb-8 sm:pb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#34c759]" /> Official Press Registry
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Verify a Journalist
            </h1>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
              Enter a reporter's <strong>Journalist ID</strong> (e.g.{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">TT-343AD0</code>),
              10-digit <strong>User ID</strong>, or registered <strong>Phone Number</strong> to view their official press card.
            </p>
          </section>

          <JournalistSearchBox
            uid={uid}
            setUid={setUid}
            onSubmit={onSubmit}
            busy={busy}
            error={error}
            notFound={notFound}
            settings={settings}
          />

      {/* Verified Press Card & Status Section */}
      {result && result.found && (
        <section className="mx-auto max-w-4xl px-4 pb-12">
          {/* Verification Status Alert Banner */}
          <JournalistStats
            result={result}
            privateStats={privateStats}
            isEnterprisePlus={isEnterprisePlus}
          />

          {/* Cards container */}
          <div className="w-full flex justify-center overflow-x-auto py-2">
            <PressCard data={result} settings={settings} />
          </div>
        </section>
      )}

          <section className="mx-auto max-w-3xl px-5 pt-2 pb-10">
            <p className="text-center text-xs text-slate-500">
              Spotted a fake byline?
              {settings.contactEmail ? (
                <>
                  {" "}Email{" "}
                  <a className="underline" href={`mailto:${settings.contactEmail}`}>
                    {settings.contactEmail}
                  </a>{" "}
                  — we investigate within 48 hours.
                </>
              ) : (
                " Please contact our office immediately to report it."
              )}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
