import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Для project site на GitHub Pages задайте VITE_BASE=/имя-репо/
// По умолчанию './' + HashRouter — работает и локально, и на Pages.
const base = process.env.VITE_BASE || './'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
        'icons/apple-touch-icon.png',
        'icons/app-icon.svg',
        'icons/app-icon-maskable.svg',
      ],
      manifest: {
        id: './',
        name: 'ATM БТК',
        short_name: 'ATM БТК',
        description: 'Демо мобильного рабочего места выездных бригад (PWA, mock)',
        theme_color: '#663479',
        background_color: '#663479',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        lang: 'ru',
        dir: 'ltr',
        categories: ['business', 'productivity'],
        prefer_related_applications: false,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
