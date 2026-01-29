import { configureDate } from './date'
import { defineNuxtPlugin } from '#imports'
import type { ObjectPlugin } from '#app'

const plugin: ObjectPlugin<{}> = defineNuxtPlugin({
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

export default plugin