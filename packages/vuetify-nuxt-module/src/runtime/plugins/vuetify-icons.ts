import { defineNuxtPlugin } from '#imports'
import { configureIcons } from './icons'

export default defineNuxtPlugin({
  name: 'vuetify:icons:plugin',
  order: -25,
  parallel: true,
  setup (nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureIcons(vuetifyOptions)
    })
  },
})
