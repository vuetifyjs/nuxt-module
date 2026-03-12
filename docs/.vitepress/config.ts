import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'
import { version } from '../../package.json'
import { ogImage, ogUrl } from './constants'
import { pwa } from './pwa'
import { buildEnd, transformHtml } from './sitemap'
import { transformHead } from './transform-head'

export default withPwa(defineConfig({
  lang: 'en-US',
  title: 'Vuetify Nuxt Module',
  description: 'Zero-config Nuxt Module for Vuetify',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'icon', href: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { name: 'author', content: 'Joaquín Sánchez' }],
    ['meta', { name: 'keywords', content: 'vuetify, vuetify 3, nuxt, nuxt 3, nuxt module' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vuetify Nuxt Module' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:description', content: 'Zero-config Nuxt Module for Vuetify' }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { name: 'twitter:description', content: 'Zero-config Nuxt Module for Vuetify' }],
    ['meta', { name: 'twitter:title', content: 'Vuetify Nuxt Module' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:site', content: '@userquin' }],
    ['meta', { name: 'twitter:url', content: ogUrl }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config (md) {
      md.use(copyOrDownloadAsMarkdownButtons)
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/vuetifyjs/nuxt-module/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuetifyjs/nuxt-module' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Joaquín Sánchez',
    },
    nav: [
      {
        text: 'Configuration',
        link: '/guide/configuration/vuetify-options',
      },
      {
        text: 'Features',
        items: [
          { text: 'Globals', link: '/guide/features/globals/' },
          { text: 'Icons', link: '/guide/features/icons/' },
          { text: 'I18N', link: '/guide/features/i18n' },
          { text: 'Date', link: '/guide/features/date' },
          { text: 'SSR', link: '/guide/features/ssr' },
        ],
      },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Vuetify Nuxt Module',
            items: [
              {
                text: 'Release Notes',
                link: 'https://github.com/vuetifyjs/nuxt-module/releases',
              },
              {
                text: 'Contributing',
                link: 'https://github.com/vuetifyjs/nuxt-module/blob/main/CONTRIBUTING.md',
              },
              {
                text: 'FAQ',
                link: '/guide/faq',
              },
            ],
          },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Compatibility Matrix', link: '/guide/getting-started/compatibility' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'Vuetify Options', link: '/guide/configuration/vuetify-options' },
          { text: 'Blueprints', link: '/guide/configuration/blueprints' },
          { text: 'Transform Asset URLs', link: '/guide/configuration/transform-assets' },
        ],
      },
      {
        text: 'Styling',
        items: [
          { text: 'Common Setup', link: '/guide/styling/common-setup' },
          { text: 'SASS Customization', link: '/guide/styling/sass' },
          { text: 'Experimental Cache', link: '/guide/styling/caching' },
          { text: 'UnoCSS and Tailwind', link: '/guide/styling/other-frameworks' },
        ],
      },
      {
        text: 'Features',
        items: [
          {
            text: 'Globals',
            collapsed: true,
            link: '/guide/features/globals/',
            items: [
              { text: 'Global Components', link: '/guide/features/globals/global-components' },
              { text: 'Directives', link: '/guide/features/globals/directives' },
              { text: 'Lab Components', link: '/guide/features/globals/lab-components' },
              { text: 'Composables', link: '/guide/features/globals/composables' },
            ],
          },
          {
            text: 'Icons',
            collapsed: true,
            link: '/guide/features/icons/',
            items: [
              { text: 'UnoCSS Preset Icons', link: '/guide/features/icons/unocss-preset-icons' },
              { text: 'Font Icons', link: '/guide/features/icons/font-icons' },
              { text: 'SVG Icons', link: '/guide/features/icons/svg-icons' },
              { text: 'Integrations', link: '/guide/features/icons/integrations' },
            ],
          },
          { text: 'Internationalization', link: '/guide/features/i18n' },
          { text: 'Date Support', link: '/guide/features/date' },
          { text: 'SSR', link: '/guide/features/ssr' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Layers & Module Hooks', link: '/guide/advanced/layers-and-hooks' },
          { text: 'Runtime Hooks', link: '/guide/advanced/runtime-hooks' },
          { text: 'Locale Messages', link: '/guide/advanced/locale-messages' },
        ],
      },
    ],
  },
  vite: {
    logLevel: 'info',
    plugins: [llmstxt()],
  },
  pwa,
  buildEnd,
  transformHead,
  transformHtml,
}))
