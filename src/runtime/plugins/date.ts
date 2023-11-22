import { adapter, dateConfiguration, enabled, i18n } from 'virtual:vuetify-date-configuration'
import type { VuetifyOptions } from 'vuetify'
import { useNuxtApp } from '#imports'

export function configureDate(vuetifyOptions: VuetifyOptions) {
  if (adapter === 'custom' || !enabled)
    return

  const dateOptions = dateConfiguration()

  if (i18n) {
    const locales: import('#i18n').LocaleObject[] | undefined = useNuxtApp().$i18n.locales.value
    if (locales) {
      dateOptions.locale = locales.reduce((acc, locale) => {
        acc[locale.code] = locale.code
        return acc
      }, <Record<string, any>>{})
    }
  }

  vuetifyOptions.date = dateOptions
}
