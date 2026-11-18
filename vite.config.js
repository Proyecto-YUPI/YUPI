import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { replyJson, sendDemoRequest } from './server/send-demo-request.js';

const privateKeys = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'YUPPI_DEMO_RECIPIENT'];

function resendApiPlugin() {
  const middleware = (request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/send-demo-request') return next();
    sendDemoRequest(request)
      .then((result) => replyJson(response, result.status, result.body))
      .catch(() => replyJson(response, 500, { error: 'Email delivery failed.' }));
  };

  return {
    name: 'yuppi-resend-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of privateKeys) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }
  return { plugins: [react(), tailwindcss(), resendApiPlugin()] };
});
