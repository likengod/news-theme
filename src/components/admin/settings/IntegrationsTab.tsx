import React from "react";
import {
  Card,
  IntegrationField,
  Toggle,
  type FieldDef,
  GuideList,
} from "@/components/admin/settings/SettingsHelpers";
import { ShieldCheck, Crown, Sparkles, GitBranch } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CdnSettingsCard } from "./CdnSettingsCard";

const integrationFields: FieldDef[] = [
  {
    key: "googleAnalyticsId",
    label: "Google Analytics (GA4) Measurement ID",
    hint: "Format: G-XXXXXXXXXX - from analytics.google.com — Admin — Data Streams.",
    placeholder: "G-XXXXXXXXXX",
    guideUrl: "https://analytics.google.com/",
  },
  {
    key: "googleTagManagerId",
    label: "Google Tag Manager Container ID",
    hint: "Format: GTM-XXXXXX - from tagmanager.google.com.",
    placeholder: "GTM-XXXXXX",
    guideUrl: "https://tagmanager.google.com/",
  },
  {
    key: "googleAdsenseId",
    label: "Google AdSense Publisher ID",
    hint: "Format: ca-pub-XXXXXXXXXXXXXXXX - from your AdSense account.",
    placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
    guideUrl: "https://www.google.com/adsense/",
  },
  {
    key: "facebookPixelId",
    label: "Facebook Pixel ID",
    hint: "Numeric Pixel ID from Meta Events Manager.",
    placeholder: "1234567890",
    guideUrl: "https://business.facebook.com/events_manager",
  },
  {
    key: "firebaseConfigJson",
    label: "Firebase config JSON",
    hint: "Paste the firebaseConfig object from Firebase Console - Project settings.",
    textarea: true,
    placeholder: '{"apiKey":"...","projectId":"...","appId":"..."}',
    guideUrl: "https://console.firebase.google.com/",
  },
];

const paymentFields: FieldDef[] = [
  { key: "razorpayKeyId", label: "Razorpay Key ID", hint: "From Razorpay Dashboard" },
  { key: "razorpayKeySecret", label: "Razorpay Key Secret", hint: "Keep this secure" },
  { key: "stripePublicKey", label: "Stripe Publishable Key", hint: "Starts with pk_" },
  { key: "stripeSecretKey", label: "Stripe Secret Key", hint: "Starts with sk_" },
];

const aiFields: FieldDef[] = [
  {
    key: "geminiApiKey",
    label: "Google Gemini API Key",
    hint: "Required for AI Assistant. Get from Google AI Studio.",
    guideUrl: "https://aistudio.google.com/",
  },
  {
    key: "googleFactCheckApiKey",
    label: "Google Fact Check Tools API Key",
    hint: "For /fact-checking-policy Live News Scanner. (Defaults to Gemini API Key if left blank).",
    guideUrl: "https://console.cloud.google.com/apis/library/factchecktools.googleapis.com",
  },
  {
    key: "openAiApiKey",
    label: "OpenAI API Key (Optional fallback)",
    hint: "Get from platform.openai.com.",
    guideUrl: "https://platform.openai.com/",
  },
  {
    key: "deepseekApiKey",
    label: "DeepSeek API Key (Optional fallback)",
    hint: "Get from platform.deepseek.com.",
    guideUrl: "https://platform.deepseek.com/",
  },
  {
    key: "kimiApiKey",
    label: "Kimi API Key (Optional fallback)",
    hint: "Get from Moonshot AI platform.",
    guideUrl: "https://platform.moonshot.cn/",
  },
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
    guideUrl: "https://search.google.com/search-console",
  },
  {
    key: "bingSiteVerification",
    label: "Bing Webmaster (msvalidate.01)",
    hint: "Content value from Bing Webmaster Tools - Add Site - Meta tag.",
    guideUrl: "https://www.bing.com/webmasters",
  },
  {
    key: "facebookDomainVerification",
    label: "Facebook Domain Verification",
    hint: "From Meta Business Suite - Brand Safety - Domains.",
    guideUrl: "https://business.facebook.com/settings/owned-domains",
  },
  {
    key: "pinterestSiteVerification",
    label: "Pinterest (p:domain_verify)",
    hint: "From Pinterest Business - Claim website.",
    guideUrl: "https://www.pinterest.com/settings/claim/",
  },
  {
    key: "yandexVerification",
    label: "Yandex Webmaster",
    hint: "From Yandex Webmaster - Site rights.",
    guideUrl: "https://webmaster.yandex.com/",
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
  {
    key: "googleNews",
    label: "Google News Publication URL",
    placeholder: "https://news.google.com/...",
  },
];

const gitFields: FieldDef[] = [
  {
    key: "gitRemoteUrl",
    label: "Git Remote URL",
    hint: "HTTPS URL of your upstream update repository.",
    placeholder: "https://github.com/likengod/news-theme.git",
    guideUrl: "https://github.com/likengod/news-theme",
    isSecret: false,
  },
  {
    key: "gitBranch",
    label: "Deployment Branch",
    hint: "Branch to pull from and deploy (default: main).",
    placeholder: "main",
    isSecret: false,
  },
  {
    key: "gitAccessToken",
    label: "Personal Access Token (PAT)",
    hint: "Required only for private repositories. For public repos, leave empty.",
    placeholder: "ghp_xxxxxxxxxxxx",
    guideUrl: "https://github.com/settings/tokens",
    isSecret: true,
  },
];

export function IntegrationsTab({ s, update }: { s: any; update: any }) {
  const canSeeGitConfig = true;
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Analytics & Marketing"
          subtitle="Paste IDs only - scripts load automatically on every page."
        >
          <div className="space-y-3">
            {integrationFields.map((f) => (
              <IntegrationField key={f.key} f={f} s={s} update={update} />
            ))}
          </div>
        </Card>

        <Card title="AI Providers" subtitle="Configure your API keys for the AI Content Assistant.">
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
          subtitle="Paste the meta tag content value - we inject the <meta> tag for you."
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

        <Card title="Payment Gateways" subtitle="Configure your API keys for accepting payments.">
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
          subtitle="Connect your Git repository for continuous deployment. Manage deployments from Admin &rarr; Website Update."
        >
          <div className="space-y-3">
            {gitFields.map((f) => (
              <IntegrationField key={f.key} f={f} s={s} update={update} />
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <Toggle
              label="Auto-deploy on pull"
              checked={s.gitAutoDeploy}
              onChange={(v) => update("gitAutoDeploy", v)}
              hint="When enabled, pulling latest code will automatically trigger a production build."
            />

            <div className="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
              <strong>Security note:</strong> Build and deploy commands run on the server. Only admin
              users can trigger deployments from <strong>Admin &rarr; Website Update</strong>.
            </div>

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
              </div>
            </details>
          </div>
        </Card>

        {/* CDN & Edge Cache Acceleration (Placed right side of Git Connect) */}
        <CdnSettingsCard s={s} update={update} />
      </div>
    </div>
  );
}
