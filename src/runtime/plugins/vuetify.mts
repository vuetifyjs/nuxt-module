import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  parallel: false,
  async setup() {
    const vuetify = await configureVuetify()

    return {
      provide: {
        vuetify,
      },
    }
  },
})
