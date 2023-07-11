import { md3 } from 'vuetify/blueprints'
import { availableLocales, langDir } from './config/i18n'
import LayerModule from './layer-module'

export default defineNuxtConfig({
  extends: ['layers/vuetify-layer'],
  ssr: true,
  sourcemap: true,
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['@nuxtjs/i18n', LayerModule, '../src/module'],
  i18n: {
    locales: availableLocales,
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: false, /* {      fallbackLocale: 'en-US',
      useCookie: false,
    } */
    langDir,
    defaultLocale: 'en-US',
    types: 'composition',
    pages: undefined,
    dynamicRouteParams: false,
    skipSettingLocaleOnNavigate: true,
    // debug: true,
    vueI18n: './config/i18n.config.ts',
  },
  vuetify: {
    /* moduleOptions: {
      styles: { configFile: '/settings.scss' },
    }, */
    vuetifyOptions: {
      aliases: {
        MyBadge: 'VBadge',
      },
      directives: true,
      components: ['VDialog'],
      labComponents: ['VDataTable'],
      blueprint: md3,
      theme: {
        defaultTheme: 'light',
      },
      date: {
        // adapter: 'luxon',
        adapter: 'vuetify',
      },
      icons: {
        // remember to comment the v-icon in playground/pages/index.vue when switching
        // defaultSet: 'fa-svg',
        defaultSet: 'mdi-svg',
        svg: {
          mdi: {
            aliases: {
              account: 'mdiAccount',
            },
          },
        },
      },
    },
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      target: 'esnext',
    },
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  app: {
    baseURL: '/',
    head: {
      meta: [
        { charset: 'utf-8' },
      ],
    },
  },
  // css: ['/main.scss'],
  experimental: {
    inlineSSRStyles: false,
    payloadExtraction: false,
    typedPages: false,
    watcher: 'parcel',
  },
  devtools: {
    enabled: true,
  },
})
