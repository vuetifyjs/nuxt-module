import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { version } from '../../package.json'
import { pwa } from './pwa'
import { transformHead } from './transform-head'
import { buildEnd, transformHtml } from './sitemap'
import { ogImage, ogUrl } from './constants'

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
  },
  themeConfig: {
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
          text: 'UnoCSS Preset Icons',
          link: '/guide/icons/unocss-preset-icons',
        }, {
          text: 'Font Icons',
          link: '/guide/icons/font-icons',
        }, {
          text: 'SVG Icons',
          link: '/guide/icons/svg-icons',
        }, {
          text: 'Integrations',
          link: '/guide/icons/integrations',
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
    sidebar: [{
      text: 'Guide',
      items: [{
        text: 'Getting Started',
        link: '/guide/',
      }, {
        text: 'Compatibility Matrix',
        link: '/guide/compatibility-matrix',
      }, {
        text: 'Nuxt Layers and Module Hooks',
        link: '/guide/nuxt-layers-and-module-hooks',
      }, {
        text: 'Vuetify Configuration File',
        link: '/guide/vuetify-configuration-file',
      }, {
        text: 'Nuxt Runtime Hooks',
        link: '/guide/nuxt-runtime-hooks',
      }, {
        text: 'Server Side Rendering (SSR)',
        link: '/guide/server-side-rendering',
      }, {
        text: 'Vuetify Locale Messages',
        link: '/guide/vuetify-locale-messages',
      }, {
        text: 'Vuetify Composables',
        link: '/guide/vuetify-composables',
      }, {
        text: 'Vuetify Blueprints',
        link: '/guide/vuetify-blueprints',
      }, {
        text: 'Transform Asset URLs',
        link: '/guide/transform-asset-urls',
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
        collapsed: true,
      }, {
        text: 'Icons',
        link: '/guide/icons/',
        items: [{
          text: 'UnoCSS Preset Icons',
          link: '/guide/icons/unocss-preset-icons',
        }, {
          text: 'Font Icons',
          link: '/guide/icons/font-icons',
        }, {
          text: 'SVG Icons',
          link: '/guide/icons/svg-icons',
        }, {
          text: 'Integrations',
          link: '/guide/icons/integrations',
        }],
        collapsed: true,
      }, {
        text: 'Internationalization',
        link: '/guide/i18n',
      }, {
        text: 'Date Support',
        link: '/guide/date',
      }, {
        text: 'SASS Customization',
        link: '/guide/sass-customization',
      }, {
        text: 'FAQ',
        link: '/guide/faq',
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
