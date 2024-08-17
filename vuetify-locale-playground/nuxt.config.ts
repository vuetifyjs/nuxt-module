export default defineNuxtConfig({
  compatibilityDate: '2024-08-15',
  // ssr: false,
  sourcemap: true,
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['@nuxtjs/i18n', 'vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      prefixComposables: true,
    },
  },
  i18n: {
    // if not using RTL, you can replace locales with codes only
    // locales: ['en', 'es', 'ar'],
    locales: [{
      code: 'en',
      name: 'English',
    }, {
      code: 'es',
      name: 'Español',
    }, {
      code: 'ar',
      name: 'العربية',
      dir: 'rtl',
    }],
    defaultLocale: 'en',
    strategy: 'no_prefix', // or 'prefix_except_default'
    vueI18n: './i18n.config.ts',
  },
  vite: {
    clearScreen: false,
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      target: 'esnext',
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
  future: {
    typescriptBundlerResolution: true,
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
