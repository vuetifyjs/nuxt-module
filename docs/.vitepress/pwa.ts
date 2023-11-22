import type { PwaOptions } from '@vite-pwa/vitepress'

export const pwa = {
  outDir: '.vitepress/dist',
  registerType: 'autoUpdate',
  includeManifestIcons: false,
  manifest: {
    id: '/',
    name: 'Vuetify Nuxt Module',
    short_name: 'Vuetify Nuxt Module',
    description: 'Zero-config Nuxt Module for Vuetify',
    theme_color: '#ffffff',
    start_url: '/',
    lang: 'en-US',
    dir: 'ltr',
    orientation: 'natural',
    display: 'standalone',
    display_override: ['window-controls-overlay'],
    categories: ['development', 'developer tools'],
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    handle_links: 'preferred',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    edge_side_panel: {
      preferred_width: 480,
    },
    screenshots: [{
      src: 'og-image.png',
      sizes: '1200x600',
      type: 'image/png',
      label: 'Screenshot of the Vuetify Nuxt Module home page in dark mode',
    }],
  },
  experimental: {
    includeAllowlist: true,
  },
  workbox: {
    globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2,json}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
} satisfies PwaOptions
