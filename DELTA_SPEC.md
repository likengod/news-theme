# 🛡️ Today Tripura Delta Specification & Engineering Guardrails

This document establishes the safety contracts, change boundaries, and verification workflows for **Today Tripura** (`todaytripura.com`). All developers, engineers, and AI coding assistants must adhere to these rules before modifying any code.

---

## 🏗️ 1. The 3-Zone Delta Boundary System

To prevent regressions, broken database connections, or production downtime on Hostinger, the repository is split into **three strict zones**:

```
+--------------------------------------------------------------------------+
|  ZONE 1: PROTECTED (LOCKED VAULT)                                        |
|  - .env* & production secrets                                            |
|  - src/lib/db.server.ts & connection pools                               |
|  - Auth session cookies & token validation                               |
|  - Core HTTP routing in server.js                                        |
|  --> RULE: READ-ONLY unless explicit migration approved by lead engineer |
+--------------------------------------------------------------------------+
                                    ▲
                                    │ Safe read / API contract
+--------------------------------------------------------------------------+
|  ZONE 2: FEATURE TARGET (MODIFIED / ADDED)                               |
|  - UI Components (src/components/...)                                    |
|  - Page Routes (src/routes/...)                                          |
|  - Styling & Theme (Tailwind CSS, fonts)                                 |
|  - Feature helper functions                                              |
|  --> RULE: Scope limited strictly to the requested feature               |
+--------------------------------------------------------------------------+
                                    ▲
                                    │ Validated in
+--------------------------------------------------------------------------+
|  ZONE 3: SANDBOX / SCRATCH (EPHEMERAL)                                   |
|  - Benchmark & audit scripts (e.g., run-audit.mjs)                        |
|  - Test harnesses (e.g., test-write-behind.ts)                            |
|  - Local temporary port 3085 instances                                   |
|  - repomix-output.xml snapshots                                          |
|  --> RULE: Ephemeral; safe to create, run, and discard                   |
+--------------------------------------------------------------------------+
```

### 🔒 Zone 1: Protected (Vault)
* **Target Files:**
  * `.env`, `.env.production`
  * `src/lib/db.server.ts`
  * `src/lib/auth-client.ts` (Core authentication tokens & session handling)
  * `server.js` (Listener setup and TLS termination rules)
* **Rule:** Never edit files in Zone 1 during routine UI, SEO, or feature development. If an edit is strictly required (e.g., adding a new database column), it must be documented explicitly in the Delta Specification.

### 🎯 Zone 2: Feature Target (Added / Modified)
* **Target Files:**
  * Added files: New components, new routes, new utilities.
  * Modified files: Only those directly involved in the feature.
* **Rule:** Always inspect `git diff` to ensure no unrelated files were touched. Maintain existing comments, docstrings, and formatting.

### 🧪 Zone 3: Sandbox / Ephemeral (Scratch)
* **Target Files:**
  * Scripts in `scripts/test-*.ts`
  * Local audit runners (`run-audit.mjs`)
  * Repomix packed context (`repomix-output.xml`)
* **Rule:** Do not commit temporary test files or large AI bundle outputs to git. Keep them ignored via `.gitignore`.

---

## 🧠 2. Plan Mode Protocol

Before writing or editing code for any non-trivial feature or refactor, follow the **Plan Mode** contract:

1. **Classify Scope**:
   * **Files to Add**: Explicit list of new files.
   * **Files to Modify**: Explicit list of existing files and line targets.
   * **Files to Protect**: Explicit list of Zone 1 files that must remain untouched.
2. **Hostinger Constraint Check**:
   * Check if the change introduces background processes that could exceed memory limits (e.g., streaming buffers, unmanaged loops).
   * Verify that socket limits (100–300 max on shared proxies) are respected (prefer Smart Polling over raw WebSockets).
3. **Verification Gate**:
   * Formulate the test steps to verify success before making changes.

---

## 📦 3. Repomix Context Packaging Protocol

When transferring the project state to external LLMs, auditing the entire codebase, or conducting architecture reviews, use **Repomix**:

```bash
# Generate clean, AI-ready XML dump of entire codebase
npm run repomix
```

* **Repomix Configuration**: Defined in [`repomix.config.json`](file:///c:/Users/gorillatech/Music/TodayTripura/repomix.config.json).
* **Security**: Automatically runs Secretlint to prevent accidental credential leakage.
* **Token Optimization**: Strips redundant empty lines and excludes `dist/`, `assets/`, `uploads/`, `node_modules/`, and `.zip` archives.
* **Output File**: `repomix-output.xml` (automatically ignored in `.gitignore`).

---

## 🧪 4. Sandbox Testing Protocol

Never deploy changes directly to Hostinger without passing the local sandbox test suite:

1. **Build Verification**:
   ```bash
   npm run build
   ```
   *Must complete with 0 syntax or TypeScript errors.*
2. **Local Daemon Test**:
   ```bash
   node server.js
   ```
   *Verify running on `http://localhost:3085`.*
3. **HTTP Header & Canonical Audit**:
   * Verify Public Cache Headers: `s-maxage=60, stale-while-revalidate=120`.
   * Verify Admin Shield: `no-store, private`.
   * Verify Sitemaps & RSS: Resolving to `https://todaytripura.com` (no localhost or legacy domain leaks).
4. **Deploy Archive Generation**:
   ```bash
   npm run package
   ```
   *Produces `hostinger-full-deploy-v1.2.25.zip`.*

---

## 🌿 5. Git Branch Workflow ("Gitbranch Box")

For high-risk or multi-step upgrades:

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/<feature-name>
   ```
2. **Commit with Conventional Commits**:
   * `feat(...)`: New feature
   * `fix(...)`: Bug fix
   * `perf(...)`: Performance optimization
   * `refactor(...)`: Code cleanup with no functional change
3. **Merge to Main**:
   * Only merge to `main` when local build and sandbox tests pass.
   * Push to GitHub remote:
     ```bash
     git push origin main
     ```
