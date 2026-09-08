import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-CLva-TlE.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
//#region src/lib/deploy.functions.ts?tss-serverfn-split
var ROOT = process.cwd();
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
var getGitStatus_createServerFn_handler = createServerRpc({
	id: "8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e",
	name: "getGitStatus",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getGitStatus.__executeServer(opts));
var getGitStatus = createServerFn({ method: "GET" }).handler(getGitStatus_createServerFn_handler, async () => {
	let version = "v1.0.18";
	try {
		const pkgPath = path.join(ROOT, "package.json");
		const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
		const pkg = JSON.parse(pkgRaw);
		if (pkg.version) version = pkg.version.startsWith("v") ? pkg.version : `v${pkg.version}`;
	} catch {}
	let latestVersion = version;
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3500);
		const res = await fetch(`https://raw.githubusercontent.com/likengod/news-theme/main/package.json?t=${Date.now()}`, {
			headers: { "User-Agent": "News-Theme-Updater" },
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
		const tagsOutput = git("ls-remote --tags --sort=v:refname https://github.com/likengod/news-theme.git");
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
	if (isGitInstalled) {
		git("fetch origin main --tags");
		const activeBranch = branch.includes("fatal") ? "main" : branch;
		const behindStr = git(`rev-list --count HEAD..origin/${activeBranch}`);
		const aheadStr = git(`rev-list --count origin/${activeBranch}..HEAD`);
		behind = parseInt(behindStr) || 0;
		ahead = parseInt(aheadStr) || 0;
	}
	const hasNewVersion = parseSemver(latestVersion) > parseSemver(version);
	if (hasNewVersion && behind === 0) behind = 1;
	return {
		version,
		latestVersion,
		branch: branch.includes("fatal") ? "main" : branch,
		commitHash: commitHash.includes("fatal") ? "head" : commitHash,
		commitFull: commitFull.includes("fatal") ? "" : commitFull,
		commitMessage: commitMessage.includes("fatal") ? "" : commitMessage,
		commitDate: commitDate.includes("fatal") ? "" : commitDate,
		remote: isGitInstalled ? remote : "https://github.com/likengod/news-theme.git",
		isConfigured: true,
		hasChanges: dirty.length > 0 && !dirty.includes("fatal"),
		changedFiles: dirty && !dirty.includes("fatal") ? dirty.split("\n").filter(Boolean).length : 0,
		ahead,
		behind,
		hasNewVersion
	};
});
var gitPull_createServerFn_handler = createServerRpc({
	id: "ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a",
	name: "gitPull",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => gitPull.__executeServer(opts));
var gitPull = createServerFn({ method: "POST" }).handler(gitPull_createServerFn_handler, async () => {
	await ensureDeployTable();
	git("config --global --add safe.directory *");
	const remote = git("remote get-url origin");
	if (!remote || remote.includes("fatal") || remote.includes("not a git repository")) {
		git("init");
		git("remote remove origin");
		git("remote add origin https://github.com/likengod/news-theme.git");
	}
	const beforeHash = git("rev-parse --short HEAD");
	git("fetch origin main --tags");
	git("branch -M main");
	let pullResult = git("checkout -f -B main origin/main");
	if (!pullResult || pullResult.includes("fatal")) pullResult = git("reset --hard origin/main");
	const afterHash = git("rev-parse --short HEAD");
	const commitMessage = git("log -1 --pretty=%s");
	await query(`INSERT INTO deployments (commit_hash, commit_message, branch, status, triggered_by, build_log, finished_at)
       VALUES (?, ?, 'main', 'Pulled', 'admin', ?, NOW())`, [
		afterHash,
		commitMessage,
		pullResult
	]);
	setTimeout(async () => {
		try {
			const { spawn } = await import("child_process");
			if (process.platform !== "win32") spawn("sh", ["-c", `sleep 2 && if ! fuser 3000/tcp >/dev/null 2>&1; then nohup ${process.argv[0]} server.js > server.log 2>&1 & fi`], {
				detached: true,
				stdio: "ignore",
				cwd: ROOT
			}).unref();
			else spawn(process.argv[0], process.argv.slice(1), {
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
	return {
		success: true,
		updated: true,
		beforeHash,
		afterHash,
		commitMessage,
		pullResult
	};
});
var buildProject_createServerFn_handler = createServerRpc({
	id: "a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef",
	name: "buildProject",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => buildProject.__executeServer(opts));
var buildProject = createServerFn({ method: "POST" }).handler(buildProject_createServerFn_handler, async () => {
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
});
var getDeployHistory_createServerFn_handler = createServerRpc({
	id: "c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d",
	name: "getDeployHistory",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getDeployHistory.__executeServer(opts));
var getDeployHistory = createServerFn({ method: "GET" }).handler(getDeployHistory_createServerFn_handler, async () => {
	await ensureDeployTable();
	return { deployments: await query("SELECT id, commit_hash, commit_message, branch, status, triggered_by, started_at, finished_at FROM deployments ORDER BY started_at DESC LIMIT 20") };
});
var getDeployLog_createServerFn_handler = createServerRpc({
	id: "a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e",
	name: "getDeployLog",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getDeployLog.__executeServer(opts));
var getDeployLog = createServerFn({ method: "GET" }).validator((id) => id).handler(getDeployLog_createServerFn_handler, async ({ data: id }) => {
	const rows = await query("SELECT * FROM deployments WHERE id = ?", [id]);
	if (rows.length === 0) return null;
	return rows[0];
});
var initializeGitRepo_createServerFn_handler = createServerRpc({
	id: "069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164",
	name: "initializeGitRepo",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => initializeGitRepo.__executeServer(opts));
var initializeGitRepo = createServerFn({ method: "POST" }).handler(initializeGitRepo_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
		if (rows.length === 0 || !rows[0].value) throw new Error("Settings not found");
		const settings = JSON.parse(rows[0].value);
		const remoteUrl = settings.gitRemoteUrl;
		const pat = settings.gitAccessToken;
		const branch = settings.gitBranch || "main";
		if (!remoteUrl) throw new Error("Git Remote URL is not configured in Settings.");
		let authUrl = remoteUrl;
		if (pat && remoteUrl.startsWith("https://")) authUrl = remoteUrl.replace("https://", `https://${pat}@`);
		else if (pat && remoteUrl.startsWith("http://")) authUrl = remoteUrl.replace("http://", `http://${pat}@`);
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
});
//#endregion
export { buildProject_createServerFn_handler, getDeployHistory_createServerFn_handler, getDeployLog_createServerFn_handler, getGitStatus_createServerFn_handler, gitPull_createServerFn_handler, initializeGitRepo_createServerFn_handler };
