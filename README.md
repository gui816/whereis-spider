# Onde está a aranha? 🕷️

A small, touch-first hide-and-seek game for toddlers, built with React, TypeScript, Vite and PWA support.

## Run locally
Requires Node.js 20+.
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## GitHub Pages
This repository is configured for the project URL `https://gui816.github.io/whereis-spider/`. A GitHub Actions workflow builds and deploys the `dist/` directory whenever code is pushed to `main`.

In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.

## PWA installation
After deployment, Android users can use the browser's install option. On iOS, open the site in Safari and select **Share → Add to Home Screen**. Install support and offline behavior should be tested on real devices.

## Current MVP
- Six hiding places with a randomized target
- Positive feedback and celebration state
- Optional synthesized sound effects
- A hint after several attempts
- Responsive, large touch targets
- PWA manifest and service worker
