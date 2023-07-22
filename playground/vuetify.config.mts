import { md3 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from '../custom-configuration'

export default defineVuetifyConfiguration({
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
    /* svg: {
      mdi: {
        aliases: {
          account: 'mdiAccount',
        },
      },
    }, */
  },
})
