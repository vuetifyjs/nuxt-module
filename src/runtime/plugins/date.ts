import type { DateOptions } from '../../types'
import type { NuxtApp } from '#app'

export function configureLocales(nuxtApp: NuxtApp, options: DateOptions) {
  const locales = nuxtApp.$i18n?.locales.value
  if (locales) {
    options.locale = locales.reduce((acc: DateOptions['locale'], locale: any) => {
      acc[locale.code] = locale.code
      return acc
    }, {})
  }

  return options
}
