import process from 'node:process'
import { fileURLToPath } from 'node:url'
import MyModule from '../../../src/module'

const mode = process.env.STYLES_MODE ?? 'none'

const stylesOption
  = mode === 'configFile'
    ? {
        configFile: fileURLToPath(
          new URL('assets/settings.scss', import.meta.url),
        ),
      }
    : 'none' as const

export default defineNuxtConfig({
  modules: [MyModule],
  ssr: true,
  vuetify: {
    moduleOptions: {
      styles: stylesOption,
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          defaultTheme: 'light',
          darkThemeName: 'dark',
          lightThemeName: 'light',
          cookieName: 'color-scheme',
        },
      },
    },
  },
})
