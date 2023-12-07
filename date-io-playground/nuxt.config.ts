export default defineNuxtConfig({
  // ssr: false,
  sourcemap: true,
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      prefixComposables: true,
    },
    vuetifyOptions: {
      date: {
        adapter: 'hijri',
      },
      locale: {
        locale: 'es',
      },
      localeMessages: ['es'],
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
  experimental: {
    inlineSSRStyles: false,
    payloadExtraction: false,
    typedPages: false,
    typescriptBundlerResolution: true,
    watcher: 'parcel',
  },
  devtools: {
    enabled: true,
  },
})
