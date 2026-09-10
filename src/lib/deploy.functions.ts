import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = process.cwd();

// ─── Permanent Git Repository & PAT Defaults ─────────────────────────────────
export const PERMANENT_GIT_REPO = process.env.GIT_REMOTE_URL || "https://github.com/likengod/news-theme.git";
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseSemver(v: string) {
  const parts = v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8", timeout: 20000 }).trim();
  } catch (err: any) {
    return err.stderr?.trim() || err.message || "unknown error";
  }
}

// ─── DB Table (auto-create) ──────────────────────────────────────────────────

async function ensureDeployTable() {
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

// ─── Git Status ──────────────────────────────────────────────────────────────

export const getGitStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    let version = "v1.0.31";
    try {
      const pkgPath = path.join(ROOT, "package.json");
      const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
      const pkg = JSON.parse(pkgRaw);
      if (pkg.version) {
        version = pkg.version.startsWith("v") ? pkg.version : `v${pkg.version}`;
      }
    } catch {}

    let latestVersion = version;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const headers: Record<string, string> = { "User-Agent": "News-Theme-Updater" };
      if (PERMANENT_GIT_PAT) {
        headers["Authorization"] = `token ${PERMANENT_GIT_PAT}`;
      }
      const res = await fetch(`https://raw.githubusercontent.com/likengod/news-theme/main/package.json?t=${Date.now()}`, {
        headers,
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const remotePkg: any = await res.json();
        if (remotePkg.version) {
          const remoteV = remotePkg.version.startsWith("v") ? remotePkg.version : `v${remotePkg.version}`;
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
      !remote.includes("not a git repository")
    );

    let ahead = 0;
    let behind = 0;

    const authRemote = getAuthenticatedGitUrl();
    if (isGitInstalled) {
      if (!remote || !remote.includes(PERMANENT_GIT_PAT)) {
        git(`remote set-url origin ${authRemote}`);
      }
      git("fetch origin main --tags");
      const activeBranch = branch.includes("fatal") ? "main" : branch;
      const behindStr = git(`rev-list --count HEAD..origin/${activeBranch}`);
      const aheadStr = git(`rev-list --count origin/${activeBranch}..HEAD`);
      behind = parseInt(behindStr) || 0;
      ahead = parseInt(aheadStr) || 0;
    }

    const hasNewVersion = parseSemver(latestVersion) > parseSemver(version);
    if (hasNewVersion && behind === 0) {
      behind = 1;
    }

    return {
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
  });

// ─── Git Pull ────────────────────────────────────────────────────────────────

export const gitPull = createServerFn({ method: "POST" })
  .handler(async () => {
    await ensureDeployTable();

    // 1. Configure safe directory on Linux & ensure git origin with permanent PAT
    git("config --global --add safe.directory *");
    const authRemote = getAuthenticatedGitUrl();
    const remote = git("remote get-url origin");
    if (!remote || remote.includes("fatal") || remote.includes("not a git repository")) {
      git("init");
      git("remote remove origin");
      git(`remote add origin ${authRemote}`);
    } else {
      git(`remote set-url origin ${authRemote}`);
    }

    const beforeHash = git("rev-parse --short HEAD");

    // 2. Fetch origin main with tags and reset cleanly
    git("fetch origin main --tags");
    git("branch -M main");
    let pullResult = git("checkout -f -B main origin/main");
    if (!pullResult || pullResult.includes("fatal")) {
      pullResult = git("reset --hard origin/main");
    }

    const afterHash = git("rev-parse --short HEAD");
    const commitMessage = git("log -1 --pretty=%s");

    // Log to deployments table
    await query(
      `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by, build_log, finished_at)
       VALUES (?, ?, 'main', 'Pulled', 'admin', ?, NOW())`,
      [afterHash, commitMessage, pullResult]
    );

    // Auto-restart server process to pick up new bundles (works with PM2, systemd, nohup, CloudPanel)
    setTimeout(async () => {
      try {
        const { spawn } = await import("child_process");
        if (process.platform !== "win32") {
          // If PM2 is managing the process, process.exit(0) will auto-restart it immediately.
          // In case PM2 is not running, launch nohup node server.js on port 3000 after 2 seconds.
          const restartCmd = `sleep 2 && if ! fuser 3000/tcp >/dev/null 2>&1; then PORT=3000 APP_PORT=3000 nohup ${process.argv[0]} server.js > server.log 2>&1 & fi`;
          const child = spawn("sh", ["-c", restartCmd], {
            detached: true,
            stdio: "ignore",
            cwd: ROOT,
          });
          child.unref();
        } else {
          const child = spawn("cmd.exe", ["/c", `timeout /t 2 /nobreak >nul & set PORT=3000 & "${process.argv[0]}" server.js`], {
            detached: true,
            stdio: "ignore",
            cwd: ROOT,
          });
          child.unref();
        }
      } catch (err) {
        console.error("[Deploy] Auto-restart spawn error:", err);
      }
      try {
        process.exit(0);
      } catch {}
    }, 1200);

    return {
      success: true,
      updated: true,
      beforeHash,
      afterHash,
      commitMessage,
      pullResult,
    };
  });

// ─── Build Project ───────────────────────────────────────────────────────────

export const buildProject = createServerFn({ method: "POST" })
  .handler(async () => {
    await ensureDeployTable();

    const branch = git("rev-parse --abbrev-ref HEAD");
    const commitHash = git("rev-parse --short HEAD");
    const commitMessage = git("log -1 --pretty=%s");

    // Insert pending deployment
    const result = await query(
      `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by)
       VALUES (?, ?, ?, 'Building', 'admin')`,
      [commitHash, commitMessage, branch]
    );
    const deployId = result.insertId;

    let buildLog = "";
    let status = "Success";
    try {
      buildLog = execSync("npm run build 2>&1", {
        cwd: ROOT,
        encoding: "utf-8",
        timeout: 120000,
      });
    } catch (err: any) {
      buildLog = err.stdout || err.stderr || err.message;
      status = "Failed";
    }

    // Update deployment record
    await query(
      "UPDATE deployments SET status = ?, build_log = ?, finished_at = NOW() WHERE id = ?",
      [status, buildLog.slice(-5000), deployId] // keep last 5K chars
    );

    if (status === "Success") {
      setTimeout(() => {
        try {
          process.exit(0);
        } catch {}
      }, 1500);
    }

    return { success: status === "Success", status, buildLog: buildLog.slice(-3000), deployId };
  });

// ─── Deployment History ──────────────────────────────────────────────────────

export const getDeployHistory = createServerFn({ method: "GET" })
  .handler(async () => {
    await ensureDeployTable();
    const rows = await query(
      "SELECT id, commit_hash, commit_message, branch, status, triggered_by, started_at, finished_at FROM deployments ORDER BY started_at DESC LIMIT 20"
    );
    return { deployments: rows };
  });

// ─── Get single deployment log ───────────────────────────────────────────────

export const getDeployLog = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const rows = await query("SELECT * FROM deployments WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    return rows[0];
  });

// ─── Initialize Git Repository ───────────────────────────────────────────────

export const initializeGitRepo = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      let remoteUrl = PERMANENT_GIT_REPO;
      let pat = PERMANENT_GIT_PAT;
      let branch = PERMANENT_GIT_BRANCH;

      try {
        const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
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
      git("remote remove origin"); // ignore error if it doesn't exist
      
      log += git(`remote add origin ${authUrl}`) + "\n";
      log += git("fetch --all") + "\n";
      log += git(`branch -M ${branch}`) + "\n";
      log += git(`reset --hard origin/${branch}`) + "\n";
      
      return { success: true, log };
    } catch (err: any) {
      return { success: false, log: err.message };
    }
  });
