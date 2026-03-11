import { fileURLToPath } from 'node:url'
import MyModule from '../../../src/module'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5,
  },
  modules: [MyModule],
  vuetify: {
    moduleOptions: {
      /* other module options */
      styles: {
        configFile: fileURLToPath(
          new URL('vuetify-settings.scss', import.meta.url),
        ),
      },
    },
  },
})
