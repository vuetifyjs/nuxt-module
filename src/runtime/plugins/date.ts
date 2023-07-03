import { camelize } from '../../utils'
import type { DateOptions } from '../../types'
import type { NuxtApp } from '#app'

export function configureLocales(nuxtApp: NuxtApp, options: DateOptions) {
  const locales = nuxtApp.$i18n?.locales.value
  if (locales) {
    options.locale = locales.reduce((acc, locale) => {
      acc[camelize(locale.code)] = locale.code
      return acc
    }, {} as DateOptions['locale'])
  }

  return options
}
