import { availableLocales, datetimeFormats, numberFormats, pluralRules } from './i18n'

export default {
  legacy: false,
  availableLocales: availableLocales.map(l => l.code),
  fallbackLocale: 'en-US',
  fallbackWarn: true,
  pluralRules,
  datetimeFormats,
  numberFormats,
  globalInjection: true,
  missingWarn: true,
}
