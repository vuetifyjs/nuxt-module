import { availableLocales } from './i18n'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    availableLocales: availableLocales.map(l => l.code),
    fallbackLocale: 'en-US',
    fallbackWarn: true,
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    missingWarn: true
  }
})
