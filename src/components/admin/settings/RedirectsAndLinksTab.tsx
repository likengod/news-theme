import React, { useEffect, useState } from "react";
import { Plus, Trash2, RefreshCw, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getRedirectRulesServer,
  saveRedirectRulesServer,
  scanBrokenLinksServer,
  fixBrokenLinkServer,
  type RedirectRule,
  type BrokenLinkItem,
} from "@/lib/site-content";
import { Card } from "./SettingsHelpers";

export function RedirectsAndLinksTab() {
  const [rules, setRules] = useState<RedirectRule[]>([]);
  const [newSource, setNewSource] = useState("");
  const [newDestination, setNewDestination] = useState("");
  
  const [scanning, setScanning] = useState(false);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLinkItem[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);

  useEffect(() => {
    getRedirectRulesServer()
      .then((data) => setRules(data))
      .catch(() => {});
  }, []);

  const handleAddRedirect = async () => {
    if (!newSource || !newDestination) {
      return toast.error("Both source and destination URLs are required");
    }
    
    let src = newSource.trim();
    if (!src.startsWith("/") && !src.startsWith("http")) {
      src = "/" + src;
    }
    let dest = newDestination.trim();
    if (!dest.startsWith("/") && !dest.startsWith("http")) {
      dest = "/" + dest;
    }

    const newRule: RedirectRule = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      source: src,
      destination: dest,
      hits: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRule, ...rules];
    setRules(updated);
    
    try {
      await saveRedirectRulesServer({ data: updated });
      toast.success("Redirect rule added successfully!");
      setNewSource("");
      setNewDestination("");
    } catch {
      toast.error("Failed to save redirect rules to database");
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    try {
      await saveRedirectRulesServer({ data: updated });
      toast.success("Redirect rule deleted");
    } catch {
      toast.error("Failed to update database");
    }
  };

  const handleScanLinks = async () => {
    setScanning(true);
    setHasScanned(false);
    try {
      const result = await scanBrokenLinksServer();
      setBrokenLinks(result);
      setHasScanned(true);
      toast.success(`Scan completed. Found ${result.length} broken links.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to scan database for broken links");
    } finally {
      setScanning(false);
    }
  };

  const handleAutoFix = async (item: BrokenLinkItem) => {
    if (!item.suggestedFix) {
      return toast.error("No correction suggested for this link");
    }
    setFixingId(item.id);
    try {
      await fixBrokenLinkServer({
        data: {
          articleId: item.articleId,
          brokenUrl: item.brokenUrl,
          correctedUrl: item.suggestedFix,
        }
      });
      toast.success("Link auto-corrected in database!");
      setBrokenLinks((prev) => prev.filter((b) => b.id !== item.id));
    } catch (err: any) {
      toast.error(err.message || "Failed to correct link");
    } finally {
      setFixingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Custom URL Redirect Manager"
          subtitle="Configure 301 (Permanent) redirects from old or broken URLs to active pages. Useful for SEO migrations."
        >
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Redirect Rule</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Source Path (e.g. /old-slug)</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="/old-page-name"
                  className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Destination (e.g. /about)</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="/news/new-slug"
                  className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddRedirect}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" /> Add redirect
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-2">Source Path</th>
                  <th className="px-4 py-2">Redirects To</th>
                  <th className="px-4 py-2 text-center">Hits</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {rules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      No redirects defined. Add one above.
                    </td>
                  </tr>
                ) : (
                  rules.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-mono text-[11px] max-w-[150px] truncate" title={r.source}>
                        {r.source}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px] max-w-[150px] truncate" title={r.destination}>
                        {r.destination}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold text-slate-950 tabular-nums">
                        {r.hits || 0}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleDeleteRedirect(r.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete redirect"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Broken Link Scanner & Auto-Fixer"
          subtitle="Scan your published articles for broken internal links and auto-correct them to active pages."
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleScanLinks}
              disabled={scanning}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Scanning Database...
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" /> Scan Website Links
                </>
              )}
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-2">Article / Location</th>
                  <th className="px-4 py-2">Broken Link URL</th>
                  <th className="px-4 py-2">Suggested Fix</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {!hasScanned && !scanning ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Click the scan button above to detect broken links in articles.
                    </td>
                  </tr>
                ) : scanning ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      <RefreshCw className="mx-auto h-5 w-5 animate-spin text-slate-400 mb-2" />
                      Parsing content database...
                    </td>
                  </tr>
                ) : brokenLinks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-emerald-600 font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Perfect SEO Health! No broken links found.
                    </td>
                  </tr>
                ) : (
                  brokenLinks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 max-w-[160px] truncate" title={b.articleTitle}>
                          {b.articleTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {b.articleId}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-red-600 max-w-[150px] truncate" title={b.brokenUrl}>
                        {b.brokenUrl}
                      </td>
                      <td className="px-4 py-3">
                        {b.suggestedFix ? (
                          <span className="font-mono text-[11px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded" title={b.suggestedFix}>
                            {b.suggestedFix}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None found</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {b.suggestedFix ? (
                          <button
                            onClick={() => handleAutoFix(b)}
                            disabled={fixingId === b.id}
                            className="rounded bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                            {fixingId === b.id ? "Fixing..." : "Auto-Fix"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No suggestion</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default RedirectsAndLinksTab;
