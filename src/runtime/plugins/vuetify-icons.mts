import { configureIcons } from 'virtual:vuetify-icons-configuration'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    configureIcons(vuetifyOptions)
  })
})
