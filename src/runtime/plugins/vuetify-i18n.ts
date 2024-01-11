import { createAdapter } from './i18n'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:i18n:plugin',
  // @ts-expect-error i18n plugin missing on build time
  dependsOn: ['i18n:plugin'],
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      createAdapter(vuetifyOptions)
    })
  },
})
