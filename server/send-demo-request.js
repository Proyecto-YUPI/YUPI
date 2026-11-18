import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildDemoRequestEmail } from './demo-request-email.js';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const requestsByIp = new Map();
const fields = [
  ['name', 'Nombre', 100],
  ['business', 'Negocio', 150],
  ['email', 'Correo', 254],
  ['industry', 'Industria', 100],
  ['message', 'Mensaje', 2000],
];

async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return JSON.parse(request.body);

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8192) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function checkRateLimit(request) {
  const forwardedFor = request.headers?.['x-forwarded-for'];
  const address = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim();
  const ip = address || request.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (requestsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return false;
  recent.push(now);
  requestsByIp.set(ip, recent);
  return true;
}

function validate(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const values = {};
  for (const [key, , limit] of fields) {
    if (typeof payload[key] !== 'string') return null;
    values[key] = payload[key].trim();
    if (!values[key] || values[key].length > limit) return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return null;
  return values;
}

export async function sendDemoRequest(request) {
  if (request.method !== 'POST') return { status: 405, body: { error: 'Method not allowed.' } };
  if (!request.headers?.['content-type']?.includes('application/json')) {
    return { status: 415, body: { error: 'JSON is required.' } };
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    return { status: error.status ?? 400, body: { error: 'Invalid request.' } };
  }

  // Quietly ignore bots that fill the visually hidden form field.
  if (typeof payload.website === 'string' && payload.website.trim()) {
    return { status: 200, body: { sent: true } };
  }

  const values = validate(payload);
  if (!values) return { status: 400, body: { error: 'Please check the form fields.' } };
  if (!checkRateLimit(request)) return { status: 429, body: { error: 'Please wait before sending another request.' } };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.YUPPI_DEMO_RECIPIENT;
  if (!apiKey || !from || !recipient) {
    return { status: 503, body: { error: 'Email delivery is not configured.' } };
  }

  const { html, text } = buildDemoRequestEmail(values);
  const logoPath = fileURLToPath(new URL('../public/yuppi-symbol.svg', import.meta.url));
  const logo = readFileSync(logoPath).toString('base64');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: values.email,
        subject: 'Nueva solicitud de demostración · YUPPI',
        text,
        html,
        attachments: [{
          filename: 'yuppi-logo.svg',
          content: logo,
          content_type: 'image/svg+xml',
          content_id: 'yuppi-logo',
        }],
      }),
    });
    if (!response.ok) return { status: 502, body: { error: 'Email delivery failed.' } };
    return { status: 200, body: { sent: true } };
  } catch {
    return { status: 502, body: { error: 'Email delivery failed.' } };
  }
}

export function replyJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}
