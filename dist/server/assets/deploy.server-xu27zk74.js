import { s as query } from "./db.server-BkLt9eJ8.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
//#region src/lib/deploy.server.ts
var ROOT = process.cwd();
var PERMANENT_GIT_REPO = process.env.GIT_REMOTE_URL || "https://github.com/likengod/news-theme.git";
var PERMANENT_GIT_PAT = process.env.GIT_ACCESS_TOKEN || "";
var PERMANENT_GIT_BRANCH = process.env.GIT_BRANCH || "main";
function getAuthenticatedGitUrl(customRepo, customPat) {
	const rawRepo = customRepo && customRepo.trim() || PERMANENT_GIT_REPO;
	const token = customPat && customPat.trim() || PERMANENT_GIT_PAT;
	if (!token) return rawRepo;
	if (rawRepo.startsWith("https://")) return `https://${token}@${rawRepo.replace(/^https:\/\/([^@]+@)?/, "")}`;
	if (rawRepo.startsWith("http://")) return `http://${token}@${rawRepo.replace(/^http:\/\/([^@]+@)?/, "")}`;
	return rawRepo;
}
function parseSemver(v) {
	const parts = v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
	return (parts[0] || 0) * 1e6 + (parts[1] || 0) * 1e3 + (parts[2] || 0);
}
function git(cmd) {
	try {
		return execSync(`git ${cmd}`, {
			cwd: ROOT,
			encoding: "utf-8",
			timeout: 2e4
		}).trim();
	} catch (err) {
		return err.stderr?.trim() || err.message || "unknown error";
	}
}
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
var gitStatusCache = null;
var GIT_STATUS_CACHE_TTL = 600 * 1e3;
function invalidateGitStatusCache() {
	gitStatusCache = null;
}
async function executeGetGitStatusCore(forceRefresh) {
	if (!forceRefresh && gitStatusCache && gitStatusCache.expiry > Date.now()) return gitStatusCache.data;
	let version = "v1.0.57";
	try {
		const pkgPath = path.join(ROOT, "package.json");
		const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
		const pkg = JSON.parse(pkgRaw);
		if (pkg.version) version = pkg.version.startsWith("v") ? pkg.version : `v${pkg.version}`;
	} catch {}
	let latestVersion = version;
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2500);
		const headers = { "User-Agent": "News-Theme-Updater" };
		if (PERMANENT_GIT_PAT) headers["Authorization"] = `token ${PERMANENT_GIT_PAT}`;
		const res = await fetch(`https://raw.githubusercontent.com/likengod/news-theme/main/package.json?t=${Date.now()}`, {
			headers,
			cache: "no-store",
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		if (res.ok) {
			const remotePkg = await res.json();
			if (remotePkg.version) {
				const remoteV = remotePkg.version.startsWith("v") ? remotePkg.version : `v${remotePkg.version}`;
				if (parseSemver(remoteV) > parseSemver(latestVersion)) latestVersion = remoteV;
			}
		}
	} catch (e) {
		console.warn("[Deploy] Remote version check notice:", e);
	}
	try {
		const tagsOutput = git(`ls-remote --tags --sort=v:refname ${getAuthenticatedGitUrl()}`);
		if (tagsOutput && !tagsOutput.includes("fatal") && !tagsOutput.includes("unknown error")) {
			const lines = tagsOutput.trim().split("\n");
			for (let i = lines.length - 1; i >= 0; i--) {
				const match = lines[i].match(/refs\/tags\/(v?[0-9]+\.[0-9]+(\.[0-9]+)?)/);
				if (match && match[1]) {
					const tag = match[1].startsWith("v") ? match[1] : `v${match[1]}`;
					if (parseSemver(tag) > parseSemver(latestVersion)) latestVersion = tag;
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
	const isGitInstalled = Boolean(remote && !remote.includes("unknown error") && !remote.includes("fatal") && !remote.includes("not a git repository"));
	let ahead = 0;
	let behind = 0;
	const authRemote = getAuthenticatedGitUrl();
	if (isGitInstalled) {
		if (!remote || !remote.includes(PERMANENT_GIT_PAT)) git(`remote set-url origin ${authRemote}`);
		git("fetch origin main --tags");
		const activeBranch = branch.includes("fatal") ? "main" : branch;
		const behindStr = git(`rev-list --count HEAD..origin/${activeBranch}`);
		const aheadStr = git(`rev-list --count origin/${activeBranch}..HEAD`);
		behind = parseInt(behindStr) || 0;
		ahead = parseInt(aheadStr) || 0;
	}
	const hasNewVersion = parseSemver(latestVersion) > parseSemver(version);
	if (hasNewVersion && behind === 0) behind = 1;
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
		hasNewVersion
	};
	const result = {
		...payload,
		data: { ...payload },
		result: { ...payload }
	};
	gitStatusCache = {
		data: result,
		expiry: Date.now() + GIT_STATUS_CACHE_TTL
	};
	return result;
}
async function executeGitPullCore() {
	await ensureDeployTable();
	git("config --global --add safe.directory *");
	const authRemote = getAuthenticatedGitUrl();
	const remote = git("remote get-url origin");
	if (!remote || remote.includes("fatal") || remote.includes("not a git repository")) {
		git("init");
		git("remote remove origin");
		git(`remote add origin ${authRemote}`);
	} else git(`remote set-url origin ${authRemote}`);
	const beforeHash = git("rev-parse --short HEAD");
	git("fetch origin main --tags");
	git("branch -M main");
	let pullResult = git("checkout -f -B main origin/main");
	if (!pullResult || pullResult.includes("fatal")) pullResult = git("reset --hard origin/main");
	let buildLog = "";
	let buildSuccess = true;
	try {
		buildLog = execSync("npm run build 2>&1", {
			cwd: ROOT,
			encoding: "utf-8",
			timeout: 12e4
		});
	} catch (bErr) {
		buildLog = bErr.stdout || bErr.stderr || bErr.message || "";
		buildSuccess = false;
		console.error("[Deploy] Build after pull error:", bErr);
	}
	const afterHash = git("rev-parse --short HEAD");
	const commitMessage = git("log -1 --pretty=%s");
	try {
		await query(`INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by, build_log, finished_at)
         VALUES (?, ?, 'main', ?, 'admin', ?, NOW())`, [
			afterHash,
			commitMessage,
			buildSuccess ? "Success" : "Pulled",
			`${pullResult}\n\n=== BUILD LOG ===\n${buildLog.slice(-3e3)}`
		]);
	} catch (dbErr) {
		console.warn("[Deploy] Failed to log deployment into DB:", dbErr);
	}
	setTimeout(async () => {
		try {
			const { spawn } = await import("child_process");
			const appPort = process.env.APP_PORT || process.env.PORT || "3098";
			if (process.platform !== "win32") spawn("sh", ["-c", `sleep 2 && if ! fuser ${appPort}/tcp >/dev/null 2>&1; then PORT=${appPort} APP_PORT=${appPort} nohup ${process.argv[0]} server.js > server.log 2>&1 & fi`], {
				detached: true,
				stdio: "ignore",
				cwd: ROOT
			}).unref();
			else spawn("cmd.exe", ["/c", `timeout /t 2 /nobreak >nul & set PORT=${appPort} & "${process.argv[0]}" server.js`], {
				detached: true,
				stdio: "ignore",
				cwd: ROOT
			}).unref();
		} catch (err) {
			console.error("[Deploy] Auto-restart spawn error:", err);
		}
		try {
			process.exit(0);
		} catch {}
	}, 1200);
	invalidateGitStatusCache();
	const responsePayload = {
		success: true,
		updated: true,
		beforeHash,
		afterHash,
		commitMessage,
		pullResult,
		buildSuccess
	};
	return {
		...responsePayload,
		data: responsePayload,
		result: responsePayload
	};
}
async function executeBuildProjectCore() {
	await ensureDeployTable();
	const branch = git("rev-parse --abbrev-ref HEAD");
	const deployId = (await query(`INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by)
       VALUES (?, ?, ?, 'Building', 'admin')`, [
		git("rev-parse --short HEAD"),
		git("log -1 --pretty=%s"),
		branch
	])).insertId;
	let buildLog = "";
	let status = "Success";
	try {
		buildLog = execSync("npm run build 2>&1", {
			cwd: ROOT,
			encoding: "utf-8",
			timeout: 12e4
		});
	} catch (err) {
		buildLog = err.stdout || err.stderr || err.message;
		status = "Failed";
	}
	await query("UPDATE deployments SET status = ?, build_log = ?, finished_at = NOW() WHERE id = ?", [
		status,
		buildLog.slice(-5e3),
		deployId
	]);
	if (status === "Success") setTimeout(() => {
		try {
			process.exit(0);
		} catch {}
	}, 1500);
	return {
		success: status === "Success",
		status,
		buildLog: buildLog.slice(-3e3),
		deployId
	};
}
async function executeGetDeployHistoryCore() {
	await ensureDeployTable();
	return { deployments: await query("SELECT id, commit_hash, commit_message, branch, status, triggered_by, started_at, finished_at FROM deployments ORDER BY started_at DESC LIMIT 20") };
}
async function executeGetDeployLogCore(id) {
	const rows = await query("SELECT * FROM deployments WHERE id = ?", [id]);
	if (rows.length === 0) return null;
	return rows[0];
}
async function executeInitializeGitRepoCore() {
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
		git("remote remove origin");
		log += git(`remote add origin ${authUrl}`) + "\n";
		log += git("fetch --all") + "\n";
		log += git(`branch -M ${branch}`) + "\n";
		log += git(`reset --hard origin/${branch}`) + "\n";
		return {
			success: true,
			log
		};
	} catch (err) {
		return {
			success: false,
			log: err.message
		};
	}
}
//#endregion
export { executeGitPullCore as a, executeGetGitStatusCore as i, executeGetDeployHistoryCore as n, executeInitializeGitRepoCore as o, executeGetDeployLogCore as r, executeBuildProjectCore as t };
