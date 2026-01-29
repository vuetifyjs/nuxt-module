import { configureDate } from './date'
import { defineNuxtPlugin } from '#imports'
import type { ObjectPlugin } from '#app'

const plugin: ObjectPlugin<{}> = defineNuxtPlugin({
  name: 'vuetify:date:plugin',
  order: -25,
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureDate(vuetifyOptions)
    })
  },
})

export default plugin