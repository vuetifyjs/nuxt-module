import { createAdapter } from './i18n'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', async (_isDev, vuetifyOptions) => {
    vuetifyOptions.locale = vuetifyOptions.locale ?? {}
    vuetifyOptions.locale.adapter = await createAdapter(nuxtApp)
    // vuetifyOptions.locale.adapter = await import('./i18n').then(({ createAdapter }) => createAdapter(nuxtApp))
  })
})
