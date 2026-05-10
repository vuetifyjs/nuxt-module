import { defineVuetifyConfiguration } from '../../../custom-configuration.mjs'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: { dark: false, colors: {} },
      dark: { dark: true, colors: {} },
    },
  },
})
