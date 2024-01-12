import { configureDate } from './date'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:date-i18n:plugin',
  order: -25,
  // @ts-expect-error i18n plugin missing on build time
  dependsOn: ['i18n:plugin'],
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureDate(vuetifyOptions)
    })
  },
})
