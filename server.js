import { createServer } from 'node:http';
import serverModule from './dist/server/server.js';
import fs from 'node:fs';
import path from 'node:path';
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
};

const server = createServer(async (req, res) => {
  try {
    const rawUrl = req.url || '/';
    const parsedPath = rawUrl.split('?')[0];

    // Static assets handling
    if (parsedPath.startsWith('/assets/') || parsedPath === '/favicon.ico' || parsedPath.startsWith('/images/')) {
      const filePath = path.join(__dirname, 'dist/client', parsedPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        if (MIME_TYPES[ext]) {
          res.setHeader('Content-Type', MIME_TYPES[ext]);
        }
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        fs.createReadStream(filePath).pipe(res);
        return;
      }
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

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
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
