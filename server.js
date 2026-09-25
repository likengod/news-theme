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

const server = createServer(async (req, res) => {

  try {
    const rawUrl = req.url || "/";
    const parsedPath = rawUrl.split("?")[0];

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

    // Static assets handling from dist/client, public, uploads, or historical assets
    const staticDirs = [
      path.join(__dirname, "dist/client"),
      path.join(__dirname, "public"),
      path.join(__dirname, "uploads"),
      path.join(__dirname, "assets"),
    ];
    for (const baseDir of staticDirs) {
      let filePath = path.join(baseDir, parsedPath);
      // If looking for /assets/<filename>, also check baseDir directly if baseDir is assets
      if (
        !fs.existsSync(filePath) &&
        parsedPath.startsWith("/assets/") &&
        path.basename(baseDir) === "assets"
      ) {
        filePath = path.join(baseDir, path.basename(parsedPath));
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();

        // HOTLINK PROTECTION START
        const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
        if (imageExts.includes(ext)) {
          const referer = req.headers.referer || "";
          const host = req.headers.host || "";

          if (referer) {
            try {
              const refUrl = new URL(referer);
              const refHost = refUrl.hostname.toLowerCase();
              const myHost = host.split(":")[0].toLowerCase(); // remove port

              // Allowlist of allowed referers (social media & search engines)
              const allowedDomains = [
                myHost,
                "localhost",
                "facebook.com",
                "twitter.com",
                "t.co",
                "linkedin.com",
                "pinterest.com",
                "google.", // google.com, google.co.in, etc.
                "bing.com",
                "yahoo.com",
              ];

              const isAllowed = allowedDomains.some((domain) => refHost.includes(domain));

              if (!isAllowed) {
                // Block the hotlink request
                res.statusCode = 403;
                res.setHeader("Content-Type", "text/plain");
                res.end("403 Forbidden: Hotlinking is disabled on this server.");
                return;
              }
            } catch (e) {
              // Invalid referer URL, let it pass or block it (passing is safer)
            }
          }
        }
        // HOTLINK PROTECTION END

        if (MIME_TYPES[ext]) {
          res.setHeader("Content-Type", MIME_TYPES[ext]);
        }
        if (
          parsedPath.startsWith("/assets/") ||
          parsedPath.startsWith("/uploads/") ||
          parsedPath.startsWith("/fonts/") ||
          [".ico", ".svg", ".woff2", ".woff", ".ttf", ".webp", ".jpg", ".png"].includes(ext)
        ) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=2592000");
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

    const host = req.headers.host || "127.0.0.1:3000";
    const proto = req.headers["x-forwarded-proto"] || "http";
    const url = new URL(rawUrl, `${proto}://${host}`);

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
        res.setHeader("Expires", "0");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");

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
    }

    const request = new Request(url, init);
    const response = await serverModule.fetch(request, process.env, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Essential HTTP Security Headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    const contentType = response.headers.get("content-type") || "";
    const isHtml = contentType.includes("text/html");
    if (isHtml) {
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

    // Save to SSR Micro-Cache if eligible (30-second TTL)
    if (isPublicGet && response.status === 200 && isHtml && bodyBuffer.length > 0) {
      try {
        const gzipped = zlib.gzipSync(bodyBuffer, { level: 6 });
        SSR_CACHE.set(cacheKey, {
          html: bodyBuffer,
          gzipped,
          expiry: now + 30 * 1000,
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
  (process.env.PORT && process.env.PORT !== "3306" ? process.env.PORT : 3098);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] Production server listening on http://0.0.0.0:${PORT}`);
});
