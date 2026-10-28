import React, { useState } from "react";
import {
  GitBranch,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Edit2,
  Eye,
  EyeOff,
  GitPullRequest,
} from "lucide-react";
import { toast } from "sonner";
import { type SiteSettings, saveSettings } from "@/lib/site-content";
import { Card, Toggle, GuideList } from "@/components/admin/settings/SettingsHelpers";

interface GitSettingsCardProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function GitSettingsCard({ s, update }: GitSettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Local state for editing all Git fields at once
  const [localRemoteUrl, setLocalRemoteUrl] = useState<string>(s.gitRemoteUrl || "");
  const [localBranch, setLocalBranch] = useState<string>(s.gitBranch || "main");
  const [localAccessToken, setLocalAccessToken] = useState<string>(s.gitAccessToken || "");
  const [localAutoDeploy, setLocalAutoDeploy] = useState<boolean>(!!s.gitAutoDeploy);

  const isConfigured = Boolean(s.gitRemoteUrl && s.gitRemoteUrl.trim());

  const handleSave = async () => {
    update("gitRemoteUrl", localRemoteUrl);
    update("gitBranch", localBranch);
    update("gitAccessToken", localAccessToken);
    update("gitAutoDeploy", localAutoDeploy);

    const newSettings: SiteSettings = {
      ...s,
      gitRemoteUrl: localRemoteUrl,
      gitBranch: localBranch,
      gitAccessToken: localAccessToken,
      gitAutoDeploy: localAutoDeploy,
    };

    try {
      await saveSettings(newSettings);
      toast.success("Git CI/CD settings saved successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save Git settings");
    }
  };

  const handleCancel = () => {
    setLocalRemoteUrl(s.gitRemoteUrl || "");
    setLocalBranch(s.gitBranch || "main");
    setLocalAccessToken(s.gitAccessToken || "");
    setLocalAutoDeploy(!!s.gitAutoDeploy);
    setIsEditing(false);
  };

  return (
    <Card
      title="Git Connect / CI-CD"
      subtitle="Connect your Git repository for continuous deployment. Manage deployments from Admin → Website Update."
    >
      <div className="space-y-3">
        {/* Single unified Git Repository row */}
        <div className="rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-slate-600" />
                Git Repository (GitHub / GitLab / Bitbucket)
              </p>
              <div className="flex items-center gap-2">
                {isConfigured ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <XCircle className="h-3 w-3" /> Not Configured
                  </span>
                )}

                <span className="text-slate-300">•</span>
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                >
                  Setup Guide <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Edit2 className="h-3 w-3" />
                  {isConfigured ? "Update" : "Setup"}
                </button>
              )}
            </div>
          </div>

          {/* Collapsed summary when not editing */}
          {!isEditing && (
            <div className="mt-1.5 text-[11px] text-slate-500">
              {isConfigured ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    Repo: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700">{s.gitRemoteUrl}</code>
                  </span>
                  <span>•</span>
                  <span>
                    Branch: <strong className="text-slate-700">{s.gitBranch || "main"}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Token: <span className="text-slate-600">{s.gitAccessToken ? "••••••••" : "Public repo"}</span>
                  </span>
                  <span>•</span>
                  <span>
                    Auto-deploy:{" "}
                    <strong className={s.gitAutoDeploy ? "text-emerald-600" : "text-slate-500"}>
                      {s.gitAutoDeploy ? "On" : "Off"}
                    </strong>
                  </span>
                </div>
              ) : (
                <p>No repository connected yet. Click Setup to connect GitHub, GitLab, or any Git remote.</p>
              )}
            </div>
          )}

          {/* Expanded unified editor */}
          {isEditing && (
            <div className="mt-3 space-y-3 rounded-md bg-slate-50/80 p-3 border border-slate-200/80">
              {/* Field 1: Remote URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Git Remote URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={localRemoteUrl}
                  placeholder="https://github.com/username/repository.git"
                  onChange={(e) => setLocalRemoteUrl(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  HTTPS clone URL of your Git repository (GitHub, GitLab, Bitbucket, self-hosted).
                </p>
              </div>

              {/* Field 2: Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Deployment Branch
                </label>
                <input
                  type="text"
                  value={localBranch}
                  placeholder="main"
                  onChange={(e) => setLocalBranch(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Branch to pull from and deploy (default: <code className="font-mono">main</code>).
                </p>
              </div>

              {/* Field 3: PAT */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Personal Access Token (PAT)
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Generate GitHub Token <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showToken ? "text" : "password"}
                    value={localAccessToken}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (optional for public repos)"
                    onChange={(e) => setLocalAccessToken(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs focus:border-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title={showToken ? "Hide token" : "Show token"}
                  >
                    {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Required only for private repositories. For public repositories, leave this blank.
                </p>
              </div>

              {/* Field 4: Auto-deploy toggle */}
              <div className="pt-2 border-t border-slate-200">
                <Toggle
                  label="Auto-deploy on pull"
                  checked={localAutoDeploy}
                  onChange={(v) => setLocalAutoDeploy(v)}
                  hint="When enabled, pulling latest code will automatically trigger a production build."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Save Git Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
          <strong>Security note:</strong> Build and deploy commands run on the server. Only admin
          users can trigger deployments from <strong>Admin → Website Update</strong>.
        </div>

        {/* CI/CD Documentation Guides Collapsible */}
        <details className="rounded-md border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-700">
          <summary className="font-semibold text-slate-700 cursor-pointer select-none">
            View CI/CD Guides & Documentation
          </summary>
          <div className="mt-2.5 space-y-2.5">
            <GuideList
              items={[
                {
                  label: "GitHub - Generate Personal Access Token",
                  url: "https://github.com/settings/tokens",
                },
                {
                  label: "GitLab - Generate Access Token",
                  url: "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html",
                },
                {
                  label: "Bitbucket - App Passwords",
                  url: "https://bitbucket.org/account/settings/app-passwords/",
                },
                {
                  label: "GitHub - Creating a Repository",
                  url: "https://docs.github.com/en/get-started/quickstart/create-a-repo",
                },
                { label: "GitHub Actions - CI/CD", url: "https://docs.github.com/en/actions" },
                { label: "Vercel - Git Integration", url: "https://vercel.com/docs/git" },
                {
                  label: "Netlify - Build & Deploy",
                  url: "https://docs.netlify.com/configure-builds/overview/",
                },
                {
                  label: "Cloudflare Pages - Git Integration",
                  url: "https://developers.cloudflare.com/pages/get-started/git-integration/",
                },
              ]}
            />
            <div className="rounded border border-slate-200 bg-white p-2.5 text-[11px] text-slate-600">
              <ol className="list-decimal space-y-1 pl-4">
                <li>Paste Git remote URL and branch above, then <strong>Save</strong>.</li>
                <li>Go to <strong>Admin → Website Update</strong> to view repo status.</li>
                <li>Click <strong>Pull Latest</strong> to fetch new commits from remote.</li>
                <li>Click <strong>Build & Deploy</strong> to compile and deploy production build.</li>
              </ol>
            </div>
          </div>
        </details>
      </div>
    </Card>
  );
}
