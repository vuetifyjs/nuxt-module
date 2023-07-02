import { availableLocales } from './i18n'

export default defineI18nConfig(() => {
  return {
    availableLocales: availableLocales.map(l => l.code),
    fallbackLocale: 'en-US',
    fallbackWarn: false,
    // eslint-disable-next-line @typescript-eslint/comma-dangle
    missingWarn: false
  }
})
