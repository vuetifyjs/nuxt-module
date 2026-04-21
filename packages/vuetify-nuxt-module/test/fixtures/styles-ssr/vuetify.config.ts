import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: { dark: false, colors: {} },
      dark: { dark: true, colors: {} },
    },
  },
})
