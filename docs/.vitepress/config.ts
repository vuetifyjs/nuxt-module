import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { version } from '../../package.json'
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
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
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
    nav: [
      {
        text: 'Getting Started',
        link: '/guide/',
      }, {
        text: 'Globals',
        items: [{
          text: 'Globals',
          link: '/guide/globals/',
        }, {
          text: 'Global Components',
          link: '/guide/globals/global-components',
        }, {
          text: 'Directives',
          link: '/guide/globals/directives',
        }, {
          text: 'Lab Components',
          link: '/guide/globals/lab-components',
        }],
      }, {
        text: 'Icons',
        items: [{
          text: 'Icons',
          link: '/guide/icons/',
        }, {
          text: 'Font Icons',
          link: '/guide/icons/font-icons',
        }, {
          text: 'SVG Icons',
          link: '/guide/icons/svg-icons',
        }],
      },
      {
        text: 'I18N',
        link: '/guide/i18n',
      },
      {
        text: 'Date',
        link: '/guide/date',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Vuetify Nuxt Module',
            items: [
              {
                text: 'Release Notes',
                link: 'https://github.com/userquin/vuetify-nuxt-module/releases',
              },
              {
                text: 'Contributing',
                link: 'https://github.com/userquin/vuetify-nuxt-module/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
    ],
    sidebar: [{
      text: 'Guide',
      items: [{
        text: 'Getting Started',
        link: '/guide/',
      }, {
        text: 'Globals',
        link: '/guide/globals/',
        items: [{
          text: 'Global Components',
          link: '/guide/globals/global-components',
        }, {
          text: 'Directives',
          link: '/guide/globals/directives',
        }, {
          text: 'Lab Components',
          link: '/guide/globals/lab-components',
        }],
      }, {
        text: 'Icons',
        link: '/guide/icons/',
        items: [{
          text: 'Font Icons',
          link: '/guide/icons/font-icons',
        }, {
          text: 'SVG Icons',
          link: '/guide/icons/svg-icons',
        }],
      }, {
        text: 'I18N',
        link: '/guide/i18n',
      }, {
        text: 'Date Support',
        link: '/guide/date',
      }],
    }],
  },
  vite: {
    logLevel: 'info',
  },
  pwa,
  buildEnd,
  transformHead,
  transformHtml,
}))
