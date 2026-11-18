import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { replyJson, sendDemoRequest } from './send-demo-request.js';

const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(response, filePath, status = 200) {
  response.statusCode = status;
  response.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream');
  createReadStream(filePath).pipe(response);
}

async function serveStatic(request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const requested = resolve(join(root, normalize(pathname)));
  const safePath = requested === root || requested.startsWith(`${root}/`);
  if (!safePath) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let filePath = requested;
  try {
    const metadata = await stat(filePath);
    if (metadata.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    filePath = join(root, 'index.html');
  }

  try {
    await stat(filePath);
    sendFile(response, filePath);
  } catch {
    response.writeHead(404).end('Not found');
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;

  if (pathname === '/health') {
    replyJson(response, 200, { status: 'ok' });
    return;
  }

  if (pathname === '/api/send-demo-request') {
    try {
      const result = await sendDemoRequest(request);
      replyJson(response, result.status, result.body);
    } catch {
      replyJson(response, 500, { error: 'Email delivery failed.' });
    }
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  await serveStatic(request, response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`YUPI listening on port ${port}`);
});
