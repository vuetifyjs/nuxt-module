import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
import { configureLocales } from './date'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    if (adapter === 'custom')
      return

    const options = dateConfiguration()
    if (i18n)
      configureLocales(nuxtApp, options)

    vuetifyOptions.date = options
  })
})
