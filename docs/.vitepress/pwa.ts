import type { PwaOptions } from '@vite-pwa/vitepress'

export const pwa = {
  disable: true,
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
    /* screenshots: [{
      src: 'og-image.png',
      sizes: '1200x630',
      type: 'image/png',
      label: 'Screenshot of Zero-config Nuxt Module for Vuetify',
    }],
    shortcuts: [{
      name: 'Getting Started',
      description: 'Concepts and useful links for PWA (Progressive web applications): PWA made easy',
      url: '/guide/',
      icons: [{
        src: 'shortcuts/guide.png',
        sizes: '96x96',
        type: 'image/png',
      }],
    }, {
      name: 'Assets Generator',
      description: 'Generate all the PWA assets from a single command and a single source image',
      url: '/assets-generator/',
      icons: [{
        src: 'shortcuts/assets.png',
        sizes: '96x96',
        type: 'image/png',
      }],
    }, {
      name: 'Frameworks',
      description: 'All modern frameworks are supported: VanillaJS, TypeScript, Vue, React, Preact, Svelte, Solid, Web Components',
      url: '/frameworks/',
      icons: [{
        src: 'shortcuts/frameworks.png',
        sizes: '96x96',
        type: 'image/png',
      }],
    }, {
      name: 'Deploy',
      description: 'Hints about how to deploy your PWA',
      url: '/deployment/',
      icons: [{
        src: 'shortcuts/deploy.png',
        sizes: '96x96',
        type: 'image/png',
      }],
    }, {
      name: 'Workbox',
      description: 'Production-ready service worker libraries and tooling.',
      url: '/workbox/',
      icons: [{
        src: 'shortcuts/workbox.png',
        sizes: '96x96',
        type: 'image/png',
      }],
    }], */
    handle_links: 'preferred',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    edge_side_panel: {
      preferred_width: 480,
    },
  },
  workbox: {
    globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
    globIgnores: ['shortcuts/*.svg'],
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
