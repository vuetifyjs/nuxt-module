import { fileURLToPath } from 'node:url'
import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  vuetify: {
    moduleOptions: {
      /* other module options */
      styles: {
        configFile: fileURLToPath(
          new URL('./vuetify-settings.scss', import.meta.url),
        ),
      },
    },
  },
})
