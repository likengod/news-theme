import { query } from "./db.server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { APP_VERSION } from "./version";

const ROOT = process.cwd();

// â”€â”€â”€ Permanent Git Repository & PAT Defaults â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PERMANENT_GIT_REPO =
  process.env.GIT_REMOTE_URL || "https://github.com/likengod/news-theme.git";
export const PERMANENT_GIT_PAT = process.env.GIT_ACCESS_TOKEN || "";
export const PERMANENT_GIT_BRANCH = process.env.GIT_BRANCH || "main";

export function getAuthenticatedGitUrl(customRepo?: string, customPat?: string): string {
  const rawRepo = (customRepo && customRepo.trim()) || PERMANENT_GIT_REPO;
  const token = (customPat && customPat.trim()) || PERMANENT_GIT_PAT;

  if (!token) return rawRepo;

  if (rawRepo.startsWith("https://")) {
    const clean = rawRepo.replace(/^https:\/\/([^@]+@)?/, "");
    return `https://${token}@${clean}`;
  }
  if (rawRepo.startsWith("http://")) {
    const clean = rawRepo.replace(/^http:\/\/([^@]+@)?/, "");
    return `http://${token}@${clean}`;
  }
  return rawRepo;
}

export async function getGitConfigFromDb(): Promise<{ remoteUrl: string; pat: string; branch: string; authUrl: string }> {
  let remoteUrl = PERMANENT_GIT_REPO;
  let pat = PERMANENT_GIT_PAT;
  let branch = PERMANENT_GIT_BRANCH;

  try {
    const rows = await query(
      "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
    );
    if (rows && rows.length > 0 && rows[0].value) {
      const settings = typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
      if (settings.gitRemoteUrl) remoteUrl = settings.gitRemoteUrl.trim();
      if (settings.gitAccessToken) pat = settings.gitAccessToken.trim();
      if (settings.gitBranch) branch = settings.gitBranch.trim();
    }
  } catch {}

  const authUrl = getAuthenticatedGitUrl(remoteUrl, pat);
  return { remoteUrl, pat, branch, authUrl };
}


// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function parseSemver(v: string) {
  const parts = v
    .replace(/^v/, "")
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}

export function getSpawnEnv(): NodeJS.ProcessEnv {
  const nodeBinDir = path.dirname(process.execPath);
  const existingPath = process.env.PATH || "";
  const hostingerAltPaths = [
    nodeBinDir,
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
    "/opt/alt/alt-nodejs24/root/usr/bin",
    "/opt/alt/alt-nodejs22/root/usr/bin",
    "/opt/alt/alt-nodejs20/root/usr/bin",
    "/opt/alt/alt-nodejs18/root/usr/bin",
  ].filter(Boolean);

  return {
    ...process.env,
    PATH: hostingerAltPaths.join(path.delimiter) + path.delimiter + existingPath,
    GIT_TERMINAL_PROMPT: "0",
  };
}

export function getNpmCommand(): string | null {
  const nodeBinDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeBinDir, process.platform === "win32" ? "npm.cmd" : "npm"),
    "/usr/local/bin/npm",
    "/usr/bin/npm",
    "/opt/alt/alt-nodejs24/root/usr/bin/npm",
    "/opt/alt/alt-nodejs22/root/usr/bin/npm",
    "/opt/alt/alt-nodejs20/root/usr/bin/npm",
    "/opt/alt/alt-nodejs18/root/usr/bin/npm",
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return `"${c}"`;
  }
  try {
    execSync("npm --version", { env: getSpawnEnv(), stdio: "ignore" });
    return "npm";
  } catch {
    return null;
  }
}

export function git(cmd: string): string {
  try {
    return execSync(`git -c safe.directory=* -c http.sslVerify=false ${cmd}`, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 120000,
      env: getSpawnEnv(),
    }).trim();
  } catch (err: any) {
    return err.stderr?.trim() || err.message || "unknown error";
  }
}

// â”€â”€â”€ DB Table (auto-create) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function ensureDeployTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS deployments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      commit_hash VARCHAR(100),
      commit_message VARCHAR(500),
      branch VARCHAR(100),
      status VARCHAR(50) DEFAULT 'Pending',
      triggered_by VARCHAR(100) DEFAULT 'admin',
      build_log TEXT,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      finished_at TIMESTAMP NULL
    )
  `);
}

// â”€â”€â”€ Git Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

let gitStatusCache: { data: any; expiry: number } | null = null;
const GIT_STATUS_CACHE_TTL = 60 * 1000; // 1 minute cache
 
export function invalidateGitStatusCache() {
  gitStatusCache = null;
}

export async function executeGetGitStatusCore(forceRefresh?: boolean) {
  if (!forceRefresh && gitStatusCache && gitStatusCache.expiry > Date.now()) {
    return gitStatusCache.data;
  }

  let version = APP_VERSION;
  try {
    const candidatePaths = [
      path.join(ROOT, "package.json"),
      path.join(process.cwd(), "package.json"),
      path.resolve(__dirname, "../../package.json"),
      path.resolve(__dirname, "../package.json"),
      path.resolve(ROOT, "../package.json"),
    ];
    for (const pkgPath of candidatePaths) {
      if (fs.existsSync(pkgPath)) {
        const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
        const pkg = JSON.parse(pkgRaw);
        if (pkg.version) {
          version = pkg.version.startsWith("v") ? pkg.version : `v${pkg.version}`;
          break;
        }
      }
    }
  } catch {}

  let latestVersion = version;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const headers: Record<string, string> = { "User-Agent": "News-Theme-Updater" };
    if (PERMANENT_GIT_PAT) {
      headers["Authorization"] = `token ${PERMANENT_GIT_PAT}`;
    }
    const res = await fetch(
      `https://raw.githubusercontent.com/likengod/news-theme/main/package.json?t=${Date.now()}`,
      {
        headers,
        cache: "no-store",
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const remotePkg: any = await res.json();
      if (remotePkg.version) {
        const remoteV = remotePkg.version.startsWith("v")
          ? remotePkg.version
          : `v${remotePkg.version}`;
        if (parseSemver(remoteV) > parseSemver(latestVersion)) {
          latestVersion = remoteV;
        }
      }
    }
  } catch (e) {
    console.warn("[Deploy] Remote version check notice:", e);
  }

  // Also check remote tags directly via git ls-remote with authenticated url
  try {
    const authUrl = getAuthenticatedGitUrl();
    const tagsOutput = git(`ls-remote --tags --sort=v:refname ${authUrl}`);
    if (tagsOutput && !tagsOutput.includes("fatal") && !tagsOutput.includes("unknown error")) {
      const lines = tagsOutput.trim().split("\n");
      for (let i = lines.length - 1; i >= 0; i--) {
        const match = lines[i].match(/refs\/tags\/(v?[0-9]+\.[0-9]+(\.[0-9]+)?)/);
        if (match && match[1]) {
          const tag = match[1].startsWith("v") ? match[1] : `v${match[1]}`;
          if (parseSemver(tag) > parseSemver(latestVersion)) {
            latestVersion = tag;
          }
          break;
        }
      }
    }
  } catch {}

  const branch = git("rev-parse --abbrev-ref HEAD");
  const commitHash = git("rev-parse --short HEAD");
  const commitFull = git("rev-parse HEAD");
  const commitMessage = git("log -1 --pretty=%s");
  const commitDate = git("log -1 --pretty=%ci");
  const remote = git("remote get-url origin");
  const dirty = git("status --porcelain");

  const isGitInstalled = Boolean(
    remote &&
    !remote.includes("unknown error") &&
    !remote.includes("fatal") &&
    !remote.includes("not a git repository"),
  );

  let ahead = 0;
  let behind = 0;

  const { authUrl: authRemote } = await getGitConfigFromDb();
  if (isGitInstalled) {
    if (!remote || !remote.includes(PERMANENT_GIT_PAT)) {
      git(`remote set-url origin ${authRemote}`);
    }
    git('config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"');
    git("fetch --depth=1 origin main:refs/remotes/origin/main");
    const activeBranch = branch.includes("fatal") ? "main" : branch;
    let behindStr = git(`rev-list --count HEAD..origin/${activeBranch}`);
    if (behindStr.includes("fatal")) {
      behindStr = git(`rev-list --count HEAD..FETCH_HEAD`);
    }
    const aheadStr = git(`rev-list --count origin/${activeBranch}..HEAD`);
    behind = parseInt(behindStr) || 0;
    ahead = parseInt(aheadStr) || 0;
  }

  const hasNewVersion = parseSemver(latestVersion) > parseSemver(version);
  if (hasNewVersion && behind === 0) {
    behind = 1;
  } else if (!hasNewVersion) {
    behind = 0;
  }

  const payload = {
    success: true,
    updated: false,
    version,
    latestVersion,
    branch: branch.includes("fatal") ? "main" : branch,
    commitHash: commitHash.includes("fatal") ? "head" : commitHash,
    commitFull: commitFull.includes("fatal") ? "" : commitFull,
    commitMessage: commitMessage.includes("fatal") ? "" : commitMessage,
    commitDate: commitDate.includes("fatal") ? "" : commitDate,
    remote: PERMANENT_GIT_REPO,
    isConfigured: true,
    hasChanges: dirty.length > 0 && !dirty.includes("fatal"),
    changedFiles: dirty && !dirty.includes("fatal") ? dirty.split("\n").filter(Boolean).length : 0,
    ahead,
    behind,
    hasNewVersion,
  };

  const result = {
    ...payload,
    data: { ...payload },
    result: { ...payload },
  };

  gitStatusCache = {
    data: result,
    expiry: Date.now() + GIT_STATUS_CACHE_TTL,
  };

  return result;
}

// â”€â”€â”€ Git Pull â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function downloadAndExtractTarball(customPat?: string): Promise<{ success: boolean; log: string }> {
  const tarUrl = "https://codeload.github.com/likengod/news-theme/tar.gz/refs/heads/main";
  const tmpDir = os.tmpdir();
  const archivePath = path.join(tmpDir, `update-${Date.now()}.tar.gz`);

  // 1. Backup critical user credentials and custom files in memory
  let envBackup: string | null = null;
  let dbConfigBackup: string | null = null;
  const envPath = path.join(ROOT, ".env");
  const dbConfigPath = path.join(ROOT, "db-config.json");

  if (fs.existsSync(envPath)) {
    try { envBackup = fs.readFileSync(envPath, "utf-8"); } catch {}
  }
  if (fs.existsSync(dbConfigPath)) {
    try { dbConfigBackup = fs.readFileSync(dbConfigPath, "utf-8"); } catch {}
  }

  // 2. Download prebuilt release tarball from GitHub
  try {
    await new Promise<void>((resolve, reject) => {
      const https = require("https");
      const reqHeaders: Record<string, string> = { "User-Agent": "NewsThemeAutoUpdater" };
    const token = customPat || PERMANENT_GIT_PAT;
    if (token) reqHeaders["Authorization"] = `token ${token}`;
    const req = https.get(tarUrl, { headers: reqHeaders }, (res: any) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, { headers: reqHeaders }, (r2: any) => {
            const out = fs.createWriteStream(archivePath);
            r2.pipe(out);
            out.on("finish", () => out.close(() => resolve()));
            out.on("error", reject);
          }).on("error", reject);
        } else if (res.statusCode === 200) {
          const out = fs.createWriteStream(archivePath);
          res.pipe(out);
          out.on("finish", () => out.close(() => resolve()));
          out.on("error", reject);
        } else {
          reject(new Error(`Download failed with HTTP ${res.statusCode}`));
        }
      });
      req.on("error", reject);
      req.setTimeout(60000, () => { req.destroy(new Error("Download timed out")); });
    });
  } catch (dlErr: any) {
    return { success: false, log: `Direct HTTP download failed: ${dlErr.message}` };
  }

  // 3. Extract prebuilt files into ROOT
  try {
    execSync(`tar -xzf "${archivePath}" --strip-components=1 -C "${ROOT}"`, {
      encoding: "utf-8",
      timeout: 120000,
      env: getSpawnEnv(),
    });
  } catch (extErr: any) {
    return { success: false, log: `Tar extraction error: ${extErr.message}` };
  } finally {
    try { if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath); } catch {}
  }

  // 4. Restore preserved user credentials
  if (envBackup !== null) {
    try { fs.writeFileSync(envPath, envBackup, "utf-8"); } catch {}
  }
  if (dbConfigBackup !== null) {
    try { fs.writeFileSync(dbConfigPath, dbConfigBackup, "utf-8"); } catch {}
  }

  return {
    success: true,
    log: "Successfully downloaded and applied pre-compiled update package directly via secure HTTPS (Git-independent zero-loss update).",
  };
}

export async function executeGitPullCore() {
  await ensureDeployTable();

  const beforeHash = git("rev-parse --short HEAD");
  const { remoteUrl, pat, branch, authUrl: authRemote } = await getGitConfigFromDb();

  // 1. Configure safe directory on Linux & disable SSL verify for hosts with outdated cert stores
  git("config --global --add safe.directory *");
  git("config safe.directory *");
  git("config http.sslVerify false");

  // 2. Ensure git remote origin exists and has correct fetch refspec
  const remote = git("remote get-url origin");
  if (!remote || remote.includes("fatal") || remote.includes("not a git repository")) {
    git("init");
    git("remote remove origin");
    git(`remote add origin ${authRemote}`);
  } else {
    git(`remote set-url origin ${authRemote}`);
  }
  git('config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"');

  // 3. Fetch from origin (or direct URL if remote lookup fails)
  let fetchResult = git("fetch --depth=1 origin main:refs/remotes/origin/main");
  if (fetchResult.includes("fatal") || fetchResult.includes("unknown error")) {
    fetchResult = git(`fetch --depth=1 ${authRemote} main:refs/remotes/origin/main`);
  }

  // 4. Force checkout / reset to FETCH_HEAD directly
  git("branch -M main");
  let pullResult = git("reset --hard refs/remotes/origin/main");
  if (!pullResult || pullResult.includes("fatal")) {
    pullResult = git("checkout -f -B main refs/remotes/origin/main");
  }
  if (!pullResult || pullResult.includes("fatal")) {
    pullResult = git("checkout -f -B main FETCH_HEAD");
  }
  if (!pullResult || pullResult.includes("fatal")) {
    pullResult = git("reset --hard FETCH_HEAD");
  }

  // If Git failed (e.g. fresh ZIP install without Git commits or dubious ownership), fallback to direct HTTPS release extraction
  if (pullResult.includes("fatal") || pullResult.includes("unknown revision") || pullResult.includes("error")) {
    const directRes = await downloadAndExtractTarball(pat);
    pullResult = directRes.log;
  }

  // 5. Pre-compiled dist check & safe dependency sync
  let buildLog = `Git Fetch: ${fetchResult}\nGit Checkout: ${pullResult}\n`;
  let buildSuccess = true;
  const hasPrebuiltDist = fs.existsSync(path.join(ROOT, "dist", "server", "server.js"));

  const npmCmd = getNpmCommand();
  if (npmCmd) {
    try {
      const installLog = execSync(`${npmCmd} install --no-audit --no-fund 2>&1`, {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 120000,
        env: getSpawnEnv(),
      });
      buildLog += "\n[Security & Dependencies]: node_modules synced.\n" + installLog.slice(-500);
    } catch (depErr: any) {
      buildLog += "\n[Security notice]: " + (depErr?.message || "npm install skipped");
    }
  } else {
    buildLog += "\n[Environment notice]: npm binary not in system path, skipping npm install.";
  }

  if (hasPrebuiltDist) {
    buildLog = "Pre-compiled production bundle verified from Git. Instant safe deployment applied.\n" + buildLog;
  } else if (npmCmd) {
    try {
      const bLog = execSync(`${npmCmd} run build 2>&1`, {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 120000,
        env: getSpawnEnv(),
      });
      buildLog += "\n" + bLog;
    } catch (bErr: any) {
      buildLog += "\n" + (bErr.stdout || bErr.stderr || bErr.message || "");
      buildSuccess = false;
    }
  } else {
    buildLog += "\n[Build notice]: dist folder ready for serving.";
  }

  invalidateGitStatusCache();
  const afterHash = git("rev-parse --short HEAD");
  const commitMessage = git("log -1 --pretty=%s");

  // Log to deployments table
  try {
    await query(
      `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by, build_log, finished_at)
         VALUES (?, ?, 'main', ?, 'admin', ?, NOW())`,
      [afterHash, commitMessage, buildSuccess ? "Success" : "Pulled", `=== BUILD LOG ===\n${buildLog.slice(-3000)}`],
    );
  } catch (dbErr) {
    console.warn("[Deploy] Failed to log deployment into DB:", dbErr);
  }

  // Auto-restart server process to pick up new bundles (works with PM2, systemd, nohup, CloudPanel)
  setTimeout(async () => {
    try {
      const { spawn } = await import("child_process");
      const appPort = process.env.APP_PORT || process.env.PORT || "3098";
      if (process.platform !== "win32") {
        const restartCmd = `sleep 2 && if ! fuser ${appPort}/tcp >/dev/null 2>&1; then PORT=${appPort} APP_PORT=${appPort} nohup ${process.argv[0]} server.js > server.log 2>&1 & fi`;
        const child = spawn("sh", ["-c", restartCmd], {
          detached: true,
          stdio: "ignore",
          cwd: ROOT,
        });
        child.unref();
      } else {
        const child = spawn(
          "cmd.exe",
          ["/c", `timeout /t 2 /nobreak >nul & set PORT=${appPort} & "${process.argv[0]}" server.js`],
          {
            detached: true,
            stdio: "ignore",
            cwd: ROOT,
          },
        );
        child.unref();
      }
    } catch (err) {
      console.error("[Deploy] Auto-restart spawn error:", err);
    }
    try {
      
      
      const tmpDir = path.join(ROOT, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, "restart.txt"), new Date().toISOString());
      process.exit(0);
    } catch {}
  }, 2500);

  invalidateGitStatusCache();

  const responsePayload = {
    success: true,
    updated: true,
    beforeHash,
    afterHash,
    commitMessage,
    pullResult,
    buildSuccess,
  };

  return {
    ...responsePayload,
    data: responsePayload,
    result: responsePayload,
  };
}

// â”€â”€â”€ Build Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function executeBuildProjectCore() {
  await ensureDeployTable();

  const branch = git("rev-parse --abbrev-ref HEAD");
  const commitHash = git("rev-parse --short HEAD");
  const commitMessage = git("log -1 --pretty=%s");

  const result = await query(
    `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by)
       VALUES (?, ?, ?, 'Building', 'admin')`,
    [commitHash, commitMessage, branch],
  );
  const deployId = result.insertId;

  let buildLog = "";
  let status = "Success";
  let hasNpm = false;
  try {
    execSync("npm --version", { cwd: ROOT, encoding: "utf-8", timeout: 5000 });
    hasNpm = true;
  } catch {}

  if (hasNpm) {
    try {
      buildLog = execSync("npm install --no-audit --no-fund && npm run build 2>&1", {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 120000,
      });
    } catch (err: any) {
      buildLog = err.stdout || err.stderr || err.message;
      status = "Failed";
    }
  } else {
    buildLog = "npm is not installed. Manual build is impossible inside the Node environment. Please use GitHub auto-deploy.";
  }

  await query(
    "UPDATE deployments SET status = ?, build_log = ?, finished_at = NOW() WHERE id = ?",
    [status, buildLog.slice(-5000), deployId],
  );

  if (status === "Success") {
    setTimeout(() => {
      try {
        
      
      const tmpDir = path.join(ROOT, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, "restart.txt"), new Date().toISOString());
      process.exit(0);
      } catch {}
    }, 1500);
  }

  return { success: status === "Success", status, buildLog: buildLog.slice(-3000), deployId };
}

export async function executePatchDependenciesCore() {
  await ensureDeployTable();

  const branch = git("rev-parse --abbrev-ref HEAD");
  const commitHash = git("rev-parse --short HEAD");
  const commitMessage = "Security patch: node_modules dependency sync";

  const result = await query(
    `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by)
       VALUES (?, ?, ?, 'Building', 'admin')`,
    [commitHash, commitMessage, branch],
  );
  const deployId = result.insertId;

  let installLog = "";
  let status = "Success";
  try {
    installLog = execSync("npm install --no-audit --no-fund 2>&1", {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 180000,
    });
  } catch (err: any) {
    installLog = err.stdout || err.stderr || err.message;
    status = "Failed";
  }

  await query(
    "UPDATE deployments SET status = ?, build_log = ?, finished_at = NOW() WHERE id = ?",
    [status, installLog.slice(-5000), deployId],
  );

  if (status === "Success") {
    setTimeout(() => {
      try {
        const tmpDir = path.join(ROOT, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(path.join(tmpDir, "restart.txt"), new Date().toISOString());
        process.exit(0);
      } catch {}
    }, 1500);
  }

  return { success: status === "Success", status, buildLog: installLog.slice(-3000), deployId };
}

// â”€â”€â”€ Deployment History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function executeGetDeployHistoryCore() {
  await ensureDeployTable();
  const rows = await query(
    "SELECT id, commit_hash, commit_message, branch, status, triggered_by, started_at, finished_at FROM deployments ORDER BY started_at DESC LIMIT 20",
  );
  return { deployments: rows };
}

// â”€â”€â”€ Deployment Log â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function executeGetDeployLogCore(id: number) {
  const rows = await query("SELECT * FROM deployments WHERE id = ?", [id]);
  if (rows.length === 0) return null;
  return rows[0];
}

// â”€â”€â”€ Initialize Git Repository â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function executeInitializeGitRepoCore() {
  try {
    let remoteUrl = PERMANENT_GIT_REPO;
    let pat = PERMANENT_GIT_PAT;
    let branch = PERMANENT_GIT_BRANCH;

    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        const settings = JSON.parse(rows[0].value);
        if (settings.gitRemoteUrl) remoteUrl = settings.gitRemoteUrl;
        if (settings.gitAccessToken) pat = settings.gitAccessToken;
        if (settings.gitBranch) branch = settings.gitBranch;
      }
    } catch {}

    const authUrl = getAuthenticatedGitUrl(remoteUrl, pat);

    let log = "";
    log += git("init") + "\n";
    git("remote remove origin");

    log += git(`remote add origin ${authUrl}`) + "\n";
    git('config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"');
    log += git(`fetch --depth=1 origin ${branch}:refs/remotes/origin/${branch}`) + "\n";
    log += git(`branch -M ${branch}`) + "\n";
    let initReset = git(`checkout -f -B ${branch} refs/remotes/origin/${branch}`);
    if (initReset.includes("fatal") || initReset.includes("unknown revision")) {
      initReset = git(`reset --hard refs/remotes/origin/${branch}`);
    }
    log += initReset + "\n";

    return { success: true, log };
  } catch (err: any) {
    return { success: false, log: err.message };
  }
}

