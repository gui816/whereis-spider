import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages serves this project from /whereis-spider/
  base: '/whereis-spider/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Onde está a aranha?', short_name: 'Aranha',
        description: 'Pequenas descobertas na floresta.',
        theme_color: '#9ce7cf', background_color: '#e7fff4',
        display: 'standalone', orientation: 'any', start_url: '/whereis-spider/',
        icons: [{ src: '/whereis-spider/spider-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      },
      workbox: { navigateFallback: 'index.html' }
    })
  ]
});