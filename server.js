import { createServer } from 'node:http';
import serverModule from './dist/server/server.js';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const rawUrl = req.url || '/';
    const parsedPath = rawUrl.split('?')[0];

    // Special handling for favicon.ico so it never falls into SSR route matching
    if (parsedPath === '/favicon.ico') {
      const icoDirs = [path.join(__dirname, 'public/favicon.ico'), path.join(__dirname, 'dist/client/favicon.ico')];
      for (const icoPath of icoDirs) {
        if (fs.existsSync(icoPath)) {
          res.setHeader('Content-Type', 'image/x-icon');
          res.setHeader('Cache-Control', 'public, max-age=86400');
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
      path.join(__dirname, 'dist/client'),
      path.join(__dirname, 'public'),
      path.join(__dirname, 'uploads'),
      path.join(__dirname, 'assets'),
    ];
    for (const baseDir of staticDirs) {
      let filePath = path.join(baseDir, parsedPath);
      // If looking for /assets/<filename>, also check baseDir directly if baseDir is assets
      if (!fs.existsSync(filePath) && parsedPath.startsWith('/assets/') && path.basename(baseDir) === 'assets') {
        filePath = path.join(baseDir, path.basename(parsedPath));
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        if (MIME_TYPES[ext]) {
          res.setHeader('Content-Type', MIME_TYPES[ext]);
        }
        if (parsedPath.startsWith('/assets/') || parsedPath.startsWith('/uploads/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    // If an asset in /assets/ or /uploads/ is still not found, return 404 immediately without running SSR
    if (parsedPath.startsWith('/assets/') || parsedPath.startsWith('/uploads/')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.end('Asset Not Found');
      return;
    }

    const host = req.headers.host || '127.0.0.1:3000';
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const url = new URL(rawUrl, `${proto}://${host}`);

    const init = {
      method: req.method,
      headers: req.headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
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

    // Ensure HTML documents are never cached so visitors always receive fresh chunk manifests
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();
    const isCompressible = contentType.includes('text/') || 
                           contentType.includes('application/javascript') || 
                           contentType.includes('application/json');

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.removeHeader('Content-Length');
      const gzip = zlib.createGzip({ level: 6 });
      gzip.pipe(res);
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          gzip.write(value);
        }
        gzip.end();
      } else {
        gzip.end();
      }
    } else {
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
    }
  } catch (err) {
    console.error('[Server Error]', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }
});

const PORT = process.env.APP_PORT || (process.env.PORT && process.env.PORT !== '3306' ? process.env.PORT : 3000);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Production server listening on http://0.0.0.0:${PORT}`);
});
