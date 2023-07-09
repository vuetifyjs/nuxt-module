import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
import type { VuetifyOptions } from 'vuetify'
import { useNuxtApp } from '#app'

export function configureDate(vuetifyOptions: VuetifyOptions) {
  if (adapter === 'custom')
    return

  const dateOptions = dateConfiguration()

  if (i18n) {
    const locales = useNuxtApp().$i18n.locales.value
    if (locales) {
      dateOptions.locale = locales.reduce((acc, locale) => {
        acc[locale.code] = locale.code
        return acc
      }, {})
    }
  }

  vuetifyOptions.date = dateOptions
}
