import { availableLocales, langDir } from './config/i18n'
import LayerModule from './layer-module'

// import { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  extends: ['layers/vuetify-layer'],
  // ssr: false,
  sourcemap: true,
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['@unocss/nuxt', '@nuxtjs/i18n', LayerModule, 'vuetify-nuxt-module'],
  i18n: {
    locales: availableLocales,
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: false, /* {
      fallbackLocale: 'en-US',
      useCookie: true,
    },
    useCookie: true,
    cookieKey: 'custom-locale', */
    langDir,
    defaultLocale: 'en-US',
    // types: 'composition',
    // pages: undefined,
    dynamicRouteParams: false,
    skipSettingLocaleOnNavigate: false,
    // debug: true,
    vueI18n: '/config/i18n.config.ts',
  },
  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: {
        'v-card': [
          'image',
          'prepend-avatar',
          'append-avatar',
        ],
      },
      ssrClientHints: {
        reloadOnFirstRequest: false,
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          useBrowserThemeOnly: false,
        },
        viewportSize: true,
      },
      // styles: { configFile: 'assets/custom-vuetify.scss' },
    },
  },
  vite: {
    clearScreen: false,
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      target: 'esnext',
    },
    vue: {
      // template: { transformAssetUrls },
      script: {
        propsDestructure: true,
      },
    },
  },
  routeRules: {
    '/no-ssr': { ssr: false },
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
  // css: ['vuetify/styles'],
  // css: ['~/assets/main.scss'],
  future: {
    typescriptBundlerResolution: false,
  },
  features: {
    devLogs: false,
    inlineStyles: false,
  },
  experimental: {
    payloadExtraction: false,
    typedPages: false,
    watcher: 'parcel',
  },
  devtools: {
    enabled: true,
  },
})
