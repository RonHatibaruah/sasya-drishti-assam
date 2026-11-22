# Cloudflare Pages Deployment Guide: SasyaDrishti (শস্য দৃষ্টি)

This project is fully configured for deployment on **Cloudflare Pages** with single-page application (SPA) routing, security headers, and instant edge caching.

---

## Method 1: Git-Connected Deployment via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare:**
   - Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.

2. **Select GitHub Repository:**
   - Select `RonHatibaruah/sasya-drishti-assam`.

3. **Configure Build Settings:**
   - **Project Name:** `sasya-drishti` (or `sasya-drishti-assam`)
   - **Production Branch:** `main`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
   - **Environment Variables:**
     - `NODE_VERSION`: `20.18.0`

4. **Click "Save and Deploy":**
   - Cloudflare will clone, build, and deploy the application worldwide in under 60 seconds.
   - Your live site will be accessible at: `https://sasya-drishti.pages.dev` (or your custom domain).

---

## Method 2: Direct CLI Deployment via Wrangler

If you have the Cloudflare Wrangler CLI installed:

```bash
# 1. Install dependencies & build production assets
npm install
npm run build

# 2. Login to Cloudflare
npx wrangler login

# 3. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=sasya-drishti
```

---

## Included Cloudflare Configuration Files

- **`wrangler.toml`**: Specifies project name and `pages_build_output_dir = "dist"`.
- **`public/_headers`**: Configures security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- **`public/_redirects`**: Single-Page App (SPA) redirect rule `/* /index.html 200` to prevent 404s on browser reloads or hash links.
