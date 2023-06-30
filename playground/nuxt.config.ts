import { md3 } from 'vuetify/blueprints'

export default defineNuxtConfig({
  ssr: true,
  sourcemap: true,
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },
  modules: ['../src/module'],
  vuetify: {
    moduleOptions: {
      autoImport: true,
      styles: { configFile: '/settings.scss' },
    },
    vuetifyOptions: {
      blueprint: md3,
      icons: {
        defaultSet: undefined,
      },
      theme: {
        defaultTheme: 'light',
      },
    },
  },
  vite: {
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
  css: ['/main.scss'],
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
