import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  parallel: false,
  async setup() {
    if (process.server) {
      const vuetify = await configureVuetify()

      return {
        provide: {
          vuetify,
        },
      }
    }

    useNuxtApp().hook('app:beforeMount', configureVuetify)
  },
})
