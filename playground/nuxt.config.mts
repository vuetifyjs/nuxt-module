import { md3 } from 'vuetify/blueprints'
import { i18n } from './config/i18n'

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
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['@nuxtjs/i18n', '../src/module'],
  i18n,
  vuetify: {
    moduleOptions: {
      styles: { configFile: '/settings.scss' },
    },
    vuetifyOptions: {
      directives: true,
      labComponents: ['VDataTable'],
      blueprint: md3,
      icons: {
        defaultSet: undefined,
        sets: undefined,
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
