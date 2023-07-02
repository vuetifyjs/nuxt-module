import { availableLocales } from './i18n'

export default defineI18nConfig(() => ({
  locale: 'en-US',
  availableLocales: availableLocales.map(l => l.code),
  fallbackLocale: 'en-US',
  fallbackWarn: false,
  missingWarn: false,
  globalInjection: true,
}))
