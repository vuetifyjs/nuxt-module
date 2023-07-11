import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { pwa } from './pwa'
import { transformHead } from './transform-head'
import { buildEnd, transformHtml } from './sitemap'

export default withPwa(defineConfig({
  lang: 'en-US',
  title: 'Vuetify Nuxt Module',
  description: 'Zero-config Nuxt Module for Vuetify',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Joaquín Sánchez' }],
    ['meta', {
      name: 'keywords',
      content: 'vuetify, vuetify3, nuxt, nuxt 3, nuxt module',
    }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vuetify Nuxt Module' }],
    // ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:description', content: 'Zero-config Nuxt Module for Vuetify' }],
    // ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { name: 'twitter:description', content: 'Zero-config Nuxt Module for Vuetify' }],
    ['meta', { name: 'twitter:title', content: 'Vuetify Nuxt Module' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:site', content: '@userquin' }],
    // ['meta', { name: 'twitter:url', content: ogUrl }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/userquin/vuetify-nuxt-module/docs/edit/main/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/userquin/vuetify-nuxt-module/docs' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Joaquín Sánchez',
    },
    /* nav: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            link: '/guide/',
            activeMatch: '^/guide/',
          },
          {
            text: 'PWA Assets Generator',
            link: '/assets-generator/',
            activeMatch: '^/assets-generator/',
          },
          {
            text: 'Frameworks',
            link: '/frameworks/',
            activeMatch: '^/frameworks/',
          },
          {
            text: 'Examples',
            link: '/examples/',
            activeMatch: '^/examples/',
          },
        ],
        activeMatch: '^/(guide|assets-generator|frameworks|examples)/',
      },
      {
        text: 'Deploy',
        link: '/deployment/',
        activeMatch: '^/deployment/',
      },
      {
        text: 'Workbox',
        link: '/workbox/',
        activeMatch: '^/workbox/',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Vite Plugin PWA',
            items: [
              {
                text: 'Release Notes',
                link: 'https://github.com/vite-pwa/vite-plugin-pwa/releases',
              },
              {
                text: 'Contributing',
                link: 'https://github.com/vite-pwa/vite-plugin-pwa/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            text: 'îles Module',
            items: [
              {
                text: 'Github',
                link: 'https://github.com/ElMassimo/iles/tree/main/packages/pwa',
              },
              {
                text: 'Documentation',
                link: 'https://iles-docs.netlify.app/guide/pwa',
              },
            ],
          },
          {
            text: 'Integrations',
            items: [
              {
                text: 'SvelteKit',
                link: 'https://github.com/vite-pwa/sveltekit',
              },
              {
                text: 'VitePress',
                link: 'https://github.com/vite-pwa/vitepress',
              },
              {
                text: 'Astro',
                link: 'https://github.com/vite-pwa/astro',
              },
              {
                text: 'Nuxt 3',
                link: 'https://github.com/vite-pwa/nuxt',
              },
            ],
          },
        ],
      },
    ], */
    // sidebar: {
    //   '/guide/': prepareSidebar(0),
    //   '/assets-generator/': prepareSidebar(1),
    //   '/frameworks/': prepareSidebar(2),
    //   '/examples/': prepareSidebar(3),
    //   '/deployment/': prepareSidebar(4),
    //   '/workbox/': prepareSidebar(5),
    // },
  },
  vite: {
    logLevel: 'info',
  },
  pwa,
  buildEnd,
  transformHead,
  transformHtml,
}))
