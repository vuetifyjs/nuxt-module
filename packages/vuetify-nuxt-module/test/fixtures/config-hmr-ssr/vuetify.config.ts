import process from 'node:process'
import { defineVuetifyConfiguration } from '../../../custom-configuration.mjs'

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: { primary: process.env.HMR_PRIMARY ?? '#ff0000' },
      },
    },
  },
})
