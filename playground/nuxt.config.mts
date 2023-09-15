import { availableLocales, langDir } from './config/i18n'
import LayerModule from './layer-module'
// import { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  extends: ['layers/vuetify-layer'],
  ssr: true,
  sourcemap: true,
  imports: {
    autoImport: true,
    injectAtEnd: true,
  },
  modules: ['@unocss/nuxt', '@nuxtjs/i18n', LayerModule, '../src/module'],
  i18n: {
    locales: availableLocales,
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: false, /* {      fallbackLocale: 'en-US',
      useCookie: false,
    } */
    langDir,
    defaultLocale: 'en-US',
    // types: 'composition',
    // pages: undefined,
    dynamicRouteParams: false,
    skipSettingLocaleOnNavigate: false,
    // debug: true,
    vueI18n: './config/i18n.config.ts',
  },
  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: true,
      // styles: { configFile: '/settings.scss' },
    },
  },
  // vuetify: {
  /* moduleOptions: {
      styles: { configFile: '/settings.scss' },
    }, */
  // vuetifyOptions: './vuetify.config.mts',
  /* vuetifyOptions: {
      ssr: {
        clientWidth: 100,
      },
      aliases: {
        MyBadge: 'VBadge',
      },
      directives: true,
      components: ['VDialog', 'VExpansionPanel', 'VExpansionPanelText', 'VExpansionPanelTitle'],
      labComponents: ['VDataTable', 'VDatePickerControls', 'VDatePickerHeader'],
      blueprint: md3,
      /!*locale: {
        messages: {
          en: {
            hello: 'Hi',
            question: {
              one: 'One',
              two: 'Two',
            },
          },
          es: {
            hello: 'Hola',
            question: {
              one: 'Uno',
              two: 'Dos',
              three: 'Tres',
            },
          },
        },
      },
      localeMessages: ['en', 'es', 'ar'],*!/
      theme: {
        defaultTheme: 'light',
      },
      date: {
        adapter: 'luxon',
        // adapter: 'vuetify',
      },
      icons: {
        // remember to comment the v-icon in playground/pages/index.vue when switching
        // defaultSet: 'fa-svg',
        defaultSet: 'unocss-mdi',
        // defaultSet: 'mdi-svg',
        /!*svg: {
          mdi: {
            aliases: {
              account: 'mdiAccount',
            },
          },
        },*!/
      },
    }, */
  // },
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
  // css: ['/main.scss'],
  experimental: {
    inlineSSRStyles: false,
    payloadExtraction: false,
    typedPages: false,
    typescriptBundlerResolution: true,
    watcher: 'parcel',
  },
  devtools: {
    enabled: true,
  }
})
