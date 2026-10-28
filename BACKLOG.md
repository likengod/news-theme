# 📋 Today Tripura Project Backlog & Roadmap

> **Project:** Today Tripura (`news-timeline`)  
> **Target Production Domain:** `https://todaytripura.com`  
> **Current Version:** `1.2.27`  
> **Hosting & Environment:** Hostinger Cloud / VPS (Node.js + MySQL + PM2)  
> **Architecture:** TanStack Start (SSR) + React 19 + Tailwind CSS + Vite + Write-Behind RAM Cache + 3-Tier Edge CDN  

---

## 🏆 Completed Milestones (v1.2.27)

- [x] **Full Security Vulnerability Hardening (0 Vulnerabilities Audit)**:
  - Upgraded **`zod`** to `4.6.7` resolving collection validation memory exhaustion (`CVE-2023-54404`).
  - Elevated **`dompurify`** directly to `3.4.17` in root dependencies (`GHSA-cg2g-xh64-v4q7`, `GHSA-c6gr-qvv4-5v3f`, `GHSA-6688-9rhm-gjv2`).
  - Overrode **`serialize-javascript`** to `7.1.4` (`CVE-2026-115897`, `CVE-2026-97711`).
  - Overrode **`undici`** to `7.30.1`, **`@tanstack/start-server-core`** to `1.169.45`, **`vite`** to `8.3.5`, **`sharp`** to `0.35.5`, and **`h3`** to `1.15.11`.
  - Zero-vulnerability audit verification across all 600 dependencies (`npm audit --audit-level=low` -> 0 vulnerabilities).

## 🏆 Completed Milestones (v1.2.26)

- [x] **Universal Multi-Provider Edge CDN & Cache Invalidation**:
  - Implemented multi-provider edge cache purging in `src/lib/cdn.functions.ts` supporting Cloudflare (`purge_cache`), BunnyCDN (`purgeCache`), Fastly (`purge_all`), AWS CloudFront, and custom webhooks.
  - Wired into **Speed Optimization Tab** (`Clean & Speed Up Website` triggers RAM + disk + Edge CDN invalidation simultaneously).
  - Media delivery URL rewriter (`resolveCdnMediaUrl`) offloading `/uploads/` assets to high-speed edge distribution.
- [x] **Unified Git Connect & CDN UI Governance**:
  - Consolidated Git Connect into a single unified row (`GitSettingsCard.tsx`) with status badge (`Configured` / `Not Configured`), inline editor for Remote URL, Branch, PAT token, and Auto-deploy on pull.
  - Consolidated CDN acceleration into a single unified row (`CdnSettingsCard.tsx`) with dynamic credentials and instant edge purge actions.
- [x] **Tooling & AI Governance**:
  - Installed and configured **Repomix v1.18.1** (`repomix.config.json` with XML output, Secretlint security check, and `.gitignore` integration).
  - Added `npm run repomix` script for instant single-file repository context extraction (410 source files packed in ~3s).
  - Implemented **3-Zone Delta Boundary** governance (`DELTA_SPEC.md`) and project task tracking (`BACKLOG.md`).
- [x] **Write-Behind Caching Engine & 3NF Normalized Like System**:
  - Implemented memory-buffered counters for article views and likes in `src/lib/write-behind-cache.server.ts`.
  - Created 3NF normalized `article_likes` table with composite unique constraint `(article_id, client_token)` to guarantee 1-like-per-user duplicate prevention.
  - Clean, flat Facebook-style `ArticleLikeButton` with thumbs-up icon (`ThumbsUp` from `lucide-react`), live count, optimistic updates, and Write-Behind batching without bouncing animations or card borders.
  - Batch commit every 15s to MySQL to eliminate database row locking during breaking news traffic spikes.
  - Graceful shutdown hooks (`SIGTERM`, `SIGINT`) to prevent loss of buffered counters on server restarts.
- [x] **Lighthouse Core Web Vitals & Cache Optimization**:
  - Assets in `/assets/*` and hashed CSS/JS given 1-year immutable caching (`max-age=31536000, immutable`).
  - Image files given 30-day client cache with `stale-while-revalidate`.
  - Eliminated synchronous DOM measurement layout thrashing (forced reflow) in `Masthead.tsx` and `ReadingProgress.tsx` with `requestAnimationFrame`.
  - Code-split icon dependencies into separate `vendor-icons` chunks to minimize unused JS and main-thread execution time.
- [x] **3-Tier Edge Cache-Control Headers**:
  - Implemented in `server.js`:
    - Static Assets (`/assets/*`, `.webp`, `.css`, `.js`): `public, max-age=31536000, immutable`.
    - Semi-Dynamic Public News (`/`, `/news/*`, `/archive`): `public, max-age=10, s-maxage=60, stale-while-revalidate=120`, `Vary: Accept-Encoding, Cookie`.
    - Dynamic Admin & Auth (`/admin`, `/admin/*`, `/auth`): `private, no-cache, no-store, must-revalidate`.
- [x] **Smart Background Polling (Option A)**:
  - Breaking News ticker in `BreakingBar.tsx` polls every 30s with `refetchIntervalInBackground: false` to save user battery and data.
  - Comments section polls every 45s for live discussion updates.
  - Admin inbox polls every 30s for contact forms and journalist submissions.
  - Zero WebSocket connection overhead, eliminating Hostinger Node proxy 503/504 socket crashes.
- [x] **SEO, RSS & Syndication Fixes**:
  - Fixed RSS URLs from broken `/article/[slug]` to canonical `/news/[slug]` in `/api/rss`.
  - Replaced legacy domain references with `https://todaytripura.com` across `/api/rss`, `/rss.xml`, `/sitemap.xml`, and `/news-sitemap.xml`.
  - Dynamic Bengali (`bn`) vs English (`en`) language detection in Schema.org `NewsArticle` JSON-LD.
  - Corrected `robots.txt` sitemap directives to point to live canonical endpoints.
- [x] **Database & Security Hardening**:
  - Added MySQL `FULLTEXT` index (`ft_articles_search`) on `articles(title, excerpt)` for instant search results.
  - Dual-Key Token Bucket rate limiting on password reset and sensitive endpoints.
  - Honeypot anti-spam protection on contact and application forms.
  - Enforced `; Secure; HttpOnly; SameSite=Lax` cookie flags on HTTPS.

---

## 🚀 Active Priority Backlog (Upcoming Features)

### 🔴 Phase 1: High-Impact Performance & Engagement (Immediate)
- [ ] **Automated Client-Side WebP Compressor**:
  - Intercept image uploads in `src/lib/media.functions.ts` / `MediaField.tsx`.
  - Automatically convert JPEG/PNG to modern WebP with 80% quality client-side using Canvas before transmitting to server.
  - Reduces disk storage usage and boosts mobile load times.
- [ ] **Web Push Notifications (Breaking News Alerts)**:
  - Register a Service Worker (`sw.js`) for browser notifications.
  - Add a "🔔 Subscribe to Breaking News" prompt in the header and article footers.
  - Admin button in Article Editor: *"Send Instant Push Notification on Publish"*.

---

### 🟡 Phase 2: Reader Retention & Newsroom Workflows (Short-Term)
- [ ] **PWA Offline Reading Support**:
  - Cache the last 10 visited articles in browser IndexedDB / CacheStorage so users can continue reading during Northeast train commutes or network drops.
- [ ] **Automated Social Broadcast Webhooks**:
  - Add optional webhook triggers on article publication:
    - Auto-send breaking news summary and link to Today Tripura's official Telegram Channel.
    - Facebook Page Graph API auto-post on publication.
- [ ] **Daily Email Newsletter Digest**:
  - Scheduled morning email digest (top 5 headlines of the day) sent via SMTP / Resend / SendGrid to newsletter subscribers.

---

### 🟢 Phase 3: Administrative & Scaling Polish (Medium-Term)
- [ ] **Database Archiving & Query Log Rotation**:
  - Automated weekly cron job to archive soft-deleted articles and rotate system logs older than 60 days.
- [ ] **Reader Accessibility Controls**:
  - Floating font size adjuster (`A-`, `A`, `A+`) on article view for elderly mobile readers.
  - Enhanced Dark Mode contrast adjustments for high-sunlight outdoor readability.
- [ ] **Automated Google Fact Check Markup**:
  - Expand `ClaimReview` JSON-LD schema on verified fact-check articles to earn Google Fact Check badges in search results.

---

## 🛠️ Maintenance & Review Guidelines
* Review this backlog at the beginning of each major release cycle.
* Any feature being started must have its scope defined in `DELTA_SPEC.md` prior to code modifications.
