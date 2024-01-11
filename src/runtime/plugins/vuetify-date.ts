import { configureDate } from './date'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:date:plugin',
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureDate(vuetifyOptions)
    })
  },
})
