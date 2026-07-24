import React from 'react';
import { Card, IntegrationField, Toggle, type FieldDef, GuideList } from '@/components/admin/settings/SettingsHelpers';
import { ShieldCheck, Crown, Sparkles, GitBranch } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';

  const integrationFields: FieldDef[] = [
    {
      key: "googleAnalyticsId",
      label: "Google Analytics (GA4) Measurement ID",
      hint: "Format: G-XXXXXXXXXX â€” from analytics.google.com â€” Admin â€” Data Streams.",
      placeholder: "G-XXXXXXXXXX",
      guideUrl: "https://analytics.google.com/"
    },
    {
      key: "googleTagManagerId",
      label: "Google Tag Manager Container ID",
      hint: "Format: GTM-XXXXXX â€” from tagmanager.google.com.",
      placeholder: "GTM-XXXXXX",
      guideUrl: "https://tagmanager.google.com/"
    },
    {
      key: "googleAdsenseId",
      label: "Google AdSense Publisher ID",
      hint: "Format: ca-pub-XXXXXXXXXXXXXXXX â€” from your AdSense account.",
      placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
      guideUrl: "https://www.google.com/adsense/"
    },
    {
      key: "facebookPixelId",
      label: "Facebook Pixel ID",
      hint: "Numeric Pixel ID from Meta Events Manager.",
      placeholder: "1234567890",
      guideUrl: "https://business.facebook.com/events_manager"
    },
    {
      key: "firebaseConfigJson",
      label: "Firebase config JSON",
      hint: "Paste the firebaseConfig object from Firebase Console â€” Project settings.",
      textarea: true,
      placeholder: '{"apiKey":"...","projectId":"...","appId":"..."}',
      guideUrl: "https://console.firebase.google.com/"
    },
  ];

  const paymentFields: FieldDef[] = [
    { key: "razorpayKeyId", label: "Razorpay Key ID", hint: "From Razorpay Dashboard" },
    { key: "razorpayKeySecret", label: "Razorpay Key Secret", hint: "Keep this secure" },
    { key: "stripePublicKey", label: "Stripe Publishable Key", hint: "Starts with pk_" },
    { key: "stripeSecretKey", label: "Stripe Secret Key", hint: "Starts with sk_" },
  ];

  const aiFields: FieldDef[] = [
    { key: "geminiApiKey", label: "Google Gemini API Key", hint: "Required for AI Assistant. Get from Google AI Studio.", guideUrl: "https://aistudio.google.com/" },
    { key: "openAiApiKey", label: "OpenAI API Key (Optional fallback)", hint: "Get from platform.openai.com.", guideUrl: "https://platform.openai.com/" },
    { key: "deepseekApiKey", label: "DeepSeek API Key (Optional fallback)", hint: "Get from platform.deepseek.com.", guideUrl: "https://platform.deepseek.com/" },
    { key: "kimiApiKey", label: "Kimi API Key (Optional fallback)", hint: "Get from Moonshot AI platform.", guideUrl: "https://platform.moonshot.cn/" },
  ];
  
  const authFields: FieldDef[] = [
    {
      key: "googleClientId",
      label: "Google Sign-In",
      hint: "Create OAuth 2.0 Web application Client ID.",
      guideUrl: "https://console.cloud.google.com/apis/credentials",
      placeholder: "1234567890-abcdefg.apps.googleusercontent.com",
      toggleKey: "authGoogleEnabled",
      toggleLabel: "Enable Google on auth page",
    },
    {
      key: "facebookAppId",
      label: "Facebook Sign-In",
      hint: "Create app (Consumer) with Facebook Login product.",
      guideUrl: "https://developers.facebook.com/apps",
      placeholder: "1234567890123456",
      toggleKey: "authFacebookEnabled",
      toggleLabel: "Enable Facebook on auth page",
    },
    {
      key: "linkedinClientId",
      label: "LinkedIn Sign-In",
      hint: "Create app with Sign In with LinkedIn product.",
      guideUrl: "https://www.linkedin.com/developers/apps",
      placeholder: "86abcde1234567",
      toggleKey: "authLinkedinEnabled",
      toggleLabel: "Enable LinkedIn on auth page",
    },
  ];

  const verificationFields: FieldDef[] = [
    {
      key: "googleSiteVerification",
      label: "Google Search Console",
      hint: "Paste the content value from the HTML tag method in Search Console.",
      placeholder: "abcDEF123...",
      guideUrl: "https://search.google.com/search-console"
    },
    {
      key: "bingSiteVerification",
      label: "Bing Webmaster (msvalidate.01)",
      hint: "Content value from Bing Webmaster Tools â€” Add Site â€” Meta tag.",
      guideUrl: "https://www.bing.com/webmasters"
    },
    {
      key: "facebookDomainVerification",
      label: "Facebook Domain Verification",
      hint: "From Meta Business Suite â€” Brand Safety â€” Domains.",
      guideUrl: "https://business.facebook.com/settings/owned-domains"
    },
    {
      key: "pinterestSiteVerification",
      label: "Pinterest (p:domain_verify)",
      hint: "From Pinterest Business â€” Claim website.",
      guideUrl: "https://www.pinterest.com/settings/claim/"
    },
    {
      key: "yandexVerification",
      label: "Yandex Webmaster",
      hint: "From Yandex Webmaster â€” Site rights.",
      guideUrl: "https://webmaster.yandex.com/"
    },
  ];

  const socialMediaFields: FieldDef[] = [
    { key: "facebook", label: "Facebook Page URL", placeholder: "https://facebook.com/..." },
    { key: "twitter", label: "Twitter / X Profile", placeholder: "https://twitter.com/..." },
    { key: "instagram", label: "Instagram Profile", placeholder: "https://instagram.com/..." },
    { key: "pinterest", label: "Pinterest Profile", placeholder: "https://pinterest.com/..." },
    { key: "tiktok", label: "TikTok Profile", placeholder: "https://tiktok.com/..." },
    { key: "linkedin", label: "LinkedIn Page", placeholder: "https://linkedin.com/..." },
    { key: "youtube", label: "YouTube Channel", placeholder: "https://youtube.com/..." },
    { key: "whatsapp", label: "WhatsApp Channel", placeholder: "https://whatsapp.com/..." },
    { key: "telegram", label: "Telegram Channel", placeholder: "https://t.me/..." },
    { key: "googleNews", label: "Google News Publication URL", placeholder: "https://news.google.com/..." },
  ];



export function IntegrationsTab({ s, update }: { s: any; update: any }) {
  return (
    <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
            <Card
              title="Analytics & Marketing"
              subtitle="Paste IDs only â€” scripts load automatically on every page."
            >
              <div className="space-y-3">
                {integrationFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>
            
            <Card
              title="AI Providers"
              subtitle="Configure your API keys for the AI Content Assistant."
            >
              <div className="space-y-3">
                {aiFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>

            <Card
              title="Social Media Profiles"
              subtitle="Link your official social media pages to display on the site footer."
            >
              <div className="grid gap-3 lg:grid-cols-2">
                {socialMediaFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>

            <Card
              title="Search Engine & Social Verification"
              subtitle="Paste the meta tag content value â€” we inject the <meta> tag for you."
            >
              <div className="mb-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                Tip: choose the <strong>HTML tag</strong> verification method and paste only the
                <code className="mx-1 rounded bg-white px-1">content="..."</code> value here.
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {verificationFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>

            <Card
              title="Payment Gateways"
              subtitle="Configure your API keys for accepting payments."
            >
              <div className="space-y-3">
                {paymentFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>

            <Card
              title="Login Providers"
              subtitle="Configure OAuth Client IDs. Secrets must be set in the backend environment."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {authFields.map((f) => (
                  <IntegrationField key={f.key} f={f} s={s} update={update} />
                ))}
              </div>
            </Card>

            {/* Git Connect / CI-CD */}
            <Card
              title="Git Connect / CI-CD"
              subtitle="Connect your Git repository for continuous deployment. Manage deployments from Admin â†’ Website Update."
            >
              <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10">
                  <GitBranch className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">CI/CD Pipeline</p>
                  <p className="text-xs text-slate-300">Pull â†’ Build â†’ Deploy from the admin panel</p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Git Remote URL</label>
                <input
                  value={s.gitRemoteUrl || ""}
                  placeholder="https://github.com/user/repo.git"
                  onChange={(e) => update("gitRemoteUrl", e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">HTTPS or SSH URL of your repository.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Branch</label>
                <input
                  value={s.gitBranch || ""}
                  placeholder="main"
                  onChange={(e) => update("gitBranch", e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">Branch to pull from and deploy.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Personal Access Token (PAT)</label>
                <input
                  type="password"
                  value={s.gitAccessToken || ""}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  onChange={(e) => update("gitAccessToken", e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
                  autoComplete="off"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Required for private repos. Generate from GitHub â†’ Settings â†’ Developer settings â†’ Personal access tokens.
                </p>
              </div>

              <Toggle
                label="Auto-deploy on pull"
                checked={s.gitAutoDeploy}
                onChange={(v) => update("gitAutoDeploy", v)}
                hint="When enabled, pulling latest code will automatically trigger a production build."
              />

              <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                <strong>Security note:</strong> Build and deploy commands run on the server. Only admin users can trigger deployments from <strong>Admin â†’ Website Update</strong>.
              </div>
            </Card>

            <Card title="CI/CD Setup Guide">
              <GuideList
                items={[
                  { label: "GitHub â€” Generate Personal Access Token", url: "https://github.com/settings/tokens" },
                  { label: "GitLab â€” Generate Access Token", url: "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html" },
                  { label: "Bitbucket â€” App Passwords", url: "https://bitbucket.org/account/settings/app-passwords/" },
                  { label: "GitHub â€” Creating a Repository", url: "https://docs.github.com/en/get-started/quickstart/create-a-repo" },
                  { label: "GitHub Actions â€” CI/CD", url: "https://docs.github.com/en/actions" },
                  { label: "Vercel â€” Git Integration", url: "https://vercel.com/docs/git" },
                  { label: "Netlify â€” Build & Deploy", url: "https://docs.netlify.com/configure-builds/overview/" },
                  { label: "Cloudflare Pages â€” Git Integration", url: "https://developers.cloudflare.com/pages/get-started/git-integration/" },
                ]}
              />
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">How it works</p>
                <ol className="list-decimal space-y-1.5 pl-4 text-xs text-slate-700">
                  <li>Paste your Git remote URL and branch above, then <strong>Save changes</strong>.</li>
                  <li>Go to <strong>Admin â†’ Website Update</strong> to view repo status.</li>
                  <li>Click <strong>Pull Latest</strong> to fetch new commits from your remote.</li>
                  <li>Click <strong>Build & Deploy</strong> to compile and deploy the production build.</li>
                  <li>View deployment history and build logs right from the admin panel.</li>
                  <li>View deployment history and build logs right from the admin panel.</li>
                </ol>
              </div>
            </Card>
          </div>
    </div>
  );
}