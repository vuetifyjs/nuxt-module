import { md3 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  ssr: {
    clientWidth: 100,
  },
  defaults: {
    VBtn: { color: 'blue' },
  },
  aliases: {
    MyBadge: 'VBadge',
  },
  directives: ['ClickOutside', 'Resize', 'Ripple'],
  components: ['VDialog', 'VExpansionPanel', 'VExpansionPanelText', 'VExpansionPanelTitle'],
  // labComponents: ['VDataTable', 'VDatePickerControls', 'VDatePickerHeader'],
  blueprint: md3,
  /* locale: {
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
  localeMessages: ['en', 'es', 'ar'], */
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
      },
      dark: {
        dark: true,
      },
    },
  },
  date: {
    // adapter: 'date-fns',
    // adapter: 'luxon',
    adapter: 'vuetify',
  },
  icons: {
    // remember to comment the v-icon in playground/pages/index.vue when switching
    // defaultSet: 'fa-svg',
    // custom unocss-mdi icon set implementation: check custom-unocss-mdi.ts plugin
    defaultSet: 'custom',
    /* defaultSet: 'mdi',
    sets: [{
      name: 'mdi',
      cdn: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
    }], */
    // defaultSet: 'unocss-mdi',
    // defaultSet: 'mdi-svg',
    /* svg: {
      mdi: {
        aliases: {
          account: 'mdiAccount',
        },
      },
    }, */
  },
})
