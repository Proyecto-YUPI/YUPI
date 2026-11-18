# YUPPI

Responsive bilingual landing page for YUPPI's AI-powered commerce infrastructure. English is the default language; visitors can switch to Spanish from the header. The visual identity follows the supplied owl logo reference with a mint, green, teal and navy palette.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## Product concept

The landing includes a local interactive product concept with fictional catalogs for a hardware store, pharmacy, restaurant and shop. Visitors can check a sample product's price and stock, prepare a sample order, and confirm it to update the sample inventory. The sample has no connection to WhatsApp, a live database, payment processing or real inventory.

The demo request form sends the visitor's name, business, email, industry and message through Resend to the private `YUPPI_DEMO_RECIPIENT` address. The recipient and Resend API key stay on the server; the page never displays the recipient. The server does not keep a database of submissions.

### Configure email delivery

1. Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `YUPPI_DEMO_RECIPIENT`. Keep these values private; the sender must be verified in Resend.
2. Run `npm.cmd run dev`. The Vite middleware handles the email endpoint locally.
3. For a Vercel deployment, add the same three environment variables in the project's server environment. `api/send-demo-request.js` handles production submissions.

The endpoint validates fields, applies a small per-IP rate limit and ignores requests that fill its hidden honeypot field. Resend sends the email directly; the visitor stays on the landing page and sees a success or error status.

## Verify

```powershell
npm.cmd run build
npm.cmd test
```

Desktop and mobile hero screenshots are in `artifacts/`. There is no lint script in the current package configuration.

## Main files

- `src/main.jsx`: landing page, language selector, concept demo and demo-request form.
- `server/send-demo-request.js`: private Resend integration and request validation.
- `api/send-demo-request.js`: Vercel serverless endpoint for production.
- `src/styles.css`: responsive brand system and layout.
- `src/demo.js`: sample product catalogs and order validation.
- `src/demo.test.js`: checks sample stock changes, totals and overselling protection.
- `index.html`: search and social sharing metadata.
- `public/yuppi-logo.svg` and `public/yuppi-symbol.svg`: vector brand lockup and owl symbol based on the supplied logo reference.
