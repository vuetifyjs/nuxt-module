import { configureIcons } from './icons'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:icons:plugin',
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureIcons(vuetifyOptions)
    })
  },
})
