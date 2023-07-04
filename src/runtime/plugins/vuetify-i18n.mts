import { createAdapter } from './i18n'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    vuetifyOptions.locale = vuetifyOptions.locale ?? {}
    vuetifyOptions.locale.adapter = createAdapter(nuxtApp)
  })
})
