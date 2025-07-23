import { configureIcons } from './icons'
import { defineNuxtPlugin } from '#imports'
import type { ObjectPlugin } from '#app'

const plugin: ObjectPlugin<{}> = defineNuxtPlugin({
  name: 'vuetify:icons:plugin',
  order: -25,
  parallel: true,
  setup(nuxtApp) {
    nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
      configureIcons(vuetifyOptions)
    })
  },
})

export default plugin