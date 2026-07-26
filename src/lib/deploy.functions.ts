import { createServerFn } from "@tanstack/react-start";
import { query } from "./db.server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = process.cwd();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8", timeout: 15000 }).trim();
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
    let version = "v1.7.22";
    try {
      const pkgPath = path.join(ROOT, "package.json");
      const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
      const pkg = JSON.parse(pkgRaw);
      if (pkg.version) {
        version = pkg.version.startsWith("v") ? pkg.version : `v${pkg.version}`;
      }
    } catch {}

    const branch = git("rev-parse --abbrev-ref HEAD");
    const commitHash = git("rev-parse --short HEAD");
    const commitFull = git("rev-parse HEAD");
    const commitMessage = git("log -1 --pretty=%s");
    const commitDate = git("log -1 --pretty=%ci");
    const remote = git("remote get-url origin");
    const dirty = git("status --porcelain");

    const isConfigured = Boolean(
      remote &&
      !remote.includes("unknown error") &&
      !remote.includes("fatal") &&
      !remote.includes("not a git repository")
    );

    let ahead = 0;
    let behind = 0;

    if (isConfigured) {
      const aheadStr = git("rev-list --count @{u}..HEAD 2>nul || echo 0");
      const behindStr = git("rev-list --count HEAD..@{u} 2>nul || echo 0");
      ahead = parseInt(aheadStr) || 0;
      behind = parseInt(behindStr) || 0;
    }

    return {
      version,
      branch: branch.includes("fatal") ? "main" : branch,
      commitHash: commitHash.includes("fatal") ? "head" : commitHash,
      commitFull: commitFull.includes("fatal") ? "" : commitFull,
      commitMessage: commitMessage.includes("fatal") ? "" : commitMessage,
      commitDate: commitDate.includes("fatal") ? "" : commitDate,
      remote: isConfigured ? remote : "",
      isConfigured,
      hasChanges: dirty.length > 0 && !dirty.includes("fatal"),
      changedFiles: dirty && !dirty.includes("fatal") ? dirty.split("\n").filter(Boolean).length : 0,
      ahead,
      behind,
    };
  });

// ─── Git Pull ────────────────────────────────────────────────────────────────

export const gitPull = createServerFn({ method: "POST" })
  .handler(async () => {
    await ensureDeployTable();

    const branch = git("rev-parse --abbrev-ref HEAD");
    const beforeHash = git("rev-parse --short HEAD");

    // Fetch + pull
    git("fetch --all");
    const pullResult = git("pull --ff-only");

    const afterHash = git("rev-parse --short HEAD");
    const commitMessage = git("log -1 --pretty=%s");

    const updated = beforeHash !== afterHash;

    // Log to deployments table
    await query(
      `INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by, build_log, finished_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [afterHash, commitMessage, branch, updated ? "Pulled" : "Up-to-date", "admin", pullResult]
    );

    return {
      success: true,
      updated,
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
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
      if (rows.length === 0 || !rows[0].value) throw new Error("Settings not found");
      
      const settings = JSON.parse(rows[0].value);
      const remoteUrl = settings.gitRemoteUrl;
      const pat = settings.gitAccessToken;
      const branch = settings.gitBranch || "main";

      if (!remoteUrl) throw new Error("Git Remote URL is not configured in Settings.");

      // Format URL to include PAT if it exists
      let authUrl = remoteUrl;
      if (pat && remoteUrl.startsWith("https://")) {
        authUrl = remoteUrl.replace("https://", `https://${pat}@`);
      } else if (pat && remoteUrl.startsWith("http://")) {
        authUrl = remoteUrl.replace("http://", `http://${pat}@`);
      }

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
