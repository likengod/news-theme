import { createServer } from "node:http";
import serverModule from "./dist/server/server.js";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".map": "application/json",
};

const SSR_CACHE = new Map();

let cachedCssLink = "";
let lastCssCheck = 0;
function getMainCssLink() {
  const now = Date.now();
  if (cachedCssLink && now - lastCssCheck < 30000) return cachedCssLink;
  lastCssCheck = now;
  try {
    const assetsDir = path.join(__dirname, "dist/client/assets");
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const cssFiles = files
        .filter((f) => f.startsWith("styles-") && f.endsWith(".css"))
        .map((f) => {
          try {
            const stat = fs.statSync(path.join(assetsDir, f));
            return { name: f, mtime: stat.mtimeMs };
          } catch {
            return { name: f, mtime: 0 };
          }
        })
        .sort((a, b) => b.mtime - a.mtime);

      if (cssFiles.length > 0) {
        cachedCssLink = `</assets/${cssFiles[0].name}>; rel=preload; as=style`;
      }
    }
  } catch {}
  return cachedCssLink;
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:; font-src 'self' https: data: fonts.gstatic.com; frame-src 'self' https:; frame-ancestors 'self';",
};

function applySecurityHeaders(res) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(key, value);
  }
}

function sendStaticFile(filePath, req, res, host, parsedPath) {
  const ext = path.extname(filePath).toLowerCase();

  // HOTLINK PROTECTION START
  const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"];
  if (imageExts.includes(ext)) {
    const referer = req.headers.referer || "";
    if (referer) {
      try {
        const refUrl = new URL(referer);
        const refHost = refUrl.hostname.toLowerCase();
        const myHost = (host || "").split(":")[0].toLowerCase();
        const allowedDomains = [
          myHost,
          "localhost",
          "127.0.0.1",
          "0.0.0.0",
          "facebook.com",
          "twitter.com",
          "t.co",
          "linkedin.com",
          "pinterest.com",
          "google.",
          "bing.com",
          "yahoo.com",
        ];
        const isAllowed = allowedDomains.some((domain) => refHost.includes(domain));
        if (!isAllowed) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "text/plain");
          res.end("403 Forbidden: Hotlinking is disabled on this server.");
          return;
        }
      } catch (e) {}
    }
  }
  // HOTLINK PROTECTION END

  if (MIME_TYPES[ext]) {
    res.setHeader("Content-Type", MIME_TYPES[ext]);
  }
  if (ext === ".css") {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  } else if (
    parsedPath.startsWith("/assets/") ||
    parsedPath.startsWith("/fonts/") ||
    [".woff2", ".woff", ".ttf", ".otf"].includes(ext)
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (
    parsedPath.startsWith("/uploads/") ||
    [".ico", ".svg", ".webp", ".jpg", ".jpeg", ".png", ".gif"].includes(ext)
  ) {
    res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
  } else {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }

  const compressibleExts = [".css", ".js", ".json", ".svg", ".txt", ".xml", ".html"];
  const acceptEncoding = (req.headers["accept-encoding"] || "").toLowerCase();
  if (compressibleExts.includes(ext) && acceptEncoding.includes("gzip")) {
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Vary", "Accept-Encoding");
    const gzip = zlib.createGzip({ level: 6 });
    fs.createReadStream(filePath).pipe(gzip).pipe(res);
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {

  try {
    const rawUrl = req.url || "/";
    const host = req.headers.host || "127.0.0.1:3000";
    const proto = (req.headers["x-forwarded-proto"] || "http").toLowerCase();

    // 1. HTTP to HTTPS Redirection (Lighthouse: "Redirects HTTP traffic to HTTPS")
    if (
      proto === "http" &&
      !host.startsWith("localhost") &&
      !host.startsWith("127.0.0.1") &&
      !host.startsWith("0.0.0.0")
    ) {
      applySecurityHeaders(res);
      res.statusCode = 301;
      res.setHeader("Location", `https://${host}${rawUrl}`);
      res.end();
      return;
    }

    const parsedPath = rawUrl.split("?")[0];

    // Fast-path health check endpoint (used by updater to verify server alive before reload)
    if (parsedPath === "/api/health" || parsedPath === "/healthz") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.end(JSON.stringify({ status: "ok", time: Date.now() }));
      return;
    }

    // Special handling for favicon.ico so it never falls into SSR route matching
    if (parsedPath === "/favicon.ico") {
      const icoDirs = [
        path.join(__dirname, "public/favicon.ico"),
        path.join(__dirname, "dist/client/favicon.ico"),
      ];
      for (const icoPath of icoDirs) {
        if (fs.existsSync(icoPath)) {
          res.setHeader("Content-Type", "image/x-icon");
          res.setHeader("Cache-Control", "public, max-age=86400");
          fs.createReadStream(icoPath).pipe(res);
          return;
        }
      }
      res.statusCode = 204;
      res.end();
      return;
    }

    // Instant fast-path for /robots.txt (prevents crawler/Lighthouse timeout)
    if (parsedPath === "/robots.txt") {
      const robotsDirs = [
        path.join(__dirname, "public/robots.txt"),
        path.join(__dirname, "dist/client/robots.txt"),
      ];
      for (const rPath of robotsDirs) {
        if (fs.existsSync(rPath)) {
          const content = fs.readFileSync(rPath, "utf-8");
          applySecurityHeaders(res);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
          res.end(content);
          return;
        }
      }
      // Fallback valid robots.txt if physical file is missing
      applySecurityHeaders(res);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/*\nDisallow: /api/*\nDisallow: /setup\nSitemap: https://" + host + "/sitemap.xml\n");
      return;
    }

    let safeParsedPath = "";
    try {
      safeParsedPath = path.normalize(decodeURIComponent(parsedPath)).replace(/\0/g, "");
    } catch {
      safeParsedPath = path.normalize(parsedPath).replace(/\0/g, "");
    }

    // 1. Comprehensive uploads resolution (promos, ads, documents, media)
    if (parsedPath.startsWith("/uploads/")) {
      const uploadSubPath = safeParsedPath.replace(/^[/\\]uploads[/\\]?/, "");
      const fileNameOnly = path.basename(uploadSubPath);
      const possibleUploadPaths = [
        path.join(__dirname, "uploads", uploadSubPath),
        path.join(__dirname, "public", "uploads", uploadSubPath),
        path.join(__dirname, "dist", "client", "uploads", uploadSubPath),
        path.join(__dirname, "uploads", "promos", fileNameOnly),
        path.join(__dirname, "uploads", "ads", fileNameOnly),
        path.join(__dirname, "uploads", "documents", fileNameOnly),
        path.join(__dirname, "uploads", fileNameOnly),
        path.join(__dirname, "public", "uploads", "promos", fileNameOnly),
        path.join(__dirname, "public", "uploads", "ads", fileNameOnly),
        path.join(__dirname, "dist", "client", "uploads", "promos", fileNameOnly),
        path.join(__dirname, "dist", "client", "uploads", "ads", fileNameOnly),
      ];

      for (const candidate of possibleUploadPaths) {
        if (fs.existsSync(candidate)) {
          try {
            if (fs.statSync(candidate).isFile()) {
              sendStaticFile(candidate, req, res, host, parsedPath);
              return;
            }
          } catch {}
        }
      }
    }

    // 2. Direct media file fallback for /media_*.webp / .png / .jpg
    const ext = path.extname(safeParsedPath).toLowerCase();
    if (
      !parsedPath.startsWith("/api/") &&
      !parsedPath.startsWith("/admin") &&
      [".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".avif"].includes(ext)
    ) {
      const fileNameOnly = path.basename(safeParsedPath);
      const mediaCandidates = [
        path.join(__dirname, "uploads", "promos", fileNameOnly),
        path.join(__dirname, "uploads", "ads", fileNameOnly),
        path.join(__dirname, "uploads", "documents", fileNameOnly),
        path.join(__dirname, "uploads", fileNameOnly),
        path.join(__dirname, "public", "uploads", "promos", fileNameOnly),
        path.join(__dirname, "dist", "client", "uploads", "promos", fileNameOnly),
      ];
      for (const candidate of mediaCandidates) {
        if (fs.existsSync(candidate)) {
          try {
            if (fs.statSync(candidate).isFile()) {
              sendStaticFile(candidate, req, res, host, parsedPath);
              return;
            }
          } catch {}
        }
      }
    }

    // 3. Stylesheet hash fallback: if older styles-*.css is requested by cached HTML, serve active CSS
    if (parsedPath.startsWith("/assets/styles-") && parsedPath.endsWith(".css")) {
      const assetsDir = path.join(__dirname, "dist/client/assets");
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const currentCss = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
        if (currentCss) {
          const fallbackPath = path.join(assetsDir, currentCss);
          if (fs.existsSync(fallbackPath)) {
            sendStaticFile(fallbackPath, req, res, host, parsedPath);
            return;
          }
        }
      }
    }

    // 4. General static assets handling from dist/client, public, assets
    const staticDirs = [
      path.join(__dirname, "dist/client"),
      path.join(__dirname, "public"),
      path.join(__dirname, "assets"),
    ];

    for (const baseDir of staticDirs) {
      const safeBase = path.resolve(baseDir);
      let filePath = path.resolve(
        safeBase,
        "." + (safeParsedPath.startsWith(path.sep) ? safeParsedPath : path.sep + safeParsedPath),
      );

      // Path traversal containment check
      if (!filePath.startsWith(safeBase + path.sep) && filePath !== safeBase) {
        continue;
      }

      // If looking for /assets/<filename>, also check baseDir directly if baseDir is assets
      if (
        !fs.existsSync(filePath) &&
        parsedPath.startsWith("/assets/") &&
        path.basename(baseDir) === "assets"
      ) {
        const directAssetPath = path.resolve(safeBase, path.basename(safeParsedPath));
        if (directAssetPath.startsWith(safeBase + path.sep)) {
          filePath = directAssetPath;
        }
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        sendStaticFile(filePath, req, res, host, parsedPath);
        return;
      }
    }

    // If an asset in /assets/ or /uploads/ is still not found, return 404 immediately without running SSR
    if (parsedPath.startsWith("/assets/") || parsedPath.startsWith("/uploads/")) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.end("Asset Not Found");
      return;
    }

    const url = new URL(rawUrl, `${proto}://${host}`);
    process.env.APP_ORIGIN = `${proto}://${host}`;

    // Fast-path: SSR In-Memory Micro-Cache for public anonymous HTML GET requests
    const isPublicGet =
      req.method === "GET" &&
      !parsedPath.startsWith("/api/") &&
      !parsedPath.startsWith("/_serverFn") &&
      !parsedPath.startsWith("/admin") &&
      !parsedPath.startsWith("/setup") &&
      !(req.headers.cookie && (req.headers.cookie.includes("nt_session") || req.headers.cookie.includes("session_token")));

    const cacheKey = parsedPath;
    const now = Date.now();
    if (isPublicGet && SSR_CACHE.has(cacheKey)) {
      const cached = SSR_CACHE.get(cacheKey);
      if (cached && now < cached.expiry) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        applySecurityHeaders(res);
        const cssLink = getMainCssLink();
        if (cssLink) res.setHeader("Link", cssLink);

        const acceptEncoding = (req.headers["accept-encoding"] || "").toLowerCase();
        if (acceptEncoding.includes("gzip") && cached.gzipped) {
          res.setHeader("Content-Encoding", "gzip");
          res.setHeader("Vary", "Accept-Encoding");
          res.end(cached.gzipped);
          return;
        }
        res.end(cached.html);
        return;
      } else {
        SSR_CACHE.delete(cacheKey);
      }
    }

    const init = {
      method: req.method,
      headers: req.headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      init.body = Buffer.concat(chunks);
      // Auto-purge SSR micro-cache on mutations so edits are immediately visible
      SSR_CACHE.clear();
    }

    const request = new Request(url, init);
    const t0 = Date.now();
    const response = await serverModule.fetch(request, process.env, {});
    const t1 = Date.now();
    console.log(`[Perf] serverModule.fetch took ${t1 - t0}ms`);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    applySecurityHeaders(res);

    const contentType = response.headers.get("content-type") || "";
    console.log(`[SSR] Content-Type: "${contentType}", Status: ${response.status}, isPublicGet: ${isPublicGet}`);
    const isHtml = contentType.includes("text/html");
    if (isHtml) {
      const cssLink = getMainCssLink();
      if (cssLink) res.setHeader("Link", cssLink);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    // Read full response body
    let bodyBuffer = Buffer.alloc(0);
    if (response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(Buffer.from(value));
      }
      bodyBuffer = Buffer.concat(chunks);
    }

    // Save to SSR Micro-Cache if eligible (120-second TTL)
    if (isPublicGet && response.status === 200 && isHtml && bodyBuffer.length > 0) {
      try {
        const gzipped = zlib.gzipSync(bodyBuffer, { level: 6 });
        SSR_CACHE.set(cacheKey, {
          html: bodyBuffer,
          gzipped,
          expiry: now + 120 * 1000,
        });
        if (SSR_CACHE.size > 200) {
          // Prune oldest
          const firstKey = SSR_CACHE.keys().next().value;
          if (firstKey) SSR_CACHE.delete(firstKey);
        }
      } catch {}
    }

    const acceptEncoding = (req.headers["accept-encoding"] || "").toLowerCase();
    const isCompressible =
      contentType.includes("text/") ||
      contentType.includes("application/javascript") ||
      contentType.includes("application/json");

    if (isCompressible && acceptEncoding.includes("gzip")) {
      res.setHeader("Content-Encoding", "gzip");
      res.removeHeader("Content-Length");
      const gzipped = zlib.gzipSync(bodyBuffer, { level: 6 });
      res.end(gzipped);
      return;
    } else {
      res.end(bodyBuffer);
      return;
    }

  } catch (err) {
    console.error("[Server Error]", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      const rawUrl = req.url || "/";
      const isServerFnOrApi =
        rawUrl.includes("/_serverFn") ||
        rawUrl.includes("_serverFn=") ||
        rawUrl.includes("/api/") ||
        req.headers["x-tss-server-function"] != null ||
        (req.headers["accept"] || "").includes("application/json");

      if (isServerFnOrApi) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        const errPayload = {
          error: err?.message || "Internal Server Error",
          success: false,
          updated: false,
        };
        res.end(
          JSON.stringify({
            ...errPayload,
            data: errPayload,
            result: errPayload,
          }),
        );
      } else {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Internal Server Error");
      }
    }
  }
});

const PORT =
  process.env.APP_PORT ||
  (process.env.PORT && process.env.PORT !== "3306" ? process.env.PORT : 3085);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Production server listening on http://0.0.0.0:${PORT}`);
});
