import { configureIcons } from './icons'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    configureIcons(vuetifyOptions)
  })
})
